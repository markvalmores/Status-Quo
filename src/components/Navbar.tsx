import React, { useEffect, useState } from 'react';
import {
  Zap,
  Users,
  CheckCircle2,
  Crown,
  Flame,
  Award,
  CreditCard,
  ShieldCheck,
  Sparkles,
  BookOpen,
  LogOut
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  canClaimDaily: boolean;
  onClaimDaily: () => void;
  onOpenProfile: () => void;
  onOpenGoals: () => void;
  onOpenChallenges: () => void;
  onOpenSubscription: () => void;
  onOpenAdminLogin: () => void;
  onToggleBibleFollow: () => void;
  onLogout?: () => void;
  relationshipCount: number;
  unclaimedChallengesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  canClaimDaily,
  onClaimDaily,
  onOpenProfile,
  onOpenGoals,
  onOpenChallenges,
  onOpenSubscription,
  onOpenAdminLogin,
  onToggleBibleFollow,
  onLogout,
  relationshipCount,
  unclaimedChallengesCount
}) => {
  // Live active players counter with realistic organic fluctuations
  const [activePlayers, setActivePlayers] = useState<number>(18420);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayers((prev) => {
        const delta = Math.floor(Math.random() * 11) - 5; // fluctuate -5 to +5
        return Math.max(12000, prev + delta);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const followerProgress = Math.min(100, (user.followersCount / 100000) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0918]/95 backdrop-blur-md border-b border-[#241a3d] px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Live Player Counter */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#7c3aed] via-[#a855f7] to-[#facc15] p-0.5 shadow-lg shadow-[#7c3aed]/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0a12] rounded-[10px] flex items-center justify-center text-yellow-400 font-black text-xl font-display">
                SQ
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ef4444] rounded-full border-2 border-[#0b0a12] animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ef4444] rounded-full border-2 border-[#0b0a12]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                  STATUS QUO
                </span>
                {user.isAdmin && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">{activePlayers.toLocaleString()}</span> online now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Stat Counters */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Energy Widget */}
          <div className="bg-[#17102b] border border-[#35255c] rounded-xl px-3.5 py-1.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Zap className="w-4 h-4 fill-yellow-400" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Social Energy</div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-yellow-300 font-mono">
                  {user.isAdmin || user.isVipSubscriber ? '∞ Unlimited' : `${user.energy} / ${user.maxEnergy}`}
                </span>
                {canClaimDaily && !user.isAdmin && (
                  <button
                    onClick={onClaimDaily}
                    className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-yellow-400 text-black font-bold animate-bounce cursor-pointer"
                    title="Claim your +10 daily free energy!"
                  >
                    +10 FREE
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Followers / Verification Progress */}
          <div
            onClick={onOpenProfile}
            className="bg-[#17102b] border border-[#35255c] hover:border-yellow-400/50 rounded-xl px-3.5 py-1.5 flex items-center gap-3 cursor-pointer transition"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <span>Followers</span>
                {user.isVerified && (
                  <CheckCircle2 className="w-3 h-3 fill-yellow-400 text-black inline" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-zinc-100 font-mono">
                  {user.followersCount.toLocaleString()}
                </span>
                {!user.isVerified && (
                  <span className="text-[10px] text-yellow-400 font-semibold">
                    ({followerProgress.toFixed(0)}% to Verified)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Energy Badge */}
          <div className="flex lg:hidden items-center gap-1 bg-[#17102b] border border-[#35255c] px-2 py-1 rounded-lg text-xs font-bold text-yellow-300">
            <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{user.isAdmin || user.isVipSubscriber ? '∞' : user.energy}</span>
          </div>

          {/* Relationship Goals Trigger */}
          <button
            onClick={onOpenGoals}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1b1233] hover:bg-[#281a4b] border border-[#3e276b] text-yellow-300 font-medium text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Relationship Goals & Badges"
          >
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="hidden sm:inline">Goals</span>
            {relationshipCount > 0 && (
              <span className="bg-purple-600 text-yellow-300 text-[10px] font-bold rounded-full px-1.5 py-0.2">
                {relationshipCount}
              </span>
            )}
          </button>

          {/* Quests & Challenges Trigger */}
          <button
            onClick={onOpenChallenges}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1b1233] hover:bg-[#281a4b] border border-[#3e276b] text-purple-300 font-medium text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Quests & Challenges"
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Quests</span>
            {unclaimedChallengesCount > 0 && (
              <span className="bg-yellow-400 text-black text-[10px] font-black rounded-full px-1.5 py-0.2 animate-pulse">
                {unclaimedChallengesCount}
              </span>
            )}
          </button>

          {/* VIP Pass Trigger */}
          <button
            onClick={onOpenSubscription}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-medium text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Monthly VIP Subscription for Unlimited Posts"
          >
            <CreditCard className="w-4 h-4 text-yellow-400" />
            <span className="hidden md:inline">VIP Pass</span>
          </button>

          {/* Master Admin / Login Trigger */}
          {!user.isAdmin ? (
            <button
              onClick={onOpenAdminLogin}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#17102b] hover:bg-[#26174a] border border-[#3a2666] text-zinc-300 font-medium text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Administrator Portal"
            >
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span className="hidden xl:inline">Admin</span>
            </button>
          ) : (
            <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Usagyuun</span>
            </div>
          )}

          {/* Bible Verse Profile Follow Toggle Shortcut */}
          <button
            onClick={onToggleBibleFollow}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition cursor-pointer ${
              user.followsBibleVerse
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-[#150f26] border-[#302154] text-zinc-400 hover:text-zinc-200'
            }`}
            title={user.followsBibleVerse ? 'Following Daily Scripture' : 'Follow Daily Scripture'}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Profile Avatar Button */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="View & Edit Profile"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full ring-2 ring-yellow-400/60 overflow-hidden bg-purple-900 flex items-center justify-center transition group-hover:ring-yellow-300">
                {user.avatarType === 'video' ? (
                  <video
                    src={user.avatar}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <SafeImage
                    src={user.avatar}
                    alt={user.name}
                    fallbackType="avatar"
                    authorName={user.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-0.5 border border-[#0d0918]">
                  <CheckCircle2 className="w-3 h-3 fill-yellow-400 text-black" />
                </div>
              )}
            </div>
          </div>

          {/* Logout Shortcut */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
