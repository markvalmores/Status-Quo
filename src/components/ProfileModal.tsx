import React, { useState } from 'react';
import {
  Camera,
  Video,
  Sparkles,
  CheckCircle2,
  Users,
  Zap,
  Award,
  Upload,
  RefreshCw,
  X,
  ShieldCheck,
  Eye,
  Maximize2,
  LogOut,
  Calendar
} from 'lucide-react';
import { CELEBRITIES } from '../data/celebrities';
import { fetchAnimeBanner } from '../services/apiService';
import { searchGoogleImages } from '../services/imageService';
import { generateRandomAiAvatar, generateRandomAiCover } from '../services/characterApiService';
import { SafeImage } from './SafeImage';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onLogout
}) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [avatarType, setAvatarType] = useState<'image' | 'video'>(user.avatarType);
  const [cover, setCover] = useState(user.cover);
  const [coverType, setCoverType] = useState<'image' | 'video'>(user.coverType);
  const [isRegeneratingAnime, setIsRegeneratingAnime] = useState(false);
  const [googleImageSearchQuery, setGoogleImageSearchQuery] = useState('');
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [fullPictureModal, setFullPictureModal] = useState<'avatar' | 'cover' | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      username,
      bio,
      avatar,
      avatarType,
      cover,
      coverType
    });
    onClose();
  };

  const handleRegenerateAnimeBanner = async () => {
    setIsRegeneratingAnime(true);
    try {
      const newBanner = await fetchAnimeBanner();
      setCover(newBanner);
      setCoverType('image');
    } finally {
      setIsRegeneratingAnime(false);
    }
  };

  const handleSearchGoogleImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleImageSearchQuery.trim()) return;
    setIsSearchingGoogle(true);
    try {
      const results = await searchGoogleImages(googleImageSearchQuery.trim());
      if (results && results.length > 0) {
        setCover(results[0]);
        setCoverType('image');
        if (results.length > 1) {
          setAvatar(results[1]);
          setAvatarType('image');
        }
      }
    } finally {
      setIsSearchingGoogle(false);
      setGoogleImageSearchQuery('');
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'avatar' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.includes('video') || file.name.endsWith('.mp4');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (target === 'avatar') {
          setAvatar(event.target.result as string);
          setAvatarType(isVid ? 'video' : 'image');
        } else {
          setCover(event.target.result as string);
          setCoverType(isVid ? 'video' : 'image');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const followerPercent = Math.min(100, (user.followersCount / 100000) * 100);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
        <div className="bg-[#120c22] border border-[#3e276b] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* HEADER BANNER */}
          <div className="relative h-44 sm:h-52 bg-black/70 flex-shrink-0 group overflow-hidden">
            {coverType === 'video' ? (
              <video
                src={cover}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <SafeImage src={cover} alt="Cover Banner" fallbackType="cover" authorName={user.name} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#120c22] via-[#120c22]/20 to-black/50" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition z-20 cursor-pointer shadow-lg"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* View Full Cover button */}
            <button
              onClick={() => setFullPictureModal('cover')}
              className="absolute top-3 right-14 bg-black/70 hover:bg-black text-zinc-200 text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition z-20 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Full Banner</span>
            </button>

            {/* Controls on banner */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
              <button
                onClick={handleRegenerateAnimeBanner}
                disabled={isRegeneratingAnime}
                className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-yellow-300 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm transition cursor-pointer"
                title="Generate new Anime banner via Anime API"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingAnime ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Anime Banner</span>
              </button>

              <label className="bg-black/70 hover:bg-black border border-zinc-700 text-zinc-100 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm transition cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-yellow-400" />
                <span>Change Cover (JPG, GIF, MP4)</span>
                <input
                  type="file"
                  accept="image/*,video/mp4"
                  onChange={(e) => handleFileUpload(e, 'cover')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* MAIN SCROLLABLE FORM BODY */}
          <div className="px-5 sm:px-6 pb-6 pt-3 overflow-y-auto space-y-5 flex-1">
            
            {/* FULL ROUND PROFILE PICTURE (Never sliced or half-submerged!) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#261745]">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => setFullPictureModal('avatar')}
                  className="relative group cursor-pointer flex-shrink-0"
                  title="Click to view full profile picture"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-yellow-400 overflow-hidden bg-purple-950 shadow-2xl relative">
                    {avatarType === 'video' ? (
                      <video
                        src={avatar}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <SafeImage src={avatar} alt={user.name} fallbackType="avatar" authorName={user.name} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Maximize2 className="w-6 h-6 text-yellow-400 drop-shadow" />
                    </div>
                  </div>

                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-1 border-2 border-[#120c22] shadow">
                      <CheckCircle2 className="w-4 h-4 fill-yellow-400 text-black" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-xl sm:text-2xl text-zinc-100">
                      {user.name}
                    </h2>
                    {user.isVerified && (
                      <span className="text-[11px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full font-bold">
                        Verified Icon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-yellow-400 font-mono">@{user.username}</p>
                  {user.birthday && (
                    <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Birthday: {user.birthday}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons for Avatar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newAvatar = generateRandomAiAvatar(`${user.username}_${Date.now()}`);
                    setAvatar(newAvatar);
                    setAvatarType('image');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-xs text-yellow-300 font-semibold flex items-center gap-1.5 transition cursor-pointer shadow"
                  title="Generate a random AI profile picture"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Roll AI Avatar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFullPictureModal('avatar')}
                  className="px-3 py-1.5 rounded-xl bg-[#1d1238] border border-[#3c256e] text-xs text-zinc-200 hover:text-yellow-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Full View</span>
                </button>

                <label className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*,video/mp4"
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* VERIFICATION PROGRESS BAR (100k Followers Milestone) */}
            <div className="bg-gradient-to-r from-purple-900/40 via-[#190f30] to-yellow-900/30 border border-yellow-400/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-yellow-300">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Verified Creator Badge Progress</span>
                </span>
                <span>
                  {user.isVerified ? '✅ VERIFIED' : `${user.followersCount.toLocaleString()} / 100,000`}
                </span>
              </div>

              <div className="w-full bg-[#0d0718] h-3 rounded-full overflow-hidden border border-[#392461]">
                <div
                  className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 h-full transition-all duration-500"
                  style={{ width: `${user.isVerified ? 100 : followerPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {user.isVerified
                  ? "🎉 You have earned the Verified Gold Badge! All celebrities, superheroes, and anime stars treat you as timeline royalty."
                  : `Reach 100,000 followers to unlock your verified badge. Every post gains you hundreds of followers as AI stars engage! (${(100 - followerPercent).toFixed(1)}% remaining)`}
              </p>
            </div>

            {/* EDIT PROFILE FORM */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#180f2d] border border-[#3c276b] rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Username (@)</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#180f2d] border border-[#3c276b] rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Bio Status</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#180f2d] border border-[#3c276b] rounded-xl p-3 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 resize-none leading-relaxed"
                />
              </div>

              {/* Google Images API Search for custom avatar or cover */}
              <div className="bg-[#180f2d] border border-[#331f58] rounded-xl p-3.5 space-y-2">
                <label className="text-xs font-semibold text-yellow-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Google Images Search (Set Cover or Avatar by Keyword)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Cyberpunk Tokyo, Dune Desert, Neon City..."
                    value={googleImageSearchQuery}
                    onChange={(e) => setGoogleImageSearchQuery(e.target.value)}
                    className="flex-1 bg-[#120a22] border border-[#3c276b] rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={handleSearchGoogleImages}
                    disabled={isSearchingGoogle || !googleImageSearchQuery.trim()}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-yellow-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    {isSearchingGoogle ? 'Searching...' : 'Apply Image'}
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-2">
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold text-xs shadow-lg shadow-yellow-500/20 transition cursor-pointer active:scale-95"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FULL PICTURE / COVER ZOOM LIGHTBOX */}
      {fullPictureModal && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setFullPictureModal(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFullPictureModal(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition cursor-pointer shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-2xl bg-[#120c22]">
              {fullPictureModal === 'avatar' && avatarType === 'video' ? (
                <video src={avatar} controls autoPlay loop className="max-h-[80vh] w-auto rounded-2xl" />
              ) : fullPictureModal === 'cover' && coverType === 'video' ? (
                <video src={cover} controls autoPlay loop className="max-h-[80vh] w-auto rounded-2xl" />
              ) : (
                <img
                  src={fullPictureModal === 'avatar' ? avatar : cover}
                  alt={user.name}
                  className="max-h-[80vh] w-auto object-contain rounded-2xl"
                />
              )}
            </div>

            <div className="mt-3 text-center">
              <h3 className="font-bold text-base text-zinc-100 flex items-center justify-center gap-2">
                <span>{user.name}</span>
                <span className="text-xs text-yellow-400 font-mono">
                  {fullPictureModal === 'avatar' ? 'Full Profile Picture' : 'Full Banner Cover'}
                </span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
