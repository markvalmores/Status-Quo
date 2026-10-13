import React, { useState } from 'react';
import {
  Image,
  Video,
  Smile,
  Zap,
  Sparkles,
  X,
  Upload,
  AlertCircle,
  BarChart2,
  Plus,
  Trash2,
  RefreshCw,
  Wand2,
  Film
} from 'lucide-react';
import { PollData, UserProfile } from '../types';
import { generateAiImageForPost, generateGeminiOrContextualAiImage } from '../services/imageService';

interface CreatePostModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (data: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    feeling?: string;
    tags?: string[];
    poll?: PollData;
  }) => void;
  onOpenSubscription: () => void;
}

const FEELING_OPTIONS = [
  '⚡ unstoppable',
  '😎 confident',
  '🚀 building an empire',
  '🎬 movie star aura',
  '☕ caffeinated',
  '💪 grinding at the gym',
  '🔥 feeling famous',
  '✨ blessed & grateful'
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSubmitPost,
  onOpenSubscription
}) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showFeelings, setShowFeelings] = useState(false);
  const [mediaTab, setMediaTab] = useState<'image' | 'video' | 'ai'>('ai');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  // Poll state
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  if (!isOpen) return null;

  const hasUnlimitedEnergy = currentUser.isAdmin || currentUser.isVipSubscriber;
  const canPost = hasUnlimitedEnergy || currentUser.energy >= 1;

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleGenerateAiImage = async () => {
    setIsGeneratingAi(true);
    const textToUse = aiCustomPrompt.trim() || content.trim() || "A glamorous celebration in the city lights";
    const freshSeed = Date.now() + Math.floor(Math.random() * 999999);

    try {
      const res = await generateGeminiOrContextualAiImage(
        currentUser.name,
        'normal_user',
        textToUse,
        selectedFeeling,
        freshSeed
      );
      setMediaUrl(res.url);
      setMediaType('image');
      setShowMediaInput(false);
    } catch {
      const fallbackUrl = generateAiImageForPost(
        currentUser.name,
        'normal_user',
        textToUse,
        selectedFeeling,
        freshSeed
      );
      setMediaUrl(fallbackUrl);
      setMediaType('image');
      setShowMediaInput(false);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!canPost) {
      onOpenSubscription();
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    let pollData: PollData | undefined = undefined;
    if (showPollCreator && pollQuestion.trim()) {
      const validOptions = pollOptions.filter(o => o.trim().length > 0);
      if (validOptions.length >= 2) {
        pollData = {
          question: pollQuestion.trim(),
          options: validOptions.map((text, i) => ({
            id: `opt_${Date.now()}_${i}`,
            text,
            votes: Math.floor(Math.random() * 25) + 5
          })),
          totalVotes: 0
        };
        pollData.totalVotes = pollData.options.reduce((a, b) => a + b.votes, 0);
      }
    }

    onSubmitPost({
      content: content.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      mediaType,
      feeling: selectedFeeling || undefined,
      tags: tags.length > 0 ? tags : undefined,
      poll: pollData
    });

    setContent('');
    setMediaUrl('');
    setSelectedFeeling('');
    setTagInput('');
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowMediaInput(false);
    setAiCustomPrompt('');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.includes('video') || file.name.endsWith('.mp4');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaUrl(event.target.result as string);
        setShowMediaInput(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#130d24] border border-[#3b276b] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#291b4a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-yellow-400">Create New Status</span>
            {hasUnlimitedEnergy ? (
              <span className="text-[11px] font-semibold text-yellow-300 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Unlimited Energy
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-yellow-400" /> Cost: 1 Energy (You have {currentUser.energy})
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#251747] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Energy Warning if empty */}
        {!canPost && (
          <div className="p-3 bg-red-950/40 border-b border-red-500/40 px-5 flex items-center justify-between text-xs text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>You have 0 Energy! Subscribe to VIP Pass for unlimited posts or claim daily refill.</span>
            </div>
            <button
              onClick={onOpenSubscription}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1 rounded-lg transition"
            >
              Get VIP
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* User info bar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-yellow-400 bg-purple-950">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                {currentUser.isVerified && (
                  <span className="text-yellow-400 font-bold text-xs">✓</span>
                )}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono">
                  Real Member
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Post to Status Quo timeline & trigger instant celebrity, hero & anime reactions!
              </div>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            placeholder={`What's on your mind, ${currentUser.name}? Share your thoughts and generate matching AI images, or post authentic video!`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full bg-[#1b1233] border border-[#3b276b] rounded-xl p-3.5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 text-sm leading-relaxed resize-none"
            autoFocus
          />

          {/* Feeling tag badge */}
          {selectedFeeling && (
            <div className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-lg inline-flex">
              <span>Feeling: {selectedFeeling}</span>
              <button
                type="button"
                onClick={() => setSelectedFeeling('')}
                className="text-zinc-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          {/* Poll Creator Component */}
          {showPollCreator && (
            <div className="bg-[#18102d] border border-yellow-400/40 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-yellow-300">
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-yellow-400" />
                  <span>Create Interactive Poll</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPollCreator(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel Poll
                </button>
              </div>

              <input
                type="text"
                placeholder="Ask a question (e.g. 'Who is the best Avenger?')..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-[#120a22] border border-[#3b276b] rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
              />

              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}...`}
                      value={opt}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      className="flex-1 bg-[#120a22] border border-[#3b276b] rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-yellow-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              )}
            </div>
          )}

          {/* Media preview */}
          {mediaUrl && (
            <div className="relative rounded-xl overflow-hidden border border-[#402a70] bg-black/60 max-h-64 flex flex-col items-center justify-center">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                {mediaType === 'image' && (
                  <button
                    type="button"
                    onClick={handleGenerateAiImage}
                    title="Generate all-new AI image variant"
                    className="bg-purple-900/90 hover:bg-purple-800 text-yellow-300 text-xs px-2.5 py-1 rounded-full border border-purple-500/50 flex items-center gap-1 cursor-pointer transition shadow"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate AI</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="bg-black/80 hover:bg-black text-white p-1 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {mediaType === 'video' ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full bg-emerald-950/80 border-b border-emerald-500/30 px-3 py-1 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active Real Member Video Post (Exclusive Feature)</span>
                  </div>
                  <video src={mediaUrl} controls autoPlay loop muted className="max-h-56 object-contain w-full" />
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full bg-purple-950/80 border-b border-purple-500/30 px-3 py-1 text-[11px] text-yellow-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>AI Generated Visual · Contextual to Post</span>
                  </div>
                  <img src={mediaUrl} alt="Preview" className="max-h-56 w-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* Media input toggle */}
          {showMediaInput && !mediaUrl && (
            <div className="space-y-3 bg-[#18102d] border border-[#382463] rounded-xl p-3.5">
              {/* Media Mode Tabs */}
              <div className="flex border-b border-[#291b4a] pb-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMediaTab('ai')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    mediaTab === 'ai'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-yellow-400" />
                  <span>AI Image Generator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('video')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    mediaTab === 'video'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Real Member Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('image')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    mediaTab === 'image'
                      ? 'bg-[#2b1c4e] text-yellow-300'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Image className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Photo / URL</span>
                </button>
              </div>

              {/* Tab 1: AI Image Generator */}
              {mediaTab === 'ai' && (
                <div className="space-y-2.5">
                  <div className="text-xs text-zinc-300">
                    Generate a fresh, brand-new AI image directly related to what your post is talking about:
                  </div>
                  <input
                    type="text"
                    placeholder={content.trim() ? `Using post text: "${content.slice(0, 45)}..."` : "Enter specific visual prompt or leave empty to use post content..."}
                    value={aiCustomPrompt}
                    onChange={(e) => setAiCustomPrompt(e.target.value)}
                    className="w-full bg-[#120a22] border border-[#382463] rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] text-zinc-400">
                      ⚡ Non-repeating, all-new visuals on every generate
                    </span>
                    <button
                      type="button"
                      disabled={isGeneratingAi}
                      onClick={handleGenerateAiImage}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition shadow-lg shadow-purple-900/50"
                    >
                      {isGeneratingAi ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating AI Image...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Generate AI Visual</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Real Member Video (Exclusive) */}
              {mediaTab === 'video' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 flex items-start gap-2">
                    <Film className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300">Exclusive Real Member Privileges:</strong> Real active people like you can post authentic, accurate video footage (MP4). AI bots and personas are restricted to images and text only.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste direct MP4 video URL..."
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        setMediaType('video');
                      }}
                      className="flex-1 bg-[#120a22] border border-[#382463] rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                    />
                    <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload MP4</span>
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 3: Standard Photo Upload / URL */}
              {mediaTab === 'image' && (
                <div className="space-y-2">
                  <div className="text-xs text-zinc-300">Attach direct image or upload photo:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste direct Image URL..."
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        setMediaType('image');
                      }}
                      className="flex-1 bg-[#120a22] border border-[#382463] rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                    />
                    <label className="bg-[#2a1b4d] hover:bg-[#382566] text-yellow-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feelings selector */}
          {showFeelings && (
            <div className="bg-[#18102d] border border-[#382463] rounded-xl p-3 space-y-2">
              <div className="text-xs font-semibold text-zinc-300">How are you feeling?</div>
              <div className="flex flex-wrap gap-1.5">
                {FEELING_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setSelectedFeeling(f);
                      setShowFeelings(false);
                    }}
                    className="text-xs bg-[#22153f] hover:bg-[#321f5e] border border-[#3f276e] text-zinc-200 px-2.5 py-1 rounded-lg transition"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons bar */}
          <div className="border-t border-[#291b4a] pt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMediaInput(true);
                  setMediaTab('ai');
                }}
                className="p-2 rounded-xl text-purple-300 bg-purple-900/30 border border-purple-500/40 hover:bg-purple-900/60 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Generate AI Image related to your post"
              >
                <Wand2 className="w-4 h-4 text-yellow-400" />
                <span className="hidden sm:inline">AI Image Gen</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMediaInput(true);
                  setMediaTab('video');
                }}
                className="p-2 rounded-xl text-emerald-300 bg-emerald-950/30 border border-emerald-500/40 hover:bg-emerald-950/60 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Post Real Member Video"
              >
                <Video className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Member Video</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFeelings(!showFeelings)}
                className="p-2 rounded-xl text-yellow-300 hover:bg-[#251747] transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Add feeling or activity"
              >
                <Smile className="w-4 h-4" />
                <span className="hidden sm:inline">Feeling</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPollCreator(!showPollCreator)}
                className="p-2 rounded-xl text-yellow-300 hover:bg-[#251747] transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Add interactive poll"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Poll</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || !canPost}
              className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Publish Status</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
