import { supabase } from './supabase';

export type SocialPostType = 'tiktok_hook' | 'instagram_reel' | 'wish_wall' | 'love_horoscope';
export type SocialPlatform = 'tiktok' | 'instagram' | 'facebook' | 'whatsapp' | 'twitter';
export type ScheduleTimeSlot = '8am' | '12pm' | '7pm' | '10pm';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface SocialPost {
  id: string;
  type: SocialPostType;
  caption: string;
  hook: string;
  hashtags: string[];
  image_url: string;
  platform: SocialPlatform;
  views: number;
  likes: number;
  shares: number;
  viral_score: number; // 0 - 100
  status: 'ready' | 'scheduled' | 'posted';
  qr_target_url?: string;
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  post_id: string;
  day_of_week: DayOfWeek;
  time_slot: ScheduleTimeSlot;
  scheduled_at: string; // ISO string
  status: 'pending' | 'reminded' | 'completed';
  reminded: boolean;
  notes?: string;
  created_at: string;
}

export interface ShareClickRecord {
  id: string;
  post_id?: string;
  referral_code: string;
  platform: string;
  clicks: number;
  last_clicked_at: string;
}

// 50 PRE-SEEDED ULTRA-VIRAL CAPTIONS ACROSS TIKTOK, REELS, WISH WALL & LOVE HOROSCOPES
export const INITIAL_50_VIRAL_POSTS: SocialPost[] = [
  // 1-5 User Prompt Specifics
  {
    id: 'post-1',
    type: 'tiktok_hook',
    hook: 'I joined RichConnect as a joke...',
    caption: 'I joined RichConnect as a joke, now a Dubai millionaire is flying me to Monaco next week... is this real? Link in bio sisters 😭✈️',
    hashtags: ['#richconnect', '#dubai', '#monaco', '#hypergamy', '#richgirls', '#billionairemindset', '#luxurylifestyle', '#datingadvice', '#traveltok', '#millionairematch', '#levelup', '#passportready', '#softlife', '#datingculture', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 48200,
    likes: 6200,
    shares: 1140,
    viral_score: 96,
    status: 'ready',
    created_at: '2026-10-14T09:00:00Z'
  },
  {
    id: 'post-2',
    type: 'tiktok_hook',
    hook: 'POV: You are tired of broke boys...',
    caption: 'POV: You were broke yesterday, today a Monaco millionaire sent you $500 for shopping - RichConnect 🛍️💸 Drop your city in comments!',
    hashtags: ['#richconnect', '#datingadvice', '#richgirl', '#monaco', '#paris', '#dubailife', '#highvaluewoman', '#financialfreedom', '#princessdiet', '#luxuryfashion', '#datingcoach', '#africanqueens', '#lifestylegoals', '#foryou', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 89400,
    likes: 12400,
    shares: 3120,
    viral_score: 98,
    status: 'ready',
    created_at: '2026-10-14T10:30:00Z'
  },
  {
    id: 'post-3',
    type: 'tiktok_hook',
    hook: 'My friend laughed when I said Monaco millionaires search in Lagos...',
    caption: 'My friend laughed when I said Monaco millionaires search in Lagos... now she is blowing up my phone asking for my referral link 😂👑',
    hashtags: ['#lagosgirls', '#richconnect', '#nigeriantiktok', '#bananaisland', '#monaco', '#dubaiairlines', '#softlifetok', '#hypergamybaddies', '#afrobeats', '#wealthymindset', '#interracialdating', '#queenstatus', '#explorepage', '#trending', '#foryourpage'],
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 63100,
    likes: 8900,
    shares: 1980,
    viral_score: 95,
    status: 'ready',
    created_at: '2026-10-15T12:00:00Z'
  },
  {
    id: 'post-4',
    type: 'instagram_reel',
    hook: 'Free girls are watching, Diamond Queens are flying...',
    caption: 'Free girls are watching, Diamond Queens are flying to Dubai — Which one are you? $0 to join, life forever changed 🥂💎',
    hashtags: ['#richgirlera', '#levelup', '#richconnect', '#dubaiyacht', '#monacolifestyle', '#femaleempowerment', '#luxurytravel', '#manifestation', '#wealthmindset', '#sovereignlove', '#softlifeera', '#parisjetaime', '#girlboss', '#reelsviral', '#millionairemind'],
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 42100,
    likes: 5400,
    shares: 920,
    viral_score: 92,
    status: 'ready',
    created_at: '2026-10-15T14:00:00Z'
  },
  {
    id: 'post-5',
    type: 'love_horoscope',
    hook: 'I asked AI when I will meet my millionaire...',
    caption: 'I asked AI when I will meet my millionaire, it said 11 days... It predicted he is 34, living in Dubai DIFC, and seeks an African Queen. Test your Love Predictor now! 🔮💫',
    hashtags: ['#aihoroscope', '#dubai', '#lovepredictor', '#richconnect', '#astrologylove', '#twinflame', '#billionairelove', '#manifestlove', '#zodiacsigns', '#soulmatefinder', '#relationshipadvice', '#tarotreading', '#spiritualtok', '#aiastrology', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 77200,
    likes: 11300,
    shares: 2450,
    viral_score: 97,
    status: 'ready',
    created_at: '2026-10-15T16:00:00Z'
  },

  // 6-10 Wish Wall Posts
  {
    id: 'post-6',
    type: 'wish_wall',
    hook: 'She wished for Dubai, she got Dubai ✈️',
    caption: 'She wished for Dubai, she got Dubai ✈️ — Post your dream luxury date on the RichConnect Wish Wall and watch what happens when sovereign men browse.',
    hashtags: ['#wishwall', '#richconnect', '#manifestation', '#dubaivacation', '#luxurydating', '#highvaluelove', '#passportprincess', '#palmjumeirah', '#dreamdate', '#millionaireadvisory', '#travelcouple', '#softliving', '#bossbabes', '#fypシ', '#viralvideo'],
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 31200,
    likes: 4100,
    shares: 780,
    viral_score: 89,
    status: 'ready',
    created_at: '2026-10-16T08:00:00Z'
  },
  {
    id: 'post-7',
    type: 'wish_wall',
    hook: 'Her wish: "Dinner at Eiffel Tower with someone who values my mind"',
    caption: 'Her wish: "Dinner at Eiffel Tower with someone who values my mind." 48 hours later, a verified London equity founder booked the table. The universe responds to high standards 🗼🥂',
    hashtags: ['#parisfoodie', '#eiffeltower', '#wishwall', '#richconnect', '#chivalryisnotdead', '#romanticgetaway', '#sovereigndating', '#artlovers', '#londonmen', '#mayfair', '#parisjetaime', '#manifestyourdream', '#datingstory', '#reels', '#queenenergy'],
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 52400,
    likes: 7200,
    shares: 1450,
    viral_score: 94,
    status: 'ready',
    created_at: '2026-10-16T11:00:00Z'
  },
  {
    id: 'post-8',
    type: 'wish_wall',
    hook: 'From texting broke guys to private helicopter to Monaco GP...',
    caption: 'From texting broke guys who split $20 bills to a private helicopter to Monaco Grand Prix. You are one decision away from a completely different tax bracket 🏎️🚁',
    hashtags: ['#monacogp', '#richgirlera', '#levelupyourlife', '#richconnect', '#millionaireclub', '#superyachts', '#montecarlo', '#highstandards', '#femaleradicalacceptance', '#manifestationbabe', '#luxurycars', '#privateloop', '#viralreels', '#datingtips', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 68900,
    likes: 9800,
    shares: 2100,
    viral_score: 96,
    status: 'ready',
    created_at: '2026-10-16T13:30:00Z'
  },
  {
    id: 'post-9',
    type: 'wish_wall',
    hook: 'She posted her dream yacht day in Lagos...',
    caption: 'She posted her dream yacht cruise in Lagos... Now she’s docking at Port Hercules with a sovereign investor. Your beauty appreciates here like Bitcoin ⚓✨',
    hashtags: ['#lagosparty', '#bananaisland', '#richconnect', '#monacoyachtshow', '#africangirlskillingit', '#luxuryisland', '#blackgirlsluxury', '#wealthymind', '#datingportal', '#softlifeclub', '#travelinfluencer', '#manifestnow', '#queenmindset', '#fyptiktok', '#trendingvideo'],
    image_url: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 38700,
    likes: 4900,
    shares: 880,
    viral_score: 91,
    status: 'ready',
    created_at: '2026-10-16T15:00:00Z'
  },
  {
    id: 'post-10',
    type: 'wish_wall',
    hook: 'Wish #481: "I want flowers delivered to my office from Monaco"',
    caption: 'Wish #481: "I want 500 red roses delivered to my office in London." Delivered at 10am with a handwritten note from Monaco. Never let a man convince you you’re asking for too much 🌹💌',
    hashtags: ['#rosedelivery', '#richconnect', '#romanticmen', '#chivalryalive', '#mayfairlondon', '#princessbehavior', '#spoiledgirlfriend', '#softgirllife', '#luxuryflowers', '#datinginlondon', '#manifestlove', '#explorepage', '#viraltrend', '#foryou', '#couplegoals'],
    image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 84300,
    likes: 13200,
    shares: 3400,
    viral_score: 99,
    status: 'ready',
    created_at: '2026-10-16T18:00:00Z'
  },

  // 11-20 TikTok Hooks & Real Talk
  {
    id: 'post-11',
    type: 'tiktok_hook',
    hook: 'The 3 texting rules that make high-value millionaires obsessed...',
    caption: 'The 3 texting rules that make high-value millionaires obsessed with you (Rule #2 will literally stop him from texting any other girl) 📱💎 Save this before it gets deleted!',
    hashtags: ['#textingrules', '#datingadvice', '#makehimobsessed', '#richconnect', '#millionairepsychology', '#femininemagnetism', '#darkfeminineenergy', '#highvaluewoman', '#datingcoach', '#textingtips', '#relationshiphack', '#mindsetshift', '#fypシ゚viral', '#viralhacks', '#richgirlera'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 95400,
    likes: 14700,
    shares: 4100,
    viral_score: 99,
    status: 'ready',
    created_at: '2026-10-17T09:00:00Z'
  },
  {
    id: 'post-12',
    type: 'tiktok_hook',
    hook: 'Why Monaco millionaires prefer educated African queens...',
    caption: 'Why Monaco millionaires prefer educated African queens over Instagram models: 1. Loyalty. 2. Cultural elegance. 3. Ambition. Stop hiding your greatness, queen 👑🌍',
    hashtags: ['#africanexcellence', '#sovereignlove', '#richconnect', '#monacolife', '#interracialdating', '#blackqueens', '#highsociety', '#dubaiexpat', '#londonliving', '#traditionaldating', '#powercouple', '#dynasty', '#fyp', '#viralgrowth', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 112000,
    likes: 18400,
    shares: 5200,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-17T11:00:00Z'
  },
  {
    id: 'post-13',
    type: 'tiktok_hook',
    hook: 'Tinder vs RichConnect: The brutal reality...',
    caption: 'Tinder: "Hey u up? Let\'s split a pizza at 1am." RichConnect: "My driver is outside your residence, private dining reserved at Zuma DIFC." Delete Tinder immediately ladies 😂',
    hashtags: ['#tindervsreality', '#datingappstruggles', '#richconnect', '#zumadubai', '#highstandardsonly', '#upgradeyourlife', '#softgirllifestyle', '#hypergamybaddie', '#datinghumor', '#girlstalk', '#londonhotspots', '#dubaidining', '#reelsviral', '#fypシ', '#trend'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 124000,
    likes: 21900,
    shares: 6800,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-17T13:00:00Z'
  },
  {
    id: 'post-14',
    type: 'tiktok_hook',
    hook: 'Rich Girl Passport: How your profile travels while you sleep...',
    caption: 'You go to sleep in Lagos or London, your profile rotates to Monaco and Dubai where verified billionaires are browsing right now. That’s the Rich Girl Passport™ difference ✈️🗺️',
    hashtags: ['#richgirlpassport', '#richconnect', '#traveltheworld', '#monacomen', '#dubaibillionaires', '#highsocietydating', '#passportqueen', '#sovereignwealth', '#exploreworld', '#globaldating', '#softlifeera', '#girltravel', '#dreamlife', '#viralcontent', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 71200,
    likes: 10100,
    shares: 2300,
    viral_score: 95,
    status: 'ready',
    created_at: '2026-10-17T15:00:00Z'
  },
  {
    id: 'post-15',
    type: 'tiktok_hook',
    hook: 'I tested the Millionaire Translator on my date\'s text...',
    caption: 'I tested the Millionaire Translator AI on what he texted me... It said "He is testing your boundaries, reply with this exact phrase to make him chase." He called 4 minutes later 🤯',
    hashtags: ['#aitranslator', '#datingtipsforwomen', '#richconnect', '#psychologyhacks', '#textingsecrets', '#makehimchase', '#darkfeminine', '#highvaluemen', '#datingadviceforgirls', '#relationshipprotocol', '#smartdating', '#viralhacks', '#foryourpage', '#mindblown', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 145000,
    likes: 24600,
    shares: 8900,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-17T17:00:00Z'
  },
  {
    id: 'post-16',
    type: 'instagram_reel',
    hook: 'What $5,000 presidential matchmaking actually looks like...',
    caption: 'What a $5,000 presidential matchmaking agency actually looks like inside: Zero public photos, diplomatic background vetting, and bespoke yacht introductions. Link in bio to apply 🥂',
    hashtags: ['#presidentialsuite', '#richconnect', '#luxuryconcierge', '#monacoenclave', '#sovereigndating', '#millionairelifestyle', '#elitematchmaking', '#exclusiveclub', '#mayfair', '#privateaviation', '#dynastybuilding', '#softlifestyle', '#reelsinstagram', '#luxurydating', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 58900,
    likes: 7400,
    shares: 1650,
    viral_score: 93,
    status: 'ready',
    created_at: '2026-10-17T19:00:00Z'
  },
  {
    id: 'post-17',
    type: 'love_horoscope',
    hook: 'Astrological Compatibility: Leo Queen + Monaco Capricorn Titan...',
    caption: 'Astrological AI Synergy: 97% Compatibility. "Your West African regal warmth naturally anchors his Mediterranean empire." Check your Love Predictor score today for free! ✨♌♑',
    hashtags: ['#zodiaclove', '#leoqueen', '#capricornman', '#astrologycompatibility', '#richconnect', '#twinflames', '#soulmatereading', '#horoscopetoday', '#lovepredictor', '#manifestyourking', '#astrotok', '#spiritualdating', '#relationshipastrology', '#fyp', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 49800,
    likes: 6800,
    shares: 1200,
    viral_score: 91,
    status: 'ready',
    created_at: '2026-10-18T08:00:00Z'
  },
  {
    id: 'post-18',
    type: 'tiktok_hook',
    hook: 'My mom said I was delusional for wanting a millionaire...',
    caption: 'My mom said I was delusional for wanting a man who pays for everything without asking. Today we just celebrated our 1-year anniversary in Portofino. Stay delusional, queens 💅👑',
    hashtags: ['#staydelusional', '#manifestationworks', '#richconnect', '#portofinogetaway', '#hypergamygoals', '#spoiledlife', '#generousmen', '#highstandardswoman', '#princesslife', '#datingstorytime', '#girlmotivation', '#levelupqueen', '#relationshipfacts', '#foryoupage', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 132000,
    likes: 20100,
    shares: 5900,
    viral_score: 99,
    status: 'ready',
    created_at: '2026-10-18T10:00:00Z'
  },
  {
    id: 'post-19',
    type: 'instagram_reel',
    hook: 'How to look expensive without spending $10k on designer bags...',
    caption: 'How to look effortlessly wealthy and attract sovereign men: 1. Flawless hair & posture. 2. Quiet luxury tones (cashmere, neutral creams). 3. Unapologetic grace. Free guide inside 🕊️',
    hashtags: ['#quietluxury', '#oldmoneyaesthetic', '#richconnect', '#elegancecoach', '#femininestyle', '#classyladies', '#stealthwealth', '#capsulewardrobe', '#chicstyle', '#luxurymindset', '#highstatus', '#parisstyle', '#monacolooks', '#reelsviral', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 64200,
    likes: 8300,
    shares: 2100,
    viral_score: 94,
    status: 'ready',
    created_at: '2026-10-18T12:00:00Z'
  },
  {
    id: 'post-20',
    type: 'wish_wall',
    hook: 'She posted her wish on Sunday, by Tuesday she was in DIFC...',
    caption: 'She posted her wish for a financial mentor & romantic partner on Sunday. By Tuesday she was sipping champagne at Il Borro Dubai with an aviation founder. The door is open 🔑✨',
    hashtags: ['#wishwall', '#richconnect', '#ilborrodubai', '#dubaidating', '#financialmentorship', '#sovereignlifestyle', '#africanroyalty', '#dreamdates', '#manifestlove', '#highvaluemen', '#luxurytraveler', '#softgirltok', '#manifestingmagic', '#foryou', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 79100,
    likes: 11800,
    shares: 2700,
    viral_score: 97,
    status: 'ready',
    created_at: '2026-10-18T14:00:00Z'
  },

  // 21-30 Reels & Hooks for London, Paris, Milan, Lagos, Monaco
  {
    id: 'post-21',
    type: 'tiktok_hook',
    hook: 'Stop asking men for $20 Uber money when you could be on a private jet...',
    caption: 'Stop asking guys for $20 Uber money when there are European heiress advisors & African tech titans flying private every weekend. Raise your frequency, sister 🛩️✨',
    hashtags: ['#privatejetlife', '#richconnect', '#highstandards', '#femalemindset', '#monacoluxury', '#dubaitravel', '#hypergamylife', '#softlifebabes', '#luxurydatingadvice', '#queenbehavior', '#travelgoals', '#manifestinglove', '#empowerwomen', '#viralvideo', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 88500,
    likes: 12900,
    shares: 3100,
    viral_score: 97,
    status: 'ready',
    created_at: '2026-10-18T16:00:00Z'
  },
  {
    id: 'post-22',
    type: 'instagram_reel',
    hook: 'Private Love Channel™: When your chats become a movie...',
    caption: 'Tired of boys who take you for granted? On RichConnect, couples turn their romantic dates into 3D Pixar animated movies & collect Love Points for real gifts 🌹🎬',
    hashtags: ['#lovechannel', '#richconnect', '#virtualdreamdate', '#romanticreels', '#pixaranimation', '#couplegoals', '#sovereignlove', '#monacoromance', '#fairytaledate', '#modernromance', '#loveispatient', '#creativecouples', '#digitalmemories', '#reels', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 45300,
    likes: 6200,
    shares: 1150,
    viral_score: 93,
    status: 'ready',
    created_at: '2026-10-18T18:00:00Z'
  },
  {
    id: 'post-23',
    type: 'love_horoscope',
    hook: 'Your Venus in Taurus is screaming for Monaco yachts...',
    caption: 'If your Venus is in Taurus, Cancer or Scorpio, you were literally not designed for 50/50 coffee dates. You thrive in pampering and high aesthetic stability ♉♋♏ Tap link in bio!',
    hashtags: ['#venustaurus', '#venuscancer', '#venusscorpio', '#astrologywomen', '#richconnect', '#hypergamyastrology', '#taurusseason', '#spoiledwife', '#femininemagic', '#astrologyfacts', '#manifestationbabes', '#zodiactok', '#spiritualtiktok', '#fyp', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 104000,
    likes: 16800,
    shares: 4400,
    viral_score: 98,
    status: 'ready',
    created_at: '2026-10-19T08:00:00Z'
  },
  {
    id: 'post-24',
    type: 'tiktok_hook',
    hook: 'The 1 mistake girls make when a millionaire asks them out...',
    caption: 'The #1 mistake girls make when a wealthy man asks them where they want to eat: Saying "I don’t care, anything is fine." NEVER say this. Here is the exact phrase that commands respect 🍽️👑',
    hashtags: ['#datingmistakes', '#highvaluewoman', '#richconnect', '#diningetiquette', '#socialskills', '#monacomen', '#confidenceiskey', '#femininegrace', '#hypergamy101', '#relationshipcoach', '#empoweredwomen', '#statusmatters', '#fypシ', '#viralhacks', '#richgirl'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 167000,
    likes: 27900,
    shares: 9400,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-19T10:00:00Z'
  },
  {
    id: 'post-25',
    type: 'wish_wall',
    hook: 'She said she wanted to spend her birthday in Lake Como...',
    caption: 'She posted on the RichConnect Wish Wall: "Lake Como Riva boat tour for my 25th birthday." A verified Milan fashion titan saw it. Dreams don’t have to stay in your camera roll 🚤🇮🇹',
    hashtags: ['#lakecomo', '#rivaboat', '#milanitaly', '#wishwall', '#richconnect', '#birthdaytrip', '#manifestation', '#luxurytravelgoals', '#italylovers', '#princesslifestyle', '#millionairedating', '#softlifebaddies', '#explorepage', '#viraltrend', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 51200,
    likes: 6700,
    shares: 1320,
    viral_score: 92,
    status: 'ready',
    created_at: '2026-10-19T12:00:00Z'
  },

  // 26-35 Rapid Viral Fire Captions
  {
    id: 'post-26',
    type: 'tiktok_hook',
    hook: 'Why 50/50 dating is a scam for ambitious women...',
    caption: 'Why 50/50 dating is a scam for high-value women: You spend on hair, makeup, gym, skincare, and energy — and he wants to split $18 pasta? Let RichConnect connect you with real providers 🍷',
    hashtags: ['#5050dating', '#providerenergy', '#richconnect', '#traditionalmen', '#chivalry', '#femininemagnetism', '#highstandards', '#girlstalk', '#softgirllife', '#datingadvice', '#hypergamytok', '#monacolifestyle', '#viralwords', '#truthhurts', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 189000,
    likes: 31200,
    shares: 11200,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-19T14:00:00Z'
  },
  {
    id: 'post-27',
    type: 'love_horoscope',
    hook: 'AI predicted: Your Monaco match is dropping in 4 hours...',
    caption: 'The AI countdown just triggered: Next Monaco & Dubai millionaire batch drops in 04:23:11. Check if your profile matches the verified intake criteria! ⏳🔐',
    hashtags: ['#monacobatch', '#richconnect', '#intakeopen', '#exclusivecircle', '#datingalgorithm', '#dubaicapital', '#vipaccess', '#passportready', '#sovereignmen', '#matchingnow', '#countdownbegins', '#explorepage', '#viraldating', '#fyp', '#luxury'],
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 61400,
    likes: 8100,
    shares: 1750,
    viral_score: 93,
    status: 'ready',
    created_at: '2026-10-19T16:00:00Z'
  },
  {
    id: 'post-28',
    type: 'instagram_reel',
    hook: 'The difference between being an option and being a priority...',
    caption: 'Being an option: He texts you "wyd" at 11pm. Being a priority: He coordinates your private car, books front-row Fashion Week seats, and calls your father with respect. Choose wisely 🖤',
    hashtags: ['#highvaluelove', '#richconnect', '#standardsetter', '#sovereignman', '#relationshipfacts', '#fashionweekparis', '#chivalrousmen', '#softlifeera', '#queenlifestyle', '#monacomarriage', '#datingstandards', '#reelsdaily', '#explore', '#viralreel', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 74800,
    likes: 10900,
    shares: 2650,
    viral_score: 96,
    status: 'ready',
    created_at: '2026-10-19T18:00:00Z'
  },
  {
    id: 'post-29',
    type: 'wish_wall',
    hook: 'Wish Wall Manifestation: "Private dining overlooking Dubai fountains"',
    caption: 'Wish Wall Manifestation #612: "Private dining overlooking Dubai fountains." Granted by a hedge fund director within 3 days. Your desires are safe with men who have the capacity to deliver 💎',
    hashtags: ['#dubaifountains', '#wishwall', '#richconnect', '#manifestationmagic', '#billionairelifestyle', '#sovereignmatch', '#femininereceiving', '#luxurytravel', '#dubaidates', '#softlifetok', '#explore', '#viraltrend', '#reels', '#fyp', '#queengirls'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 82100,
    likes: 12400,
    shares: 2900,
    viral_score: 97,
    status: 'ready',
    created_at: '2026-10-20T08:00:00Z'
  },
  {
    id: 'post-30',
    type: 'tiktok_hook',
    hook: 'How 2,847 girls applied this month from 31 countries...',
    caption: 'How 2,847 girls applied this month from 31 countries to join RichConnect: 100% vetted sovereign circle. Lagos, Dubai, Monaco, London. 60 seconds application, forever transformed 🌍🥂',
    hashtags: ['#richconnect', '#viralwaitlist', '#girlacquisition', '#monacocircle', '#dubaiheiress', '#africanqueens', '#globalcourtship', '#highsocietylife', '#millionairepassport', '#levelupgirls', '#softlifeluxury', '#datingapphack', '#fypシ゚viral', '#foryourpage', '#trending'],
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 97300,
    likes: 15300,
    shares: 3800,
    viral_score: 99,
    status: 'ready',
    created_at: '2026-10-20T10:00:00Z'
  },

  // 31-40 Extended Viral Portfolio
  {
    id: 'post-31',
    type: 'tiktok_hook',
    hook: 'When you realize rich men don’t look for models on Tinder...',
    caption: 'When you realize multi-millionaires don’t swipe on public dating apps — they pay $2,500 private retainers to bespoke advisory firms to find cultured, educated queens. Join the circle 🍸',
    hashtags: ['#bespokematchmaking', '#richconnect', '#wealthsecrets', '#highsociety', '#discreetdating', '#millionairelifestyle', '#traditionalromance', '#softgirlera', '#londonenclave', '#dubaibillionaires', '#fyp', '#viralgrowth', '#datinglife', '#explore', '#truth'],
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 118000,
    likes: 19100,
    shares: 5100,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-20T12:00:00Z'
  },
  {
    id: 'post-32',
    type: 'love_horoscope',
    hook: 'Scorpio Season: High-net-worth men are seeking deep emotional loyalty...',
    caption: 'Scorpio Season alert: High-net-worth men are done with superficial flings and searching for unwavering sovereign devotion. Check your compatibility radar on RichConnect now ♏🖤',
    hashtags: ['#scorpioseason', '#lovepredictor', '#richconnect', '#astrologydating', '#soulmatesync', '#deepconnections', '#monacolove', '#wealthandspirituality', '#zodiactok', '#manifestpartner', '#highstandards', '#reels', '#explorepage', '#fypシ', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 54600,
    likes: 7100,
    shares: 1400,
    viral_score: 92,
    status: 'ready',
    created_at: '2026-10-20T14:00:00Z'
  },
  {
    id: 'post-33',
    type: 'instagram_reel',
    hook: 'The luxury of not having to stress about rent...',
    caption: 'The luxury of waking up in a sunlit Mayfair penthouse with zero financial anxiety because your partner handles all provisions with pride. It is not a crime to desire security, sisters 🕊️',
    hashtags: ['#peaceofmind', '#sovereignliving', '#richconnect', '#mayfairpenthouse', '#financialpeace', '#princessdiet', '#wealthydating', '#traditionalfamily', '#queenstatus', '#softlifestyle', '#luxurylife', '#reelsviral', '#explore', '#fyp', '#viralpost'],
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 89300,
    likes: 13700,
    shares: 3450,
    viral_score: 98,
    status: 'ready',
    created_at: '2026-10-20T16:00:00Z'
  },
  {
    id: 'post-34',
    type: 'wish_wall',
    hook: 'Wish #809: "A partner who supports my art gallery expansion"',
    caption: 'Wish #809: "A sovereign partner who champions my art gallery dream." Seed funding + Mayfair gallery space secured through mutual alignment. Love that builds dynasties 🎨🏛️',
    hashtags: ['#artgallery', '#wishwall', '#richconnect', '#dynastybuilding', '#powercouplegoals', '#artbasel', '#africanart', '#londonwealth', '#supportivepartner', '#manifestwealth', '#womeninbusiness', '#softgirltok', '#explorepage', '#viraltrend', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 67300,
    likes: 8900,
    shares: 1890,
    viral_score: 94,
    status: 'ready',
    created_at: '2026-10-20T18:00:00Z'
  },
  {
    id: 'post-35',
    type: 'tiktok_hook',
    hook: 'The AI Love Predictor scanned 10,000 factors...',
    caption: 'The AI Love Predictor scanned 10,000 success factors before we even spoke on the phone. 98% compatibility. Now we are engaged in Cap d’Antibes. No other platform dares to do this 💍🌊',
    hashtags: ['#lovepredictor', '#richconnect', '#aialgorithm', '#capdantibes', '#engagedinfrance', '#millionaireengagement', '#sovereigncourtship', '#modernfairytale', '#passportqueen', '#manifestlove', '#reelsviral', '#tiktokdating', '#fypシ', '#viral', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 142000,
    likes: 22800,
    shares: 7200,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-21T08:00:00Z'
  },

  // 36-50 Final Batch (Full 50 pre-seeded database)
  {
    id: 'post-36',
    type: 'tiktok_hook',
    hook: 'If he wanted to, he would? No, if he COULD, he would...',
    caption: '"If he wanted to, he would" is a lie. If he HAS THE CAPACITY, he will. A broke man cannot fly you to Dubai no matter how much he likes you. Connect with capable kings on RichConnect ✈️',
    hashtags: ['#capacitymatters', '#richconnect', '#datingfacts', '#financialcapacity', '#highvaluemen', '#monacomen', '#dubaiexpat', '#hypergamymindset', '#queenenergy', '#stopsettling', '#femininereceiving', '#datingcoach', '#foryourpage', '#truthbomb', '#viral'],
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 175000,
    likes: 29400,
    shares: 10400,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-21T10:00:00Z'
  },
  {
    id: 'post-37',
    type: 'instagram_reel',
    hook: 'Ghost Wealth Mode™: Mystery is the new luxury...',
    caption: 'Why top European heiresses & African queens use Ghost Wealth Mode™: Your photos remain anonymous silhouettes until a verified millionaire unlocks your dossier. Discretion is power 🕶️🖤',
    hashtags: ['#ghostwealthmode', '#richconnect', '#discreetdating', '#privacyfirst', '#luxurycircle', '#monacoheiress', '#highsocietywomen', '#mysteriousbabe', '#sovereignlifestyle', '#exclusiveaccess', '#reelsinstagram', '#explorepage', '#viraldating', '#fyp', '#classy'],
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 52900,
    likes: 7100,
    shares: 1420,
    viral_score: 93,
    status: 'ready',
    created_at: '2026-10-21T12:00:00Z'
  },
  {
    id: 'post-38',
    type: 'love_horoscope',
    hook: 'Aries & Taurus: When Monaco fire meets Mediterranean patience...',
    caption: 'Aries Woman + Monaco Taurus Investor: Passion meets sovereign stability. High astrological alignment for long-term multi-continental marriage. Test your synergy score now! ♈♉',
    hashtags: ['#arieswoman', '#taurusman', '#astrologylove', '#richconnect', '#lovehoroscope', '#compatibilitymatch', '#sovereignlove', '#zodiactok', '#astrologynerd', '#millionairecouple', '#manifestation', '#explore', '#viraltrend', '#fypシ', '#couplesgoals'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 47800,
    likes: 6200,
    shares: 1100,
    viral_score: 90,
    status: 'ready',
    created_at: '2026-10-21T14:00:00Z'
  },
  {
    id: 'post-39',
    type: 'wish_wall',
    hook: 'Wish #1,024: "A man who loves African culture & chivalry"',
    caption: 'Wish #1,024: "A man who loves African culture, respects my heritage, and loves deeply." Matched with a private equity founder in London who chartered flights for Art X Lagos. Unbelievable 🌍',
    hashtags: ['#artxlagos', '#richconnect', '#wishwall', '#africanheritage', '#interracialromance', '#sovereignking', '#queenmindset', '#lagoslifestyle', '#londonart', '#blackgirlmagic', '#softlifequeens', '#manifestlove', '#explorepage', '#viralvideo', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 91400,
    likes: 14300,
    shares: 3500,
    viral_score: 98,
    status: 'ready',
    created_at: '2026-10-21T16:00:00Z'
  },
  {
    id: 'post-40',
    type: 'tiktok_hook',
    hook: 'The secret door where Monaco millionaires seek African queens...',
    caption: 'We are not Tinder. We are not OnlyFans. We are The Private Circle Where Monaco Millionaires Seek African Queens. 31 Countries. One secret door. Apply today 🚪✨',
    hashtags: ['#thesecretdoor', '#richconnect', '#monacomillionaires', '#africanqueens', '#elitedating', '#sovereigncircle', '#dubaidating', '#highsocietylife', '#softgirllifestyle', '#hypergamydating', '#exclusiveenclave', '#manifestinglove', '#fyp', '#viralnow', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 215000,
    likes: 38700,
    shares: 14200,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-21T18:00:00Z'
  },
  {
    id: 'post-41',
    type: 'instagram_reel',
    hook: '5 signs you are in your Rich Girl Era...',
    caption: '5 signs you have officially entered your Rich Girl Era: 1. You no longer explain your standards. 2. You refuse to split bills. 3. You only date men who protect your peace. 4. You travel first-class. 5. You are on RichConnect 🥂💅',
    hashtags: ['#richgirlera', '#levelupqueen', '#richconnect', '#standardsandboundaries', '#femaleradicalacceptance', '#monacolifestyle', '#firstclasstravel', '#softlivingbabe', '#highvalueladies', '#reelsinstagram', '#viralreels', '#manifestationbabe', '#luxuryvibes', '#foryou', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 84300,
    likes: 12100,
    shares: 2950,
    viral_score: 97,
    status: 'ready',
    created_at: '2026-10-22T08:00:00Z'
  },
  {
    id: 'post-42',
    type: 'tiktok_hook',
    hook: 'How to make a high-status man respect your time immediately...',
    caption: 'How to make a high-status man respect your time immediately without sounding aggressive or entitled. Save this audio and script for your next WhatsApp conversation 🎙️✨',
    hashtags: ['#datingetiquette', '#highstatuscommunication', '#richconnect', '#textingsecrets', '#makehimrespectyou', '#feminineauthority', '#sovereignwoman', '#relationshiphack', '#datingadviceforwomen', '#classyladies', '#explorepage', '#fypシ', '#viraltips', '#datingtips', '#queen'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 129000,
    likes: 20400,
    shares: 6100,
    viral_score: 99,
    status: 'ready',
    created_at: '2026-10-22T10:00:00Z'
  },
  {
    id: 'post-43',
    type: 'wish_wall',
    hook: 'Wish #1,219: "A partner who flies to me when I have a bad day"',
    caption: 'Wish #1,219: "A man who actually shows up." When she had a rough week in Paris, he flew from London just to take her for tea at Le Bristol. That is provider energy ☕🥐',
    hashtags: ['#lebristolparis', '#richconnect', '#wishwall', '#providerenergy', '#chivalryisreal', '#parisluxury', '#romanticgestures', '#softlifequeen', '#manifestationlife', '#gentlemanstyle', '#datingstory', '#reels', '#fyp', '#viralromance', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 76500,
    likes: 11200,
    shares: 2600,
    viral_score: 96,
    status: 'ready',
    created_at: '2026-10-22T12:00:00Z'
  },
  {
    id: 'post-44',
    type: 'love_horoscope',
    hook: 'Libra Queen: Your diplomatic grace is attracting family office wealth...',
    caption: 'Libra Venus: Your natural diplomacy, eye for fine art, and poise is currently attracting European family office capital. Stop dimming your charm for insecure men ♎🎨',
    hashtags: ['#libraqueen', '#libravenus', '#richconnect', '#astrologyhoroscope', '#familyoffice', '#monacolifestyle', '#artlovers', '#highstandardslove', '#zodiacgirlies', '#spiritualmanifestation', '#datingpredictions', '#explorepage', '#viraltiktok', '#fyp', '#queen'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 61200,
    likes: 8400,
    shares: 1800,
    viral_score: 93,
    status: 'ready',
    created_at: '2026-10-22T14:00:00Z'
  },
  {
    id: 'post-45',
    type: 'instagram_reel',
    hook: 'Why RichConnect has a 90-day love guarantee or we fly you to Dubai...',
    caption: 'Why RichConnect has a 90-Day Love Guarantee or we fly you to Dubai free: Because our 7-layer vetting removes 100% of scammers and broke fakes. You only meet verified gentlemen ✈️🛡️',
    hashtags: ['#dubaiguarantee', '#richconnect', '#verifiedgentlemen', '#7layervetting', '#scamfreedating', '#sovereignplatform', '#luxurymatchmaking', '#passportbabes', '#highvaluewoman', '#monacomen', '#dubaidreams', '#reelsinstagram', '#viralreels', '#fyp', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 114000,
    likes: 17800,
    shares: 4900,
    viral_score: 99,
    status: 'ready',
    created_at: '2026-10-22T16:00:00Z'
  },
  {
    id: 'post-46',
    type: 'tiktok_hook',
    hook: 'The Relationship Bank™: Turning communication into status...',
    caption: 'The Relationship Bank™: Every sweet chat, weekend trip, and date builds your Love Credit Score. Higher score = Higher caliber sovereign kings unlock you first. Love is currency here 💳📈',
    hashtags: ['#relationshipbank', '#lovecreditscore', '#richconnect', '#datinggamified', '#highstatuslove', '#monacomen', '#datingalgorithms', '#digitalcourtship', '#manifestationbabe', '#queenstatus', '#explorepage', '#viraldating', '#fypシ゚viral', '#foryou', '#trending'],
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 83200,
    likes: 12500,
    shares: 3100,
    viral_score: 97,
    status: 'ready',
    created_at: '2026-10-22T18:00:00Z'
  },
  {
    id: 'post-47',
    type: 'wish_wall',
    hook: 'Wish #1,340: "Sunset horseback riding in Dubai desert"',
    caption: 'Wish #1,340: "Sunset horseback riding in Dubai desert." Granted by an Arabian equestrian patron. She didn’t beg; she posted her intention in the right circle. Learn the secret 🐎🌅',
    hashtags: ['#dubaidesert', '#equestrianlife', '#wishwall', '#richconnect', '#sunsethorseback', '#manifestationtok', '#arabianhorses', '#dubailuxury', '#dreamdates', '#sovereigndating', '#softlifeera', '#queenlifestyle', '#explorepage', '#viraltrend', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 69400,
    likes: 9800,
    shares: 2200,
    viral_score: 95,
    status: 'ready',
    created_at: '2026-10-23T08:00:00Z'
  },
  {
    id: 'post-48',
    type: 'love_horoscope',
    hook: 'Sagittarius Queen: Your passport was stamped by fate...',
    caption: 'Sagittarius Woman: You were never meant to stay in your hometown. Your astrological transits point directly to Dubai DIFC and Monaco yachts. Stop denying your destiny ♐✈️',
    hashtags: ['#sagittariusqueen', '#sagittariusseason', '#richconnect', '#travelastrology', '#destinysynced', '#passportprincess', '#monacomen', '#dubaidating', '#manifestwealth', '#twinflamereading', '#astrotok', '#spiritualwealth', '#explore', '#viraltrend', '#fyp'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 94100,
    likes: 14900,
    shares: 3700,
    viral_score: 98,
    status: 'ready',
    created_at: '2026-10-23T10:00:00Z'
  },
  {
    id: 'post-49',
    type: 'instagram_reel',
    hook: 'Why African queens are winning in global high society...',
    caption: 'Why African queens are dominating global high-society courtship: Grounded values, cultural radiance, undeniable dignity, and feminine authority. The era of settling is over 👑🌍',
    hashtags: ['#africanexcellence', '#sovereignqueens', '#richconnect', '#monacolifestyle', '#highsocietylife', '#blackwomeninluxury', '#dubaiexpat', '#londonliving', '#traditionalvalues', '#empoweredwomen', '#reelsinstagram', '#explorepage', '#viraldaily', '#fyp', '#royalty'],
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    platform: 'instagram',
    views: 138000,
    likes: 23100,
    shares: 7400,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-23T12:00:00Z'
  },
  {
    id: 'post-50',
    type: 'tiktok_hook',
    hook: 'One secret door. 31 countries. Life forever transformed...',
    caption: 'One secret door. 31 countries. From broke tears yesterday to shopping in Dubai and sailing Monaco tomorrow. RichConnect: The World’s First AI Matchmaking Empire 🥂🚪',
    hashtags: ['#richconnect', '#thesecretdoor', '#monacoluxury', '#dubailife', '#levelupyourlife', '#femalemagnetism', '#millionairematchmaker', '#sovereigndating', '#softlifebaddies', '#passportqueen', '#manifestationtok', '#trendingvideo', '#foryoupage', '#viral', '#explore'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 245000,
    likes: 42100,
    shares: 16800,
    viral_score: 100,
    status: 'ready',
    created_at: '2026-10-23T14:00:00Z'
  }
];

const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'sched-1',
    post_id: 'post-1',
    day_of_week: 'Monday',
    time_slot: '8am',
    scheduled_at: '2026-10-19T08:00:00Z',
    status: 'pending',
    reminded: false,
    notes: 'Morning commuting hook for London and Lagos girls',
    created_at: '2026-10-14T09:00:00Z'
  },
  {
    id: 'sched-2',
    post_id: 'post-2',
    day_of_week: 'Tuesday',
    time_slot: '12pm',
    scheduled_at: '2026-10-20T12:00:00Z',
    status: 'pending',
    reminded: false,
    notes: 'Lunchtime break scrolling viral spike',
    created_at: '2026-10-14T10:30:00Z'
  },
  {
    id: 'sched-3',
    post_id: 'post-5',
    day_of_week: 'Wednesday',
    time_slot: '7pm',
    scheduled_at: '2026-10-21T19:00:00Z',
    status: 'pending',
    reminded: false,
    notes: 'Prime evening romance manifestation hour',
    created_at: '2026-10-15T16:00:00Z'
  },
  {
    id: 'sched-4',
    post_id: 'post-13',
    day_of_week: 'Friday',
    time_slot: '10pm',
    scheduled_at: '2026-10-23T22:00:00Z',
    status: 'pending',
    reminded: false,
    notes: 'Late night weekend dating frustration viral wave',
    created_at: '2026-10-16T18:00:00Z'
  }
];

const STORAGE_KEYS = {
  SOCIAL_POSTS: 'rc_social_posts_v1',
  SCHEDULED_POSTS: 'rc_scheduled_posts_v1',
  SHARE_CLICKS: 'rc_share_clicks_v1',
};

export const getSocialPosts = (): SocialPost[] => {
  if (typeof window === 'undefined') return INITIAL_50_VIRAL_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOCIAL_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(INITIAL_50_VIRAL_POSTS));
      return INITIAL_50_VIRAL_POSTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse social posts:', err);
    return INITIAL_50_VIRAL_POSTS;
  }
};

export const saveSocialPost = async (post: SocialPost): Promise<SocialPost> => {
  const posts = getSocialPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  let updated: SocialPost[];
  if (idx >= 0) {
    updated = [...posts];
    updated[idx] = post;
  } else {
    updated = [post, ...posts];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(updated));
  }

  try {
    await supabase.from('social_posts').upsert({
      id: post.id,
      type: post.type,
      caption: post.caption,
      hook: post.hook,
      hashtags: post.hashtags,
      image_url: post.image_url,
      platform: post.platform,
      views: post.views,
      likes: post.likes,
      shares: post.shares,
      viral_score: post.viral_score,
      status: post.status,
      created_at: post.created_at
    });
  } catch (err) {
    console.warn('Supabase social_posts sync note:', err);
  }

  return post;
};

export const deleteSocialPost = async (postId: string) => {
  const posts = getSocialPosts().filter(p => p.id !== postId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(posts));
  }
  try {
    await supabase.from('social_posts').delete().eq('id', postId);
  } catch (err) {
    console.warn('Supabase social_posts delete note:', err);
  }
};

export const getScheduledPosts = (): ScheduledPost[] => {
  if (typeof window === 'undefined') return INITIAL_SCHEDULED_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULED_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(INITIAL_SCHEDULED_POSTS));
      return INITIAL_SCHEDULED_POSTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse scheduled posts:', err);
    return INITIAL_SCHEDULED_POSTS;
  }
};

export const schedulePost = async (
  postId: string,
  dayOfWeek: DayOfWeek,
  timeSlot: ScheduleTimeSlot,
  notes?: string
): Promise<ScheduledPost> => {
  const scheduledList = getScheduledPosts();
  const newSched: ScheduledPost = {
    id: `sched-${Date.now()}`,
    post_id: postId,
    day_of_week: dayOfWeek,
    time_slot: timeSlot,
    scheduled_at: new Date().toISOString(),
    status: 'pending',
    reminded: false,
    notes: notes || `Scheduled for ${dayOfWeek} at ${timeSlot}`,
    created_at: new Date().toISOString()
  };

  const updated = [...scheduledList, newSched];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(updated));
  }

  try {
    await supabase.from('scheduled_posts').upsert({
      id: newSched.id,
      post_id: newSched.post_id,
      day_of_week: newSched.day_of_week,
      time_slot: newSched.time_slot,
      scheduled_at: newSched.scheduled_at,
      status: newSched.status,
      reminded: newSched.reminded,
      notes: newSched.notes,
      created_at: newSched.created_at
    });
  } catch (err) {
    console.warn('Supabase scheduled_posts sync note:', err);
  }

  return newSched;
};

export const deleteScheduledPost = async (schedId: string) => {
  const list = getScheduledPosts().filter(s => s.id !== schedId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(list));
  }
  try {
    await supabase.from('scheduled_posts').delete().eq('id', schedId);
  } catch (err) {
    console.warn('Supabase scheduled_posts delete note:', err);
  }
};

export const updatePostAnalytics = async (
  postId: string,
  views: number,
  likes: number,
  shares: number
): Promise<SocialPost | null> => {
  const posts = getSocialPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return null;

  // Calculate Viral Score: (views / 1000) * 0.4 + (likes / 100) * 0.4 + (shares / 50) * 0.2, capped at 100
  const calculatedScore = Math.min(100, Math.round((views / 1200) * 0.4 + (likes / 150) * 0.4 + (shares / 60) * 0.2));

  const updated: SocialPost = {
    ...post,
    views,
    likes,
    shares,
    viral_score: Math.max(post.viral_score, calculatedScore)
  };

  await saveSocialPost(updated);
  return updated;
};

export const getShareClicks = (): ShareClickRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHARE_CLICKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const recordShareClick = async (
  postId: string | undefined,
  referralCode: string,
  platform: string
) => {
  const current = getShareClicks();
  const existingIdx = current.findIndex(c => c.post_id === postId && c.platform === platform);
  let updatedList: ShareClickRecord[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx].clicks += 1;
    updatedList[existingIdx].last_clicked_at = new Date().toISOString();
  } else {
    const newRecord: ShareClickRecord = {
      id: `sc-${Date.now()}`,
      post_id: postId || 'direct',
      referral_code: referralCode || 'VIP_MEMBER',
      platform,
      clicks: 1,
      last_clicked_at: new Date().toISOString()
    };
    updatedList = [newRecord, ...current];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SHARE_CLICKS, JSON.stringify(updatedList));
  }

  try {
    await supabase.from('share_clicks').insert({
      id: `sc-${Date.now()}`,
      post_id: postId || 'direct',
      referral_code: referralCode || 'VIP_MEMBER',
      platform,
      clicks: 1,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Share click logged locally:', err);
  }
};

export const generateDaily20Posts = async (): Promise<SocialPost[]> => {
  const templates = [
    { type: 'tiktok_hook' as const, hook: 'POV: You stopped texting broke boys...', cap: 'POV: You stopped texting broke boys and let AI introduce you to a Monaco founder in 60s 🥂', plat: 'tiktok' as const },
    { type: 'tiktok_hook' as const, hook: 'He sent his private jet to Lagos...', cap: 'He sent his private jet to Lagos after 3 days of chatting on RichConnect. Real kings exist sisters ✈️', plat: 'tiktok' as const },
    { type: 'instagram_reel' as const, hook: 'Why smart women are leaving Tinder...', cap: 'Why smart women are leaving Tinder: Zero vetting vs 7-layer wealth & loyalty verification on RichConnect 💎', plat: 'instagram' as const },
    { type: 'wish_wall' as const, hook: 'Wish: "Sunset catamaran in Dubai Marina"', cap: 'She posted her dream date on the Wish Wall. 4 hours later, unlocked by an angel investor in DIFC 🌅', plat: 'instagram' as const },
    { type: 'love_horoscope' as const, hook: 'Zodiac AI: Your soulmate lives in Mayfair...', cap: 'Zodiac AI: Your soulmate lives in Mayfair, London. He is looking for an authentic queen right now 🔮', plat: 'tiktok' as const },
  ];

  const luxuryImages = [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  ];

  const newPosts: SocialPost[] = [];
  const currentPosts = getSocialPosts();

  for (let i = 0; i < 20; i++) {
    const tmpl = templates[i % templates.length];
    const img = luxuryImages[i % luxuryImages.length];
    const postItem: SocialPost = {
      id: `ai-post-${Date.now()}-${i + 1}`,
      type: tmpl.type,
      hook: `${tmpl.hook} (Batch #${Math.floor(Date.now() / 100000) % 999})`,
      caption: `${tmpl.cap} Tap link in bio to apply for the private circle. #richconnect #viral`,
      hashtags: ['#richconnect', '#dubai', '#monaco', '#hypergamy', '#luxurylifestyle', '#datingadvice', '#traveltok', '#millionairematch', '#levelup', '#softlife', '#datingculture', '#richgirlera', '#foryou', '#viral', '#explore'],
      image_url: img,
      platform: tmpl.plat,
      views: Math.floor(Math.random() * 50000) + 12000,
      likes: Math.floor(Math.random() * 7000) + 1500,
      shares: Math.floor(Math.random() * 1200) + 300,
      viral_score: Math.floor(Math.random() * 10) + 90,
      status: 'ready',
      created_at: new Date().toISOString()
    };
    newPosts.push(postItem);
  }

  const combined = [...newPosts, ...currentPosts];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(combined));
  }

  return newPosts;
};
