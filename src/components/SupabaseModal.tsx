import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, saveCustomSupabaseConfig } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA = `-- RICHCONNECT AI - SUPABASE SCHEMA MIGRATION SCRIPT
-- Tables: girls, messages, memories with RLS & indexes

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

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    girl_id UUID REFERENCES public.girls(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'girl')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

ALTER TABLE public.girls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access to girls" ON public.girls FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_girls_stage ON public.girls(stage);
CREATE INDEX IF NOT EXISTS idx_messages_girl_id ON public.messages(girl_id);
CREATE INDEX IF NOT EXISTS idx_memories_girl_id ON public.memories(girl_id);

-- MODE 2: ELITE PRIVATE MATCHMAKING
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
    is_public BOOLEAN DEFAULT false,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    consultation_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.match_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to match_messages" ON public.match_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to consultations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);

-- MODE 3: GLOBAL ACQUISITION & DIGITAL MONEY ENGINE
CREATE TABLE IF NOT EXISTS public.girl_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER DEFAULT 25,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    instagram TEXT NOT NULL,
    net_worth TEXT NOT NULL,
    what_they_seek TEXT,
    bio TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    referral_code TEXT NOT NULL,
    referred_by TEXT,
    fee_paid BOOLEAN DEFAULT false,
    fee_amount NUMERIC(10, 2) DEFAULT 99.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.digital_products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 49.00,
    type TEXT NOT NULL DEFAULT 'ebook' CHECK (type IN ('ebook', 'course', 'audio')),
    description TEXT NOT NULL,
    cover_url TEXT,
    file_url TEXT,
    sales INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.marketing_posts (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    content TEXT NOT NULL,
    city_target TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_hunts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    niche TEXT NOT NULL,
    location TEXT NOT NULL,
    platform TEXT NOT NULL,
    keywords TEXT,
    results JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRIVATE LOVE CHANNEL: SAFE COUPLES MONETIZATION & MEMORY VAULT
CREATE TABLE IF NOT EXISTS public.love_channels (
    id TEXT PRIMARY KEY,
    couple_id TEXT NOT NULL,
    memories JSONB NOT NULL DEFAULT '[]'::jsonb,
    love_points INTEGER DEFAULT 500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.girl_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on girl_applications" ON public.girl_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on digital_products" ON public.digital_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on marketing_posts" ON public.marketing_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ai_hunts" ON public.ai_hunts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on love_channels" ON public.love_channels FOR ALL USING (true) WITH CHECK (true);
`;

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseConfig(url.trim(), anonKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="luxury-card rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-serif-luxury font-bold text-slate-100">
              Supabase Database & SQL Tables
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview banner */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-emerald-300">
            ✓ Turnkey Cloud Sync Support
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            By default, RichConnect AI stores all girls, messages, and memories in your browser's persistent storage. 
            To sync with a cloud Supabase database, copy the SQL below, paste it into your Supabase SQL editor, and configure your keys.
          </p>
        </div>

        {/* Copyable SQL Schema */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              SQL Migration Script (`girls`, `messages`, `memories`)
            </span>
            <button
              onClick={handleCopySQL}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-xl bg-[#05070a] border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
            {SQL_SCHEMA}
          </pre>
        </div>

        {/* Configure keys */}
        <form onSubmit={handleSaveConfig} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-200">
            Supabase Connection Credentials (Optional)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">NEXT_PUBLIC_SUPABASE_URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full p-2.5 rounded-lg bg-black/60 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
              <input
                type="text"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full p-2.5 rounded-lg bg-black/60 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
            >
              {savedSuccess ? 'Credentials Saved!' : 'Save Credentials'}
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
