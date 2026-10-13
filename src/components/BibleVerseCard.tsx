import React from 'react';
import { BookOpen, RefreshCw, CheckCircle2, UserPlus, UserCheck } from 'lucide-react';
import { BibleVerse } from '../types';

interface BibleVerseCardProps {
  verse: BibleVerse | null;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onRefreshVerse: () => void;
  isLoading: boolean;
}

export const BibleVerseCard: React.FC<BibleVerseCardProps> = ({
  verse,
  isFollowing,
  onToggleFollow,
  onRefreshVerse,
  isLoading
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1a122e] to-[#120b22] border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl shadow-amber-950/20 mb-4 transition-all">
      {/* Profile Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#2d1f4a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#120b22] rounded-full flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-amber-200">
                Daily Scripture & Grace
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 fill-amber-400 text-black" />
            </div>
            <div className="text-[11px] text-zinc-400">
              @dailybread · Inspiring verses for your For You feed
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshVerse}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10 transition cursor-pointer"
            title="Fetch fresh verse from Bible API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onToggleFollow}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
              isFollowing
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                : 'bg-amber-400 hover:bg-amber-300 text-black shadow-md shadow-amber-500/20'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Follow Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scripture Content */}
      <div className="pt-3.5 space-y-2">
        {verse ? (
          <>
            <p className="text-zinc-100 text-sm sm:text-base leading-relaxed italic font-serif">
              "{verse.text}"
            </p>
            <div className="flex items-center justify-between text-xs text-amber-400/90 font-medium pt-1">
              <span className="font-semibold">— {verse.reference} ({verse.version})</span>
              <span className="text-[11px] text-zinc-400">Daily Bread</span>
            </div>
          </>
        ) : (
          <div className="text-xs text-zinc-400 italic">
            Loading today's inspirational scripture from Bible API...
          </div>
        )}
      </div>
    </div>
  );
};
