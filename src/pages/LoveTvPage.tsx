import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Vote,
  Sparkles,
  Heart,
  Share2,
  Crown,
  Clock,
  Eye,
  Send,
  Flame,
  Award,
  ChevronRight,
  ChevronLeft,
  Tv,
  MessageCircle,
  ThumbsUp,
  MapPin,
  Plane,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Gift
} from 'lucide-react';
import {
  LoveShow,
  ShowFormat,
  ShowComment,
  ShowTitleSuggestion,
  getLoveShows,
  voteOnShowPoll,
  hasVotedOnShow,
  getTitleSuggestions,
  addTitleSuggestion,
  getShowComments,
  addShowComment,
  getWatchedCountToday,
  incrementWatchedCountToday
} from '../lib/loveTvStorage';
import { awardLovePoints } from '../lib/loveChannelStorage';
import { ViralShareBar } from '../components/ViralShareBar';
import { SmartPaywallModal } from '../components/SmartPaywallModal';

interface LoveTvPageProps {
  onNavigate: (path: string) => void;
}

export const LoveTvPage: React.FC<LoveTvPageProps> = ({ onNavigate }) => {
  const [shows, setShows] = useState<LoveShow[]>([]);
  const [currentShow, setCurrentShow] = useState<LoveShow | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  
  // Real-time comments
  const [comments, setComments] = useState<ShowComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  
  // User voting & state
  const [userVotedOptionId, setUserVotedOptionId] = useState<string | null>(null);
  const [isGoldUser, setIsGoldUser] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [watchedToday, setWatchedToday] = useState(0);

  // Suggest title modal / state
  const [suggestTitleModal, setSuggestTitleModal] = useState(false);
  const [userSuggestedTitle, setUserSuggestedTitle] = useState('');
  const [userSuggestedConcept, setUserSuggestedConcept] = useState('');
  const [suggestedFormat, setSuggestedFormat] = useState<ShowFormat>('diamond_wish');
  const [titleSuggestions, setTitleSuggestions] = useState<ShowTitleSuggestion[]>([]);
  
  // Share & Toast
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Countdown to next episode (every 4 hours cron simulation)
  const [countdownText, setCountdownText] = useState('03:12:45');
  const [liveViewersCount, setLiveViewersCount] = useState(2341);
  const [tickerComment, setTickerComment] = useState('Aisha: OMG this is literally my story!');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load shows and initial state
  useEffect(() => {
    const loaded = getLoveShows();
    setShows(loaded);
    if (loaded.length > 0) {
      setCurrentShow(loaded[0]);
      setUserVotedOptionId(hasVotedOnShow(loaded[0].id));
      setComments(getShowComments(loaded[0].id));
    }
    setTitleSuggestions(getTitleSuggestions());
    setWatchedToday(getWatchedCountToday());

    // Check if user is Gold Queen / VIP
    const isGold = localStorage.getItem('richconnect_tier') === 'gold' || 
                   localStorage.getItem('richconnect_tier') === 'diamond';
    setIsGoldUser(isGold);

    // Audio ambient background track
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-romantic-dinner-601.mp3');
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  // Update ticker and live viewer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveViewersCount(prev => prev + (Math.floor(Math.random() * 7) - 3));
      
      const sampleTickers = [
        'Aisha: OMG this is literally my story!',
        'Zara from Dubai: The DIFC scene gave me chills 🔥',
        'Kofi from London: Lord Sterling is real chivalry!',
        'Fatima: She better accept the Dubai private flight!',
        'Elena from Monaco: That Port Hercules penthouse is stunning!'
      ];
      setTickerComment(sampleTickers[Math.floor(Math.random() * sampleTickers.length)]);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Countdown timer for next episode (4-hour simulation)
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const nextSlotHour = Math.ceil((now.getHours() + 1) / 4) * 4;
      const target = new Date(now);
      target.setHours(nextSlotHour, 0, 0, 0);
      const diffMs = target.getTime() - now.getTime();
      if (diffMs <= 0) return '00:00:00';

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    setCountdownText(calculateCountdown());
    const interval = setInterval(() => {
      setCountdownText(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Playback scene cycle & Web Speech API Voiceover
  useEffect(() => {
    if (!currentShow || !isPlaying) return;

    const currentScene = currentShow.scenes[currentSceneIndex] || currentShow.scenes[0];
    const duration = (currentScene.durationSeconds || 12) * 1000;

    // Web Speech API voiceover
    if (voiceoverEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentScene.narration);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }

    const sceneTimer = setTimeout(() => {
      if (currentSceneIndex < currentShow.scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      } else {
        // Episode finished!
        if (autoPlayNext) {
          const currentIndex = shows.findIndex(s => s.id === currentShow.id);
          const nextIndex = (currentIndex + 1) % shows.length;
          handleSelectShow(shows[nextIndex]);
        }
      }
    }, duration);

    return () => {
      clearTimeout(sceneTimer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentShow, currentSceneIndex, isPlaying, voiceoverEnabled, autoPlayNext, shows]);

  // Audio music playback
  useEffect(() => {
    if (audioRef.current) {
      if (bgMusicEnabled && isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [bgMusicEnabled, isPlaying]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectShow = (show: LoveShow) => {
    // Freemium Watch Rule: Free users can watch 1 episode/day
    if (!isGoldUser && watchedToday >= 1 && show.id !== currentShow?.id) {
      setShowPaywallModal(true);
      return;
    }

    setCurrentShow(show);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
    setUserVotedOptionId(hasVotedOnShow(show.id));
    setComments(getShowComments(show.id));

    // Increment watched count for free users
    if (!isGoldUser) {
      incrementWatchedCountToday();
      setWatchedToday(getWatchedCountToday());
    }

    // Scroll to player smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVote = async (optionId: string) => {
    if (!currentShow) return;
    const updated = await voteOnShowPoll(currentShow.id, optionId, isGoldUser);
    if (updated) {
      setCurrentShow(updated);
      setUserVotedOptionId(optionId);
      setShows(getLoveShows());
      
      // Award love points for participating
      await awardLovePoints(25, 'Voted on Love TV Reality Episode');
      showToast(`🎉 Vote counted! +25 Love Points earned ${isGoldUser ? '(5x VIP Weight Applied!)' : ''}`);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentShow) return;

    const userDisplayName = localStorage.getItem('richconnect_username') || 'Sovereign Queen';
    const added = await addShowComment(currentShow.id, userDisplayName, newCommentText.trim(), true);
    setComments(prev => [...prev, added]);
    setNewCommentText('');
    showToast('Comment posted to Live Stream!');
  };

  const handleSuggestTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSuggestedTitle.trim()) return;

    const userName = localStorage.getItem('richconnect_username') || '@Sovereign_Viewer';
    const newSug = await addTitleSuggestion(userName, userSuggestedTitle, userSuggestedConcept, suggestedFormat);
    setTitleSuggestions(getTitleSuggestions());
    setUserSuggestedTitle('');
    setUserSuggestedConcept('');
    setSuggestTitleModal(false);

    // Award +50 Love points
    await awardLovePoints(50, 'Suggested Love TV Episode Title');
    showToast('✨ Title submitted for the next 4-hour AI drop! +50 Love Points awarded.');
  };

  // Group shows by format
  const diamondWishShows = shows.filter(s => s.format === 'diamond_wish');
  const ghostUnmaskedShows = shows.filter(s => s.format === 'ghost_unmasked');
  const lovePassportShows = shows.filter(s => s.format === 'love_passport');
  const freeToDiamondShows = shows.filter(s => s.format === 'free_to_diamond');

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-amber-500/30">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP LIVE BANNER (Netflix / Live TV Header) */}
      <div className="border-b border-amber-500/25 bg-gradient-to-r from-[#170a0f] via-[#0d0713] to-[#07090e] px-4 sm:px-6 py-3 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Live Indicator & Show Title */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 text-xs font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE NOW</span>
            </div>

            <div className="flex items-center space-x-2">
              <Tv className="w-4 h-4 text-amber-400" />
              <span className="font-serif-luxury font-bold text-white text-sm sm:text-base">
                LOVE TV™
              </span>
              <span className="hidden sm:inline text-slate-400 text-xs">
                &bull; The World's First AI Live Reality Show
              </span>
            </div>
          </div>

          {/* Live Viewers & Ticker */}
          <div className="flex items-center space-x-4 text-xs w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-1.5 font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>{liveViewersCount.toLocaleString()} watching now</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1.5 text-slate-300 text-xs italic bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
              <MessageCircle className="w-3.5 h-3.5 text-pink-400" />
              <span className="truncate max-w-xs">{tickerComment}</span>
            </div>

            {/* Countdown to Next Episode */}
            <div className="flex items-center space-x-1.5 font-mono text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/40 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Episode in: <strong>{countdownText}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* BILLBOARD HERO VIDEO PLAYER (Netflix-Style Large Cinema Stage)  */}
      {/* ============================================================== */}
      {currentShow && (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8 space-y-4">
          
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[620px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black">
            
            {/* Animated Scene Image with Ken Burns Zoom & Pan */}
            <img
              src={currentShow.scenes[currentSceneIndex]?.imageUrl || currentShow.hero_banner_url}
              alt={currentShow.title}
              className={`w-full h-full object-cover transition-all duration-[6000ms] ease-out ${
                isPlaying ? 'scale-110 translate-y-[-1%]' : 'scale-100'
              }`}
            />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-black/60 pointer-events-none" />

            {/* Top Bar inside Player */}
            <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between z-20">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/50 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Episode {currentShow.episode_number}</span>
                </span>

                <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-slate-300 font-mono text-xs hidden sm:inline">
                  Scene {currentSceneIndex + 1} of {currentShow.scenes.length}
                </span>

                {currentShow.flight_route && (
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center space-x-1">
                    <Plane className="w-3 h-3" />
                    <span>{currentShow.flight_route.from} &rarr; {currentShow.flight_route.to}</span>
                  </span>
                )}
              </div>

              {/* Player Toggles: Audio, Voiceover, Share */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceoverEnabled(!voiceoverEnabled)}
                  title="Toggle AI Narrator Voiceover"
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    voiceoverEnabled
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-black/70 text-slate-400 border-white/20 hover:text-white'
                  }`}
                >
                  <span>AI Voiceover</span>
                </button>

                <button
                  onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
                  title="Toggle Cinematic Background Music"
                  className="p-2 rounded-xl bg-black/70 hover:bg-black text-amber-400 border border-white/20 transition-all cursor-pointer"
                >
                  {bgMusicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setShareModalOpen(true)}
                  title="Share Reality Episode"
                  className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share (+50 Pts)</span>
                </button>
              </div>
            </div>

            {/* Live Floating Comments Overlay (TikTok Live Style) */}
            <div className="absolute top-16 right-4 sm:right-6 w-64 sm:w-72 max-h-52 overflow-hidden flex flex-col justify-end space-y-2 pointer-events-none z-20">
              {comments.slice(-4).map((c, i) => (
                <div
                  key={c.id || i}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-left flex items-start space-x-2 animate-fadeIn"
                >
                  <img
                    src={c.avatar_url}
                    alt={c.user_name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-400 shrink-0"
                  />
                  <div className="text-[11px] min-w-0">
                    <span className="font-bold text-amber-300 mr-1.5">{c.user_name}</span>
                    <span className="text-slate-200">{c.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Hero Overlay & Narration */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 z-20 space-y-3">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
                  <span>{currentShow.scenes[currentSceneIndex]?.setting}</span>
                  <span>&bull;</span>
                  <span className="text-pink-300 font-semibold">{currentShow.scenes[currentSceneIndex]?.title}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white drop-shadow-md">
                  {currentShow.title}
                </h1>

                {/* Subtitle / Voiceover text */}
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed bg-black/60 backdrop-blur-sm p-3 rounded-2xl border border-white/10 max-w-2xl">
                  "{currentShow.scenes[currentSceneIndex]?.narration}"
                </p>
              </div>

              {/* Player Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/30 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Episode' : 'Play Episode'}</span>
                  </button>

                  {/* Scene Navigation dots */}
                  <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
                    {currentShow.scenes.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSceneIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentSceneIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setAutoPlayNext(!autoPlayNext)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      autoPlayNext
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-black/40 text-slate-400 border-slate-700'
                    }`}
                  >
                    Auto-Play Next: {autoPlayNext ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Sponsor attribution */}
                {currentShow.sponsor && (
                  <div className="text-[11px] text-right text-slate-400 font-mono hidden sm:block">
                    Sponsored by <span className="text-amber-300 font-semibold">{currentShow.sponsor.name}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* CLIFFHANGER & INTERACTIVE AUDIENCE POLL (Votes decide next ep) */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Interactive Voting Poll & Cliffhanger */}
            <div className="lg:col-span-8 luxury-card rounded-3xl p-6 border border-amber-500/30 space-y-4 bg-gradient-to-br from-[#120a1c] via-[#0b0814] to-[#07090e]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Vote className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif-luxury font-bold text-white text-base">
                    Audience Choice &bull; Cliffhanger Poll
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Votes Decide Next Episode
                  </span>
                  {isGoldUser && (
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                      5x VIP Vote Power
                    </span>
                  )}
                </div>
              </div>

              {/* Cliffhanger Hook */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/20 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>THE CLIFFHANGER:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentShow.cliffhanger}
                </p>
              </div>

              {/* Question & Vote Options */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-white">
                  {currentShow.poll_question}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentShow.poll_options.map(opt => {
                    const isSelected = userVotedOptionId === opt.id;
                    const totalVotes = currentShow.poll_options.reduce((sum, o) => sum + o.votes, 0) || 1;
                    const pct = Math.round((opt.votes / totalVotes) * 100);

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-950/40'
                            : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40'
                        }`}
                      >
                        {/* Progress Fill */}
                        <div
                          className="absolute inset-y-0 left-0 bg-amber-500/15 pointer-events-none transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-xs font-bold text-white pr-2">{opt.label}</span>
                          <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                            {pct}% ({opt.votes.toLocaleString()})
                          </span>
                        </div>

                        {isSelected && (
                          <div className="relative z-10 text-[10px] text-emerald-400 font-bold mt-1 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Your Vote Cast {isGoldUser ? '(5x Weight Applied)' : ''}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar: Suggest Title & Share */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={() => setSuggestTitleModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Suggest Next Episode Title (+50 Pts)</span>
                </button>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Top voters win <strong>Love TV Producer Badge</strong> + 100 Love Points</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Live TikTok Chat & Comment Input */}
            <div className="lg:col-span-4 luxury-card rounded-3xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-pink-400" />
                    <span className="font-bold text-white text-xs">Live Episode Chat</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{comments.length} comments</span>
                </div>

                {/* Comment Scroll Area */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {comments.map((c, i) => (
                    <div key={c.id || i} className="text-xs space-y-0.5 border-b border-slate-800/40 pb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-amber-300 text-[11px]">{c.user_name}</span>
                        {c.is_vip && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded uppercase font-bold">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-snug">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Drop your thoughts on this episode..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NETFLIX-STYLE HORIZONTAL SCROLL ROWS OF EPISODES               */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-10">
        
        {/* ROW 1: TRENDING NOW (All Episodes) */}
        <EpisodeRow
          title="🔥 Trending Reality Episodes (AI Auto-Generates Every 4 Hours)"
          subtitle="Top rated love matches and unmasking cliffhangers across the private circle"
          shows={shows}
          currentShowId={currentShow?.id}
          onSelectShow={handleSelectShow}
        />

        {/* ROW 2: DIAMOND WISH */}
        <EpisodeRow
          title="💎 Diamond Wish (Wish Wall Dramas &amp; Proposals)"
          subtitle="A girl posts a secret wish. AI creates an animated 3-scene story of her journey."
          shows={diamondWishShows}
          currentShowId={currentShow?.id}
          onSelectShow={handleSelectShow}
        />

        {/* ROW 3: GHOST UNMASKED */}
        <EpisodeRow
          title="🎭 Ghost Unmasked (3 Millionaires Compete to Unlock)"
          subtitle="Operating in Ghost Wealth Mode. Audience votes which sovereign gentleman gets her dossier."
          shows={ghostUnmaskedShows}
          currentShowId={currentShow?.id}
          onSelectShow={handleSelectShow}
        />

        {/* ROW 4: LOVE PASSPORT */}
        <EpisodeRow
          title="✈️ Love Passport (Lagos &bull; Dubai &bull; Monaco Flight Map)"
          subtitle="Rotating through European and Middle Eastern high-society capitals with animated routes."
          shows={lovePassportShows}
          currentShowId={currentShow?.id}
          onSelectShow={handleSelectShow}
        />

        {/* ROW 5: FROM FREE TO DIAMOND */}
        <EpisodeRow
          title="👑 From Free to Diamond (True Transformation Stories)"
          subtitle="Real anonymized sisters who started as $0 Free Explorers and transformed their destiny."
          shows={freeToDiamondShows}
          currentShowId={currentShow?.id}
          onSelectShow={handleSelectShow}
        />

        {/* COMMUNITY SUGGESTED TITLES LEADERBOARD */}
        <div className="luxury-card rounded-3xl p-6 border border-amber-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-serif-luxury text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Audience Suggested Episode Titles</span>
              </h3>
              <p className="text-xs text-slate-400">
                The most upvoted title is synthesized into a full 3-scene episode by AI in the next 4-hour cycle.
              </p>
            </div>

            <button
              onClick={() => setSuggestTitleModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit My Title (+50 Pts)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {titleSuggestions.map((sug, i) => (
              <div
                key={sug.id || i}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Suggested by <strong className="text-amber-300">{sug.user_name}</strong></span>
                  <span className="text-emerald-400 font-bold">{sug.upvotes} Upvotes</span>
                </div>

                <div className="text-xs font-bold text-white">
                  "{sug.suggested_title}"
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {sug.concept}
                </p>

                {sug.status === 'featured' && (
                  <span className="inline-block text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Featured in Upcoming Episode!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: SUGGEST NEXT EPISODE TITLE                              */}
      {/* ============================================================== */}
      {suggestTitleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="luxury-card rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-amber-500/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  Suggest Next Love TV Episode
                </h3>
              </div>
              <button onClick={() => setSuggestTitleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuggestTitleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Show Format:</label>
                <select
                  value={suggestedFormat}
                  onChange={(e) => setSuggestedFormat(e.target.value as ShowFormat)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="diamond_wish">Diamond Wish (Wish Wall Drama)</option>
                  <option value="ghost_unmasked">Ghost Unmasked (3 Suitors)</option>
                  <option value="love_passport">Love Passport (Flight Map)</option>
                  <option value="free_to_diamond">From Free to Diamond (Transformation)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  value={userSuggestedTitle}
                  onChange={(e) => setUserSuggestedTitle(e.target.value)}
                  placeholder="e.g. Midnight on the Palm: The $2M Token Challenge"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Story Concept &amp; Cliffhanger *</label>
                <textarea
                  rows={3}
                  required
                  value={userSuggestedConcept}
                  onChange={(e) => setUserSuggestedConcept(e.target.value)}
                  placeholder="Describe who the sovereign suitor is, the luxury setting, and the cliffhanger choice..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                If your title is picked by AI or our producers, you will be credited on screen as <strong>"Suggested by @YourName"</strong> and receive 100 Love Points!
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
              >
                <span>Submit Title to Producers (+50 Pts)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SHARE REALITY SHOW EPISODE                              */}
      {/* ============================================================== */}
      {shareModalOpen && currentShow && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="luxury-card rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-pink-500/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-pink-400" />
                <h3 className="font-serif-luxury font-bold text-white text-base">
                  Share Episode {currentShow.episode_number}
                </h3>
              </div>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              "I am watching Love TV Episode {currentShow.episode_number} — {currentShow.title} 😱 Watch on RichConnect!"
            </div>

            <ViralShareBar
              title={currentShow.title}
              text={`I am watching Love TV Episode ${currentShow.episode_number} — ${currentShow.title} 😱 Watch on RichConnect:`}
              storyId="post-1"
              referralCode="LOVE_TV_FAN"
              category="movie"
              onNavigate={onNavigate}
            />
          </div>
        </div>
      )}

      {/* Smart Paywall Modal for Freemium Watch Gate */}
      <SmartPaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        targetFeature="Unlimited Binge Watching on Love TV™ + 5x Audience Voting Weight"
        onNavigate={onNavigate}
      />

    </div>
  );
};

// ==============================================================
// HORIZONTAL SCROLL ROW SUB-COMPONENT
// ==============================================================
interface EpisodeRowProps {
  title: string;
  subtitle: string;
  shows: LoveShow[];
  currentShowId?: string;
  onSelectShow: (show: LoveShow) => void;
}

const EpisodeRow: React.FC<EpisodeRowProps> = ({
  title,
  subtitle,
  shows,
  currentShowId,
  onSelectShow
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
            {title}
          </h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row of Episode Cards */}
      <div
        ref={scrollRef}
        className="flex items-stretch space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-none"
      >
        {shows.map(show => {
          const isActive = show.id === currentShowId;

          return (
            <div
              key={show.id}
              onClick={() => onSelectShow(show)}
              className={`w-[260px] sm:w-[290px] shrink-0 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-950/40 ring-2 ring-amber-500/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:scale-[1.02]'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={show.thumbnail_url}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1">
                  <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                    Ep {show.episode_number}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Episode Info */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {show.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {show.hook}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>{show.views.toLocaleString()}</span>
                  </span>

                  <span className="text-amber-400">
                    {show.scenes.length} Scenes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
