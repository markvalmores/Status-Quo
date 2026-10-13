import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Film,
  Sparkles,
  Heart,
  Smile,
  Flame,
  Award,
  X,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  Maximize2,
  Video,
  Image as ImageIcon,
  MessageCircle,
  Share2,
  ArrowBigUp,
  ArrowBigDown,
  BarChart2
} from 'lucide-react';
import { ALL_PROFILES } from '../data/celebrities';
import { searchGoogleImages } from '../services/imageService';
import { resolveProfileVisualsViaApi } from '../services/characterApiService';
import { generatePostsForSpecificProfile, fetchOrGenerateAiPost } from '../services/aiGenerator';
import { SafeImage } from './SafeImage';
import { Post, RelationshipGoal, UserProfile } from '../types';

interface CelebrityProfileModalProps {
  profileId: string | null;
  currentUser: UserProfile;
  onClose: () => void;
  relationshipGoal?: RelationshipGoal;
  onViewPost?: (post: Post) => void;
  onPollVote?: (postId: string, optionId: string) => void;
  onAddPost?: (post: Post) => void;
}

export const CelebrityProfileModal: React.FC<CelebrityProfileModalProps> = ({
  profileId,
  currentUser,
  onClose,
  relationshipGoal,
  onViewPost,
  onPollVote,
  onAddPost
}) => {
  const [activeCover, setActiveCover] = useState<string | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null);
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [showFullPicturePreview, setShowFullPicturePreview] = useState<'avatar' | 'cover' | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'about'>('timeline');
  const [postCategoryFilter, setPostCategoryFilter] = useState<'all' | 'image' | 'status' | 'poll'>('all');
  const [isGeneratingAiPost, setIsGeneratingAiPost] = useState(false);
  const [generatingType, setGeneratingType] = useState<'image' | 'status' | 'poll' | null>(null);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);

  const profile = ALL_PROFILES.find((p) => p.id === profileId);

  useEffect(() => {
    if (profileId) {
      setActiveAvatar(null);
      setActiveCover(null);
      setProfilePosts(generatePostsForSpecificProfile(profileId, 16, 0));

      const targetProfile = ALL_PROFILES.find((p) => p.id === profileId);
      if (targetProfile && targetProfile.kind === 'waifu') {
        resolveProfileVisualsViaApi(targetProfile.name, 'waifu', targetProfile.id, true)
          .then((visuals) => {
            if (visuals?.avatar) setActiveAvatar(visuals.avatar);
            if (visuals?.cover) setActiveCover(visuals.cover);
          })
          .catch(() => {});
      }
    }
  }, [profileId]);

  if (!profileId || !profile) return null;

  const currentCover = activeCover || profile.coverImage;
  const currentAvatar = activeAvatar || profile.avatar;

  const handleFetchNewGoogleImages = async () => {
    setIsSearchingGoogle(true);
    try {
      // 1. Fetch live visuals directly via dedicated Character, Anime & Waifu APIs
      const apiResult = await resolveProfileVisualsViaApi(profile.name, profile.kind, profile.id, true);
      if (apiResult && apiResult.avatar) {
        setActiveAvatar(apiResult.avatar);
        if (apiResult.cover) setActiveCover(apiResult.cover);
        return;
      }

      // 2. Query search fallback
      const query = profile.kind === 'celebrity'
        ? `${profile.name} actor high resolution portrait`
        : profile.kind === 'anime'
        ? `${profile.name} anime character artwork`
        : profile.kind === 'waifu'
        ? `${profile.name} anime heroine artwork`
        : `${profile.name} official artwork portrait`;
      const images = await searchGoogleImages(query);
      if (images.length >= 2) {
        setActiveAvatar(images[0]);
        setActiveCover(images[1]);
      } else if (images.length === 1) {
        setActiveAvatar(images[0]);
      }
    } finally {
      setIsSearchingGoogle(false);
    }
  };

  const handleLoadMoreProfilePosts = () => {
    if (isLoadingMorePosts || !profileId) return;
    setIsLoadingMorePosts(true);
    const more = generatePostsForSpecificProfile(profileId, 10, profilePosts.length);
    setProfilePosts((prev) => [...prev, ...more]);
    setTimeout(() => setIsLoadingMorePosts(false), 200);
  };

  const handleCreateAiPost = async (type: 'image' | 'status' | 'poll') => {
    if (!profileId || isGeneratingAiPost) return;
    setIsGeneratingAiPost(true);
    setGeneratingType(type);
    try {
      const newPost = await fetchOrGenerateAiPost(profileId, type);
      setProfilePosts((prev) => [newPost, ...prev]);
      if (onAddPost) {
        onAddPost(newPost);
      }
    } finally {
      setIsGeneratingAiPost(false);
      setGeneratingType(null);
    }
  };

  const handleInternalPollVote = (postId: string, optionId: string) => {
    setProfilePosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll) {
          if (p.poll.userVotedOptionId === optionId) return p;
          let totalVotes = p.poll.totalVotes;
          const options = p.poll.options.map((opt) => {
            if (opt.id === p.poll?.userVotedOptionId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          if (!p.poll.userVotedOptionId) totalVotes += 1;
          return {
            ...p,
            poll: {
              ...p.poll,
              options,
              totalVotes,
              userVotedOptionId: optionId
            }
          };
        }
        return p;
      })
    );
    if (onPollVote) {
      onPollVote(postId, optionId);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
        <div className="bg-[#120c22] border border-[#3e276b] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
          
          {/* TOP COVER BANNER (Full 16:9 widescreen presentation) */}
          <div className="relative h-48 sm:h-56 bg-black/80 overflow-hidden flex-shrink-0 group">
            <SafeImage
              src={currentCover}
              alt={profile.name}
              fallbackType="cover"
              authorName={profile.name}
              kind={profile.kind}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120c22] via-[#120c22]/30 to-black/50" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition z-20 cursor-pointer shadow-lg"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Click to view full banner cover */}
            <button
              onClick={() => setShowFullPicturePreview('cover')}
              className="absolute top-3 right-14 bg-black/70 hover:bg-black text-zinc-200 text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition z-20 cursor-pointer"
              title="View full cover photo"
            >
              <Maximize2 className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Full Cover</span>
            </button>

            {/* Category and API attribution */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-purple-500/40 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-yellow-300 z-10">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {profile.kind === 'celebrity' && '🎬 Celebrity Official (TVMaze API)'}
                {profile.kind === 'character' && '🦸 Movie Character (Stills & Wikipedia)'}
                {profile.kind === 'anime' && '⛩️ Anime Icon (Jikan Anime API)'}
                {profile.kind === 'waifu' && '🌸 Waifu Profile (Waifu.pics & Nekos.best API)'}
                {profile.kind === 'normal_user' && '👤 Verified Member'}
              </span>
            </div>

            {/* Refresh from Google Images / Wikimedia */}
            <button
              onClick={handleFetchNewGoogleImages}
              disabled={isSearchingGoogle}
              className="absolute bottom-3 right-3 bg-purple-950/90 hover:bg-purple-900 border border-purple-500/50 text-yellow-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm transition cursor-pointer z-10 shadow-lg"
              title="Fetch directly from real Movie, Anime, Waifu, or Celebrity Character APIs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearchingGoogle ? 'animate-spin' : ''}`} />
              <span>{isSearchingGoogle ? 'Fetching API...' : 'Live API Fetch'}</span>
            </button>
          </div>

          {/* MAIN PROFILE BODY */}
          <div
            onScroll={(e) => {
              const target = e.currentTarget;
              if (target.scrollHeight - target.scrollTop - target.clientHeight < 350) {
                handleLoadMoreProfilePosts();
              }
            }}
            className="px-5 sm:px-6 pb-6 pt-3 overflow-y-auto space-y-4 flex-1"
          >
            
            {/* FULL PROFILE PICTURE (Dedicated unclipped presentation) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#251845]">
              <div className="flex items-center gap-4">
                {/* Full, completely visible profile picture with zoom button */}
                <div
                  onClick={() => setShowFullPicturePreview('avatar')}
                  className="relative group cursor-pointer flex-shrink-0"
                  title="Click to view full high-res profile picture"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-yellow-400/90 overflow-hidden bg-purple-950 shadow-2xl relative">
                    <SafeImage
                      src={currentAvatar}
                      alt={profile.name}
                      fallbackType="avatar"
                      authorName={profile.name}
                      kind={profile.kind}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Maximize2 className="w-6 h-6 text-yellow-400 drop-shadow" />
                    </div>
                  </div>

                  {profile.verifiedBadge && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-1 border-2 border-[#120c22] shadow">
                      <CheckCircle2 className="w-4 h-4 fill-yellow-400 text-black" />
                    </div>
                  )}
                </div>

                {/* Name, Subtitle & Badge */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-black text-xl sm:text-2xl text-zinc-100">
                      {profile.name}
                    </h2>
                    <span className="text-lg">{profile.badgeIcon}</span>
                    <span className="text-[11px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full font-bold">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-yellow-400/90 font-medium mt-0.5">
                    {profile.subtitle}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                    <span>Personality: {profile.personality}</span>
                  </p>
                </div>
              </div>

              {/* View Full Picture Shortcut Button */}
              <button
                onClick={() => setShowFullPicturePreview('avatar')}
                className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-[#1d1238] border border-[#3c256e] hover:border-yellow-400/60 text-xs text-zinc-200 hover:text-yellow-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-yellow-400" />
                <span>View Full Picture</span>
              </button>
            </div>

            {/* Bio description */}
            <div className="bg-[#180f2d] border border-[#311f56] rounded-2xl p-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>{profile.bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-800/50 text-purple-300 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Relationship Goals Progress (if tracked) */}
            {relationshipGoal && (
              <div className="bg-gradient-to-r from-purple-900/30 via-[#180f2d] to-yellow-900/20 border border-yellow-400/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-yellow-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span>Your Relationship Goals with {profile.name}</span>
                  </span>
                  <span>
                    {relationshipGoal.badgeUnlocked ? '🏆 Badge Earned' : 'In Progress'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="bg-[#120a22] p-2 rounded-xl border border-purple-800/40">
                    <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                      <Smile className="w-3 h-3 text-yellow-400" /> Humor
                    </div>
                    <div className="text-sm font-black text-yellow-400">{relationshipGoal.humor.toFixed(1)}%</div>
                  </div>
                  <div className="bg-[#120a22] p-2 rounded-xl border border-purple-800/40">
                    <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Aura
                    </div>
                    <div className="text-sm font-black text-amber-400">{relationshipGoal.aura.toFixed(1)}%</div>
                  </div>
                  <div className="bg-[#120a22] p-2 rounded-xl border border-purple-800/40">
                    <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" /> Fondness
                    </div>
                    <div className="text-sm font-black text-rose-400">{relationshipGoal.fondness.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB SELECTOR: Timeline vs About */}
            <div className="flex items-center gap-2 border-b border-[#251845] pb-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {profile.name}'s Posts ({profilePosts.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Signature Quotes & Style
              </button>
            </div>

            {/* TAB CONTENT: ENDLESS POSTS FEED BY THIS AI PERSONA */}
            {activeTab === 'timeline' && (
              <div className="space-y-4 pt-1">
                {/* 1. ON-DEMAND AI POST CREATION BAR */}
                <div className="bg-[#180f2d] border border-purple-500/30 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-yellow-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Generate Real-Time Post for {profile.name}</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Gemini & Contextual AI</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCreateAiPost('image')}
                      disabled={isGeneratingAiPost}
                      className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-yellow-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
                      title="Generate a brand-new AI image post matching what they talk about"
                    >
                      {isGeneratingAiPost && generatingType === 'image' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-yellow-400" />
                      )}
                      <span>✨ New AI Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateAiPost('status')}
                      disabled={isGeneratingAiPost}
                      className="p-2 rounded-xl bg-[#1d1238] hover:bg-[#281850] border border-[#3e2670] text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
                      title="Post a short in-character text status update"
                    >
                      {isGeneratingAiPost && generatingType === 'status' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                      ) : (
                        <Film className="w-3.5 h-3.5 text-yellow-400" />
                      )}
                      <span>💬 New Status</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateAiPost('poll')}
                      disabled={isGeneratingAiPost}
                      className="p-2 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
                      title="Launch an interactive character community poll"
                    >
                      {isGeneratingAiPost && generatingType === 'poll' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                      ) : (
                        <BarChart2 className="w-3.5 h-3.5 text-yellow-400" />
                      )}
                      <span>📊 Launch Poll</span>
                    </button>
                  </div>
                </div>

                {/* 2. CATEGORY FILTER PILLS */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setPostCategoryFilter('all')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer text-xs font-semibold whitespace-nowrap ${
                      postCategoryFilter === 'all'
                        ? 'bg-yellow-400 text-black shadow'
                        : 'bg-[#180f2d] border border-[#331f56] text-zinc-300 hover:text-white'
                    }`}
                  >
                    All ({profilePosts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategoryFilter('image')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${
                      postCategoryFilter === 'image'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#180f2d] border border-[#331f56] text-zinc-300 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3 text-yellow-400" />
                    AI Images ({profilePosts.filter(p => p.mediaType === 'image').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategoryFilter('status')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${
                      postCategoryFilter === 'status'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#180f2d] border border-[#331f56] text-zinc-300 hover:text-white'
                    }`}
                  >
                    Status Updates ({profilePosts.filter(p => !p.mediaUrl && !p.poll).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategoryFilter('poll')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${
                      postCategoryFilter === 'poll'
                        ? 'bg-yellow-400 text-black shadow'
                        : 'bg-[#180f2d] border border-[#331f56] text-zinc-300 hover:text-white'
                    }`}
                  >
                    <BarChart2 className="w-3 h-3 text-yellow-400" />
                    Character Polls ({profilePosts.filter(p => !!p.poll).length})
                  </button>
                </div>

                {/* 3. POSTS FEED */}
                {profilePosts
                  .filter((post) => {
                    if (postCategoryFilter === 'image') return post.mediaType === 'image';
                    if (postCategoryFilter === 'status') return !post.mediaUrl && !post.poll;
                    if (postCategoryFilter === 'poll') return !!post.poll;
                    return true;
                  })
                  .map((post) => (
                    <div
                      key={post.id}
                      className="bg-[#160f2b] border border-[#2e1d52] rounded-2xl p-4 space-y-3"
                    >
                      {/* Post Author Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-xs sm:text-sm text-zinc-100">{profile.name}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 fill-yellow-400 text-black" />
                            </div>
                            <span className="text-[10px] text-zinc-400">{post.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {post.feeling && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-700/40 text-indigo-300 font-mono">
                              feeling {post.feeling}
                            </span>
                          )}
                          {post.mediaType === 'image' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/40 text-yellow-300 flex items-center gap-1 font-mono">
                              <Sparkles className="w-3 h-3 text-yellow-400" />
                              <span>AI Visual</span>
                            </span>
                          )}
                          {post.poll && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 flex items-center gap-1 font-mono">
                              <BarChart2 className="w-3 h-3 text-yellow-400" />
                              <span>Poll</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Text Status Content */}
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Interactive Character Poll (if attached) */}
                      {post.poll && (
                        <div className="bg-[#120a22] border border-yellow-400/30 rounded-xl p-3 space-y-2">
                          <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs sm:text-sm">
                            <BarChart2 className="w-4 h-4 text-yellow-400" />
                            <span>Poll: {post.poll.question}</span>
                          </div>

                          <div className="space-y-1.5">
                            {post.poll.options.map((opt) => {
                              const percent = post.poll!.totalVotes > 0
                                ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                                : 0;
                              const isVoted = post.poll!.userVotedOptionId === opt.id;

                              return (
                                <button
                                  type="button"
                                  key={opt.id}
                                  onClick={() => handleInternalPollVote(post.id, opt.id)}
                                  className={`w-full p-2.5 rounded-xl border text-left relative overflow-hidden transition cursor-pointer ${
                                    isVoted
                                      ? 'border-yellow-400 bg-yellow-400/10'
                                      : 'border-[#382463] bg-[#18102d] hover:border-yellow-400/50'
                                  }`}
                                >
                                  <div
                                    className="absolute inset-y-0 left-0 bg-yellow-400/15 transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                  />
                                  <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                                    <span className="text-zinc-100 flex items-center gap-1.5">
                                      {isVoted && <span className="text-yellow-400 font-bold">✓</span>}
                                      {opt.text}
                                    </span>
                                    <span className="font-mono text-yellow-300">
                                      {percent}% ({opt.votes.toLocaleString()})
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="text-[10px] text-zinc-400 text-right">
                            {post.poll.totalVotes.toLocaleString()} votes total
                          </div>
                        </div>
                      )}

                      {/* Media Display (Strictly AI-generated images; videos excluded for AI characters) */}
                      {post.mediaUrl && (
                        <div className="rounded-xl overflow-hidden bg-black/60 border border-purple-900/40 max-h-80">
                          <div className="px-3 py-1 bg-purple-950/80 border-b border-purple-500/30 flex items-center justify-between text-[10px] text-yellow-300 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                              <span>AI Generated Visual · Contextual to Post</span>
                            </span>
                            <span className="text-[9px] text-zinc-400 font-mono">Non-repeating</span>
                          </div>
                          <SafeImage
                            src={post.mediaUrl}
                            alt={post.content.slice(0, 30) || 'Post media'}
                            fallbackType="post_media"
                            authorName={profile.name}
                            className="w-full max-h-80 object-cover"
                          />
                        </div>
                      )}

                      {/* Reactions & Comments Metric Bar */}
                      <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-[#231542]">
                        <div className="flex items-center gap-3">
                          <span className="text-rose-400 flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 fill-rose-400" />
                            <span>{post.reactions.like.toLocaleString()}</span>
                          </span>
                          <span className="text-yellow-400 flex items-center gap-1">
                            <ArrowBigUp className="w-4 h-4 fill-yellow-400" />
                            <span>{post.upvotes.toLocaleString()}</span>
                          </span>
                          <span className="text-purple-300 flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{post.comments.length} comments</span>
                          </span>
                        </div>

                        {onViewPost && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onViewPost(post);
                            }}
                            className="text-xs text-yellow-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Post & Comments</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                {/* Empty state if filter has no posts */}
                {profilePosts.filter((post) => {
                  if (postCategoryFilter === 'image') return post.mediaType === 'image';
                  if (postCategoryFilter === 'status') return !post.mediaUrl && !post.poll;
                  if (postCategoryFilter === 'poll') return !!post.poll;
                  return true;
                }).length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-xs bg-[#180f2d] border border-[#2d1c52] rounded-2xl space-y-2">
                    <p>No posts found for this category yet.</p>
                    <button
                      type="button"
                      onClick={() => handleCreateAiPost(postCategoryFilter === 'all' ? 'image' : postCategoryFilter)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>Generate First {postCategoryFilter.toUpperCase()} Post</span>
                    </button>
                  </div>
                )}

                {/* Load More Posts for this profile */}
                <button
                  type="button"
                  onClick={handleLoadMoreProfilePosts}
                  className="w-full py-2.5 rounded-xl bg-[#1d1238] border border-[#3c256e] hover:border-yellow-400 text-xs text-yellow-300 font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Load More Posts by {profile.name}</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: ABOUT & SAMPLE QUOTES */}
            {activeTab === 'about' && (
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Signature Catchphrases & Timeline Reactions</span>
                </h3>

                <div className="space-y-2">
                  {profile.sampleQuotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="bg-[#180f2d] border border-[#2f1c50] rounded-xl p-3 text-xs text-zinc-300 italic flex items-start gap-2.5"
                    >
                      <span className="text-yellow-400 text-base font-serif">“</span>
                      <p className="flex-1 not-italic text-zinc-200">{quote}</p>
                      <span className="text-yellow-400 text-base font-serif">”</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX: FULL PROFILE PICTURE / COVER ZOOM MODAL */}
      {showFullPicturePreview && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setShowFullPicturePreview(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullPicturePreview(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition cursor-pointer shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-2xl bg-[#120c22]">
              <img
                src={showFullPicturePreview === 'avatar' ? currentAvatar : currentCover}
                alt={profile.name}
                className="max-h-[80vh] w-auto object-contain rounded-2xl"
              />
            </div>

            <div className="mt-3 text-center">
              <h3 className="font-bold text-base text-zinc-100 flex items-center justify-center gap-2">
                <span>{profile.name}</span>
                <span className="text-xs text-yellow-400 font-mono">
                  {showFullPicturePreview === 'avatar' ? 'Full Profile Picture' : 'Full Banner Cover'}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">{profile.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
