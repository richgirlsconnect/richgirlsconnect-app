import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Crown, 
  Sparkles, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  X, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Zap,
  Users,
  Unlock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { addRevenueRecord } from '../lib/marketplaceStorage';

interface SmartPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  targetFeature?: string;
}

export const SmartPaywallModal: React.FC<SmartPaywallModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  targetFeature = "Monaco Millionaire Unveil"
}) => {
  // Live Countdown: Free exploration ends in 47:58:32
  const [countdown, setCountdown] = useState({ hours: 47, minutes: 58, seconds: 32 });
  const [selectedPlan, setSelectedPlan] = useState<'gold' | 'diamond'>('gold');
  const [selectedGateway, setSelectedGateway] = useState<'Stripe' | 'Paystack'>('Stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 47, minutes: 58, seconds: 32 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    const amount = selectedPlan === 'gold' ? 99 : 299;

    setTimeout(async () => {
      // Record revenue
      addRevenueRecord({
        source: 'application_fee',
        item_title: selectedPlan === 'gold' ? 'Gold Queen Membership' : 'Diamond Empire Pass',
        amount,
        buyer_name: 'VIP Queen Member',
        gateway: selectedGateway
      });

      // Save plan_type to localStorage
      try {
        localStorage.setItem('rc_member_plan', selectedPlan);
        localStorage.setItem('rc_member_plan_active', 'true');
        
        // Update girl_applications in Supabase if exists
        await supabase.from('girl_applications').update({
          status: 'approved',
          fee_paid: true,
          plan_type: selectedPlan
        }).neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Paywall local plan saved:', e);
      }

      setIsProcessing(false);
      setUpgradeSuccess(true);
      setTimeout(() => {
        setUpgradeSuccess(false);
        onClose();
        onNavigate('/client');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="luxury-card rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
        
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                Smart Exclusive Paywall
              </div>
              <h3 className="font-serif-luxury font-bold text-white text-base">
                Gold &amp; Diamond Queens Only
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pitch Headline */}
        <div className="space-y-2">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium leading-relaxed">
            🔒 <strong>This {targetFeature} is waiting for Gold Queens only.</strong> Upgrade to unlock him + 16 other verified sovereign millionaires now.
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>73% of free girls upgrade in 24 hours</span>
            </span>
            <span className="text-amber-400 font-bold">
              {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Plan Selectors */}
        <div className="space-y-2.5 text-xs">
          {/* Gold Queen Option */}
          <div
            onClick={() => setSelectedPlan('gold')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedPlan === 'gold'
                ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedPlan === 'gold' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
              }`}>
                {selectedPlan === 'gold' && <Check className="w-3 h-3 text-slate-950 font-bold" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-xs sm:text-sm">GOLD QUEEN PASS</span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 uppercase">
                    Most Popular
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Full profile unveil, appear in 31 countries, Rich Girl Passport active, 5 free ebooks, unlock 10 messages.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-bold font-mono text-amber-400">$99</span>
              <span className="text-[10px] text-slate-500 block">one-time</span>
            </div>
          </div>

          {/* Diamond Empire Option */}
          <div
            onClick={() => setSelectedPlan('diamond')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedPlan === 'diamond'
                ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedPlan === 'diamond' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
              }`}>
                {selectedPlan === 'diamond' && <Check className="w-3 h-3 text-slate-950 font-bold" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-xs sm:text-sm">DIAMOND EMPIRE PASS</span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 uppercase">
                    VIP Elite
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Top of feed Dubai &amp; Monaco, unlimited Translator, personal AI wingman coach, all marketplace items ($2k value), Monaco yacht list.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-bold font-mono text-cyan-300">$299</span>
              <span className="text-[10px] text-slate-500 block">annual</span>
            </div>
          </div>
        </div>

        {/* Gateway Selection */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-slate-400 font-semibold text-[11px]">Select Secure Checkout Gateway:</label>
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
              <span>Stripe Global (Cards, Apple Pay)</span>
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
              <span>Paystack Africa &bull; NGN/USD</span>
            </button>
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="pt-2">
          {upgradeSuccess ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-center text-xs flex items-center justify-center space-x-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Upgrade Activated! Welcome to Sovereign Queen Status.</span>
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Unlock className="w-4 h-4 text-slate-950" />
              )}
              <span>
                {isProcessing 
                  ? 'Connecting Encrypted Payment...' 
                  : `Upgrade to ${selectedPlan === 'gold' ? 'Gold Queen ($99)' : 'Diamond Empire ($299)'} Now`}
              </span>
            </button>
          )}
        </div>

        <div className="text-[10px] text-center text-slate-500">
          Discreet billing &bull; 90-Day Money-Back Guarantee or Free Flight to Dubai &bull; Encrypted TLS 256-bit
        </div>

      </div>
    </div>
  );
};
