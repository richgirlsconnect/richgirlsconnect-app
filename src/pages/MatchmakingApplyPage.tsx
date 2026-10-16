import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  Lock, 
  Upload, 
  CheckCircle2, 
  UserCheck, 
  Building2, 
  AlertCircle,
  EyeOff,
  ArrowRight,
  Heart
} from 'lucide-react';
import { Client, Match } from '../types';
import { getClients, saveClient, saveMatch } from '../lib/matchmakingStorage';

interface MatchmakingApplyPageProps {
  onNavigate: (path: string) => void;
}

export const MatchmakingApplyPage: React.FC<MatchmakingApplyPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [partnerPreference, setPartnerPreference] = useState('Rich White Girls & European Heiresses');
  const [customPreference, setCustomPreference] = useState('');
  const [wealthLevel, setWealthLevel] = useState('Ultra High Net Worth ($20M - $50M)');
  const [bio, setBio] = useState('');
  const [whatTheyWant, setWhatTheyWant] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [consentSafety, setConsentSafety] = useState(false);
  const [consultationPaid, setConsultationPaid] = useState(true);

  // Additional photos upload simulator
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [submittedClient, setSubmittedClient] = useState<Client | null>(null);
  const [generatedMatches, setGeneratedMatches] = useState<Match[]>([]);

  // Pre-fill from consultation if available
  useEffect(() => {
    const lastPaid = localStorage.getItem('rc_last_paid_consultation');
    if (lastPaid) {
      try {
        const parsed = JSON.parse(lastPaid);
        if (parsed.client_name) setName(parsed.client_name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.whatsapp) setWhatsapp(parsed.whatsapp);
        setConsultationPaid(true);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const sampleAvatarPresets = [
    {
      label: 'Gentleman Executive',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Distinguished Titan',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'European Heiress',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Couture Director',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Nordic Heiress',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setAvatarUrl(resultUrl);
          setPhotos((prev) => [...prev, resultUrl]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentSafety) {
      alert('Please accept the safety and quality monitoring consent before submitting.');
      return;
    }

    setIsSubmitting(true);

    const finalPreference = partnerPreference === 'Other' ? customPreference : partnerPreference;
    const finalAvatar = avatarUrl || sampleAvatarPresets[0].url;
    const allPhotos = photos.length > 0 ? photos : [finalAvatar];

    const newClient: Client = {
      id: 'client-' + Date.now(),
      name: name.trim(),
      age: Number(age) || 28,
      gender,
      location: location.trim() || 'London & Global',
      avatar_url: finalAvatar,
      photos: allPhotos,
      partner_preference: finalPreference || 'Rich White Girls & European Heiresses',
      wealth_level: wealthLevel,
      bio: bio.trim(),
      what_they_want: whatTheyWant.trim(),
      is_public: false, // Strict privacy: false in Supabase & local
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      consultation_paid: consultationPaid,
      created_at: new Date().toISOString(),
    };

    // 1. Save to Supabase clients table / local storage
    await saveClient(newClient);
    setSubmittedClient(newClient);
    setIsSubmitting(false);
    setIsMatching(true);

    // 2. Call /api/matchmaker with Gemini to compare against all other private clients
    try {
      const allClients = getClients().filter((c) => c.id !== newClient.id);

      const res = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetClient: newClient,
          candidates: allClients,
        }),
      });

      const data = await res.json();
      const topMatches: Match[] = [];

      if (data.matches && Array.isArray(data.matches)) {
        for (const m of data.matches) {
          const candidate = allClients.find((c) => c.id === m.candidateId);
          if (candidate) {
            const matchObj: Match = {
              id: 'match-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              client_a_id: newClient.id,
              client_b_id: candidate.id,
              score: m.score,
              reason: m.reason,
              status: 'pending', // Starts as pending until admin approves
              created_at: new Date().toISOString(),
              approved_at: null,
            };
            await saveMatch(matchObj);
            topMatches.push({
              ...matchObj,
              client_a: newClient,
              client_b: candidate,
            });
          }
        }
      }
      setGeneratedMatches(topMatches);
    } catch (err) {
      console.error('Error generating AI matches:', err);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Privacy Notice Banner */}
      <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
        <EyeOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-amber-300">
            Private Matchmaking Enclave &bull; Absolute Confidentiality Guaranteed
          </p>
          <p className="text-slate-400">
            Dossiers submitted here are saved with <code>is_public = false</code>. There is zero public browsing or internet indexing. Only the Chief Matchmaker has administrative access to your profile, and matches are only visible to clients once approved.
          </p>
        </div>
      </div>

      {submittedClient ? (
        <div className="space-y-8 bg-[#0b0e17] border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Application Dossier Encrypted &amp; Stored
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Welcome, <strong className="text-amber-300">{submittedClient.name}</strong>. Your profile has been saved privately to the <code>clients</code> table.
            </p>
          </div>

          {/* AI Matchmaker Running State */}
          {isMatching ? (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
              <div className="text-sm font-semibold text-amber-300">
                AI Matchmaker Engine Running (Gemini 3.8 Flash)...
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Comparing your lifestyle, net worth tier, and partner preferences against pre-vetted private European heiresses and sovereign dignitaries...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Preliminary AI Compatibility Matches ({generatedMatches.length})
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  Pending Matchmaker Approval
                </span>
              </div>

              {generatedMatches.length > 0 ? (
                <div className="grid gap-4">
                  {generatedMatches.map((m, idx) => {
                    const partner = m.client_b;
                    return (
                      <div 
                        key={m.id || idx}
                        className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img 
                            src={partner?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                            alt={partner?.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-white text-base">{partner?.name}</h4>
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {partner?.location}
                              </span>
                            </div>
                            <div className="text-xs text-amber-300/90 font-medium mt-0.5">
                              {partner?.wealth_level} &bull; {partner?.partner_preference}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-2">
                              {m.reason}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{m.score}% Match</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">Status: Pending Review</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                  Matches have been calculated and routed to your Senior Matchmaker for human review.
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">What Happens Next?</p>
                <p>1. Your Senior Matchmaker will contact your WhatsApp ({submittedClient.whatsapp}) within 12 hours.</p>
                <p>2. Once the matchmaker approves a match in the Admin Portal, your private encrypted chatroom link will be unlocked.</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => onNavigate('/admin/matches')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-110 cursor-pointer"
                >
                  Go to /admin/matches (Review &amp; Approve) &rarr;
                </button>
                <button
                  onClick={() => onNavigate('/admin/clients')}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 cursor-pointer"
                >
                  View in /admin/clients &rarr;
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-[#0b0e17] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          <div className="border-b border-slate-800 pb-5 mb-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Paid Client Private Intake</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Private Client Application Form
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete your private dossier. This data is strictly private and non-browsable.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Identity */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span>1. Client Identity &amp; Location</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Client Full Legal / Preferred Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adekunle 'Kunle' Balogun"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={85}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Non-Binary / Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Residences / Location (e.g. London &amp; Lagos, Paris, Monaco, New York) *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mayfair (London) &amp; Ikoyi (Lagos)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 2: Private Photos Upload */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>2. Private Photos Upload (Strictly Confidential)</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Upload Photo File (Encrypted)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer bg-slate-900/50 text-center transition-all">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-300 font-medium">Click to upload private portrait</span>
                    <span className="text-[10px] text-slate-500 mt-1">PNG, JPG up to 10MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Or Photo Image URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        if (e.target.value) setPhotos((prev) => [...prev, e.target.value]);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Avatar Presets */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Or Select High-Res Editorial Preset
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleAvatarPresets.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setAvatarUrl(preset.url);
                          setPhotos([preset.url]);
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          avatarUrl === preset.url
                            ? 'border-amber-400 bg-amber-500/20'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label} 
                          className="w-12 h-12 rounded-lg object-cover mx-auto mb-1" 
                        />
                        <div className="text-[10px] text-slate-300 truncate">{preset.label}</div>
                      </button>
                    ))}
                  </div>

                  {avatarUrl && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Photo selected and verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Preferences & Wealth */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>3. Partner Preference &amp; Wealth Verification</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Partner Preference *
                  </label>
                  <select
                    value={partnerPreference}
                    onChange={(e) => setPartnerPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Rich White Girls & European Heiresses">Rich White Girls &amp; European Heiresses</option>
                    <option value="Ambitious Black Kings & African Visionaries">Ambitious Black Kings &amp; African Visionaries</option>
                    <option value="Presidential / Head of State Lineage">Presidential / Head of State Lineage</option>
                    <option value="Global Jetsetters & Tech Founders">Global Jetsetters &amp; Tech Founders</option>
                    <option value="Affluent Caucasian Women of High Taste">Affluent Caucasian Women of High Taste</option>
                    <option value="Other">Custom Preference...</option>
                  </select>

                  {partnerPreference === 'Other' && (
                    <input
                      type="text"
                      value={customPreference}
                      onChange={(e) => setCustomPreference(e.target.value)}
                      placeholder="Specify your exact partner preference"
                      className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Verified Liquid Wealth Tier *
                  </label>
                  <select
                    value={wealthLevel}
                    onChange={(e) => setWealthLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="High Net Worth ($5M - $15M)">High Net Worth ($5M - $15M)</option>
                    <option value="Ultra High Net Worth ($20M - $50M)">Ultra High Net Worth ($20M - $50M)</option>
                    <option value="Dynasty & Family Office ($50M - $100M+)">Dynasty &amp; Family Office ($50M - $100M+)</option>
                    <option value="Sovereign / Presidential Lineage ($100M+)">Sovereign / Presidential Lineage ($100M+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Private Biography (Career, Lineage, Passions &amp; Lifestyle) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Founder of a leading fintech unicorn and clean energy fund. Imperial College graduate. Love contemporary art collecting, equestrian events, and fine dining across London and Lagos."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  What You Want (Relationship Intent, Values &amp; Vision) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={whatTheyWant}
                  onChange={(e) => setWhatTheyWant(e.target.value)}
                  placeholder="e.g. Seeking an educated, culturally open European heiress who loves African culture, seeks marriage and long-term family building, and values absolute loyalty."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 4: Contact Dispatch */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>4. Concierge Dispatch Details</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp Number (for Matchmaker Audio &amp; Introductions) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+44 7911 123456"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
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
                    placeholder="client@dynasty.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Consent Notice */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentSafety}
                  onChange={(e) => setConsentSafety(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-500 border-slate-700 rounded focus:ring-amber-400"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  <strong>Consent &amp; Safety Protocol:</strong> I understand that this is an exclusive, invite-only private matchmaking agency. My profile is strictly confidential (<code>is_public = false</code>) and will never be browsable. I consent that private 1-on-1 match chats are monitored by the RichConnect Concierge for safety, decorum, and quality assurance.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-amber-900/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Encrypting Dossier &amp; Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <span>Submit Private Dossier &amp; Trigger AI Matchmaker</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

        </div>
      )}

    </div>
  );
};
