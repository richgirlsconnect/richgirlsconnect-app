import React, { useState } from 'react';
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
  Bell
} from 'lucide-react';
import { Girl, PipelineStage } from '../types';
import { LiveGirlsGallery } from '../components/LiveGirlsGallery';
import { WowFeaturesSection } from '../components/WowFeaturesSection';
import { SmartPaywallModal } from '../components/SmartPaywallModal';

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

  return (
    <div className="space-y-12 pb-16">
      
      {/* Luxury Welcome Hero */}
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

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/join')}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 shadow-xl shadow-amber-500/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Join Sovereign Circle (Girls &amp; Queens) &rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('/pricing')}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore Membership Plans &bull; Free $0 / $99</span>
            </button>

            <button
              onClick={() => onNavigate('/presidential')}
              className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Presidential Suite ({girls.filter(g => g.is_presidential_daughter).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* PART 1: VIRTUAL GHOST GIRLS LIVE SHOWCASE */}
      <LiveGirlsGallery 
        onNavigate={onNavigate} 
        onOpenPaywall={() => setIsPaywallOpen(true)} 
      />

      {/* PART 2: 5 MIND-BLOWING WOW PITCHES & NEVER-SEEN FEATURES */}
      <WowFeaturesSection 
        onNavigate={onNavigate} 
        onOpenPaywall={() => setIsPaywallOpen(true)} 
      />

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
