export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | 'mindblown' | 'heroic';

export type ProfileKind = 'celebrity' | 'character' | 'anime' | 'waifu' | 'normal_user';

export interface ReactionCount {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
  mindblown: number;
  heroic: number;
}

export interface CelebrityReaction {
  id: string;
  profileId: string;
  name: string;
  subtitle: string;
  avatar: string;
  kind: ProfileKind;
  type: ReactionType;
}

export interface CommentReply {
  id: string;
  authorId: string;
  authorName: string;
  authorSubtitle?: string;
  authorAvatar: string;
  kind?: ProfileKind;
  isVerified: boolean;
  content: string;
  timestamp: string;
  likesCount: number;
  isLikedByPlayer?: boolean;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorSubtitle?: string;
  authorAvatar: string;
  kind?: ProfileKind;
  isVerified: boolean;
  content: string;
  timestamp: string;
  likesCount: number;
  isLikedByPlayer?: boolean;
  replies: CommentReply[];
}

export interface PostShare {
  id: string;
  profileId: string;
  name: string;
  subtitle: string;
  avatar: string;
  kind: ProfileKind;
  quote?: string;
  timestamp: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  id?: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorSubtitle?: string;
  authorAvatar: string;
  kind?: ProfileKind;
  isVerified: boolean;
  isAdmin?: boolean;
  isBibleProfile?: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string;
  reactions: ReactionCount;
  userReaction?: ReactionType;
  celebrityReactions: CelebrityReaction[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  poll?: PollData;
  comments: PostComment[];
  shares: PostShare[];
  isPinned?: boolean;
  pinnedBy?: string;
  pinnedSubtitle?: string;
  tags?: string[];
  feeling?: string;
}

export interface SocialProfile {
  id: string;
  kind: ProfileKind;
  name: string;
  subtitle: string;
  avatar: string;
  coverImage: string;
  coverType?: 'image' | 'video';
  bio: string;
  verifiedBadge: boolean;
  badgeIcon: string;
  personality: string;
  sampleQuotes: string[];
  reactionsStyle: ReactionType[];
  tags: string[];
}

export interface RelationshipGoal {
  profileId: string;
  kind: ProfileKind;
  name: string;
  subtitle: string;
  avatar: string;
  badgeUnlocked: boolean;
  humor: number; // 0 - 100
  aura: number; // 0 - 100
  fondness: number; // 0 - 100
  recommendedFriends: boolean;
  unlockedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  username: string;
  birthday?: string;
  rememberMe?: boolean;
  bio: string;
  avatar: string;
  avatarType: 'image' | 'video';
  cover: string;
  coverType: 'image' | 'video';
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isAdmin: boolean;
  isVipSubscriber: boolean;
  energy: number;
  maxEnergy: number;
  lastDailyClaim: string;
  postsCount: number;
  badgesEarned: string[];
  followsBibleVerse: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardEnergy: number;
  rewardFollowers: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
}

export interface BibleVerse {
  reference: string;
  text: string;
  version: string;
}
