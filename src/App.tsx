import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Users,
  CheckCircle2,
  Image as ImageIcon,
  Smile,
  Crown,
  Award,
  BookOpen,
  Filter,
  Flame,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Share2,
  Film,
  BarChart2,
  Heart,
  RefreshCw,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { FeedPostCard } from './components/FeedPostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { ProfileModal } from './components/ProfileModal';
import { RelationshipGoalsModal } from './components/RelationshipGoalsModal';
import { ChallengesModal } from './components/ChallengesModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CelebrityProfileModal } from './components/CelebrityProfileModal';
import { BibleVerseCard } from './components/BibleVerseCard';
import { ViewPostModal } from './components/ViewPostModal';
import {
  ALL_PROFILES,
  ANIME_CHARACTERS,
  CELEBRITIES,
  MOVIE_CHARACTERS,
  WAIFU_CHARACTERS
} from './data/celebrities';
import {
  fetchDailyBibleVerse
} from './services/apiService';
import { resolveProfileVisualsViaApi } from './services/characterApiService';
import {
  simulateSocialExplosion,
  generateThreadReply,
  generateBatchOfAiPosts
} from './services/aiGenerator';
import {
  getStoredUser,
  saveUser,
  logoutUser,
  getStoredPosts,
  savePosts,
  getStoredRelationshipGoals,
  saveRelationshipGoals,
  getStoredChallenges,
  saveChallenges,
  checkDailyEnergyBonus,
  ADMIN_USER
} from './services/storageService';
import {
  BibleVerse,
  Challenge,
  PollData,
  Post,
  ProfileKind,
  ReactionType,
  RelationshipGoal,
  SocialProfile,
  UserProfile
} from './types';

export default function App() {
  // Core Game State - Gated by Login/Sign Up
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [posts, setPosts] = useState<Post[]>(() => getStoredPosts());
  const [relationshipGoals, setRelationshipGoals] = useState<RelationshipGoal[]>(() =>
    getStoredRelationshipGoals()
  );
  const [challenges, setChallenges] = useState<Challenge[]>(() => getStoredChallenges());
  const [feedFilter, setFeedFilter] = useState<
    'all' | 'player' | 'celebrities' | 'characters' | 'anime' | 'waifus'
  >('all');

  // Daily Bible Verse State
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);

  // Modals & Panels
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  // Endless scrolling state
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Floating notification toast
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    icon?: string;
  } | null>(null);

  // Load daily Bible Verse & Waifu API Profile Pictures
  useEffect(() => {
    loadVerse();
    loadWaifuApiVisuals();
  }, []);

  const loadWaifuApiVisuals = async () => {
    try {
      for (const waifu of WAIFU_CHARACTERS) {
        const liveVisuals = await resolveProfileVisualsViaApi(waifu.name, 'waifu', waifu.id, true);
        if (liveVisuals?.avatar) {
          waifu.avatar = liveVisuals.avatar;
          if (liveVisuals.cover) waifu.coverImage = liveVisuals.cover;
        }
      }
    } catch (err) {
      console.warn('[Waifu API Startup] Error loading waifu visuals:', err);
    }
  };

  const loadVerse = async () => {
    setIsLoadingVerse(true);
    try {
      const verse = await fetchDailyBibleVerse();
      setDailyVerse(verse);
    } finally {
      setIsLoadingVerse(false);
    }
  };

  const showToast = (title: string, description: string, icon = '✨') => {
    setToastMessage({ title, description, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Endless Scrolling window listener
  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 800
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [posts.length, isLoadingMore, user]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      const newPosts = generateBatchOfAiPosts(8, posts.length);
      setPosts((prev) => {
        const merged = [...prev, ...newPosts];
        savePosts(merged);
        return merged;
      });
      setIsLoadingMore(false);
    }, 250);
  };

  const handleRefreshTimeline = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const refreshOffset = Math.floor(Math.random() * 9000000) + Date.now() % 50000;
      const freshPosts = generateBatchOfAiPosts(20, refreshOffset);
      const playerPosts = posts.filter((p) => p.authorId === user?.id || p.kind === 'normal_user');
      const merged = [...playerPosts, ...freshPosts];
      setPosts(merged);
      savePosts(merged);
      setIsLoadingMore(false);
      showToast(
        'Timeline Refreshed!',
        'Loaded 20 fresh, non-repeating real API posts from Anime, Waifu, Movies & Celebrities!',
        '✨'
      );
    }, 250);
  };

  // If user is not signed up / logged in, enforce AuthScreen
  if (!user) {
    return (
      <AuthScreen
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          saveUser(loggedInUser);
        }}
      />
    );
  }

  const { canClaim } = checkDailyEnergyBonus(user);

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  // Claim Daily Free +10 Energy
  const handleClaimDailyEnergy = () => {
    if (user.isAdmin) return;
    const newEnergy = Math.min(user.maxEnergy, user.energy + 10);
    const updatedUser: UserProfile = {
      ...user,
      energy: newEnergy,
      lastDailyClaim: new Date().toISOString()
    };
    setUser(updatedUser);
    saveUser(updatedUser);

    const updatedChallenges = challenges.map((c) => {
      if (c.id === 'c_daily_login_energy') {
        return { ...c, progress: 1, completed: true };
      }
      return c;
    });
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);

    confetti({ particleCount: 70, spread: 50 });
    showToast(
      'Daily Energy Drop Claimed!',
      'You received +10 Free Social Energy. Go post and ignite the timeline!',
      '⚡'
    );
  };

  // Handle New Post Submission
  const handleCreatePost = (data: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    feeling?: string;
    tags?: string[];
    poll?: PollData;
  }) => {
    const hasUnlimited = user.isAdmin || user.isVipSubscriber;
    if (!hasUnlimited && user.energy < 1) {
      setIsSubscriptionOpen(true);
      return;
    }

    const updatedEnergy = hasUnlimited ? user.energy : Math.max(0, user.energy - 1);

    const followedIds = new Set(relationshipGoals.map((g) => g.profileId));
    const unfollowedProfiles = ALL_PROFILES.filter((p) => !followedIds.has(p.id));

    // Simulate AI Reactions, 15-85 unique non-repetitive comments, upvotes & shares
    const sim = simulateSocialExplosion(data.content, unfollowedProfiles, data.poll);

    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      content: data.content,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      timestamp: 'Just now',
      reactions: sim.reactions,
      celebrityReactions: sim.celebrityReactions,
      upvotes: sim.upvotes,
      downvotes: sim.downvotes,
      poll: sim.updatedPoll || data.poll,
      comments: sim.comments,
      shares: sim.shares,
      isPinned: sim.isPinned,
      pinnedBy: sim.pinnedBy,
      pinnedSubtitle: sim.pinnedSubtitle,
      feeling: data.feeling,
      tags: data.tags
    };

    const newFollowerCount = user.followersCount + sim.followersGained;
    const unlockedVerified = !user.isVerified && newFollowerCount >= 100000;

    let updatedBadges = [...user.badgesEarned];

    // Boost currently following profiles in Relationship Goals by +0.5% each
    let friendRecommendationBonusFollowers = 0;
    const updatedGoals = relationshipGoals.map((goal) => {
      const nextHumor = Math.min(100, goal.humor + 0.5);
      const nextAura = Math.min(100, goal.aura + 0.5);
      const nextFondness = Math.min(100, goal.fondness + 0.5);

      let unlockedBadge = goal.badgeUnlocked;
      let recFriends = goal.recommendedFriends;

      if (nextHumor >= 100 && nextAura >= 100 && nextFondness >= 100 && !goal.recommendedFriends) {
        recFriends = true;
        unlockedBadge = true;
        if (!updatedBadges.includes(goal.profileId)) {
          updatedBadges.push(goal.profileId);
        }
        friendRecommendationBonusFollowers += 9500;
        showToast(
          `100% Relationship Goal Reached!`,
          `${goal.name} recommended their circle! +9,500 followers & Verified Badge unlocked!`,
          '🏆'
        );
      }

      return {
        ...goal,
        humor: nextHumor,
        aura: nextAura,
        fondness: nextFondness,
        badgeUnlocked: unlockedBadge,
        recommendedFriends: recFriends
      };
    });

    if (sim.newProfileFollower) {
      const newFollower = sim.newProfileFollower;
      const initialGoal: RelationshipGoal = {
        profileId: newFollower.id,
        kind: newFollower.kind,
        name: newFollower.name,
        subtitle: newFollower.subtitle,
        avatar: newFollower.avatar,
        badgeUnlocked: false,
        humor: Math.floor(Math.random() * 25) + 30,
        aura: Math.floor(Math.random() * 25) + 35,
        fondness: Math.floor(Math.random() * 25) + 30,
        recommendedFriends: false,
        unlockedAt: new Date().toLocaleDateString()
      };
      updatedGoals.push(initialGoal);
      showToast(
        `⭐ 11% Miracle: New AI VIP Follower!`,
        `${newFollower.name} (${newFollower.subtitle}) just followed your profile! Added to Relationship Goals!`,
        '✨'
      );
    }

    const totalNewFollowers = newFollowerCount + friendRecommendationBonusFollowers;

    // Update Challenges progress
    const updatedChallenges = challenges.map((ch) => {
      if (ch.id === 'c_post_10_day') {
        const next = Math.min(ch.maxProgress, ch.progress + 1);
        return { ...ch, progress: next, completed: next >= ch.maxProgress };
      }
      if (ch.id === 'c_1000_followers') {
        const next = Math.min(ch.maxProgress, totalNewFollowers);
        return { ...ch, progress: next, completed: next >= ch.maxProgress };
      }
      if (ch.id === 'c_badges_7') {
        const next = Math.min(ch.maxProgress, updatedBadges.length);
        return { ...ch, progress: next, completed: next >= ch.maxProgress };
      }
      return ch;
    });

    const updatedUser: UserProfile = {
      ...user,
      energy: updatedEnergy,
      followersCount: totalNewFollowers,
      postsCount: user.postsCount + 1,
      isVerified: user.isVerified || unlockedVerified,
      badgesEarned: updatedBadges
    };

    const newPostList = [newPost, ...posts];
    setPosts(newPostList);
    savePosts(newPostList);
    setUser(updatedUser);
    saveUser(updatedUser);
    setRelationshipGoals(updatedGoals);
    saveRelationshipGoals(updatedGoals);
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);

    if (unlockedVerified) {
      confetti({ particleCount: 200, spread: 100 });
      showToast(
        '🌟 100,000 FOLLOWERS REACHED!',
        'You are officially VERIFIED! The gold badge now shines on your profile!',
        '👑'
      );
    } else {
      confetti({ particleCount: 60, spread: 45 });
      showToast(
        'Post Published Successfully!',
        `+${sim.followersGained.toLocaleString()} Followers gained! Hollywood, superheroes & anime stars reacted!`,
        '🔥'
      );
    }
  };

  // Upvote / Downvote post
  const handleVote = (postId: string, direction: 'up' | 'down') => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        let up = p.upvotes;
        let down = p.downvotes;
        let current = p.userVote;

        if (current === direction) {
          if (direction === 'up') up--;
          if (direction === 'down') down--;
          current = undefined;
        } else {
          if (current === 'up') up--;
          if (current === 'down') down--;

          if (direction === 'up') up++;
          if (direction === 'down') down++;
          current = direction;
        }

        const res = { ...p, upvotes: Math.max(0, up), downvotes: Math.max(0, down), userVote: current };
        if (viewingPost && viewingPost.id === postId) {
          setViewingPost(res);
        }
        return res;
      }
      return p;
    });
    setPosts(updated);
    savePosts(updated);
  };

  // Poll Vote
  const handlePollVote = (postId: string, optionId: string) => {
    const updated = posts.map((p) => {
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

        if (!p.poll.userVotedOptionId) {
          totalVotes++;
        }

        const poll = {
          ...p.poll,
          options,
          totalVotes,
          userVotedOptionId: optionId
        };
        const res = { ...p, poll };
        if (viewingPost && viewingPost.id === postId) {
          setViewingPost(res);
        }
        return res;
      }
      return p;
    });
    setPosts(updated);
    savePosts(updated);
  };

  // React to a post
  const handleReactToPost = (postId: string, reactionType: ReactionType) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        const prev = p.userReaction;
        const newReactions = { ...p.reactions };

        if (prev) {
          newReactions[prev] = Math.max(0, newReactions[prev] - 1);
        }
        const userReaction = prev === reactionType ? undefined : reactionType;
        if (userReaction) {
          newReactions[userReaction] = (newReactions[userReaction] || 0) + 1;
        }

        const res = { ...p, userReaction, reactions: newReactions };
        if (viewingPost && viewingPost.id === postId) {
          setViewingPost(res);
        }
        return res;
      }
      return p;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  // Add Comment (costs 0 energy)
  const handleAddComment = (postId: string, content: string) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        const newComment = {
          id: `comm_${Date.now()}`,
          authorId: user.id,
          authorName: user.name,
          authorAvatar: user.avatar,
          isVerified: user.isVerified,
          content,
          timestamp: 'Just now',
          likesCount: 1,
          replies: []
        };
        const res = { ...p, comments: [...p.comments, newComment] };
        if (viewingPost && viewingPost.id === postId) {
          setViewingPost(res);
        }
        return res;
      }
      return p;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  // Reply to Comment (AI responds back in thread for 0 energy)
  const handleAddReply = (postId: string, commentId: string, replyText: string) => {
    const post = posts.find((p) => p.id === postId);
    const parentComment = post?.comments.find((c) => c.id === commentId);

    const userReply = {
      id: `rep_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      isVerified: user.isVerified,
      content: replyText,
      timestamp: 'Just now',
      likesCount: 1
    };

    let aiReply: any = null;
    if (parentComment?.authorId && parentComment.authorId !== user.id) {
      const generated = generateThreadReply(
        parentComment.authorName,
        parentComment.authorId,
        replyText
      );
      aiReply = {
        id: `rep_ai_${Date.now() + 1}`,
        authorId: parentComment.authorId,
        authorName: parentComment.authorName,
        authorSubtitle: parentComment.authorSubtitle,
        authorAvatar: parentComment.authorAvatar,
        kind: parentComment.kind,
        isVerified: true,
        content: generated.replyText,
        timestamp: 'Just now',
        likesCount: generated.likes
      };
    }

    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        const updatedComments = p.comments.map((comm) => {
          if (comm.id === commentId) {
            const replies = [...comm.replies, userReply];
            if (aiReply) replies.push(aiReply);
            return { ...comm, replies };
          }
          return comm;
        });
        const res = { ...p, comments: updatedComments };
        if (viewingPost && viewingPost.id === postId) {
          setViewingPost(res);
        }
        return res;
      }
      return p;
    });

    setPosts(updatedPosts);
    savePosts(updatedPosts);

    if (aiReply) {
      showToast(
        `Thread Reply: ${parentComment?.authorName}`,
        `Replied: "${aiReply.content.slice(0, 60)}..."`,
        '💬'
      );
    }
  };

  const handleSharePost = (post: Post) => {
    const updatedUser = {
      ...user,
      followersCount: user.followersCount + Math.floor(Math.random() * 400) + 150
    };
    setUser(updatedUser);
    saveUser(updatedUser);

    showToast(
      'Shared to your timeline!',
      `You shared ${post.authorName}'s post! Your follower network expanded.`,
      '🚀'
    );
  };

  const handleToggleBibleFollow = () => {
    const updated = { ...user, followsBibleVerse: !user.followsBibleVerse };
    setUser(updated);
    saveUser(updated);

    showToast(
      updated.followsBibleVerse ? 'Following Daily Scripture' : 'Unfollowed Daily Scripture',
      updated.followsBibleVerse
        ? 'Daily verses from the Bible API will appear on your For You feed.'
        : 'Daily verses removed from your home feed.',
      '🕊️'
    );
  };

  const handleAdminLoginSuccess = () => {
    setUser(ADMIN_USER);
    saveUser(ADMIN_USER);
    showToast(
      'Master Admin Verified: Usagyuun VTuber',
      'Unlimited Social Energy, verified status, and god mode unlocked!',
      '👑'
    );
  };

  const handleSubscriptionSuccess = () => {
    const updated: UserProfile = {
      ...user,
      isVipSubscriber: true,
      energy: 999999,
      maxEnergy: 999999
    };
    setUser(updated);
    saveUser(updated);
    showToast(
      'Status Quo VIP Pass Activated',
      'Unlimited posts unlocked! Thank you for subscribing.',
      '⭐'
    );
  };

  const handleClaimChallengeReward = (challengeId: string) => {
    const ch = challenges.find((c) => c.id === challengeId);
    if (!ch || ch.claimed) return;

    const newEnergy = Math.min(user.maxEnergy, user.energy + ch.rewardEnergy);
    const newFollowers = user.followersCount + ch.rewardFollowers;

    const updatedUser: UserProfile = {
      ...user,
      energy: newEnergy,
      followersCount: newFollowers
    };
    setUser(updatedUser);
    saveUser(updatedUser);

    const updatedChallenges = challenges.map((c) =>
      c.id === challengeId ? { ...c, claimed: true } : c
    );
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);

    showToast(
      `Reward Claimed: ${ch.title}`,
      `+${ch.rewardEnergy} Energy & +${ch.rewardFollowers.toLocaleString()} Followers added!`,
      '🏆'
    );
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (feedFilter === 'player') return p.authorId === user.id;
    if (feedFilter === 'celebrities') return p.kind === 'celebrity';
    if (feedFilter === 'characters') return p.kind === 'character';
    if (feedFilter === 'anime') return p.kind === 'anime';
    if (feedFilter === 'waifus') return p.kind === 'waifu';
    return true;
  });

  const unclaimedChallengesCount = challenges.filter((c) => c.completed && !c.claimed).length;

  return (
    <div className="min-h-screen bg-[#0b0a12] text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-yellow-300">
      {/* Top Navigation */}
      <Navbar
        user={user}
        canClaimDaily={canClaim}
        onClaimDaily={handleClaimDailyEnergy}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenGoals={() => setIsGoalsOpen(true)}
        onOpenChallenges={() => setIsChallengesOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onToggleBibleFollow={handleToggleBibleFollow}
        onLogout={handleLogout}
        relationshipCount={relationshipGoals.length}
        unclaimedChallengesCount={unclaimedChallengesCount}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#191030] border-2 border-yellow-400/80 rounded-2xl p-4 shadow-2xl shadow-yellow-500/20 max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom duration-200">
          <span className="text-2xl mt-0.5">{toastMessage.icon}</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-yellow-300">{toastMessage.title}</h4>
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              {toastMessage.description}
            </p>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile Card & Shortcuts */}
        <div className="hidden lg:block lg:col-span-3 space-y-5">
          {/* User Mini Card */}
          <div className="bg-[#120d22] border border-[#271b45] rounded-3xl p-5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-900/60 via-purple-700/40 to-yellow-600/30 overflow-hidden">
              <img
                src={user.cover}
                alt="Banner"
                className="w-full h-full object-cover opacity-50"
              />
            </div>

            <div className="relative pt-6 flex flex-col items-center text-center">
              <div
                onClick={() => setIsProfileOpen(true)}
                className="relative cursor-pointer group-hover:scale-105 transition"
              >
                <div className="w-20 h-20 rounded-2xl ring-4 ring-[#120d22] border-2 border-yellow-400 overflow-hidden bg-purple-950 shadow-xl">
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
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-0.5 border border-[#120d22]">
                    <CheckCircle2 className="w-4 h-4 fill-yellow-400 text-black" />
                  </div>
                )}
              </div>

              <h3
                onClick={() => setIsProfileOpen(true)}
                className="font-display font-extrabold text-lg text-zinc-100 hover:text-yellow-300 transition cursor-pointer mt-3"
              >
                {user.name}
              </h3>
              <p className="text-xs text-yellow-400 font-mono">@{user.username}</p>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                {user.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-[#231542] text-xs">
                <div className="bg-[#170f2b] p-2 rounded-xl">
                  <div className="text-zinc-400 text-[10px]">Followers</div>
                  <div className="font-extrabold text-sm text-yellow-300 font-mono">
                    {user.followersCount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#170f2b] p-2 rounded-xl">
                  <div className="text-zinc-400 text-[10px]">Energy</div>
                  <div className="font-extrabold text-sm text-yellow-300 font-mono">
                    {user.isAdmin || user.isVipSubscriber ? '∞' : user.energy}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-full mt-4 py-2 rounded-xl bg-[#1d1238] hover:bg-[#281a4b] border border-[#3e276b] text-xs font-bold text-yellow-300 transition cursor-pointer"
              >
                View & Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="bg-[#120d22] border border-[#271b45] rounded-3xl p-4 shadow-xl space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2 mb-3">
              Timeline Circles
            </h4>

            <button
              onClick={() => setFeedFilter('all')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                feedFilter === 'all'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-300 hover:bg-[#1a1230]'
              }`}
            >
              <span>🔥 Master Feed (All Posts)</span>
              <span className="font-mono text-[10px]">{posts.length}</span>
            </button>

            <button
              onClick={() => setFeedFilter('player')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                feedFilter === 'player'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-300 hover:bg-[#1a1230]'
              }`}
            >
              <span>👤 My Posts</span>
              <span className="font-mono text-[10px]">{posts.filter(p => p.authorId === user.id).length}</span>
            </button>

            <button
              onClick={() => setFeedFilter('celebrities')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                feedFilter === 'celebrities'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-300 hover:bg-[#1a1230]'
              }`}
            >
              <span>🎬 Real Celebrities</span>
              <span className="font-mono text-[10px]">{CELEBRITIES.length}</span>
            </button>

            <button
              onClick={() => setFeedFilter('characters')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                feedFilter === 'characters'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-300 hover:bg-[#1a1230]'
              }`}
            >
              <span>🦸 Movie Characters</span>
              <span className="font-mono text-[10px]">{MOVIE_CHARACTERS.length}</span>
            </button>

            <button
              onClick={() => setFeedFilter('anime')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                feedFilter === 'anime'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-300 hover:bg-[#1a1230]'
              }`}
            >
              <span>⛩️ Anime Icons (Jikan API)</span>
              <span className="font-mono text-[10px]">{ANIME_CHARACTERS.length}</span>
            </button>

            <button
              onClick={() => setFeedFilter('waifus')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                feedFilter === 'waifus'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-300 hover:bg-[#1a1230]'
              }`}
            >
              <span>🌸 Waifus (Waifu API)</span>
              <span className="font-mono text-[10px]">{WAIFU_CHARACTERS.length}</span>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: FEED & POST COMPOSER */}
        <div className="col-span-1 lg:col-span-6 space-y-4">
          
          {/* Post Creation Bar (Facebook Style) */}
          <div className="bg-[#120d22] border border-[#271b45] rounded-3xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div
                onClick={() => setIsProfileOpen(true)}
                className="w-11 h-11 rounded-full ring-2 ring-yellow-400/80 overflow-hidden cursor-pointer flex-shrink-0 bg-purple-950"
              >
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
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                )}
              </div>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 text-left bg-[#18102d] hover:bg-[#20153b] border border-[#35255c] rounded-full px-4 py-3 text-xs sm:text-sm text-zinc-400 transition cursor-pointer"
              >
                What's on your mind, {user.name.split(' ')[0]}? Post to ignite the AI stars...
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#231542] text-xs">
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="py-2 rounded-xl hover:bg-[#1b1233] text-zinc-300 hover:text-yellow-300 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Photo</span>
              </button>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="py-2 rounded-xl hover:bg-[#1b1233] text-zinc-300 hover:text-yellow-300 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Video className="w-4 h-4 text-rose-400" />
                <span>Video MP4</span>
              </button>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="py-2 rounded-xl hover:bg-[#1b1233] text-zinc-300 hover:text-yellow-300 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <BarChart2 className="w-4 h-4 text-yellow-400" />
                <span>Poll</span>
              </button>
            </div>
          </div>

          {/* Daily Scripture Card if user follows */}
          {user.followsBibleVerse && (
            <BibleVerseCard
              verse={dailyVerse}
              isFollowing={user.followsBibleVerse}
              onToggleFollow={handleToggleBibleFollow}
              onRefreshVerse={loadVerse}
              isLoading={isLoadingVerse}
            />
          )}

          {/* Feed Filter Chips on Mobile */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(['all', 'player', 'celebrities', 'characters', 'anime', 'waifus'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFeedFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  feedFilter === tab
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'bg-[#160f2b] text-zinc-300 border border-[#2f1f50]'
                }`}
              >
                {tab === 'all' && '🔥 All Posts'}
                {tab === 'player' && '👤 My Posts'}
                {tab === 'celebrities' && '🎬 Celebrities'}
                {tab === 'characters' && '🦸 Characters'}
                {tab === 'anime' && '⛩️ Anime'}
                {tab === 'waifus' && '🌸 Waifus'}
              </button>
            ))}
          </div>

          {/* Refresh Timeline Action Bar */}
          <div className="flex items-center justify-between bg-[#120d22] border border-[#271b45] rounded-2xl px-4 py-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-300">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>Real API Social Feed (Anime, Waifu, Movies & Stars)</span>
            </div>
            <button
              onClick={handleRefreshTimeline}
              disabled={isLoadingMore}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 hover:from-purple-500 hover:to-yellow-400 text-black font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMore ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-[#120d22] border border-[#271b45] rounded-3xl p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto" />
                <h3 className="font-display font-extrabold text-base text-zinc-200">
                  No Posts in this Circle
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Be the first to publish a status, share a thought, or drop a poll!
                </p>
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-extrabold text-xs shadow cursor-pointer"
                >
                  Create Status (⚡ 1 Energy)
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <FeedPostCard
                  key={post.id}
                  post={post}
                  currentUser={user}
                  onReact={handleReactToPost}
                  onVote={handleVote}
                  onPollVote={handlePollVote}
                  onAddComment={handleAddComment}
                  onAddReply={handleAddReply}
                  onShare={handleSharePost}
                  onPin={() => {}}
                  onProfileClick={(id) => setSelectedProfileId(id)}
                  onViewPost={(p) => setViewingPost(p)}
                />
              ))
            )}
          </div>

          {/* Endless Scroll Trigger / Load More Button */}
          <div className="pt-4 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-2xl bg-[#160f2b] hover:bg-[#221644] border border-[#3b276b] text-yellow-300 text-xs font-bold transition flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMore ? 'animate-spin' : ''}`} />
              <span>{isLoadingMore ? 'Loading Endless Feed...' : 'Scroll Down or Click for More Endless Posts'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Trending VIP Personas & Goals */}
        <div className="hidden lg:block lg:col-span-3 space-y-5">
          {/* Spotlight AI Personas */}
          <div className="bg-[#120d22] border border-[#271b45] rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span>Featured VIP Personas</span>
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">11% follow chance</span>
            </div>

            <div className="space-y-2.5">
              {ALL_PROFILES.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#1a1230] border border-transparent hover:border-[#382463] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#3b2569] group-hover:ring-yellow-400 transition bg-purple-950 flex-shrink-0">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-zinc-100 group-hover:text-yellow-300">
                          {p.name}
                        </span>
                        <CheckCircle2 className="w-3 h-3 fill-yellow-400 text-black" />
                      </div>
                      <span className="text-[10px] text-zinc-400 block line-clamp-1">
                        {p.subtitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-zinc-500 group-hover:text-yellow-400 font-bold">
                    View →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship Goals Widget */}
          <div className="bg-[#120d22] border border-[#271b45] rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Relationship Goals ({relationshipGoals.length})</span>
              </h4>
              <button
                onClick={() => setIsGoalsOpen(true)}
                className="text-[10px] text-yellow-400 hover:underline font-bold cursor-pointer"
              >
                View All
              </button>
            </div>

            {relationshipGoals.length === 0 ? (
              <p className="text-xs text-zinc-400 py-2 leading-relaxed">
                Post regularly! There is an 11% chance a verified star will follow you and enter your goals!
              </p>
            ) : (
              <div className="space-y-2">
                {relationshipGoals.slice(0, 3).map((g) => (
                  <div
                    key={g.profileId}
                    onClick={() => setIsGoalsOpen(true)}
                    className="p-2.5 bg-[#170f2b] rounded-2xl border border-[#311f56] flex items-center justify-between cursor-pointer hover:border-yellow-400/50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <img src={g.avatar} alt={g.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-xs text-zinc-200">{g.name}</div>
                        <div className="text-[10px] text-yellow-400 font-mono">
                          {((g.humor + g.aura + g.fondness) / 3).toFixed(1)}% Affinity
                        </div>
                      </div>
                    </div>
                    {g.badgeUnlocked ? (
                      <span className="text-xs">🏆</span>
                    ) : (
                      <span className="text-[10px] text-zinc-400">+0.5%/post</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentUser={user}
        onSubmitPost={handleCreatePost}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
      />

      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdateUser={(updated) => {
          setUser(updated);
          saveUser(updated);
        }}
        onLogout={handleLogout}
      />

      <RelationshipGoalsModal
        isOpen={isGoalsOpen}
        onClose={() => setIsGoalsOpen(false)}
        goals={relationshipGoals}
        onClaimBadge={(profileId) => {
          const profile = ALL_PROFILES.find(p => p.id === profileId);
          if (profile && !user.badgesEarned.includes(profileId)) {
            const updatedBadges = [...user.badgesEarned, profileId];
            const updatedUser = { ...user, badgesEarned: updatedBadges };
            setUser(updatedUser);
            saveUser(updatedUser);
            confetti({ particleCount: 150, spread: 90 });
            showToast(
              'Verified Badge Claimed!',
              `You unlocked ${profile.name}'s verified profile badge for your trophy collection!`,
              '🏆'
            );
          }
        }}
        onProfileClick={(profileId: string) => {
          setIsGoalsOpen(false);
          setSelectedProfileId(profileId);
        }}
      />

      <ChallengesModal
        isOpen={isChallengesOpen}
        onClose={() => setIsChallengesOpen(false)}
        challenges={challenges}
        onClaimReward={handleClaimChallengeReward}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        onSuccess={handleSubscriptionSuccess}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

      <CelebrityProfileModal
        profileId={selectedProfileId}
        currentUser={user}
        onClose={() => setSelectedProfileId(null)}
        relationshipGoal={relationshipGoals.find(g => g.profileId === selectedProfileId)}
        onViewPost={(p) => setViewingPost(p)}
        onPollVote={handlePollVote}
        onAddPost={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
          savePosts([newPost, ...posts]);
        }}
      />

      <ViewPostModal
        post={viewingPost}
        currentUser={user}
        isOpen={!!viewingPost}
        onClose={() => setViewingPost(null)}
        onReact={handleReactToPost}
        onVote={handleVote}
        onPollVote={handlePollVote}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onShare={handleSharePost}
        onProfileClick={(id) => {
          setViewingPost(null);
          setSelectedProfileId(id);
        }}
      />
    </div>
  );
}
