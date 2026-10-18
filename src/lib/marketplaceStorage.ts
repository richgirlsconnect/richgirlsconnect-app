import { supabase } from './supabase';

export interface GirlApplication {
  id: string;
  name: string;
  age?: number;
  city: string;
  country: string;
  instagram: string;
  net_worth: string;
  what_they_seek?: string;
  bio: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  referral_code: string;
  referred_by?: string;
  fee_paid: boolean;
  fee_amount: number;
  created_at: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  type: 'ebook' | 'course' | 'audio';
  description: string;
  cover_url: string;
  file_url: string;
  sales: number;
  created_at: string;
  key_benefits?: string[];
  chapters_outline?: { chapter_number: number; title: string; summary: string }[];
  full_chapter_sample?: string;
}

export interface MarketingPost {
  id: string;
  platform: string;
  content: string;
  city_target: string;
  status: 'draft' | 'scheduled' | 'published';
  created_at: string;
  type?: string;
  hook?: string;
  cta?: string;
  hashtags?: string[];
}

export interface RevenueRecord {
  id: string;
  source: 'application_fee' | 'digital_product' | 'client_retainer';
  item_title: string;
  amount: number;
  buyer_name: string;
  gateway: 'Stripe' | 'Paystack';
  created_at: string;
}

const STORAGE_KEYS = {
  APPLICATIONS: 'rc_girl_applications_v1',
  PRODUCTS: 'rc_digital_products_v1',
  POSTS: 'rc_marketing_posts_v1',
  REVENUE: 'rc_revenue_records_v1',
};

// Seed high-converting luxury digital products matching the user's specific topics
export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod-1',
    title: "The Rich Girl's Guide to Finding Your Dream Man",
    subtitle: "The Psychological Blueprint for High-Value Connection & Lasting Devotion",
    price: 49,
    type: 'ebook',
    description: "An elite roadmap revealing how cultured, high-earning women navigate luxury social enclaves, vet for genuine ambition and generosity, and inspire chivalrous devotion without ever settling.",
    cover_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    file_url: "https://richconnect.luxury/downloads/the-rich-girls-guide.pdf",
    sales: 184,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    key_benefits: [
      "Master the subtle cues of high-net-worth courtship",
      "How to access non-indexed private members enclaves in London & Dubai",
      "Vetting for character and emotional generosity early on",
      "Inspiring masculine leadership and protective chivalry",
      "Creating generational family legacy together"
    ],
    chapters_outline: [
      { chapter_number: 1, title: "The Sovereign Mindset Shift", summary: "Stepping away from performative dating and stepping into magnetic poise." },
      { chapter_number: 2, title: "The Enclaves of High Society", summary: "Private art salons, polo circuits, and private aviation clubs." },
      { chapter_number: 3, title: "The Conversational Frame", summary: "Discreet banter that signals intellectual depth and emotional safety." },
      { chapter_number: 4, title: "Vetting Without Interrogation", summary: "Reading micro-actions that reveal financial and emotional character." },
      { chapter_number: 5, title: "Intercultural Courtship Synergy", summary: "Harmonizing European high society and African visionary wealth." },
      { chapter_number: 6, title: "From Courtship to Sovereign Dynasty", summary: "Co-creating lasting marriage, legacy foundations, and shared vision." }
    ],
    full_chapter_sample: "Chapter 1: The Sovereign Mindset Shift\n\nHigh-value gentlemen who have founded technology enterprises or manage sovereign family trusts are inundated with superficial attention. The moment you walk into a private lounge like Oswald's or 5 Hertford Street, you must understand: true allure is understated..."
  },
  {
    id: 'prod-2',
    title: "Lagos to Monaco: How African Queens Attract Global Millionaires",
    subtitle: "Cross-Cultural Romance, Chivalry, and Navigating Global Elite Circles",
    price: 69,
    type: 'course',
    description: "The definitive masterclass on how ambitious Black women and African visionaries build high-status global relationships across London, Paris, Zurich, Dubai, and the French Riviera.",
    cover_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    file_url: "https://richconnect.luxury/downloads/lagos-to-monaco-masterclass.pdf",
    sales: 247,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    key_benefits: [
      "Navigating high-society etiquette in Monaco and Mayfair",
      "Positioning your African heritage as your ultimate sovereign superpower",
      "How European heiresses and African kings form high-synergy unions",
      "Private dining protocols and champagne tasting etiquette",
      "Discreet communication on WhatsApp & private concierge lines"
    ]
  },
  {
    id: 'prod-3',
    title: "Texting That Makes Millionaires Obsessed",
    subtitle: "72 Proven WhatsApp & DM Scripts for High-Status Women",
    price: 29,
    type: 'ebook',
    description: "Never send a dry, boring text again. 72 psychologically tested message frameworks, flirty callbacks, and date invitation prompts crafted for executive gentlemen with zero time to waste.",
    cover_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    file_url: "https://richconnect.luxury/downloads/texting-that-makes-millionaires-obsessed.pdf",
    sales: 412,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    key_benefits: [
      "The 3-message rule that triggers instant evening phone calls",
      "How to gracefully decline casual hangouts and pivot to private dining",
      "Playful banters that make high-earning men laugh and remember you",
      "The 'busy founder callback' that respects his schedule while staying top of mind",
      "Zero desperate energy: effortless, relaxed feminine authority"
    ]
  },
  {
    id: 'prod-4',
    title: "How to Build Lasting Relationships Where Others Fail",
    subtitle: "The Emotional Intelligence & Conflict Resolution Guide for Power Couples",
    price: 45,
    type: 'audio',
    description: "A 4-part audio masterclass on maintaining romance, deep emotional intimacy, and mutual respect in relationships with high-powered leaders, entrepreneurs, and public figures.",
    cover_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    file_url: "https://richconnect.luxury/downloads/lasting-relationships-masterclass.mp3",
    sales: 156,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    key_benefits: [
      "De-escalating tension when both partners carry high workloads",
      "Creating sacred unhurried hours away from phones and business",
      "Nurturing romantic polarity in long-term marriages",
      "Handling public scrutiny and maintaining family privacy",
      "Sovereign financial transparency and mutual wealth planning"
    ]
  },
  {
    id: 'prod-5',
    title: "Secrets to Succeeding in Dating, Marriage & High-Value Relationships",
    subtitle: "The Complete Sovereign Enclave Relationship Encyclopedia",
    price: 99,
    type: 'course',
    description: "The complete flagship compendium covering everything from initial discovery, private club etiquette, psychological attraction, to royal-grade wedding preparation and family trusts.",
    cover_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    file_url: "https://richconnect.luxury/downloads/secrets-high-value-relationships.pdf",
    sales: 89,
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    key_benefits: [
      "Over 250 pages of bespoke relationship intelligence",
      "Video walkthroughs of private club etiquette worldwide",
      "Workbooks on personal styling, fragrance curation, and posture",
      "Legal and legacy planning for sovereign high-net-worth couples",
      "Exclusive invitation to RichConnect annual private gala"
    ]
  }
];

// Seed Applications for Girl Discovery Funnel
export const INITIAL_GIRL_APPLICATIONS: GirlApplication[] = [
  {
    id: 'app-1',
    name: 'Sienna Laurent',
    age: 26,
    city: 'London',
    country: 'United Kingdom',
    instagram: '@sienna.laurent',
    net_worth: '$10M - $25M (Family Office & Art)',
    what_they_seek: 'Looking for a charismatic, ambitious Black king with chivalry and global vision.',
    bio: 'Contemporary art advisory founder in Mayfair. Dressage competitor, Afrobeats lover, frequent traveler to Lagos & Monaco.',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    referral_code: 'SIENNA26',
    fee_paid: true,
    fee_amount: 99,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'app-2',
    name: 'Dr. Celine Moreau',
    age: 28,
    city: 'Paris',
    country: 'France',
    instagram: '@celine_moreau_paris',
    net_worth: '$15M - $30M (Private Biotech)',
    what_they_seek: 'Seeking high-caliber partnership built on mutual intellectual respect, romance and fine wine.',
    bio: 'Biotech researcher and luxury perfumery heiress. Love jazz, private gallery openings, and deep intellectual banter.',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    referral_code: 'CELINE88',
    fee_paid: true,
    fee_amount: 99,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'app-3',
    name: 'Zahra Al-Maktoum',
    age: 27,
    city: 'Dubai',
    country: 'United Arab Emirates',
    instagram: '@zahra.dubai.luxe',
    net_worth: '$40M+ (Heritage Real Estate)',
    what_they_seek: 'Seeking an exceptional gentleman who commands respect and cherishes family loyalty.',
    bio: 'Oversees private hospitality development in Palm Jumeirah. Desert polo enthusiast, jetsetter across Lagos, London & Paris.',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    referral_code: 'ZAHRA97',
    fee_paid: true,
    fee_amount: 99,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'app-4',
    name: 'Nkechi "Nikki" Adeleke',
    age: 25,
    city: 'Lagos',
    country: 'Nigeria',
    instagram: '@nikki_adeleke',
    net_worth: '$20M+ (Energy & Infrastructure)',
    what_they_seek: 'Looking for a powerful, generous, visionary gentleman ready for sovereign marital dynasty.',
    bio: 'Ikoyi & Banana Island resident. Creative director for African luxury lifestyle collective. Splitting time with Mayfair.',
    image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    referral_code: 'NIKKI_IKOYI',
    fee_paid: true,
    fee_amount: 99,
    created_at: new Date(Date.now() - 3600000 * 22).toISOString()
  }
];

// Seed Marketing Posts
export const INITIAL_MARKETING_POSTS: MarketingPost[] = [
  {
    id: 'mp-1',
    platform: 'Instagram',
    city_target: 'Dubai',
    type: 'Reels Hook',
    content: 'Why cultured women in Dubai Marina are turning off public dating apps. Vetted sovereign circle &bull; Zero public profiles. Apply at /join/dubai',
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    hashtags: ['#DubaiLuxury', '#DIFCLife', '#RichConnect', '#PrivateMatchmaking']
  },
  {
    id: 'mp-2',
    platform: 'TikTok',
    city_target: 'London',
    type: 'TikTok Script',
    content: 'POV: High standards rewarded. Vetted pan-African & European elite enclave in Mayfair. Join the private waitlist: /join/london',
    status: 'scheduled',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    hashtags: ['#LondonHeiress', '#MayfairCircle', '#HighValueDating']
  }
];

// Seed Revenue Records
export const INITIAL_REVENUE_RECORDS: RevenueRecord[] = [
  {
    id: 'rev-1',
    source: 'client_retainer',
    item_title: 'Private Client Membership Retainer',
    amount: 2500,
    buyer_name: 'Adekunle "Kunle" Balogun',
    gateway: 'Stripe',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'rev-2',
    source: 'application_fee',
    item_title: 'RichConnect Circle Girl Application Fee',
    amount: 99,
    buyer_name: 'Sienna Laurent',
    gateway: 'Stripe',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rev-3',
    source: 'digital_product',
    item_title: "The Rich Girl's Guide to Finding Your Dream Man",
    amount: 49,
    buyer_name: 'Lady Genevieve Vance',
    gateway: 'Paystack',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'rev-4',
    source: 'digital_product',
    item_title: "Texting That Makes Millionaires Obsessed",
    amount: 29,
    buyer_name: 'Camilla Van Der Bilt',
    gateway: 'Stripe',
    created_at: new Date().toISOString()
  }
];

// ==========================================
// GIRL APPLICATIONS API & STORAGE
// ==========================================
export const getGirlApplications = (): GirlApplication[] => {
  if (typeof window === 'undefined') return INITIAL_GIRL_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_GIRL_APPLICATIONS));
      return INITIAL_GIRL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GIRL_APPLICATIONS;
  }
};

export const submitGirlApplication = async (app: Omit<GirlApplication, 'id' | 'created_at' | 'status'>): Promise<GirlApplication> => {
  const newApp: GirlApplication = {
    ...app,
    id: `app-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const list = getGirlApplications();
  const updated = [newApp, ...list];
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));

  // Also log the $99 application fee revenue
  if (newApp.fee_paid) {
    addRevenueRecord({
      source: 'application_fee',
      item_title: `Private Circle Application (${newApp.city})`,
      amount: newApp.fee_amount || 99,
      buyer_name: newApp.name,
      gateway: 'Stripe'
    });
  }

  // Supabase sync to 'girl_applications' table
  try {
    await supabase.from('girl_applications').insert([
      {
        id: newApp.id,
        name: newApp.name,
        city: newApp.city,
        country: newApp.country,
        instagram: newApp.instagram,
        net_worth: newApp.net_worth,
        bio: newApp.bio,
        image_url: newApp.image_url,
        status: newApp.status,
        referral_code: newApp.referral_code,
        created_at: newApp.created_at,
      }
    ]);
  } catch (err) {
    console.warn('Supabase girl_applications sync skipped:', err);
  }

  return newApp;
};

export const updateGirlApplicationStatus = async (id: string, status: 'approved' | 'rejected'): Promise<GirlApplication[]> => {
  const list = getGirlApplications();
  const updated = list.map(item => {
    if (item.id === id) {
      return { ...item, status };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));

  try {
    await supabase.from('girl_applications').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Supabase update status skipped:', err);
  }

  return updated;
};

// ==========================================
// DIGITAL PRODUCTS API & STORAGE
// ==========================================
export const getDigitalProducts = (): DigitalProduct[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveDigitalProduct = async (product: DigitalProduct): Promise<DigitalProduct> => {
  const current = getDigitalProducts();
  const updated = [product, ...current.filter(p => p.id !== product.id)];
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

  try {
    await supabase.from('digital_products').upsert({
      id: product.id,
      title: product.title,
      price: product.price,
      type: product.type,
      description: product.description,
      cover_url: product.cover_url,
      file_url: product.file_url,
      sales: product.sales,
      created_at: product.created_at
    });
  } catch (err) {
    console.warn('Supabase digital_products sync skipped:', err);
  }

  return product;
};

export const recordProductSale = (productId: string, buyerName: string, gateway: 'Stripe' | 'Paystack' = 'Stripe') => {
  const products = getDigitalProducts();
  const product = products.find(p => p.id === productId);
  if (product) {
    product.sales = (product.sales || 0) + 1;
    saveDigitalProduct(product);

    addRevenueRecord({
      source: 'digital_product',
      item_title: product.title,
      amount: product.price,
      buyer_name: buyerName,
      gateway
    });
  }
};

// ==========================================
// MARKETING POSTS API & STORAGE
// ==========================================
export const getMarketingPosts = (): MarketingPost[] => {
  if (typeof window === 'undefined') return INITIAL_MARKETING_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_MARKETING_POSTS));
      return INITIAL_MARKETING_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MARKETING_POSTS;
  }
};

export const saveMarketingPost = async (post: MarketingPost): Promise<MarketingPost> => {
  const current = getMarketingPosts();
  const updated = [post, ...current.filter(p => p.id !== post.id)];
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));

  try {
    await supabase.from('marketing_posts').upsert({
      id: post.id,
      platform: post.platform,
      content: post.content,
      city_target: post.city_target,
      status: post.status,
      created_at: post.created_at
    });
  } catch (err) {
    console.warn('Supabase marketing_posts sync skipped:', err);
  }

  return post;
};

// ==========================================
// REVENUE TRACKING
// ==========================================
export const getRevenueRecords = (): RevenueRecord[] => {
  if (typeof window === 'undefined') return INITIAL_REVENUE_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVENUE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVENUE, JSON.stringify(INITIAL_REVENUE_RECORDS));
      return INITIAL_REVENUE_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVENUE_RECORDS;
  }
};

export const addRevenueRecord = (record: Omit<RevenueRecord, 'id' | 'created_at'>): RevenueRecord => {
  const newRecord: RevenueRecord = {
    ...record,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  const list = getRevenueRecords();
  const updated = [newRecord, ...list];
  localStorage.setItem(STORAGE_KEYS.REVENUE, JSON.stringify(updated));
  return newRecord;
};
