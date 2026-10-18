import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Globe2, 
  Eye, 
  MessageSquare, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  Users
} from 'lucide-react';
import { addRevenueRecord } from '../lib/marketplaceStorage';
import { supabase } from '../lib/supabase';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [audience, setAudience] = useState<'girls' | 'men'>('girls');
  const [selectedGateway, setSelectedGateway] = useState<'Stripe' | 'Paystack'>('Stripe');
  const [checkoutPlan, setCheckoutPlan] = useState<{
    id: string;
    title: string;
    price: number;
    billing: string;
    target: 'girls' | 'men';
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handleStartCheckout = (planId: string, title: string, price: number, billing: string) => {
    if (price === 0) {
      if (audience === 'girls') {
        onNavigate('/join');
      } else {
        onNavigate('/client');
      }
      return;
    }
    setCheckoutPlan({ id: planId, title, price, billing, target: audience });
  };

  const handleCompletePayment = async () => {
    if (!checkoutPlan) return;
    setIsProcessing(true);

    setTimeout(async () => {
      // Record revenue
      addRevenueRecord({
        source: 'application_fee',
        item_title: checkoutPlan.title,
        amount: checkoutPlan.price,
        buyer_name: audience === 'girls' ? 'Queen Applicant' : 'Sovereign Patron',
        gateway: selectedGateway
      });

      // Save plan locally
      try {
        localStorage.setItem('rc_member_plan', checkoutPlan.id);
        localStorage.setItem('rc_member_plan_active', 'true');
        
        // Update girl_applications in Supabase if exists
        await supabase.from('girl_applications').update({
          status: 'approved',
          fee_paid: true,
          plan_type: checkoutPlan.id
        }).neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Pricing plan save fallback:', e);
      }

      setIsProcessing(false);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setCheckoutPlan(null);
        if (audience === 'girls') {
          onNavigate('/join');
        } else {
          onNavigate('/client');
        }
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Transparent Sovereign Membership</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white tracking-tight leading-tight">
          Invest in Your <span className="gold-gradient-text">Destiny</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Whether you are an ambitious woman looking to be adored by an international king, or a high-net-worth gentleman seeking authentic loyalty away from public noise.
        </p>

        {/* Audience Toggle (For Girls vs For Men) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
          <button
            onClick={() => setAudience('girls')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              audience === 'girls'
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>FOR GIRLS &bull; QUEENS</span>
          </button>

          <button
            onClick={() => setAudience('men')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              audience === 'men'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>FOR MEN &bull; MILLIONAIRES</span>
          </button>
        </div>
      </div>

      {/* PLANS FOR GIRLS */}
      {audience === 'girls' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* PLAN 1: FREE EXPLORER */}
          <div className="rounded-3xl p-6 bg-[#0c101d] border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Freemium Tier
                </span>
                <h3 className="font-serif-luxury font-bold text-white text-xl mt-1">
                  FREE EXPLORER
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Explore the private enclave and test your market value with zero upfront commitment.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-3xl font-mono font-bold text-white">$0</span>
                <span className="text-xs text-slate-500 ml-1">free forever</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Create basic profile &amp; upload 3 photos</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Browse blurred ghost silhouettes of 1,200+ millionaires</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>3 full Diamond Girl success stories &amp; roadmaps</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1 free ebook chapter: "How to Make Him Obsessed"</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free AI Love Score compatibility calculator</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Direct messaging locked</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Rich Girl Passport travel locked</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartCheckout('free', 'Free Explorer', 0, 'free')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Start Free Exploration &rarr;
            </button>
          </div>

          {/* PLAN 2: GOLD QUEEN (FEATURED) */}
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#181208] via-[#0e0c07] to-[#070604] border-2 border-amber-500 shadow-2xl shadow-amber-500/20 flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-lg">
              Most Popular &bull; Fast-Track Intake
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Sovereign Enclave Access
                </span>
                <h3 className="font-serif-luxury font-bold text-white text-2xl mt-1">
                  GOLD QUEEN
                </h3>
                <p className="text-xs text-amber-200/90 mt-1">
                  Full profile visibility, global distribution, and direct courting with vetted millionaires.
                </p>
              </div>

              <div className="pt-2 border-t border-amber-500/20">
                <span className="text-4xl font-mono font-bold text-amber-400">$99</span>
                <span className="text-xs text-slate-400 ml-1">one-time payment</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Full unblurred verified profile in 31 countries</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Rich Girl Passport™ active (Monaco, Dubai, London rotation)</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>5 Best-Selling eBooks ($250 value free)</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Unlock 10 direct high-status conversations</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>+50 Love Credit Score boost</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>$30 referral bonus for every approved girlfriend</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartCheckout('gold', 'Gold Queen Pass', 99, 'one-time')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Join as Gold Queen ($99) &rarr;</span>
            </button>
          </div>

          {/* PLAN 3: DIAMOND EMPIRE */}
          <div className="rounded-3xl p-6 bg-[#0c101d] border border-cyan-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Sovereign Royalty VIP
                </span>
                <h3 className="font-serif-luxury font-bold text-white text-xl mt-1">
                  DIAMOND EMPIRE
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Priority concierge positioning, live AI coach, and high-society yacht invites.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-3xl font-mono font-bold text-cyan-300">$299</span>
                <span className="text-xs text-slate-500 ml-1">per year</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Glowing DIAMOND verified badge on all cards</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Pinned to Top of Feed in Dubai, London &amp; Monaco</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Unlimited Millionaire Translator™ (40 languages)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Personal AI 24/7 Wingman Relationship Coach</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>All digital marketplace products unlocked free ($2k value)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Monaco Grand Prix &amp; Dubai Yacht Party Guestlist</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartCheckout('diamond', 'Diamond Empire Pass', 299, 'annual')}
              className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-all cursor-pointer"
            >
              Get Diamond Empire ($299/yr) &rarr;
            </button>
          </div>

        </div>
      )}

      {/* PLANS FOR MEN */}
      {audience === 'men' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* FREE TRIAL */}
          <div className="rounded-3xl p-6 bg-[#0c101d] border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Preview Access
                </span>
                <h3 className="font-serif-luxury font-bold text-white text-xl mt-1">
                  PATRON EXPLORER
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Test the waters with verified ghost profiles before committing retainer capital.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-3xl font-mono font-bold text-white">$0</span>
                <span className="text-xs text-slate-500 ml-1">1 free unveil</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1 Full Ghost Girl Unveil &amp; Dossier</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Preview candidate gallery across 31 countries</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Direct WhatsApp line locked</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Presidential Daughters Suite locked</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartCheckout('men-free', 'Patron Explorer', 0, 'free')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Claim 1 Free Unveil &rarr;
            </button>
          </div>

          {/* GOLD PATRON */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#0e1628] to-[#070b14] border-2 border-cyan-400 shadow-xl flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Recommended For Founders
                </span>
                <h3 className="font-serif-luxury font-bold text-white text-2xl mt-1">
                  GOLD PATRON
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Active courtship access with verified 7-layer screened queens.
                </p>
              </div>

              <div className="pt-2 border-t border-cyan-500/20">
                <span className="text-4xl font-mono font-bold text-cyan-300">$199</span>
                <span className="text-xs text-slate-400 ml-1">per month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>10 Ghost Girl Unveils &amp; Unblurred Dossiers</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Direct WhatsApp lines for matching candidates</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Strict 7-Layer Verification access (zero fakes)</span>
                </div>
                <div className="flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>90-Day Romance Guarantee or free Dubai retreat</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartCheckout('gold-patron', 'Gold Patron Membership', 199, 'monthly')}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <span>Unlock Gold Patron ($199/mo) &rarr;</span>
            </button>
          </div>

          {/* DIAMOND SOVEREIGN */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#181208] to-[#070604] border border-amber-500/40 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Sovereign Capital Enclave
                </span>
                <h3 className="font-serif-luxury font-bold text-white text-xl mt-1">
                  DIAMOND SOVEREIGN
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Unlimited concierge introductions and presidential family connections.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-3xl font-mono font-bold text-amber-400">$499</span>
                <span className="text-xs text-slate-500 ml-1">per month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Unlimited Ghost Girl unveils across all 31 countries</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Exclusive access to Presidential Daughters Suite</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Dedicated Senior Matchmaker Concierge Desk</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>VIP Monaco Yacht &amp; Polo Club dinner hospitality</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartCheckout('diamond-sovereign', 'Diamond Sovereign Membership', 499, 'monthly')}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all cursor-pointer"
            >
              Join Diamond Sovereign ($499/mo) &rarr;
            </button>
          </div>

        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="luxury-card rounded-3xl max-w-md w-full p-6 space-y-4 border border-amber-500/50">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  {checkoutPlan.title}
                </h3>
              </div>
              <button onClick={() => setCheckoutPlan(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Investment:</span>
                <div className="text-2xl font-mono font-bold text-amber-400">
                  ${checkoutPlan.price}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 font-bold">
                {checkoutPlan.billing.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-semibold">Select Secure Checkout:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('Stripe')}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    selectedGateway === 'Stripe' 
                      ? 'bg-slate-800 border-2 border-amber-400 text-white' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stripe Global</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('Paystack')}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    selectedGateway === 'Paystack' 
                      ? 'bg-slate-800 border-2 border-amber-400 text-white' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Paystack Africa</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              {purchaseSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-center text-xs flex items-center justify-center space-x-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Membership Activated Successfully!</span>
                </div>
              ) : (
                <button
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Unlock className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isProcessing ? 'Processing Payment...' : `Complete Payment ($${checkoutPlan.price})`}</span>
                </button>
              )}
            </div>

            <div className="text-[10px] text-center text-slate-500">
              Discreet billing on bank statement &bull; 90-Day Money Back Guarantee
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
