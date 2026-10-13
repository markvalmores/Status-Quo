import {
  ALL_PROFILES,
  ANIME_CHARACTERS,
  CELEBRITIES,
  DIVERSE_HUMAN_COMMENTS,
  INITIAL_POLLS,
  MOVIE_CHARACTERS,
  NORMAL_USERS,
  WAIFU_CHARACTERS
} from '../data/celebrities';
import { CANONICAL_API_VISUALS, generateRandomAiAvatar, generateRandomAiCover } from './characterApiService';
import { generateAiImageForPost } from './imageService';
import { generateBatchOfAiPosts } from './aiGenerator';
import {
  Challenge,
  PollData,
  Post,
  RelationshipGoal,
  UserProfile
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'status_quo_user_profile_v15',
  POSTS: 'status_quo_posts_v15',
  RELATIONSHIP_GOALS: 'status_quo_relationship_goals_v15',
  CHALLENGES: 'status_quo_challenges_v15'
};

// Clean legacy stale cache versions from localStorage
try {
  ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14'].forEach((ver) => {
    localStorage.removeItem(`status_quo_posts_${ver}`);
    localStorage.removeItem(`status_quo_user_profile_${ver}`);
    localStorage.removeItem(`status_quo_relationship_goals_${ver}`);
    localStorage.removeItem(`status_quo_challenges_${ver}`);
  });
} catch {}

const DEFAULT_ANIME_BANNER = 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg';
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/personas/svg?seed=AlexVance_ai_player';

export const INITIAL_USER: UserProfile = {
  id: 'player_main',
  email: 'player@statusquo.game',
  name: 'Alex Vance',
  username: 'alex_status',
  bio: 'Living life one post at a time. Interacting with celebrities, superheroes, anime icons and waifus! 🚀',
  avatar: DEFAULT_AVATAR,
  avatarType: 'image',
  cover: DEFAULT_ANIME_BANNER,
  coverType: 'image',
  followersCount: 245,
  followingCount: 18,
  isVerified: false,
  isAdmin: false,
  isVipSubscriber: false,
  energy: 100,
  maxEnergy: 100,
  lastDailyClaim: '',
  postsCount: 0,
  badgesEarned: [],
  followsBibleVerse: true
};

export const ADMIN_USER: UserProfile = {
  id: 'admin_master',
  email: 'mdv4244@gmail.com',
  name: 'Usagyuun VTuber',
  username: 'usagyuun_official',
  bio: '🌟 Master Admin & Verified Superstar VTuber. Infinite energy & absolute timeline dominance!',
  avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Usagyuun_VTuber_Admin',
  avatarType: 'image',
  cover: 'https://static.tvmaze.com/uploads/images/original_untouched/508/1271784.jpg',
  coverType: 'image',
  followersCount: 2850000,
  followingCount: 150,
  isVerified: true,
  isAdmin: true,
  isVipSubscriber: true,
  energy: 999999,
  maxEnergy: 999999,
  lastDailyClaim: new Date().toISOString(),
  postsCount: 35,
  badgesEarned: ALL_PROFILES.map((p) => p.id),
  followsBibleVerse: true
};

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c_badges_7',
    title: 'Hollywood & Anime Circle (7 Badges)',
    description: 'Collect 7 badges from verified celebrities, movie characters, or anime icons at 100% Relationship Goals.',
    icon: '🏆',
    rewardEnergy: 50,
    rewardFollowers: 15000,
    progress: 0,
    maxProgress: 7,
    completed: false,
    claimed: false
  },
  {
    id: 'c_post_10_day',
    title: 'Daily Viral Machine',
    description: 'Post 10 statuses today to ignite the social algorithm.',
    icon: '🔥',
    rewardEnergy: 25,
    rewardFollowers: 3500,
    progress: 0,
    maxProgress: 10,
    completed: false,
    claimed: false
  },
  {
    id: 'c_1000_followers',
    title: 'The 1,000 Followers Mark',
    description: 'Cross 1,000 followers milestone and gain instant street credit.',
    icon: '📈',
    rewardEnergy: 20,
    rewardFollowers: 1000,
    progress: 245,
    maxProgress: 1000,
    completed: false,
    claimed: false
  },
  {
    id: 'c_gain_1_follower_day',
    title: 'Daily Follower Surge',
    description: 'Gain at least 1 new follower today to keep momentum.',
    icon: '⭐',
    rewardEnergy: 10,
    rewardFollowers: 500,
    progress: 1,
    maxProgress: 1,
    completed: true,
    claimed: false
  },
  {
    id: 'c_daily_login_energy',
    title: 'Daily Social Energy Drop',
    description: 'Claim your daily 10 free social energy refill.',
    icon: '⚡',
    rewardEnergy: 10,
    rewardFollowers: 200,
    progress: 0,
    maxProgress: 1,
    completed: false,
    claimed: false
  }
];

export function getStoredUser(): UserProfile | null {
  try {
    // 1. Check active session storage
    const session = sessionStorage.getItem('status_quo_active_user');
    if (session) return JSON.parse(session);

    // 2. Check local storage if remember me was opted
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.rememberMe) return parsed;
    }
  } catch {}
  return null;
}

export function saveUser(user: UserProfile): void {
  try {
    sessionStorage.setItem('status_quo_active_user', JSON.stringify(user));
    if (user.rememberMe) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
  } catch {}
}

export function logoutUser(): void {
  try {
    sessionStorage.removeItem('status_quo_active_user');
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch {}
}

export function getStoredPosts(): Post[] {
  let playerPosts: Post[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (raw) {
      const parsed: Post[] = JSON.parse(raw);
      // Preserve user-authored posts across page refreshes
      playerPosts = parsed.filter((p) => p.kind === 'normal_user' || p.authorId === 'current_user' || p.authorId === 'player_main');
    }
  } catch {}

  // Generate a brand new batch of 20 AI posts with dynamic high-entropy seeds on every single refresh/day
  const refreshSeedOffset = Math.floor(Math.random() * 9000000) + Date.now() % 50000;
  const freshAiPosts = generateBatchOfAiPosts(20, refreshSeedOffset);

  const merged = [...playerPosts, ...freshAiPosts];
  savePosts(merged);
  return merged;
}

export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch {}
}

export function getStoredRelationshipGoals(): RelationshipGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RELATIONSHIP_GOALS);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Initial starter relationship goal
  return [
    {
      profileId: 'spiderman',
      kind: 'character',
      name: 'Spider-Man',
      subtitle: 'Marvel Cinematic Universe / Queens NYC',
      avatar: CANONICAL_API_VISUALS.spiderman.avatar,
      badgeUnlocked: false,
      humor: 45,
      aura: 60,
      fondness: 50,
      recommendedFriends: false,
      unlockedAt: new Date().toLocaleDateString()
    }
  ];
}

export function saveRelationshipGoals(goals: RelationshipGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RELATIONSHIP_GOALS, JSON.stringify(goals));
  } catch {}
}

export function getStoredChallenges(): Challenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CHALLENGES;
}

export function saveChallenges(challenges: Challenge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch {}
}

export function checkDailyEnergyBonus(user: UserProfile): { canClaim: boolean; hoursRemaining: number } {
  if (!user.lastDailyClaim) {
    return { canClaim: true, hoursRemaining: 0 };
  }
  const lastDate = new Date(user.lastDailyClaim).getTime();
  const now = Date.now();
  const diffHours = (now - lastDate) / (1000 * 60 * 60);

  if (diffHours >= 24) {
    return { canClaim: true, hoursRemaining: 0 };
  }
  return { canClaim: false, hoursRemaining: Math.ceil(24 - diffHours) };
}
