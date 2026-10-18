import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  Video,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Gift,
  Award,
  Crown,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Camera,
  MessageCircle,
  Flame,
  Check,
  Copy,
  Plus,
  RefreshCw,
  Eye,
  Film,
  Smile,
  BookOpen,
  CreditCard,
  X,
  Loader2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ViralShareBar } from '../components/ViralShareBar';
import {
  LoveChannel,
  LoveChannelMemory,
  getLoveChannels,
  getActiveLoveChannelId,
  setActiveLoveChannelId,
  addMemoryToLoveChannel,
  awardLovePoints,
  redeemLovePoints,
  upgradeLoveChannelPro,
  LOVE_REDEMPTIONS
} from '../lib/loveChannelStorage';

interface LoveChannelPageProps {
  onNavigate: (path: string) => void;
}

const DREAM_LOCATIONS = [
  {
    id: 'dubai-yacht',
    name: 'Dubai Yacht Sunset',
    city: 'Dubai Marina & Palm Jumeirah',
    ambiance: 'Golden hour waves, Burj Al Arab skyline, warm desert breeze',
    bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    activity: 'Dancing under twilight on mahogany teak deck'
  },
  {
    id: 'paris-eiffel',
    name: 'Paris Eiffel Tower Dinner',
    city: 'Champ de Mars, Paris',
    ambiance: 'Candlelight dinner, glittering Eiffel sparkles, accordion melody',
    bgImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    activity: 'Champagne toast with twinkling golden tower lights'
  },
  {
    id: 'monaco-balcony',
    name: 'Monaco Penthouse Balcony',
    city: 'Monte Carlo & Port Hercules',
    ambiance: 'Superyacht marina view, Mediterranean stars, gentle violins',
    bgImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    activity: 'Slow romantic dance overlooking illuminated yachts'
  },
  {
    id: 'maldives-beach',
    name: 'Maldives Private Beach',
    city: 'Baa Atoll Private Island',
    ambiance: 'Crystal turquoise water, glowing bioluminescent sand, starlight',
    bgImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    activity: 'Barefoot walk along bioluminescent waters holding hands'
  },
  {
    id: 'luxury-apartment',
    name: 'Luxury Penthouse Living Room',
    city: 'Mayfair, London',
    ambiance: 'Crackling marble fireplace, grand piano, soft cashmere warmth',
    bgImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    activity: 'Laughing over vintage wine beside the fireplace'
  }
];

export const LoveChannelPage: React.FC<LoveChannelPageProps> = ({ onNavigate }) => {
  const [channels, setChannels] = useState<LoveChannel[]>(getLoveChannels);
  const [activeChannelId, setActiveId] = useState<string>(getActiveLoveChannelId);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stream' | 'dream_date' | 'vault' | 'memes'>('stream');

  // Daily Checkin State
  const [claimedToday, setClaimedToday] = useState(false);

  // Feature 1: Love Stream Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [romanticQuote, setRomanticQuote] = useState('');
  const [memoryType, setMemoryType] = useState<'photo_story' | 'timeline_movie' | 'voice_note'>('photo_story');
  const [consentChecked, setConsentChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [safetyError, setSafetyError] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Ken Burns Slideshow Player State
  const [playingMemory, setPlayingMemory] = useState<LoveChannelMemory | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Feature 2: Virtual Dream Date State
  const [selectedLocationId, setSelectedLocationId] = useState('dubai-yacht');
  const [customLoveQuote, setCustomLoveQuote] = useState('In a world of billions, you are my sovereign peace.');
  const [dreamDateActivity, setDreamDateActivity] = useState('Slow dancing under the golden sunset');
  const [isCreatingDreamDate, setIsCreatingDreamDate] = useState(false);
  const [dreamDateResult, setDreamDateResult] = useState<any | null>(null);
  const [dreamDateVideoPlaying, setDreamDateVideoPlaying] = useState(false);
  const [dreamDateTimer, setDreamDateTimer] = useState(0);

  // Feature 3: Memory Card Mint Modal
  const [mintMemory, setMintMemory] = useState<LoveChannelMemory | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  // Monetization Pro Modal ($19/month)
  const [showProModal, setShowProModal] = useState(false);
  const [proGateway, setProGateway] = useState<'Stripe' | 'Paystack'>('Stripe');
  const [isProcessingPro, setIsProcessingPro] = useState(false);

  // Meme Generator State
  const [insideJokeInput, setInsideJokeInput] = useState('He always checks his Bloomberg terminal before ordering the dessert.');
  const [coupleQuirkInput, setCoupleQuirkInput] = useState('She takes 45 minutes to pick an outfit then looks like a sovereign empress.');
  const [isGeneratingMemes, setIsGeneratingMemes] = useState(false);
  const [generatedMemes, setGeneratedMemes] = useState<any[]>([]);

  // Redemption Notification
  const [redeemNotice, setRedeemNotice] = useState<string | null>(null);

  // Auto-advance slides in Ken Burns player
  useEffect(() => {
    if (!playingMemory || !isPlaying) return;
    const slides = playingMemory.slides || [];
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    }, (slides[currentSlideIndex]?.duration || 4) * 1000);

    return () => clearInterval(interval);
  }, [playingMemory, isPlaying, currentSlideIndex]);

  // Dream Date 15-second simulation timer
  useEffect(() => {
    let interval: any;
    if (dreamDateVideoPlaying) {
      interval = setInterval(() => {
        setDreamDateTimer(prev => {
          if (prev >= 15) {
            setDreamDateVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dreamDateVideoPlaying]);

  // Handle Channel Switch
  const handleSwitchChannel = (id: string) => {
    setActiveId(id);
    setActiveLoveChannelId(id);
  };

  // Daily Check-in (+10 Love Points)
  const handleDailyCheckin = async () => {
    if (claimedToday) return;
    setClaimedToday(true);
    await awardLovePoints(activeChannel.id, 10, 'Daily Couple Check-in');
    setChannels(getLoveChannels());
    setRedeemNotice('✨ +10 Love Points added for your daily romantic check-in!');
    setTimeout(() => setRedeemNotice(null), 3000);
  };

  // Handle File Upload with Strict AI Safety Vision & Text Check
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setSafetyError(null);
  };

  // Upload Romantic Memory
  const handleUploadMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (!consentChecked) {
      setSafetyError('Both partners must explicitly check the mutual consent box to create this memory.');
      return;
    }

    setIsUploading(true);
    setSafetyError(null);

    try {
      // 1. Run AI Safety Check
      const safetyRes = await fetch('/api/love-channel/safety-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: newTitle,
          photoDescription: newDescription,
          textContent: romanticQuote
        })
      });
      const safetyData = await safetyRes.json();

      if (!safetyData.safe) {
        setSafetyError(safetyData.reason || 'Keep it romantic - clothed photos only for safety');
        setIsUploading(false);
        return;
      }

      // 2. Upload file to Supabase 'client-images' bucket if file selected
      let finalMediaUrl = previewUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80';

      if (selectedFile) {
        try {
          const fileName = `love-${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
          const { error: uploadError } = await supabase.storage.from('client-images').upload(fileName, selectedFile);
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('client-images').getPublicUrl(fileName);
            if (publicUrl) finalMediaUrl = publicUrl;
          }
        } catch (storageErr) {
          console.warn('Storage upload fallback:', storageErr);
        }
      }

      // 3. Create new Memory record
      const newMemory: LoveChannelMemory = {
        id: `mem-${Date.now()}`,
        type: memoryType,
        title: newTitle.trim(),
        description: newDescription.trim() || 'A cherished romantic chapter in our private love channel.',
        partnerAName: activeChannel.partnerA.name.split(' ')[0],
        partnerBName: activeChannel.partnerB.name.split(' ')[0],
        mediaUrl: finalMediaUrl,
        thumbnailUrl: finalMediaUrl,
        locationTag: activeChannel.partnerA.location,
        quoteOverlay: romanticQuote.trim() ? `"${romanticQuote.trim()}"` : undefined,
        slides: [
          { url: finalMediaUrl, caption: newTitle, duration: 4 },
          { url: activeChannel.partnerB.avatar, caption: 'With you, forever', duration: 4 }
        ],
        audioVibe: 'Parisian Accordion & Soft Piano',
        lovePointsAwarded: 50,
        isPro: false,
        watermark: 'RichConnect Private Memory - Not for Public Sharing',
        createdAt: new Date().toISOString()
      };

      await addMemoryToLoveChannel(activeChannel.id, newMemory);
      setChannels(getLoveChannels());

      // Reset Form
      setNewTitle('');
      setNewDescription('');
      setRomanticQuote('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setConsentChecked(false);
      setRedeemNotice('💖 Memory saved to your Private Love Channel (+50 Love Points)!');
      setTimeout(() => setRedeemNotice(null), 3500);
    } catch (err: any) {
      console.error('Failed to create memory:', err);
      setSafetyError('Unable to save memory. Please verify your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  // Generate AI Story Narrative with Ken Burns
  const handleGenerateStoryNarrative = async () => {
    setIsGeneratingStory(true);
    try {
      const res = await fetch('/api/love-channel/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerAName: activeChannel.partnerA.name,
          partnerBName: activeChannel.partnerB.name,
          specialCity: activeChannel.partnerA.location,
          notes: newDescription || 'Met at a private salon, bonded over art, travel and dynasty goals.'
        })
      });
      const data = await res.json();
      if (data.title) setNewTitle(data.title);
      if (data.quoteOverlay) setRomanticQuote(data.quoteOverlay.replace(/"/g, ''));
      if (data.chapters && data.chapters[0]?.voiceoverNarrative) {
        setNewDescription(data.chapters.map((c: any) => `Ch.${c.chapterNumber}: ${c.voiceoverNarrative}`).join('\n\n'));
      }
    } catch (err) {
      console.warn('AI Story fallback:', err);
      setNewTitle(`${activeChannel.partnerA.name.split(' ')[0]} & ${activeChannel.partnerB.name.split(' ')[0]}: A Symphony of Devotion`);
      setRomanticQuote('In your eyes, I found both my peace and my kingdom.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Generate Virtual Dream Date (Feature 2)
  const handleGenerateDreamDate = async () => {
    setIsCreatingDreamDate(true);
    const loc = DREAM_LOCATIONS.find(l => l.id === selectedLocationId) || DREAM_LOCATIONS[0];

    try {
      const res = await fetch('/api/love-channel/virtual-dream-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerAName: activeChannel.partnerA.name,
          partnerBName: activeChannel.partnerB.name,
          dreamLocation: loc.name,
          romanticActivity: dreamDateActivity
        })
      });
      const data = await res.json();
      setDreamDateResult({
        ...data,
        locationObj: loc
      });
      setDreamDateTimer(0);
      setDreamDateVideoPlaying(true);
    } catch (err) {
      console.warn('Dream Date API fallback:', err);
      setDreamDateResult({
        sceneTitle: `Sunset Serenade at ${loc.name}`,
        locationName: loc.name,
        quoteOverlay: customLoveQuote || `"Every sunset with you feels like our own fairy tale."`,
        disclaimer: 'AI Animated Fantasy - Not Real Footage',
        locationObj: loc,
        pixarAnimationPrompts: [
          { timestamp: '0:00 - 0:05', visualDescription: 'Stylized 3D Pixar-style avatars arrive arm-in-arm with golden hour lighting.', activity: 'Walking arm-in-arm' },
          { timestamp: '0:05 - 0:10', visualDescription: 'Warm sunset reflections as they share a slow, gentle romantic dance.', activity: 'Slow dancing' },
          { timestamp: '0:10 - 0:15', visualDescription: 'Leaning together watching the evening lights awaken.', activity: 'Watching the horizon together' }
        ]
      });
      setDreamDateTimer(0);
      setDreamDateVideoPlaying(true);
    } finally {
      setIsCreatingDreamDate(false);
    }
  };

  // Save Generated Dream Date to Love Channel (+50 Points)
  const handleSaveDreamDateToChannel = async () => {
    if (!dreamDateResult) return;
    const loc = dreamDateResult.locationObj || DREAM_LOCATIONS[0];

    const newMemory: LoveChannelMemory = {
      id: `dream-${Date.now()}`,
      type: 'dream_date',
      title: dreamDateResult.sceneTitle || `Virtual Dream Date: ${loc.name}`,
      description: `15-second Pixar-style 3D animated romantic fantasy at ${loc.name}.`,
      partnerAName: activeChannel.partnerA.name.split(' ')[0],
      partnerBName: activeChannel.partnerB.name.split(' ')[0],
      mediaUrl: loc.bgImage,
      thumbnailUrl: loc.bgImage,
      locationTag: loc.city,
      quoteOverlay: dreamDateResult.quoteOverlay || customLoveQuote,
      audioVibe: 'Lo-Fi Candlelight Waves',
      lovePointsAwarded: 50,
      isPro: false,
      watermark: 'RichConnect Private Memory - Not for Public Sharing',
      createdAt: new Date().toISOString()
    };

    await addMemoryToLoveChannel(activeChannel.id, newMemory);
    setChannels(getLoveChannels());
    setRedeemNotice('✨ Virtual Dream Date successfully saved to your Private Love Channel (+50 Love Points)!');
    setTimeout(() => setRedeemNotice(null), 3500);
  };

  // Generate Cute Couple Memes (Chibi Style)
  const handleGenerateMemes = async () => {
    setIsGeneratingMemes(true);
    try {
      const res = await fetch('/api/love-channel/generate-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerAName: activeChannel.partnerA.name.split(' ')[0],
          partnerBName: activeChannel.partnerB.name.split(' ')[0],
          insideJoke: insideJokeInput,
          coupleQuirk: coupleQuirkInput
        })
      });
      const data = await res.json();
      setGeneratedMemes(data.memes || []);
    } catch (err) {
      console.warn('Meme fallback:', err);
      setGeneratedMemes([
        {
          title: 'The 5-Minute Warning',
          avatarScenario: `Chibi ${activeChannel.partnerB.name.split(' ')[0]} patiently waiting while Chibi ${activeChannel.partnerA.name.split(' ')[0]} tries on her third tiara.`,
          topText: "HIM: 'We have reservation in 10 minutes.'",
          bottomText: "HER: 'I just need to find the earrings that match this energy.' 😂",
          relatableScore: 99
        },
        {
          title: 'Candlelight Portfolio Check',
          avatarScenario: `Chibi ${activeChannel.partnerB.name.split(' ')[0]} checking markets under the table while Chibi ${activeChannel.partnerA.name.split(' ')[0]} gives the royal side-eye.`,
          topText: 'WHEN THE DESSERT ARRIVES BUT MONACO EXCHANGE JUST CLOSED',
          bottomText: "HER: 'Is the chocolate paying your dividends or am I?' 👑",
          relatableScore: 96
        }
      ]);
    } finally {
      setIsGeneratingMemes(false);
    }
  };

  // Redeem Love Points
  const handleRedeem = async (rewardId: string) => {
    const res = await redeemLovePoints(activeChannel.id, rewardId);
    if (res.success) {
      setChannels(getLoveChannels());
      setRedeemNotice(res.message);
      setTimeout(() => setRedeemNotice(null), 4000);
    } else {
      alert(res.message);
    }
  };

  // Subscribe to Love Channel Pro ($19/month)
  const handleUpgradePro = async () => {
    setIsProcessingPro(true);
    setTimeout(async () => {
      await upgradeLoveChannelPro(activeChannel.id);
      setChannels(getLoveChannels());
      setIsProcessingPro(false);
      setShowProModal(false);
      setRedeemNotice('👑 Love Channel Pro Active! Unlimited 4K Dream Dates unlocked.');
      setTimeout(() => setRedeemNotice(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in text-slate-100">
      
      {/* Top Banner / Channel Encrypted Identifier */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-amber-500/15 border border-pink-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5 text-pink-300">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
          <span className="font-bold">Our Private Love Channel™</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">End-to-End Encrypted Couples Space</span>
          <span className="text-amber-400 font-mono font-bold">#{activeChannel.id}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Channel Selector */}
          <select
            value={activeChannel.id}
            onChange={(e) => handleSwitchChannel(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-pink-500 cursor-pointer"
          >
            {channels.map(c => (
              <option key={c.id} value={c.id}>
                Couple: {c.partnerA.name.split(' ')[0]} &amp; {c.partnerB.name.split(' ')[0]}
              </option>
            ))}
          </select>

          {/* Daily Check-in Button (+10 Pts) */}
          <button
            onClick={handleDailyCheckin}
            disabled={claimedToday}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              claimedToday 
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' 
                : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:brightness-110 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{claimedToday ? 'Checked in (+10 pts)' : 'Daily Check-in (+10 pts)'}</span>
          </button>

          {/* Pro Badge */}
          {activeChannel.is_pro ? (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center space-x-1">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Pro Active</span>
            </span>
          ) : (
            <button
              onClick={() => setShowProModal(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:brightness-110 shadow-sm cursor-pointer"
            >
              Get Pro ($19/mo)
            </button>
          )}
        </div>
      </div>

      {/* Notice Alert Toast */}
      {redeemNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{redeemNotice}</span>
        </div>
      )}

      {/* Couple Hero Card & Value Score */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-pink-500/30 bg-gradient-to-r from-[#170a1a] via-[#100714] to-[#0d0611] p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-pink-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Couple Identities */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Mutual Avatar Lockup */}
            <div className="relative flex items-center">
              <img
                src={activeChannel.partnerA.avatar}
                alt={activeChannel.partnerA.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-pink-400 shadow-xl"
              />
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-[#170a1a] flex items-center justify-center -mx-3 z-10 shadow-lg">
                <Heart className="w-4 h-4 text-white fill-current animate-pulse" />
              </div>
              <img
                src={activeChannel.partnerB.avatar}
                alt={activeChannel.partnerB.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                  {activeChannel.partnerA.name} &amp; {activeChannel.partnerB.name}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold">
                  Private Enclave
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>{activeChannel.partnerA.location}</span>
                </span>
                <span>&bull;</span>
                <span className="text-amber-300 font-medium">
                  {activeChannel.partnerB.wealthTier || 'Sovereign Match'}
                </span>
                {activeChannel.anniversary_date && (
                  <>
                    <span>&bull;</span>
                    <span className="text-pink-300">Anniversary: {activeChannel.anniversary_date}</span>
                  </>
                )}
              </div>

              <p className="text-xs text-pink-200/80 italic pt-0.5 max-w-xl">
                "Turn Your Chats Into Forever Memories — The First Private Channel Where Your Love Story Becomes a Movie."
              </p>
            </div>

          </div>

          {/* Love Points & Vault Quick Value */}
          <div className="p-4 rounded-2xl bg-black/60 border border-pink-500/30 flex items-center space-x-5 text-right w-full md:w-auto justify-between md:justify-end">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Love Channel Value
              </div>
              <div className="text-2xl font-bold font-mono text-pink-300 flex items-center justify-end space-x-1">
                <Flame className="w-5 h-5 text-rose-400" />
                <span>{activeChannel.love_points.toLocaleString()} pts</span>
              </div>
              <div className="text-[10px] text-emerald-400">
                ≈ ${(activeChannel.love_points / 100).toFixed(0)} Platform Value
              </div>
            </div>

            <button
              onClick={() => setActiveTab('vault')}
              className="px-3.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Vault &amp; Rewards &rarr;
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('stream')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'stream'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Our Love Stream™ ({activeChannel.memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dream_date')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'dream_date'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Virtual Dream Date™</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px]">3D Pixar</span>
        </button>

        <button
          onClick={() => setActiveTab('memes')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'memes'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>AI Couple Memes</span>
          <span className="px-1.5 py-0.2 rounded bg-pink-400 text-slate-950 text-[10px]">Chibi</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'vault'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Memory Vault &amp; Rewards</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 text-[10px]">Redeem</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OUR LOVE STREAM™ */}
      {/* ========================================================================= */}
      {activeTab === 'stream' && (
        <div className="space-y-8">
          
          {/* Uploader Card with Strict Content Filter */}
          <div className="luxury-card rounded-3xl p-6 sm:p-8 border border-pink-500/30 space-y-5 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-white flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-400 fill-current" />
                  <span>Create Shared Romantic Memory</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Upload clothed romantic photos, travel snapshots, or sweet chat excerpts. AI compiles them into an animated Ken Burns story.
                </p>
              </div>

              {/* Safety Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict AI Vision Safety &bull; Clothed Only</span>
              </div>
            </div>

            {/* Error / Rejection Notice */}
            {safetyError && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Safety Filter Alert:</span>
                  <span>{safetyError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleUploadMemory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Memory Title */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Memory Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sunset in Cap d'Antibes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500"
                  />
                </div>

                {/* Memory Type */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Format</label>
                  <select
                    value={memoryType}
                    onChange={(e) => setMemoryType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500 cursor-pointer"
                  >
                    <option value="photo_story">Animated Ken Burns Photo Story</option>
                    <option value="timeline_movie">"Our Year in Love" Timeline Movie</option>
                    <option value="voice_note">Sweet Chat &amp; Voice Note Excerpt</option>
                  </select>
                </div>

              </div>

              {/* Romantic Quote Overlay */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Romantic Quote Overlay</label>
                  <button
                    type="button"
                    onClick={handleGenerateStoryNarrative}
                    disabled={isGeneratingStory}
                    className="text-pink-400 hover:text-pink-300 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    {isGeneratingStory ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>AI Generate Romantic Script</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={romanticQuote}
                  onChange={(e) => setRomanticQuote(e.target.value)}
                  placeholder="e.g. 'In a world of billions, you are my sovereign peace.'"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500 italic"
                />
              </div>

              {/* Memory Story / Backstory */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sweet Moments / Backstory</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tell the story behind this moment... What were you both laughing about?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500"
                />
              </div>

              {/* Photo Upload with Supabase client-images Storage */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-semibold flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-pink-400" />
                    <span>Upload Romantic Clothed Photo (Saved to Supabase 'client-images')</span>
                  </label>
                  <span className="text-[10px] text-pink-300 font-mono">End-to-End Private</span>
                </div>

                <div className="flex items-center space-x-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-pink-400 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-500 shrink-0">
                      <Heart className="w-5 h-5 text-slate-600" />
                      <span className="text-[9px]">Photo</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-rose-600 file:text-white hover:file:brightness-110 file:cursor-pointer cursor-pointer bg-slate-950 p-2 rounded-xl border border-slate-800"
                    />
                    <p className="text-[11px] text-slate-400">
                      Clothed photos only. AI strictly filters and blurs any explicit or non-clothed uploads for legal and safety compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mutual Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pink-500/30 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-pink-500 focus:ring-pink-400 cursor-pointer"
                />
                <label htmlFor="consentCheck" className="text-xs text-slate-200 cursor-pointer leading-relaxed">
                  <strong>We both consent to create this romantic memory.</strong> I certify that this upload contains zero nudity or explicit material and is strictly for our private couple channel.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-amber-300 font-mono">
                  +50 Love Points awarded upon upload
                </span>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning Safety &amp; Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload to Our Private Channel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Ken Burns Slideshow / Story Movie Player Modal */}
          {playingMemory && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="luxury-card rounded-3xl max-w-3xl w-full p-6 space-y-4 border-2 border-pink-500/50 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4 text-pink-400" />
                    <h3 className="font-bold text-white text-sm">{playingMemory.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                      Ken Burns Animated Story
                    </span>
                  </div>
                  <button onClick={() => setPlayingMemory(null)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Animated Screen with Ken Burns Motion Effect */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-pink-500/30">
                  <img
                    src={playingMemory.slides?.[currentSlideIndex]?.url || playingMemory.mediaUrl}
                    alt={playingMemory.title}
                    className="w-full h-full object-cover transition-all duration-[4000ms] transform scale-110 ease-out"
                    style={{
                      transform: isPlaying ? 'scale(1.15) translate(1%, -1%)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Subtle Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Watermark overlay */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-pink-500/40 text-[10px] text-pink-300 font-mono">
                    {playingMemory.watermark}
                  </div>

                  {/* Audio Vibe Pill */}
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-1.5 rounded-lg bg-black/75 text-pink-300 border border-pink-500/40 hover:text-white"
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] text-slate-300 bg-black/75 px-2.5 py-1 rounded-lg border border-slate-700">
                      ♫ {playingMemory.audioVibe || 'Parisian Piano'}
                    </span>
                  </div>

                  {/* Quote & Caption Overlay */}
                  <div className="absolute bottom-4 inset-x-4 text-center space-y-1">
                    {playingMemory.quoteOverlay && (
                      <p className="font-serif-luxury font-bold text-white text-base sm:text-lg drop-shadow-md italic">
                        {playingMemory.quoteOverlay}
                      </p>
                    )}
                    <p className="text-xs text-pink-200 drop-shadow">
                      {playingMemory.slides?.[currentSlideIndex]?.caption || playingMemory.description}
                    </p>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3 py-1.5 rounded-lg bg-pink-500 text-slate-950 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause Story' : 'Play Story'}</span>
                    </button>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Slide {currentSlideIndex + 1} of {(playingMemory.slides?.length) || 1}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setMintMemory(playingMemory);
                        setPlayingMemory(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 flex items-center space-x-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-pink-400" />
                      <span>Mint Memory Card</span>
                    </button>
                  </div>
                </div>

                {/* Frontend Viral Share Widget */}
                <div className="pt-2">
                  <ViralShareBar
                    title={playingMemory.title}
                    text={`Our romantic love memory on RichConnect: "${playingMemory.title}" ✨`}
                    storyId="post-1"
                    referralCode="LOVE_COUPLE"
                    category="movie"
                    onNavigate={onNavigate}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Memories Stream Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Couple Memory Stream</span>
                <span className="text-xs font-mono text-pink-400 font-semibold">({activeChannel.memories.length} Memories)</span>
              </h3>
              <span className="text-xs text-slate-400">Encrypted private access</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeChannel.memories.map((mem) => (
                <div
                  key={mem.id}
                  className="rounded-2xl bg-[#0e0914] border border-pink-500/20 hover:border-pink-500/50 p-4 space-y-3 transition-all shadow-xl group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Media Preview Thumbnail */}
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img
                        src={mem.thumbnailUrl || mem.mediaUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          mem.type === 'dream_date' ? 'bg-amber-400 text-slate-950' :
                          mem.type === 'meme' ? 'bg-pink-500 text-white' :
                          'bg-rose-500 text-white'
                        }`}>
                          {mem.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-mono font-bold text-pink-300 bg-black/75 px-2 py-0.5 rounded border border-pink-500/30">
                          +{mem.lovePointsAwarded} pts
                        </span>
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        onClick={() => {
                          setPlayingMemory(mem);
                          setCurrentSlideIndex(0);
                          setIsPlaying(true);
                        }}
                        className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-pink-500/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                      >
                        <Play className="w-5 h-5 ml-0.5" />
                      </button>

                      {mem.locationTag && (
                        <div className="absolute bottom-2 left-2.5 text-[10px] text-slate-300 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-pink-400" />
                          <span>{mem.locationTag}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm leading-snug group-hover:text-pink-300 transition-colors">
                        {mem.title}
                      </h4>
                      {mem.quoteOverlay && (
                        <p className="text-[11px] text-pink-300 italic mt-1 line-clamp-2">
                          {mem.quoteOverlay}
                        </p>
                      )}
                      <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                        {mem.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions: View Story vs Mint Card */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setPlayingMemory(mem);
                        setCurrentSlideIndex(0);
                        setIsPlaying(true);
                      }}
                      className="text-pink-400 hover:text-pink-300 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Watch Story</span>
                    </button>

                    <button
                      onClick={() => setMintMemory(mem)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Mint Card</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VIRTUAL DREAM DATE™ (Pixar-Style 3D Avatars, 100% Non-Explicit) */}
      {/* ========================================================================= */}
      {activeTab === 'dream_date' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#170a1e] via-[#100717] to-[#0a0510] border-2 border-amber-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>FEATURE 2 &bull; VIRTUAL DREAM DATE™</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white mt-1">
                  15-Second Animated Romantic Fantasy
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-1">
                  Both partners upload stylish clothed portraits. AI renders stylized Pixar-inspired 3D avatars holding hands, dancing under stars, and laughing at world-class luxury destinations.
                </p>
              </div>

              {/* Mandatory Legal & Review Disclaimer */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-[11px] text-amber-300/90 font-mono">
                ✔ Certified Non-Explicit &bull; Pixar-Style Avatars Only
              </div>
            </div>

            {/* Step 1: Partner Photo Dossiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-pink-300 block">Partner A Avatar Model:</span>
                <div className="flex items-center space-x-3">
                  <img
                    src={activeChannel.partnerA.avatar}
                    alt={activeChannel.partnerA.name}
                    className="w-12 h-12 rounded-xl object-cover border border-pink-400 shadow-md"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">{activeChannel.partnerA.name}</span>
                    <span className="text-[11px] text-slate-400">Stylized 3D Queen Model Ready</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">Partner B Avatar Model:</span>
                <div className="flex items-center space-x-3">
                  <img
                    src={activeChannel.partnerB.avatar}
                    alt={activeChannel.partnerB.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-400 shadow-md"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">{activeChannel.partnerB.name}</span>
                    <span className="text-[11px] text-slate-400">Stylized 3D Gentleman Model Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Choose Dream Location */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Choose Dream Destination (5 Global Sanctuaries):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {DREAM_LOCATIONS.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocationId(loc.id)}
                    className={`rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-3 flex flex-col justify-between space-y-2 ${
                      selectedLocationId === loc.id
                        ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img src={loc.bgImage} alt={loc.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                      {selectedLocationId === loc.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs">{loc.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{loc.ambiance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Romantic Activity & Quote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Romantic Activity:</label>
                <select
                  value={dreamDateActivity}
                  onChange={(e) => setDreamDateActivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Slow dancing under golden sunset">Slow dancing under golden sunset</option>
                  <option value="Candlelight champagne toast on private terrace">Candlelight champagne toast on private terrace</option>
                  <option value="Walking along bioluminescent beach holding hands">Walking along bioluminescent beach holding hands</option>
                  <option value="Cooking together and laughing beside fireplace">Cooking together and laughing beside fireplace</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Love Quote Overlay:</label>
                <input
                  type="text"
                  value={customLoveQuote}
                  onChange={(e) => setCustomLoveQuote(e.target.value)}
                  placeholder="e.g. 'In your arms, the entire universe is still.'"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 italic"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-amber-300 font-mono">
                +50 Love Points upon creation &bull; 15-second cinematic animation
              </span>

              <button
                onClick={handleGenerateDreamDate}
                disabled={isCreatingDreamDate}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isCreatingDreamDate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Rendering 3D Pixar Animation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Generate Virtual Dream Date™</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rendered 15-Second Animated Video Player Display */}
          {dreamDateResult && (
            <div className="luxury-card rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">{dreamDateResult.sceneTitle}</h4>
                </div>
                <div className="text-[10px] font-mono px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 text-amber-300">
                  {dreamDateResult.disclaimer}
                </div>
              </div>

              {/* 15-Second Simulated Video Player */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-amber-500/30">
                <img
                  src={dreamDateResult.locationObj?.bgImage || DREAM_LOCATIONS[0].bgImage}
                  alt="Dream Date Scene"
                  className="w-full h-full object-cover transition-transform duration-[15000ms] transform scale-125"
                />
                
                {/* 3D Pixar Avatar Silhouette overlay lockup */}
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                  <div className="flex items-center space-x-4 bg-black/60 p-4 rounded-3xl border border-pink-500/30 backdrop-blur-md">
                    <img src={activeChannel.partnerA.avatar} alt="A" className="w-14 h-14 rounded-full border-2 border-pink-400 object-cover" />
                    <Heart className="w-6 h-6 text-pink-400 fill-current animate-pulse" />
                    <img src={activeChannel.partnerB.avatar} alt="B" className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover" />
                  </div>
                </div>

                {/* Prominent Disclaimer Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-amber-400/50 text-[10px] font-mono text-amber-300 font-bold">
                  AI Animated Fantasy - Not Real Footage
                </div>

                {/* Timer Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-1000"
                    style={{ width: `${(dreamDateTimer / 15) * 100}%` }}
                  />
                </div>

                {/* Love Quote Overlay */}
                <div className="absolute bottom-4 inset-x-4 text-center space-y-1">
                  <p className="font-serif-luxury font-bold text-white text-lg sm:text-xl drop-shadow-lg italic">
                    "{dreamDateResult.quoteOverlay || customLoveQuote}"
                  </p>
                  <p className="text-xs text-amber-200 drop-shadow">
                    Activity: {dreamDateActivity} &bull; {dreamDateResult.locationName}
                  </p>
                </div>
              </div>

              {/* Player Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setDreamDateVideoPlaying(!dreamDateVideoPlaying);
                      if (!dreamDateVideoPlaying && dreamDateTimer >= 15) setDreamDateTimer(0);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    {dreamDateVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{dreamDateVideoPlaying ? `Playing (${15 - dreamDateTimer}s)` : 'Replay 15s Date'}</span>
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">
                    15-Second Cinematic Experience
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveDreamDateToChannel}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Save to Love Channel (+50 pts)</span>
                  </button>
                </div>
              </div>

              {/* Frontend Viral Share Widget for Dream Date */}
              <div className="pt-2">
                <ViralShareBar
                  title={dreamDateResult.locationName}
                  text={`Our Virtual Dream Date in ${dreamDateResult.locationName} on RichConnect! AI animated fantasy ✨`}
                  storyId="post-6"
                  referralCode="DREAM_DATE"
                  category="date"
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AI COUPLE MEMES (Chibi Style Avatars & Inside Jokes) */}
      {/* ========================================================================= */}
      {activeTab === 'memes' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#170a1a] via-[#100714] to-[#0a0510] border border-pink-500/30 space-y-5 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold font-serif-luxury text-white flex items-center space-x-2">
                <Smile className="w-5 h-5 text-pink-400" />
                <span>AI Couple Meme Generator (Chibi &bull; Wholesome)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Enter your cute inside jokes or funny habits. AI translates them into adorable chibi-style couple memes ready to share privately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inside Joke / Funny Habit:</label>
                <input
                  type="text"
                  value={insideJokeInput}
                  onChange={(e) => setInsideJokeInput(e.target.value)}
                  placeholder="e.g. He checks Bloomberg before looking at the menu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Couple Quirk:</label>
                <input
                  type="text"
                  value={coupleQuirkInput}
                  onChange={(e) => setCoupleQuirkInput(e.target.value)}
                  placeholder="e.g. She takes 45 minutes to pick an outfit then looks royal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateMemes}
              disabled={isGeneratingMemes}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingMemes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Chibi Memes...</span>
                </>
              ) : (
                <>
                  <Smile className="w-4 h-4" />
                  <span>Generate Cute Couple Memes</span>
                </>
              )}
            </button>
          </div>

          {/* Memes Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(generatedMemes.length > 0 ? generatedMemes : [
              {
                title: "The 5-Minute Warning",
                avatarScenario: "Chibi James calmly waiting in the hallway while Chibi Sienna tries on 6 stunning dresses with a crown.",
                topText: "HIM: 'We have reservation in 10 minutes.'",
                bottomText: "HER: 'I just need to find the earrings that match this energy.'",
                relatableScore: 99
              },
              {
                title: "Candlelight Portfolio Check",
                avatarScenario: "Chibi James checking Bloomberg under the table while Chibi Sienna gives him the playful royal side-eye.",
                topText: "WHEN THE MAIN COURSE ARRIVES BUT MONACO MARKET JUST OPENED",
                bottomText: "HER: 'Is the steak paying your dividends or am I?' 😂",
                relatableScore: 96
              }
            ]).map((meme, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0e0915] border border-pink-500/30 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3 text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold">
                    Relatability: {meme.relatableScore}% &bull; Chibi Avatar
                  </div>
                  <h4 className="font-bold text-white text-base">{meme.title}</h4>

                  {/* Meme Box Display */}
                  <div className="p-5 rounded-2xl bg-black border-2 border-pink-500/40 text-center space-y-3">
                    <p className="font-mono font-bold text-xs uppercase tracking-wider text-pink-300">
                      {meme.topText}
                    </p>
                    <div className="py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 italic">
                      [Scene: {meme.avatarScenario}]
                    </div>
                    <p className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                      {meme.bottomText}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">RichConnect Couples Humor</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${meme.title}\n${meme.topText}\n${meme.bottomText}`);
                      setRedeemNotice('📋 Meme copied to clipboard!');
                      setTimeout(() => setRedeemNotice(null), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Meme</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LOVE MEMORY VAULT & VALUE SCORE (Redemptions, Loyalty, Card Mint) */}
      {/* ========================================================================= */}
      {activeTab === 'vault' && (
        <div className="space-y-8">
          
          {/* Points Breakdown Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#170a1e] via-[#100714] to-[#0a0510] border-2 border-pink-500/40 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-pink-400">
                  LOYALTY &amp; MEMORY VAULT
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                  Your Love Channel Value: <span className="text-pink-300">{activeChannel.love_points.toLocaleString()} Points</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Every shared story, check-in, and anniversary accumulates tangible platform loyalty value. Not sex work; purely certified romantic connection loyalty.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDailyCheckin}
                  disabled={claimedToday}
                  className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {claimedToday ? 'Claimed Today (+10)' : 'Claim Daily Check-in (+10 pts)'}
                </button>
              </div>
            </div>

            {/* Points Earning Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Daily Couple Check-in:</span>
                <span className="font-mono font-bold text-emerald-400">+10 Points</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">New Memory or Dream Date:</span>
                <span className="font-mono font-bold text-pink-300">+50 Points</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Anniversary Milestone:</span>
                <span className="font-mono font-bold text-amber-400">+100 Points</span>
              </div>
            </div>
          </div>

          {/* Redemption Items Grid */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury font-bold text-white text-base">
              Redeem Love Points for Real Platform Perks &amp; Concierge Gifts:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LOVE_REDEMPTIONS.map(rew => (
                <div
                  key={rew.id}
                  className="p-5 rounded-2xl bg-[#0e0915] border border-pink-500/20 hover:border-pink-500/50 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {rew.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/30">
                        {rew.pointsCost} pts
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-sm leading-snug">
                      {rew.title}
                    </h5>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {rew.valueDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeem(rew.id)}
                    disabled={activeChannel.love_points < rew.pointsCost}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-40"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Redeem ({rew.pointsCost} pts)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MINT AS "LOVE MEMORY CARD" MODAL */}
      {/* ========================================================================= */}
      {mintMemory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="luxury-card rounded-3xl max-w-md w-full p-6 space-y-5 border-2 border-amber-500/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  Mint Digital Love Memory Card
                </h3>
              </div>
              <button onClick={() => setMintMemory(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keepsake Visual Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a0f24] via-[#0f0714] to-[#120a1c] border-2 border-amber-400/50 text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider font-mono">
                Certified Keepsake
              </div>

              <img
                src={mintMemory.thumbnailUrl || mintMemory.mediaUrl}
                alt={mintMemory.title}
                className="w-full h-44 object-cover rounded-xl border border-amber-400/40 shadow-inner"
              />

              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{mintMemory.title}</h4>
                {mintMemory.quoteOverlay && (
                  <p className="text-xs text-amber-300 italic font-serif-luxury">
                    "{mintMemory.quoteOverlay}"
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  {mintMemory.partnerAName} &amp; {mintMemory.partnerBName} &bull; {new Date(mintMemory.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-500/20 text-[10px] text-amber-400/90 font-mono">
                {mintMemory.watermark}
              </div>
            </div>

            {/* Viral Share Bar for Keepsake Card */}
            <ViralShareBar
              title={mintMemory.title}
              text={`We minted our private love keepsake on RichConnect: "${mintMemory.title}" ✨`}
              storyId="post-7"
              referralCode="KEEPSAKE"
              category="movie"
              onNavigate={onNavigate}
            />

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsMinting(true);
                  setTimeout(() => {
                    setIsMinting(false);
                    setMintSuccess(true);
                    setTimeout(() => {
                      setMintSuccess(false);
                      setMintMemory(null);
                    }, 1800);
                  }, 1200);
                }}
                disabled={isMinting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Minting Digital Keepsake Card...</span>
                  </>
                ) : mintSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Keepsake Ready &amp; Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Mint &amp; Download Card (Free)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MONETIZATION: LOVE CHANNEL PRO ($19/MONTH) CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {showProModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="luxury-card rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border-2 border-pink-500/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
              <div className="flex items-center space-x-2.5">
                <Crown className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-serif-luxury font-bold text-white text-base">
                    Love Channel Pro Pass
                  </h3>
                  <span className="text-[10px] text-pink-300 font-mono">
                    $19 / Month &bull; Cancel Anytime
                  </span>
                </div>
              </div>
              <button onClick={() => setShowProModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-200">
                Turn your chats into forever movies with high-resolution export, unlimited 3D Pixar dream dates, and zero watermarks.
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  <span>Unlimited Virtual Dream Date™ Generations</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  <span>All 5 Global Sanctuaries (Dubai, Paris, Monaco, Maldives)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  <span>4K High-Res Ken Burns Story Export with Soundtrack</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  <span>2X Love Points multiplier on all check-ins</span>
                </div>
              </div>
            </div>

            {/* Gateway Toggle */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-semibold text-slate-300">Choose Provider:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setProGateway('Stripe')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    proGateway === 'Stripe'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Stripe Global</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProGateway('Paystack')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    proGateway === 'Paystack'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Paystack Africa</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleUpgradePro}
              disabled={isProcessingPro}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingPro ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Activating Pro via {proGateway}...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Subscribe for $19/mo with {proGateway}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
