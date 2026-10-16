import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  X,
  Heart,
  DollarSign
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [location, setLocation] = useState('London & Mayfair');
  const [wealthTier, setWealthTier] = useState('$25M+');
  const [partnerPreference, setPartnerPreference] = useState('Cultured, high EQ partner with quiet sophistication and mutual passion for philanthropy.');
  const [whatTheyWant, setWhatTheyWant] = useState('Committed long-term partnership, family, and shared global travel.');
  const [bio, setBio] = useState('Tech founder & angel investor backing frontier tech. Appreciates classical arts, sailing, and private club discussions.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conciergeWelcome, setConciergeWelcome] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call backend concierge welcome API
      const res = await fetch('/api/concierge/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name || 'VIP Member',
          tier: wealthTier,
          intent: whatTheyWant
        })
      });
      const data = await res.json();
      setConciergeWelcome(data.concierge);
      setStep(3);
    } catch {
      setConciergeWelcome({
        welcome_message: `Welcome to RichConnect, ${name}. Your profile has been assigned to our ${wealthTier} tier under strict zero-indexing privacy.`,
        concierge_tip: 'High-net-worth partners value intellectual synergy and quiet discretion.',
        suggested_actions: ['Explore Discover Deck', 'Test VIP Encrypted Video Call']
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onComplete({
      name,
      age: parseInt(age, 10),
      gender,
      location,
      wealthTier,
      partnerPreference,
      whatTheyWant,
      bio,
      is_public: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#0f1422] to-[#0a0d16] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Personal Dossier & Wealth Verification */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">VIP Onboarding (1/2)</h2>
                <p className="text-xs text-slate-400">Strictly confidential member dossier</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal or Preferred Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Lord Alexander Kensington"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Non-binary / Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Residences</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. London & Geneva"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Wealth Qualification Tier</label>
                  <select
                    value={wealthTier}
                    onChange={e => setWealthTier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="$10M+">$10M+ (Standard VIP)</option>
                    <option value="$25M+">$25M+ (High Net Worth)</option>
                    <option value="$50M+">$50M+ (Ultra High Net Worth)</option>
                    <option value="Presidential Suite ($100M+)">Presidential Suite ($100M+)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Continue to Preferences &amp; Safety</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Preferences & Intentions */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Partner Preferences (2/2)</h2>
                <p className="text-xs text-slate-400">Used by Matchmaker Agent to compute embeddings</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Partner Preference</label>
                <textarea
                  rows={2}
                  value={partnerPreference}
                  onChange={e => setPartnerPreference(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">What You Are Seeking</label>
                <textarea
                  rows={2}
                  value={whatTheyWant}
                  onChange={e => setWhatTheyWant(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Executive Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dossier saved with <code className="text-amber-300 font-mono">is_public = false</code>. Zero public indexing.</span>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Summoning Concierge...' : 'Submit to Concierge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Concierge Agent Welcome Presentation */}
        {step === 3 && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">Welcome, {name || 'VIP Member'}</h2>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Concierge Agent Orientation Dossier
              </span>
            </div>

            <div className="text-left bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>{conciergeWelcome?.welcome_message}</p>
              
              {conciergeWelcome?.concierge_tip && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <strong className="block text-[10px] uppercase font-bold text-amber-400 mb-1">
                    Concierge Agent Tip
                  </strong>
                  <span>{conciergeWelcome.concierge_tip}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              <span>Enter Enclave &amp; Begin Swiping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
