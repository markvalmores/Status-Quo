import { BibleVerse } from '../types';

export const BACKUP_VERSES: BibleVerse[] = [
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    version: "WEB"
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the thoughts that I think toward you, says the Lord, thoughts of peace, and not of evil, to give you hope and a future.",
    version: "WEB"
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.",
    version: "WEB"
  },
  {
    reference: "Joshua 1:9",
    text: "Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for the Lord your God is with you wherever you go.",
    version: "WEB"
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not lack.",
    version: "WEB"
  },
  {
    reference: "Romans 8:28",
    text: "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
    version: "WEB"
  },
  {
    reference: "Matthew 6:33",
    text: "But seek first God’s Kingdom and his righteousness; and all these things will be given to you as well.",
    version: "WEB"
  },
  {
    reference: "Isaiah 40:31",
    text: "Those who wait for the Lord will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.",
    version: "WEB"
  }
];

export const ANIME_BANNER_PRESETS = [
  "https://static.tvmaze.com/uploads/images/original_untouched/436/1091415.jpg", // Dragon Ball
  "https://static.tvmaze.com/uploads/images/original_untouched/3/9744.jpg",       // Naruto
  "https://static.tvmaze.com/uploads/images/original_untouched/617/1543011.jpg",  // One Piece
  "https://static.tvmaze.com/uploads/images/original_untouched/608/1521905.jpg",  // Jujutsu Kaisen
  "https://static.tvmaze.com/uploads/images/original_untouched/49/122624.jpg",    // Re:Zero
  "https://static.tvmaze.com/uploads/images/original_untouched/590/1477119.jpg",  // Spy x Family
  "https://static.tvmaze.com/uploads/images/original_untouched/422/1056726.jpg",  // Chainsaw Man
  "https://static.tvmaze.com/uploads/images/original_untouched/508/1271784.jpg"   // My Dress-Up Darling
];

export const ANIME_AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/personas/svg?seed=AnimeStar1",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=AnimeStar2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=AnimeStar3",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=AnimeStar4",
  "https://api.dicebear.com/7.x/personas/svg?seed=AnimeStar5"
];

export const VIDEO_MEDIA_PRESETS = {
  banner: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  avatar: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
};

/**
 * Fetch fresh daily Bible verse from real API (bible-api.com)
 */
export async function fetchDailyBibleVerse(): Promise<BibleVerse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://bible-api.com/?random=verse', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.text && data.reference) {
        return {
          reference: data.reference,
          text: data.text.trim().replace(/\n+/g, ' '),
          version: data.translation_name || 'WEB'
        };
      }
    }
  } catch {}

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return BACKUP_VERSES[dayOfYear % BACKUP_VERSES.length];
}

/**
 * Fetch Anime artwork banner from Jikan Anime API / TVMaze Anime Media
 */
export async function fetchAnimeBanner(): Promise<string> {
  try {
    const res = await fetch('https://api.jikan.moe/v4/random/anime');
    if (res.ok) {
      const data = await res.json();
      const largeImage = data?.data?.images?.webp?.large_image_url || data?.data?.images?.jpg?.large_image_url;
      if (largeImage) {
        return largeImage;
      }
    }
  } catch {}

  const randomIndex = Math.floor(Math.random() * ANIME_BANNER_PRESETS.length);
  return ANIME_BANNER_PRESETS[randomIndex];
}

/**
 * Fetch fresh waifu image from real Waifu API (api.waifu.pics)
 */
export async function fetchWaifuImage(): Promise<string> {
  try {
    const res = await fetch('https://api.waifu.pics/sfw/waifu');
    if (res.ok) {
      const data = await res.json();
      if (data?.url) return data.url;
    }
  } catch {}

  return "https://upload.wikimedia.org/wikipedia/en/2/23/Rem_animepromo.png";
}

/**
 * Fetch anime character visual from real Jikan API
 */
export async function fetchAnimeCharacterFromJikan(query: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      const img = data?.data?.[0]?.images?.webp?.image_url || data?.data?.[0]?.images?.jpg?.image_url;
      if (img) return img;
    }
  } catch {}
  return null;
}
