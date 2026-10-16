import { Girl, Message, Memory, PipelineStage, DatePlan } from '../types';

const STORAGE_KEYS = {
  GIRLS: 'rc_girls_data_v1',
  MESSAGES: 'rc_messages_data_v1',
  MEMORIES: 'rc_memories_data_v1',
  AUTH: 'rc_auth_token_v1',
  SUPABASE_SETTINGS: 'rc_supabase_settings_v1',
  PRESIDENTIAL_REGISTRY: 'rc_presidential_registry_v1',
  DATE_PLANS: 'rc_date_plans_data_v1',
};

export const INITIAL_PRESIDENTIAL_GIRLS: Girl[] = [
  {
    id: 'pres-1',
    name: 'Alexandra Moreau',
    bio: 'Daughter of former European Head of State. Raised in presidential quarters, seeking a genuine, sovereign-minded black man who sees beyond state protocol. Paris & Geneva.',
    ig: '@alexandra.moreau.priv',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 26,
    tags: ['Presidential Daughter', 'Élysée Lineage', 'Diplomatic Immunity', 'Philanthropy', 'Loves African Kings'],
    match_score: 99,
    match_reason: 'Verified Presidential daughter. Openly fascinated by African contemporary art and seeks an ambitious, protective partner outside political games.',
    stage: 'Chatting',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$45M (State Family Trust)',
    verified: true,
    whatsapp: '+33689421102',
    is_presidential_daughter: true,
    presidential_details: {
      country: 'France / European Union',
      parent_title: 'Former President of the Republic',
      presidential_term: '2012 - 2022',
      official_residence: 'Élysée Palace / Villa Montmorency',
      security_protocol: 'GSPR (Groupe de Sécurité de la Présidence)',
      whatsapp: '+33689421102',
      verified_credentials: true,
      relationship_intent: 'Looking for a strong, loyal African gentleman for genuine romance away from the press glare.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'pres-2',
    name: 'Carolina Santos-Vargas',
    bio: 'First Family daughter from Latin America. Ivy League educated, international diplomat. Craving an ambitious, authentic black king with chivalry and unwavering loyalty.',
    ig: '@carolina_vargas_intl',
    location: 'US',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Presidential Daughter', 'Palacio Residencial', 'Bilingual', 'Equestrian', 'Deep Romance'],
    match_score: 98,
    match_reason: 'Father served dual presidential terms. Passionate about Afro-diaspora culture, private aviation, and heartfelt, drama-free courtship.',
    stage: 'Dating',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$30M+',
    verified: true,
    whatsapp: '+12025550189',
    is_presidential_daughter: true,
    presidential_details: {
      country: 'South America (Mercosur Diplomatic)',
      parent_title: 'President & Commander-in-Chief',
      presidential_term: '2015 - 2023',
      official_residence: 'Palacio de Gobierno / Diplomatic Enclave',
      security_protocol: 'Presidential Guard Regiment (Honor Detail)',
      whatsapp: '+12025550189',
      verified_credentials: true,
      relationship_intent: 'Craving a masculine, grounded partner who respects my privacy and loves unconditionally.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 'pres-3',
    name: 'Helena von Hohenzollern-Berg',
    bio: 'Daughter of European Federal President. Law graduate & humanitarian delegate. Exhausted by political opportunists; desire deep love and magnetic chemistry.',
    ig: '@helena.vhb',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 28,
    tags: ['Presidential Daughter', 'Bellevue State House', 'Humanitarian', 'Private Island', 'Afrobeats Fan'],
    match_score: 97,
    match_reason: 'First Family heritage. Regularly attends African leadership and cultural galas, loves Burna Boy & Asake, looking for marriage-oriented partner.',
    stage: 'Close',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$60M+',
    verified: true,
    whatsapp: '+4915123456789',
    is_presidential_daughter: true,
    presidential_details: {
      country: 'Germany / Central Europe',
      parent_title: 'Federal President',
      presidential_term: '2017 - Present',
      official_residence: 'Schloss Bellevue / Villa Hammerschmidt',
      security_protocol: 'BKA Sicherungsgruppe (Division SG)',
      whatsapp: '+4915123456789',
      verified_credentials: true,
      relationship_intent: 'Seeking an extraordinary man who values mutual empowerment, emotional intimacy, and laughter.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'pres-4',
    name: 'Zahra Al-Qasimi',
    bio: 'Sovereign Head of State daughter. Split between London (Knightsbridge) & Dubai. Highly private, deeply spiritual, attracted to visionary African businessmen.',
    ig: '@zahra_sovereign',
    location: 'Dubai',
    ethnicity: 'Arabian / Mediterranean',
    age: 25,
    tags: ['Presidential Daughter', 'Royal Palace', 'Knightsbridge Penthouse', 'Art Patron', 'Exclusive'],
    match_score: 99,
    match_reason: 'Royal & presidential dynasty. Values high discreet chivalry, traditional respect, and strong family values.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$100M+',
    verified: true,
    whatsapp: '+971501239876',
    is_presidential_daughter: true,
    presidential_details: {
      country: 'UAE / Gulf Diplomatic Union',
      parent_title: 'Supreme Council Ruler / Head of State',
      presidential_term: 'Hereditary Sovereign Mandate',
      official_residence: 'Za\'abeel Sovereign Palace',
      security_protocol: 'Special Protection Command (SPC)',
      whatsapp: '+971501239876',
      verified_credentials: true,
      relationship_intent: 'Looking for a genuine soulmate who will stand strong beside me without caring about public gossip.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'pres-5',
    name: 'Princess Victoria von Baden',
    bio: 'Daughter of European Chancellor & Sovereign Royal Lineage. Passionate classical violinist, art collector, and admirer of strong African monarchs.',
    ig: '@victoria.vonbaden',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Presidential Daughter', 'Hofburg Sovereign Protocol', 'Fine Art', 'Dynasty Heritage', 'Classical Music'],
    match_score: 98,
    match_reason: 'Grand sovereign lineage. Seeking an ambitious, high-achieving Black gentleman who values tradition, mutual protection, and deep loyalty.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$80M+ (Royal Foundation)',
    verified: true,
    whatsapp: '+41789988776',
    is_presidential_daughter: true,
    presidential_details: {
      country: 'Austria & Central European Federation',
      parent_title: 'Former Federal Chancellor & Archducal Envoy',
      presidential_term: '2016 - 2023',
      official_residence: 'Hofburg Sovereign Wing / Salzburg Villa',
      security_protocol: 'Cobra Diplomatic Protection Detail',
      whatsapp: '+41789988776',
      verified_credentials: true,
      relationship_intent: 'Desiring an unwavering, chivalrous Black king who values elegance, intellect, and profound devotion.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'pres-6',
    name: 'Beatrice Cavour-Savoy',
    bio: 'Daughter of Italian State Prime Executive. Architectural preservationist across Rome, Lake Como, and Milan. Deeply fond of African contemporary culture and visionary men.',
    ig: '@beatrice.cavour',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 26,
    tags: ['Presidential Daughter', 'Palazzo Chigi Protocol', 'Architectural Heritage', 'Lake Como Villa', 'High Discretion'],
    match_score: 97,
    match_reason: 'Aristocratic political lineage. Expresses explicit admiration for Black entrepreneurs who command respect through excellence and poise.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$55M+',
    verified: true,
    whatsapp: '+393351234567',
    is_presidential_daughter: true,
    presidential_details: {
      country: 'Italy / European Union',
      parent_title: 'President of the Council of Ministers',
      presidential_term: '2014 - 2021',
      official_residence: 'Palazzo Chigi & Villa Madama Quarters',
      security_protocol: 'Nucleo Operativo Protezione Quirinale',
      whatsapp: '+393351234567',
      verified_credentials: true,
      relationship_intent: 'Looking for an extraordinary gentleman who sees me for my heart and soul rather than state titles.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  }
];

export const INITIAL_GIRLS: Girl[] = [
  {
    id: 'g-1',
    name: 'Victoria Kensington',
    bio: 'Family office director & dressage competitor. Love African culture, Afrobeats & genuine kings with ambition. Split between Mayfair & Monaco.',
    ig: '@victoriak_priv',
    location: 'UK',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Rich', 'Queen lifestyle', 'Equestrian', 'Finance Heiress', 'Afrobeats Lover'],
    match_score: 98,
    match_reason: 'Bio explicitly celebrates African culture & black kings. High-status London equestrian lifestyle, visits Lagos & Accra for Detty December.',
    stage: 'Chatting',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$15M - $25M (Family Trust)',
    verified: true,
    whatsapp: '+447911123456',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'g-2',
    name: 'Camilla Sterling',
    bio: 'Creative Director & luxury real estate developer. Passionate about interracial dating, art galas, and strong, charismatic black men. Dubai Marina life.',
    ig: '@camilla_sterling',
    location: 'Dubai',
    ethnicity: 'White / Caucasian',
    age: 29,
    tags: ['Princess', 'Dubai lifestyle', 'Real Estate', 'Art Collector', 'Global Jetsetter'],
    match_score: 96,
    match_reason: 'Publicly embraces interracial relationships; frequent attendee of African contemporary art auctions in Dubai and London.',
    stage: 'Dating',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$8M - $12M',
    verified: true,
    whatsapp: '+971508823419',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'g-3',
    name: 'Elena De La Tour',
    bio: 'Fashion brand founder & philanthropist. I love black men with vision, drive, and high energy. Paris fashion week & Victoria Island winter escapes.',
    ig: '@elena_delatour',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 26,
    tags: ['Rich', 'Princess', 'High Fashion', 'Tech Angel', 'Lagos Explorer'],
    match_score: 95,
    match_reason: 'Active advocate for intercultural romance, spent NYE in Lagos private beach houses, family owns European luxury winery.',
    stage: 'Close',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$20M+',
    verified: true,
    whatsapp: '+33612345678',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'g-4',
    name: 'Sophie Vanderbilt',
    bio: 'Fintech angel & aviation enthusiast. Nothing more magnetic than a tall, chivalrous black man with a sharp mind. Manhattan & Aspen.',
    ig: '@sophievanderbilt',
    location: 'US',
    ethnicity: 'White / Caucasian',
    age: 28,
    tags: ['Rich', 'Queen lifestyle', 'Private Aviation', 'Venture Capital'],
    match_score: 94,
    match_reason: 'Stated admiration for black tech founders & high-caliber men. High society pedigree, values traditional courtship and mutual respect.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$35M (Legacy)',
    verified: true,
    whatsapp: '+12125550198',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'g-5',
    name: 'Astrid Lindholm',
    bio: 'Nordic architecture designer & yachting regular. Big heart for African music, Burna Boy concerts, and ambitious gentlemen. Toronto & Stockholm.',
    ig: '@astrid.arch',
    location: 'Canada',
    ethnicity: 'White / Caucasian',
    age: 25,
    tags: ['Princess', 'Yachting', 'Architecture', 'Afrobeats Lover'],
    match_score: 92,
    match_reason: 'Regularly shares love for African music & culture, seeking serious monogamous partnership with an exceptional gentleman.',
    stage: 'Visit Planned',
    avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$5M - $9M',
    verified: true,
    whatsapp: '+46701234567',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'g-6',
    name: 'Zoe Montgomery',
    bio: 'Oil & infrastructure consultant based between Lagos (Ikoyi) & London. Loves African men deeply, high-caliber dinners, and sincere romance.',
    ig: '@zoe_montgomery_ikoyi',
    location: 'Lagos',
    ethnicity: 'White / Caucasian',
    age: 30,
    tags: ['Queen lifestyle', 'Expat Luxury', 'Infrastructure', 'Loves African Men'],
    match_score: 99,
    match_reason: 'Lives in Ikoyi/Victoria Island, speaks conversational Yoruba phrases, completely immersed in African culture and high society.',
    stage: 'Partner',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$12M+',
    verified: true,
    whatsapp: '+2348031234567',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: 'g-7',
    name: 'Genevieve Du Pont',
    bio: 'Swiss private banking executive. Appreciates men with unwavering integrity, athletic stature, and timeless elegance. Zurich & St. Moritz.',
    ig: '@genevieve_dupont',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 28,
    tags: ['Rich', 'Queen lifestyle', 'Private Banking', 'Alpine Luxury'],
    match_score: 91,
    match_reason: 'Frequent visitor to luxury African summits; seeks partner for high-level philanthropic expeditions and private galas.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$18M',
    verified: true,
    whatsapp: '+41791234567',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'g-8',
    name: 'Scarlett Sinclair',
    bio: 'Biotech venture investor. Loves deep conversations, interracial romance, and weekend flights to Miami. Unapologetically attracted to tall black kings.',
    ig: '@scarlett_sinclair_ny',
    location: 'US',
    ethnicity: 'White / Caucasian',
    age: 26,
    tags: ['Princess', 'Biotech Angel', 'Supercar Collector', 'Hamptons'],
    match_score: 97,
    match_reason: 'Directly stated preference for black men on podcast & social circles. Highly intellectual, supportive of ambitious partners.',
    stage: 'Chatting',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$10M+',
    verified: true,
    whatsapp: '+13055550143',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'g-9',
    name: 'Bianca Cavalli',
    bio: 'Italian luxury silk textile heiress & sailing enthusiast. Enchanted by ambitious Black visionaries and high-caliber gentlemen. Milan & Bellagio.',
    ig: '@bianca_cavalli_priv',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Rich', 'Princess', 'Lake Como', 'Textile Heiress', 'Loves African Kings'],
    match_score: 96,
    match_reason: 'Admires charismatic Black leadership. Regularly visits private art exhibitions across East and West Africa; seeking long-term devotion.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$28M (Family Dynasty)',
    verified: true,
    whatsapp: '+39028912345',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 'g-10',
    name: 'Dr. Natalie Dupont',
    bio: 'Aesthetic physician and founder of regenerative skincare institute in Monaco. Drawn to confident, grounded Black gentlemen who lead with calm authority.',
    ig: '@dr.natalie_monaco',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 29,
    tags: ['Rich', 'Queen lifestyle', 'Monaco Society', 'Biotech Founder', 'High Discretion'],
    match_score: 97,
    match_reason: 'Frequent speaker at transatlantic longevity conferences. Passionate about Afrobeats, equestrian events, and committed marriage.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$22M+',
    verified: true,
    whatsapp: '+33678901234',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'g-11',
    name: 'Chloe Beauchamp',
    bio: 'Contemporary fine art dealer representing modern African masters across Cannes, Basel, and London. Looking for an authentic partner for deep conversations.',
    ig: '@chloe_beauchamp_art',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 26,
    tags: ['Princess', 'Art Basel', 'Cannes Riviera', 'Curator', 'Afrobeats Lover'],
    match_score: 95,
    match_reason: 'Specializes in contemporary African fine art curation; holds private galas celebrating African diaspora excellence.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$14M',
    verified: true,
    whatsapp: '+33645123980',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'g-12',
    name: 'Sienna O’Connor',
    bio: 'Equestrian showjumper & Irish heritage whiskey brand director. Splitting time between Knightsbridge and County Kildare. Seeking chivalry and ambition.',
    ig: '@sienna.oconnor',
    location: 'UK',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Rich', 'Equestrian', 'Heritage Brand', 'London High Society'],
    match_score: 94,
    match_reason: 'Values traditional courtship, protective masculine leadership, and mutual loyalty. Frequent attendee of private polo clubs in Surrey.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$16M',
    verified: true,
    whatsapp: '+447822991100',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
  {
    id: 'g-13',
    name: 'Vivienne von Habsburg',
    bio: 'Classical concert pianist & European cultural delegate. Vienna & Salzburg. Deeply attracted to visionary Black kings who appreciate fine arts and intellectual banter.',
    ig: '@vivienne_habsburg',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 28,
    tags: ['Rich', 'Princess', 'Vienna Opera', 'Aristocracy', 'Classical Music'],
    match_score: 98,
    match_reason: 'High aristocratic European pedigree with broad cultural perspective. Passionate about visiting West African architectural marvels.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$40M+',
    verified: true,
    whatsapp: '+436761234567',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'g-14',
    name: 'Maya Al-Mansoor',
    bio: 'Gulf private equity strategist & luxury hospitality investor. Dubai Downtown & Abu Dhabi. Seeking a sharp, ambitious king for romance and shared empire.',
    ig: '@maya.almansoor',
    location: 'Dubai',
    ethnicity: 'Arabian / Mediterranean',
    age: 28,
    tags: ['Rich', 'Queen lifestyle', 'Dubai lifestyle', 'Private Equity', 'Supercars'],
    match_score: 97,
    match_reason: 'Values masculine honor, discretion, and mutual respect. Frequent international traveler to London and Lagos for tech co-investments.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$35M+',
    verified: true,
    whatsapp: '+971529881122',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'g-15',
    name: 'Tatiana Romanov-Cross',
    bio: 'Film producer & philanthropist splitting time between Beverly Hills and Aspen. Love tall, charismatic black men with infectious laughter and vision.',
    ig: '@tatiana.cross_priv',
    location: 'US',
    ethnicity: 'White / Caucasian',
    age: 26,
    tags: ['Princess', 'Hollywood Philanthropy', 'Beverly Hills', 'Aspen Heliski'],
    match_score: 96,
    match_reason: 'Passionate supporter of Black independent filmmakers and Afrobeats festivals. Seeking a confident romantic gentleman.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$24M',
    verified: true,
    whatsapp: '+13105550177',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'g-16',
    name: 'Freja Møller',
    bio: 'Clean energy venture partner & minimalist architect. Copenhagen & London. Admires African tech builders and strong, cultured men who lead.',
    ig: '@freja_moller_arch',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Princess', 'Clean Energy', 'Nordic Design', 'Afrobeats Lover'],
    match_score: 93,
    match_reason: 'Regular attendee of Afrobeats concerts in London. Values emotional maturity, quiet confidence, and authentic romance.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$11M',
    verified: true,
    whatsapp: '+4520123456',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'g-17',
    name: 'Isabelle Laroche',
    bio: 'Grand Cru Bordeaux winery heir & sommelier. Enthusiast of fine dining, spontaneous private flights, and handsome Black gentlemen of character.',
    ig: '@isabelle.laroche_wine',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 28,
    tags: ['Rich', 'Bordeaux Estate', 'Wine Heiress', 'Gastronomy'],
    match_score: 95,
    match_reason: 'Values old-world manners, chivalry, and shared adventures. Looking for a high-status partner ready for marriage.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$32M',
    verified: true,
    whatsapp: '+33655443322',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
  },
  {
    id: 'g-18',
    name: 'Zara Sterling-Adeyemi',
    bio: 'Cross-border fintech founder & luxury boutique resort developer. Victoria Island (Lagos) & Mayfair. Passionate about sovereign wealth, art, and black excellence.',
    ig: '@zara.sterling_vi',
    location: 'Lagos',
    ethnicity: 'White / Caucasian',
    age: 29,
    tags: ['Queen lifestyle', 'Lagos Luxury', 'Victoria Island', 'Fintech Founder', 'Loves African Men'],
    match_score: 99,
    match_reason: 'Deeply entrenched in Lagos and London high society; speaks conversational Yoruba; seeks a power-couple partnership with an ambitious Black king.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$26M+',
    verified: true,
    whatsapp: '+2348123456789',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'g-19',
    name: 'Annika Lindqvist',
    bio: 'Swiss private wealth portfolio manager & alpine mountaineer. Geneva & Verbier. Drawn to disciplined, high-achieving Black gentlemen with global outlook.',
    ig: '@annika.lindqvist_ch',
    location: 'Europe',
    ethnicity: 'White / Caucasian',
    age: 28,
    tags: ['Rich', 'Swiss Wealth', 'Alpine Skiing', 'Lake Geneva', 'High Discretion'],
    match_score: 94,
    match_reason: 'Values discretion, integrity, and sincere emotional connection. Enjoys cozy fireplace evenings and spontaneous travel to the sun.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$19M',
    verified: true,
    whatsapp: '+41221234567',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'g-20',
    name: 'Madeleine Vance',
    bio: 'Silicon Valley AI venture partner & classical violinist. San Francisco & Lake Tahoe. Deep appreciation for visionary founders who lead with courage and grace.',
    ig: '@madeleine.vance_vc',
    location: 'US',
    ethnicity: 'White / Caucasian',
    age: 27,
    tags: ['Princess', 'AI Venture Capital', 'Private Aviation', 'Classical Violin'],
    match_score: 97,
    match_reason: 'Explicitly admires charismatic Black executives and founders. Values intellectual depth, sincere romance, and mutual empire-building.',
    stage: 'Found',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$21M',
    verified: true,
    whatsapp: '+14155550182',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  }
];

export const ALL_INITIAL_GIRLS: Girl[] = [
  ...INITIAL_PRESIDENTIAL_GIRLS,
  ...INITIAL_GIRLS,
];

export const INITIAL_MEMORIES: Record<string, Memory> = {
  'pres-1': {
    id: 'mem-pres-1',
    girl_id: 'pres-1',
    birthday: 'September 19 (Virgo)',
    business: 'Director of Franco-African Cultural Foundation, Paris & Geneva',
    hobbies: 'Classical cello, vintage wine auctions in Bordeaux, private retreats in Saint-Tropez, Afrobeats playlists',
    food: 'L’Ambroisie Paris, delicate seafood carpaccio, authentic Senegalese thiéboudienne',
    last_contact: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    notes: 'Father was President. She hates political clout-chasers. Craves an authentic, protective, ambitious black man who leads with poise and warmth.',
    gift_ideas: 'Rare African bronze miniature, vintage bespoke fountain pen',
    relationship_goals: 'Genuine soul partnership and exclusive romantic courtship free from political paparazzi.',
    updated_at: new Date().toISOString(),
  },
  'pres-2': {
    id: 'mem-pres-2',
    girl_id: 'pres-2',
    birthday: 'March 11 (Pisces)',
    business: 'International Trade Diplomat & Sovereign Heritage Envoy',
    hobbies: 'Polo tournaments, Latin jazz, private helicopter excursions, Afro-diaspora history',
    food: 'Peruvian sea bass ceviche, private vineyard tastings, spicy West African jollof',
    last_contact: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    notes: 'Father served dual presidential terms. Loves masculine chivalry, opening car doors, and sincere eye contact.',
    gift_ideas: 'Bespoke silk scarf, private acoustic concert experience',
    relationship_goals: 'Discreet, powerful love story with a high-status partner.',
    updated_at: new Date().toISOString(),
  },
  'pres-4': {
    id: 'mem-pres-4',
    girl_id: 'pres-4',
    birthday: 'December 28 (Capricorn)',
    business: 'Sovereign Heritage Trust & Private Sovereign Family Office',
    hobbies: 'Purebred Arabian horses, private desert stargazing, Mayfair art galleries',
    food: 'Emirati saffron spiced lamb, Zuma Knightsbridge, vintage champagne',
    last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Strict discretion required. Highly values masculine honor, traditional leadership, and genuine emotional intimacy.',
    gift_ideas: 'Rare oud perfume formulation, bespoke equestrian leather accessories',
    relationship_goals: 'Enduring sacred union with a visionary king.',
    updated_at: new Date().toISOString(),
  },
  'g-1': {
    id: 'mem-1',
    girl_id: 'g-1',
    birthday: 'October 24 (Scorpio)',
    business: 'Senior Partner at Family Office in Mayfair (Multi-family wealth)',
    hobbies: 'Showjumping, classical piano, visiting vineyards in Tuscany, Burna Boy tracks',
    food: 'Truffle pasta, Matsuhisa London, artisanal ceremonial matcha',
    last_contact: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    notes: 'Loves when a man leads with calm authority. Mentioned wanting to spend New Year in Cape Town or Accra with someone special.',
    gift_ideas: 'First edition book on modern African architecture, equestrian leather gloves from Hermès',
    relationship_goals: 'Exclusive partnership with marriage vision; mutual empire building.',
    updated_at: new Date().toISOString(),
  },
  'g-2': {
    id: 'mem-2',
    girl_id: 'g-2',
    birthday: 'May 14 (Taurus)',
    business: 'Founder of Dubai Boutique Interior Design Agency & Palm Jumeirah developer',
    hobbies: 'Contemporary African sculpture, sunset yacht cruises around the Palm, Pilates',
    food: 'Zuma Dubai, grilled Chilean sea bass, vintage Dom Pérignon',
    last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Invited me to an art preview next month. Values chivalry, opening car doors, and sincere eye contact.',
    gift_ideas: 'Curated sculpture catalog from 1-54 Art Fair Marrakech',
    relationship_goals: 'Desires a rock-solid, grounded king who matches her drive.',
    updated_at: new Date().toISOString(),
  },
  'g-6': {
    id: 'mem-6',
    girl_id: 'g-6',
    birthday: 'August 8 (Leo)',
    business: 'Director of Energy & Infrastructure Consultancy in Ikoyi, Lagos',
    hobbies: 'Golf at Ikoyi Club 1938, private boat trips in Ilashe beach, Afro-fusion playlists',
    food: 'Nok by Alara, spicy jollof rice with grilled jumbo prawns, chilled champagne',
    last_contact: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    notes: 'Incredible chemistry. Expressed pride in dating an ambitious gentleman. Meeting her parents in London next spring.',
    gift_ideas: 'Custom diamond tennis bracelet, weekend getaway to Zanzibar',
    relationship_goals: 'Life partner / marriage.',
    updated_at: new Date().toISOString(),
  }
};

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'g-1': [
    {
      id: 'm-1',
      girl_id: 'g-1',
      sender: 'user',
      text: 'Good evening Victoria. Saw your recent story at the dressage finals—impeccable poise.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: 'm-2',
      girl_id: 'g-1',
      sender: 'girl',
      text: 'Thank you! It was quite intense with the rain, but my horse performed beautifully. Do you ride as well?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'm-3',
      girl_id: 'g-1',
      sender: 'user',
      text: 'I appreciate the craft from the gallery, though I have more experience maneuvering horsepower on four wheels. How was your celebration dinner afterwards?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      id: 'm-4',
      girl_id: 'g-1',
      sender: 'girl',
      text: 'Haha, clever. We ended up at Annabel’s with some vintage red. By the way, I was listening to Asake on the drive back—such infectious energy. Are you in London next week?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    }
  ],
  'g-2': [
    {
      id: 'm-21',
      girl_id: 'g-2',
      sender: 'girl',
      text: 'The private viewing at Alserkal Avenue was phenomenal. Kept thinking of your take on contemporary Nigerian bronze works.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: 'm-22',
      girl_id: 'g-2',
      sender: 'user',
      text: 'Those heritage bronzes have a presence you feel before you even analyze them. Just like timeless style.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
  ]
};

// Storage helper functions
export const getGirls = (): Girl[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GIRLS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GIRLS, JSON.stringify(ALL_INITIAL_GIRLS));
      return ALL_INITIAL_GIRLS;
    }
    const parsed: Girl[] = JSON.parse(raw);
    
    // Auto-discover: Merge newly added girls by ID and fill missing WhatsApp numbers
    const existingIds = new Set(parsed.map(g => g.id));
    let hasChanges = false;
    const merged: Girl[] = [...parsed];

    // Ensure all seed girls exist
    for (const seedGirl of ALL_INITIAL_GIRLS) {
      if (!existingIds.has(seedGirl.id)) {
        merged.push(seedGirl);
        hasChanges = true;
      }
    }

    // Ensure all girls have their WhatsApp number populated from seed
    for (const g of merged) {
      if (!g.whatsapp) {
        const seedMatch = ALL_INITIAL_GIRLS.find(s => s.id === g.id);
        if (seedMatch?.whatsapp) {
          g.whatsapp = seedMatch.whatsapp;
          hasChanges = true;
        } else if (g.presidential_details?.whatsapp) {
          g.whatsapp = g.presidential_details.whatsapp;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      localStorage.setItem(STORAGE_KEYS.GIRLS, JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    console.error('Failed to load girls from storage', e);
    return ALL_INITIAL_GIRLS;
  }
};

export const getPresidentialGirls = (): Girl[] => {
  return getGirls().filter(g => g.is_presidential_daughter === true);
};

export interface PresidentialRegistrationPayload {
  name: string;
  age: number;
  country: string;
  parent_title: string;
  presidential_term: string;
  official_residence: string;
  security_protocol: string;
  diplomatic_passcode: string;
  whatsapp: string;
  relationship_intent: string;
  avatar_url?: string;
  ig?: string;
}

export const verifyAndRegisterPresidentialDaughter = (
  payload: PresidentialRegistrationPayload
): { success: boolean; error?: string; girl?: Girl } => {
  // Strict Presidential Pedigree Validation
  if (!payload.name || payload.name.trim().length < 3) {
    return { success: false, error: 'Full diplomatic name is required.' };
  }

  if (!payload.whatsapp || !payload.whatsapp.startsWith('+') || payload.whatsapp.replace(/\D/g, '').length < 8) {
    return { 
      success: false, 
      error: 'Valid international WhatsApp number with country code (e.g. +33, +1, +44, +234, +49) is required.' 
    };
  }

  if (!payload.country || payload.country.trim().length < 2) {
    return { success: false, error: 'Sovereign nation / state is required.' };
  }

  if (!payload.parent_title || payload.parent_title.trim().length < 3) {
    return { success: false, error: 'Official presidential title (e.g. President of the Republic, Head of State) is required.' };
  }

  // Palace validation list: must reference a recognized sovereign residence or state compound
  const officialResidenceLower = (payload.official_residence || '').toLowerCase();
  const knownPalaces = [
    'palace', 'elysée', 'élysée', 'white house', 'aso rock', 'villa', 'bellevue', 
    'quirinal', 'los pinos', 'palacio', 'castillo', 'residence', 'moncloa', 
    'state house', 'jubilee house', 'al-ittihadiya', 'qasr', 'kremlin', 'rashtrapati', 
    'za\'abeel', 'hofburg', 'amalienborg', 'royal', 'sovereign', 'enclave', 'chigi'
  ];

  const hasRecognizedPalace = knownPalaces.some(p => officialResidenceLower.includes(p));
  if (!hasRecognizedPalace) {
    return {
      success: false,
      error: 'Security Verification Failed: The official presidential palace/residence entered does not match accredited Head of State quarters.'
    };
  }

  // Security detail verification: must specify accredited protection detail (e.g. Secret Service, GSPR, BKA, Presidential Guard, SSS, SPC)
  const securityLower = (payload.security_protocol || '').toLowerCase();
  const knownSecurityDetails = [
    'service', 'guard', 'protection', 'regiment', 'detail', 'gspr', 'bka', 
    'secret service', 'sss', 'dsp', 'spc', 'special', 'security', 'command', 'corps', 'unit', 'escort'
  ];
  const hasRecognizedSecurity = knownSecurityDetails.some(s => securityLower.includes(s));
  if (!hasRecognizedSecurity) {
    return {
      success: false,
      error: 'Security Protocol Failed: Official Presidential Protective Detail code or unit name is required for diplomatic clearance.'
    };
  }

  if (!payload.relationship_intent || payload.relationship_intent.trim().length < 15) {
    return {
      success: false,
      error: 'Please describe your genuine relationship intentions (minimum 15 characters).'
    };
  }

  // Created Verified Presidential Daughter Profile
  const newPresidentialGirl: Girl = {
    id: 'pres-auth-' + Date.now(),
    name: payload.name.trim(),
    age: Number(payload.age) || 26,
    bio: `Verified Daughter of ${payload.parent_title} (${payload.country}). Residence: ${payload.official_residence}. "${payload.relationship_intent.slice(0, 120)}"`,
    ig: payload.ig ? (payload.ig.startsWith('@') ? payload.ig : `@${payload.ig}`) : '@diplomatic_priv',
    location: payload.country,
    ethnicity: 'White / Diplomatic Lineage',
    tags: ['Presidential Daughter', 'Diplomatic Immunity', 'Palace Verified', 'Loves African Kings'],
    match_score: 99,
    match_reason: `Officially verified daughter of ${payload.parent_title}. Sovereign credentials cleared through ${payload.security_protocol}. Seeking sincere, high-value companionship.`,
    stage: 'Chatting',
    avatar_url: payload.avatar_url?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    public_likes_black_men: true,
    estimated_net_worth: '$50M+ (Sovereign Family)',
    verified: true,
    is_presidential_daughter: true,
    presidential_details: {
      country: payload.country,
      parent_title: payload.parent_title,
      presidential_term: payload.presidential_term || 'Sovereign Administration',
      official_residence: payload.official_residence,
      security_protocol: payload.security_protocol,
      whatsapp: payload.whatsapp.trim(),
      verified_credentials: true,
      relationship_intent: payload.relationship_intent,
    },
    created_at: new Date().toISOString(),
  };

  // Save to database
  saveGirl(newPresidentialGirl);

  // Initialize Memory
  saveMemory({
    id: 'mem-' + newPresidentialGirl.id,
    girl_id: newPresidentialGirl.id,
    birthday: 'Diplomatic confidential',
    business: `First Family Envoy / Foundation (${payload.country})`,
    hobbies: 'Private state diplomacy, cultural philanthropy, international art galas',
    food: 'Palace state dinners, Michelin gastronomy, authentic African delicacies',
    last_contact: new Date().toISOString(),
    notes: `Registered via Sovereign Protocol. WhatsApp: ${payload.whatsapp}. Security Detail: ${payload.security_protocol}. Sincere intent: "${payload.relationship_intent}"`,
    gift_ideas: 'Discreet high-jewelry, private aviation escape, antique African sculpture',
    relationship_goals: payload.relationship_intent,
    updated_at: new Date().toISOString(),
  });

  return { success: true, girl: newPresidentialGirl };
};

export const saveGirl = (girl: Girl): void => {
  const current = getGirls();
  const index = current.findIndex(g => g.id === girl.id);
  let updated: Girl[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = girl;
  } else {
    updated = [girl, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.GIRLS, JSON.stringify(updated));
};

export const updateGirlStage = (id: string, stage: PipelineStage): void => {
  const current = getGirls();
  const updated = current.map(g => g.id === id ? { ...g, stage } : g);
  localStorage.setItem(STORAGE_KEYS.GIRLS, JSON.stringify(updated));
};

export const deleteGirl = (id: string): void => {
  const current = getGirls();
  const updated = current.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GIRLS, JSON.stringify(updated));
};

export const getMessages = (girlId: string): Message[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    let all: Record<string, Message[]> = raw ? JSON.parse(raw) : INITIAL_MESSAGES;
    return all[girlId] || [];
  } catch (e) {
    return INITIAL_MESSAGES[girlId] || [];
  }
};

export const addMessage = (girlId: string, sender: 'user' | 'girl', text: string): Message => {
  const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  let all: Record<string, Message[]> = raw ? JSON.parse(raw) : { ...INITIAL_MESSAGES };
  const currentList = all[girlId] || [];
  
  const newMessage: Message = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    girl_id: girlId,
    sender,
    text,
    created_at: new Date().toISOString(),
  };

  all[girlId] = [...currentList, newMessage];
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));

  // Also update last_contact in her memory
  const memory = getMemory(girlId);
  if (memory) {
    saveMemory({
      ...memory,
      last_contact: new Date().toISOString(),
    });
  }

  return newMessage;
};

export const getMemory = (girlId: string): Memory => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    let all: Record<string, Memory> = raw ? JSON.parse(raw) : INITIAL_MEMORIES;
    if (all[girlId]) {
      return all[girlId];
    }
  } catch (e) {
    console.error(e);
  }

  // Fallback initial memory creation
  const girl = getGirls().find(g => g.id === girlId);
  return {
    id: 'mem-' + girlId,
    girl_id: girlId,
    birthday: 'Not specified yet',
    business: 'Executive / Entrepreneur',
    hobbies: girl?.tags.join(', ') || 'Fine dining, luxury travel, art',
    food: 'Fine dining, wine & artisanal cuisine',
    last_contact: new Date().toISOString(),
    notes: girl?.match_reason || 'Initial connection established.',
    gift_ideas: '',
    relationship_goals: 'High-value courting & genuine connection',
    updated_at: new Date().toISOString(),
  };
};

export const saveMemory = (memory: Memory): void => {
  const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
  let all: Record<string, Memory> = raw ? JSON.parse(raw) : { ...INITIAL_MEMORIES };
  all[memory.girl_id] = {
    ...memory,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(all));
};

export const INITIAL_DATE_PLANS: DatePlan[] = [
  {
    id: 'dp-1',
    girl_id: 'g-2',
    girl_name: 'Camilla Sterling',
    girl_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    title: 'Private Rooftop Tasting & Contemporary Sculpture Preview',
    date_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 19).toISOString(),
    city: 'Dubai',
    venue: 'Zuma Dubai Private Salon & Alserkal Avenue',
    experience_type: 'Fine Dining & Art Auction',
    notes: 'Chauffeur Rolls Royce pickup at 19:30. She loves Chilean sea bass and vintage Dom Pérignon. Gift: Rare art monograph.',
    budget_tier: '$3,500 - $5,000',
    status: 'Confirmed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'dp-2',
    girl_id: 'g-1',
    girl_name: 'Victoria Kensington',
    girl_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    title: 'Mayfair Tasting Menu & Private Members Club Soirée',
    date_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6 + 1000 * 60 * 60 * 20).toISOString(),
    city: 'London',
    venue: 'Matsuhisa London & Annabel’s Mayfair',
    experience_type: 'Gastronomy & High Society',
    notes: 'Discussed Burna Boy tour & equestrian showjumping. Reserved discreet corner booth away from press.',
    budget_tier: '£2,500 - £4,000',
    status: 'Scheduled',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  }
];

export const getDatePlans = (): DatePlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DATE_PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DATE_PLANS, JSON.stringify(INITIAL_DATE_PLANS));
      return INITIAL_DATE_PLANS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load date plans', e);
    return INITIAL_DATE_PLANS;
  }
};

export const saveDatePlan = (plan: DatePlan): void => {
  const current = getDatePlans();
  const index = current.findIndex(p => p.id === plan.id);
  let updated: DatePlan[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = plan;
  } else {
    updated = [plan, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.DATE_PLANS, JSON.stringify(updated));
};

export const deleteDatePlan = (id: string): void => {
  const current = getDatePlans();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.DATE_PLANS, JSON.stringify(updated));
};

export const getDatePlansForGirl = (girlId: string): DatePlan[] => {
  return getDatePlans().filter(p => p.girl_id === girlId);
};

export const resetToSeedData = (): void => {
  localStorage.setItem(STORAGE_KEYS.GIRLS, JSON.stringify(ALL_INITIAL_GIRLS));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(INITIAL_MEMORIES));
  localStorage.setItem(STORAGE_KEYS.DATE_PLANS, JSON.stringify(INITIAL_DATE_PLANS));
};
