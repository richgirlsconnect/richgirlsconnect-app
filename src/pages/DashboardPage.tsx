import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Plane, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Kanban,
  Award,
  Crown,
  Building,
  Layers,
  PieChart,
  Bell,
  Tv,
  Flame,
  Radio,
  ShoppingBag,
  Search,
  CheckCircle2,
  Video,
  Eye,
  Globe2,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';
import { Girl, PipelineStage } from '../types';
import { LiveGirlsGallery } from '../components/LiveGirlsGallery';
import { WowFeaturesSection } from '../components/WowFeaturesSection';
import { SmartPaywallModal } from '../components/SmartPaywallModal';
import { getAllWatchProgress, setLastWatchedShowId, LoveShow } from '../lib/loveTvStorage';


interface DashboardPageProps {
  girls: Girl[];
  onNavigate: (path: string) => void;
  onOpenDeployModal: () => void;
  onOpenSupabaseModal: () => void;
  onSimulateAlert?: () => void;
  threshold?: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  girls,
  onNavigate,
  onOpenDeployModal,
  onOpenSupabaseModal,
  onSimulateAlert,
  threshold = 94,
}) => {
  // Compute Stats
  const totalFound = girls.length;
  const activeChats = girls.filter(g => g.stage === 'Chatting').length;
  const closeCount = girls.filter(g => g.stage === 'Close').length;
  const datingCount = girls.filter(g => g.stage === 'Dating').length;
  const visitPlannedCount = girls.filter(g => g.stage === 'Visit Planned').length;
  const partnerCount = girls.filter(g => g.stage === 'Partner').length;
  const explicitlyInterestedCount = girls.filter(g => g.public_likes_black_men).length;

  // VIP Tier Calculations: Presidential Suite vs Standard High-Net-Worth
  const presidentialCount = girls.filter(g => g.is_presidential_daughter === true).length;
  const standardCount = Math.max(0, totalFound - presidentialCount);
  const presidentialRatioPercent = totalFound > 0 ? Math.round((presidentialCount / totalFound) * 100) : 0;
  const standardRatioPercent = totalFound > 0 ? 100 - presidentialRatioPercent : 0;
  const ratioValue = presidentialCount > 0 ? (standardCount / presidentialCount).toFixed(1) : '0';

  const stages: { stage: PipelineStage; count: number; color: string }[] = [
    { stage: 'Found', count: girls.filter(g => g.stage === 'Found').length, color: 'text-slate-400 bg-slate-500/20' },
    { stage: 'Chatting', count: activeChats, color: 'text-sky-400 bg-sky-500/20' },
    { stage: 'Close', count: closeCount, color: 'text-amber-400 bg-amber-500/20' },
    { stage: 'Dating', count: datingCount, color: 'text-rose-400 bg-rose-500/20' },
    { stage: 'Visit Planned', count: visitPlannedCount, color: 'text-purple-400 bg-purple-500/20' },
    { stage: 'Partner', count: partnerCount, color: 'text-emerald-400 bg-emerald-500/20' },
  ];

  const topMatches = [...girls].sort((a, b) => b.match_score - a.match_score).slice(0, 3);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [activeNavCategory, setActiveNavCategory] = useState<'all' | 'shows' | 'dating' | 'scout' | 'vip'>('all');
  const [activeHomeSection, setActiveHomeSection] = useState<'all' | 'gallery' | 'pitches' | 'crm'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [continueWatchingList, setContinueWatchingList] = useState<ReturnType<typeof getAllWatchProgress>>([]);

  // Load active watch progress
  useEffect(() => {
    setContinueWatchingList(getAllWatchProgress());
  }, []);

  // Master Portal Hubs for effortless 1-click navigation across the entire ecosystem
  const PORTAL_HUBS = [
    {
      id: 'love-tv',
      title: 'Love TV™ Reality Show',
      category: 'shows',
      badge: 'LIVE NOW',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      icon: Tv,
      iconColor: 'text-rose-400 bg-rose-500/10',
      desc: 'Watch AI-generated reality episodes with 4K smooth streaming, audience cliffhangers & suggest storylines.',
      path: '/love-tv',
      actionText: 'Watch Live TV'
    },
    {
      id: 'love-channel',
      title: 'Our Love Channel',
      category: 'shows',
      badge: 'Couples Pro',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      icon: Heart,
      iconColor: 'text-pink-400 bg-pink-500/10',
      desc: 'Encrypted safe private couples channel with animated love story movies, 3D dream dates & Love Points vault.',
      path: '/love-channel',
      actionText: 'Open Channel'
    },
    {
      id: 'hunter',
      title: 'AI Girls Hunter & Live Radar',
      category: 'scout',
      badge: 'Autonomous',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Compass,
      iconColor: 'text-amber-400 bg-amber-500/10',
      desc: 'Autonomous 24/7 radar scouting rich girls across Monaco, Dubai, Paris & London with verified dossiers.',
      path: '/hunter',
      actionText: 'Launch Radar'
    },
    {
      id: 'swipe',
      title: 'Tinder-Style Swipe Deck',
      category: 'dating',
      badge: 'Intercultural',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      icon: Heart,
      iconColor: 'text-sky-400 bg-sky-500/10',
      desc: 'Swipe through verified high-net-worth heiresses & founders with audio icebreakers and compatibility filters.',
      path: '/swipe',
      actionText: 'Start Swiping'
    },
    {
      id: 'join',
      title: 'Join Sovereign Circle',
      category: 'dating',
      badge: '31 Countries',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Globe2,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      desc: 'Global discovery funnel where ambitious Queens discover Monaco millionaires and post Diamond Wishes.',
      path: '/join',
      actionText: 'Join Circle'
    },
    {
      id: 'pricing',
      title: 'Membership & Smart Paywall',
      category: 'vip',
      badge: 'Free to $99',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Sparkles,
      iconColor: 'text-purple-400 bg-purple-500/10',
      desc: 'Compare Gold Queen ($99) and Diamond Sovereign tiers, unlock unmasking tokens, and instant VIP upgrades.',
      path: '/pricing',
      actionText: 'View Plans'
    },
    {
      id: 'presidential',
      title: 'Presidential Suite',
      category: 'vip',
      badge: `${girls.filter(g => g.is_presidential_daughter).length} Verified`,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Award,
      iconColor: 'text-amber-400 bg-amber-500/10',
      desc: 'Verified daughters of former Heads of State with diplomatic protocol, sovereign family trusts & discrete courtship.',
      path: '/presidential',
      actionText: 'Access Suite'
    },
    {
      id: 'social-command',
      title: 'Viral Social Command',
      category: 'scout',
      badge: '50 Captions',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      icon: Flame,
      iconColor: 'text-red-400 bg-red-500/10',
      desc: '50 viral TikTok captions, visual 4-timeslot scheduler, and 9:16 vertical Instagram story generator with QR code.',
      path: '/admin/social-command',
      actionText: 'Command Center'
    },
    {
      id: 'client',
      title: 'Private Client Portal',
      category: 'vip',
      badge: 'Concierge',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      icon: Crown,
      iconColor: 'text-teal-400 bg-teal-500/10',
      desc: 'Private portal for verified male clients with curated match dossiers, date planning, and concierge chat.',
      path: '/client',
      actionText: 'Open Portal'
    },
    {
      id: 'marketplace',
      title: 'Digital Marketplace',
      category: 'vip',
      badge: 'Monetized',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: ShoppingBag,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      desc: 'Purchase Keep Love Alive guides, instant date vouchers, champagne gifts, and romantic digital assets.',
      path: '/marketplace',
      actionText: 'Visit Market'
    },
    {
      id: 'pipeline',
      title: 'CRM Dating Pipeline',
      category: 'dating',
      badge: `${girls.length} Dossiers`,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Kanban,
      iconColor: 'text-indigo-400 bg-indigo-500/10',
      desc: 'Track relationships across Found • Chatting • Dating • Visit Planned • Partner stages with notes.',
      path: '/pipeline',
      actionText: 'View Pipeline'
    },
    {
      id: 'matchmaking',
      title: 'Elite Matchmaking Intake',
      category: 'dating',
      badge: 'Mode 2 Agency',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: ShieldCheck,
      iconColor: 'text-amber-400 bg-amber-500/10',
      desc: 'Paid consultation onboarding ($5,000 - $25,000 retainer), private offline dossiers, and AI compatibility scoring.',
      path: '/matchmaking',
      actionText: 'Matchmaking Hub'
    }
  ];

  // Format seconds to mm:ss helper
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Filter hubs by both category tab and search query
  const filteredHubs = PORTAL_HUBS.filter(hub => {
    const matchesCategory = activeNavCategory === 'all' || hub.category === activeNavCategory;
    const matchesSearch = !searchQuery.trim() || 
      hub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.actionText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const latestContinueShow = continueWatchingList[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. TOP STATUS TICKER (Executive Real-Time Overview) */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0e121d] to-slate-900 border border-amber-500/30 text-xs">
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          <div 
            onClick={() => onNavigate('/love-tv')} 
            className="flex items-center space-x-1.5 cursor-pointer hover:underline text-rose-400 font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <Tv className="w-3.5 h-3.5" />
            <span>Love TV™ Live: Ep 14 Streaming</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">&bull;</span>

          <div 
            onClick={() => onNavigate('/hunter')} 
            className="flex items-center space-x-1.5 cursor-pointer hover:underline text-amber-300 font-medium"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Radar: 24/7 Autonomous Scout</span>
          </div>

          <span className="text-slate-600 hidden md:inline">&bull;</span>

          <div 
            onClick={() => onNavigate('/presidential')} 
            className="flex items-center space-x-1.5 cursor-pointer hover:underline text-amber-200 font-medium hidden md:flex"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Presidential Suite: {presidentialCount} Verified Sovereign</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Matchmaking Engine: 98.4% Compatibility</span>
        </div>
      </div>

      {/* 2. LUXURY HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/35 bg-gradient-to-r from-[#0d101a] via-[#141829] to-[#090b12] p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Monaco &bull; Dubai &bull; Lagos &bull; London &bull; Paris &bull; NYC</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white tracking-tight leading-tight">
            The World's First AI Matchmaking Empire Where <span className="gold-gradient-text">Rich Girls Find Their Dream Man</span> And Poor Girls Become Rich
          </h1>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium leading-relaxed max-w-3xl">
            "We are not Tinder. We are not OnlyFans. We are The Private Circle Where Monaco Millionaires Seek African Queens. 31 Countries. One Secret Door."
          </p>

          {/* Quick-Action Launch Buttons */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/love-tv')}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:brightness-110 text-white shadow-xl shadow-rose-900/40 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Tv className="w-4 h-4 text-amber-200" />
              <span>Watch Love TV™ Reality Show (Live) &rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('/swipe')}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/20 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Discover &amp; Swipe Deck</span>
            </button>

            <button
              onClick={() => onNavigate('/hunter')}
              className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>AI Girls Hunter &amp; Radar</span>
            </button>

            <button
              onClick={() => onNavigate('/presidential')}
              className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-amber-200 border border-amber-500/30 flex items-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Presidential Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CONTINUE WATCHING / FEATURED BROADCAST BANNER */}
      {latestContinueShow ? (
        /* User has a saved episode: Show Continue Watching Card with Exact Timestamp & Progress */
        <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-[#170a16] via-[#110c1c] to-[#07090e] p-5 shadow-2xl space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-amber-500/40 bg-black group">
                <img 
                  src={latestContinueShow.show.thumbnail_url} 
                  alt={latestContinueShow.show.title} 
                  className="w-full h-full object-cover" 
                />
                <div 
                  onClick={() => {
                    setLastWatchedShowId(latestContinueShow.showId);
                    onNavigate('/love-tv');
                  }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-[10px] uppercase flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>CONTINUE WATCHING</span>
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    Episode {latestContinueShow.show.episode_number}
                  </span>
                  <span className="text-amber-400 text-[11px] font-mono font-bold">
                    &bull; Paused at {formatTime(latestContinueShow.playheadSeconds)}
                  </span>
                </div>

                <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                  {latestContinueShow.show.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-1 max-w-xl">
                  {latestContinueShow.show.hook}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  setLastWatchedShowId(latestContinueShow.showId);
                  onNavigate('/love-tv');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/30 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume from {formatTime(latestContinueShow.playheadSeconds)} &rarr;</span>
              </button>

              <button
                onClick={() => onNavigate('/love-tv')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs cursor-pointer"
              >
                All Shows
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, Math.round((latestContinueShow.playheadSeconds / latestContinueShow.totalSeconds) * 100))}%` }} 
            />
          </div>
        </div>
      ) : (
        /* No saved paused video: Show Featured Live Episode */
        <div 
          onClick={() => onNavigate('/love-tv')}
          className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-[#1b0811] via-[#120a1c] to-[#07090e] p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-rose-400 transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 p-0.5 shadow-lg shadow-rose-950/60">
                <div className="w-full h-full bg-[#0d0713] rounded-[14px] flex items-center justify-center">
                  <Tv className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold text-[10px] uppercase">
                  AIRING NOW &bull; LOVE TV™
                </span>
                <span className="text-slate-400 text-[11px] font-mono">Episode 14 &bull; 4K Ultra HD</span>
                <span className="text-emerald-400 text-[11px] font-mono hidden sm:inline">&bull; 2,341 Watching Now</span>
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg group-hover:text-amber-300 transition-colors">
                From Lagos to Burj Al Arab: The Catamaran Cliffhanger
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                She wished for Dubai. 72 hours later, an oil magnate sent his private flight. Stream with smooth playback &amp; cast your cliffhanger vote.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
            <span className="text-xs font-bold text-amber-400 group-hover:underline flex items-center space-x-1">
              <span>Watch Live Episode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      )}

      {/* 4. MASTER NAVIGATION GATEWAY (Clean 1-Click Ecosystem Access with Instant Search) */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-white">
                Sovereign Navigation &amp; Feature Hubs
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Clean 1-click access to all live reality entertainment, AI scouting engines, and dating features.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 12 hubs (e.g. TV, Radar, Swipe)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center bg-black/60 rounded-xl p-1 border border-slate-800 text-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveNavCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeNavCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Portals ({PORTAL_HUBS.length})
          </button>
          <button
            onClick={() => setActiveNavCategory('shows')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeNavCategory === 'shows'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📺 Live Shows &amp; TV
          </button>
          <button
            onClick={() => setActiveNavCategory('dating')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeNavCategory === 'dating'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💘 Dating &amp; Match
          </button>
          <button
            onClick={() => setActiveNavCategory('scout')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeNavCategory === 'scout'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧭 AI Scouting &amp; Radar
          </button>
          <button
            onClick={() => setActiveNavCategory('vip')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeNavCategory === 'vip'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👑 VIP &amp; Sovereign
          </button>
        </div>


        {/* 12 Clean Hub Cards or Search Empty State */}
        {filteredHubs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
            <Search className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
            <p className="text-slate-300 text-sm">No hubs found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveNavCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
            >
              Reset Search &amp; Show All Portals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredHubs.map((hub) => {
              const HubIcon = hub.icon;
              return (
                <div
                  key={hub.id}
                  onClick={() => onNavigate(hub.path)}
                  className="luxury-card luxury-card-hover rounded-2xl p-5 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${hub.iconColor} border border-white/5`}>
                        <HubIcon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${hub.badgeColor}`}>
                        {hub.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                      {hub.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {hub.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:text-amber-300">
                    <span>{hub.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* ============================================================== */}
      {/* SECTION TABS FOR DEEPER EXPLORATION                            */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 uppercase font-mono font-bold tracking-wider">Display View:</span>
            <div className="flex items-center bg-black/60 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setActiveHomeSection('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeHomeSection === 'all' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Comprehensive View
              </button>
              <button
                onClick={() => setActiveHomeSection('gallery')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeHomeSection === 'gallery' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ghost Girls Showcase
              </button>
              <button
                onClick={() => setActiveHomeSection('pitches')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeHomeSection === 'pitches' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                5 Wow Features
              </button>
              <button
                onClick={() => setActiveHomeSection('crm')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeHomeSection === 'crm' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                CRM Intelligence
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: VIRTUAL GHOST GIRLS LIVE SHOWCASE */}
        {(activeHomeSection === 'all' || activeHomeSection === 'gallery') && (
          <LiveGirlsGallery 
            onNavigate={onNavigate} 
            onOpenPaywall={() => setIsPaywallOpen(true)} 
          />
        )}

        {/* SECTION 2: 5 MIND-BLOWING WOW PITCHES & NEVER-SEEN FEATURES */}
        {(activeHomeSection === 'all' || activeHomeSection === 'pitches') && (
          <WowFeaturesSection 
            onNavigate={onNavigate} 
            onOpenPaywall={() => setIsPaywallOpen(true)} 
          />
        )}
      </div>

      {/* SMART PAYWALL MODAL */}
      <SmartPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onNavigate={onNavigate}
        targetFeature="Monaco Millionaire Unveil"
      />

      {/* Mode 2: Elite Private Matchmaking Feature Callout */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#0c0f1a] via-[#101424] to-[#0c0f1a] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white text-base">
                Mode 2: Elite Private Matchmaking Agency
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                New Feature
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Paid consultation intakes via Paystack/Stripe, private non-browsable dossiers (<code>is_public = false</code>), Gemini AI compatibility scoring, manual matchmaker approvals, and monitored 1-on-1 chats.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('/matchmaking')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 cursor-pointer shadow-sm"
          >
            Landing (/matchmaking)
          </button>
          <button
            onClick={() => onNavigate('/apply')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
          >
            Form (/apply)
          </button>
          <button
            onClick={() => onNavigate('/admin/clients')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
          >
            Clients
          </button>
          <button
            onClick={() => onNavigate('/admin/matches')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
          >
            Matches
          </button>
          <button
            onClick={() => onNavigate('/admin/chats')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
          >
            Chats
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Found */}
        <div 
          onClick={() => onNavigate('/finder')}
          className="luxury-card luxury-card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Profiles</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif-luxury text-slate-100">{totalFound}</div>
          <div className="mt-2 flex items-center text-xs text-amber-400/90 space-x-1">
            <span>{explicitlyInterestedCount} verified interest in Black men</span>
          </div>
        </div>

        {/* Active Chats */}
        <div 
          onClick={() => onNavigate('/inbox')}
          className="luxury-card luxury-card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Chats</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif-luxury text-slate-100">{activeChats}</div>
          <div className="mt-2 text-xs text-slate-400">
            AI Wingman active with memory
          </div>
        </div>

        {/* Dating / Close */}
        <div 
          onClick={() => onNavigate('/pipeline')}
          className="luxury-card luxury-card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Close & Dating</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif-luxury text-slate-100">{closeCount + datingCount}</div>
          <div className="mt-2 text-xs text-rose-300/80">
            {datingCount} in courtship, {closeCount} near close
          </div>
        </div>

        {/* Visit Planned & Partners */}
        <div 
          onClick={() => onNavigate('/pipeline')}
          className="luxury-card luxury-card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Trips & Partners</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif-luxury text-slate-100">{visitPlannedCount + partnerCount}</div>
          <div className="mt-2 text-xs text-purple-300/80">
            {visitPlannedCount} visits scheduled, {partnerCount} partner
          </div>
        </div>

      </div>

      {/* Dedicated VIP Tier Widget: High-Net-Worth Distribution */}
      <div className="luxury-card rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-amber-500/30 shadow-xl">
        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <PieChart className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-slate-100 flex items-center space-x-2">
                  <span>VIP Tier Distribution</span>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                    HNW Segmentation
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Comparative distribution of Sovereign Presidential Dynasties versus Standard Ultra-High-Net-Worth heiresses & founders.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-amber-300 font-semibold shadow-inner">
                Ratio: 1 : {ratioValue} (Sovereign to Standard)
              </span>
            </div>
          </div>

          {/* Visual Ratio Distribution Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2 text-amber-300">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Presidential Suite ({presidentialRatioPercent}%)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Standard HNW Matches ({standardRatioPercent}%)</span>
              </div>
            </div>

            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner flex">
              {/* Presidential Segment */}
              <div 
                className="h-full rounded-l-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-sm transition-all duration-500"
                style={{ width: `${Math.max(5, presidentialRatioPercent)}%` }}
                title={`Presidential Suite: ${presidentialCount} entries (${presidentialRatioPercent}%)`}
              />
              {/* Standard Segment */}
              <div 
                className="h-full rounded-r-full bg-gradient-to-r from-slate-700 via-slate-600 to-amber-900/60 shadow-sm transition-all duration-500"
                style={{ width: `${Math.max(5, standardRatioPercent)}%` }}
                title={`Standard HNW: ${standardCount} entries (${standardRatioPercent}%)`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
              <span>{presidentialCount} Sovereign First Daughters</span>
              <span>{standardCount} Verified Heiresses & Founders</span>
            </div>
          </div>

          {/* Comparative Tier Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Presidential Suite Tier Card */}
            <div 
              onClick={() => onNavigate('/presidential')}
              className="p-4 sm:p-5 rounded-xl border border-amber-500/35 bg-gradient-to-br from-amber-950/20 via-[#0d0f17] to-black/60 hover:border-amber-400 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif-luxury font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      Presidential Sovereign Suite
                    </h3>
                    <span className="text-[10px] text-amber-400/90 font-medium">
                      Tier 1 • Head of State Lineage
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-serif-luxury text-amber-300 block">
                    {presidentialCount}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({presidentialRatioPercent}% of CRM)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-amber-500/15">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Net Worth Tier:</span>
                  <span className="text-amber-200 font-semibold">$30M – $100M+ (Sovereign Assets)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Verification:</span>
                  <span className="text-emerald-400 font-medium">Palace Quarters & Diplomatic Escort</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Direct Channel:</span>
                  <span className="text-slate-200 font-medium">Encrypted WhatsApp Connected</span>
                </div>
              </div>

              <div className="mt-3.5 pt-2 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Access Sovereign Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Standard High-Net-Worth Tier Card */}
            <div 
              onClick={() => onNavigate('/finder')}
              className="p-4 sm:p-5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:border-slate-500 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif-luxury font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                      Standard High-Net-Worth
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Tier 2 • Private Wealth & Heiresses
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-serif-luxury text-slate-200 block">
                    {standardCount}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({standardRatioPercent}% of CRM)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Net Worth Tier:</span>
                  <span className="text-slate-200 font-semibold">$5M – $35M (Private Equity / Trust)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Verification:</span>
                  <span className="text-amber-300 font-medium">Public Preference for Black Men</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Direct Channel:</span>
                  <span className="text-slate-200 font-medium">Curated Instagram & CRM Chat</span>
                </div>
              </div>

              <div className="mt-3.5 pt-2 flex items-center justify-between text-xs text-slate-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Filter Standard Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Dating Pipeline Breakdown */}
      <div className="luxury-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-serif-luxury font-bold text-slate-100">
              Dating Stage Distribution
            </h2>
            <p className="text-xs text-slate-400">
              Progression pipeline across all {totalFound} tracked relationships
            </p>
          </div>
          <button
            onClick={() => onNavigate('/pipeline')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((item) => (
            <div 
              key={item.stage}
              onClick={() => onNavigate('/pipeline')}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all cursor-pointer"
            >
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {item.stage}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold font-serif-luxury text-slate-100">
                  {item.count}
                </span>
                <span className="text-[10px] text-slate-500">
                  ({Math.round((item.count / (totalFound || 1)) * 100)}%)
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${(item.count / (totalFound || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Priority Matches Showcase */}
      <div className="luxury-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-serif-luxury font-bold text-slate-100 flex items-center space-x-2">
              <span>Top Alignment Matches</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Verified Interest
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Highest scoring profiles based on lifestyle, cultural harmony, and public interest
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {onSimulateAlert && (
              <button
                onClick={onSimulateAlert}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-sm"
                title={`Trigger New Match Toast Alert for profiles in Found stage meeting ≥${threshold || 94}%`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Match Alert (≥{threshold || 94}%)</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('/finder')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
            >
              <span>See All {totalFound}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topMatches.map((girl) => (
            <div
              key={girl.id}
              className="rounded-xl border border-amber-500/20 bg-slate-900/70 p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={girl.avatar_url}
                    alt={girl.name}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-100 text-sm truncate">
                        {girl.name}, {girl.age}
                      </h3>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {girl.match_score}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {girl.location} • {girl.ethnicity}
                    </div>
                    <a
                      href={`https://instagram.com/${girl.ig.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <span>{girl.ig}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/10 text-xs text-slate-300 mb-3">
                  <p className="font-semibold text-amber-300 text-[11px] mb-0.5">Match Reason:</p>
                  <p className="line-clamp-2 text-slate-300 text-[11px]">
                    {girl.match_reason}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {girl.stage}
                </span>
                <div className="flex items-center space-x-1.5">
                  {(girl.whatsapp || girl.presidential_details?.whatsapp) && (
                    <a
                      href={`https://wa.me/${(girl.whatsapp || girl.presidential_details?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${girl.name}, I connected with you on RichConnect!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold px-2 py-1 rounded-lg whatsapp-action-btn flex items-center space-x-1"
                      title={`Open WhatsApp chat with ${girl.name}`}
                    >
                      <MessageCircle className="w-3 h-3 fill-white" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <button
                    onClick={() => onNavigate(`/girls/${girl.id}`)}
                    className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                  >
                    Dossier
                  </button>
                  <button
                    onClick={() => onNavigate(`/inbox/${girl.id}`)}
                    className="text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical & Security Guarantee Footer */}
      <div className="rounded-xl border border-slate-800 bg-[#0a0d14]/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Strict Privacy & Consent Standard: No automated scraping. All profiles curated via public statements or manual links.
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={onOpenSupabaseModal}
            className="text-slate-300 hover:text-amber-300 underline"
          >
            Supabase DB Config
          </button>
          <span>•</span>
          <button 
            onClick={onOpenDeployModal}
            className="text-amber-400 hover:text-amber-300 underline"
          >
            Vercel Free Tier Instructions
          </button>
        </div>
      </div>

    </div>
  );
};
