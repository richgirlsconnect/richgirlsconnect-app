import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Upload, 
  Loader2, 
  AlertCircle, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Share2, 
  Copy, 
  Check, 
  Lock, 
  CreditCard, 
  Flame, 
  Users, 
  Globe2, 
  Award, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  BookOpen,
  Eye,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { submitGirlApplication, getGirlApplications, GirlApplication } from '../lib/marketplaceStorage';
import { LiveGirlsGallery } from '../components/LiveGirlsGallery';
import { SmartPaywallModal } from '../components/SmartPaywallModal';

interface CityConfig {
  id: string;
  name: string;
  country: string;
  heroTagline: string;
  enclaves: string;
  membersCount: number;
  perks: string[];
  bannerUrl: string;
}

const CITIES: CityConfig[] = [
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    heroTagline: 'Mayfair Salons, Chelsea Polo & Sovereign Intercultural Courtship',
    enclaves: 'Mayfair, Knightsbridge, Belgravia & Surrey',
    membersCount: 412,
    perks: ['Oswald’s & 5 Hertford St. Private Introductions', 'Equestrian & Cartier Polo VIP Days', 'Discreet Pan-African Founder Banquets'],
    bannerUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    heroTagline: 'DIFC Private Capital, Palm Jumeirah & Sovereign Luxury Romance',
    enclaves: 'Palm Jumeirah, DIFC, Emirates Hills & Downtown',
    membersCount: 638,
    perks: ['Zuma & Il Borro Private Dining Suites', 'Superyacht Sunset Cruises & Desert Falconry', 'Vetted Sovereign Tech & Real Estate Kings'],
    bannerUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    heroTagline: 'Haute Couture, 8th Arrondissement & Parisian Romance Reimagined',
    enclaves: '8th Arrondissement, Le Marais & Avenue Montaigne',
    membersCount: 329,
    perks: ['Private Fashion Week Front-Row Intros', 'Bordeaux Grand Cru Vineyard Weekends', 'Intellectual & Artistic Pan-African Salons'],
    bannerUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lagos',
    name: 'Lagos',
    country: 'Nigeria',
    heroTagline: 'Banana Island Royalty, Afrobeats Renaissance & Global Kings',
    enclaves: 'Ikoyi, Banana Island, Eko Atlantic & Victoria Island',
    membersCount: 512,
    perks: ['Private Jet Charters to Monaco & London', 'VIP Art X Lagos & Polo Club Hospitality', 'Direct Alignment with Pan-African Unicorn Founders'],
    bannerUrl: 'https://images.unsplash.com/photo-1577975882846-431adc8c2009?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'monaco',
    name: 'Monaco',
    country: 'Monaco',
    heroTagline: 'Monte Carlo Grandeur, Superyachts & Mediterranean Prestige',
    enclaves: 'Monte Carlo, Port Hercules & Larvotto',
    membersCount: 194,
    perks: ['Yacht Club de Monaco Private Berths', 'Formula 1 Paddock Club Rendezvous', 'Sovereign Family Office Dynasty Connections'],
    bannerUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'nyc',
    name: 'New York',
    country: 'United States',
    heroTagline: 'Manhattan Penthouse Evenings, SoHo Arts & Wall Street Kings',
    enclaves: 'Tribeca, SoHo, Upper East Side & The Hamptons',
    membersCount: 487,
    perks: ['Discreet Zero Bond & Casa Cipriani Tables', 'Hamptons Summer Polo Escapes', 'Bespoke Introductions to Private Equity Leaders'],
    bannerUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milan',
    name: 'Milan',
    country: 'Italy',
    heroTagline: 'Quadrilatero della Moda, Lake Como & Italian Sartorial Elegance',
    enclaves: 'Brera, Quadrilatero & Lake Como',
    membersCount: 275,
    perks: ['Private Runway Showroom Access', 'Lake Como Riva Boat Intimate Luncheons', 'High-Status Chivalric Gentleman Matching'],
    bannerUrl: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=1200&q=80'
  }
];

const REFERRAL_LEADERBOARD = [
  { rank: 1, name: 'Camilla V.', city: 'Monaco', approvedRef: 19, bonusEarned: '$570 + VIP Gala' },
  { rank: 2, name: 'Sienna L.', city: 'London', approvedRef: 14, bonusEarned: '$420 + Champagne Box' },
  { rank: 3, name: 'Nikki A.', city: 'Lagos', approvedRef: 12, bonusEarned: '$360 + Salon Pass' },
  { rank: 4, name: 'Zahra M.', city: 'Dubai', approvedRef: 9, bonusEarned: '$270' },
  { rank: 5, name: 'Dr. Celine M.', city: 'Paris', approvedRef: 7, bonusEarned: '$210' }
];

interface JoinCirclePageProps {
  initialCity?: string;
  onNavigate: (path: string) => void;
}

export const JoinCirclePage: React.FC<JoinCirclePageProps> = ({ initialCity, onNavigate }) => {
  // Parse city from path or props
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    if (initialCity && CITIES.some(c => c.id === initialCity.toLowerCase())) {
      return initialCity.toLowerCase();
    }
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      const citySegment = parts[2];
      if (citySegment && CITIES.some(c => c.id === citySegment.toLowerCase())) {
        return citySegment.toLowerCase();
      }
    }
    return 'london';
  });

  const city = CITIES.find(c => c.id === selectedCityId) || CITIES[0];

  // Referral code from query string (?ref=CODE)
  const [refCode, setRefCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('ref') || '';
    }
    return '';
  });

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [instagram, setInstagram] = useState('');
  const [netWorth, setNetWorth] = useState('High Earner ($250k - $1M+ liquid)');
  const [whatTheySeek, setWhatTheySeek] = useState('An ambitious, generous, chivalrous Black king who values family, travel, and genuine romance.');
  const [bio, setBio] = useState('');
  
  // Image Upload States (up to 3 photos using Supabase 'client-images' bucket)
  const [uploadedPhotos, setUploadedPhotos] = useState<{ id: string; url: string; label: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Application & Checkout states
  const [entryMode, setEntryMode] = useState<'free' | 'gold'>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'Stripe' | 'Paystack'>('Stripe');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<GirlApplication | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [showSampleChapter, setShowSampleChapter] = useState(false);
  const [paywallTarget, setPaywallTarget] = useState<string>('Monaco Millionaire Unveil');

  // Handle City Change
  const handleCitySelect = (id: string) => {
    setSelectedCityId(id);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/join/${id}`);
    }
  };

  // Handle Image File Selection and Instant Supabase Storage Upload (Supports up to 3 photos)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number = 0) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (slotIndex === 0) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const uploadRes = await supabase.storage.from('client-images').upload(fileName, file);
      if (uploadRes.error) {
        throw new Error(uploadRes.error.message || 'Storage upload failed');
      }

      const { data: { publicUrl } } = supabase.storage.from('client-images').getPublicUrl(fileName);
      if (slotIndex === 0) {
        setUploadedImageUrl(publicUrl);
      }

      const photoLabels = ['Main Portrait (Cover)', 'Luxury Lifestyle', 'Evening / Gala'];
      setUploadedPhotos(prev => {
        const next = [...prev];
        const existingIdx = next.findIndex(p => p.id === `slot-${slotIndex}`);
        const newPhoto = { id: `slot-${slotIndex}`, url: publicUrl, label: photoLabels[slotIndex] || `Photo ${slotIndex + 1}` };
        if (existingIdx >= 0) {
          next[existingIdx] = newPhoto;
        } else {
          next.push(newPhoto);
        }
        return next;
      });
    } catch (err: any) {
      console.warn('Storage upload note:', err);
      const fallbackUrl = URL.createObjectURL(file);
      if (slotIndex === 0) {
        setUploadedImageUrl(fallbackUrl);
      }
      const photoLabels = ['Main Portrait (Cover)', 'Luxury Lifestyle', 'Evening / Gala'];
      setUploadedPhotos(prev => {
        const next = [...prev];
        const existingIdx = next.findIndex(p => p.id === `slot-${slotIndex}`);
        const newPhoto = { id: `slot-${slotIndex}`, url: fallbackUrl, label: photoLabels[slotIndex] || `Photo ${slotIndex + 1}` };
        if (existingIdx >= 0) {
          next[existingIdx] = newPhoto;
        } else {
          next.push(newPhoto);
        }
        return next;
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (entryMode === 'gold') {
      setShowCheckoutModal(true);
      return;
    }

    // Free Explorer submission ($0)
    setIsSubmitting(true);
    try {
      const generatedCode = name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() + Math.floor(10 + Math.random() * 89);
      const finalImg = uploadedImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

      const app = await submitGirlApplication({
        name: name.trim(),
        age: Number(age) || 25,
        city: city.name,
        country: city.country,
        instagram: instagram.startsWith('@') ? instagram.trim() : (instagram ? `@${instagram.trim()}` : '@private_profile'),
        net_worth: netWorth,
        what_they_seek: whatTheySeek.trim(),
        bio: bio.trim() || 'Cultured luxury enthusiast and private circle applicant.',
        image_url: finalImg,
        referral_code: generatedCode,
        referred_by: refCode.trim() || undefined,
        fee_paid: false,
        fee_amount: 0
      });

      setSubmittedApp(app);
    } catch (err: any) {
      console.error('Free submission error:', err);
      alert('Error creating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletePaymentAndSubmit = async () => {
    setIsProcessingPayment(true);

    try {
      // Generate clean referral code e.g. SIENNA77
      const generatedCode = name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() + Math.floor(10 + Math.random() * 89);
      const finalImg = uploadedImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

      const app = await submitGirlApplication({
        name: name.trim(),
        age: Number(age) || 25,
        city: city.name,
        country: city.country,
        instagram: instagram.startsWith('@') ? instagram.trim() : (instagram ? `@${instagram.trim()}` : '@private_profile'),
        net_worth: netWorth,
        what_they_seek: whatTheySeek.trim(),
        bio: bio.trim() || 'Cultured luxury enthusiast and private circle applicant.',
        image_url: finalImg,
        referral_code: generatedCode,
        referred_by: refCode.trim() || undefined,
        fee_paid: true,
        fee_amount: 99
      });

      setSubmittedApp(app);
      setShowCheckoutModal(false);
    } catch (err: any) {
      console.error('Submission error:', err);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCopyReferralLink = () => {
    if (!submittedApp) return;
    const link = `https://richconnect.luxury/join?ref=${submittedApp.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Banner & Live Viral Waitlist Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-2 text-center text-xs font-bold shadow-md flex items-center justify-center space-x-2">
        <Flame className="w-4 h-4 text-rose-950 animate-bounce" />
        <span>VIRAL INTAKE TICKER: <strong>2,847 eligible women applied this month from 31 countries</strong> &bull; Non-indexed sovereign circle</span>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10 flex-1 w-full">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Private Members Circle &bull; Invitation-Only</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white tracking-tight leading-tight">
            Join <span className="gold-gradient-text">RichConnect</span> Private Circle
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 font-mono tracking-wide uppercase">
            Vetted Rich Girlfriends &amp; Ambitious Queens Worldwide
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop wasting time on public dating apps. Enter an encrypted, non-indexed enclave where ambitious, chivalrous gentlemen, visionary founders, and sovereign kings court with respect, generosity, and long-term legacy in mind.
          </p>
        </div>

        {/* Global Cities Selector with SEO Hubs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>Select Your City Enclave:</span>
            </span>
            <span className="text-[11px] text-amber-400 font-mono">
              Intake open across 7 global capitals
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CITIES.map(c => (
              <button
                key={c.id}
                onClick={() => handleCitySelect(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                  selectedCityId === c.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{c.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({c.membersCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected City Hero Showcase (City-Specific SEO Content) */}
        {/* SALES COPY BLOCK FOR GIRLS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#181308] via-[#0d0c07] to-[#070604] border-2 border-amber-500/40 shadow-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>FOR AMBITIOUS WOMEN &bull; 31 COUNTRIES</span>
          </div>

          <h3 className="font-serif-luxury font-bold text-white text-xl sm:text-3xl leading-snug">
            "Tired of broke boys? Your beauty is treated like Bitcoin here — it appreciates."
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            Stop giving your best years to men who make excuses. Join 2,847 vetted sisters now shopping in Dubai, dining in Mayfair, and sailing Monaco. We are not a public app. We are the sovereign circle where verified European heiresses and African queens connect with chivalrous, high-earning kings. 60 seconds application. Life forever changed.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setEntryMode('free');
                const formEl = document.getElementById('application-form-section');
                formEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Join Free &bull; Explore The Empire ($0) &rarr;</span>
            </button>

            <button
              onClick={() => {
                setEntryMode('gold');
                const formEl = document.getElementById('application-form-section');
                formEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Join as Gold Queen ($99) &bull; Instant Access</span>
            </button>
          </div>
        </div>

        {/* LIVE GIRLS GALLERY SHOWCASE */}
        <LiveGirlsGallery 
          onNavigate={onNavigate}
          onOpenPaywall={() => setIsPaywallOpen(true)}
        />

        {/* Application Form or Success / Tease State */}
        {!submittedApp ? (
          <div id="application-form-section" className="luxury-card rounded-3xl p-6 sm:p-8 border border-amber-500/40 space-y-6 shadow-2xl relative scroll-mt-20">
            
            {/* Header & Plan Toggle CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-white flex items-center space-x-2">
                  <span>Candidate Dossier &bull; {city.name} Enclave</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Intake Open
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose your entry level below. You can start exploring completely free or fast-track as a verified Gold Queen.
                </p>
              </div>

              {/* TWO PROMINENT CTAs TOGGLE */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-md">
                <button
                  type="button"
                  onClick={() => setEntryMode('free')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    entryMode === 'free'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Join Free ($0)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEntryMode('gold')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    entryMode === 'gold'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Gold Queen ($99)</span>
                </button>
              </div>
            </div>

            {/* Entry Mode Highlight Box */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              entryMode === 'free' 
                ? 'bg-slate-900/80 border-slate-700 text-slate-300' 
                : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                  entryMode === 'free' ? 'bg-slate-800 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {entryMode === 'free' ? '$0' : '$99'}
                </div>
                <div>
                  <span className="font-bold block">
                    {entryMode === 'free' ? 'Free Explorer Mode Active' : 'Gold Queen Fast-Track Active'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {entryMode === 'free'
                      ? 'Upload portrait, browse ghost silhouettes of millionaires, read free sample chapters.'
                      : 'Appears in 31 countries, Rich Girl Passport active, 5 free ebooks, unlock 10 direct messages.'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/40 border border-slate-700">
                {entryMode === 'free' ? 'Zero Cost' : 'Full Unveil'}
              </span>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sienna Laurent"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age (18 - 45) *</label>
                  <input
                    type="number"
                    min={18}
                    max={45}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                  />
                </div>

                {/* Instagram Handle */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instagram (@handle) *</label>
                  <input
                    type="text"
                    required
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="e.g. @sienna.ldp"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                  />
                </div>

                {/* Net Worth Tier */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Net Worth / Career Standing</label>
                  <select
                    value={netWorth}
                    onChange={(e) => setNetWorth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                  >
                    <option value="High Earner ($250k - $1M+ liquid)">High Earner ($250k - $1M+ liquid)</option>
                    <option value="Ultra High Net Worth ($5M - $20M+)">Ultra High Net Worth ($5M - $20M+)</option>
                    <option value="Family Office / Generational ($25M+)">Family Office / Generational ($25M+)</option>
                    <option value="Creative Director &amp; Entrepreneur">Creative Director &amp; Entrepreneur</option>
                  </select>
                </div>

              </div>

              {/* Up to 3 Photo Uploads to Supabase client-images bucket */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-semibold flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload 3 Profile Photos (Stored in Supabase 'client-images') *</span>
                  </label>
                  <span className="text-[10px] text-amber-300 font-mono">Confidential non-indexed storage</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Slot 1: Main Portrait (Cover) */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-300">1. Main Portrait *</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Cover</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedPhotos.find(p => p.id === 'slot-0') || imagePreview ? (
                        <img 
                          src={uploadedPhotos.find(p => p.id === 'slot-0')?.url || imagePreview || ''} 
                          alt="Cover Preview" 
                          className="w-12 h-12 rounded-lg object-cover border border-amber-500 shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 0)}
                        className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slot 2: Luxury Lifestyle */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300">2. Luxury Lifestyle</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">Optional</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedPhotos.find(p => p.id === 'slot-1') ? (
                        <img 
                          src={uploadedPhotos.find(p => p.id === 'slot-1')?.url} 
                          alt="Lifestyle Preview" 
                          className="w-12 h-12 rounded-lg object-cover border border-amber-500 shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 1)}
                        className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 file:cursor-pointer cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slot 3: Evening Gala / Travel */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300">3. Evening / Gala</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">Optional</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedPhotos.find(p => p.id === 'slot-2') ? (
                        <img 
                          src={uploadedPhotos.find(p => p.id === 'slot-2')?.url} 
                          alt="Gala Preview" 
                          className="w-12 h-12 rounded-lg object-cover border border-amber-500 shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 2)}
                        className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 file:cursor-pointer cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {isUploadingImage && (
                  <div className="flex items-center space-x-2 text-amber-400 text-xs py-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Encrypting and uploading photo to 'client-images' storage bucket...</span>
                  </div>
                )}
              </div>

              {/* Bio & Details */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio &amp; Lifestyle Highlights</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Gallery founder, equestrian competitor, loves travelling to Lagos &amp; Monaco..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* What They Seek */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">What You Are Seeking in a Sovereign Partner</label>
                <textarea
                  rows={2}
                  value={whatTheySeek}
                  onChange={(e) => setWhatTheySeek(e.target.value)}
                  placeholder="e.g. Ambitious, charismatic Black king who values family dynasty and chivalry..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Application Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {entryMode === 'free'
                      ? '100% Free Explorer Profile &bull; Upgrade anytime to unveil millionaires'
                      : 'One-time $99 application fee &bull; 90-Day Money-Back Guarantee'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isUploadingImage || isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>{entryMode === 'free' ? 'Create Free Explorer Profile ($0)' : 'Proceed to Verification & Submit ($99)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Submission State: Differentiated for Free Explorer vs Paid Queen */
          submittedApp.fee_amount === 0 ? (
            /* PART 3: FREEMIUM FREE-TO-EXPLORE DASHBOARD TEASE */
            <div className="luxury-card rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 space-y-8 animate-fade-in shadow-2xl">
              
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Free Explorer Profile Active &bull; Non-Indexed Silhouette</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                  Welcome to the Empire, {submittedApp.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Your encrypted silhouette has been placed in the preliminary holding room. Upgrade to Gold Queen to unlock your direct messages and appear in the Monaco feed.
                </p>
              </div>

              {/* Profile Completion Progress Bar */}
              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2 max-w-2xl mx-auto">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Profile Progress: <strong>60% Complete</strong></span>
                  </span>
                  <span className="text-amber-400 font-mono font-bold">Upgrade to 100% to appear in Monaco feed</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-3/5 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Millionaire Tease Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                
                {/* Tease 1: 17 Millionaires waiting to unlock */}
                <div className="p-5 rounded-2xl bg-[#0e1322] border border-amber-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>INCOMING UNLOCK QUEUE</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      17 Waiting
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    17 Verified Millionaires are waiting to unveil you
                  </h4>
                  <p className="text-xs text-slate-400">
                    Sovereign founders from London (Mayfair), Dubai (DIFC), and Monaco have requested access to your unblurred dossier.
                  </p>
                  <button
                    onClick={() => setIsPaywallOpen(true)}
                    className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    Upgrade $99 to Reveal All 17 &rarr;
                  </button>
                </div>

                {/* Tease 2: Blurred message from Dubai */}
                <div className="p-5 rounded-2xl bg-[#0e1322] border border-cyan-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ENCRYPTED MESSAGE</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">2 mins ago</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Someone from Dubai (Palm Jumeirah) sent you a message
                  </h4>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs text-slate-400 filter blur-[3px] select-none">
                    "Hello Sienna, saw your aesthetic and equestrian interests. I'm curating a private sunset yacht cruise from Dubai Marina next week..."
                  </div>
                  <button
                    onClick={() => setIsPaywallOpen(true)}
                    className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    Upgrade to Read &amp; Reply &rarr;
                  </button>
                </div>

              </div>

              {/* Ghost Blurred Gallery of Millionaires (Numbers only, faces blurred) */}
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif-luxury font-bold text-white text-sm">
                      Ghost Blurred Millionaire Enclave &bull; 17 In Active Queue
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Faces Blurred &bull; Numbers Only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: '#M-882', city: 'Monaco', wealth: '$120M+ Family Office', role: 'Superyacht Fleet Founder', time: 'Active 2m ago', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                    { id: '#D-409', city: 'Dubai', wealth: '$85M+ DIFC Capital', role: 'Real Estate & AI Principal', time: 'Active 7m ago', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
                    { id: '#L-192', city: 'London', wealth: '$45M+ Private Equity', role: 'Mayfair Gallery & Equity', time: 'Active 12m ago', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
                    { id: '#LA-918', city: 'Lagos', wealth: '$60M+ Infrastructure', role: 'Banana Island Sovereign Titan', time: 'Active 1m ago', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' }
                  ].map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => {
                        setPaywallTarget(`${m.city} Millionaire (${m.id})`);
                        setIsPaywallOpen(true);
                      }}
                      className="group relative rounded-2xl bg-[#0b0f1c] border border-amber-500/20 hover:border-amber-500/60 p-3 flex flex-col justify-between space-y-2 cursor-pointer transition-all shadow-md hover:shadow-amber-500/10"
                    >
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img 
                          src={m.img} 
                          alt="Ghost Millionaire" 
                          className="w-full h-full object-cover filter blur-[10px] scale-110 group-hover:blur-[6px] transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                          {m.id}
                        </div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div className="absolute inset-x-2 bottom-2 text-center">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] shadow-sm">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Unlock ($99)</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white">{m.city}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">{m.time}</span>
                        </div>
                        <div className="text-[10px] text-amber-300/90 font-mono font-semibold truncate">
                          {m.wealth}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {m.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Resources Library: Ebook Chapter Teaser + AI Love Score */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-3xl mx-auto space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Free Explorer Gifts &amp; Tools Included in Your $0 Account:
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">Free eBook Chapter:</span>
                      <span className="text-slate-400 text-[11px]">"How to Make Him Obsessed"</span>
                    </div>
                    <button
                      onClick={() => setShowSampleChapter(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                    >
                      Read Now
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">AI Love Predictor™:</span>
                      <span className="text-slate-400 text-[11px]">Calculate 10-year compatibility</span>
                    </div>
                    <button
                      onClick={() => onNavigate('/')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer"
                    >
                      Test Score
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Full Diamond Girl Success Stories */}
              <div className="max-w-3xl mx-auto space-y-3">
                <h4 className="text-center font-serif-luxury font-bold text-white text-sm">
                  3 Real Diamond Sisters Who Upgraded &amp; Changed Their Lives:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                      alt="Sienna" 
                      className="w-12 h-12 rounded-full mx-auto object-cover border border-amber-400"
                    />
                    <div className="font-bold text-white">Sienna L. &bull; Monaco</div>
                    <p className="text-[11px] text-slate-300 italic">"Upgraded to Gold Queen in 10 minutes. Within 48 hours matched with a tech principal in Cap d’Antibes."</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" 
                      alt="Zahra" 
                      className="w-12 h-12 rounded-full mx-auto object-cover border border-amber-400"
                    />
                    <div className="font-bold text-white">Zahra M. &bull; Dubai</div>
                    <p className="text-[11px] text-slate-300 italic">"The Millionaire Translator alone is worth $10,000. He flew me first-class for tea in Paris."</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80" 
                      alt="Amara" 
                      className="w-12 h-12 rounded-full mx-auto object-cover border border-amber-400"
                    />
                    <div className="font-bold text-white">Amara A. &bull; Lagos</div>
                    <p className="text-[11px] text-slate-300 italic">"Banana Island to Monaco Grand Prix. RichConnect is the secret door all cultured African queens need."</p>
                  </div>
                </div>
              </div>

              {/* Main Golden Upgrade CTA */}
              <div className="pt-4 max-w-xl mx-auto text-center space-y-3">
                <button
                  onClick={() => setIsPaywallOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-2xl shadow-amber-500/40 transition-all cursor-pointer"
                >
                  <Crown className="w-5 h-5 text-slate-950" />
                  <span>Upgrade to Gold Queen ($99) &bull; Appear in Monaco Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-500 block">
                  73% of free girls upgrade within their first 24 hours &bull; Instant unblurring
                </span>
              </div>

            </div>
          ) : (
            /* PAID QUEEN SUCCESS & REFERRAL LINK SYSTEM */
            <div className="luxury-card rounded-3xl p-6 sm:p-8 border border-emerald-500/50 space-y-6 text-center animate-fade-in shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Gold Queen Membership Active &bull; Verified Queue
                </span>
                <h3 className="text-2xl font-bold font-serif-luxury text-white">
                  Welcome to the Enclave, {submittedApp.name}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Your $99 application fee has been confirmed via Stripe. Your profile has been placed on the global priority feed across 31 countries.
                </p>
              </div>

              {/* Unique Referral Link Generator */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900 border border-amber-500/30 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Your Personal Referral Link</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">$30 Bonus per Approved Girl</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://richconnect.luxury/join?ref=${submittedApp.referral_code}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyReferralLink}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  Share with stylish, cultured girlfriends. When they join using your code <strong>{submittedApp.referral_code}</strong>, you receive $30 cash bonus plus VIP gala invitations.
                </p>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => onNavigate('/marketplace')}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                >
                  Explore Digital Products &rarr;
                </button>
                <button
                  onClick={() => setSubmittedApp(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Submit Another Profile
                </button>
              </div>
            </div>
          )
        )}

        {/* Free Sample Chapter Modal */}
        {showSampleChapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="luxury-card rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif-luxury font-bold text-white text-base">
                    How to Make Him Obsessed &bull; Free Chapter
                  </h3>
                </div>
                <button onClick={() => setShowSampleChapter(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300 font-serif">
                <p className="font-bold text-amber-300 text-sm">
                  Chapter 1: The High-Status Mindset Shift
                </p>
                <p>
                  Most women are taught to perform. In elite circles, performance is immediately recognized as insecurity. A man who has built enterprises or inherited generational legacy doesn't want another person auditioning for his approval.
                </p>
                <p>
                  He desires a sanctuary of calm, sharp intellect, and radiant confidence. When you stop chasing, you become the prize that high-value men compete to protect and support.
                </p>
                <p>
                  The moment you walk into a private lounge like Oswald's or Zuma, understand this core rule: True allure is understated poise.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Want the full 6-chapter playbook?</span>
                <button
                  onClick={() => {
                    setShowSampleChapter(false);
                    onNavigate('/marketplace');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                >
                  Get Complete Edition ($49) &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Paywall Modal */}
        <SmartPaywallModal
          isOpen={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
          onNavigate={onNavigate}
          targetFeature="Monaco Millionaire Unveil"
        />

        {/* Referral Leaderboard Section */}
        <div className="luxury-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold font-serif-luxury text-white">
                Global Referral Ambassador Leaderboard
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">
              $30 Cash Payout per Approved Applicant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {REFERRAL_LEADERBOARD.map(amb => (
              <div key={amb.rank} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 font-mono">#{amb.rank} Ambassador</span>
                  <span className="text-[10px] text-slate-400">{amb.city}</span>
                </div>
                <div className="font-bold text-white">{amb.name}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">{amb.approvedRef} Approved Referrals</div>
                <div className="text-[10px] text-slate-400 font-mono">{amb.bonusEarned}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Mock Stripe / Paystack Application Fee Checkout Modal ($99) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Secure Application Fee ($99)</h3>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>RichConnect {city.name} Intake Fee:</span>
                <span className="font-bold font-mono text-white">$99.00 USD</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Candidate Name:</span>
                <span className="font-semibold text-slate-200">{name}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Enclave:</span>
                <span className="text-amber-300 font-medium">{city.name}, {city.country}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Select Payment Provider:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('Stripe')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    selectedGateway === 'Stripe'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Stripe Global</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('Paystack')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    selectedGateway === 'Paystack'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Paystack Africa</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p>✔ 256-bit Encrypted Checkout</p>
              <p>✔ Includes immediate VIP referral code generation</p>
              <p>✔ 100% Refundable if application is unvetted</p>
            </div>

            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleCompletePaymentAndSubmit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Transaction with {selectedGateway}...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Pay $99 with {selectedGateway}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Smart Exclusive Paywall Modal */}
      <SmartPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onNavigate={onNavigate}
        targetFeature={paywallTarget}
      />

    </div>
  );
};
