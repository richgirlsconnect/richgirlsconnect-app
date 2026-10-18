import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Star, 
  Globe2, 
  Building2, 
  EyeOff, 
  Clock, 
  FileText,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { Consultation } from '../types';
import { saveConsultation } from '../lib/matchmakingStorage';
import { ViralShareBar } from '../components/ViralShareBar';

interface MatchmakingLandingPageProps {
  onNavigate: (path: string) => void;
}

export const MatchmakingLandingPage: React.FC<MatchmakingLandingPageProps> = ({ onNavigate }) => {
  const [selectedTier, setSelectedTier] = useState<'standard' | 'presidential'>('standard');
  const [paymentGateway, setPaymentGateway] = useState<'Paystack' | 'Stripe'>('Paystack');
  const [showPayModal, setShowPayModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Form state in payment modal
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const tiers = {
    standard: {
      name: 'VIP Private Consultation',
      priceUSD: 2500,
      priceNGN: '₦3,750,000',
      description: 'One-on-one personal profile vetting, custom AI compatibility scoring, and private introduction to top 3 verified matches.',
      features: [
        'Complete identity & net worth verification ($5M+ minimum)',
        'Private non-indexed profile (zero public browsing)',
        'AI multi-point psychological & lifestyle matching',
        'Concierge-assisted introductions with pre-approved matches',
        'Private 1-on-1 encrypted chatroom access with safety oversight',
        'Direct WhatsApp line with Senior Matchmaker'
      ]
    },
    presidential: {
      name: 'Presidential & Dynasty Enclave',
      priceUSD: 5000,
      priceNGN: '₦7,500,000',
      description: 'Ultra-exclusive tier for daughters of heads of state, sovereign family offices, and Forbes-tier African titans.',
      features: [
        'Diplomatic security & NDAs pre-executed',
        'Curated introductions to sovereign & royal family lineages',
        'White-glove private flight / Michelin dining coordination',
        'Unlimited AI Wingman coaching & chat sentiment monitoring',
        'Dedicated Senior Managing Matchmaker 24/7',
        'Guaranteed discreet face-to-face rendezvous'
      ]
    }
  };

  const handleOpenPay = (tier: 'standard' | 'presidential') => {
    setSelectedTier(tier);
    setShowPayModal(true);
    setPaySuccess(false);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim() || !whatsapp.trim()) return;

    setIsProcessing(true);

    // Simulate Paystack/Stripe secure checkout processing
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const tierInfo = tiers[selectedTier];
    const newConsultation: Consultation = {
      id: 'cons-' + Date.now(),
      client_name: clientName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      amount: tierInfo.priceUSD,
      currency: paymentGateway === 'Paystack' ? 'USD/NGN' : 'USD',
      payment_gateway: paymentGateway,
      payment_status: 'paid',
      reference: `${paymentGateway.toLowerCase()}_ref_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      created_at: new Date().toISOString(),
    };

    await saveConsultation(newConsultation);

    // Store paid client session hint so apply form pre-fills and marks consultation paid
    localStorage.setItem('rc_last_paid_consultation', JSON.stringify(newConsultation));

    setIsProcessing(false);
    setPaySuccess(true);

    setTimeout(() => {
      setShowPayModal(false);
      onNavigate('/apply');
    }, 1800);
  };

  return (
    <div className="min-h-screen text-slate-100 pb-24">
      
      {/* Top Banner & Mode Notification */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-500/15 border-b border-amber-500/30 py-2.5 px-4 text-center">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mode 2: Elite Private Matchmaking Agency</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Invite-Only Client Enclave</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('/apply')}
              className="text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
            >
              Already Paid? Go to /apply &rarr;
            </button>
            <button
              onClick={() => onNavigate('/admin/clients')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] cursor-pointer"
            >
              Agency Admin &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode 2 &bull; Bespoke International Matchmaking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight text-white leading-[1.15]">
            Elite Private Matchmaking
            <span className="block text-2xl sm:text-3xl lg:text-4xl gold-gradient-text font-sans font-semibold mt-2">
              Pay for Consultation to Find Love
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The world’s most discreet matrimonial and romance advisory pairing ultra-high-net-worth European heiresses, sovereign dignitaries, and ambitious Black kings & African leaders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleOpenPay('standard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-base hover:brightness-110 shadow-xl shadow-amber-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Book Consultation — $2,500</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('/apply')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-base border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Already a Client? Apply Form</span>
            </button>
          </div>

          {/* Core Trust Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <EyeOff className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-200">100% Non-Indexed</div>
              <div className="text-xs text-slate-400 mt-1">No public browsing or public photo leaks</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <BadgeCheck className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-200">$5M+ Verified Tier</div>
              <div className="text-xs text-slate-400 mt-1">Pre-screened liquid wealth & sovereign lineage</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-200">Gemini AI Synergy</div>
              <div className="text-xs text-slate-400 mt-1">Multi-factor compatibility analysis (0-100%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <ShieldCheck className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-200">Safety Monitored</div>
              <div className="text-xs text-slate-400 mt-1">Private 1-on-1 encrypted chat with human oversight</div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing / Consultation Packages */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-serif-luxury font-bold text-slate-100">
            Select Your Consultation Tier
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Consultation fee covers forensic vetting, bespoke AI multi-factor compatibility evaluation, and human matchmaker introduction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* VIP Tier */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0b0e17] border border-amber-500/30 p-8 flex flex-col justify-between hover:border-amber-500/60 transition-all shadow-xl shadow-amber-950/20">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/20">
                Most Popular for Executives
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-white">
                VIP Private Consultation
              </h3>
              <p className="text-slate-400 text-sm">
                {tiers.standard.description}
              </p>
              <div className="py-2">
                <span className="text-4xl font-bold text-amber-300 font-mono">$2,500</span>
                <span className="text-slate-400 text-sm ml-2">/ one-time intake</span>
                <div className="text-xs text-slate-400 mt-0.5">Approx. {tiers.standard.priceNGN} via Paystack</div>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-sm text-slate-300">
                {tiers.standard.features.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 space-y-3">
              <button
                onClick={() => handleOpenPay('standard')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Consultation ($2,500)</span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                Supports Paystack (NGN/USD cards, bank transfer) & Stripe (Global cards)
              </p>
            </div>
          </div>

          {/* Presidential Tier */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#141824] to-[#0d101d] border-2 border-amber-400/50 p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10 hover:border-amber-400 transition-all">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
              Presidential Enclave
            </div>

            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
                Heads of State & Dynasty Families
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-white flex items-center space-x-2">
                <span>Presidential Suite Matchmaking</span>
                <Crown className="w-5 h-5 text-amber-400" />
              </h3>
              <p className="text-slate-400 text-sm">
                {tiers.presidential.description}
              </p>
              <div className="py-2">
                <span className="text-4xl font-bold text-amber-300 font-mono">$5,000</span>
                <span className="text-slate-400 text-sm ml-2">/ sovereign retainer</span>
                <div className="text-xs text-slate-400 mt-0.5">Approx. {tiers.presidential.priceNGN} via Paystack</div>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-sm text-slate-300">
                {tiers.presidential.features.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 space-y-3">
              <button
                onClick={() => handleOpenPay('presidential')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Pay Consultation ($5,000)</span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                Includes diplomatic NDA, private aviation coordination & 24/7 dedicated matchmaker
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Step Process */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
            The 4-Step Private Matching Protocol
          </h2>
          <p className="text-slate-400 text-sm">
            Discretion is our cornerstone. Profiles are never open for public browsing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center mb-3">
              01
            </div>
            <h4 className="font-semibold text-white text-base mb-1">Pay Consultation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your intake payment securely via Paystack or Stripe to initiate private concierge onboarding.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center mb-3">
              02
            </div>
            <h4 className="font-semibold text-white text-base mb-1">Submit /apply Form</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload private photos, specify partner preferences (e.g. rich white girls, black kings), wealth level, and values.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center mb-3">
              03
            </div>
            <h4 className="font-semibold text-white text-base mb-1">AI Matchmaker & Approval</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini AI auto-compares compatibility (0-100%). Matchmaker reviews and approves top 3 candidates before unlocking.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono flex items-center justify-center mb-3">
              04
            </div>
            <h4 className="font-semibold text-white text-base mb-1">Private 1-on-1 Chat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your dedicated, encrypted chatroom (`/chat/[matchId]`). Monitored by concierge for supreme safety and quality.
            </p>
          </div>
        </div>

        {/* Viral Share Incentive Bar */}
        <div className="mt-10">
          <ViralShareBar
            title="RichConnect Private Circle"
            text="The private circle where Monaco millionaires seek African queens. 31 countries. Join here:"
            storyId="post-1"
            referralCode="MONACO_VIP"
            category="general"
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* Paystack / Stripe Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              &times;
            </button>

            {paySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Payment Confirmed</h3>
                <p className="text-sm text-slate-300">
                  Your consultation receipt has been generated. Redirecting to the private client intake form (`/apply`)...
                </p>
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Matchmaking Checkout</span>
                  </div>
                  <h3 className="text-xl font-serif-luxury font-bold text-white">
                    {tiers[selectedTier].name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Amount: <strong className="text-amber-300 font-mono text-sm">${tiers[selectedTier].priceUSD.toLocaleString()} USD</strong>
                    {paymentGateway === 'Paystack' && ` (Approx. ${tiers[selectedTier].priceNGN})`}
                  </p>
                </div>

                {/* Gateway Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Select Payment Gateway</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentGateway('Paystack')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentGateway === 'Paystack'
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-emerald-400">Paystack</div>
                      <div className="text-[11px] text-slate-400">Cards, NGN & USD, Bank Transfer</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentGateway('Stripe')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentGateway === 'Stripe'
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-blue-400">Stripe</div>
                      <div className="text-[11px] text-slate-400">Global Credit / Debit Cards</div>
                    </button>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Legal or Preferred Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Adekunle Balogun or Clara D."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Private Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@familyoffice.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      WhatsApp Number for Matchmaker Intake *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+44 7911 123456 or +234 801 234 5678"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Your payment immediately creates a verified consultation voucher and unlocks the private client intake form at <code>/apply</code>.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing via {paymentGateway}...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize Payment (${tiers[selectedTier].priceUSD.toLocaleString()})</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
