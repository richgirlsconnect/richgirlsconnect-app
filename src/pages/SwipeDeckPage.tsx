import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Compass, 
  MessageSquare, 
  Video, 
  Filter, 
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  MessageCircle
} from 'lucide-react';

interface CandidateProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  photos: string[];
  wealthTier: string;
  netWorth: string;
  occupation: string;
  industry: string;
  bio: string;
  partnerPreference: string;
  whatTheyWant: string;
  passions: string[];
  compatibilityScore: number;
  matchmakerReason: string;
  verified: boolean;
  whatsapp: string;
}

const CANDIDATES_POOL: CandidateProfile[] = [
  {
    id: 'c-01',
    name: 'Genevieve Laurent',
    age: 27,
    location: 'Paris & Monaco',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$25M+ Heir',
    netWorth: 'Family Office (~$45M)',
    occupation: 'Contemporary Art Curator',
    industry: 'Fine Arts & Philanthropy',
    bio: 'Art historian splitting my seasons between Saint-Germain-des-Prés and Cap d’Antibes. Passionate about neo-expressionist sculpture, vintage horology, and high-altitude skiing.',
    partnerPreference: 'Cultured founder or financier who commands quiet authority and genuine intellectual curiosity.',
    whatTheyWant: 'Deep romantic resonance, cultural exploration, and building a multi-generational legacy.',
    passions: ['Art Basel', 'Classical Piano', 'Alpine Heliskiing', 'Venice Biennale'],
    compatibilityScore: 96,
    matchmakerReason: 'Matchmaker Agent: High semantic convergence on art curation, Mayfair dining, and shared philanthropic governance.',
    verified: true,
    whatsapp: '+33612345678'
  },
  {
    id: 'c-02',
    name: 'Dr. Sophia Van Der Bilt',
    age: 29,
    location: 'Geneva & London',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: 'Presidential ($50M+)',
    netWorth: 'Generational Trust ($60M)',
    occupation: 'Neurotech Investor & Equestrian',
    industry: 'Biotech Venture Capital',
    bio: 'Former clinical neuroscience researcher now backing early-stage longevity biotech. Competitive show jumper. I appreciate understated luxury, bespoke tailoring, and crisp mountain mornings in Gstaad.',
    partnerPreference: 'Visionary entrepreneur or partner with profound emotional maturity and unshakeable ethics.',
    whatTheyWant: 'A true life partner for global adventures, mutual intellectual expansion, and marriage.',
    passions: ['Show Jumping', 'Longevity Research', 'Superyacht Regattas', 'Classical Opera'],
    compatibilityScore: 94,
    matchmakerReason: 'Matchmaker Agent: Complementary analytical mindsets, mutual passion for equestrian sports and high-discretion European lifestyle.',
    verified: true,
    whatsapp: '+41791234567'
  },
  {
    id: 'c-03',
    name: 'Victoria De La Tour',
    age: 26,
    location: 'Milan & St. Moritz',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$30M+ Private',
    netWorth: 'Luxury Hospitality Group',
    occupation: 'Creative Director',
    industry: 'Haute Horlogerie & Design',
    bio: 'Leading heritage restoration for private villas across Lake Como and Tuscany. Fluent in Italian, French, and English. Weekends in Engadin valley.',
    partnerPreference: 'Sophisticated gentleman with high EQ, global perspective, and love for architecture.',
    whatTheyWant: 'Monogamous committed partnership leading to marriage and family.',
    passions: ['Heritage Architecture', 'Truffle Hunting', 'Winery Preservation', 'Sailing'],
    compatibilityScore: 92,
    matchmakerReason: 'Matchmaker Agent: Strong lifestyle synchronization with Mediterranean summering and private club traditions.',
    verified: true,
    whatsapp: '+39028912345'
  },
  {
    id: 'c-04',
    name: 'Camille Du Pont',
    age: 28,
    location: 'Zurich & New York',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$40M+ Tech & Real Estate',
    netWorth: 'Private Equity Principal',
    occupation: 'Managing Partner',
    industry: 'Cross-Border M&A',
    bio: 'Advising transatlantic sustainable infrastructure. Avid polo player and classical cellist. Believes true wealth is time freedom and deeply aligned companionship.',
    partnerPreference: 'A partner whose ambition matches my own, but who values quiet evenings and deep intimacy.',
    whatTheyWant: 'Committed relationship, shared angel co-investments, and a peaceful home sanctuary.',
    passions: ['Polo Club', 'Classical Cello', 'Vintage Cars', 'Philanthropic Galas'],
    compatibilityScore: 97,
    matchmakerReason: 'Matchmaker Agent: Peak compatibility across financial sophistication, cultural fluency, and mutual investment alignment.',
    verified: true,
    whatsapp: '+41221234567'
  },
  {
    id: 'c-05',
    name: 'Lady Alexandra Moreau',
    age: 26,
    location: 'Paris & Geneva',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: 'Presidential Daughter ($45M+)',
    netWorth: 'Élysée Sovereign Estate',
    occupation: 'Cultural Foundation Director',
    industry: 'Diplomacy & International Arts',
    bio: 'Raised in presidential quarters; director of Franco-African cultural initiatives. Passionate about Afrobeats, classical cello, and finding a sovereign-minded gentleman away from political games.',
    partnerPreference: 'A protective, chivalrous Black king who values loyalty, discretion, and mutual emotional devotion.',
    whatTheyWant: 'Exclusive romantic courtship leading to sovereign union and family.',
    passions: ['Franco-African Galas', 'Cello Recitals', 'Bordeaux Auctions', 'Afrobeats Playlists'],
    compatibilityScore: 99,
    matchmakerReason: 'Matchmaker Agent: Exceptional cultural resonance, presidential protocol accreditation, and shared global outlook.',
    verified: true,
    whatsapp: '+33689421102'
  },
  {
    id: 'c-06',
    name: 'Zara Sterling-Adeyemi',
    age: 29,
    location: 'Lagos & London',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$26M+ Tech & Hospitality',
    netWorth: 'Fintech Founder & Resort Developer',
    occupation: 'Managing Director',
    industry: 'Cross-Border Capital',
    bio: 'Splitting time between Victoria Island (Ikoyi) and Mayfair. Passionate about contemporary Nigerian art, Afrobeats concerts, and high-stakes entrepreneurship.',
    partnerPreference: 'A charismatic, driven Black gentleman who commands respect and cherishes true romance.',
    whatTheyWant: 'Power couple dynamic, shared investment empire, and deep mutual loyalty.',
    passions: ['Victoria Island Regattas', 'Afrobeats Festivals', 'Art x Lagos', 'Mayfair Dining'],
    compatibilityScore: 98,
    matchmakerReason: 'Matchmaker Agent: Flawless alignment across London-Lagos lifestyle axis, high entrepreneurial drive, and cultural celebration.',
    verified: true,
    whatsapp: '+2348123456789'
  },
  {
    id: 'c-07',
    name: 'Dr. Natalie Dupont',
    age: 29,
    location: 'Monaco & Cannes',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$22M+ Healthcare',
    netWorth: 'Longevity Clinic Founder',
    occupation: 'Aesthetic Surgeon',
    industry: 'Regenerative Medicine',
    bio: 'Founder of private medical institute overlooking Port Hercules. Equestrian rider, jazz lover, and drawn to confident men of purpose.',
    partnerPreference: 'A calm, confident gentleman with unwavering ethics and refined manners.',
    whatTheyWant: 'Long-term committed partnership and tranquil European life.',
    passions: ['Monaco Yacht Club', 'Longevity Science', 'Riviera Jazz', 'Show Jumping'],
    compatibilityScore: 95,
    matchmakerReason: 'Matchmaker Agent: High harmony on emotional maturity, discreet luxury, and Mediterranean weekend escapes.',
    verified: true,
    whatsapp: '+33678901234'
  },
  {
    id: 'c-08',
    name: 'Maya Al-Mansoor',
    age: 28,
    location: 'Dubai & Abu Dhabi',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$35M+ Sovereign Wealth',
    netWorth: 'Family Investment Office',
    occupation: 'Private Equity Strategist',
    industry: 'Cross-Border Infrastructure',
    bio: 'Overseeing global technology investments across the GCC and Europe. Attracted to visionary African tech leaders who value honor, chivalry, and elegance.',
    partnerPreference: 'An ambitious gentleman who moves with dignity and makes his partner feel cherished.',
    whatTheyWant: 'Monogamous marriage, mutual respect, and family legacy.',
    passions: ['Falconry & Desert Safaris', 'Louvre Abu Dhabi', 'Supercars', 'Private Aviation'],
    compatibilityScore: 97,
    matchmakerReason: 'Matchmaker Agent: Deep alignment on sovereign investment stature, traditional respect, and international mobility.',
    verified: true,
    whatsapp: '+971529881122'
  },
  {
    id: 'c-09',
    name: 'Countess Vivienne von Habsburg',
    age: 28,
    location: 'Vienna & Salzburg',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: 'Aristocratic ($40M+)',
    netWorth: 'Central European Heritage Trust',
    occupation: 'Concert Pianist & Heritage Patron',
    industry: 'Classical Arts & Estate Management',
    bio: 'Touring European philharmonic concert halls; keeper of our family heritage castle in Lower Austria. Fascinated by contemporary African literature and jazz.',
    partnerPreference: 'An articulate, emotionally grounded Black king with intellectual curiosity and chivalry.',
    whatTheyWant: 'Lifelong romance, shared cultural expeditions, and a home filled with music and peace.',
    passions: ['Vienna Opera Ball', 'Alpine Chalets', 'Steinway Grand Piano', 'Literary Salons'],
    compatibilityScore: 96,
    matchmakerReason: 'Matchmaker Agent: Exceptional cultural elevation, musical resonance, and shared appreciation for high-discretion European tradition.',
    verified: true,
    whatsapp: '+436761234567'
  },
  {
    id: 'c-10',
    name: 'Scarlett Sinclair',
    age: 26,
    location: 'Miami & New York',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$10M+ Tech',
    netWorth: 'Biotech Venture Angel',
    occupation: 'Managing Partner',
    industry: 'Applied AI & Bioengineering',
    bio: 'Former Ivy League athlete and active angel investor. Unapologetically attracted to tall, ambitious Black kings with vision, humor, and drive.',
    partnerPreference: 'A high-energy founder or executive who knows how to lead and have authentic fun.',
    whatTheyWant: 'Exclusive dating leading to committed power partnership.',
    passions: ['Hamptons Weekends', 'Superyacht Charters', 'Formula 1', 'Biohacking'],
    compatibilityScore: 97,
    matchmakerReason: 'Matchmaker Agent: High physical and intellectual attraction metrics; active advocate for intercultural power couples.',
    verified: true,
    whatsapp: '+13055550143'
  },
  {
    id: 'c-11',
    name: 'Sienna O’Connor',
    age: 27,
    location: 'London & Dublin',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$16M+ Heritage',
    netWorth: 'Distillery Estate & Equestrian Group',
    occupation: 'Brand Director',
    industry: 'Luxury Spirits & Equestrian',
    bio: 'Competitive jumper and brand director for single malt distillery. Knightsbridge based. Looking for a confident man who treats his partner like a queen.',
    partnerPreference: 'A gentleman who values tradition, chivalry, and good hearty laughter over vintage spirits.',
    whatTheyWant: 'Monogamous marriage and building a warm family estate.',
    passions: ['Show Jumping', 'Country Estates', 'Knightsbridge Dining', 'Polo Matches'],
    compatibilityScore: 93,
    matchmakerReason: 'Matchmaker Agent: Strong values parity, respect for athletic discipline and traditional romantic courtship.',
    verified: true,
    whatsapp: '+447822991100'
  },
  {
    id: 'c-12',
    name: 'Isabelle Laroche',
    age: 28,
    location: 'Bordeaux & Paris',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    ],
    wealthTier: '$32M+ Estate',
    netWorth: 'Grand Cru Vineyard Estate',
    occupation: 'Proprietor & Sommelier',
    industry: 'Fine Wine & Viticulture',
    bio: 'Managing our 4th-generation château in Saint-Émilion. Love spontaneous private flights, culinary exploration, and deep romance with a man of integrity.',
    partnerPreference: 'A chivalrous, mature Black gentleman who leads with honor and warm affection.',
    whatTheyWant: 'A loving, grounded marriage and shared adventures worldwide.',
    passions: ['Vintage Oenology', 'Michelin Gastronomy', 'Helicopter Tours', 'Contemporary Art'],
    compatibilityScore: 95,
    matchmakerReason: 'Matchmaker Agent: High aesthetic alignment, relaxed pace of luxury living, and appreciation for fine dining.',
    verified: true,
    whatsapp: '+33655443322'
  }
];

interface SwipeDeckPageProps {
  onNavigate: (path: string) => void;
}

export const SwipeDeckPage: React.FC<SwipeDeckPageProps> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>(CANDIDATES_POOL);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [matchCelebration, setMatchCelebration] = useState<CandidateProfile | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'presidential' | 'europe'>('all');

  const currentProfile = candidates[currentIndex];

  const handleSwipe = async (action: 'like' | 'pass' | 'superlike') => {
    if (!currentProfile) return;

    setLastAction(action);

    // Call swipe API in backend
    try {
      await fetch('/api/swipe/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-vip-001',
          targetId: currentProfile.id,
          action
        })
      });
    } catch {
      // Graceful offline fallback
    }

    if (action === 'like' || action === 'superlike') {
      // Trigger instant match celebration for rich profiles
      setMatchCelebration(currentProfile);
    } else {
      advanceDeck();
    }
  };

  const advanceDeck = () => {
    setCurrentIndex(prev => prev + 1);
    setCurrentPhotoIndex(0);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setCurrentPhotoIndex(0);
    setMatchCelebration(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0d111c] via-[#121727] to-[#0d111c] border border-amber-500/20 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Elite Discover &amp; Swipe Deck
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                Autonomous AI Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated by the <strong className="text-amber-300">Matchmaker Agent</strong> using high-dimensional lifestyle and wealth embeddings.
            </p>
          </div>
        </div>

        {/* Quick Agent Telemetry Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate('/agents')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center space-x-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Agent Status: 3 Online</span>
          </button>
          <button
            onClick={() => onNavigate('/video-call')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-all"
          >
            <Video className="w-4 h-4 text-amber-400" />
            <span>VIP Video Suite</span>
          </button>
        </div>
      </div>

      {/* Main Card Viewport */}
      {currentProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Swipe Card */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full relative rounded-3xl overflow-hidden bg-[#0c101a] border border-amber-500/30 shadow-2xl group">
              {/* Photo Viewport */}
              <div className="relative h-[480px] sm:h-[540px] w-full overflow-hidden bg-slate-950">
                <img
                  src={currentProfile.photos[currentPhotoIndex] || currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/30 to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-[11px] font-bold text-amber-300 flex items-center space-x-1 shadow-md">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentProfile.wealthTier}</span>
                    </span>
                    {currentProfile.verified && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center space-x-1 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ID &amp; Wealth Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Compatibility Score Pill */}
                  <div className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-lg shadow-amber-500/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentProfile.compatibilityScore}% Match</span>
                  </div>
                </div>

                {/* Photo Carousel Indicators */}
                {currentProfile.photos.length > 1 && (
                  <div className="absolute top-16 inset-x-4 flex space-x-1.5 z-10">
                    {currentProfile.photos.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                          idx === currentPhotoIndex ? 'bg-amber-400' : 'bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Bottom Card Identity Details */}
                <div className="absolute bottom-4 inset-x-5 text-white space-y-2">
                  <div className="flex items-baseline space-x-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {currentProfile.name}
                    </h2>
                    <span className="text-xl font-light text-slate-300">{currentProfile.age}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentProfile.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentProfile.occupation}</span>
                    </span>
                  </div>

                  {/* Matchmaker AI Agent Highlight */}
                  <div className="p-3 rounded-xl bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start space-x-2 mt-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>{currentProfile.matchmakerReason}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="p-4 bg-[#090d16] border-t border-amber-500/20 flex items-center justify-around">
                {/* Pass (Swipe Left) */}
                <button
                  onClick={() => handleSwipe('pass')}
                  className="w-14 h-14 rounded-full bg-slate-900 border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg cursor-pointer"
                  title="Pass (Left Arrow)"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Superlike */}
                <button
                  onClick={() => handleSwipe('superlike')}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400 text-amber-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg cursor-pointer"
                  title="Superlike (Up Arrow)"
                >
                  <Crown className="w-5 h-5 text-amber-400" />
                </button>

                {/* Connect / Like (Swipe Right) */}
                <button
                  onClick={() => handleSwipe('like')}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
                  title="Connect (Right Arrow)"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>

            {/* Quick Keyboard Hint */}
            <div className="mt-3 flex items-center justify-center space-x-4 text-[11px] text-slate-500">
              <span>← Pass</span>
              <span>↑ Superlike</span>
              <span>→ Connect</span>
            </div>
          </div>

          {/* Right Column: Full Confidential Dossier */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-amber-500/20 bg-[#0c101a] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Vetted Dossier &amp; Passions</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Private Non-Indexable
                </span>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  About Her
                </label>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {currentProfile.bio}
                </p>
              </div>

              {/* What She Is Seeking */}
              <div>
                <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Partner Preference &amp; Intentions
                </label>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {currentProfile.partnerPreference}
                </p>
              </div>

              {/* Wealth & Industry Overview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Net Worth Est.</span>
                  <span className="text-xs font-bold text-amber-300 mt-0.5 block">{currentProfile.netWorth}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Industry</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">{currentProfile.industry}</span>
                </div>
              </div>

              {/* Lifestyle Passions */}
              <div>
                <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Lifestyle &amp; Co-Interests
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.passions.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Concierge Wingman Callout */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-blue-300 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Concierge Agent Wingman Tip</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Mention {currentProfile.passions[0]} or reference private travel to {currentProfile.location.split('&')[0]} in your initial message for optimal resonance.
                </p>
              </div>

              {/* Direct External WhatsApp Channel Button */}
              {currentProfile.whatsapp && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${currentProfile.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${currentProfile.name}, I discovered your profile on RichConnect!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl whatsapp-action-btn flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all"
                    title={`Open external WhatsApp chat with ${currentProfile.name}`}
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat Directly on WhatsApp ({currentProfile.whatsapp})</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* End of Candidates Deck State */
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c101a] p-12 text-center max-w-xl mx-auto space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Daily Candidates Reviewed</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The <strong>Autonomous Matchmaker Agent</strong> runs every 30 minutes to analyze new submissions, verify wealth criteria, and recalculate embeddings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={resetDeck}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Deck Again</span>
            </button>
            <button
              onClick={() => onNavigate('/agents')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>View Matchmaker Agent Logs</span>
            </button>
          </div>
        </div>
      )}

      {/* Mutual Match Celebration Modal */}
      {matchCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-gradient-to-b from-[#0e1322] via-[#0b0e17] to-[#07090f] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500" />

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-amber-500/40 animate-bounce">
              <Crown className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                Mutual Concierge Approval
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                It's an Elite Match!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You and <strong className="text-amber-300">{matchCelebration.name}</strong> both expressed high mutual compatibility ({matchCelebration.compatibilityScore}%).
              </p>
            </div>

            {/* Side-by-side Avatars */}
            <div className="flex items-center justify-center space-x-4 py-2">
              <div className="w-20 h-20 rounded-2xl border-2 border-amber-400 overflow-hidden shadow-lg shadow-amber-500/20">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div className="w-20 h-20 rounded-2xl border-2 border-amber-400 overflow-hidden shadow-lg shadow-amber-500/20">
                <img
                  src={matchCelebration.avatar}
                  alt={matchCelebration.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Direct External WhatsApp Chat */}
              {matchCelebration.whatsapp && (
                <a
                  href={`https://wa.me/${matchCelebration.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${matchCelebration.name}, it's an elite match on RichConnect!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl whatsapp-action-btn text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat Directly on WhatsApp ({matchCelebration.whatsapp})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              )}

              <button
                onClick={() => {
                  setMatchCelebration(null);
                  advanceDeck();
                  onNavigate('/chat/match-celebration-101');
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open In-App Private Chat</span>
              </button>

              <button
                onClick={() => {
                  setMatchCelebration(null);
                  advanceDeck();
                  onNavigate('/video-call');
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>Invite to VIP Encrypted Video Call</span>
              </button>

              <button
                onClick={() => {
                  setMatchCelebration(null);
                  advanceDeck();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Keep Exploring Discover Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
