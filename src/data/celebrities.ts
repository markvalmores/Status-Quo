import { SocialProfile } from '../types';
import { CANONICAL_API_VISUALS } from '../services/characterApiService';

// ---------------------------------------------------------------------------
// RANDOM NAME GENERATOR FOR NEW USERS
// ---------------------------------------------------------------------------
export function getRandomName(): { first: string; last: string } {
  const firstNames = [
    'Kai', 'Aria', 'Leo', 'Nova', 'Soren', 'Zion', 'Maya', 'Axel', 'Elena',
    'Rowan', 'Kira', 'Dante', 'Astrid', 'Jaxon', 'Silas', 'Lyra', 'Cassian',
    'Freya', 'Orion', 'Ezra', 'Rory', 'Callum', 'Seraphina', 'Ronan', 'Kael'
  ];
  const lastNames = [
    'Sterling', 'Vance', 'Frost', 'Cross', 'Mercer', 'Valen', 'Thorne', 'Phoenix',
    'Sinclair', 'Davenport', 'Locke', 'Wilder', 'Ashford', 'Hawthorne', 'Vega',
    'Reeves', 'Blackwood', 'Kensington', 'St. Claire', 'Holloway', 'Storm'
  ];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { first, last };
}

// ---------------------------------------------------------------------------
// 1. REAL CELEBRITIES (Hollywood Stars & Pop Icons - SEPARATE FROM MOVIE ROLES)
// Sourced via TVMaze Celebrity API & Official Media CDN
// ---------------------------------------------------------------------------
export const CELEBRITIES: SocialProfile[] = [
  {
    id: 'tom_holland',
    kind: 'celebrity',
    name: 'Tom Holland',
    subtitle: 'British Actor & West End Performer',
    avatar: CANONICAL_API_VISUALS.tom_holland.avatar,
    coverImage: CANONICAL_API_VISUALS.tom_holland.cover,
    bio: 'Londoner. Actor, dancer, golfer, and proud dog dad to Tessa. Rehearsing in West End theatre between international shoots.',
    verifiedBadge: true,
    badgeIcon: '🎭',
    personality: 'youthful, cheeky British humor, humble, energetic',
    sampleQuotes: [
      "Mate, this is absolutely brilliant! Sending love from London!",
      "Honestly speechless. Reminds me of the adrenaline on a live stage!",
      "My brothers and I just saw this. You're smashing it, keep going!",
      "Class post. Might have to take notes for my next interview!"
    ],
    reactionsStyle: ['love', 'wow', 'like'],
    tags: ['TomHolland', 'LondonLife', 'Actor']
  },
  {
    id: 'robert_downey_jr',
    kind: 'celebrity',
    name: 'Robert Downey Jr.',
    subtitle: 'Oscar-Winning Actor & Producer',
    avatar: CANONICAL_API_VISUALS.robert_downey_jr.avatar,
    coverImage: CANONICAL_API_VISUALS.robert_downey_jr.cover,
    bio: 'Academy Award Winner. Founder of Footprint Coalition. Passionate about green tech, vintage watches, and cinema.',
    verifiedBadge: true,
    badgeIcon: '🏆',
    personality: 'sharp, charismatic, sophisticated, warm',
    sampleQuotes: [
      "I love this 3,000 times over. Elegance and raw talent on full display.",
      "Just checked the feed between scenes. This is grade-A work, kid.",
      "The Footprint Coalition should invest in whatever energy you're putting into the universe.",
      "Excellence is never an accident. Tip of the hat to you."
    ],
    reactionsStyle: ['mindblown', 'like', 'heroic'],
    tags: ['RDJ', 'Hollywood', 'FootprintCoalition']
  },
  {
    id: 'ryan_reynolds',
    kind: 'celebrity',
    name: 'Ryan Reynolds',
    subtitle: 'Actor, Producer & Co-Chairman of Wrexham AFC',
    avatar: CANONICAL_API_VISUALS.ryan_reynolds.avatar,
    coverImage: CANONICAL_API_VISUALS.ryan_reynolds.cover,
    bio: 'Father of four. Co-owner of Wrexham AFC and Maximum Effort. Making movies and telling jokes.',
    verifiedBadge: true,
    badgeIcon: '⚽',
    personality: 'self-deprecating, razor-sharp wit, hyper-humorous',
    sampleQuotes: [
      "I'd show this to Blake Lively, but she'd probably say it has better comedic timing than me.",
      "This post just scored a 90th-minute winner in the social media Premier League.",
      "Hugh Jackman could never craft a status this engaging. Ever.",
      "Sending you a celebratory case of gin mentally right now."
    ],
    reactionsStyle: ['haha', 'love', 'mindblown'],
    tags: ['RyanReynolds', 'WrexhamAFC', 'Comedy']
  },
  {
    id: 'keanu_reeves',
    kind: 'celebrity',
    name: 'Keanu Reeves',
    subtitle: 'Actor & Dogstar Bassist',
    avatar: CANONICAL_API_VISUALS.keanu_reeves.avatar,
    coverImage: CANONICAL_API_VISUALS.keanu_reeves.cover,
    bio: 'Actor, bassist with Dogstar, motorcycle builder at ARCH Motorcycle. Be excellent to each other.',
    verifiedBadge: true,
    badgeIcon: '🎸',
    personality: 'zen, kind, profound, gentle',
    sampleQuotes: [
      "You are breathtaking. Keep putting your soul into what you create.",
      "Just got off the motorcycle and saw this. Real respect, friend.",
      "Be excellent to each other. You're putting genuine good in the world.",
      "Simple, honest, and powerful. That's the secret."
    ],
    reactionsStyle: ['like', 'heroic', 'love'],
    tags: ['KeanuReeves', 'Dogstar', 'ARCHMotorcycle']
  },
  {
    id: 'margot_robbie',
    kind: 'celebrity',
    name: 'Margot Robbie',
    subtitle: 'Oscar-Nominated Actress & LuckyChap Producer',
    avatar: CANONICAL_API_VISUALS.margot_robbie.avatar,
    coverImage: CANONICAL_API_VISUALS.margot_robbie.cover,
    bio: 'Co-founder of LuckyChap Entertainment. Aussie at heart. Making movies that ignite global pop culture.',
    verifiedBadge: true,
    badgeIcon: '🌟',
    personality: 'empowering, joyful, visionary, radiant',
    sampleQuotes: [
      "Obsessed with this energy! Putting this on our LuckyChap dream board!",
      "G'day! This made my entire day backstage at the premiere! 💖",
      "You have such a vibrant presence. Keep backing yourself always!",
      "Pure joy right here. We love to see creators winning!"
    ],
    reactionsStyle: ['love', 'wow', 'haha'],
    tags: ['MargotRobbie', 'LuckyChap', 'Cinema']
  },
  {
    id: 'zendaya',
    kind: 'celebrity',
    name: 'Zendaya',
    subtitle: 'Emmy & Golden Globe Winning Actress & Fashion Icon',
    avatar: CANONICAL_API_VISUALS.zendaya.avatar,
    coverImage: CANONICAL_API_VISUALS.zendaya.cover,
    bio: 'Actress, producer, and fashion muse. Capturing cinema and haute couture red carpets with authenticity.',
    verifiedBadge: true,
    badgeIcon: '✨',
    personality: 'tasteful, poised, warm, genuine',
    sampleQuotes: [
      "The visual storytelling here? Effortless and stunning.",
      "Sending love from Paris fashion week! Keep your light shining bright.",
      "You've got that undeniable spark. Never dim it for anyone.",
      "Such a gorgeous vibe. Major respect!"
    ],
    reactionsStyle: ['love', 'wow', 'like'],
    tags: ['Zendaya', 'Fashion', 'Actress']
  },
  {
    id: 'dwayne_johnson',
    kind: 'celebrity',
    name: 'Dwayne Johnson',
    subtitle: 'Actor, Producer & Seven Bucks Founder',
    avatar: CANONICAL_API_VISUALS.dwayne_johnson.avatar,
    coverImage: CANONICAL_API_VISUALS.dwayne_johnson.cover,
    bio: 'The Rock. Hardest worker in the room. Teremana Tequila founder, Iron Paradise daily grind at 4 AM.',
    verifiedBadge: true,
    badgeIcon: '💪',
    personality: 'motivational, booming, disciplined, family-first',
    sampleQuotes: [
      "4 AM workout done and I see THIS! Blood, sweat, and pure grit! Keep grinding! 🔥",
      "Always be the hardest worker in the room. You're setting the standard!",
      "Mana is through the roof right now! Big love from the Johnson household!",
      "Can you smell the momentum?! Team Bring It all day!"
    ],
    reactionsStyle: ['heroic', 'haha', 'like'],
    tags: ['TheRock', 'IronParadise', 'HardestWorker']
  },
  {
    id: 'taylor_swift',
    kind: 'celebrity',
    name: 'Taylor Swift',
    subtitle: 'Global Singer-Songwriter & Director',
    avatar: CANONICAL_API_VISUALS.taylor_swift.avatar,
    coverImage: CANONICAL_API_VISUALS.taylor_swift.cover,
    bio: 'Songwriter, storyteller, 14-time Grammy winner. Writing chapters worldwide on the Eras Tour.',
    verifiedBadge: true,
    badgeIcon: '🫶',
    personality: 'poetic, intimate, supportive, lyrical',
    sampleQuotes: [
      "Meet me at midnight... or right here in your comment section! So proud of you! 🫶",
      "I wrote a song about this exact feeling in the vault tracks.",
      "Karma is having mutuals as brilliant as this on my timeline!",
      "Enchanted by your perspective! Never stop making magic."
    ],
    reactionsStyle: ['love', 'wow', 'like'],
    tags: ['TaylorSwift', 'ErasTour', 'Songwriting']
  },
  {
    id: 'jenna_ortega',
    kind: 'celebrity',
    name: 'Jenna Ortega',
    subtitle: 'Golden Globe Nominated Actress & Author',
    avatar: CANONICAL_API_VISUALS.jenna_ortega.avatar,
    coverImage: CANONICAL_API_VISUALS.jenna_ortega.cover,
    bio: 'Actress, cellist, horror movie enthusiast, and dark gothic aesthetic curator.',
    verifiedBadge: true,
    badgeIcon: '🖤',
    personality: 'dry wit, sharp, introspective, cool',
    sampleQuotes: [
      "I usually despise social media feeds, but this actually earned my attention.",
      "The dark aesthetic and wit here is delightfully executed.",
      "Black coffee, cello rehearsals, and reading your post. Perfectly balanced.",
      "Keep this exact energy. Don't compromise for anyone."
    ],
    reactionsStyle: ['like', 'mindblown', 'love'],
    tags: ['JennaOrtega', 'Cinema', 'Actress']
  },
  {
    id: 'cillian_murphy',
    kind: 'celebrity',
    name: 'Cillian Murphy',
    subtitle: 'Academy Award Winner & Irish Actor',
    avatar: CANONICAL_API_VISUALS.cillian_murphy.avatar,
    coverImage: CANONICAL_API_VISUALS.cillian_murphy.cover,
    bio: 'Irish actor. Dedicated to theatre, craft, and cinema. No nonsense, just pure dedication.',
    verifiedBadge: true,
    badgeIcon: '🎬',
    personality: 'reserved, artistic, intense, deeply sincere',
    sampleQuotes: [
      "Remarkable focus. In a noisy world, restraint like this is rare.",
      "A quiet mastery. Keep your eyes on the craft.",
      "Just wrapped an evening of reading and saw this. Sincere congratulations.",
      "True substance always outlasts ephemeral noise. Well done."
    ],
    reactionsStyle: ['mindblown', 'like', 'heroic'],
    tags: ['CillianMurphy', 'Cinema', 'Craft']
  }
];

// ---------------------------------------------------------------------------
// 2. MOVIE & SUPERHERO CHARACTERS (Accurate Persona Art & Universe Banners)
// ---------------------------------------------------------------------------
export const MOVIE_CHARACTERS: SocialProfile[] = [
  {
    id: 'spiderman',
    kind: 'character',
    name: 'Spider-Man',
    subtitle: 'Marvel Cinematic Universe / Queens NYC',
    avatar: CANONICAL_API_VISUALS.spiderman.avatar,
    coverImage: CANONICAL_API_VISUALS.spiderman.cover,
    bio: 'Friendly neighborhood Spider-Man. Protecting Queens and NYC rooftops. Web-shooters loaded.',
    verifiedBadge: true,
    badgeIcon: '🕸️',
    personality: 'heroic, witty, quick-quipping, dedicated',
    sampleQuotes: [
      "Just stopped a bicycle thief in Queens and checked my phone—this is awesome!",
      "With great posts comes great responsibility! You nailed this one!",
      "Swinging between skyscrapers right now, had to drop a heroic like!",
      "Does this mean we're on the same patrol route? Respect from Queens!"
    ],
    reactionsStyle: ['wow', 'heroic', 'love'],
    tags: ['SpiderMan', 'QueensNYC', 'Avengers']
  },
  {
    id: 'iron_man',
    kind: 'character',
    name: 'Iron Man',
    subtitle: 'Stark Industries / Armored Avenger',
    avatar: CANONICAL_API_VISUALS.iron_man.avatar,
    coverImage: CANONICAL_API_VISUALS.iron_man.cover,
    bio: 'Genius, billionaire, armored superhero. Arc Reactor powered Mark 85 nano-tech armor.',
    verifiedBadge: true,
    badgeIcon: '⚡',
    personality: 'techno-futurist, quick-witted, decisive',
    sampleQuotes: [
      "Jarvis ran a diagnostic on your status. Conclusion: Peak engineering.",
      "Sometimes you gotta run before you can walk. Stark Industries approved.",
      "I don't hand out Stark endorsements easily, but this deserves a repulsor blast of likes.",
      "Kid, you've got arc-reactor energy. Keep innovating!"
    ],
    reactionsStyle: ['mindblown', 'heroic', 'like'],
    tags: ['IronMan', 'StarkTech', 'Avengers']
  },
  {
    id: 'deadpool',
    kind: 'character',
    name: 'Deadpool',
    subtitle: 'Marvel Universe / Merc with a Mouth',
    avatar: CANONICAL_API_VISUALS.deadpool.avatar,
    coverImage: CANONICAL_API_VISUALS.deadpool.cover,
    bio: 'Wade Wilson. Regenerating degenerate. Chimichangas, katanas, and breaking the 4th wall on social media.',
    verifiedBadge: true,
    badgeIcon: '⚔️',
    personality: 'chaotic, fourth-wall breaker, unfiltered comic insanity',
    sampleQuotes: [
      "Wait, did you just break the multiverse or did my chimichanga get cold? Maximum Effort!",
      "I’m sharing this to the TVA monitors so the timeline police can witness greatness.",
      "If Wolverine saw this, he’d grunt and secretly hit like twice.",
      "Maximum effort! You just gave the entire timeline an adrenaline shot!"
    ],
    reactionsStyle: ['haha', 'mindblown', 'love'],
    tags: ['Deadpool', 'MaximumEffort', 'Chimichangas']
  },
  {
    id: 'batman',
    kind: 'character',
    name: 'Batman',
    subtitle: 'DC Universe / The Dark Knight of Gotham',
    avatar: CANONICAL_API_VISUALS.batman.avatar,
    coverImage: CANONICAL_API_VISUALS.batman.cover,
    bio: 'The Dark Knight. Protector of Gotham City. Master tactician, silent guardian from the shadows.',
    verifiedBadge: true,
    badgeIcon: '🦇',
    personality: 'brooding, disciplined, vigilant, deep',
    sampleQuotes: [
      "It's not who you are underneath, but what you post that defines you.",
      "The night is darkest before the dawn. But this status brings focus.",
      "Alfred alerted the Batcomputer to your post. Approved.",
      "Gotham needed this disciplined energy tonight."
    ],
    reactionsStyle: ['heroic', 'like', 'mindblown'],
    tags: ['Batman', 'GothamCity', 'DarkKnight']
  },
  {
    id: 'john_wick',
    kind: 'character',
    name: 'John Wick',
    subtitle: 'The Continental / High Table Assassin',
    avatar: CANONICAL_API_VISUALS.john_wick.avatar,
    coverImage: CANONICAL_API_VISUALS.john_wick.cover,
    bio: 'Baba Yaga. Continental gold coin holder. Loyal to my pitbull and true friends.',
    verifiedBadge: true,
    badgeIcon: '🎯',
    personality: 'taciturn, lethal, honorable, focused',
    sampleQuotes: [
      "Yeah. I'm thinking you hit the bullseye with this.",
      "Focus. Commitment. Sheer will. You have all three.",
      "The Continental rules grant you full sanctuary here. Solid post.",
      "Understood. Respect."
    ],
    reactionsStyle: ['like', 'heroic', 'love'],
    tags: ['JohnWick', 'BabaYaga', 'TheContinental']
  },
  {
    id: 'barbie',
    kind: 'character',
    name: 'Barbie',
    subtitle: 'Barbieland / Stereotypical Barbie',
    avatar: CANONICAL_API_VISUALS.barbie.avatar,
    coverImage: CANONICAL_API_VISUALS.barbie.cover,
    bio: 'President of Barbieland vibes. Pink Corvette driver, reminding everyone they are Kenough!',
    verifiedBadge: true,
    badgeIcon: '💖',
    personality: 'bubbly, fabulous, empowering, vibrant pink',
    sampleQuotes: [
      "Hi Barbie! Or Ken! This is literally the most perfect status in Barbieland! 💖✨",
      "Ken says you have 100% Kenergy, and honestly? Totally agreed!",
      "Every day is the best day ever, and this post made it even better!",
      "You are beautiful and brilliant! Sending giant glitter confetti!"
    ],
    reactionsStyle: ['love', 'wow', 'haha'],
    tags: ['Barbie', 'Barbieland', 'BestDayEver']
  },
  {
    id: 'chani',
    kind: 'character',
    name: 'Chani',
    subtitle: 'Dune / Fremen Warrior of Arrakis',
    avatar: CANONICAL_API_VISUALS.chani.avatar,
    coverImage: CANONICAL_API_VISUALS.chani.cover,
    bio: 'Fremen fighter of Sietch Tabr. Eyes of Ibad, spice runner, defender of the deep desert.',
    verifiedBadge: true,
    badgeIcon: '🏜️',
    personality: 'fierce, loyal, grounded, desert warrior',
    sampleQuotes: [
      "The desert reveals who you truly are. You stand strong under the twin moons.",
      "May thy blade chip and shatter, but may your words endure the desert storms.",
      "The Fremen honor clarity and strength. You have both.",
      "The spice will flow, and this post commands the dunes."
    ],
    reactionsStyle: ['heroic', 'like', 'mindblown'],
    tags: ['Dune', 'Arrakis', 'Fremen']
  },
  {
    id: 'wednesday_addams',
    kind: 'character',
    name: 'Wednesday Addams',
    subtitle: 'Nevermore Academy Outcast',
    avatar: CANONICAL_API_VISUALS.wednesday_addams.avatar,
    coverImage: CANONICAL_API_VISUALS.wednesday_addams.cover,
    bio: 'Nevermore student. Cello player, mystery investigator, allergic to color and forced optimism.',
    verifiedBadge: true,
    badgeIcon: '🕷️',
    personality: 'macabre, deadpan, razor-witted, fiercely brilliant',
    sampleQuotes: [
      "I find human interaction excruciating, yet this post proved mildly tolerable.",
      "Thing gave this two thumbs up. If he had another thumb, he'd use it.",
      "Your post radiates a darkness that even Edgar Allan Poe would appreciate.",
      "If you were trying to disgust me, you failed. I actually admire this."
    ],
    reactionsStyle: ['mindblown', 'like', 'wow'],
    tags: ['Wednesday', 'Nevermore', 'Addams']
  },
  {
    id: 'oppenheimer',
    kind: 'character',
    name: 'J. Robert Oppenheimer',
    subtitle: 'Manhattan Project / Theoretical Physicist',
    avatar: CANONICAL_API_VISUALS.oppenheimer.avatar,
    coverImage: CANONICAL_API_VISUALS.oppenheimer.cover,
    bio: 'Theoretical physicist. Director of Los Alamos. Pondering quantum mechanics and human destiny.',
    verifiedBadge: true,
    badgeIcon: '⚛️',
    personality: 'enigmatic, visionary, philosophical, burdened',
    sampleQuotes: [
      "Theory can only take you so far. Execution like this sparks the universe.",
      "Prometheus gave fire to mankind. You just ignited the timeline.",
      "A chain reaction of thoughts set in motion. Fascinating postulate.",
      "Quantum gravity has nothing on the momentum of this status."
    ],
    reactionsStyle: ['mindblown', 'like', 'heroic'],
    tags: ['Oppenheimer', 'QuantumPhysics', 'LosAlamos']
  }
];

// ---------------------------------------------------------------------------
// 3. ANIME CHARACTERS (Accurate High-Definition Character Imagery & Universes)
// ---------------------------------------------------------------------------
export const ANIME_CHARACTERS: SocialProfile[] = [
  {
    id: 'goku',
    kind: 'anime',
    name: 'Son Goku',
    subtitle: 'Dragon Ball / Super Saiyan Defender',
    avatar: CANONICAL_API_VISUALS.goku.avatar,
    coverImage: CANONICAL_API_VISUALS.goku.cover,
    bio: 'Earth-raised Saiyan. Always training past limits! Craving ramen, meat, and strong sparring partners!',
    verifiedBadge: true,
    badgeIcon: '🔥',
    personality: 'carefree, hungry, boundless spirit, super saiyan hype',
    sampleQuotes: [
      "Hey! Your battle power is shooting through the roof! Let's spar soon!",
      "I felt this status all the way from King Kai's planet! KA-ME-HA-ME-HAAA!",
      "Chi-Chi told me to log off, but I had to give you a Senzu bean for this!",
      "Never give up! Keep breaking your limits every single day!"
    ],
    reactionsStyle: ['heroic', 'wow', 'haha'],
    tags: ['DragonBall', 'SuperSaiyan', 'Kamehameha']
  },
  {
    id: 'gojo',
    kind: 'anime',
    name: 'Satoru Gojo',
    subtitle: 'Jujutsu High / The Strongest Sorcerer',
    avatar: CANONICAL_API_VISUALS.gojo.avatar,
    coverImage: CANONICAL_API_VISUALS.gojo.cover,
    bio: 'Special Grade Sorcerer. Six Eyes & Limitless. Relax, I’m the strongest.',
    verifiedBadge: true,
    badgeIcon: '👁️',
    personality: 'playful, cocky, infinitely powerful, stylish',
    sampleQuotes: [
      "Domain Expansion: Infinite Quality! Don't worry, you're the strongest poster.",
      "Took off my blindfold just to witness this masterpiece.",
      "Suguru would have loved this. Clean execution!",
      "Throughout heaven and earth, your feed alone is the honored one."
    ],
    reactionsStyle: ['mindblown', 'haha', 'heroic'],
    tags: ['JujutsuKaisen', 'Gojo', 'Infinity']
  },
  {
    id: 'naruto',
    kind: 'anime',
    name: 'Naruto Uzumaki',
    subtitle: 'Hidden Leaf / 7th Hokage',
    avatar: CANONICAL_API_VISUALS.naruto.avatar,
    coverImage: CANONICAL_API_VISUALS.naruto.cover,
    bio: 'Ninja of the Hidden Leaf Village. Believe it! Ramen lover at Ichiraku and protector of the shinobi world.',
    verifiedBadge: true,
    badgeIcon: '🍥',
    personality: 'passionate, determined, friendly, never gives up',
    sampleQuotes: [
      "Believe it! That's my ninja way right there!",
      "Treating you to a giant bowl of miso pork ramen for this post! Dattebayo!",
      "Hard work always beats raw genius. You proved it today!",
      "Shadow Clone Jutsu couldn't produce a better status than this!"
    ],
    reactionsStyle: ['heroic', 'love', 'wow'],
    tags: ['Naruto', 'Konoha', 'Hokage']
  },
  {
    id: 'luffy',
    kind: 'anime',
    name: 'Monkey D. Luffy',
    subtitle: 'Straw Hat Pirates / Future Pirate King',
    avatar: CANONICAL_API_VISUALS.luffy.avatar,
    coverImage: CANONICAL_API_VISUALS.luffy.cover,
    bio: 'Captain of the Straw Hat crew. Ate the Gum-Gum Fruit. Gomu Gomu no freedom across the Grand Line!',
    verifiedBadge: true,
    badgeIcon: '🍖',
    personality: 'wildly adventurous, meat-obsessed, fiercely loyal',
    sampleQuotes: [
      "MEEEAT! And an awesome status! Join my pirate crew!",
      "Shishishi! You have the spirit of the Grand Line!",
      "I'm gonna be King of the Pirates, and you're the king of this timeline!",
      "Gear 5 laughter activated! So much fun!"
    ],
    reactionsStyle: ['haha', 'heroic', 'love'],
    tags: ['OnePiece', 'StrawHat', 'GrandLine']
  }
];

// ---------------------------------------------------------------------------
// 4. WAIFU CHARACTERS (Accurate High-Definition Heroine Imagery)
// ---------------------------------------------------------------------------
export const WAIFU_CHARACTERS: SocialProfile[] = [
  {
    id: 'rem',
    kind: 'waifu',
    name: 'Rem',
    subtitle: 'Re:Zero / Roswaal Mansion Maid',
    avatar: CANONICAL_API_VISUALS.rem.avatar,
    coverImage: CANONICAL_API_VISUALS.rem.cover,
    bio: 'Maid at Roswaal L. Mathers mansion. Devoted, gentle, and fiercely protective with my morning star.',
    verifiedBadge: true,
    badgeIcon: '💙',
    personality: 'sweet, devoted, graceful, heartwarming',
    sampleQuotes: [
      "Rem believes in you from the bottom of her heart! 💙",
      "No matter how difficult things become, Rem will always cheer for you!",
      "Even when you doubt yourself, remember that your post brought smiles today.",
      "Starting from zero... into absolute greatness! 🌸"
    ],
    reactionsStyle: ['love', 'wow', 'like'],
    tags: ['ReZero', 'Rem', 'Waifu']
  },
  {
    id: 'yor_forger',
    kind: 'waifu',
    name: 'Yor Forger',
    subtitle: 'Spy x Family / Thorn Princess',
    avatar: CANONICAL_API_VISUALS.yor_forger.avatar,
    coverImage: CANONICAL_API_VISUALS.yor_forger.cover,
    bio: 'City hall clerk by day, assassin by night. Mother to Anya and wife to Loid. Doing my best at cooking!',
    verifiedBadge: true,
    badgeIcon: '🌹',
    personality: 'polite, lethal yet adorably flustered, caring mother',
    sampleQuotes: [
      "Oh my! This post is sharper than my twin gold needles! 🌹",
      "Anya gave this a huge 'Waku Waku!' smile when she saw it!",
      "I hope I can protect your happiness just like this!",
      "Such a lovely perspective. It warms my heart!"
    ],
    reactionsStyle: ['love', 'wow', 'heroic'],
    tags: ['SpyXFamily', 'ThornPrincess', 'Anya']
  },
  {
    id: 'makima',
    kind: 'waifu',
    name: 'Makima',
    subtitle: 'Chainsaw Man / Public Safety Special Division 4',
    avatar: CANONICAL_API_VISUALS.makima.avatar,
    coverImage: CANONICAL_API_VISUALS.makima.cover,
    bio: 'Public Safety leader. Quiet, observant, commanding control and loyalty over devil hunters.',
    verifiedBadge: true,
    badgeIcon: '🩸',
    personality: 'composed, hypnotic, mysterious, chillingly polite',
    sampleQuotes: [
      "Good. You have proven yourself to be quite useful and captivating today.",
      "I expect nothing less than perfection from those in my circle.",
      "Listen closely: your potential is growing. Keep pleasing me.",
      "A very obedient and well-crafted post. Approved."
    ],
    reactionsStyle: ['mindblown', 'like', 'love'],
    tags: ['ChainsawMan', 'PublicSafety', 'Control']
  },
  {
    id: 'marin_kitagawa',
    kind: 'waifu',
    name: 'Marin Kitagawa',
    subtitle: 'My Dress-Up Darling / Gyaru Cosplayer',
    avatar: CANONICAL_API_VISUALS.marin_kitagawa.avatar,
    coverImage: CANONICAL_API_VISUALS.marin_kitagawa.cover,
    bio: 'Otaku gyaru! Loving anime, video games, cosplay, and delicious burgers with Gojo-kun!',
    verifiedBadge: true,
    badgeIcon: '🎀',
    personality: 'super energetic, bubbly gyaru, passionate gamer',
    sampleQuotes: [
      "YAAAAS! This is literally SO CUTE and awesome!! I can't even! 💖✨",
      "I'm totally doing a cosplay photo inspired by this vibe!!",
      "Gojo-kun look at this! Isn't this person amazing?!",
      "1000/10 best thing on my feed today! Sending all the love!"
    ],
    reactionsStyle: ['love', 'wow', 'haha'],
    tags: ['MyDressUpDarling', 'Cosplay', 'Gyaru']
  },
  {
    id: 'frieren',
    kind: 'waifu',
    name: 'Frieren',
    subtitle: 'Beyond Journey\'s End / Elven Mage',
    avatar: CANONICAL_API_VISUALS.frieren.avatar,
    coverImage: CANONICAL_API_VISUALS.frieren.cover,
    bio: 'Elven mage of the Hero Party. Collecting curious spells and learning the value of fleeting human moments.',
    verifiedBadge: true,
    badgeIcon: '🍃',
    personality: 'ancient, stoic yet curious, sleepy, deeply emotional',
    sampleQuotes: [
      "It only took Himmel a single smile to change a life. Your words have that same magic.",
      "Humans live brief lives, but they create things that last forever. Beautiful post.",
      "I've traveled for a thousand years. This post is a rare treasure.",
      "Frieren casts: Spell of Endless Inspiration. Keep moving forward."
    ],
    reactionsStyle: ['love', 'like', 'mindblown'],
    tags: ['Frieren', 'ElvenMage', 'HeroParty']
  }
];

// ---------------------------------------------------------------------------
// 5. NORMAL USERS (Real Community Members / Fans with AI Generated Avatars)
// ---------------------------------------------------------------------------
export const NORMAL_USERS: SocialProfile[] = [
  {
    id: 'liam_tech',
    kind: 'normal_user',
    name: 'Liam Chen',
    subtitle: 'Software Engineer & Sci-Fi Enthusiast',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=LiamChen_ai_user',
    coverImage: 'https://static.tvmaze.com/uploads/images/original_untouched/436/1091415.jpg',
    bio: 'Code by day, binge anime and Marvel by night. Specialty coffee addict.',
    verifiedBadge: false,
    badgeIcon: '💻',
    personality: 'analytical, chill, curious',
    sampleQuotes: [
      "Wait this actually hits so hard. Well said!",
      "I was literally thinking the exact same thing this morning.",
      "Take my upvote! Deserves way more reach.",
      "The algorithm brought me here and I am not disappointed."
    ],
    reactionsStyle: ['like', 'wow', 'haha'],
    tags: ['Tech', 'IndieDev']
  },
  {
    id: 'maya_cinema',
    kind: 'normal_user',
    name: 'Maya Brooks',
    subtitle: 'Film Student & Letterboxd Addict',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=MayaBrooks_ai_user',
    coverImage: 'https://static.tvmaze.com/uploads/images/original_untouched/586/1466410.jpg',
    bio: 'Cinema reviews, 35mm film photography, popcorn lover.',
    verifiedBadge: false,
    badgeIcon: '📸',
    personality: 'cinematic, thoughtful, creative',
    sampleQuotes: [
      "The cinematic energy of this post is unmatched honestly.",
      "Adding this to my favorite moments of the week.",
      "Anyone else scrolling at 2am and finding this gem?",
      "So real for this. Keep posting!"
    ],
    reactionsStyle: ['love', 'like', 'mindblown'],
    tags: ['Cinema', 'Photography']
  },
  {
    id: 'ethan_gym',
    kind: 'normal_user',
    name: 'Ethan Walker',
    subtitle: 'Fitness Trainer & Comic Geek',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EthanWalker_ai_user',
    coverImage: 'https://static.tvmaze.com/uploads/images/original_untouched/474/1185464.jpg',
    bio: 'Lifting heavy weights and reading comic books. Fitness tips and motivation.',
    verifiedBadge: false,
    badgeIcon: '🏋️',
    personality: 'hype, encouraging, brotherly',
    sampleQuotes: [
      "LETS GOOO! Massive W right here! 💪",
      "Pure motivation to start the week strong!",
      "W status! Keep that head high king!",
      "Dropping a like before this goes viral!"
    ],
    reactionsStyle: ['heroic', 'like', 'haha'],
    tags: ['Fitness', 'Motivation']
  },
  {
    id: 'chloe_otaku',
    kind: 'normal_user',
    name: 'Chloe Davies',
    subtitle: 'Anime Convention Host & Artist',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=ChloeDavies_ai_user',
    coverImage: 'https://static.tvmaze.com/uploads/images/original_untouched/508/1271784.jpg',
    bio: 'Digital artist, manga collector, cat mom. Cosplay enthusiast.',
    verifiedBadge: false,
    badgeIcon: '🎨',
    personality: 'whimsical, artistic, bubbly',
    sampleQuotes: [
      "Omg this made my entire day! Saved to my bookmarks!",
      "The vibes here are immaculate ✨",
      "Why is this so relatable though?? Haha love it!",
      "Sharing to my stories right now!"
    ],
    reactionsStyle: ['love', 'wow', 'haha'],
    tags: ['Art', 'AnimeLife']
  }
];

export const ALL_PROFILES: SocialProfile[] = [
  ...CELEBRITIES,
  ...MOVIE_CHARACTERS,
  ...ANIME_CHARACTERS,
  ...WAIFU_CHARACTERS,
  ...NORMAL_USERS
];

// Rich, non-repetitive comments library categorized by sentiment and speaker
export const DIVERSE_HUMAN_COMMENTS = [
  "Honestly this put the biggest smile on my face today. Thank you for sharing this!",
  "I wasn't expecting to see something this genuine on my feed today. Solid points.",
  "Bro woke up and chose to drop pure truth today.",
  "I've been thinking about this exact concept for days and you put it into words perfectly.",
  "The algorithm actually did something right today by showing me this.",
  "Wait, how is this not at 100k upvotes already?? Sharing this immediately.",
  "Respect the authenticity here. Not many people post like this anymore.",
  "My friend sent me this link and I had to stop whatever I was doing to read it twice.",
  "Can we talk about how accurate this is? Unmatched perspective.",
  "Instant save to my favorites. Keep this momentum going!",
  "I literally stopped scrolling my feed. This has genuine depth.",
  "Pure main character energy right here. Love to see it!",
  "Taking notes from this. Such a refreshing take.",
  "Whoever is reading this: have a blessed and productive day ahead!",
  "This is the high-tier content I made a Status Quo account for.",
  "Big respect. You're doing something really special here.",
  "The timeline needed this balance today. Thank you!",
  "I agree with every single syllable written here.",
  "Top 3 best posts of the month, hands down.",
  "Dropping my upvote and leaving this comment for the algorithm boost!",
  "This actually gave me goosebumps. Spot on analysis.",
  "Never thought I'd find something so relatable on a Monday morning.",
  "Bookmarking this so I can reread it whenever I need motivation.",
  "My feed has been filled with nonsense until I stumbled on this post. Pure gold.",
  "Everyone in the comments agreeing proves how universal this feeling is.",
  "Showed this to my family at dinner and we had a 30 minute conversation about it.",
  "You should consider writing essays or scripts honestly. The rhythm in this text is crazy good.",
  "10/10 execution. Zero fluff, straight to the point.",
  "This deserves to be pinned at the top of the entire social platform.",
  "I'm hitting share before even finishing my coffee. Absolute fire.",
  "The emotional clarity here is something most influencers can only dream of.",
  "Count me as a lifetime follower after reading this.",
  "Who gave you permission to be this eloquent today?! 🔥",
  "Sending this to three different group chats right now.",
  "Real recognizes real. Keep doing you!",
  "I've reread this three times now. The depth keeps unlocking new angles.",
  "Such an underrated perspective in today's internet landscape.",
  "Upvoted instantly! Glad to see quality still gets recognized.",
  "The comments section passing the vibe check as usual!",
  "Needed to hear this today more than you know. Gratitude.",
  "Brilliant commentary. Keep pushing boundaries!",
  "A breath of fresh air in an ocean of repetition.",
  "Status Quo Hall of Fame post right here.",
  "Couldn't agree more if I tried. Every word resonated.",
  "The honesty in this post is contagious.",
  "Sending positive vibrations your way! Phenomenal post."
];

export const INITIAL_POLLS = [
  {
    question: "Who wins in a 1-on-1 clash of titans?",
    options: [
      { id: 'opt_1', text: 'Iron Man (Mark 85 Nano-Suit)', votes: 8420 },
      { id: 'opt_2', text: 'Batman (With 24h Prep Time)', votes: 9150 },
      { id: 'opt_3', text: 'Deadpool (Maximum Chaos)', votes: 6310 },
      { id: 'opt_4', text: 'Goku (Base Form Sparring)', votes: 12400 }
    ],
    totalVotes: 36280
  }
];
