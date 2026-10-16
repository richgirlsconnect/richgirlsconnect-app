import { Client, Match, MatchMessage, Consultation, MatchStatus } from '../types';
import { getSupabase } from './supabase';

const STORAGE_KEYS = {
  CLIENTS: 'rc_matchmaking_clients_v1',
  MATCHES: 'rc_matchmaking_matches_v1',
  MESSAGES: 'rc_matchmaking_messages_v1',
  CONSULTATIONS: 'rc_matchmaking_consultations_v1',
};

// Seed Private Clients (Pre-vetted High-Net-Worth Individuals)
export const SEED_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Adekunle "Kunle" Balogun',
    age: 32,
    gender: 'Male',
    location: 'London & Lagos',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    ],
    partner_preference: 'Rich White Girls & European Heiresses',
    wealth_level: 'Ultra High Net Worth ($40M+ Tech & Energy)',
    bio: 'Founder of a Pan-African cross-border payments unicorn and clean energy investor. Educated at Imperial College London. Passionate about art collecting, equestrian sports, and fine wine.',
    what_they_want: 'Seeking an educated, culturally open, high-caliber European or American woman who appreciates ambitious Black gentlemen, values discretion, and seeks long-term marriage and sovereign legacy.',
    is_public: false,
    whatsapp: '+447911123456',
    email: 'k.balogun@monarchcap.uk',
    consultation_paid: true,
    consultation_amount: 2500,
    consultation_gateway: 'Stripe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'client-2',
    name: 'Countess Charlotte von Bernsdorff',
    age: 28,
    gender: 'Female',
    location: 'Geneva & Monaco',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    ],
    partner_preference: 'Ambitious Black Kings & African Visionaries',
    wealth_level: 'Generational Dynasty ($85M Family Estate)',
    bio: 'Oversees our family foundation and luxury heritage hospitality properties in Switzerland and the French Riviera. Deeply fascinated by contemporary African architecture and Afrobeats.',
    what_they_want: 'Looking for a charismatic, confident, deeply respectful Black king who leads with chivalry, intellectual depth, and genuine emotional maturity. No party-goers.',
    is_public: false,
    whatsapp: '+41791234567',
    email: 'charlotte@bernsdorff-estates.ch',
    consultation_paid: true,
    consultation_amount: 5000,
    consultation_gateway: 'Stripe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
  {
    id: 'client-3',
    name: 'Marcus Sterling',
    age: 35,
    gender: 'Male',
    location: 'New York & Atlanta',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80'
    ],
    partner_preference: 'Affluent European / Caucasian Women',
    wealth_level: '$25M - $50M (Private Equity & Sports Tech)',
    bio: 'Managing Director at a top private credit fund. Former collegiate athlete, collector of modern sculpture and vintage timepieces. Splitting time between Manhattan penthouse and Miami.',
    what_they_want: 'A poised, elegant woman of high taste who enjoys spontaneous travel, classical concerts, and building a peaceful, grounded romantic partnership.',
    is_public: false,
    whatsapp: '+12125550198',
    email: 'msterling@sterlingcapital.com',
    consultation_paid: true,
    consultation_amount: 2500,
    consultation_gateway: 'Stripe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'client-4',
    name: 'Clara Delacroix',
    age: 26,
    gender: 'Female',
    location: 'Paris & Cannes',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
    ],
    partner_preference: 'Charismatic Black Gentlemen',
    wealth_level: '$30M+ (Haute Couture & Fine Perfumery)',
    bio: 'Creative director for luxury fragrance maison based in Paris 8th arrondissement. Passionate about jazz, African contemporary literature, and winter retreats in East Africa.',
    what_they_want: 'A strong, decisive gentleman who understands chivalry, loves heartfelt long dinners, and values loyalty above all else.',
    is_public: false,
    whatsapp: '+33612345678',
    email: 'clara@maison-delacroix.fr',
    consultation_paid: true,
    consultation_amount: 2500,
    consultation_gateway: 'Paystack',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'client-5',
    name: 'Dr. Tariq Al-Hassan',
    age: 34,
    gender: 'Male',
    location: 'Dubai & London',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'
    ],
    partner_preference: 'High-Status International Women',
    wealth_level: '$60M+ (Biotech & Healthcare Infrastructure)',
    bio: 'Surgeon turned biotech entrepreneur. Developing AI medical diagnostic devices across Europe and the GCC. Enjoys sailing, chess, and private charity initiatives.',
    what_they_want: 'An intelligent, serene partner capable of navigating high diplomatic and business circles with grace and warmth.',
    is_public: false,
    whatsapp: '+971501234567',
    email: 'tariq@alhassan-bio.com',
    consultation_paid: true,
    consultation_amount: 5000,
    consultation_gateway: 'Stripe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'client-6',
    name: 'Astrid Lindholm-Vanderbilt',
    age: 27,
    gender: 'Female',
    location: 'Stockholm & London',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
    ],
    partner_preference: 'Ambitious African Men & Black Kings',
    wealth_level: '$50M+ (Nordic CleanTech & Shipping Heiress)',
    bio: 'Family office director specializing in sustainable ocean logistics. Huge fan of Afrobeats concerts, private safaris in Kenya, and intellectual debate over espresso.',
    what_they_want: 'A loving, grounded Black partner who takes charge, protects my peace, and is ready for marriage and family.',
    is_public: false,
    whatsapp: '+46701234567',
    email: 'astrid@lindholm-nordic.se',
    consultation_paid: true,
    consultation_amount: 2500,
    consultation_gateway: 'Stripe',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  }
];

// Seed Matches
export const SEED_MATCHES: Match[] = [
  {
    id: 'match-1',
    client_a_id: 'client-1',
    client_b_id: 'client-2',
    score: 98,
    reason: 'Exceptional synergy: Kunle is an ultra-high-net-worth African tech unicorn founder seeking a high-caliber European woman, while Countess Charlotte specifically desires an ambitious Black king who values discretion, chivalry, and intellectual depth. Shared London/Geneva lifestyle, art collecting passions, and dynasty-building intentions.',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    approved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'match-2',
    client_a_id: 'client-3',
    client_b_id: 'client-4',
    score: 95,
    reason: 'Harmonious match: Marcus (NYC/Atlanta private equity leader) seeks a poised European woman of high taste. Clara Delacroix (haute couture creative director in Paris) appreciates chivalrous Black gentlemen who enjoy heartfelt dinners, classical arts, and serene romance.',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    approved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'match-3',
    client_a_id: 'client-1',
    client_b_id: 'client-6',
    score: 93,
    reason: 'Strong cultural and entrepreneurial alignment: Astrid loves African music, luxury safaris, and strong Black men of vision. Kunle travels regularly across London and Stockholm for cleantech and banking.',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    approved_at: null,
  }
];

// Seed Match Messages
export const SEED_MESSAGES: MatchMessage[] = [
  {
    id: 'msg-1',
    match_id: 'match-1',
    sender_id: 'client-1',
    sender_name: 'Adekunle "Kunle" Balogun',
    text: 'Good evening, Charlotte. It is a genuine pleasure to connect with you through RichConnect. Your commitment to contemporary architecture and cultural heritage really caught my eye.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'msg-2',
    match_id: 'match-1',
    sender_id: 'client-2',
    sender_name: 'Countess Charlotte von Bernsdorff',
    text: 'Enchanted to meet you, Kunle. The concierge spoke very highly of your vision and calm demeanor. I just returned from a foundation meeting in Geneva—are you currently in Mayfair or traveling?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'msg-3',
    match_id: 'match-1',
    sender_id: 'client-1',
    sender_name: 'Adekunle "Kunle" Balogun',
    text: 'In London until next Friday, then spending a weekend in Zurich. I would be delighted to host you for dinner at 5 Hertford Street or a quiet terrace when our schedules align.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'msg-4',
    match_id: 'match-1',
    sender_id: 'client-2',
    sender_name: 'Countess Charlotte von Bernsdorff',
    text: 'That sounds delightful and civilized. Thursday evening would suit me well. I appreciate a gentleman who takes thoughtful initiative.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  }
];

// Seed Consultations
export const SEED_CONSULTATIONS: Consultation[] = [
  {
    id: 'c-101',
    client_name: 'Adekunle Balogun',
    email: 'k.balogun@monarchcap.uk',
    whatsapp: '+447911123456',
    amount: 2500,
    currency: 'USD',
    payment_gateway: 'Stripe',
    payment_status: 'paid',
    reference: 'ch_stripe_rc_8921a9',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'c-102',
    client_name: 'Countess Charlotte von Bernsdorff',
    email: 'charlotte@bernsdorff-estates.ch',
    whatsapp: '+41791234567',
    amount: 5000,
    currency: 'USD',
    payment_gateway: 'Stripe',
    payment_status: 'paid',
    reference: 'ch_stripe_rc_9934bb',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
  {
    id: 'c-103',
    client_name: 'Clara Delacroix',
    email: 'clara@maison-delacroix.fr',
    whatsapp: '+33612345678',
    amount: 2500,
    currency: 'USD',
    payment_gateway: 'Paystack',
    payment_status: 'paid',
    reference: 'pstk_ref_9812401',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  }
];

// ==========================================
// CLIENTS
// ==========================================
export const getClients = (): Client[] => {
  if (typeof window === 'undefined') return SEED_CLIENTS;
  const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
    return SEED_CLIENTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_CLIENTS;
  }
};

export const getClientById = (id: string): Client | undefined => {
  const clients = getClients();
  return clients.find((c) => c.id === id);
};

export const saveClient = async (client: Client): Promise<Client> => {
  const clients = getClients();
  const existingIdx = clients.findIndex((c) => c.id === client.id);
  let updatedList: Client[];
  if (existingIdx >= 0) {
    updatedList = [...clients];
    updatedList[existingIdx] = client;
  } else {
    updatedList = [client, ...clients];
  }
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedList));

  // Try Supabase sync in background if configured
  try {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('clients').upsert({
        id: client.id,
        name: client.name,
        age: client.age,
        gender: client.gender,
        location: client.location,
        avatar_url: client.avatar_url,
        photos: client.photos,
        partner_preference: client.partner_preference,
        wealth_level: client.wealth_level,
        bio: client.bio,
        what_they_want: client.what_they_want,
        is_public: false,
        whatsapp: client.whatsapp,
        email: client.email,
        consultation_paid: client.consultation_paid,
        created_at: client.created_at,
      });
    }
  } catch (err) {
    console.warn('Supabase sync skipped/deferred:', err);
  }

  return client;
};

export const deleteClient = (id: string): void => {
  const clients = getClients().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));

  // Also remove matches involving this client
  const matches = getMatches().filter((m) => m.client_a_id !== id && m.client_b_id !== id);
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
};

// ==========================================
// MATCHES
// ==========================================
export const getMatches = (): Match[] => {
  if (typeof window === 'undefined') return SEED_MATCHES;
  const stored = localStorage.getItem(STORAGE_KEYS.MATCHES);
  const clients = getClients();
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  let rawMatches: Match[] = SEED_MATCHES;
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(SEED_MATCHES));
  } else {
    try {
      rawMatches = JSON.parse(stored);
    } catch (e) {
      rawMatches = SEED_MATCHES;
    }
  }

  // Hydrate client objects
  return rawMatches.map((m) => ({
    ...m,
    client_a: clientMap.get(m.client_a_id),
    client_b: clientMap.get(m.client_b_id),
  }));
};

export const getMatchById = (id: string): Match | undefined => {
  const matches = getMatches();
  return matches.find((m) => m.id === id);
};

export const saveMatch = async (match: Match): Promise<Match> => {
  const matches = getMatches();
  const existingIdx = matches.findIndex((m) => m.id === match.id);
  let updatedList: Match[];
  if (existingIdx >= 0) {
    updatedList = [...matches];
    updatedList[existingIdx] = match;
  } else {
    updatedList = [match, ...matches];
  }

  // Strip populated client objects before saving
  const toStore = updatedList.map(({ client_a, client_b, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(toStore));

  // Try Supabase sync
  try {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('matches').upsert({
        id: match.id,
        client_a: match.client_a_id,
        client_b: match.client_b_id,
        score: match.score,
        reason: match.reason,
        status: match.status,
        created_at: match.created_at,
        approved_at: match.approved_at,
      });
    }
  } catch (err) {
    console.warn('Supabase match sync skipped/deferred:', err);
  }

  return match;
};

export const updateMatchStatus = async (id: string, status: MatchStatus): Promise<Match | undefined> => {
  const matches = getMatches();
  const target = matches.find((m) => m.id === id);
  if (!target) return undefined;

  target.status = status;
  if (status === 'approved') {
    target.approved_at = new Date().toISOString();
  } else {
    target.approved_at = null;
  }

  await saveMatch(target);
  return target;
};

// ==========================================
// MATCH MESSAGES
// ==========================================
export const getMatchMessages = (matchId: string): MatchMessage[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  let allMessages: MatchMessage[] = SEED_MESSAGES;
  if (stored) {
    try {
      allMessages = JSON.parse(stored);
    } catch (e) {
      allMessages = SEED_MESSAGES;
    }
  } else {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
  }

  return allMessages.filter((m) => m.match_id === matchId);
};

export const sendMatchMessage = async (message: MatchMessage): Promise<MatchMessage> => {
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  let allMessages: MatchMessage[] = [];
  if (stored) {
    try {
      allMessages = JSON.parse(stored);
    } catch (e) {
      allMessages = SEED_MESSAGES;
    }
  } else {
    allMessages = SEED_MESSAGES;
  }

  const updated = [...allMessages, message];
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));

  // Supabase sync
  try {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('match_messages').insert({
        id: message.id,
        match_id: message.match_id,
        sender_id: message.sender_id,
        sender_name: message.sender_name,
        text: message.text,
        created_at: message.created_at,
      });
    }
  } catch (err) {
    console.warn('Supabase message sync skipped:', err);
  }

  return message;
};

// ==========================================
// CONSULTATIONS
// ==========================================
export const getConsultations = (): Consultation[] => {
  if (typeof window === 'undefined') return SEED_CONSULTATIONS;
  const stored = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(SEED_CONSULTATIONS));
    return SEED_CONSULTATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_CONSULTATIONS;
  }
};

export const saveConsultation = async (consultation: Consultation): Promise<Consultation> => {
  const list = getConsultations();
  const updated = [consultation, ...list];
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));

  try {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('consultations').upsert({
        id: consultation.id,
        client_name: consultation.client_name,
        email: consultation.email,
        whatsapp: consultation.whatsapp,
        amount: consultation.amount,
        currency: consultation.currency,
        payment_gateway: consultation.payment_gateway,
        payment_status: consultation.payment_status,
        reference: consultation.reference,
        created_at: consultation.created_at,
      });
    }
  } catch (err) {
    console.warn('Supabase consultation sync skipped:', err);
  }

  return consultation;
};
