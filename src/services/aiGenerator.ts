import {
  ALL_PROFILES,
  ANIME_CHARACTERS,
  CELEBRITIES,
  DIVERSE_HUMAN_COMMENTS,
  MOVIE_CHARACTERS,
  NORMAL_USERS,
  WAIFU_CHARACTERS
} from '../data/celebrities';
import { generateRandomAiAvatar } from './characterApiService';
import { getApiMediaForPost, fetchLiveApiImageForPost } from './imageService';
import {
  CelebrityReaction,
  PollData,
  Post,
  PostComment,
  PostShare,
  ReactionCount,
  ReactionType,
  SocialProfile
} from '../types';

interface PostSimulationResult {
  reactions: ReactionCount;
  celebrityReactions: CelebrityReaction[];
  upvotes: number;
  downvotes: number;
  comments: PostComment[];
  shares: PostShare[];
  isPinned: boolean;
  pinnedBy?: string;
  pinnedSubtitle?: string;
  followersGained: number;
  newProfileFollower?: SocialProfile;
  updatedPoll?: PollData;
}

function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, items.length));
}

const HUMAN_NAMES = [
  "Alex Rivera", "Jordan Smith", "Kaito Tanaka", "Elena Rostova", "Devon Vance",
  "Samira Khan", "Lucas Miller", "Hanna Lindqvist", "Marcus Thorne", "Priya Sharma",
  "Gabriel Santos", "Yuki Sato", "Oscar Morales", "Jessica Taylor", "Noah Kim",
  "Chloe Dupont", "Matteo Rossi", "Aaliyah Davis", "Felix Berg", "Ren Takahashi",
  "Sofia Al-Mansoor", "Julian Vance", "Nia Patel", "Damian Cross", "Isabella Rossi",
  "Liam O'Connor", "Camila Fernandez", "Tariq Mansour", "Freja Lind", "Ethan Sterling",
  "Zoe Zimmerman", "Dmitri Volkov", "Amara Okafor", "Kenji Watanabe", "Harper Lee"
];

const SENTIMENT_TEMPLATES = [
  "The emotional clarity here is something most creators strive years for. Excellent work.",
  "Literally stopped my morning routine just to read through this. Truly inspiring.",
  "Can we appreciate how much thought went into every single line here?",
  "This is why I love the Status Quo community. Real conversations, zero pretension.",
  "Upvoted before I even finished reading. Never miss on these posts!",
  "A breath of fresh air in an ocean of noise. Thank you for posting this.",
  "I had a similar experience last week. It's wild how universal these feelings are.",
  "Sending this to my close friends immediately. Perfect perspective.",
  "Everything about this post hits the bullseye. Pure substance.",
  "Genuinely made my day 10 times better. Keep bringing this positive energy!",
  "The pacing and honesty here is unmatched. Deserves to be at the top of the feed.",
  "Couldn't agree more with your sentiment. Keep doing your thing!",
  "Big respect from the community. Your consistency is paying off!",
  "Rare to see such grounded takes on social media nowadays. Hats off."
];

/**
 * Generate in-character comment for any specific profile
 */
function generateContextualComment(profile: SocialProfile, postContent: string, idx: number): string {
  // 1. Real Celebrities
  if (profile.kind === 'celebrity') {
    if (profile.id === 'tom_holland') {
      const quotes = [
        "Mate, this is absolutely brilliant! Sending love from London rehearsals!",
        "Honestly speechless reading this. Reminds me of the adrenaline on a live stage. Smashing work!",
        "My brothers and I just saw this. You're smashing it, keep going!",
        "Class post. Might have to take notes for my next press junket!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'robert_downey_jr') {
      const quotes = [
        "Precision and vision on full display. Tip of the hat to you, my friend.",
        "I love this 3,000 times over. Elegance and raw talent, pure and simple.",
        "Just checked the feed between takes. This is grade-A work, kid.",
        "The Footprint Coalition should invest in whatever energy you're putting into the universe."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'ryan_reynolds') {
      const quotes = [
        "I almost spit my Aviation Gin across the room. Phenomenal comedic timing!",
        "Blake just laughed out loud looking over my shoulder. High praise, believe me.",
        "Hugh Jackman could never craft a status this engaging. Ever.",
        "This post just scored a 90th-minute winner in the social media Premier League."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'dwayne_johnson') {
      const quotes = [
        "4 AM workout done and I see THIS! Blood, sweat, and pure grit! Keep grinding! 🔥",
        "Always be the hardest worker in the room. You're setting the standard!",
        "Mana is through the roof right now! Big love from the Johnson household!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'zendaya') {
      const quotes = [
        "Effortless poise and storytelling. Sending love from Paris fashion week! ✨",
        "You've got that undeniable spark. Never dim it for anyone.",
        "The visual storytelling here? Effortless and stunning."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'taylor_swift') {
      const quotes = [
        "Meet me at midnight... or right here in your comment section! So proud of you! 🫶",
        "Karma is having mutuals as brilliant as this on my timeline!",
        "Enchanted by your perspective! Never stop making magic."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'keanu_reeves') {
      const quotes = [
        "You are breathtaking. Keep putting your soul into what you create.",
        "Just got off the motorcycle and saw this. Real respect, friend.",
        "Be excellent to each other. You're putting genuine good in the world."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'cillian_murphy') {
      const quotes = [
        "Remarkable focus. In a noisy world, restraint like this is rare.",
        "A quiet mastery. Keep your eyes on the craft."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'jenna_ortega') {
      const quotes = [
        "I usually despise social media feeds, but this actually earned my attention.",
        "Black coffee, cello rehearsals, and reading your post. Perfectly balanced."
      ];
      return quotes[idx % quotes.length];
    }
    return profile.sampleQuotes[idx % profile.sampleQuotes.length];
  }

  // 2. Movie Characters
  if (profile.kind === 'character') {
    if (profile.id === 'spiderman') {
      const quotes = [
        "Stopping crime in Queens is great, but taking a break on a flagpole to read this? Even better! 🕷️",
        "With great posts comes great responsibility! You nailed this one!",
        "Swinging between skyscrapers right now, had to drop a heroic like!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'iron_man') {
      const quotes = [
        "Stark Industries mainframes just registered this power output. Jarvis, archive this post. ⚡",
        "Sometimes you gotta run before you can walk. Stark Industries approved.",
        "Kid, you've got arc-reactor energy. Keep innovating!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'deadpool') {
      const quotes = [
        "Wait, did you just break the Fourth Wall or did my taco truck get stolen again?! Maximum Effort! 🌮",
        "I’m sharing this to the TVA monitors so the timeline police can witness greatness.",
        "If Wolverine saw this, he’d grunt and secretly hit like twice."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'batman') {
      const quotes = [
        "The shadows of Gotham are relentless, but your focus cuts right through them. Vigilance approved. 🦇",
        "Alfred alerted the Batcomputer to your post. Approved.",
        "It's not who you are underneath, but what you post that defines you."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'barbie') {
      const quotes = [
        "Hi Barbie! Or Ken! You are radiating pure fabulous Kenergy today! Sending pink hugs! 💖✨",
        "Ken says you have 100% Kenergy, and honestly? Totally agreed!",
        "Every day is the best day ever, and this post made it even better!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'john_wick') {
      const quotes = [
        "Yeah. Focus. Commitment. Sheer will. You have all three. Respect.",
        "People keep asking if I'm back... reading posts like this, yeah, I'm thinking I'm back.",
        "A man of focus and discipline. Quiet respect from the Continental.",
        "Good work. Never lose your focus."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'chani') {
      const quotes = [
        "The desert reveals who you truly are. You stand strong under the twin moons. 🏜️",
        "Your spirit burns bright like the sands of Arrakis. Respect, warrior.",
        "May thy knife chip and shatter. Strong words, friend."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'wednesday_addams') {
      const quotes = [
        "Thing gave this two thumbs up. If he had another thumb, he'd use it. 🕷️",
        "I find social optimism usually nauseating, but your execution is almost morbidly brilliant.",
        "Black coffee, cello rehearsals, and this post. Moderately tolerable morning."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'oppenheimer') {
      const quotes = [
        "Prometheus gave fire to mankind. You just ignited the timeline.",
        "Theory can only take you so far. Execution like this is pure physics.",
        "The mind is an intricate reactor. Fascinating perspective."
      ];
      return quotes[idx % quotes.length];
    }
    return profile.sampleQuotes[idx % profile.sampleQuotes.length];
  }

  // 3. Anime Characters
  if (profile.kind === 'anime') {
    if (profile.id === 'goku') {
      const quotes = [
        "Hey! Your battle power is shooting through the roof! Let's spar after this! KA-ME-HA-ME-HAAA! 🔥",
        "10,000 pushups done and I see THIS! Pure Saiyan determination! Respect!",
        "Whoa! That energy is amazing! I gotta train twice as hard today!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'naruto') {
      const quotes = [
        "Believe it! That's true ninja dedication right there! Ichiraku ramen on me! 🍥",
        "Never give up on your ninja way! You're inspiring the whole village!",
        "Dattebayo! This post is Hokage-level greatness!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'luffy') {
      const quotes = [
        "Shishishi! You have the spirit of the Grand Line! Join my Straw Hat crew! 🍖",
        "That's awesome!! Sanji, bring extra meat to celebrate this post!",
        "I'm gonna be King of the Pirates, and you're gonna be King of the Timeline!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'gojo') {
      const quotes = [
        "Domain Expansion: Infinite Quality! Throughout heaven and earth, your feed alone is honored. 👁️",
        "Lowered my blindfold for half a second. Six Eyes approving this masterpiece!",
        "Don't worry, I'm the strongest, and I officially endorse this post!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'eren') {
      const quotes = [
        "Tatakae! Fight for what you believe in! Keep moving forward!",
        "If you win, you live. If you lose, you die. If you don't fight, you can't win!",
        "Keep pushing forward until your freedom is complete."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'tanjiro') {
      const quotes = [
        "I smell the scent of genuine honesty in your words. Beautifully written! ⚔️",
        "Nezuko tapped her bamboo mouthguard happily looking at this! Great spirit!",
        "Work hard and never lose heart! I am cheering for you!"
      ];
      return quotes[idx % quotes.length];
    }
    return profile.sampleQuotes[idx % profile.sampleQuotes.length];
  }

  // 4. Waifu Characters
  if (profile.kind === 'waifu') {
    if (profile.id === 'rem') {
      const quotes = [
        "Rem believes in you from the bottom of her heart! You are truly extraordinary! 💙",
        "Prepared morning tea at Roswaal mansion and read this post. Such a sunny feeling!",
        "Starting from zero is always possible when you have someone you believe in!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'yor_forger') {
      const quotes = [
        "Oh my! Anya gave this a huge 'Waku Waku!' smile when she saw it! Such a lovely post! 🌹",
        "Loid said this post demonstrates high emotional intelligence! So wonderful!",
        "Protecting peaceful moments like this is the greatest mission in the world!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'makima') {
      const quotes = [
        "Good. You have proven yourself to be quite captivating today. Keep pleasing me. 🩸",
        "Discipline creates necessary harmony. I find your output satisfactory.",
        "A quiet coffee looking over Tokyo. Your dedication has been noticed."
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'marin_kitagawa') {
      const quotes = [
        "YAAAAS! This is literally SO CUTE and awesome!! I can't even! 1000/10 best post! 🎀",
        "Gojo-kun and I were literally just talking about this!! Too hype!",
        "Loving what you love with 100% of your heart is the best! Slay!"
      ];
      return quotes[idx % quotes.length];
    }
    if (profile.id === 'frieren') {
      const quotes = [
        "Humans live brief lives, but they create things that last forever. Beautiful post. 🍃",
        "Collecting everyday magic and reading thoughtful statuses. A good afternoon.",
        "Himmel used to say the small moments are what make the journey grand."
      ];
      return quotes[idx % quotes.length];
    }
    return profile.sampleQuotes[idx % profile.sampleQuotes.length];
  }

  return profile.sampleQuotes[idx % profile.sampleQuotes.length];
}

/**
 * Generate between 10 and 100 UNIQUE, diverse comments for any post!
 */
export function generateRandomComments(postContent: string, min = 15, max = 80): PostComment[] {
  const targetCount = Math.floor(Math.random() * (max - min + 1)) + min;
  const comments: PostComment[] = [];
  const usedTexts = new Set<string>();

  // 1. VIP profiles (Celebrities, Movie Characters, Anime, Waifus)
  const chosenProfiles = pickRandom(ALL_PROFILES, Math.min(12, ALL_PROFILES.length));
  chosenProfiles.forEach((p, idx) => {
    const text = generateContextualComment(p, postContent, idx);
    if (!usedTexts.has(text)) {
      usedTexts.add(text);
      comments.push({
        id: `comm_${Date.now()}_${idx}_${p.id}`,
        authorId: p.id,
        authorName: p.name,
        authorSubtitle: p.subtitle,
        authorAvatar: p.avatar,
        kind: p.kind,
        isVerified: p.verifiedBadge,
        content: text,
        timestamp: `${Math.floor(Math.random() * 45) + 2}m ago`,
        likesCount: Math.floor(Math.random() * 450) + 25,
        replies: []
      });
    }
  });

  // 2. Realistic Fans and Community Members
  const remaining = Math.max(0, targetCount - comments.length);
  for (let i = 0; i < remaining; i++) {
    const fanName = HUMAN_NAMES[i % HUMAN_NAMES.length];
    let commentText = '';

    if (i < DIVERSE_HUMAN_COMMENTS.length && !usedTexts.has(DIVERSE_HUMAN_COMMENTS[i])) {
      commentText = DIVERSE_HUMAN_COMMENTS[i];
    } else {
      const template = SENTIMENT_TEMPLATES[i % SENTIMENT_TEMPLATES.length];
      commentText = template;
    }

    if (usedTexts.has(commentText)) {
      commentText = `${commentText} [Reply #${i + 1}]`;
    }
    usedTexts.add(commentText);

    comments.push({
      id: `comm_fan_${Date.now()}_${i}`,
      authorId: `fan_${i}`,
      authorName: fanName,
      authorSubtitle: 'Member · Status Quo Community',
      authorAvatar: generateRandomAiAvatar(fanName, i % 2 === 0 ? 'personas' : 'lorelei'),
      kind: 'normal_user',
      isVerified: false,
      content: commentText,
      timestamp: `${Math.floor(Math.random() * 55) + 1}m ago`,
      likesCount: Math.floor(Math.random() * 120) + 5,
      replies: []
    });
  }

  return comments;
}

/**
 * Simulate social explosion: 10 to 100 comments, high reacts, shares, upvotes, polls
 */
export function simulateSocialExplosion(
  postContent: string,
  unfollowedProfiles: SocialProfile[],
  poll?: PollData
): PostSimulationResult {
  const celebPicks = pickRandom(CELEBRITIES, 2);
  const charPicks = pickRandom(MOVIE_CHARACTERS, 2);
  const animePicks = pickRandom(ANIME_CHARACTERS, 2);
  const waifuPicks = pickRandom(WAIFU_CHARACTERS, 2);
  const normalPicks = pickRandom(NORMAL_USERS, 2);

  const activeVipProfiles = [
    ...celebPicks,
    ...charPicks,
    ...animePicks,
    ...waifuPicks,
    ...normalPicks
  ].sort(() => 0.5 - Math.random());

  const celebrityReactions: CelebrityReaction[] = activeVipProfiles.map((p) => {
    const reactionType = p.reactionsStyle[Math.floor(Math.random() * p.reactionsStyle.length)];
    return {
      id: `cr_${Date.now()}_${p.id}_${Math.random().toString(36).substring(2, 6)}`,
      profileId: p.id,
      name: p.name,
      subtitle: p.subtitle,
      avatar: p.avatar,
      kind: p.kind,
      type: reactionType
    };
  });

  const baseLikes = Math.floor(Math.random() * 3200) + 650;
  const reactions: ReactionCount = {
    like: baseLikes,
    love: Math.floor(baseLikes * 0.55) + 40,
    haha: Math.floor(baseLikes * 0.28) + 20,
    wow: Math.floor(baseLikes * 0.22) + 25,
    sad: Math.floor(Math.random() * 4),
    angry: Math.floor(Math.random() * 2),
    mindblown: Math.floor(baseLikes * 0.35) + 30,
    heroic: Math.floor(baseLikes * 0.42) + 35
  };

  celebrityReactions.forEach((cr) => {
    reactions[cr.type] = (reactions[cr.type] || 0) + 1;
  });

  const upvotes = baseLikes + Math.floor(Math.random() * 800) + 200;
  const downvotes = Math.floor(Math.random() * 15) + 1;

  // Between 15 and 85 comments per post!
  const comments = generateRandomComments(postContent, 15, 85);

  const sharingProfiles = pickRandom(activeVipProfiles, 2);
  const shares: PostShare[] = sharingProfiles.map((p, idx) => {
    const quotes = [
      `Sharing this to my official story. Absolute gold standard!`,
      `The entire timeline needs to witness this masterpiece right now.`,
      `Spotlight recommendation! Pure fire! 🔥`,
      `Couldn't scroll past without sharing. Everyone read this!`
    ];
    return {
      id: `share_${Date.now()}_${idx}_${p.id}`,
      profileId: p.id,
      name: p.name,
      subtitle: p.subtitle,
      avatar: p.avatar,
      kind: p.kind,
      quote: quotes[idx % quotes.length],
      timestamp: 'Just now'
    };
  });

  const isPinned = Math.random() < 0.2;
  const pinner = isPinned ? activeVipProfiles[0] : undefined;
  const followersGained = Math.floor(Math.random() * 3200) + 750;

  let newProfileFollower: SocialProfile | undefined = undefined;
  if (Math.random() <= 0.11 && unfollowedProfiles.length > 0) {
    newProfileFollower = unfollowedProfiles[Math.floor(Math.random() * unfollowedProfiles.length)];
  }

  let updatedPoll: PollData | undefined = undefined;
  if (poll) {
    const totalNew = Math.floor(Math.random() * 400) + 120;
    const newOptions = poll.options.map((opt) => ({
      ...opt,
      votes: opt.votes + Math.floor(totalNew / poll.options.length)
    }));
    updatedPoll = {
      ...poll,
      options: newOptions,
      totalVotes: poll.totalVotes + totalNew
    };
  }

  return {
    reactions,
    celebrityReactions,
    upvotes,
    downvotes,
    comments,
    shares,
    isPinned,
    pinnedBy: pinner?.name,
    pinnedSubtitle: pinner?.subtitle,
    followersGained,
    newProfileFollower,
    updatedPoll
  };
}

/**
 * Generate realistic in-character replies when user replies to any comment
 */
export function generateThreadReply(
  authorName: string,
  profileId: string,
  userReplyText: string
): { replyText: string; likes: number } {
  const profile = ALL_PROFILES.find((p) => p.id === profileId);

  if (profile?.kind === 'celebrity') {
    if (profile.id === 'tom_holland') {
      return {
        replyText: `Haha spot on, mate! Appreciate you taking the time to reply! Cheers from London!`,
        likes: Math.floor(Math.random() * 250) + 40
      };
    }
    if (profile.id === 'robert_downey_jr') {
      return {
        replyText: `Sharp observation. That kind of insight will take you far. Keep that standard high.`,
        likes: Math.floor(Math.random() * 450) + 90
      };
    }
    if (profile.id === 'ryan_reynolds') {
      return {
        replyText: `If this thread gets any more witty, Twitter will try to tax us. Well played!`,
        likes: Math.floor(Math.random() * 520) + 80
      };
    }
    if (profile.id === 'dwayne_johnson') {
      return {
        replyText: `Much respect! Hard work and good mana always connect. Keep bringing that heat! 💪`,
        likes: Math.floor(Math.random() * 380) + 60
      };
    }
  }

  if (profile?.kind === 'character') {
    if (profile.id === 'spiderman') {
      return {
        replyText: `Hey, replying while doing handstands on a gargoyle! Thanks for the shoutout! 🕸️`,
        likes: Math.floor(Math.random() * 300) + 50
      };
    }
    if (profile.id === 'deadpool') {
      return {
        replyText: `Are you flirting with me or just trying to get into Avengers 5? Either way, I'm honored. 🌮`,
        likes: Math.floor(Math.random() * 600) + 100
      };
    }
    if (profile.id === 'iron_man') {
      return {
        replyText: `Jarvis flagged your reply as exceptional. Welcome to the Stark Industries inner circle.`,
        likes: Math.floor(Math.random() * 410) + 70
      };
    }
    if (profile.id === 'batman') {
      return {
        replyText: `Your vigilance is noted. Gotham sleeps safer knowing thoughtful voices exist.`,
        likes: Math.floor(Math.random() * 350) + 60
      };
    }
    if (profile.id === 'barbie') {
      return {
        replyText: `Awww you are so sweet! Sending you sparkle waves and endless good vibes from Barbieland! 💖`,
        likes: Math.floor(Math.random() * 280) + 45
      };
    }
  }

  if (profile?.kind === 'anime') {
    if (profile.id === 'goku') {
      return {
        replyText: `Hahaha! Let's eat a massive feast and train together soon! Dattebayo—wait that's Naruto! Kamehameha!! 🔥`,
        likes: Math.floor(Math.random() * 400) + 80
      };
    }
    if (profile.id === 'gojo') {
      return {
        replyText: `Cute reply! But remember, you're talking to the strongest sorcerer alive! 😉✨`,
        likes: Math.floor(Math.random() * 550) + 120
      };
    }
  }

  // Conversational community response
  return {
    replyText: `Appreciate you reaching out! Always great having thoughtful people on the feed.`,
    likes: Math.floor(Math.random() * 60) + 10
  };
}

// ---------------------------------------------------------------------------
// ENDLESS FEED GENERATOR (Contextual AI Images & Text Statuses)
// Video posting is strictly reserved for normal main users / active real people.
// All AI personas use AI image generation directly matching what they are talking about.
// ---------------------------------------------------------------------------

export interface AiPostTemplate {
  profileId: string;
  type: 'image' | 'status' | 'poll';
  content: string;
  feeling?: string;
  poll?: {
    question: string;
    options: string[];
  };
}

export const AI_STATUS_TEMPLATES: AiPostTemplate[] = [
  // =========================================================================
  // 1. CELEBRITY PROFILES (Images, Status Updates, Polls)
  // =========================================================================
  // Tom Holland
  {
    profileId: 'tom_holland',
    type: 'image',
    content: "Sunday morning run through Hyde Park before afternoon stage rehearsals. London weather actually cooperated today! Hope everyone is having a peaceful weekend.",
    feeling: 'grateful'
  },
  {
    profileId: 'tom_holland',
    type: 'status',
    content: "Just spent 20 minutes trying to remember where I parked in Covent Garden. Fame doesn't give you a GPS for your own shoes, mate.",
    feeling: 'cheeky'
  },
  {
    profileId: 'tom_holland',
    type: 'poll',
    content: "Debating with the lads about the ideal London weekend treat. Need your votes!",
    feeling: 'curious',
    poll: {
      question: "What's the ultimate London comfort food?",
      options: ["Proper Fish & Chips by the Thames", "Sunday Roast with extra Yorkshire pudding", "Late night curry on Brick Lane", "Full English Breakfast at a local cafe"]
    }
  },

  // Robert Downey Jr.
  {
    profileId: 'robert_downey_jr',
    type: 'image',
    content: "Vintage watch collection appraisal session followed by early script development with the Footprint Coalition team. Clean lines, intentional momentum.",
    feeling: 'accomplished'
  },
  {
    profileId: 'robert_downey_jr',
    type: 'status',
    content: "If you're not having fun doing the work, you're merely auditing someone else's rhythm. Elevate the frequency and stay generous.",
    feeling: 'wise'
  },
  {
    profileId: 'robert_downey_jr',
    type: 'poll',
    content: "Working on our next sustainable technology spotlight. Which frontier excites you most?",
    feeling: 'visionary',
    poll: {
      question: "Which green tech breakthrough should humanity accelerate first?",
      options: ["Ocean microplastics filtration bio-bots", "Grid-scale carbon capture concrete", "Next-gen clean fusion energy", "Biodegradable mushroom packaging"]
    }
  },

  // Ryan Reynolds
  {
    profileId: 'ryan_reynolds',
    type: 'image',
    content: "Post-match celebrations in Wrexham! Cold Welsh rain, warm spirits, and an ungodly amount of celebratory meat pies. What a club.",
    feeling: 'ecstatic'
  },
  {
    profileId: 'ryan_reynolds',
    type: 'status',
    content: "My kids asked me today what my job is. I told them I pretend to be wounded on camera so strangers on airplanes will nod approvingly. They were unimpressed.",
    feeling: 'humorous'
  },
  {
    profileId: 'ryan_reynolds',
    type: 'poll',
    content: "Important franchise strategy consultation with the general public:",
    feeling: 'playful',
    poll: {
      question: "What should Hugh Jackman legally be required to wear to our next press junket?",
      options: ["Full classic yellow Wolverine cowl (no exceptions)", "A velvet Wrexham AFC tracksuit", "A chef apron while flipping pancakes", "Matching glittery tuxedos with me"]
    }
  },

  // Keanu Reeves
  {
    profileId: 'keanu_reeves',
    type: 'image',
    content: "Tuning the dual exhaust on a custom black Arch motorcycle at sunset. The machine breathes, the Pacific breeze answers. Simple peace.",
    feeling: 'peaceful'
  },
  {
    profileId: 'keanu_reeves',
    type: 'status',
    content: "Grief and love are intertwined. Be excellent to each other, especially when the day feels heavy. Small kindnesses change trajectories.",
    feeling: 'reflective'
  },
  {
    profileId: 'keanu_reeves',
    type: 'poll',
    content: "Quiet Sunday afternoon sound session in the rehearsal garage:",
    feeling: 'thoughtful',
    poll: {
      question: "What's the best vinyl record to spin while rain hits the windows?",
      options: ["Joy Division - Unknown Pleasures", "Miles Davis - Kind of Blue", "The Clash - London Calling", "Bill Evans - Sunday at the Village Vanguard"]
    }
  },

  // Margot Robbie
  {
    profileId: 'margot_robbie',
    type: 'image',
    content: "Reviewing production schedules in the LuckyChap sunroom with espresso. Passion projects deserve relentless care from script to screen.",
    feeling: 'inspired'
  },
  {
    profileId: 'margot_robbie',
    type: 'status',
    content: "There's nothing quite like the collective gasp in a dark cinema when an unexpected story beat lands. Keep backing bold, original films!",
    feeling: 'passionate'
  },
  {
    profileId: 'margot_robbie',
    type: 'poll',
    content: "Pitching our next cinema development slate! Which genre are you craving?",
    feeling: 'curious',
    poll: {
      question: "What genre needs a massive, original big-budget resurgence?",
      options: ["High-stakes witty romantic screwball comedy", "Original neon noir detective thriller", "Gothic psychological coastal mystery", "Epic historical swashbuckling adventure"]
    }
  },

  // Zendaya
  {
    profileId: 'zendaya',
    type: 'image',
    content: "Golden hour light catching the dune ridges during our final location shoot. Nature's scale puts everything into perspective.",
    feeling: 'serene'
  },
  {
    profileId: 'zendaya',
    type: 'status',
    content: "Fashion isn't just about pretty garments; it's architecture for personal expression and historical storytelling. Grateful for our creative team.",
    feeling: 'grateful'
  },
  {
    profileId: 'zendaya',
    type: 'poll',
    content: "Prepping looks for the upcoming film festival season with Law Roach!",
    feeling: 'fabulous',
    poll: {
      question: "Which runway era should inspire our next premiere ensemble?",
      options: ["90s Minimalist architectural silhouettes", "Vintage 60s futurism and metallics", "Avant-garde nature-inspired organic sculpting", "Classic 50s dramatic Hollywood glamour"]
    }
  },

  // Dwayne "The Rock" Johnson
  {
    profileId: 'dwayne_johnson',
    type: 'image',
    content: "4:00 AM iron therapy. 2 hours of heavy chalk and heavy thoughts. The world is noisy, but your discipline is personal. Put in the work when no one is watching. Let's get it! 💪🔥",
    feeling: 'unstoppable'
  },
  {
    profileId: 'dwayne_johnson',
    type: 'status',
    content: "Blood, sweat, and respect. First two you give, last one you earn. Don't look for shortcuts; fall in love with the grind.",
    feeling: 'motivated'
  },
  {
    profileId: 'dwayne_johnson',
    type: 'poll',
    content: "Legendary Cheat Meal Sunday is approaching! What's dominating the table tonight?",
    feeling: 'hyped',
    poll: {
      question: "Pick the ultimate Iron Paradise cheat meal:",
      options: ["12 Sourdough chocolate chip pancakes & peanut butter", "Double bacon cheeseburgers with loaded fries", "Giant sushi boat platter with spicy tuna rolls", "Classic New York cheesecake & warm cookies"]
    }
  },

  // Taylor Swift
  {
    profileId: 'taylor_swift',
    type: 'image',
    content: "Soundcheck in the rain. There is something truly magical about the calm right before the stadium fills up with 70,000 voices singing in unison. See you tonight! 🫶",
    feeling: 'enchanted'
  },
  {
    profileId: 'taylor_swift',
    type: 'status',
    content: "Wrote a bridge on a scrap of hotel stationery at 3 AM. Sometimes songs find you before you even know what you were feeling.",
    feeling: 'creative'
  },
  {
    profileId: 'taylor_swift',
    type: 'poll',
    content: "Acoustic secret song section tonight! Which mood should we tap into?",
    feeling: 'excited',
    poll: {
      question: "Which acoustic song vibe for tonight's surprise piano set?",
      options: ["Heartbreaking nostalgia ballad from early years", "Upbeat guitar mashup of fan-favorite tracks", "Haunting poetic folklore storytelling", "High-energy synth track slowed down on piano"]
    }
  },

  // =========================================================================
  // 2. MOVIE CHARACTER PROFILES (Images, Status Updates, Polls)
  // =========================================================================
  // Spider-Man
  {
    profileId: 'spiderman',
    type: 'image',
    content: "Nothing beats the Queens skyline at golden hour after a long patrol. Remember to look out for each other down there! 🕸️🗽",
    feeling: 'blessed'
  },
  {
    profileId: 'spiderman',
    type: 'status',
    content: "PSA: If you lose your bicycle on 34th Street, check the lamppost outside the bodega. It's webbed up safe from the car thieves.",
    feeling: 'helpful'
  },
  {
    profileId: 'spiderman',
    type: 'poll',
    content: "Debating with Ned on patrol dinner options. New York pizza rankings need community adjudication!",
    feeling: 'curious',
    poll: {
      question: "Which NYC borough actually has the undisputed best slice?",
      options: ["Queens corner bodega slice (crispy bottom)", "Classic Brooklyn brick-oven coal slice", "Manhattan dollar-slice at 2 AM", "Staten Island grandma pie"]
    }
  },

  // Deadpool
  {
    profileId: 'deadpool',
    type: 'image',
    content: "Told the director I’d only do the rooftop stunt if they gave me unlimited guacamole. Check out the setup! Maximum Effort baby!",
    feeling: 'chaotic'
  },
  {
    profileId: 'deadpool',
    type: 'status',
    content: "Just fourth-wall broke into the game code and replaced all the developer's vegetables with tacos. You're welcome.",
    feeling: 'smug'
  },
  {
    profileId: 'deadpool',
    type: 'poll',
    content: "Auditioning brand-new combat accessories for the next blockbuster team-up:",
    feeling: 'mischievous',
    poll: {
      question: "Which weapon makes the most satisfying comedic thud in slow motion?",
      options: ["Cast-iron Aunt May skillet", "Dual oversized rubber chickens with squeakers", "Titanium chimichanga serving spatula", "A rolled-up comic book from 1991"]
    }
  },

  // Batman
  {
    profileId: 'batman',
    type: 'image',
    content: "Heavy rain washes over the Gotham gargoyles. Shadows deepen, but vigilance never falters. The night belongs to justice.",
    feeling: 'focused'
  },
  {
    profileId: 'batman',
    type: 'status',
    content: "Arkham perimeter sensors recalibrated. Gordon has the frequency. Gotham will endure.",
    feeling: 'stoic'
  },
  {
    profileId: 'batman',
    type: 'poll',
    content: "Upgrading Batcave tactical communications grid:",
    feeling: 'calculating',
    poll: {
      question: "Primary protocol for subterranean defense grid?",
      options: ["Encrypted sonar mapping pulse", "Autonomous subterranean drones", "Nanotech armor electromagnetic reinforcement", "Silent seismic disruption relays"]
    }
  },

  // Iron Man
  {
    profileId: 'ironman',
    type: 'image',
    content: "Mark 85 nanotech diagnostics running at 100%. Holographic schematics looking cleaner than ever in the Malibu lab.",
    feeling: 'genius'
  },
  {
    profileId: 'ironman',
    type: 'status',
    content: "Jarvis, play AC/DC at 80% volume and remind Cap that breakfast meetings before 10 AM are a human rights violation.",
    feeling: 'cocky'
  },
  {
    profileId: 'ironman',
    type: 'poll',
    content: "Debuting new armor finishes at the upcoming Stark World Expo:",
    feeling: 'stylish',
    poll: {
      question: "Which custom finish looks best on high-velocity nanotech?",
      options: ["Classic Hot-Rod Candy Red & Brushed Gold", "Stealth Midnight Carbon Matte Black", "Silver Centurion Chrome & Crimson", "Quantum White & Polished Titanium"]
    }
  },

  // John Wick
  {
    profileId: 'john_wick',
    type: 'image',
    content: "Quiet evening at the Continental. A dog walks beside me. The rain washes the pavement clean. Focus is maintained.",
    feeling: 'focused'
  },
  {
    profileId: 'john_wick',
    type: 'status',
    content: "Be careful who you cross. Peace is preferable. Always cherish your companions.",
    feeling: 'solemn'
  },
  {
    profileId: 'john_wick',
    type: 'poll',
    content: "Selecting standard defensive tailor specifications at the Continental:",
    feeling: 'practical',
    poll: {
      question: "Optimal Kevlar-reinforced three-piece suit lining?",
      options: ["Tactical charcoal two-button with silk interior", "All-black Italian wool bullet-resistant blend", "Navy herringbone with reinforced wrist cuffs", "Double-breasted vintage slate gray"]
    }
  },

  // Barbie
  {
    profileId: 'barbie',
    type: 'image',
    content: "Coordinated pink accessories for the whole neighborhood today! Reminder: You don't need a special occasion to dress like you're celebrating life! 💖✨",
    feeling: 'fabulous'
  },
  {
    profileId: 'barbie',
    type: 'status',
    content: "You can be an astronaut, a Supreme Court justice, and still rock rollerblades at sunset. Never let anyone limit your sparkle! 💕",
    feeling: 'empowered'
  },
  {
    profileId: 'barbie',
    type: 'poll',
    content: "Planning tomorrow's Dreamhouse garden celebration! What should the theme be?",
    feeling: 'excited',
    poll: {
      question: "Dreamhouse weekend theme:",
      options: ["Disco Roller-Skate Extravaganza", "Glitter Pastel Garden Tea Soirée", "Retro 80s Neon Beach Volleyball", "Stargazing Astronomy & Cupcake Night"]
    }
  },

  // =========================================================================
  // 3. ANIME CHARACTER PROFILES (Images, Status Updates, Polls)
  // =========================================================================
  // Satoru Gojo
  {
    profileId: 'gojo',
    type: 'image',
    content: "Told the first-years we had emergency special training today... it was actually just testing out new strawberry mochi bakeries in Shibuya. 🍓👁️",
    feeling: 'playful'
  },
  {
    profileId: 'gojo',
    type: 'status',
    content: "Being the strongest means everyone expects you to carry the team, which is fine, because my hair looks magnificent doing it.",
    feeling: 'confident'
  },
  {
    profileId: 'gojo',
    type: 'poll',
    content: "Surprise afternoon sweets run! What should I bring back for Megumi and Yuji?",
    feeling: 'mischievous',
    poll: {
      question: "Which Tokyo dessert reigns supreme?",
      options: ["Fluffy soufflé pancakes with matcha cream", "Crispy custard-filled taiyaki fresh off the iron", "Traditional strawberry daifuku mochi", "Black sesame shaved ice tower"]
    }
  },

  // Son Goku
  {
    profileId: 'goku',
    type: 'image',
    content: "Just finished 10,000 gravity pushups and ate 40 bowls of rice! Who wants to spar at the World Martial Arts tournament?! My hands are itching for a good match! 🔥",
    feeling: 'hyped'
  },
  {
    profileId: 'goku',
    type: 'status',
    content: "Chi-Chi said I have to finish my tractor farming chores before I can go train with Whis. Better do it in Super Saiyan so it takes two seconds! 💨",
    feeling: 'cheerful'
  },
  {
    profileId: 'goku',
    type: 'poll',
    content: "Setting up a universal friendly sparring tournament this weekend!",
    feeling: 'eager',
    poll: {
      question: "Who should I spar with first for the ultimate warmup?",
      options: ["Vegeta in the Hyperbolic Time Chamber", "Broly on the ice plains", "Beerus on his sacred temple grounds", "Piccolo and Gohan tag-team"]
    }
  },

  // Naruto Uzumaki
  {
    profileId: 'naruto',
    type: 'image',
    content: "Special extra-large pork chashu miso ramen at Ichiraku after a full day of Hokage paperwork! Teuchi-san always makes the soul feel energized! Dattebayo! 🍜🍥",
    feeling: 'satisfied'
  },
  {
    profileId: 'naruto',
    type: 'status',
    content: "Never give up and never go back on your word! That's my ninja way, and that's how we protect everyone in the Hidden Leaf!",
    feeling: 'determined'
  },
  {
    profileId: 'naruto',
    type: 'poll',
    content: "Official Konoha community query from the Seventh Hokage's office:",
    feeling: 'friendly',
    poll: {
      question: "Best addition to the legendary Ichiraku Ramen bowl?",
      options: ["Triple seasoned soft-boiled ramen eggs", "Extra thick grilled chashu pork slices", "Crispy nori seaweed & bamboo shoots", "Super spicy hot chili miso broth"]
    }
  },

  // Monkey D. Luffy
  {
    profileId: 'luffy',
    type: 'image',
    content: "Sanji just roasted a giant sea monster drumstick on the deck of the Sunny! Clear blue skies and meat everywhere! Set sail for the next island! 🍖⛵",
    feeling: 'joyful'
  },
  {
    profileId: 'luffy',
    type: 'status',
    content: "If you don't take risks, you can't create a future! Plus, meat tastes better after you win a big battle! Shishishi!",
    feeling: 'carefree'
  },
  {
    profileId: 'luffy',
    type: 'poll',
    content: "The Straw Hat crew is deciding what kind of island to explore next!",
    feeling: 'adventurous',
    poll: {
      question: "Where should the Thousand Sunny anchor next?",
      options: ["A mysterious sky island hidden in clouds", "An island made entirely out of candy and cakes", "A wild dinosaur island with giant fighting bugs", "A mysterious sunken underwater kingdom"]
    }
  },

  // Frieren
  {
    profileId: 'frieren',
    type: 'image',
    content: "Found a forgotten Grimoire in an ancient cellar that turns sour milk into sweet cream. Eisen would have appreciated this small luxury.",
    feeling: 'thoughtful'
  },
  {
    profileId: 'frieren',
    type: 'status',
    content: "Himmel always said it’s the small journeys along the way that stay with you the longest. Even a hundred years passes like a brief morning breeze.",
    feeling: 'nostalgic'
  },
  {
    profileId: 'frieren',
    type: 'poll',
    content: "Searching ancient ruins for peculiar everyday folk magic:",
    feeling: 'curious',
    poll: {
      question: "Which seemingly minor spell is actually the most useful?",
      options: ["Spell to produce a field of blue flowers", "Spell to keep tea perfectly hot forever", "Spell to effortlessly clean stubborn stains from clothes", "Spell to make shaved ice out of thin air"]
    }
  },

  // =========================================================================
  // 4. WAIFU PROFILES (Images, Status Updates, Polls)
  // =========================================================================
  // Marin Kitagawa
  {
    profileId: 'marin_kitagawa',
    type: 'image',
    content: "The fabric for the new convention cosplay finally arrived!! Gojo-kun is helping me sew the hem right now and it's literally perfection!! Aaaaa! 🎀✨",
    feeling: 'excited'
  },
  {
    profileId: 'marin_kitagawa',
    type: 'status',
    content: "Loving what you love with 100% of your heart is the best feeling in the world! Never be embarrassed of your favorite anime or games! 💕",
    feeling: 'passionate'
  },
  {
    profileId: 'marin_kitagawa',
    type: 'poll',
    content: "Planning our huge cosplay lineup for the next big summer comiket!! Help me choose!",
    feeling: 'playful',
    poll: {
      question: "Which cosplay should we craft next?",
      options: ["Shizuku-kuroe magical gothic lolita", "Black Lobelia space magical girl with wings", "Prisoner Veronica military armor look", "Cute neon cyberpunk schoolgirl idol"]
    }
  },

  // Rem
  {
    profileId: 'rem',
    type: 'image',
    content: "Prepared fresh blueberry scones and steamed morning tea for the courtyard patio at the Roswaal estate. Wishing everyone a gentle, sunny day. 💙🫖",
    feeling: 'sweet'
  },
  {
    profileId: 'rem',
    type: 'status',
    content: "No matter how dark tomorrow appears, starting from zero is always possible when you have someone you believe in. Please stay strong.",
    feeling: 'devoted'
  },
  {
    profileId: 'rem',
    type: 'poll',
    content: "Preparing the afternoon confectionery menu for the mansion guests:",
    feeling: 'caring',
    poll: {
      question: "Which dessert shall Rem prepare for afternoon tea?",
      options: ["Fresh blueberry tarts with clotted cream", "Warm honey-glazed apple strudel", "Delicate lavender shortbread biscuits", "Silky vanilla bean custard with berries"]
    }
  },

  // Yor Forger
  {
    profileId: 'yor_forger',
    type: 'image',
    content: "Loid taught me how to make southern beef stew with rosemary tonight! Anya said it tasted delicious without any funny aftertaste! A success! 🍲❤️",
    feeling: 'proud'
  },
  {
    profileId: 'yor_forger',
    type: 'status',
    content: "Protecting the peaceful daily life of your family is the greatest mission in the world. Even when cooking feels terrifying, I will always try my best!",
    feeling: 'warm'
  },
  {
    profileId: 'yor_forger',
    type: 'poll',
    content: "Planning tomorrow's family picnic for Loid, Anya, and Bond!",
    feeling: 'excited',
    poll: {
      question: "What should we pack in the Forger family picnic basket?",
      options: ["Peanut butter cookies & berry sandwiches for Anya", "Savory meat pies and warm herbal tea", "Crispy fried chicken cutlets & homemade potato salad", "Fresh fruit skewers with honey dipping sauce"]
    }
  },

  // Makima
  {
    profileId: 'makima',
    type: 'image',
    content: "A quiet morning espresso looking out over the Tokyo skyline before the Public Safety briefings begin. Discipline creates necessary harmony.",
    feeling: 'collected'
  },
  {
    profileId: 'makima',
    type: 'status',
    content: "Loyalty is a choice made through clarity and mutual understanding. Treat those under your care with quiet, unwavering intention.",
    feeling: 'commanding'
  },
  {
    profileId: 'makima',
    type: 'poll',
    content: "Directing resource allocations for upcoming Public Safety Special Divisions:",
    feeling: 'calculated',
    poll: {
      question: "Most vital trait in frontline operational divisions?",
      options: ["Absolute obedience to tactical orders", "Instinctive improvisational survival grit", "Unwavering emotional composure under terror", "Specialized contract power mastery"]
    }
  }
];

/**
 * Procedural creator for any profileId that guarantees an image, status, or poll post.
 * Tailors content, themes, and image generation specifically to the character's lore and personality.
 * Excludes videos entirely for AI characters.
 */
function createProceduralPost(profileId: string, postType: 'image' | 'status' | 'poll', seedNumber = 1): Post {
  const profile = ALL_PROFILES.find((p) => p.id === profileId) || ALL_PROFILES[0];
  const uniqueSeed = Date.now() + Math.abs(seedNumber * 7919) + Math.floor(Math.random() * 50000);
  const baseLikes = Math.floor(Math.random() * 5000) + 1500;

  // Comprehensive persona-tailored scenarios for procedural generation across all profiles
  const characterScenarios: Record<string, {
    images: { caption: string; feeling: string }[];
    statuses: string[];
    polls: { question: string; options: string[] }[];
  }> = {
    spiderman: {
      images: [
        { caption: "Golden hour over Queens from the water tower. No supervillains in sight for once, just good pizza and a calm evening breeze.", feeling: "peaceful" },
        { caption: "Tinkering with some new micro-fluid web fluid formulas in my bedroom workshop. Science never sleeps!", feeling: "focused" },
        { caption: "Perched up on the Chrysler Building gargoyle. City lights hit different when the rain clears up.", feeling: "heroic" },
        { caption: "Stopped a rogue bicycle thief and got offered a fresh pretzel as a reward. Neighborhood friendly duties done!", feeling: "cheerful" },
        { caption: "Suit maintenance day! Sewing up tears after last night's rooftop skirmish.", feeling: "resilient" }
      ],
      statuses: [
        "Reminder: If you drop your hotdog on 34th street, swinging down to catch it before it hits the pavement counts as cardio.",
        "Aunt May still thinks I spend all my evenings doing 'freelance photography'. Well, strictly speaking...",
        "NYC traffic is awful today. Highly recommend taking the skyline route if your commute permits."
      ],
      polls: [
        { question: "Best NYC Borough to patrol on a Saturday night?", options: ["Queens (Home turf)", "Manhattan (Skyscraper swinging)", "Brooklyn (Great street vibes)", "The Bronx (High energy)"] },
        { question: "Next suit upgrade focus:", options: ["Upgraded web glider wings", "Thermal insulation weave", "High-frequency sonic disrupter", "Extra pocket for phone & snacks"] }
      ]
    },
    deadpool: {
      images: [
        { caption: "Just scored an entire crate of authentic carnitas chimichangas. The world can wait, lunch cannot.", feeling: "ecstatic" },
        { caption: "Polishing my dual katanas on the living room sofa while watching Golden Girls reruns.", feeling: "relaxed" },
        { caption: "Dramatic slow-motion walk away from an explosion I definitely didn't cause on purpose. Maybe.", feeling: "unstoppable" },
        { caption: "Rocking a questionable novelty holiday sweater just to irritate Logan next door.", feeling: "mischievous" },
        { caption: "Taco Tuesday at 2 AM in full tactical red spandex. Living the high-octane mercenary dream.", feeling: "chaotic" }
      ],
      statuses: [
        "Dear Marvel executives: If I don't get a unicorn cameo in my next feature, I'm hijacking the catering truck.",
        "Breaking the 4th wall is exhausting. The 5th wall is where all the secret snacks are hidden anyway.",
        "Pro tip: Red spandex doesn't hide salsa stains as well as they advertise on the packaging."
      ],
      polls: [
        { question: "What should Wade Wilson buy with his latest mercenary bounty?", options: ["Lifetime supply of chimichangas", "Gold-plated dual desert eagles", "Matching friendship bracelets for Logan", "A hot pink Vespa scooter"] }
      ]
    },
    tom_holland: {
      images: [
        { caption: "Morning jog through Hyde Park in London before West End rehearsals. Weather is surprisingly brilliant today!", feeling: "energized" },
        { caption: "Choreography practice and flip stunts in the gym. Getting ready for the next live performance!", feeling: "pumped" },
        { caption: "Soho morning coffee run. Fresh espresso and crisp autumn air in central London.", feeling: "fresh" },
        { caption: "Reviewing script notes at the kitchen table. Big creative projects in motion!", feeling: "focused" }
      ],
      statuses: [
        "Trying not to leak any plot details today during press junkets! My team watches me like a hawk.",
        "London rain never really stops, you just learn to drink your espresso a little faster.",
        "Shoutout to all the live theater performers putting in maximum stamina every evening!"
      ],
      polls: [
        { question: "What genre should Tom tackle in his next feature project?", options: ["Gritty psychological thriller", "Period historical drama", "Buddy adventure comedy", "High-octane action vehicle"] }
      ]
    },
    zendaya: {
      images: [
        { caption: "Golden hour shooting in the desert dunes. Sunset light hitting sand and silk drapery is pure magic.", feeling: "radiant" },
        { caption: "Backstage at Paris fashion week in sculptural haute couture. Visual storytelling at its finest.", feeling: "glamorous" },
        { caption: "Quiet morning reading scripts on the sunlit terrace with espresso. Finding peace in the routine.", feeling: "peaceful" },
        { caption: "Editorial portrait test in natural studio lighting. Embracing organic textures and simple beauty.", feeling: "inspired" }
      ],
      statuses: [
        "Effortless poise starts with being authentic to who you are. Never dim your light for anyone.",
        "Grateful for incredible creative collaborators who turn every shoot into a work of art.",
        "Resting and recharging before the next international press tour begins!"
      ],
      polls: [
        { question: "Which aesthetic direction for Zendaya's next high-fashion magazine cover?", options: ["Surrealist futuristic monochrome", "Vintage 1970s Hollywood glamour", "Earthy bohemian desert minimalism", "Bold vibrant neon avant-garde"] }
      ]
    },
    robert_downey_jr: {
      images: [
        { caption: "Vintage watch collection appraisal session followed by script work with the Footprint Coalition team.", feeling: "accomplished" },
        { caption: "Testing sustainable tech prototypes in the Malibu workshop. Innovation paired with intention.", feeling: "genius" },
        { caption: "Red carpet moment in rose-tinted sunglasses and tailored charcoal suit. Keeping momentum high.", feeling: "charismatic" },
        { caption: "Morning coffee in the garden surrounded by green architecture models. Vision creates reality.", feeling: "focused" }
      ],
      statuses: [
        "Precision, vision, and relentless work ethic. That's the recipe for 3,000% output.",
        "The Footprint Coalition is pushing green technology forward every day. Excited for what's ahead.",
        "Check in with your circle today. Genuine connection is the highest luxury."
      ],
      polls: [
        { question: "Next Footprint Coalition initiative focus:", options: ["AI-driven ocean cleanup tech", "Sustainable bio-composite construction", "Zero-emission luxury aviation", "Next-gen solar storage arrays"] }
      ]
    },
    keanu_reeves: {
      images: [
        { caption: "Spent the morning at the Arch garage tuning a custom black motorcycle frame. Precision and quiet patience.", feeling: "focused" },
        { caption: "Bass guitar rehearsal with Dogstar in the underground studio. Deep groove and raw energy.", feeling: "passionate" },
        { caption: "Peaceful afternoon walk in an urban park as autumn leaves fall. Cherishing the moment.", feeling: "zen" },
        { caption: "Riding down coastal California highways at sunset. The open road brings clarity.", feeling: "serene" }
      ],
      statuses: [
        "Be excellent to each other. Small kindnesses reverberate further than you'll ever know.",
        "Grief and love are intertwined. Cherish the people standing beside you right now.",
        "Music and motorcycles both require listening closely to the cadence. Balance is key."
      ],
      polls: [
        { question: "Optimal road trip route for a motorcycle journey:", options: ["Pacific Coast Highway California", "Alpine mountain passes in Switzerland", "Coastal highway around Iceland", "Historic Route 66 desert stretch"] }
      ]
    },
    ryan_reynolds: {
      images: [
        { caption: "Wrexham matchday energy in full swing! Welsh football atmosphere is unmatched anywhere on earth.", feeling: "thrilled" },
        { caption: "Testing new Aviation Gin tasting notes in the distillery boardroom. Caffeinated and chaotic.", feeling: "sharp" },
        { caption: "On set with Hugh Jackman. His smile hides deep, simmering comedic resentment.", feeling: "mischievous" }
      ],
      statuses: [
        "Parenting is waking up at 5:30 AM to have a toddler critique your wardrobe choices.",
        "Wrexham matchday has taken 10 years off my life expectancy, but the stadium pies make it worth it.",
        "If you don't hear from me for three days, Hugh probably locked me in a prop trailer."
      ],
      polls: [
        { question: "What is Hugh Jackman thinking right now?", options: ["'Why did I sign this contract?'", "'I could throw him into the Thames.'", "'He smells like Aviation Gin.'", "'All of the above.'"] }
      ]
    },
    dwayne_johnson: {
      images: [
        { caption: "4 AM workout in the Iron Paradise complete! Chalk dust floating, iron clanking, blood pumping! 🔥", feeling: "hyped" },
        { caption: "Post-workout Sunday cheat meal: 12 thick chocolate chip pancakes with maple syrup and peanut butter!", feeling: "ecstatic" },
        { caption: "On location for the next massive action film. Grateful for the crew grinding behind the scenes.", feeling: "determined" }
      ],
      statuses: [
        "Always be the hardest worker in the room. Blood, sweat, and respect!",
        "Mana is through the roof today! Don't let anything stop your momentum.",
        "Cheat meal Sunday is sacred. Earn your pancakes through relentless grit!"
      ],
      polls: [
        { question: "Ultimate Sunday cheat meal choice:", options: ["12 giant chocolate chip pancakes", "Massive triple bacon cheeseburger platter", "Extra large pepperoni stuffed crust pizza", "3 dozen fresh warm glazed donuts"] }
      ]
    },
    taylor_swift: {
      images: [
        { caption: "Stadium rainfall soundcheck before tonight's show. Stage lights gleaming off wet pavement. Magical energy! 🫶✨", feeling: "enchanted" },
        { caption: "Acoustic guitar rehearsal in the recording studio. Writing new melodies by candlelight.", feeling: "inspired" },
        { caption: "Midnight studio polaroid with my cats. Finding inspiration in quiet evening moments.", feeling: "cozy" }
      ],
      statuses: [
        "Meet me at midnight... or right here on the timeline! So proud of this community 🫶",
        "Karma is having mutuals as brilliant and creative as you all on my feed!",
        "Enchanted by all the incredible fan art and friendship bracelets at the tour!"
      ],
      polls: [
        { question: "Surprise acoustic song set expectation for tonight:", options: ["Deep-cut piano ballad mashup", "Upbeat synth-pop fan favorite", "Acoustic guitar folk story", "Vault track live debut"] }
      ]
    },
    gojo: {
      images: [
        { caption: "Strolling through Shibuya with fresh strawberry mochi from the corner bakery. Sweet tooth satisfied! 🍓👁️", feeling: "carefree" },
        { caption: "Lowered the blindfold for half a second. Six Eyes observing the Tokyo street pulse.", feeling: "unstoppable" },
        { caption: "Training afternoon at Jujutsu High. The first-years are putting in real effort today!", feeling: "proud" }
      ],
      statuses: [
        "Dying to win and risking death to win are completely different things. Remember that tomorrow!",
        "People ask why I eat so many sweets. Constant brain refresh for Limitless, obvious medical necessity!",
        "It's tough being the strongest, but somebody's gotta do it with great style."
      ],
      polls: [
        { question: "Which Tokyo dessert should Gojo buy next?", options: ["Sendai Kikufuku matcha mochi", "Fluffy soufflé pancakes", "Custard taiyaki fresh off the iron", "Black sesame shaved ice tower"] }
      ]
    },
    goku: {
      images: [
        { caption: "Post-training feast with Chi-Chi! 30 bowls of ramen, 10 roast chickens, and ready for dessert! 🍜🔥", feeling: "starving" },
        { caption: "Powering up in the mountainous wasteland. Golden Super Saiyan aura warming the mountain peaks!", feeling: "energized" },
        { caption: "100x Gravity room workout done! Muscle burn means progress!", feeling: "determined" }
      ],
      statuses: [
        "Vegeta said I train too recklessly, but pushing limits is what makes life exciting!",
        "If anyone knows where to find extra-large rice bowls in bulk, let Chi-Chi know!",
        "Even when things look impossible, there's always a way to break through if you give everything!"
      ],
      polls: [
        { question: "Best sparring partner for Saturday warmup?", options: ["Vegeta in Hyperbolic Time Chamber", "Broly on the ice plains", "Beerus on sacred temple grounds", "Piccolo and Gohan tag team"] }
      ]
    },
    naruto: {
      images: [
        { caption: "Special extra-large pork chashu miso ramen at Ichiraku after a day of Hokage paperwork! Dattebayo! 🍜🍥", feeling: "satisfied" },
        { caption: "Overlooking Konoha village from the Hokage Monument at sunset. Protecting everyone's smiles!", feeling: "determined" }
      ],
      statuses: [
        "Never give up and never go back on your word! That's my ninja way!",
        "Teuchi-san's ramen broth hits the soul like nothing else in the Seven Nations!"
      ],
      polls: [
        { question: "Best ramen topping at Ichiraku:", options: ["Soft-boiled seasoned eggs", "Thick grilled chashu pork", "Crispy nori & bamboo shoots", "Extra spicy chili miso paste"] }
      ]
    },
    luffy: {
      images: [
        { caption: "Sanji just roasted a giant sea monster drumstick on the Sunny deck! Blue skies and meat! 🍖⛵", feeling: "joyful" },
        { caption: "Perched on the figurehead of the Thousand Sunny sailing into open ocean adventure!", feeling: "adventurous" }
      ],
      statuses: [
        "If you don't take risks, you can't create a future! Meat tastes better after winning! Shishishi!",
        "Next island, here we come! I'm gonna be King of the Pirates!"
      ],
      polls: [
        { question: "Where should the Thousand Sunny anchor next?", options: ["Sky island in clouds", "Island made of candy", "Dinosaur island with giant bugs", "Undersea sunken kingdom"] }
      ]
    },
    frieren: {
      images: [
        { caption: "Found an ancient grimoire in a stone cellar ruin. Spell to make blue moon flowers bloom! 🌸✨", feeling: "peaceful" },
        { caption: "Standing in a vast meadow of blue flowers. Reminds me of Himmel and long ago.", feeling: "nostalgic" },
        { caption: "Fern made hot tea while I studied old parchment maps of northern travel routes.", feeling: "tranquil" },
        { caption: "Stark and Fern practicing defensive barriers in the forest clearing.", feeling: "observant" },
        { caption: "Browsing a quaint village magic shop looking for rare folk spells.", feeling: "curious" },
        { caption: "Watching sunset over ancient stone bridge ruins. Time flows so gently here.", feeling: "pensive" }
      ],
      statuses: [
        "A ten-year journey is merely one percent of an elf's lifetime, yet it changed everything.",
        "Collecting seemingly pointless everyday spells is the true joy of magic.",
        "Himmel taught me that small acts of kindness leave memories that outlast centuries.",
        "Magic is the realm of visualization. If you cannot imagine it, you cannot cast it."
      ],
      polls: [
        { question: "Which bizarre spell is most useful on a journey?", options: ["Shaved ice on command", "Make copper coins shiny", "Turn tea into hot broth", "See through clothes (Himmel approved)"] },
        { question: "Best way to spend a rainy afternoon in a wooden cottage?", options: ["Cataloging old grimoires", "Sleeping until noon with Fern", "Testing flower creation spells", "Drinking hot herbal tea"] }
      ]
    },
    marin_kitagawa: {
      images: [
        { caption: "Cosplay fabric haul with Gojo-kun! Velvet, satin, and lace ribbons! So excited!! 🎀✨", feeling: "thrilled" },
        { caption: "Golden hour in Akihabara with brown sugar boba! Loving today's makeup look!", feeling: "radiant" },
        { caption: "Fitting session complete! Gojo-kun's craftsmanship is literally next level!!", feeling: "ecstatic" },
        { caption: "Late night gaming marathon eating ramen with extra cheese! Otaku life forever!", feeling: "hyped" },
        { caption: "Shopping for vibrant wig styles for the next convention line-up! Which color?", feeling: "energetic" },
        { caption: "Photo shoot preview! The lighting and costume detail turned out SO PERFECT!!", feeling: "slaying" }
      ],
      statuses: [
        "Never feel ashamed of loving what you love! Anime, cosplay, gaming—rock it 100%!",
        "Staying up until 3 AM tweaking costume patterns because the hype is too real!",
        "Gojo-kun and I just finished another masterpiece! Can't wait to share photo shoot drops!",
        "Loud and proud about my favorite anime series! Who else is watching the new season?"
      ],
      polls: [
        { question: "Which cosplay should Marin craft next?", options: ["Shizuku gothic lolita", "Space magical girl with wings", "Prisoner Veronica military armor", "Cyberpunk schoolgirl idol"] },
        { question: "Ideal convention snack run:", options: ["Matcha boba & taiyaki", "Takoyaki & melon soda", "Karaage chicken cup & boba", "Crepes with strawberries"] }
      ]
    },
    rem: {
      images: [
        { caption: "Fresh blueberry scones and steamed morning tea on the courtyard patio at Roswaal estate. 💙🫖", feeling: "sweet" },
        { caption: "Walking through the estate gardens under morning sun. Wishing everyone a peaceful day.", feeling: "gentle" },
        { caption: "Arranging fresh blue hydrangeas in the grand hallway. The house smells lovely!", feeling: "content" },
        { caption: "Afternoon tea service prepared for Subaru-kun and estate guests.", feeling: "devoted" },
        { caption: "Sunset glow over Roswaal mansion library. Finishing daily maid chores with a smile.", feeling: "peaceful" },
        { caption: "Morning star polished and ready. Rem will protect everyone's happiness without fail!", feeling: "resolute" }
      ],
      statuses: [
        "Starting from zero is always possible when you have someone you believe in. Stay strong!",
        "Rem is preparing afternoon tea for all estate guests with great care.",
        "No matter how difficult the road becomes, Rem will always cheer for you with all her heart!",
        "A warm cup of tea and gentle smile can brighten even the darkest day."
      ],
      polls: [
        { question: "Dessert choice for afternoon tea at Roswaal Mansion:", options: ["Blueberry tarts with clotted cream", "Honey apple strudel", "Lavender shortbread biscuits", "Vanilla bean custard"] },
        { question: "Favorite morning garden flower:", options: ["Blue hydrangeas", "White lilies", "Sweet lavender", "Morning glory"] }
      ]
    },
    yor_forger: {
      images: [
        { caption: "Loid taught me how to make southern beef stew! Anya said it tasted delicious! 🍲❤️", feeling: "proud" },
        { caption: "Cozy family evening at the Forger apartment. Bond is sleeping by the fireplace.", feeling: "warm" },
        { caption: "Morning walk in Berlint park with Anya holding my hand. Such precious moments!", feeling: "blessed" },
        { caption: "Practicing knife discipline in the quiet balcony breeze. Clean precision.", feeling: "focused" },
        { caption: "Trying a new cake recipe for Anya's school celebration! Fingers crossed it rises!", feeling: "hopeful" },
        { caption: "Family photo on the velvet sofa with Loid, Anya, and Bond. My whole world.", feeling: "loving" }
      ],
      statuses: [
        "Protecting the peaceful daily life of your family is the greatest mission in the world!",
        "Even when cooking feels terrifying, I will always try my best for Anya and Loid!",
        "Anya gave me a handmade paper star today. It is my most prized treasure in Berlint!",
        "Politeness and strength go hand in hand. Wishing everyone a safe, happy evening!"
      ],
      polls: [
        { question: "Forger family picnic basket item:", options: ["Peanut butter cookies for Anya", "Savory meat pies & tea", "Fried chicken cutlets & potato salad", "Fruit skewers with honey"] },
        { question: "Family weekend activity in Berlint:", options: ["Visit the Berlint city zoo", "Park picnic with Bond", "Pastry shop tasting tour", "Museum art tour with Anya"] }
      ]
    },
    makima: {
      images: [
        { caption: "Quiet morning espresso looking over Tokyo skyline before Public Safety briefings.", feeling: "collected" },
        { caption: "Walking down Public Safety headquarters corridor in white shirt and necktie.", feeling: "commanding" },
        { caption: "Evening walk through Shibuya crossing accompanied by Public Safety Division 4.", feeling: "poised" },
        { caption: "Observing rain falling against glass windows at Tokyo headquarters. Serene focus.", feeling: "calm" },
        { caption: "Meeting with high-ranking officers in the marble conference room.", feeling: "composed" },
        { caption: "Sharing quiet moment with the trained hounds in the garden. Absolute devotion.", feeling: "serene" }
      ],
      statuses: [
        "Loyalty is a choice made through clarity and mutual understanding.",
        "Discipline creates necessary harmony in high-risk operational environments.",
        "True strength lies in quiet composure, not loud display.",
        "Every piece has its purpose on the board. Trust the plan."
      ],
      polls: [
        { question: "Primary operational division focus:", options: ["Absolute tactical obedience", "Instinctive improvisational grit", "Emotional composure under terror", "Contract power mastery"] },
        { question: "Essential trait for Devil Hunter leadership:", options: ["Unshakeable calm under threat", "Absolute strategic vision", "Empathetic team protection", "Fearless execution"] }
      ]
    }
  };

  let content = '';
  let feeling = 'inspired';
  let mediaUrl: string | undefined = undefined;
  let mediaType: 'image' | 'video' | undefined = undefined;
  let pollData: PollData | undefined = undefined;

  const persona = characterScenarios[profile.id];

  if (persona) {
    if (postType === 'image') {
      const imgIdx = Math.abs(uniqueSeed * 2654435761 + profile.id.length * 97 + seedNumber * 13) % persona.images.length;
      const imgTemplate = persona.images[imgIdx];
      content = imgTemplate.caption;
      feeling = imgTemplate.feeling;
      mediaUrl = getApiMediaForPost(profile.name, profile.kind, profile.id, uniqueSeed);
      mediaType = 'image';
    } else if (postType === 'poll' && persona.polls.length > 0) {
      const pollIdx = Math.abs(uniqueSeed * 2654435761 + profile.id.length * 97 + seedNumber * 19) % persona.polls.length;
      const pollTemplate = persona.polls[pollIdx];
      content = `Official community poll from ${profile.name}! Your input matters:`;
      feeling = 'curious';
      const optVotes = pollTemplate.options.map(() => Math.floor(Math.random() * 950) + 200);
      pollData = {
        id: `poll_${uniqueSeed}`,
        question: pollTemplate.question,
        options: pollTemplate.options.map((optText, optIdx) => ({
          id: `opt_${uniqueSeed}_${optIdx}`,
          text: optText,
          votes: optVotes[optIdx]
        })),
        totalVotes: optVotes.reduce((a, b) => a + b, 0)
      };
    } else {
      const statIdx = Math.abs(uniqueSeed * 2654435761 + profile.id.length * 97 + seedNumber * 23) % persona.statuses.length;
      content = persona.statuses[statIdx] || `Reflecting on today's momentum with ${profile.name}. Building with care!`;
      feeling = 'thoughtful';
    }
  } else {
    // Kind-based dynamic fallback for all remaining profiles
    if (postType === 'image') {
      const dynamicImageThemes = [
        `Behind the scenes at today's shoot with ${profile.name}! Capturing the creative flow under studio lighting.`,
        `Quiet moment enjoying a hot espresso during rehearsals. Always taking time to appreciate the journey!`,
        `Golden hour visual from the city overlook with ${profile.name}. Grateful for this community and all the support!`,
        `Exploring new visual aesthetics and styling today. Art is all about stepping into fresh perspectives.`,
        `On location capturing sunset reflections with ${profile.name}. Exciting projects dropping soon!`,
        `Studio session notes and visual concepts coming together beautifully. Passion drives the craft!`
      ];
      content = dynamicImageThemes[seedNumber % dynamicImageThemes.length];
      feeling = 'creative';
      mediaUrl = getApiMediaForPost(profile.name, profile.kind, profile.id, uniqueSeed);
      mediaType = 'image';
    } else if (postType === 'poll') {
      content = `Direct question from ${profile.name} to the community:`;
      feeling = 'curious';
      const optVotes1 = Math.floor(Math.random() * 800) + 200;
      const optVotes2 = Math.floor(Math.random() * 700) + 150;
      const optVotes3 = Math.floor(Math.random() * 600) + 100;
      pollData = {
        id: `poll_${uniqueSeed}`,
        question: `What kind of project or update from ${profile.name} would you love to see next?`,
        options: [
          { id: `opt_${uniqueSeed}_1`, text: "Original deep-dive feature release", votes: optVotes1 },
          { id: `opt_${uniqueSeed}_2`, text: "Interactive live Q&A session", votes: optVotes2 },
          { id: `opt_${uniqueSeed}_3`, text: "Exclusive behind-the-scenes gallery", votes: optVotes3 }
        ],
        totalVotes: optVotes1 + optVotes2 + optVotes3
      };
    } else {
      const dynamicThoughts = [
        `Reflecting on today's momentum. Energy spent on building what you love is never wasted.`,
        `The timeline moves fast, but the work that truly matters is built quietly with patience and care.`,
        `Thankful for everyone reaching out with words of encouragement. You keep the fire burning bright!`
      ];
      content = dynamicThoughts[seedNumber % dynamicThoughts.length];
      feeling = 'reflective';
    }
  }

  const comments = generateRandomComments(content, 12, 50);

  return {
    id: `ai_p_${profile.id}_${uniqueSeed}`,
    authorId: profile.id,
    authorName: profile.name,
    authorSubtitle: profile.subtitle,
    authorAvatar: profile.avatar,
    kind: profile.kind,
    isVerified: profile.verifiedBadge,
    content,
    mediaUrl,
    mediaType,
    poll: pollData,
    feeling,
    timestamp: 'Just now',
    reactions: {
      like: baseLikes,
      love: Math.floor(baseLikes * 0.7),
      haha: Math.floor(baseLikes * 0.3),
      wow: Math.floor(baseLikes * 0.35),
      sad: 0,
      angry: 0,
      mindblown: Math.floor(baseLikes * 0.4),
      heroic: Math.floor(baseLikes * 0.5)
    },
    celebrityReactions: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 3).map((cp) => ({
      id: `cr_dyn_${cp.id}_${uniqueSeed}`,
      profileId: cp.id,
      name: cp.name,
      subtitle: cp.subtitle,
      avatar: cp.avatar,
      kind: cp.kind,
      type: cp.reactionsStyle[0] || 'like'
    })),
    upvotes: baseLikes + Math.floor(Math.random() * 1000) + 200,
    downvotes: Math.floor(Math.random() * 15),
    comments,
    shares: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 2).map((sp, sIdx) => ({
      id: `sh_dyn_${sp.id}_${sIdx}_${uniqueSeed}`,
      profileId: sp.id,
      name: sp.name,
      subtitle: sp.subtitle,
      avatar: sp.avatar,
      kind: sp.kind,
      quote: `Incredible update from ${profile.name}! Must see!`,
      timestamp: '1h ago'
    }))
  };
}

/**
 * Generate an endless batch of AI-authored posts (mix of AI images, status updates, and polls)
 * - Video posting is strictly excluded for AI personas.
 * - Non-repeating, all-new images generated dynamically matching text.
 */
export function generateBatchOfAiPosts(batchSize = 6, seedOffset = 0): Post[] {
  const newPosts: Post[] = [];
  const rhythmPattern: ('image' | 'status' | 'poll')[] = ['image', 'image', 'image', 'status', 'image', 'image', 'poll', 'image'];

  for (let i = 0; i < batchSize; i++) {
    const globalIdx = seedOffset + i;
    const postType = rhythmPattern[globalIdx % rhythmPattern.length];
    
    // Pick profiles with high-entropy shuffling so diverse personas appear without predictable order
    const profileIdx = Math.abs((globalIdx * 17 + i * 31 + Math.floor(Math.random() * 50)) % ALL_PROFILES.length);
    const profile = ALL_PROFILES[profileIdx];

    const uniqueSeed = Date.now() + Math.abs(globalIdx * 3791) + Math.floor(Math.random() * 999999) + i * 7919;
    const post = createProceduralPost(profile.id, postType, uniqueSeed);
    newPosts.push(post);
  }

  return newPosts;
}

/**
 * Generate posts specifically for a given Profile ID.
 * Returns a high-density set of AI Image Posts, Status Updates, and Interactive Polls.
 */
export function generatePostsForSpecificProfile(profileId: string, count = 12, offset = 0): Post[] {
  const profile = ALL_PROFILES.find((p) => p.id === profileId);
  if (!profile) return [];

  const matchedTemplates = AI_STATUS_TEMPLATES.filter((t) => t.profileId === profileId);
  const posts: Post[] = [];
  const rhythmPattern: ('image' | 'status' | 'poll')[] = ['image', 'image', 'image', 'status', 'image', 'image', 'poll', 'image'];

  for (let i = 0; i < count; i++) {
    const globalIdx = i + offset;

    // First use handcrafted templates if within range and not previously consumed
    if (globalIdx < matchedTemplates.length) {
      const template = matchedTemplates[globalIdx];
      const uniqueSeed = Date.now() + globalIdx * 3791 + Math.floor(Math.random() * 100000);
      let mediaUrl: string | undefined = undefined;
      let mediaType: 'image' | undefined = undefined;
      let pollData: PollData | undefined = undefined;

      if (template.type === 'image') {
        mediaUrl = getApiMediaForPost(profile.name, profile.kind, profile.id, uniqueSeed);
        mediaType = 'image';
      } else if (template.type === 'poll' && template.poll) {
        const optVotes = template.poll.options.map(() => Math.floor(Math.random() * 1500) + 400);
        const totalVotes = optVotes.reduce((a, b) => a + b, 0);
        pollData = {
          id: `poll_${profile.id}_${uniqueSeed}`,
          question: template.poll.question,
          options: template.poll.options.map((optText, optIdx) => ({
            id: `opt_${profile.id}_${optIdx}_${uniqueSeed}`,
            text: optText,
            votes: optVotes[optIdx]
          })),
          totalVotes
        };
      }

      const comments = generateRandomComments(template.content, 14, 55);
      const baseLikes = Math.floor(Math.random() * 5500) + 1800;

      posts.push({
        id: `profile_post_${profile.id}_${globalIdx}_${uniqueSeed}`,
        authorId: profile.id,
        authorName: profile.name,
        authorSubtitle: profile.subtitle,
        authorAvatar: profile.avatar,
        kind: profile.kind,
        isVerified: profile.verifiedBadge,
        content: template.content,
        mediaUrl,
        mediaType,
        poll: pollData,
        feeling: template.feeling,
        timestamp: `${(i + 1) * 2}h ago`,
        reactions: {
          like: baseLikes,
          love: Math.floor(baseLikes * 0.7),
          haha: Math.floor(baseLikes * 0.3),
          wow: Math.floor(baseLikes * 0.35),
          sad: 0,
          angry: 0,
          mindblown: Math.floor(baseLikes * 0.4),
          heroic: Math.floor(baseLikes * 0.5)
        },
        celebrityReactions: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 3).map((cp) => ({
          id: `cr_pp_${cp.id}_${globalIdx}_${uniqueSeed}`,
          profileId: cp.id,
          name: cp.name,
          subtitle: cp.subtitle,
          avatar: cp.avatar,
          kind: cp.kind,
          type: cp.reactionsStyle[0] || 'like'
        })),
        upvotes: baseLikes + Math.floor(Math.random() * 1200) + 300,
        downvotes: Math.floor(Math.random() * 12),
        comments,
        shares: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 2).map((sp, sIdx) => ({
          id: `share_pp_${sp.id}_${sIdx}_${uniqueSeed}`,
          profileId: sp.id,
          name: sp.name,
          subtitle: sp.subtitle,
          avatar: sp.avatar,
          kind: sp.kind,
          quote: `Must-see from ${profile.name}!`,
          timestamp: `${sIdx + 2}h ago`
        }))
      });
    } else {
      // High-density procedural generation (75%+ image posts)
      const postType = rhythmPattern[globalIdx % rhythmPattern.length];
      posts.push(createProceduralPost(profileId, postType, globalIdx));
    }
  }

  return posts;
}

/**
 * Generates an on-demand AI Image Post for a character
 */
export async function generateAiImagePostForProfile(profileId: string, customCaption?: string): Promise<Post> {
  const profile = ALL_PROFILES.find((p) => p.id === profileId) || ALL_PROFILES[0];
  const matched = AI_STATUS_TEMPLATES.filter((t) => t.profileId === profileId && t.type === 'image');
  const template = matched[Math.floor(Math.random() * matched.length)];
  const content = customCaption || template?.content || `${profile.name} sharing a new perspective today.`;
  const feeling = template?.feeling || 'inspired';
  const seed = Date.now() + Math.floor(Math.random() * 999999);
  const mediaUrl = await fetchLiveApiImageForPost(profile.name, profile.kind, profile.id, seed);

  const baseLikes = Math.floor(Math.random() * 6000) + 2000;
  return {
    id: `ai_img_post_${profile.id}_${seed}`,
    authorId: profile.id,
    authorName: profile.name,
    authorSubtitle: profile.subtitle,
    authorAvatar: profile.avatar,
    kind: profile.kind,
    isVerified: profile.verifiedBadge,
    content,
    mediaUrl,
    mediaType: 'image',
    feeling,
    timestamp: 'Just now',
    reactions: {
      like: baseLikes,
      love: Math.floor(baseLikes * 0.75),
      haha: Math.floor(baseLikes * 0.25),
      wow: Math.floor(baseLikes * 0.4),
      sad: 0,
      angry: 0,
      mindblown: Math.floor(baseLikes * 0.5),
      heroic: Math.floor(baseLikes * 0.6)
    },
    celebrityReactions: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 3).map((cp) => ({
      id: `cr_img_${cp.id}_${seed}`,
      profileId: cp.id,
      name: cp.name,
      subtitle: cp.subtitle,
      avatar: cp.avatar,
      kind: cp.kind,
      type: cp.reactionsStyle[0] || 'love'
    })),
    upvotes: baseLikes + 850,
    downvotes: 4,
    comments: generateRandomComments(content, 15, 60),
    shares: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 2).map((sp, sIdx) => ({
      id: `sh_img_${sp.id}_${sIdx}`,
      profileId: sp.id,
      name: sp.name,
      subtitle: sp.subtitle,
      avatar: sp.avatar,
      kind: sp.kind,
      quote: `Stunning new post from ${profile.name}!`,
      timestamp: 'Just now'
    }))
  };
}

/**
 * Generates an on-demand Status Post for a character
 */
export function generateStatusPostForProfile(profileId: string, customText?: string): Post {
  const profile = ALL_PROFILES.find((p) => p.id === profileId) || ALL_PROFILES[0];
  const matched = AI_STATUS_TEMPLATES.filter((t) => t.profileId === profileId && t.type === 'status');
  const template = matched[Math.floor(Math.random() * matched.length)];
  const content = customText || template?.content || profile.sampleQuotes[0] || `Thoughts on today's momentum.`;
  const feeling = template?.feeling || 'thoughtful';
  const seed = Date.now() + Math.floor(Math.random() * 999999);
  const baseLikes = Math.floor(Math.random() * 4500) + 1200;

  return {
    id: `ai_stat_post_${profile.id}_${seed}`,
    authorId: profile.id,
    authorName: profile.name,
    authorSubtitle: profile.subtitle,
    authorAvatar: profile.avatar,
    kind: profile.kind,
    isVerified: profile.verifiedBadge,
    content,
    feeling,
    timestamp: 'Just now',
    reactions: {
      like: baseLikes,
      love: Math.floor(baseLikes * 0.6),
      haha: Math.floor(baseLikes * 0.4),
      wow: Math.floor(baseLikes * 0.2),
      sad: 0,
      angry: 0,
      mindblown: Math.floor(baseLikes * 0.3),
      heroic: Math.floor(baseLikes * 0.4)
    },
    celebrityReactions: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 3).map((cp) => ({
      id: `cr_stat_${cp.id}_${seed}`,
      profileId: cp.id,
      name: cp.name,
      subtitle: cp.subtitle,
      avatar: cp.avatar,
      kind: cp.kind,
      type: cp.reactionsStyle[0] || 'like'
    })),
    upvotes: baseLikes + 500,
    downvotes: 6,
    comments: generateRandomComments(content, 12, 45),
    shares: []
  };
}

/**
 * Generates an on-demand Poll Post for a character
 */
export function generatePollPostForProfile(
  profileId: string,
  customQuestion?: string,
  customOptions?: string[]
): Post {
  const profile = ALL_PROFILES.find((p) => p.id === profileId) || ALL_PROFILES[0];
  const matched = AI_STATUS_TEMPLATES.filter((t) => t.profileId === profileId && t.type === 'poll');
  const template = matched[Math.floor(Math.random() * matched.length)];

  const seed = Date.now() + Math.floor(Math.random() * 999999);
  const question = customQuestion || template?.poll?.question || `What should ${profile.name} focus on next?`;
  const rawOptions = customOptions || template?.poll?.options || [
    "Exclusive behind-the-scenes update",
    "Live fan Q&A session",
    "Special charity collaboration"
  ];

  const optVotes = rawOptions.map(() => Math.floor(Math.random() * 1200) + 350);
  const totalVotes = optVotes.reduce((a, b) => a + b, 0);

  const pollData: PollData = {
    id: `poll_${profile.id}_${seed}`,
    question,
    options: rawOptions.map((text, idx) => ({
      id: `opt_${seed}_${idx}`,
      text,
      votes: optVotes[idx]
    })),
    totalVotes
  };

  const content = template?.content || `Official poll from ${profile.name}! Community feedback requested below:`;
  const baseLikes = Math.floor(Math.random() * 5000) + 1600;

  return {
    id: `ai_poll_post_${profile.id}_${seed}`,
    authorId: profile.id,
    authorName: profile.name,
    authorSubtitle: profile.subtitle,
    authorAvatar: profile.avatar,
    kind: profile.kind,
    isVerified: profile.verifiedBadge,
    content,
    poll: pollData,
    feeling: 'curious',
    timestamp: 'Just now',
    reactions: {
      like: baseLikes,
      love: Math.floor(baseLikes * 0.7),
      haha: Math.floor(baseLikes * 0.3),
      wow: Math.floor(baseLikes * 0.4),
      sad: 0,
      angry: 0,
      mindblown: Math.floor(baseLikes * 0.35),
      heroic: Math.floor(baseLikes * 0.4)
    },
    celebrityReactions: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 3).map((cp) => ({
      id: `cr_poll_${cp.id}_${seed}`,
      profileId: cp.id,
      name: cp.name,
      subtitle: cp.subtitle,
      avatar: cp.avatar,
      kind: cp.kind,
      type: cp.reactionsStyle[0] || 'like'
    })),
    upvotes: baseLikes + 620,
    downvotes: 3,
    comments: generateRandomComments(content, 14, 50),
    shares: []
  };
}

/**
 * Asynchronously generates an on-the-fly post using the Gemini API backend route,
 * with automatic fallback to client-side rich procedural generation.
 */
export async function fetchOrGenerateAiPost(
  profileId: string,
  postType: 'image' | 'status' | 'poll',
  topic?: string
): Promise<Post> {
  const profile = ALL_PROFILES.find((p) => p.id === profileId) || ALL_PROFILES[0];

  try {
    const res = await fetch('/api/ai/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileName: profile.name,
        profileKind: profile.kind,
        profileSubtitle: profile.subtitle,
        postType,
        topic
      })
    });

    if (res.ok) {
      const { data } = await res.json();
      if (data && data.content) {
        const seed = Date.now() + Math.floor(Math.random() * 999999);
        let mediaUrl: string | undefined = undefined;
        let mediaType: 'image' | undefined = undefined;
        let pollData: PollData | undefined = undefined;

        if (postType === 'image') {
          const promptToUse = data.imagePrompt || data.content;
          const encodedPrompt = encodeURIComponent(promptToUse);
          mediaUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=800&nologo=true&seed=${seed}`;
          mediaType = 'image';
        } else if (postType === 'poll' && data.question && Array.isArray(data.options)) {
          const optVotes = data.options.map(() => Math.floor(Math.random() * 900) + 250);
          pollData = {
            id: `poll_gemini_${seed}`,
            question: data.question,
            options: data.options.map((optText: string, idx: number) => ({
              id: `opt_gemini_${seed}_${idx}`,
              text: optText,
              votes: optVotes[idx]
            })),
            totalVotes: optVotes.reduce((a: number, b: number) => a + b, 0)
          };
        }

        const baseLikes = Math.floor(Math.random() * 6500) + 2200;
        return {
          id: `ai_gemini_${profile.id}_${seed}`,
          authorId: profile.id,
          authorName: profile.name,
          authorSubtitle: profile.subtitle,
          authorAvatar: profile.avatar,
          kind: profile.kind,
          isVerified: profile.verifiedBadge,
          content: data.content,
          mediaUrl,
          mediaType,
          poll: pollData,
          feeling: data.feeling || 'inspired',
          timestamp: 'Just now',
          reactions: {
            like: baseLikes,
            love: Math.floor(baseLikes * 0.7),
            haha: Math.floor(baseLikes * 0.3),
            wow: Math.floor(baseLikes * 0.35),
            sad: 0,
            angry: 0,
            mindblown: Math.floor(baseLikes * 0.4),
            heroic: Math.floor(baseLikes * 0.5)
          },
          celebrityReactions: pickRandom(ALL_PROFILES.filter((p) => p.id !== profile.id), 3).map((cp) => ({
            id: `cr_gemini_${cp.id}_${seed}`,
            profileId: cp.id,
            name: cp.name,
            subtitle: cp.subtitle,
            avatar: cp.avatar,
            kind: cp.kind,
            type: cp.reactionsStyle[0] || 'like'
          })),
          upvotes: baseLikes + 900,
          downvotes: 5,
          comments: generateRandomComments(data.content, 15, 60),
          shares: []
        };
      }
    }
  } catch {
    // Fall back to client procedural generator
  }

  // Fallback
  if (postType === 'image') return await generateAiImagePostForProfile(profileId, topic);
  if (postType === 'poll') return generatePollPostForProfile(profileId, topic);
  return generateStatusPostForProfile(profileId, topic);
}
