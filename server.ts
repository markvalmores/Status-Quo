import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Parse command line arguments for port and host
const args = process.argv.slice(2);
let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
let host = process.env.HOST || '0.0.0.0';

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--port=')) {
    port = parseInt(args[i].split('=')[1], 10);
  } else if (args[i] === '--port' && args[i + 1]) {
    port = parseInt(args[i + 1], 10);
  }
  if (args[i].startsWith('--host=')) {
    host = args[i].split('=')[1];
  } else if (args[i] === '--host' && args[i + 1]) {
    host = args[i + 1];
  }
}

// Initialize Google GenAI client if API key exists
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGemini: !!ai,
    timestamp: new Date().toISOString()
  });
});

// API: Generate character post (image, status, or poll) using Gemini 3.8-flash
app.post('/api/ai/generate-post', async (req, res) => {
  const { profileName, profileKind, profileSubtitle, postType, topic } = req.body;

  if (!ai) {
    return res.status(503).json({ error: 'Gemini API not configured' });
  }

  try {
    const isAnimeOrWaifu = profileKind === 'anime' || profileKind === 'waifu';
    const styleGuide = isAnimeOrWaifu
      ? 'Japanese anime and manga visual aesthetic, Studio MAPPA/Kyoto Animation high-detail style'
      : 'Photorealistic, cinematic Hollywood movie 35mm film still or real-life photography';

    let prompt = '';
    if (postType === 'image') {
      prompt = `You are writing a social media post for ${profileName} (${profileSubtitle || profileKind}).
Topic/Vibe: ${topic || 'Current activity, thoughts, or exciting moment'}.
The character MUST post an image along with a 1-2 sentence caption.
Generate a valid JSON object with the following fields:
- "content": A witty, authentic in-character caption (1-2 sentences)
- "feeling": A 1-word emotional state (e.g. hyped, thoughtful, playful, unstoppable, chaotic, grateful)
- "imagePrompt": A highly detailed visual prompt describing the scene for an image generator. Describe what ${profileName} looks like, their attire, background setting, lighting, action, and style (${styleGuide}). Make it vivid and specific.
Do NOT use markdown code blocks, just raw JSON.`;
    } else if (postType === 'poll') {
      prompt = `You are writing an interactive community poll post for ${profileName} (${profileSubtitle || profileKind}).
Topic/Vibe: ${topic || 'An engaging question for fans and followers'}.
Generate a valid JSON object with the following fields:
- "content": A 1-sentence intro to the poll in character
- "question": An engaging poll question related to their world/lore
- "options": An array of 3 to 4 distinct poll options (strings)
Do NOT use markdown code blocks, just raw JSON.`;
    } else {
      // status post
      prompt = `You are writing a short text status update for ${profileName} (${profileSubtitle || profileKind}).
Topic/Vibe: ${topic || 'Day in the life, hot take, or reflection'}.
Generate a valid JSON object with the following fields:
- "content": A witty, engaging, authentic in-character text status update (1-3 sentences)
- "feeling": A 1-word emotional state
Do NOT use markdown code blocks, just raw JSON.`;
    }

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      responseText = response.text || '';
    } catch (apiErr: any) {
      console.warn('Gemini temporary spike, using character generator fallback:', apiErr?.message);
    }

    if (responseText) {
      try {
        let cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        return res.json({ success: true, data: parsed });
      } catch (parseErr) {
        console.warn('Parse issue, generating fallback post');
      }
    }

    // High quality procedural character fallback if Gemini is temporarily unavailable
    if (postType === 'poll') {
      return res.json({
        success: true,
        data: {
          content: `${profileName} wants to know what you think:`,
          question: `What should ${profileName} do next?`,
          options: ["Drop an exclusive project update", "Live community Q&A", "Secret collaboration reveal"]
        }
      });
    } else if (postType === 'image') {
      return res.json({
        success: true,
        data: {
          content: `Exciting updates from ${profileName}! Capturing this moment for everyone on the timeline.`,
          feeling: 'inspired',
          imagePrompt: `${profileName} in a dramatic cinematic setting, ${styleGuide}`
        }
      });
    } else {
      return res.json({
        success: true,
        data: {
          content: `Reflecting on today's momentum. Grateful for everyone keeping the positive energy alive here!`,
          feeling: 'thoughtful'
        }
      });
    }
  } catch (error: any) {
    console.error('Server post generation error:', error?.message);
    res.status(500).json({ error: error?.message || 'Failed to generate post' });
  }
});

// API: Craft contextual AI image prompt from post content using Gemini
app.post('/api/ai/craft-image-prompt', async (req, res) => {
  const { authorName, kind, content } = req.body;

  if (!ai) {
    return res.status(503).json({ error: 'Gemini API not configured' });
  }

  try {
    const isAnimeOrWaifu = kind === 'anime' || kind === 'waifu';
    const styleGuide = isAnimeOrWaifu
      ? 'vibrant anime key visual, studio quality anime art style, dynamic lighting'
      : 'cinematic 35mm film still, photorealistic, natural lighting, 8k resolution';

    const prompt = `Based on the following social media post by "${authorName}" (${kind}):
"${content}"

Write a detailed 1-2 sentence visual prompt for an AI image generator depicting what the author is describing or doing in the post.
Style requirement: ${styleGuide}.
Return ONLY the prompt string, no quotes, no extra text.`;

    let visualPrompt = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      visualPrompt = (response.text || '').trim();
    } catch (apiErr: any) {
      console.warn('Gemini temporary spike for image prompt:', apiErr?.message);
    }

    if (!visualPrompt) {
      visualPrompt = `${authorName} in an authentic setting representing "${content.slice(0, 80)}", ${styleGuide}`;
    }

    res.json({ success: true, prompt: visualPrompt });
  } catch (error: any) {
    console.error('Gemini image prompt craft error:', error?.message);
    res.status(500).json({ error: error?.message || 'Failed to craft prompt' });
  }
});

// Setup Vite development middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/ (dev mode: ${process.env.NODE_ENV !== 'production'})`);
  });
}

startServer();
