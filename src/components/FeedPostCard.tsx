import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Pin,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowBigUp,
  ArrowBigDown,
  BarChart2,
  Eye,
  Video
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import {
  Post,
  ReactionType,
  UserProfile
} from '../types';

interface FeedPostCardProps {
  post: Post;
  currentUser: UserProfile;
  onReact: (postId: string, reactionType: ReactionType) => void;
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onPollVote: (postId: string, optionId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onAddReply: (postId: string, commentId: string, replyText: string) => void;
  onShare: (post: Post) => void;
  onPin: (postId: string) => void;
  onProfileClick?: (profileId: string) => void;
  onViewPost: (post: Post) => void;
}

const REACTION_CONFIG: Record<
  ReactionType,
  { emoji: string; label: string; color: string }
> = {
  like: { emoji: '👍', label: 'Like', color: 'text-sky-400' },
  love: { emoji: '❤️', label: 'Love', color: 'text-rose-500' },
  haha: { emoji: '😂', label: 'Haha', color: 'text-yellow-400' },
  wow: { emoji: '😮', label: 'Wow', color: 'text-amber-400' },
  sad: { emoji: '😢', label: 'Sad', color: 'text-amber-300' },
  angry: { emoji: '😡', label: 'Angry', color: 'text-red-500' },
  mindblown: { emoji: '🤯', label: 'Mindblown', color: 'text-purple-400' },
  heroic: { emoji: '⚡', label: 'Heroic', color: 'text-yellow-300' }
};

export const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  currentUser,
  onReact,
  onVote,
  onPollVote,
  onAddComment,
  onAddReply,
  onShare,
  onPin,
  onProfileClick,
  onViewPost
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
  const netScore = post.upvotes - post.downvotes;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputMap[commentId];
    if (!text || !text.trim()) return;
    onAddReply(post.id, commentId, text.trim());
    setReplyInputMap((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyBox(null);
  };

  return (
    <article className="bg-[#120d22] border border-[#271b45] rounded-2xl overflow-hidden shadow-xl shadow-black/40 mb-4 transition-all">
      {/* Pinned Header Notice */}
      {post.isPinned && (
        <div className="bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-transparent border-b border-yellow-500/30 px-4 py-2 flex items-center justify-between text-xs text-yellow-300">
          <div className="flex items-center gap-2">
            <Pin className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 rotate-45" />
            <span className="font-semibold">
              Pinned by {post.pinnedBy || 'Moderator'}
            </span>
            {post.pinnedSubtitle && (
              <span className="text-zinc-400 hidden sm:inline">({post.pinnedSubtitle})</span>
            )}
          </div>
          <span className="text-[10px] text-yellow-400/80 uppercase font-mono tracking-wider">Spotlight</span>
        </div>
      )}

      {/* Post Author Bar */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            onClick={() => {
              if (post.authorId && onProfileClick && post.authorId !== currentUser.id) {
                onProfileClick(post.authorId);
              }
            }}
            className="relative cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full ring-2 ring-[#402a70] group-hover:ring-yellow-400 overflow-hidden bg-purple-950 flex items-center justify-center transition">
              <SafeImage
                src={post.authorAvatar}
                alt={post.authorName}
                fallbackType="avatar"
                authorName={post.authorName}
                kind={post.kind}
                className="w-full h-full object-cover"
              />
            </div>
            {post.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-0.5 border border-[#120d22]">
                <CheckCircle2 className="w-3.5 h-3.5 fill-yellow-400 text-black" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={() => {
                  if (post.authorId && onProfileClick && post.authorId !== currentUser.id) {
                    onProfileClick(post.authorId);
                  }
                }}
                className="font-bold text-zinc-100 hover:text-yellow-300 transition cursor-pointer text-sm sm:text-base"
              >
                {post.authorName}
              </span>

              {/* Distinct Category Badges */}
              {post.kind === 'celebrity' && (
                <span className="text-[11px] text-purple-300 bg-purple-950/70 border border-purple-700/50 px-2 py-0.5 rounded-full font-medium">
                  🎬 Celebrity
                </span>
              )}
              {post.kind === 'character' && (
                <span className="text-[11px] text-yellow-300 bg-yellow-950/50 border border-yellow-600/40 px-2 py-0.5 rounded-full font-medium">
                  🦸 Movie Character
                </span>
              )}
              {post.kind === 'anime' && (
                <span className="text-[11px] text-orange-300 bg-orange-950/50 border border-orange-600/40 px-2 py-0.5 rounded-full font-medium">
                  ⛩️ Anime Icon
                </span>
              )}
              {post.kind === 'waifu' && (
                <span className="text-[11px] text-rose-300 bg-rose-950/50 border border-rose-600/40 px-2 py-0.5 rounded-full font-medium">
                  🌸 Waifu
                </span>
              )}

              {post.isBibleProfile && (
                <span className="text-xs text-amber-300 bg-amber-950/50 border border-amber-600/40 px-2 py-0.5 rounded-full font-medium">
                  🕊️ Daily Scripture
                </span>
              )}
            </div>

            <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span>{post.timestamp}</span>
              {post.authorSubtitle && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-400 hidden sm:inline">{post.authorSubtitle}</span>
                </>
              )}
              {post.feeling && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-300">feeling {post.feeling}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upvote & Downvote Counter Widget */}
        <div className="flex items-center gap-1 bg-[#18102d] border border-[#3b276b] rounded-xl px-2 py-1">
          <button
            onClick={() => onVote(post.id, 'up')}
            className={`p-1 rounded-lg transition cursor-pointer ${
              post.userVote === 'up'
                ? 'text-yellow-400 bg-yellow-400/20'
                : 'text-zinc-400 hover:text-yellow-300'
            }`}
            title="Upvote"
          >
            <ArrowBigUp className="w-4 h-4 fill-current" />
          </button>

          <span className="font-mono font-bold text-xs text-zinc-200 px-1">
            {netScore.toLocaleString()}
          </span>

          <button
            onClick={() => onVote(post.id, 'down')}
            className={`p-1 rounded-lg transition cursor-pointer ${
              post.userVote === 'down'
                ? 'text-red-400 bg-red-400/20'
                : 'text-zinc-400 hover:text-red-400'
            }`}
            title="Downvote"
          >
            <ArrowBigDown className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Post Text Content */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-zinc-100 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-yellow-400/90 font-medium hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Poll if attached */}
      {post.poll && (
        <div className="mx-4 sm:mx-5 mb-3 bg-[#18102d] border border-yellow-400/30 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-2 text-yellow-300 font-bold text-xs sm:text-sm">
            <BarChart2 className="w-4 h-4 text-yellow-400" />
            <span>Poll: {post.poll.question}</span>
          </div>

          <div className="space-y-1.5">
            {post.poll.options.map(opt => {
              const percent = post.poll!.totalVotes > 0
                ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                : 0;
              const isVoted = post.poll!.userVotedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => onPollVote(post.id, opt.id)}
                  className={`w-full p-2.5 rounded-xl border text-left relative overflow-hidden transition cursor-pointer ${
                    isVoted
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-[#382463] bg-[#120a22] hover:border-yellow-400/50'
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

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="w-full border-y border-[#271b45] overflow-hidden">
          {post.mediaType === 'video' ? (
            <div>
              <div className="px-4 py-1.5 bg-emerald-950/80 border-b border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Real Member Video Post (Exclusive)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">60 FPS</span>
              </div>
              <div
                onClick={() => onViewPost(post)}
                className="w-full bg-black max-h-[500px] flex items-center justify-center cursor-pointer"
              >
                <video
                  src={post.mediaUrl}
                  controls
                  loop
                  className="w-full max-h-[500px] object-contain"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="px-4 py-1.5 bg-purple-950/80 border-b border-purple-500/30 flex items-center justify-between text-[11px] text-yellow-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>AI Generated Visual · Contextual to Post</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Non-repeating</span>
              </div>
              <div
                onClick={() => onViewPost(post)}
                className="w-full bg-black/60 max-h-[500px] flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <SafeImage
                  src={post.mediaUrl}
                  alt={post.content.slice(0, 30) || 'Post visual'}
                  fallbackType="post_media"
                  authorName={post.authorName}
                  kind={post.kind}
                  className="w-full max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reaction and Shares Count Bar */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#0e0a1c] border-b border-[#22163d] flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-2">
        <div
          onClick={() => onViewPost(post)}
          className="flex items-center gap-2 cursor-pointer hover:underline"
        >
          <div className="flex items-center -space-x-1">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xs">
              ❤️
            </span>
            <span className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xs">
              ⚡
            </span>
            <span className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xs">
              👍
            </span>
          </div>

          <span className="font-semibold text-zinc-300 font-mono">
            {totalReactions.toLocaleString()} reacts
          </span>

          {post.celebrityReactions.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2 border-l border-[#2e1d52] pl-3">
              <span className="text-[11px] text-yellow-300/80">Reacted:</span>
              <div className="flex items-center -space-x-2">
                {post.celebrityReactions.slice(0, 5).map((cr) => (
                  <div
                    key={cr.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onProfileClick && onProfileClick(cr.profileId);
                    }}
                    className="relative w-6 h-6 rounded-full border-2 border-[#120d22] overflow-hidden cursor-pointer group/cr"
                    title={`${cr.name} (${cr.subtitle}) reacted ${REACTION_CONFIG[cr.type]?.emoji || '👍'}`}
                  >
                    <SafeImage
                      src={cr.avatar}
                      alt={cr.name}
                      fallbackType="avatar"
                      authorName={cr.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={() => onViewPost(post)}
            className="hover:underline text-yellow-400 font-semibold cursor-pointer flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Full Post ({post.comments.length} comments)</span>
          </button>
        </div>
      </div>

      {/* Interactive Action Bar */}
      <div className="relative px-2 sm:px-4 py-1.5 flex items-center justify-between border-b border-[#22163d]">
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
        >
          <button
            onClick={() => {
              const current = post.userReaction;
              onReact(post.id, current ? current : 'love');
            }}
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition cursor-pointer hover:bg-[#1b1233] ${
              post.userReaction
                ? `${REACTION_CONFIG[post.userReaction]?.color || 'text-yellow-400'}`
                : 'text-zinc-300 hover:text-zinc-100'
            }`}
          >
            {post.userReaction ? (
              <>
                <span>{REACTION_CONFIG[post.userReaction]?.emoji}</span>
                <span>{REACTION_CONFIG[post.userReaction]?.label}</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>React</span>
              </>
            )}
          </button>

          {showReactionPicker && (
            <div className="absolute -top-12 left-0 sm:left-4 z-30 bg-[#1e1338] border border-yellow-400/40 rounded-full px-2 py-1.5 flex items-center gap-1.5 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-150">
              {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((type) => {
                const cfg = REACTION_CONFIG[type];
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onReact(post.id, type);
                      setShowReactionPicker(false);
                    }}
                    className="hover:scale-135 transition-transform p-1 text-lg active:scale-95"
                    title={cfg.label}
                  >
                    {cfg.emoji}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => onViewPost(post)}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-zinc-100 hover:bg-[#1b1233] transition cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comments ({post.comments.length})</span>
        </button>

        <button
          onClick={() => onShare(post)}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-yellow-300 hover:bg-[#1b1233] transition cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Preview 3 Comments + 'View All Comments' button */}
      <div className="p-4 bg-[#0d0918]/80 space-y-3">
        {post.comments.slice(0, 3).map((comment) => (
          <div key={comment.id} className="space-y-1.5">
            <div className="flex items-start gap-2.5">
              <SafeImage
                src={comment.authorAvatar}
                alt={comment.authorName}
                fallbackType="avatar"
                authorName={comment.authorName}
                kind={comment.kind}
                onClick={() => onProfileClick && onProfileClick(comment.authorId)}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#3d276b] mt-0.5 cursor-pointer flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-[#18112d] border border-[#2f1f54] rounded-2xl p-2.5 inline-block max-w-full">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      onClick={() => onProfileClick && onProfileClick(comment.authorId)}
                      className="font-bold text-xs text-yellow-300 hover:underline cursor-pointer"
                    >
                      {comment.authorName}
                    </span>
                    {comment.isVerified && (
                      <CheckCircle2 className="w-3 h-3 fill-yellow-400 text-black" />
                    )}
                    {comment.kind && (
                      <span className="text-[9px] bg-purple-950 text-purple-300 px-1 rounded">
                        {comment.kind === 'celebrity' && '🎬'}
                        {comment.kind === 'character' && '🦸'}
                        {comment.kind === 'anime' && '⛩️'}
                        {comment.kind === 'waifu' && '🌸'}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-200 text-xs mt-0.5 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Comments Link */}
        {post.comments.length > 3 && (
          <button
            onClick={() => onViewPost(post)}
            className="w-full text-center text-xs text-yellow-400 hover:underline font-semibold pt-1 cursor-pointer"
          >
            View all {post.comments.length} comments & thread replies →
          </button>
        )}

        {/* Comment Form */}
        <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-2 border-t border-[#1f1537]">
          <input
            type="text"
            placeholder="Write a comment... (Replies cost 0 energy)"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 bg-[#160f29] border border-[#3b276b] rounded-full px-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="p-2 rounded-full text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </article>
  );
};
