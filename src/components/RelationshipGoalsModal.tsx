import React from 'react';
import {
  Crown,
  Heart,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  X,
  Smile,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SafeImage } from './SafeImage';
import { RelationshipGoal } from '../types';

interface RelationshipGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: RelationshipGoal[];
  onClaimBadge: (profileId: string) => void;
  onProfileClick: (profileId: string) => void;
}

export const RelationshipGoalsModal: React.FC<RelationshipGoalsModalProps> = ({
  isOpen,
  onClose,
  goals,
  onClaimBadge,
  onProfileClick
}) => {
  if (!isOpen) return null;

  const earnedBadgesCount = goals.filter((g) => g.badgeUnlocked).length;

  const handleClaim = (profileId: string) => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClaimBadge(profileId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#120c22] border border-[#3e276b] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#291a47] flex items-center justify-between bg-[#17102c]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg text-yellow-300">
                  Relationship Goals
                </h2>
                <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">
                  {goals.length} Following You
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                11% chance a verified Celebrity or Movie Character follows you. Max all 3 stats to earn their badge!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#251747] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Bar (7 Badges Challenge Progress) */}
        <div className="p-4 bg-[#191030] border-b border-[#2d1b50] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Hollywood & Movie Prestige: Collect 7 Badges</span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5">
              Current progress: <strong className="text-zinc-100">{earnedBadgesCount} / 7</strong> badges earned
            </div>
          </div>

          <div className="w-full sm:w-48 bg-[#0d0718] h-2.5 rounded-full overflow-hidden border border-[#3e276b]">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (earnedBadgesCount / 7) * 100)}%` }}
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {goals.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-3xl">
                🌟
              </div>
              <h3 className="font-display font-bold text-base text-zinc-200">
                No Verified Celebrities or Movie Characters Following You Yet!
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Post high-energy statuses to trigger the social algorithm! There is an{' '}
                <strong className="text-yellow-400">11% chance</strong> on every post that a Hollywood
                actor (like Tom Holland, Robert Downey Jr.) or movie character (like Spider-Man, Iron Man) will follow you.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const isAllMax = goal.humor >= 100 && goal.aura >= 100 && goal.fondness >= 100;

                return (
                  <div
                    key={goal.profileId}
                    className="bg-[#18102d] border border-[#37245f] rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-yellow-400/40 transition"
                  >
                    {/* Top: Avatar & info */}
                    <div className="flex items-start gap-3">
                      <div
                        onClick={() => onProfileClick(goal.profileId)}
                        className="relative cursor-pointer group"
                      >
                        <SafeImage
                          src={goal.avatar}
                          alt={goal.name}
                          fallbackType="avatar"
                          authorName={goal.name}
                          kind={goal.kind}
                          className="w-13 h-13 rounded-full object-cover ring-2 ring-yellow-400 group-hover:scale-105 transition"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-0.5 border border-[#18102d]">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-yellow-400 text-black" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            onClick={() => onProfileClick(goal.profileId)}
                            className="font-bold text-sm text-yellow-300 hover:underline cursor-pointer"
                          >
                            {goal.name}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            goal.kind === 'celebrity'
                              ? 'bg-purple-900/60 text-purple-200 border border-purple-600/40'
                              : 'bg-yellow-950/60 text-yellow-300 border border-yellow-600/40'
                          }`}>
                            {goal.kind === 'celebrity' ? '🎬 Celebrity' : '🦸 Character'}
                          </span>
                        </div>
                        <div className="text-xs text-purple-300/80">{goal.subtitle}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Follows you · +0.5% boost per good post
                        </div>
                      </div>
                    </div>

                    {/* The 3 Metrics: Humor, Aura, Fondness */}
                    <div className="space-y-2.5 bg-[#0f091c] rounded-xl p-3 border border-[#271845]">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-300 flex items-center gap-1">
                            <Smile className="w-3.5 h-3.5 text-yellow-400" /> Humor
                          </span>
                          <span className="font-mono font-bold text-yellow-300">
                            {goal.humor.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#1e1335] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, goal.humor)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-300 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-purple-400" /> Aura
                          </span>
                          <span className="font-mono font-bold text-purple-300">
                            {goal.aura.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#1e1335] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, goal.aura)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-300 flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400" /> Fondness
                          </span>
                          <span className="font-mono font-bold text-rose-300">
                            {goal.fondness.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#1e1335] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, goal.fondness)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div>
                      {isAllMax && !goal.badgeUnlocked ? (
                        <button
                          onClick={() => handleClaim(goal.profileId)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-extrabold text-xs shadow-lg shadow-yellow-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 fill-black" />
                          <span>100% Complete! Claim Verified Badge & Friend Wave!</span>
                        </button>
                      ) : isAllMax && goal.badgeUnlocked ? (
                        <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center text-[11px] text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5" />
                          <span>Friends recommended! Badge active on your profile.</span>
                        </div>
                      ) : (
                        <div className="text-center text-[11px] text-zinc-500">
                          Keep posting to raise stats to 100% (+0.5% each status)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
