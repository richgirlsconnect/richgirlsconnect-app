import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  MapPin, 
  Flame, 
  Eye, 
  Lock, 
  Unlock, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Shuffle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  X,
  CreditCard,
  MessageCircle,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getGirlApplications, GirlApplication } from '../lib/marketplaceStorage';

export interface GhostGirl {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  tier: 'DIAMOND' | 'PLATINUM' | 'GOLD' | 'ELITE';
  bio: string;
  seeking: string;
  wealthTier: string;
  avatarUrl: string;
  activeMinutesAgo: number;
  matchPotential: number;
  instagram?: string;
  interests: string[];
}

const LUXURY_GHOST_GIRLS: GhostGirl[] = [
  {
    id: 'gg-1',
    name: 'Sienna Laurent-Du Pont',
    age: 26,
    city: 'Monaco',
    country: 'Monaco',
    tier: 'DIAMOND',
    bio: 'Contemporary African art collector & heiress. Spends summers between Port Hercules and Cap d’Antibes.',
    seeking: 'A visionary king who leads with masculine authority, sovereign vision, and chivalrous romance.',
    wealthTier: '$35M - $50M Family Office',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 2,
    matchPotential: 98,
    interests: ['Superyachts', 'Art Basel', 'Fine Wine', 'Polo']
  },
  {
    id: 'gg-2',
    name: 'Princess Zahra Al-Falasi',
    age: 24,
    city: 'Dubai',
    country: 'United Arab Emirates',
    tier: 'DIAMOND',
    bio: 'Bespoke haute horlogerie investor & equestrian enthusiast living in Emirates Hills.',
    seeking: 'An ambitious gentleman of deep character who respects sovereign heritage and global legacy.',
    wealthTier: '$60M+ Sovereign Circle',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 4,
    matchPotential: 99,
    interests: ['Falconry', 'Desert Polo', 'Haute Horlogerie', 'DIFC Private Capital']
  },
  {
    id: 'gg-3',
    name: 'Lady Genevieve Sterling',
    age: 27,
    city: 'London',
    country: 'United Kingdom',
    tier: 'PLATINUM',
    bio: 'Mayfair gallery director with passion for Afrobeats and transatlantic luxury ventures.',
    seeking: 'A charismatic African tech founder or sovereign investor who loves cultural excellence.',
    wealthTier: '$18M Private Fund',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 1,
    matchPotential: 96,
    interests: ['Oswald’s Mayfair', 'Afrobeats', 'Contemporary Art', 'Chelsea Polo']
  },
  {
    id: 'gg-4',
    name: 'Amara Adeleke',
    age: 23,
    city: 'Lagos',
    country: 'Nigeria',
    tier: 'DIAMOND',
    bio: 'Banana Island royalty, luxury fashion founder & international model.',
    seeking: 'A global Black billionaire or titan of industry ready for sovereign dynasty building.',
    wealthTier: '$25M Liquid Estate',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 3,
    matchPotential: 97,
    interests: ['Private Aviation', 'Fashion Week', 'Ikoyi Polo', 'Mediterranean Cruises']
  },
  {
    id: 'gg-5',
    name: 'Camilla Van Der Bilt',
    age: 25,
    city: 'Paris',
    country: 'France',
    tier: 'PLATINUM',
    bio: 'Haute couture patron & 8th Arrondissement resident. Grand Cru vineyard heiress.',
    seeking: 'A confident, protective gentleman who understands true refinement, romance, and poetry.',
    wealthTier: '$45M Dynasty Assets',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 6,
    matchPotential: 95,
    interests: ['Bordeaux Grand Cru', 'Opera Garnier', 'Pan-African Salons', 'Haute Couture']
  },
  {
    id: 'gg-6',
    name: 'Victoria Vance-Astor',
    age: 26,
    city: 'NYC',
    country: 'United States',
    tier: 'GOLD',
    bio: 'Tribeca venture partner investing in African renewable infrastructure and fintech.',
    seeking: 'An intellectually sharp and chivalrous partner who wants both global impact and private peace.',
    wealthTier: '$22M Private Equity',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 8,
    matchPotential: 94,
    interests: ['Zero Bond', 'Hamptons Summer', 'Venture Capital', 'Classical Piano']
  },
  {
    id: 'gg-7',
    name: 'Isabella Moretti',
    age: 25,
    city: 'Milan',
    country: 'Italy',
    tier: 'DIAMOND',
    bio: 'Quadrilatero textile scion & Lake Como villa curator. Bespoke tailor connoisseur.',
    seeking: 'A tall, commanding African gentleman who carries bespoke suits like second nature.',
    wealthTier: '$30M Heritage Textiles',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 2,
    matchPotential: 98,
    interests: ['Lake Como Riva Boats', 'Brera Galleries', 'Bespoke Tailoring', 'Truffle Hunting']
  },
  {
    id: 'gg-8',
    name: 'Dr. Antoinette Vance',
    age: 28,
    city: 'London',
    country: 'United Kingdom',
    tier: 'ELITE',
    bio: 'Biotech longevity founder & classical pianist with residence in Kensington.',
    seeking: 'A visionary partner with high emotional intelligence and passion for world-changing feats.',
    wealthTier: '$28M Longevity Fund',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 11,
    matchPotential: 93,
    interests: ['Longevity Science', 'The Connaught', 'Afro-Fusion Gourmet', 'Cello']
  },
  {
    id: 'gg-9',
    name: 'Maya Al-Husayni',
    age: 24,
    city: 'Dubai',
    country: 'United Arab Emirates',
    tier: 'PLATINUM',
    bio: 'Seychelles eco-luxury resort architect and Arabian horse breeder.',
    seeking: 'A chivalrous king who combines worldly ambition with private devotion.',
    wealthTier: '$40M Island Real Estate',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 5,
    matchPotential: 96,
    interests: ['Island Architecture', 'Arabian Horses', 'Desert Falconry', 'Zuma Dining']
  },
  {
    id: 'gg-10',
    name: 'Charlotte De Montmirail',
    age: 26,
    city: 'Paris',
    country: 'France',
    tier: 'GOLD',
    bio: '5th Generation biodynamic vintner in Saint-Émilion. Passionate about African literature.',
    seeking: 'A deep thinker who loves fine dining, fireside philosophy, and grand adventures.',
    wealthTier: '$32M Grand Cru Estate',
    avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 9,
    matchPotential: 94,
    interests: ['Grand Cru Tasting', 'African Literature', 'Private Jet Charters', 'Ballet']
  },
  {
    id: 'gg-11',
    name: 'Tatiana Romanov-Sterling',
    age: 27,
    city: 'Monaco',
    country: 'Monaco',
    tier: 'DIAMOND',
    bio: 'Superyacht interior architect & gemologist. Regular at Yacht Club de Monaco.',
    seeking: 'A high-energy, generous man who loves Mediterranean summers and yacht life.',
    wealthTier: '$38M Marine Luxury',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 3,
    matchPotential: 97,
    interests: ['Monaco Yacht Club', 'Formula 1 VIP', 'Rare Diamonds', 'St. Tropez']
  },
  {
    id: 'gg-12',
    name: 'Tiwa Bankole',
    age: 25,
    city: 'Lagos',
    country: 'Nigeria',
    tier: 'PLATINUM',
    bio: 'Contemporary African art curator & private aviation executive in Eko Atlantic.',
    seeking: 'A commanding Black titan who desires an equal partner to conquer global capitals together.',
    wealthTier: '$20M Logistics & Art',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 7,
    matchPotential: 95,
    interests: ['Art X Lagos', 'Private Aviation', 'Ikoyi Club', 'London Dining']
  },
  {
    id: 'gg-13',
    name: 'Freja Møller-Eckhart',
    age: 24,
    city: 'London',
    country: 'United Kingdom',
    tier: 'GOLD',
    bio: 'Nordic clean energy heiress residing in Knightsbridge. Afrobeats festival regular.',
    seeking: 'A dynamic, high-vibe gentleman who knows how to lead and have supreme fun.',
    wealthTier: '$22M Clean Energy',
    avatarUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 14,
    matchPotential: 92,
    interests: ['Afrobeats Concerts', 'Sustainable Yachts', 'Knightsbridge Dining', 'Skiing']
  },
  {
    id: 'gg-14',
    name: 'Zahra Mansour',
    age: 26,
    city: 'Dubai',
    country: 'United Arab Emirates',
    tier: 'DIAMOND',
    bio: 'Palm Jumeirah luxury property investor & founder of private women-in-wealth salon.',
    seeking: 'An ambitious visionary who honors loyalty and treats his queen like sovereign royalty.',
    wealthTier: '$50M Real Estate',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 1,
    matchPotential: 99,
    interests: ['Palm Jumeirah', 'Supercars', 'Private Dining', 'Global Capital']
  },
  {
    id: 'gg-15',
    name: 'Elena Rostova-Cross',
    age: 28,
    city: 'Monaco',
    country: 'Monaco',
    tier: 'ELITE',
    bio: 'Swiss quantitative wealth manager & St. Moritz heli-skiing enthusiast.',
    seeking: 'A calm, protective partner who values privacy, discreet elegance, and genuine emotional warmth.',
    wealthTier: '$45M Hedge Fund',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 10,
    matchPotential: 95,
    interests: ['Heli-Skiing', 'Private Banking', 'Geneva Salons', 'African Charities']
  },
  {
    id: 'gg-16',
    name: 'Khadija Bello',
    age: 24,
    city: 'Lagos',
    country: 'Nigeria',
    tier: 'DIAMOND',
    bio: 'Banana Island tech investor & Oxford graduate. Afropolitan lifestyle advocate.',
    seeking: 'A world-class gentleman of integrity and ambition to build a generational empire with.',
    wealthTier: '$30M Telecom & Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    activeMinutesAgo: 2,
    matchPotential: 98,
    interests: ['Banana Island', 'Fintech', 'Art Auctions', 'Private Jets']
  }
];

const TICKER_ITEMS = [
  "Sophia from Dubai just joined the Private Circle",
  "James from London unlocked Diamond Girl Sienna",
  "3 high-value sisters approved in Lagos today",
  "Emma from Monaco viewed your silhouette",
  "Lady Genevieve matched with DIFC Founder (99% Synergy)",
  "Monaco Millionaire batch dropped 14 new verified profiles",
  "VIP member from Paris unlocked Private WhatsApp Concierge",
  "Zahra from Dubai sent encrypted introduction request"
];

interface LiveGirlsGalleryProps {
  onNavigate: (path: string) => void;
  title?: string;
  subtitle?: string;
  onOpenPaywall?: () => void;
}

export const LiveGirlsGallery: React.FC<LiveGirlsGalleryProps> = ({
  onNavigate,
  title = "Virtual Ghost Girls Live Showcase",
  subtitle = "Encrypted silhouettes of vetted rich girlfriends & European heiresses worldwide. Hover to unveil.",
  onOpenPaywall
}) => {
  const [girls, setGirls] = useState<GhostGirl[]>(LUXURY_GHOST_GIRLS);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [activeModalGirl, setActiveModalGirl] = useState<GhostGirl | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Sync real applications from Supabase/storage if available
  useEffect(() => {
    try {
      const realApps = getGirlApplications();
      if (realApps.length > 0) {
        const mappedReal: GhostGirl[] = realApps.slice(0, 8).map((app, i) => ({
          id: `real-${app.id || i}`,
          name: app.name,
          age: app.age || 25,
          city: app.city || 'Dubai',
          country: app.country || 'UAE',
          tier: i % 2 === 0 ? 'DIAMOND' : 'PLATINUM',
          bio: app.bio || 'Vetted RichConnect member seeking an ambitious sovereign king.',
          seeking: app.what_they_seek || 'A chivalrous, protective, high-earning gentleman of honor.',
          wealthTier: app.net_worth || 'High Earner ($500k+)',
          avatarUrl: app.image_url || LUXURY_GHOST_GIRLS[i % LUXURY_GHOST_GIRLS.length].avatarUrl,
          activeMinutesAgo: Math.floor(Math.random() * 8) + 1,
          matchPotential: 96 + (i % 4),
          interests: ['Travel', 'Luxury', 'Equestrian', 'Private Aviation']
        }));
        
        // Merge real applications with luxury ghost profiles
        setGirls([...mappedReal, ...LUXURY_GHOST_GIRLS.slice(mappedReal.length)]);
      }
    } catch (e) {
      console.warn('LiveGirlsGallery sync fallback:', e);
    }
  }, []);

  // Marquee Ticker Auto-Cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % TICKER_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-shuffle cards every 5 seconds (gentle subtle rotation if enabled)
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setGirls(prev => {
        if (prev.length < 2) return prev;
        const copy = [...prev];
        const first = copy.shift()!;
        copy.push(first);
        return copy;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const handleManualShuffle = () => {
    setGirls(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const filteredGirls = girls.filter(g => {
    const matchesTier = selectedTier === 'ALL' || g.tier === selectedTier;
    const matchesCity = selectedCity === 'ALL' || g.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesTier && matchesCity;
  });

  const getTierBadgeStyle = (tier: GhostGirl['tier']) => {
    switch (tier) {
      case 'DIAMOND':
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold shadow-lg shadow-amber-500/50 border border-amber-300 animate-pulse';
      case 'PLATINUM':
        return 'bg-gradient-to-r from-slate-200 via-cyan-200 to-slate-300 text-slate-950 font-bold shadow-md shadow-cyan-500/30 border border-cyan-300';
      case 'GOLD':
        return 'bg-amber-500/20 text-amber-300 border border-amber-400/80 font-bold shadow-sm';
      case 'ELITE':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/80 font-bold shadow-sm';
    }
  };

  return (
    <section className="relative w-full space-y-6">
      
      {/* Top Animated Counter Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d1222] via-[#141b2f] to-[#0a0f1d] border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                Live Ghost Girls Gallery
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                16 Vetted Queens Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Encrypted silhouettes. Faces veil-protected until unlocked by a verified member.
            </p>
          </div>
        </div>

        {/* Live Counter Widget */}
        <div className="flex items-center space-x-4 bg-black/60 px-4 py-2 rounded-xl border border-amber-500/20 text-xs font-mono">
          <div className="text-center">
            <span className="text-emerald-400 font-bold text-sm block">247</span>
            <span className="text-[10px] text-slate-400">Girls Online</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="text-center">
            <span className="text-amber-400 font-bold text-sm block">31</span>
            <span className="text-[10px] text-slate-400">Countries</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="text-center">
            <span className="text-cyan-300 font-bold text-sm block">1,203</span>
            <span className="text-[10px] text-slate-400">Millionaires Seeking</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Tier Filters */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto">
          {['ALL', 'DIAMOND', 'PLATINUM', 'GOLD', 'ELITE'].map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {['ALL', 'Monaco', 'Dubai', 'Lagos', 'London', 'Paris', 'NYC', 'Milan'].map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                selectedCity.toLowerCase() === city.toLowerCase()
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Controls: Manual Shuffle & Auto-rotate Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualShuffle}
            title="Shuffle Gallery"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 flex items-center space-x-1 cursor-pointer transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold hidden sm:inline">Shuffle</span>
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] border font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
              autoRotate 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRotate ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>{autoRotate ? 'Auto-Rotate ON' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 16 Luxury Ghost Girl Cards Grid */}
      <div 
        onMouseEnter={() => setAutoRotate(false)}
        onMouseLeave={() => setAutoRotate(true)}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {filteredGirls.slice(0, 16).map((girl, index) => (
          <div
            key={girl.id}
            onClick={() => setActiveModalGirl(girl)}
            className="group relative rounded-2xl overflow-hidden bg-[#0c101d] border border-amber-500/20 hover:border-amber-400/80 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 -translate-y-0 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container with Ghost Blur & Unblur Hover */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
              <img
                src={girl.avatarUrl}
                alt={girl.name}
                className="w-full h-full object-cover filter blur-[6px] group-hover:blur-[1px] scale-105 group-hover:scale-110 transition-all duration-700 brightness-90 group-hover:brightness-100"
              />

              {/* Ghost Silhouette Overlay & Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-black/40 to-black/20 group-hover:from-[#0c101d]/90 transition-all duration-500" />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-amber-200 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                {/* Glowing Class Badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase ${getTierBadgeStyle(girl.tier)}`}>
                  {girl.tier}
                </span>

                {/* City Tag */}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/75 backdrop-blur-md text-amber-200 border border-amber-500/30 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{girl.city}</span>
                </span>
              </div>

              {/* Live Pulsing Dot */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Now &bull; Active {girl.activeMinutesAgo}m ago</span>
              </div>

              {/* Ghost Lock Watermark in Center */}
              <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity pointer-events-none">
                <div className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-400 shadow-xl">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Card Content & Bio Teaser */}
            <div className="p-3.5 sm:p-4 space-y-2 bg-[#0c101d] flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-amber-300 transition-colors">
                    {girl.name}
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {girl.matchPotential}%
                  </span>
                </div>
                <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                  {girl.wealthTier}
                </div>
                
                {/* Bio snippet revealed on hover */}
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1.5 leading-relaxed italic">
                  "{girl.bio}"
                </p>
              </div>

              {/* Interests & CTA */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {girl.interests.slice(0, 2).map((interest, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {interest}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalGirl(girl);
                  }}
                  className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-[11px] flex items-center justify-center space-x-1 shadow-md shadow-amber-900/20 transition-all cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Unveil Ghost Profile</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Live Marquee Ticker */}
      <div className="overflow-hidden rounded-xl bg-[#080c18] border border-amber-500/20 py-2.5 px-4 flex items-center space-x-3 text-xs shadow-inner">
        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>LIVE WIRE</span>
        </span>
        <div className="flex-1 truncate font-medium text-slate-300 animate-fade-in key={tickerIndex}">
          &bull; {TICKER_ITEMS[tickerIndex]}
        </div>
        <button
          onClick={() => onNavigate('/join')}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold shrink-0 cursor-pointer"
        >
          Join Circle &rarr;
        </button>
      </div>

      {/* Unveil Modal */}
      {activeModalGirl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="luxury-card rounded-2xl max-w-lg w-full p-6 space-y-5 border border-amber-500/40 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${getTierBadgeStyle(activeModalGirl.tier)}`}>
                  {activeModalGirl.tier} GHOST PROFILE
                </span>
              </div>
              <button
                onClick={() => setActiveModalGirl(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar & Details */}
            <div className="flex items-start space-x-4">
              <div className="relative w-24 h-32 rounded-xl overflow-hidden shrink-0 border border-amber-500/50 shadow-lg">
                <img
                  src={activeModalGirl.avatarUrl}
                  alt={activeModalGirl.name}
                  className="w-full h-full object-cover filter blur-[2px] hover:blur-none transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 inset-x-0 text-center text-[9px] font-mono text-emerald-400 font-bold">
                  {activeModalGirl.matchPotential}% Match
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  {activeModalGirl.name}, {activeModalGirl.age}
                </h3>
                <div className="text-xs text-amber-300 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeModalGirl.city}, {activeModalGirl.country}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Wealth Bracket: <span className="text-white font-bold">{activeModalGirl.wealthTier}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 pt-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active {activeModalGirl.activeMinutesAgo} minutes ago in private salon</span>
                </div>
              </div>
            </div>

            {/* Dossier Teaser Quotes */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">About Her:</span>
                <p className="text-slate-200 mt-0.5 leading-relaxed italic">
                  "{activeModalGirl.bio}"
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">Seeking in a Partner:</span>
                <p className="text-amber-100 mt-0.5 leading-relaxed">
                  "{activeModalGirl.seeking}"
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Luxury Passions:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeModalGirl.interests.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-black/60 text-slate-300 border border-slate-800 text-[10px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-center">
                🔒 Full unblurred photo dossier, verified WhatsApp, and private concierge introduction available for Gold &amp; Diamond members.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setActiveModalGirl(null);
                    onNavigate('/join');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <span>Apply to Meet Her</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setActiveModalGirl(null);
                    if (onOpenPaywall) {
                      onOpenPaywall();
                    } else {
                      onNavigate('/pricing');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock for $99</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
