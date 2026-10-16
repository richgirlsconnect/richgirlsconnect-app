-- ==============================================================================
-- RICHCONNECT AI - SUPABASE SCHEMA MIGRATION SCRIPT
-- Tables: girls, messages, memories
-- Row Level Security (RLS) & Sample Seed Data
-- ==============================================================================

-- 1. Create table: girls
CREATE TABLE IF NOT EXISTS public.girls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bio TEXT,
    ig TEXT,
    location TEXT NOT NULL,
    ethnicity TEXT DEFAULT 'Caucasian',
    age INTEGER DEFAULT 25,
    tags TEXT[] DEFAULT '{}',
    match_score INTEGER DEFAULT 90,
    match_reason TEXT,
    stage TEXT DEFAULT 'Found' CHECK (stage IN ('Found', 'Chatting', 'Close', 'Dating', 'Visit Planned', 'Partner')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table: messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    girl_id UUID REFERENCES public.girls(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'girl')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table: memories
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    girl_id UUID UNIQUE REFERENCES public.girls(id) ON DELETE CASCADE,
    birthday TEXT,
    business TEXT,
    hobbies TEXT,
    food TEXT,
    last_contact TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.girls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Allow read/write for authenticated users or anonymous CRM access (can be locked to auth.uid() in multi-tenant)
CREATE POLICY "Allow public full access to girls" ON public.girls
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to messages" ON public.messages
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to memories" ON public.memories
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Performance Indexes for Mode 1
CREATE INDEX IF NOT EXISTS idx_girls_stage ON public.girls(stage);
CREATE INDEX IF NOT EXISTS idx_girls_location ON public.girls(location);
CREATE INDEX IF NOT EXISTS idx_messages_girl_id ON public.messages(girl_id);
CREATE INDEX IF NOT EXISTS idx_memories_girl_id ON public.memories(girl_id);

-- ==============================================================================
-- MODE 2: ELITE PRIVATE MATCHMAKING SCHEMA
-- Tables: clients, matches, match_messages, consultations
-- ==============================================================================

-- 6. Create table: clients
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER DEFAULT 30,
    gender TEXT DEFAULT 'Male',
    location TEXT NOT NULL,
    avatar_url TEXT,
    photos TEXT[] DEFAULT '{}',
    partner_preference TEXT NOT NULL,
    wealth_level TEXT NOT NULL,
    bio TEXT NOT NULL,
    what_they_want TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false, -- Strict privacy: no public browsing
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    consultation_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create table: matches
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_a UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    client_b UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- 8. Create table: match_messages
CREATE TABLE IF NOT EXISTS public.match_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create table: consultations
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 2500.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('Paystack', 'Stripe')),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'failed')),
    reference TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Enable RLS on Mode 2 tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated and service access to clients" ON public.clients
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow access to matches" ON public.matches
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow access to match_messages" ON public.match_messages
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow access to consultations" ON public.consultations
    FOR ALL USING (true) WITH CHECK (true);

-- 11. Performance Indexes for Mode 2
CREATE INDEX IF NOT EXISTS idx_clients_is_public ON public.clients(is_public);
CREATE INDEX IF NOT EXISTS idx_matches_client_a ON public.matches(client_a);
CREATE INDEX IF NOT EXISTS idx_matches_client_b ON public.matches(client_b);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_match_messages_match_id ON public.match_messages(match_id);
CREATE INDEX IF NOT EXISTS idx_consultations_reference ON public.consultations(reference);


-- 6. Pre-vetted Seed Profiles (Curated High-Value Matches)
INSERT INTO public.girls (id, name, bio, ig, location, ethnicity, age, tags, match_score, match_reason, stage, avatar_url)
VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Victoria Kensington',
    'Private wealth advisor & equestrian competitor. Love African culture, Afrobeats & genuine kings with ambition. Split between Mayfair & Monaco.',
    '@victoriak_priv',
    'UK',
    'White / Caucasian',
    27,
    ARRAY['Rich', 'Queen lifestyle', 'Equestrian', 'Finance Heiress', 'Afrobeats Lover'],
    98,
    'Bio explicitly celebrates African culture & black kings. High-status London equestrian lifestyle, visits Lagos & Accra for Detty December.',
    'Chatting',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
),
(
    '00000000-0000-0000-0000-000000000002',
    'Camilla Sterling',
    'Creative Director & luxury real estate developer. Passionate about interracial dating, art galas, and strong, charismatic black men. Dubai marina life.',
    '@camilla_sterling',
    'Dubai',
    'White / Caucasian',
    29,
    ARRAY['Princess', 'Dubai lifestyle', 'Real Estate', 'Art Collector', 'Global Jetsetter'],
    96,
    'Publicly embraces interracial relationships; frequent attendee of African contemporary art auctions in Dubai and London.',
    'Dating',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
),
(
    '00000000-0000-0000-0000-000000000003',
    'Elena De La Tour',
    'Fashion brand founder & philanthropist. I love black men with vision, drive, and high energy. Paris fashion week & Victoria Island winter escapes.',
    '@elena_delatour',
    'Europe',
    'White / Caucasian',
    26,
    ARRAY['Rich', 'Princess', 'High Fashion', 'Tech Angel', 'Lagos Explorer'],
    95,
    'Active advocate for intercultural romance, spent NYE in Lagos private beach houses, family owns European luxury winery.',
    'Close',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
),
(
    '00000000-0000-0000-0000-000000000004',
    'Sophie Vanderbilt',
    'Fintech angel & aviation enthusiast. Nothing more magnetic than a tall, chivalrous black man with a sharp mind. Manhattan & Aspen.',
    '@sophievanderbilt',
    'US',
    'White / Caucasian',
    28,
    ARRAY['Rich', 'Queen lifestyle', 'Private Aviation', 'Venture Capital'],
    94,
    'Stated admiration for black tech founders & high-caliber men. High society pedigree, values traditional courtship and mutual respect.',
    'Found',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
),
(
    '00000000-0000-0000-0000-000000000005',
    'Astrid Lindholm',
    'Nordic architecture designer & yachting regular. Big heart for African music, Burna Boy concerts, and ambitious gentlemen. Toronto & Stockholm.',
    '@astrid.arch',
    'Canada',
    'White / Caucasian',
    25,
    ARRAY['Princess', 'Yachting', 'Architecture', 'Afrobeats Lover'],
    92,
    'Regularly shares love for African music & culture, seeking serious monogamous partnership with an exceptional gentleman.',
    'Visit Planned',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80'
),
(
    '00000000-0000-0000-0000-000000000006',
    'Zoe Montgomery',
    'Oil & infrastructure consultant based between Lagos (Ikoyi) & London. Loves African men deeply, high-caliber dinners, and sincere romance.',
    '@zoe_montgomery_ikoyi',
    'Lagos',
    'White / Caucasian',
    30,
    ARRAY['Queen lifestyle', 'Expat Luxury', 'Infrastructure', 'Loves African Men'],
    99,
    'Lives in Ikoyi/Victoria Island, speaks conversational Yoruba phrases, completely immersed in African culture and high society.',
    'Partner',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- Initial Memories for seed profiles
INSERT INTO public.memories (girl_id, birthday, business, hobbies, food, last_contact, notes)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'October 24 (Scorpio)',
    'Senior Family Office Partner in Mayfair',
    'Showjumping, classical piano, visiting vineyards in Tuscany',
    'Truffle pasta, Matsuhisa London, high-grade matcha',
    NOW() - INTERVAL '3 hours',
    'Loves when a man is decisive. Mentioned wanting to spend New Year in Cape Town or Accra.'
),
(
    '00000000-0000-0000-0000-000000000002',
    'May 14 (Taurus)',
    'Founder of Dubai Boutique Interior Firm',
    'Contemporary African sculpture, sunset yachting, Pilates',
    'Zuma Dubai, grilled sea bass, vintage champagne',
    NOW() - INTERVAL '1 day',
    'Invited me to an art preview next month. Appreciates chivalry, opening car doors, and direct eye contact.'
),
(
    '00000000-0000-0000-0000-000000000006',
    'August 8 (Leo)',
    'Director of Infrastructure Consultancy in Ikoyi',
    'Golf at Ikoyi Club 1938, private island boat trips in Ilashe',
    'Nok by Alara, spicy jollof rice, grilled prawns',
    NOW() - INTERVAL '30 minutes',
ON CONFLICT (girl_id) DO NOTHING;

-- 12. Create table: agent_events (Event-based AI helpers audit trail)
CREATE TABLE IF NOT EXISTS public.agent_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'warning', 'flagged', 'error')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.agent_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow access to agent_events" ON public.agent_events FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_agent_events_agent_name ON public.agent_events(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_events_created_at ON public.agent_events(created_at DESC);
