import React, { useState } from 'react';
import {
  X,
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
  Users,
  Eye,
  Film,
  Video
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import {
  Post,
  ReactionType,
  UserProfile
} from '../types';

interface ViewPostModalProps {
  post: Post | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onReact: (postId: string, reactionType: ReactionType) => void;
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onPollVote: (postId: string, optionId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onAddReply: (postId: string, commentId: string, replyText: string) => void;
  onShare: (post: Post) => void;
  onProfileClick: (profileId: string) => void;
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

export const ViewPostModal: React.FC<ViewPostModalProps> = ({
  post,
  currentUser,
  isOpen,
  onClose,
  onReact,
  onVote,
  onPollVote,
  onAddComment,
  onAddReply,
  onShare,
  onProfileClick
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'reactions'>('comments');
  const [reactionFilter, setReactionFilter] = useState<ReactionType | 'all'>('all');
  const [commentInput, setCommentInput] = useState('');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  if (!isOpen || !post) return null;

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

  const filteredReactions = post.celebrityReactions.filter(r =>
    reactionFilter === 'all' ? true : r.type === reactionFilter
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#120d22] border border-[#3e276b] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#291a47] flex items-center justify-between bg-[#160f2b]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-base sm:text-lg text-yellow-300">
              Post Details & Full Reactions
            </span>
            <span className="text-[11px] bg-purple-950 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full font-mono">
              {post.comments.length} comments · {totalReactions.toLocaleString()} reacts
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#251747] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Post & Comments Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {/* Post Author Card */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                onClick={() => post.authorId !== currentUser.id && onProfileClick(post.authorId)}
                className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-yellow-400 cursor-pointer bg-purple-950 flex-shrink-0"
              >
                <SafeImage
                  src={post.authorAvatar}
                  alt={post.authorName}
                  fallbackType="avatar"
                  authorName={post.authorName}
                  kind={post.kind}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    onClick={() => post.authorId !== currentUser.id && onProfileClick(post.authorId)}
                    className="font-bold text-base text-zinc-100 hover:text-yellow-300 cursor-pointer"
                  >
                    {post.authorName}
                  </span>
                  {post.isVerified && (
                    <CheckCircle2 className="w-4 h-4 fill-yellow-400 text-black" />
                  )}
                  {post.kind && (
                    <span className="text-xs bg-purple-950/80 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full font-medium">
                      {post.kind === 'celebrity' && '🎬 Celebrity'}
                      {post.kind === 'character' && '🦸 Movie Character'}
                      {post.kind === 'anime' && '⛩️ Anime Icon'}
                      {post.kind === 'waifu' && '🌸 Waifu'}
                      {post.kind === 'normal_user' && '👤 Member'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  <span>{post.timestamp}</span>
                  {post.authorSubtitle && <span> · {post.authorSubtitle}</span>}
                  {post.feeling && <span> · feeling {post.feeling}</span>}
                </div>
              </div>
            </div>

            {/* Upvote & Downvote Pill */}
            <div className="flex items-center gap-1 bg-[#18102d] border border-[#3b276b] rounded-xl px-2 py-1">
              <button
                onClick={() => onVote(post.id, 'up')}
                className={`p-1 rounded-lg transition cursor-pointer ${
                  post.userVote === 'up'
                    ? 'text-yellow-400 bg-yellow-400/20'
                    : 'text-zinc-400 hover:text-yellow-300'
                }`}
                title="Upvote post"
              >
                <ArrowBigUp className="w-5 h-5 fill-current" />
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
                title="Downvote post"
              >
                <ArrowBigDown className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Post Text */}
          <div className="text-zinc-100 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(t => (
                <span key={t} className="text-xs text-yellow-400 font-medium">#{t}</span>
              ))}
            </div>
          )}

          {/* Poll Component (if present) */}
          {post.poll && (
            <div className="bg-[#18102d] border border-yellow-400/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm">
                <BarChart2 className="w-4 h-4 text-yellow-400" />
                <span>Poll: {post.poll.question}</span>
              </div>

              <div className="space-y-2">
                {post.poll.options.map(opt => {
                  const percent = post.poll!.totalVotes > 0
                    ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                    : 0;
                  const isVoted = post.poll!.userVotedOptionId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onPollVote(post.id, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left relative overflow-hidden transition cursor-pointer ${
                        isVoted
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-[#382463] bg-[#120a22] hover:border-yellow-400/50'
                      }`}
                    >
                      {/* Vote Progress Bar */}
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
                          {percent}% ({opt.votes.toLocaleString()} votes)
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-zinc-400 text-right">
                Total Votes: <strong className="text-zinc-200">{post.poll.totalVotes.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Media visual */}
          {post.mediaUrl && (
            <div className="rounded-2xl overflow-hidden border border-[#3b276b] bg-black max-h-[520px] flex flex-col">
              {post.mediaType === 'video' ? (
                <div>
                  <div className="px-3.5 py-1.5 bg-emerald-950/80 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Active Real Member Video (Exclusive)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">60 FPS</span>
                  </div>
                  <video src={post.mediaUrl} controls autoPlay loop className="max-h-[480px] w-full object-contain" />
                </div>
              ) : (
                <div>
                  <div className="px-3.5 py-1.5 bg-purple-950/80 border-b border-purple-500/30 flex items-center justify-between text-xs text-yellow-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>AI Generated Visual · Contextual to Post</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Non-repeating</span>
                  </div>
                  <SafeImage
                    src={post.mediaUrl}
                    alt={post.content.slice(0, 30) || 'Post visual'}
                    fallbackType="post_media"
                    authorName={post.authorName}
                    kind={post.kind}
                    className="max-h-[480px] w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="p-3 bg-[#160f2b] border border-[#2b1b47] rounded-xl flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => onReact(post.id, post.userReaction || 'love')}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-yellow-300 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{post.userReaction ? `Reacted (${REACTION_CONFIG[post.userReaction].label})` : 'React'}</span>
            </button>

            <button
              onClick={() => onShare(post)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-yellow-300 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share ({post.shares.length})</span>
            </button>
          </div>

          {/* Tab Selector: Comments vs Who Reacted */}
          <div className="flex border-b border-[#2b1b47] text-xs">
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-2.5 px-4 font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'comments'
                  ? 'border-yellow-400 text-yellow-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Comments ({post.comments.length})
            </button>

            <button
              onClick={() => setActiveTab('reactions')}
              className={`pb-2.5 px-4 font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'reactions'
                  ? 'border-yellow-400 text-yellow-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              View People Who Reacted ({totalReactions.toLocaleString()})
            </button>
          </div>

          {/* Tab 1: Comments */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <SafeImage
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      fallbackType="avatar"
                      authorName={comment.authorName}
                      onClick={() => onProfileClick(comment.authorId)}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-yellow-400/60 mt-0.5 cursor-pointer"
                    />

                    <div className="flex-1">
                      <div className="bg-[#18112d] border border-[#2f1f54] rounded-2xl p-3 inline-block max-w-full">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            onClick={() => onProfileClick(comment.authorId)}
                            className="font-bold text-xs text-yellow-300 hover:underline cursor-pointer"
                          >
                            {comment.authorName}
                          </span>
                          {comment.isVerified && (
                            <CheckCircle2 className="w-3 h-3 fill-yellow-400 text-black" />
                          )}
                          {comment.kind && (
                            <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-800/40">
                              {comment.kind === 'celebrity' && '🎬 Star'}
                              {comment.kind === 'character' && '🦸 Hero'}
                              {comment.kind === 'anime' && '⛩️ Anime'}
                              {comment.kind === 'waifu' && '🌸 Waifu'}
                              {comment.kind === 'normal_user' && '👤 Member'}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-200 text-xs sm:text-sm mt-1 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 pl-2">
                        <span>❤️ {comment.likesCount}</span>
                        <span aria-hidden="true">·</span>
                        <button
                          onClick={() => setActiveReplyBox(activeReplyBox === comment.id ? null : comment.id)}
                          className="hover:text-yellow-400 font-semibold cursor-pointer text-yellow-400"
                        >
                          Reply (Free 0⚡)
                        </button>
                        <span aria-hidden="true">·</span>
                        <span>{comment.timestamp}</span>
                      </div>

                      {/* Thread Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 space-y-2 border-l-2 border-[#382363] pl-3 ml-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-2">
                              <SafeImage
                                src={reply.authorAvatar}
                                alt={reply.authorName}
                                fallbackType="avatar"
                                authorName={reply.authorName}
                                kind={reply.kind}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500 mt-0.5"
                              />
                              <div className="bg-[#1f153a] border border-[#3b276b] rounded-xl p-2.5 text-xs max-w-full">
                                <div className="flex items-center gap-1 font-semibold text-yellow-300">
                                  <span>{reply.authorName}</span>
                                  {reply.isVerified && (
                                    <CheckCircle2 className="w-3 h-3 fill-yellow-400 text-black" />
                                  )}
                                </div>
                                <p className="text-zinc-200 mt-0.5">{reply.content}</p>
                                <div className="text-[10px] text-zinc-400 mt-1">
                                  {reply.timestamp} · ❤️ {reply.likesCount}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Box */}
                      {activeReplyBox === comment.id && (
                        <div className="mt-2 flex items-center gap-2 pl-2">
                          <input
                            type="text"
                            placeholder={`Reply to ${comment.authorName}...`}
                            value={replyInputMap[comment.id] || ''}
                            onChange={(e) =>
                              setReplyInputMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendReply(comment.id);
                            }}
                            className="flex-1 bg-[#160f29] border border-[#402a70] rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
                          />
                          <button
                            onClick={() => handleSendReply(comment.id)}
                            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Reactions Explorer */}
          {activeTab === 'reactions' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setReactionFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    reactionFilter === 'all'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-[#18102d] text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({post.celebrityReactions.length})
                </button>
                {(Object.keys(REACTION_CONFIG) as ReactionType[]).map(type => {
                  const count = post.celebrityReactions.filter(r => r.type === type).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={type}
                      onClick={() => setReactionFilter(type)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        reactionFilter === type
                          ? 'bg-yellow-400 text-black'
                          : 'bg-[#18102d] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {REACTION_CONFIG[type].emoji} {count}
                    </button>
                  );
                })}
              </div>

              {/* People List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredReactions.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onProfileClick(r.profileId)}
                    className="p-3 bg-[#18102d] border border-[#322055] rounded-xl flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <SafeImage
                        src={r.avatar}
                        alt={r.name}
                        fallbackType="avatar"
                        authorName={r.name}
                        kind={r.kind}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-yellow-400"
                      />
                      <div>
                        <div className="font-bold text-xs text-yellow-300">{r.name}</div>
                        <div className="text-[10px] text-zinc-400">{r.subtitle}</div>
                      </div>
                    </div>

                    <div className="text-xl" title={REACTION_CONFIG[r.type].label}>
                      {REACTION_CONFIG[r.type].emoji}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Comment Box */}
        <form onSubmit={handleSendComment} className="p-3.5 bg-[#160f2b] border-t border-[#291a47] flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a comment... (Replies cost 0 energy)"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 bg-[#10091f] border border-[#3b276b] rounded-full px-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="p-2.5 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
