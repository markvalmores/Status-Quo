import React from 'react';
import {
  Award,
  Zap,
  Users,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge } from '../types';

interface ChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: Challenge[];
  onClaimReward: (challengeId: string) => void;
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({
  isOpen,
  onClose,
  challenges,
  onClaimReward
}) => {
  if (!isOpen) return null;

  const handleClaim = (id: string) => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClaimReward(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#120c22] border border-[#3e276b] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#291a47] flex items-center justify-between bg-[#17102c]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-yellow-300">
                Quests & Challenges
              </h2>
              <p className="text-xs text-zinc-400">
                Complete daily milestones to earn bonus social energy and boost followers!
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

        {/* Challenges list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {challenges.map((challenge) => {
            const isCompleted = challenge.progress >= challenge.maxProgress;
            const progressPercent = Math.min(100, (challenge.progress / challenge.maxProgress) * 100);

            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-xl border transition ${
                  challenge.claimed
                    ? 'bg-[#100a1c] border-[#22163b] opacity-75'
                    : isCompleted
                    ? 'bg-[#1a1033] border-yellow-400/50 shadow-lg shadow-yellow-500/5'
                    : 'bg-[#150e28] border-[#342259]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{challenge.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-100">{challenge.title}</h4>
                        {challenge.claimed && (
                          <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold">
                            Claimed ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{challenge.description}</p>
                    </div>
                  </div>

                  {/* Rewards preview */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {challenge.rewardEnergy > 0 && (
                      <span className="bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-yellow-400" /> +{challenge.rewardEnergy}
                      </span>
                    )}
                    {challenge.rewardFollowers > 0 && (
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <Users className="w-3 h-3" /> +{challenge.rewardFollowers.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar & Claim button */}
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                      <span>Progress</span>
                      <span>
                        {challenge.progress} / {challenge.maxProgress} ({Math.round(progressPercent)}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#0d0718] h-2 rounded-full overflow-hidden border border-[#2b1b4a]">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    {isCompleted && !challenge.claimed ? (
                      <button
                        onClick={() => handleClaim(challenge.id)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-yellow-500/20 active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>Claim Reward</span>
                      </button>
                    ) : challenge.claimed ? (
                      <span className="text-xs text-zinc-500 font-medium">Completed</span>
                    ) : (
                      <span className="text-xs text-yellow-400/80 font-mono">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
