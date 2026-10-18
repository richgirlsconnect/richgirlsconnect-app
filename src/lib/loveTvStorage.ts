import { supabase } from './supabase';

export type ShowFormat = 'diamond_wish' | 'ghost_unmasked' | 'love_passport' | 'free_to_diamond';

export interface ShowScene {
  sceneNumber: number;
  title: string;
  setting: string;
  narration: string;
  imageUrl: string;
  characterA: string;
  characterB?: string;
  durationSeconds: number;
}

export interface ShowPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface LoveShow {
  id: string;
  title: string;
  format: ShowFormat;
  season: number;
  episode_number: number;
  hook: string;
  thumbnail_url: string;
  hero_banner_url: string;
  synopsis: string;
  scenes: ShowScene[];
  cliffhanger: string;
  poll_question: string;
  poll_options: ShowPollOption[];
  sponsor?: { name: string; tag: string };
  suggested_by?: string;
  flight_route?: { from: string; to: string; distance: string };
  views: number;
  likes: number;
  shares: number;
  status: 'published' | 'draft' | 'archived';
  broadcast_at: string;
  created_at: string;
}

export interface ShowTitleSuggestion {
  id: string;
  show_id?: string;
  user_name: string;
  suggested_title: string;
  format: ShowFormat;
  concept: string;
  upvotes: number;
  status: 'pending' | 'featured' | 'rejected';
  created_at: string;
}

export interface ShowComment {
  id: string;
  show_id: string;
  user_name: string;
  avatar_url: string;
  text: string;
  is_vip: boolean;
  created_at: string;
}

// Pre-seeded episodes
export const INITIAL_SHOWS: LoveShow[] = [
  {
    id: 'show-ep14',
    title: 'From Lagos to Burj Al Arab: The Catamaran Cliffhanger',
    format: 'diamond_wish',
    season: 1,
    episode_number: 14,
    hook: 'She wished for Dubai. 72 hours later, an oil magnate sent his private flight. But there is one secret...',
    thumbnail_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    hero_banner_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Aisha, a 23-year-old creative from Lagos, submitted her Diamond Wish on RichConnect. An AI-matched sovereign founder from DIFC reviews her silhouette. A romantic sunset yacht dinner in Dubai Marina takes an unexpected turn when an unmasking token arrives.',
    sponsor: { name: 'Dubai Marina Yacht Club & DIFC Private Aviation', tag: 'Official Luxury Partner' },
    suggested_by: '@Aisha_Queen',
    flight_route: { from: 'Lagos (LOS)', to: 'Dubai (DXB)', distance: '5,890 km' },
    views: 48920,
    likes: 8410,
    shares: 2190,
    status: 'published',
    broadcast_at: '2026-10-18T04:00:00Z',
    created_at: '2026-10-18T04:00:00Z',
    cliffhanger: 'Will Ahmed unveil Aisha\'s encrypted dossier and fly her to the Abu Dhabi Formula 1 Gala, or will the London tech founder outbid him before midnight?',
    poll_question: 'Who should Aisha choose for the weekend gala?',
    poll_options: [
      { id: 'opt-ahmed', label: 'Ahmed (Dubai Sovereign Founder) - 76%', votes: 4120 },
      { id: 'opt-sterling', label: 'Lord Sterling (London Mayfair) - 24%', votes: 1290 }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'The Whispering Wish in Lagos',
        setting: 'Victoria Island Penthouse Lounge, Lagos',
        narration: 'It was a quiet Tuesday evening in Victoria Island when Aisha submitted her secret wish: "A man who builds an empire, values my intellect, and knows the melody of soft luxury."',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Aisha',
        durationSeconds: 12
      },
      {
        sceneNumber: 2,
        title: 'The Sovereign Alert in Dubai',
        setting: 'Burj Khalifa Sky Residences, Dubai',
        narration: 'Three thousand miles away in Dubai DIFC, sovereign founder Ahmed receives an AI Matchmaking compatibility alert: 98.4% alignment on dynasty values, equestrian passions, and loyalty.',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Ahmed',
        characterB: 'Aisha',
        durationSeconds: 14
      },
      {
        sceneNumber: 3,
        title: 'Golden Hour on the Marina',
        setting: 'Private Catamaran, Palm Jumeirah Sunset',
        narration: 'The private jet touches down. The twilight breeze over the Arabian Gulf glows gold. Ahmed steps onto the mahogany deck with a velvet box containing the sovereign key. But a rival invitation pings...',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Ahmed & Aisha',
        durationSeconds: 15
      }
    ]
  },
  {
    id: 'show-ep15',
    title: 'The Mayfair Silhouette: 3 Millionaires Compete',
    format: 'ghost_unmasked',
    season: 1,
    episode_number: 15,
    hook: 'She joined in Ghost Wealth Mode. Her face is completely obscured. 3 sovereign men will stop at nothing to unlock her.',
    thumbnail_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    hero_banner_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Operating under Ghost Wealth Mode, a mysterious African royalty heiress known only as "Sovereign 07" captures the attention of three verified ultra-high-net-worth members across Monaco, London, and Zurich.',
    sponsor: { name: 'Mayfair Family Office Concierge', tag: 'Private Banking & Trust' },
    suggested_by: '@Elena_Monaco',
    flight_route: { from: 'London (LHR)', to: 'Monaco (MCM)', distance: '1,040 km' },
    views: 39400,
    likes: 6720,
    shares: 1840,
    status: 'published',
    broadcast_at: '2026-10-18T00:00:00Z',
    created_at: '2026-10-18T00:00:00Z',
    cliffhanger: 'The countdown has 10 minutes left. Whose unlock token will she accept for the private dinner in Knightsbridge?',
    poll_question: 'Which suitor should she unmask for?',
    poll_options: [
      { id: 'opt-lord', label: 'Julian (Monaco Superyacht Founder) - 52%', votes: 2450 },
      { id: 'opt-tariq', label: 'Tariq (Geneva Asset Architect) - 34%', votes: 1610 },
      { id: 'opt-kofi', label: 'Kofi (London Tech Billionaire) - 14%', votes: 680 }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'The Ghost in Mayfair',
        setting: 'Private Member Club, Mayfair London',
        narration: 'Her dossier showed zero selfies, only her classical art collection, equestrian trophies, and philanthropic foundation metrics. Mystery became her superpower.',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Sovereign 07',
        durationSeconds: 12
      },
      {
        sceneNumber: 2,
        title: 'The Triple Bidding War',
        setting: 'Monte Carlo Yacht Club & London Boardroom',
        narration: 'Three sovereign gentlemen stake their highest VIP unlock points within 12 minutes. The RichConnect matchmaking engine initiates the live suitor duel.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Julian & Tariq',
        durationSeconds: 14
      },
      {
        sceneNumber: 3,
        title: 'The Unmasking Ceremony',
        setting: 'The Connaught Hotel Private Dining Room, London',
        narration: 'Candlelight illuminates the room. The golden digital lock clicks open on the RichConnect portal. Her full identity is unveiled to the winning bidder.',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
        characterA: 'The Unmasked Queen',
        durationSeconds: 15
      }
    ]
  },
  {
    id: 'show-ep16',
    title: 'Flight RC-77: Lagos to Monaco via St. Moritz',
    format: 'love_passport',
    season: 1,
    episode_number: 16,
    hook: 'One passport. Three glamorous European destinations. A journey of high-altitude romance and sovereign promises.',
    thumbnail_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    hero_banner_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Follow Tiwa as her RichConnect Passport status rotates through European high society enclaves, from alpine private chalets in St. Moritz to the harbor lights of Monaco.',
    sponsor: { name: 'Alpine Aviation & Monaco Grand Hôtel', tag: 'Prestige Destination Sponsor' },
    suggested_by: '@Tiwa_Travels',
    flight_route: { from: 'Lagos (LOS)', to: 'Nice / Monaco (NCE)', distance: '4,750 km' },
    views: 31200,
    likes: 5890,
    shares: 1420,
    status: 'published',
    broadcast_at: '2026-10-17T20:00:00Z',
    created_at: '2026-10-17T20:00:00Z',
    cliffhanger: 'An unexpected invitation to winter in Lake Como arrives while she boards her helicopter to Monaco.',
    poll_question: 'Where should Tiwa spend New Year’s Eve?',
    poll_options: [
      { id: 'opt-monaco', label: 'Monaco Harbor Penthouse (68%)', votes: 2120 },
      { id: 'opt-como', label: 'Lake Como Private Villa (32%)', votes: 1010 }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Passport Activated',
        setting: 'Murtala Muhammed International VIP Lounge, Lagos',
        narration: 'With her RichConnect Passport active, Tiwa’s profile crossed three international time zones while she enjoyed breakfast in Lagos.',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Tiwa',
        durationSeconds: 12
      },
      {
        sceneNumber: 2,
        title: 'The Alpine Rendezvous',
        setting: 'Badrutt’s Palace, St. Moritz',
        narration: 'Snow falls gently outside the heated panorama terrace. A vintage bottle of 1996 Dom Pérignon arrives with a handwritten note from Monaco.',
        imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Tiwa & Alexander',
        durationSeconds: 14
      },
      {
        sceneNumber: 3,
        title: 'Helicopter to the Riviera',
        setting: 'Monaco Heliport, Port Hercules',
        narration: 'As the rotor blades spin down, the Mediterranean sea sparkles like liquid sapphires. Two sovereign men stand at the terminal.',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Tiwa',
        durationSeconds: 15
      }
    ]
  },
  {
    id: 'show-ep17',
    title: 'The 24-Hour Metamorphosis: From Free Explorer to Gold Queen',
    format: 'free_to_diamond',
    season: 1,
    episode_number: 17,
    hook: 'She had zero dollars in investments. Then she took the AI Love Predictor test. Here is what happened in 48 hours.',
    thumbnail_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    hero_banner_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'A raw, uplifting, real-life documentary episode following Chioma, who started as a Free Explorer, learned hypergamic conversation etiquette from the Millionaire Translator, and upgraded her destiny.',
    sponsor: { name: 'RichConnect Academy & Diamond Circle', tag: 'Empowerment Partner' },
    suggested_by: '@Chioma_Baddie',
    views: 54100,
    likes: 11200,
    shares: 3890,
    status: 'published',
    broadcast_at: '2026-10-17T16:00:00Z',
    created_at: '2026-10-17T16:00:00Z',
    cliffhanger: 'Will Chioma accept the diplomatic visa sponsorship to relocate her jewelry atelier to Paris?',
    poll_question: 'Was upgrading to Gold Queen worth it?',
    poll_options: [
      { id: 'opt-yes', label: '100% Life Changing (96%)', votes: 4890 },
      { id: 'opt-wait', label: 'Still Deciding (4%)', votes: 190 }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'The Free Explorer Account',
        setting: 'Apartment Studio in Yaba, Lagos',
        narration: 'Chioma took a leap of faith. She uploaded three clothed aesthetic photos to the client-images vault. Within 3 hours, 17 millionaires were in her unlock holding room.',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Chioma',
        durationSeconds: 12
      },
      {
        sceneNumber: 2,
        title: 'The Breakthrough Message',
        setting: 'Mobile Screen / Virtual Lounge',
        narration: 'Using the AI Millionaire Translator, Chioma crafted an elegant, sovereign response that stood out from 500 average messages. An invitation to Paris was confirmed.',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Chioma',
        durationSeconds: 14
      },
      {
        sceneNumber: 3,
        title: 'Dinner at Le Gabriel, Paris',
        setting: 'Place de la Concorde, Paris',
        narration: 'No longer wishing from afar. Chioma steps into a Michelin-starred dining room in Paris, treated like the royalty she always was.',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
        characterA: 'Chioma & Pierre',
        durationSeconds: 15
      }
    ]
  }
];

export const INITIAL_TITLE_SUGGESTIONS: ShowTitleSuggestion[] = [
  {
    id: 'sug-1',
    user_name: 'Zainab from Dubai',
    suggested_title: 'The Burj Al Arab Midnight Proposal',
    format: 'diamond_wish',
    concept: 'A billionaire books the entire observation deck for a private violinist.',
    upvotes: 412,
    status: 'featured',
    created_at: '2026-10-17T12:00:00Z'
  },
  {
    id: 'sug-2',
    user_name: 'Kendra from London',
    suggested_title: 'Unmasking the Mayfair Art Collector',
    format: 'ghost_unmasked',
    concept: 'A silent auction where the prize is a private dinner date with a verified Lord.',
    upvotes: 389,
    status: 'pending',
    created_at: '2026-10-17T14:30:00Z'
  },
  {
    id: 'sug-3',
    user_name: 'Blessing from Lagos',
    suggested_title: 'Banana Island to Geneva: The Crypto Prince',
    format: 'love_passport',
    concept: 'A tech queen gets flown in a Gulfstream G650 for a winter wonderland retreat.',
    upvotes: 275,
    status: 'pending',
    created_at: '2026-10-18T02:00:00Z'
  }
];

export const INITIAL_SHOW_COMMENTS: ShowComment[] = [
  {
    id: 'com-1',
    show_id: 'show-ep14',
    user_name: 'Aisha_Baddie',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: 'OMG this is literally my dream! Ahmed better unlock her right now! 😭❤️',
    is_vip: true,
    created_at: '2026-10-18T05:12:00Z'
  },
  {
    id: 'com-2',
    show_id: 'show-ep14',
    user_name: 'Zara_Dubai',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    text: 'The Dubai Marina yacht scene gave me pure goosebumps! Watching from Palm Jumeirah ✨',
    is_vip: true,
    created_at: '2026-10-18T05:14:30Z'
  },
  {
    id: 'com-3',
    show_id: 'show-ep14',
    user_name: 'Kofi_Mayfair',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    text: 'Lord Sterling in London has my vote. British chivalry is unmatched.',
    is_vip: false,
    created_at: '2026-10-18T05:18:10Z'
  },
  {
    id: 'com-4',
    show_id: 'show-ep14',
    user_name: 'Nkechi_Monaco',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    text: 'I upgraded to Gold Queen last week and already have 3 verified suitors! This show is real life.',
    is_vip: true,
    created_at: '2026-10-18T05:22:00Z'
  }
];

const STORAGE_KEYS = {
  LOVE_SHOWS: 'rc_love_shows_v1',
  TITLE_SUGGESTIONS: 'rc_show_title_suggestions_v1',
  SHOW_COMMENTS: 'rc_show_comments_v1',
  WATCHED_TODAY: 'rc_watched_shows_today_v1',
  VOTED_POLLS: 'rc_voted_polls_v1'
};

export const getLoveShows = (): LoveShow[] => {
  if (typeof window === 'undefined') return INITIAL_SHOWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOVE_SHOWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOVE_SHOWS, JSON.stringify(INITIAL_SHOWS));
      return INITIAL_SHOWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SHOWS;
  }
};

export const saveLoveShow = async (show: LoveShow): Promise<LoveShow> => {
  const current = getLoveShows();
  const idx = current.findIndex(s => s.id === show.id);
  let updated: LoveShow[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = show;
  } else {
    updated = [show, ...current];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LOVE_SHOWS, JSON.stringify(updated));
  }

  try {
    await supabase.from('love_shows').upsert({
      id: show.id,
      title: show.title,
      format: show.format,
      season: show.season,
      episode_number: show.episode_number,
      story_json: show.scenes,
      poll_options: show.poll_options,
      status: show.status,
      views: show.views,
      likes: show.likes,
      shares: show.shares,
      created_at: show.created_at
    });
  } catch (err) {
    console.warn('Supabase love_shows sync note:', err);
  }

  return show;
};

export const voteOnShowPoll = async (showId: string, optionId: string, isGoldOrDiamond: boolean = false): Promise<LoveShow | null> => {
  const shows = getLoveShows();
  const show = shows.find(s => s.id === showId);
  if (!show) return null;

  // Weight: 5x for Gold/Diamond Queens
  const weight = isGoldOrDiamond ? 5 : 1;

  const updatedOptions = show.poll_options.map(opt => {
    if (opt.id === optionId) {
      return { ...opt, votes: opt.votes + weight };
    }
    return opt;
  });

  const updatedShow: LoveShow = {
    ...show,
    poll_options: updatedOptions,
    likes: show.likes + 1
  };

  await saveLoveShow(updatedShow);

  if (typeof window !== 'undefined') {
    const voted = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTED_POLLS) || '{}');
    voted[showId] = optionId;
    localStorage.setItem(STORAGE_KEYS.VOTED_POLLS, JSON.stringify(voted));
  }

  return updatedShow;
};

export const hasVotedOnShow = (showId: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const voted = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTED_POLLS) || '{}');
    return voted[showId] || null;
  } catch {
    return null;
  }
};

export const getTitleSuggestions = (): ShowTitleSuggestion[] => {
  if (typeof window === 'undefined') return INITIAL_TITLE_SUGGESTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TITLE_SUGGESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TITLE_SUGGESTIONS, JSON.stringify(INITIAL_TITLE_SUGGESTIONS));
      return INITIAL_TITLE_SUGGESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TITLE_SUGGESTIONS;
  }
};

export const addTitleSuggestion = async (
  userName: string,
  title: string,
  concept: string,
  format: ShowFormat = 'diamond_wish'
): Promise<ShowTitleSuggestion> => {
  const current = getTitleSuggestions();
  const newSug: ShowTitleSuggestion = {
    id: `sug-${Date.now()}`,
    user_name: userName || 'VIP Sovereign Queen',
    suggested_title: title.trim(),
    concept: concept.trim() || 'A high-stakes romantic transformation in Monaco or Dubai.',
    format,
    upvotes: 1,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  const updated = [newSug, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TITLE_SUGGESTIONS, JSON.stringify(updated));
  }

  try {
    await supabase.from('show_title_suggestions').insert({
      id: newSug.id,
      user_name: newSug.user_name,
      suggested_title: newSug.suggested_title,
      format: newSug.format,
      concept: newSug.concept,
      upvotes: newSug.upvotes,
      status: newSug.status,
      created_at: newSug.created_at
    });
  } catch (err) {
    console.warn('Supabase show_title_suggestions note:', err);
  }

  return newSug;
};

export const getShowComments = (showId: string): ShowComment[] => {
  if (typeof window === 'undefined') return INITIAL_SHOW_COMMENTS.filter(c => c.show_id === showId);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHOW_COMMENTS);
    const allComments: ShowComment[] = raw ? JSON.parse(raw) : INITIAL_SHOW_COMMENTS;
    return allComments.filter(c => c.show_id === showId || showId === 'all');
  } catch {
    return INITIAL_SHOW_COMMENTS;
  }
};

export const addShowComment = async (
  showId: string,
  userName: string,
  text: string,
  isVip: boolean = true
): Promise<ShowComment> => {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SHOW_COMMENTS) : null;
  const current: ShowComment[] = raw ? JSON.parse(raw) : INITIAL_SHOW_COMMENTS;

  const newComment: ShowComment = {
    id: `com-${Date.now()}`,
    show_id: showId,
    user_name: userName || 'Sovereign Observer',
    avatar_url: `https://images.unsplash.com/photo-${1534528741775 + (current.length % 5)}?auto=format&fit=crop&w=200&q=80`,
    text: text.trim(),
    is_vip: isVip,
    created_at: new Date().toISOString()
  };

  const updated = [...current, newComment];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SHOW_COMMENTS, JSON.stringify(updated));
  }

  try {
    await supabase.from('show_comments').insert({
      id: newComment.id,
      show_id: newComment.show_id,
      user_name: newComment.user_name,
      text: newComment.text,
      is_vip: newComment.is_vip,
      created_at: newComment.created_at
    });
  } catch (err) {
    console.warn('Show comment logged locally:', err);
  }

  return newComment;
};

export const generate5AiEpisodes = async (): Promise<LoveShow[]> => {
  const formats: ShowFormat[] = ['diamond_wish', 'ghost_unmasked', 'love_passport', 'free_to_diamond'];
  const titles = [
    { title: 'The Monaco Balcony Mystery: Midnight Champagne', format: 'diamond_wish' as const, loc: 'Monaco', cliff: 'Will Prince Henri reveal his true identity before dawn?' },
    { title: 'The Dubai Marina Heiress: 4 Millionaires at DIFC', format: 'ghost_unmasked' as const, loc: 'Dubai', cliff: 'Which sovereign gentleman wins the private gallery walk?' },
    { title: 'Flight RC-88: Lagos to Nice Private Jet Dynasty', format: 'love_passport' as const, loc: 'Nice & Monaco', cliff: 'A helicopter awaits at the helipad — who does she board with?' },
    { title: 'From $0 to Shopping on Rodeo Drive: Amara’s Rise', format: 'free_to_diamond' as const, loc: 'Los Angeles & Lagos', cliff: 'Will she accept the Cartier bracelet or the venture fund term sheet?' },
    { title: 'The St. Moritz Winter Ball: Silk & Snow', format: 'diamond_wish' as const, loc: 'St. Moritz', cliff: 'The clock strikes 12 at Badrutt’s Palace — did he fly 6,000 miles for her?' }
  ];

  const currentShows = getLoveShows();
  const newEpisodes: LoveShow[] = [];

  for (let i = 0; i < 5; i++) {
    const t = titles[i % titles.length];
    const nextEpNum = currentShows.length + i + 1;
    const ep: LoveShow = {
      id: `show-ai-${Date.now()}-${i + 1}`,
      title: t.title,
      format: t.format,
      season: 1,
      episode_number: nextEpNum,
      hook: `AI Episode ${nextEpNum}: High-stakes love, sovereign wealth, and impossible choices in ${t.loc}.`,
      thumbnail_url: `https://images.unsplash.com/photo-${1512453979798 + (i * 1000)}?auto=format&fit=crop&w=800&q=80`,
      hero_banner_url: `https://images.unsplash.com/photo-${1512453979798 + (i * 1000)}?auto=format&fit=crop&w=1600&q=80`,
      synopsis: `Synthesized by RichConnect Love AI from verified anonymized member trajectories. Follow the 3-scene cinematic evolution set in ${t.loc}.`,
      sponsor: { name: 'RichConnect Sovereign Circle', tag: 'AI Reality Showcase' },
      suggested_by: `@Queen_${i + 1}`,
      views: Math.floor(Math.random() * 25000) + 10000,
      likes: Math.floor(Math.random() * 4000) + 1200,
      shares: Math.floor(Math.random() * 900) + 200,
      status: 'published',
      broadcast_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      cliffhanger: t.cliff,
      poll_question: 'What should the sovereign queen do next?',
      poll_options: [
        { id: `opt-${i}-a`, label: 'Accept the Invitation (72%)', votes: 1420 },
        { id: `opt-${i}-b`, label: 'Hold Out for a Higher Caliber Suitor (28%)', votes: 550 }
      ],
      scenes: [
        {
          sceneNumber: 1,
          title: `Scene 1: The Inciting Wish in ${t.loc}`,
          setting: `Private Penthouse Suite, ${t.loc}`,
          narration: `A single message crossed the sovereign encrypted wire. A woman of extraordinary elegance posted her intention.`,
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
          characterA: 'The Queen',
          durationSeconds: 12
        },
        {
          sceneNumber: 2,
          title: `Scene 2: The High-Stakes Encounter`,
          setting: `Yacht Harbor / Grand Ballroom, ${t.loc}`,
          narration: `Sovereign wealth meets genuine emotional resonance. They discuss legacy, loyalty, and building generational prosperity.`,
          imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
          characterA: 'The Suitor',
          characterB: 'The Queen',
          durationSeconds: 14
        },
        {
          sceneNumber: 3,
          title: `Scene 3: The Midnight Choice`,
          setting: `Skyline Terrace under the Stars`,
          narration: `Two tickets. Two radically different futures. ${t.cliff}`,
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
          characterA: 'The Decision',
          durationSeconds: 15
        }
      ]
    };
    newEpisodes.push(ep);
  }

  const combined = [...newEpisodes, ...currentShows];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LOVE_SHOWS, JSON.stringify(combined));
  }

  return newEpisodes;
};

// Check if free user has watched today
export const getWatchedCountToday = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHED_TODAY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    const today = new Date().toDateString();
    if (data.date === today) {
      return data.count || 0;
    }
    return 0;
  } catch {
    return 0;
  }
};

export const incrementWatchedCountToday = () => {
  if (typeof window === 'undefined') return;
  const today = new Date().toDateString();
  const current = getWatchedCountToday();
  localStorage.setItem(STORAGE_KEYS.WATCHED_TODAY, JSON.stringify({
    date: today,
    count: current + 1
  }));
};
