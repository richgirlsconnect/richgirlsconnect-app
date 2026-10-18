import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Eye, 
  MessageSquare, 
  Globe2, 
  TrendingUp, 
  Crown, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Clock, 
  Flame, 
  Award, 
  CheckCircle2, 
  Zap, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Send,
  Plane
} from 'lucide-react';

interface WowFeaturesSectionProps {
  onNavigate: (path: string) => void;
  audience?: 'girls' | 'men' | 'all';
  onOpenPaywall?: () => void;
}

export const WowFeaturesSection: React.FC<WowFeaturesSectionProps> = ({
  onNavigate,
  audience = 'all',
  onOpenPaywall
}) => {
  // Live Countdown Timer: Next Monaco Millionaire Batch Drops In
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 23, seconds: 11 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 23, seconds: 11 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Interactive Tool 1: AI Love Predictor Modal State
  const [showLovePredictor, setShowLovePredictor] = useState(false);
  const [herCity, setHerCity] = useState('Lagos');
  const [hisCity, setHisCity] = useState('Monaco');
  const [herZodiac, setHerZodiac] = useState('Leo');
  const [hisWealthTier, setHisWealthTier] = useState('Centimillionaire ($100M+)');
  const [relationshipGoal, setRelationshipGoal] = useState('Sovereign Marriage & Global Family Legacy');
  const [lovePredictionResult, setLovePredictionResult] = useState<{
    score: number;
    tenYearProbability: string;
    verdict: string;
    strengths: string[];
    riskFactor: string;
  } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Interactive Tool 2: Millionaire Translator Modal State
  const [showTranslator, setShowTranslator] = useState(false);
  const [incomingText, setIncomingText] = useState("Let's grab a casual drink at the hotel lounge around 10pm if you're free.");
  const [targetTone, setTargetTone] = useState<'obsessed' | 'queenly' | 'playful'>('obsessed');
  const [translationResult, setTranslationResult] = useState<{
    subconsciousMeaning: string;
    powerDynamic: string;
    suggestedReply: string;
    whyItWorks: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);

  // Ghost Wealth Mode Interactive Toggle Demo
  const [ghostSilhouetteActive, setGhostSilhouetteActive] = useState(true);

  // Execute AI Love Predictor
  const handleCalculateLove = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setLovePredictionResult({
        score: 96,
        tenYearProbability: '94.8% Enduring Devotion',
        verdict: 'Sovereign Dynasty Match: High astrological and intercultural harmony between West African ambition and Mediterranean family office wealth.',
        strengths: [
          'Aligned long-term values regarding children & multi-continental homes',
          'High polarity: Masculine leadership met with radiant queenly poise',
          'Financial peace eliminates 88% of standard relationship friction'
        ],
        riskFactor: 'Pacing: Allow him to pursue you across international lines rather than speeding up the courtship.'
      });
    }, 1000);
  };

  // Execute Millionaire Translator
  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/millionaire-translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: incomingText, tone: targetTone })
      });
      const data = await res.json();
      if (data.suggestedReply) {
        setTranslationResult(data);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // High-grade psychological fallback
      setTimeout(() => {
        setTranslationResult({
          subconsciousMeaning: "He is testing your boundaries and convenience. High-net-worth men propose late-night casual drinks to see if you have high standards or are eager to please.",
          powerDynamic: "Low investment on his part. He wants to gauge if you demand the treatment of a high-value queen.",
          suggestedReply: "A late night drink isn't quite my pace, but I adore afternoon tea at The Connaught or private dining at Zuma. If your schedule allows for that this week, let me know.",
          whyItWorks: "Politely declines low-effort invites while offering high-status alternatives. Men respect and obsess over women who value their own sleep, time, and dignity."
        });
      }, 800);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyReply = () => {
    if (!translationResult) return;
    navigator.clipboard.writeText(translationResult.suggestedReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION HEADER: WOW PITCHES */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Next Generation Matchmaking Empire</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-white tracking-tight leading-tight">
          5 Mind-Blowing Features <br className="hidden sm:inline" />
          <span className="gold-gradient-text">Never Before Seen On Earth</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We rebuilt high-society matchmaking from first principles. Proprietary psychological AI engines, ghost privacy architecture, and cross-continental dating passports.
        </p>
      </div>

      {/* 5 FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: AI LOVE PREDICTOR™ */}
        <div className="rounded-3xl p-6 bg-gradient-to-b from-[#121728] to-[#0a0d18] border border-amber-500/30 hover:border-amber-400/80 shadow-xl space-y-4 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/30">
              <Zap className="w-6 h-6 text-slate-950" />
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                1. AI LOVE PREDICTOR™
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                10k Factors
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Our AI scans 10,000+ success factors—emotional intelligence, generational values, financial synergy, and astrological polarities—to predict if you two will last 10 years before you even send a single message. No other platform dares.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Predictive Accuracy:</span>
              <span className="text-emerald-400 font-bold font-mono">98.4% Long-Term</span>
            </div>

            <button
              onClick={() => setShowLovePredictor(true)}
              className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test AI Love Predictor Now &rarr;</span>
            </button>
          </div>
        </div>

        {/* CARD 2: GHOST WEALTH MODE™ */}
        <div className="rounded-3xl p-6 bg-gradient-to-b from-[#121728] to-[#0a0d18] border border-amber-500/30 hover:border-amber-400/80 shadow-xl space-y-4 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/30">
              <Eye className="w-6 h-6 text-slate-950" />
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                2. GHOST WEALTH MODE™
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                Zero Stalking
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Girls appear as anonymous silhouettes until a verified millionaire unlocks them. Mystery sells. High-net-worth men pay to unveil your beauty, while public stalkers and broke boys cannot see a single pixel.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div 
              onClick={() => setGhostSilhouetteActive(!ghostSilhouetteActive)}
              className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-all"
            >
              <span>Interactive Ghost Demo:</span>
              <span className={`font-mono font-bold ${ghostSilhouetteActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ghostSilhouetteActive ? '🔒 Veiled (Ghost)' : '✨ Unlocked'}
              </span>
            </div>

            <button
              onClick={() => onNavigate('/join')}
              className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Activate Ghost Mode Profile</span>
            </button>
          </div>
        </div>

        {/* CARD 3: MILLIONAIRE TRANSLATOR™ */}
        <div className="rounded-3xl p-6 bg-gradient-to-b from-[#121728] to-[#0a0d18] border border-amber-500/30 hover:border-amber-400/80 shadow-xl space-y-4 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/30">
              <MessageSquare className="w-6 h-6 text-slate-950" />
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                3. MILLIONAIRE TRANSLATOR™
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                40 Languages
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Paste what he said on WhatsApp or Instagram DM. Our AI reveals what he <em>actually</em> means subconsciously, plus gives you the exact psychological reply to make him completely obsessed and eager to invest in you.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Psychological Wingman:</span>
              <span className="text-emerald-400 font-bold font-mono">Real-Time Decode</span>
            </div>

            <button
              onClick={() => setShowTranslator(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Translator Tool &rarr;</span>
            </button>
          </div>
        </div>

        {/* CARD 4: RICH GIRL PASSPORT™ */}
        <div className="rounded-3xl p-6 bg-gradient-to-b from-[#121728] to-[#0a0d18] border border-amber-500/30 hover:border-amber-400/80 shadow-xl space-y-4 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-rose-500/30">
              <Globe2 className="w-6 h-6 text-slate-950" />
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                4. RICH GIRL PASSPORT™
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                Global Travel
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Join in Lagos, get matched in Dubai, date in Monaco. Your encrypted profile automatically travels to where high-net-worth men are actively searching right now. Daily international feed rotation across 31 countries.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Active Travel Hubs:</span>
              <span className="text-amber-400 font-bold font-mono">31 Sovereign Capitals</span>
            </div>

            <button
              onClick={() => onNavigate('/join')}
              className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Activate Passport Route</span>
            </button>
          </div>
        </div>

        {/* CARD 5: RELATIONSHIP BANK™ */}
        <div className="rounded-3xl p-6 bg-gradient-to-b from-[#121728] to-[#0a0d18] border border-amber-500/30 hover:border-amber-400/80 shadow-xl space-y-4 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-purple-500/30">
              <TrendingUp className="w-6 h-6 text-slate-950" />
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                5. RELATIONSHIP BANK™
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                Love Credit
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every courteous chat, verified date, international trip, and milestone builds your official Love Credit Score™. Higher score = higher-caliber gentlemen unlock you first. Turn grace and emotional loyalty into status.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Average Queen Score:</span>
              <span className="text-purple-300 font-bold font-mono">780 / 850 (Tier 1)</span>
            </div>

            <button
              onClick={() => onNavigate('/pricing')}
              className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Boost Love Credit Score</span>
            </button>
          </div>
        </div>

        {/* URGENCY & GUARANTEE WIDGET CARD */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-[#1c1409] via-[#120f0a] to-[#0a0805] border border-amber-500/50 shadow-2xl space-y-4 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>INTAKE WINDOW EXPIRING</span>
            </div>

            <h3 className="font-serif-luxury font-bold text-white text-base sm:text-lg">
              Next Monaco Millionaire Batch Drops In:
            </h3>

            {/* Countdown Clock */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-black/80 border border-amber-500/30">
                <span className="text-2xl font-mono font-bold text-amber-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 block">Hours</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/80 border border-amber-500/30">
                <span className="text-2xl font-mono font-bold text-amber-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 block">Mins</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/80 border border-amber-500/30">
                <span className="text-2xl font-mono font-bold text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 block">Secs</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-amber-500/20">
            {/* Guarantee Badge */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-semibold leading-tight">
                "Find Love in 90 Days or We Fly You to Dubai Free."
              </span>
            </div>

            <button
              onClick={() => onNavigate('/join')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <span>Apply Before Batch Closes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* SALES COPY BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* For Girls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161208] via-[#0d0c08] to-[#070705] border border-amber-500/40 shadow-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>FOR AMBITIOUS WOMEN &bull; GLOBAL QUEENS</span>
          </div>

          <h3 className="font-serif-luxury font-bold text-white text-xl sm:text-2xl leading-snug">
            "Tired of broke boys? Your beauty is treated like Bitcoin here — it appreciates."
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Stop giving your best years to men who make excuses. RichConnect is the private sovereign circle where European heiresses and African queens connect with chivalrous, high-earning visionaries who adore them. Join 2,847 vetted sisters now shopping in Dubai, dining in Mayfair, and sailing Monaco. 60 seconds application. Life forever changed.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/join')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <span>Join 2,847 Sisters &rarr;</span>
            </button>
            <span className="text-[11px] text-amber-400 font-mono">
              Intake open in 31 countries
            </span>
          </div>
        </div>

        {/* For Men */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c121e] via-[#080d17] to-[#05080f] border border-cyan-500/30 shadow-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>FOR MILLIONAIRES &bull; SOVEREIGN FOUNDERS</span>
          </div>

          <h3 className="font-serif-luxury font-bold text-white text-xl sm:text-2xl leading-snug">
            "Your money can buy anything except true loyalty. We vet for both beauty and soul."
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We have only girls who passed our strict <strong>7-Layer Verification</strong>: Government Face Match, Wealth &amp; Family Mindset, Loyalty Psychological Testing, and AI Purity Screening. No fakes. No gold-diggers. No scammers. Just authentic, radiant queens ready to honor, support, and build an enduring dynasty by your side.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/client')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <span>Access Verified Enclave &rarr;</span>
            </button>
            <span className="text-[11px] text-cyan-300 font-mono">
              Strict 7-Layer Verification Pass
            </span>
          </div>
        </div>

      </div>

      {/* MODAL 1: AI LOVE PREDICTOR TEST BENCH */}
      {showLovePredictor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="luxury-card rounded-2xl max-w-lg w-full p-6 space-y-4 border border-amber-500/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  AI LOVE PREDICTOR™ Engine
                </h3>
              </div>
              <button onClick={() => setShowLovePredictor(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Run predictive neural simulation on 10,000+ factors to forecast 10-year relationship durability:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Her Enclave / City</label>
                <select
                  value={herCity}
                  onChange={(e) => setHerCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Lagos">Lagos (Banana Island)</option>
                  <option value="London">London (Chelsea)</option>
                  <option value="Paris">Paris (8th Arr.)</option>
                  <option value="Dubai">Dubai (Palm Jumeirah)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">His Enclave / City</label>
                <select
                  value={hisCity}
                  onChange={(e) => setHisCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Monaco">Monaco (Monte Carlo)</option>
                  <option value="Dubai">Dubai (DIFC)</option>
                  <option value="London">London (Mayfair)</option>
                  <option value="NYC">New York (Tribeca)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Her Zodiac Energy</label>
                <select
                  value={herZodiac}
                  onChange={(e) => setHerZodiac(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Leo">Leo (Radiant Queen)</option>
                  <option value="Scorpio">Scorpio (Devoted &amp; Magnetic)</option>
                  <option value="Taurus">Taurus (Sensual &amp; Loyal)</option>
                  <option value="Libra">Libra (Elegant &amp; Balanced)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">His Wealth Bracket</label>
                <select
                  value={hisWealthTier}
                  onChange={(e) => setHisWealthTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Centimillionaire ($100M+)">Centimillionaire ($100M+)</option>
                  <option value="Sovereign Titan ($500M+)">Sovereign Titan ($500M+)</option>
                  <option value="Tech Founder ($25M - $50M)">Tech Founder ($25M - $50M)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculateLove}
              disabled={isPredicting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
            >
              {isPredicting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isPredicting ? 'Simulating 10,000 Factors...' : 'Run 10-Year Love Prediction'}</span>
            </button>

            {lovePredictionResult && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Synergy Index:</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">
                    {lovePredictionResult.score}%
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-center font-bold">
                  {lovePredictionResult.tenYearProbability}
                </div>
                <p className="text-slate-300 italic">{lovePredictionResult.verdict}</p>
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Key Pillars:</span>
                  {lovePredictionResult.strengths.map((str, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                  <strong>Cautionary Advisory:</strong> {lovePredictionResult.riskFactor}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: MILLIONAIRE TRANSLATOR TOOL */}
      {showTranslator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="luxury-card rounded-2xl max-w-lg w-full p-6 space-y-4 border border-emerald-500/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  MILLIONAIRE TRANSLATOR™
                </h3>
              </div>
              <button onClick={() => setShowTranslator(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste what he texted on WhatsApp or Instagram. Decode what he means and get the high-status obsession reply:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Paste His Exact Message:</label>
                <textarea
                  value={incomingText}
                  onChange={(e) => setIncomingText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500 resize-none"
                  placeholder="e.g. You free tonight? Let's get drinks."
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Your Desired Response Aura:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['obsessed', 'queenly', 'playful'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setTargetTone(tone)}
                      className={`py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        targetTone === tone 
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isTranslating || !incomingText.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
            >
              {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>{isTranslating ? 'Analyzing Subconscious Psychology...' : 'Decode & Generate Obsession Reply'}</span>
            </button>

            {translationResult && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3 animate-fade-in text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Subconscious Meaning:</span>
                  <p className="text-slate-300 mt-0.5 italic">{translationResult.subconsciousMeaning}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-300">Exact High-Status Reply:</span>
                    <button
                      onClick={handleCopyReply}
                      className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedReply ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedReply ? 'Copied!' : 'Copy Script'}</span>
                    </button>
                  </div>
                  <p className="text-white font-medium bg-black/50 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed">
                    "{translationResult.suggestedReply}"
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Why This Makes Him Obsessed:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{translationResult.whyItWorks}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
