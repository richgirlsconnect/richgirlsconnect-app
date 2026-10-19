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
  Gift,
  Maximize2,
  Minimize2,
  RotateCcw,
  FastForward,
  Rewind,
  Subtitles,
  Sliders,
  CheckCircle2
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
  incrementWatchedCountToday,
  getShowWatchProgress,
  saveShowWatchProgress,
  clearShowWatchProgress,
  getAllWatchProgress,
  getLastWatchedShowId,
  setLastWatchedShowId
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
  
  // Continuous smooth playback engine state
  const [playheadSeconds, setPlayheadSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [isLooping, setIsLooping] = useState(false);
  const [isClearCinemaMode, setIsClearCinemaMode] = useState(false);
  const [pictureQuality, setPictureQuality] = useState<'4k' | '1440p' | '1080p'>('4k');
  const [resumedNotice, setResumedNotice] = useState<number | null>(null);
  const [inProgressShows, setInProgressShows] = useState<ReturnType<typeof getAllWatchProgress>>([]);

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
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenSceneRef = useRef<number>(-1);

  // Total show duration calculator
  const getTotalDuration = (show: LoveShow | null): number => {
    if (!show || !show.scenes || show.scenes.length === 0) return 36;
    return show.scenes.reduce((acc, s) => acc + (s.durationSeconds || 12), 0);
  };

  const totalDuration = getTotalDuration(currentShow);

  // Derive current scene index directly from continuous playhead
  const getCurrentSceneIndex = (show: LoveShow | null, currentTime: number): number => {
    if (!show || !show.scenes || show.scenes.length === 0) return 0;
    let accumulated = 0;
    for (let i = 0; i < show.scenes.length; i++) {
      const sceneDuration = show.scenes[i].durationSeconds || 12;
      if (currentTime >= accumulated && currentTime < accumulated + sceneDuration) {
        return i;
      }
      accumulated += sceneDuration;
    }
    return Math.max(0, show.scenes.length - 1);
  };

  const currentSceneIndex = getCurrentSceneIndex(currentShow, playheadSeconds);
  const currentScene = currentShow?.scenes[currentSceneIndex] || currentShow?.scenes[0];

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Load shows and initial state
  useEffect(() => {
    const loaded = getLoveShows();
    setShows(loaded);
    if (loaded.length > 0) {
      // Check if there was a last watched show or default to first
      const lastId = getLastWatchedShowId();
      const matchedShow = loaded.find(s => s.id === lastId) || loaded[0];
      setCurrentShow(matchedShow);
      setUserVotedOptionId(hasVotedOnShow(matchedShow.id));
      setComments(getShowComments(matchedShow.id));

      // Check saved watch progress to resume smoothly
      const saved = getShowWatchProgress(matchedShow.id);
      const total = getTotalDuration(matchedShow);
      if (saved && saved.playheadSeconds > 1 && saved.playheadSeconds < total - 2) {
        setPlayheadSeconds(saved.playheadSeconds);
        setResumedNotice(saved.playheadSeconds);
      } else {
        setPlayheadSeconds(0);
      }
    }
    setTitleSuggestions(getTitleSuggestions());
    setWatchedToday(getWatchedCountToday());
    setInProgressShows(getAllWatchProgress());

    // Check if user is Gold Queen / VIP
    const isGold = localStorage.getItem('richconnect_tier') === 'gold' || 
                   localStorage.getItem('richconnect_tier') === 'diamond';
    setIsGoldUser(isGold);

    // Audio ambient background track
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-romantic-dinner-601.mp3');
    audio.loop = true;
    audio.volume = 0.22;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  // Preload all scenes of the current show into memory for ZERO stutter
  useEffect(() => {
    if (!currentShow) return;
    setLastWatchedShowId(currentShow.id);
    
    // Eagerly preload high-res scene images into browser cache
    currentShow.scenes.forEach(scene => {
      if (scene.imageUrl) {
        const img = new Image();
        img.src = scene.imageUrl;
      }
    });

    // Refresh in-progress shows shelf
    setInProgressShows(getAllWatchProgress());
  }, [currentShow]);

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

  // CONTINUOUS SMOOTH PLAYBACK LOOP (High-precision delta-time loop for fluid 60fps streaming with zero stutter)
  useEffect(() => {
    if (!isPlaying || !currentShow || isScrubbing) return;

    let lastTime = performance.now();
    const intervalMs = 40; // 25 updates/sec for silky smooth playhead glide
    const timer = setInterval(() => {
      const now = performance.now();
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setPlayheadSeconds(prev => {
        const total = getTotalDuration(currentShow);
        const next = prev + (deltaSec * playbackSpeed);
        if (next >= total) {
          if (isLooping) {
            // Seamless infinite loop without pausing!
            return 0;
          }
          if (autoPlayNext) {
            const currentIndex = shows.findIndex(s => s.id === currentShow.id);
            const nextIndex = (currentIndex + 1) % shows.length;
            const nextShow = shows[nextIndex];
            if (nextShow) {
              handleSelectShow(nextShow);
              return 0;
            }
          }
          setIsPlaying(false);
          saveShowWatchProgress(currentShow.id, total, total);
          return total;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentShow, playbackSpeed, isScrubbing, autoPlayNext, isLooping, shows]);

  // Persist Watch Progress whenever playhead advances or when paused
  useEffect(() => {
    if (!currentShow) return;
    saveShowWatchProgress(currentShow.id, playheadSeconds, totalDuration);
  }, [currentShow, playheadSeconds, totalDuration]);

  // Web Speech API Voiceover (Non-blocking, decoupled from video playhead)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    if (!isPlaying || !voiceoverEnabled || !currentShow) {
      window.speechSynthesis.cancel();
      return;
    }

    if (lastSpokenSceneRef.current === currentSceneIndex) return;
    lastSpokenSceneRef.current = currentSceneIndex;

    const scene = currentShow.scenes[currentSceneIndex];
    if (scene && scene.narration) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(scene.narration);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.onerror = () => {}; // Never interrupt video playback
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  }, [currentSceneIndex, currentShow, voiceoverEnabled, isPlaying]);

  // Audio ambient music playback
  useEffect(() => {
    if (audioRef.current) {
      if (bgMusicEnabled && isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [bgMusicEnabled, isPlaying]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation shortcuts (Space = Play/Pause, Arrow Left/Right = Skip 5s, F = Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkip(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-5);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setBgMusicEnabled(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playheadSeconds, totalDuration]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSeek = (newSeconds: number) => {
    const clamped = Math.max(0, Math.min(newSeconds, totalDuration));
    setPlayheadSeconds(clamped);
    if (currentShow) {
      saveShowWatchProgress(currentShow.id, clamped, totalDuration);
    }
  };

  const handleSkip = (deltaSeconds: number) => {
    handleSeek(playheadSeconds + deltaSeconds);
  };

  const handlePauseAndContinueLater = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentShow) {
      saveShowWatchProgress(currentShow.id, playheadSeconds, totalDuration);
      setLastWatchedShowId(currentShow.id);
      setInProgressShows(getAllWatchProgress());
    }
    showToast(`⏸ Paused at ${formatTime(playheadSeconds)}. Episode saved to Continue Watching!`);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectShow = (show: LoveShow) => {
    // Freemium Watch Rule: Free users can watch 1 episode/day
    if (!isGoldUser && watchedToday >= 1 && show.id !== currentShow?.id) {
      setShowPaywallModal(true);
      return;
    }

    setCurrentShow(show);
    lastSpokenSceneRef.current = -1;
    setLastWatchedShowId(show.id);

    // Check saved watch progress to resume smoothly
    const saved = getShowWatchProgress(show.id);
    const total = getTotalDuration(show);
    if (saved && saved.playheadSeconds > 1 && saved.playheadSeconds < total - 2) {
      setPlayheadSeconds(saved.playheadSeconds);
      setResumedNotice(saved.playheadSeconds);
    } else {
      setPlayheadSeconds(0);
      setResumedNotice(null);
    }

    setIsPlaying(true);
    setUserVotedOptionId(hasVotedOnShow(show.id));
    setComments(getShowComments(show.id));
    setInProgressShows(getAllWatchProgress());

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
      {/* ============================================================== */}
      {/* BILLBOARD HERO VIDEO PLAYER (Crystal-Clear Front Cinema Player) */}
      {/* ============================================================== */}
      {currentShow && (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8 space-y-3">
          
          {/* Resume Previous Watch Notice */}
          {resumedNotice !== null && (
            <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Resumed playback from your last watch at <strong>{formatTime(resumedNotice)}</strong></span>
              </div>
              <button
                onClick={() => {
                  handleSeek(0);
                  setResumedNotice(null);
                  showToast('Restarted episode from beginning (00:00)');
                }}
                className="text-amber-400 hover:underline flex items-center space-x-1 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play from Beginning</span>
              </button>
            </div>
          )}

          {/* Main Cinema Screen Container */}
          <div 
            ref={playerContainerRef}
            className={`relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[660px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black group select-none transition-all duration-500 ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none max-h-none border-none aspect-auto h-screen' : ''
            }`}
          >
            {/* Ambient Lighting Ambilight Glow for Crystal-Clear Cinema Depth */}
            <div 
              className="absolute -inset-4 bg-cover bg-center filter blur-3xl opacity-40 scale-105 pointer-events-none transition-all duration-1000"
              style={{ backgroundImage: `url(${currentScene?.imageUrl || currentShow.hero_banner_url})` }}
            />

            {/* DUAL-BUFFER ULTRA-CLEAR SCENE PLAYER: All scenes pre-rendered, smoothly crossfading with continuous cinematic glide */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
              {currentShow.scenes.map((scene, idx) => {
                const isActive = idx === currentSceneIndex;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <img
                      src={scene.imageUrl}
                      alt={scene.title}
                      className={`w-full h-full object-cover transition-transform duration-[14000ms] ease-out ${
                        isActive && isPlaying ? 'scale-110 translate-x-1 -translate-y-1' : 'scale-100'
                      }`}
                      style={{
                        filter: pictureQuality === '4k' 
                          ? 'contrast(1.08) saturate(1.15) brightness(1.02)' 
                          : pictureQuality === '1440p'
                          ? 'contrast(1.04) saturate(1.08)'
                          : 'none'
                      }}
                      loading="eager"
                    />
                    {/* Cinema Vignette & Contrast Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-black/30 to-black/50" />
                  </div>
                );
              })}
            </div>

            {/* Click-to-Play/Pause Backdrop Touch Target */}
            <div 
              onClick={() => {
                if (isPlaying) {
                  handlePauseAndContinueLater();
                } else {
                  setIsPlaying(true);
                }
              }}
              className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center"
            >
              {/* PAUSED STATE OVERLAY: Clear feedback with resume and preserve status */}
              {!isPlaying && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="z-30 p-6 sm:p-8 rounded-3xl bg-black/85 backdrop-blur-md border border-amber-500/50 shadow-2xl max-w-md mx-4 text-center space-y-4 animate-scaleIn"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/40 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      Episode Paused &bull; Progress Saved
                    </span>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white pt-1">
                      Paused at {formatTime(playheadSeconds)}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Your watch point is recorded. You can continue later anytime without losing your place, directly from this player or your Homepage!
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Continue Watching</span>
                    </button>
                    <button
                      onClick={() => onNavigate('/')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Homepage &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Top Bar inside Player (Hidden in Clear Cinema Mode for pristine viewing) */}
            <div className={`absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between z-30 pointer-events-auto transition-opacity duration-300 ${
              isClearCinemaMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Episode {currentShow.episode_number}</span>
                </span>

                <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-slate-300 font-mono text-xs hidden sm:inline">
                  Scene {currentSceneIndex + 1} of {currentShow.scenes.length}
                </span>

                {/* 4K Resolution Badge with Click Selector */}
                <div className="hidden md:flex items-center bg-black/70 backdrop-blur-md rounded-xl p-0.5 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  {(['4k', '1440p', '1080p'] as const).map(res => (
                    <button
                      key={res}
                      onClick={() => {
                        setPictureQuality(res);
                        showToast(`Video stream switched to ${res.toUpperCase()} Ultra Clear Quality`);
                      }}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        pictureQuality === res
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {res.toUpperCase()}
                    </button>
                  ))}
                </div>

                {currentShow.flight_route && (
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs hidden lg:flex items-center space-x-1">
                    <Plane className="w-3 h-3" />
                    <span>{currentShow.flight_route.from} &rarr; {currentShow.flight_route.to}</span>
                  </span>
                )}
              </div>

              {/* Player Top Toggles */}
              <div className="flex items-center space-x-2">
                {/* Clear Cinema View Mode Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsClearCinemaMode(!isClearCinemaMode);
                    showToast(isClearCinemaMode ? 'Standard Controls Restored' : '✨ Crystal-Clear Cinema Mode Active (Overlays Hidden)');
                  }}
                  title="Toggle Clear Cinema Mode (Hides text overlays for unobstructed viewing)"
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                    isClearCinemaMode
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-black/70 text-slate-300 border-white/20 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear View</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubtitlesEnabled(!subtitlesEnabled);
                  }}
                  title="Toggle Subtitles / Closed Captions"
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                    subtitlesEnabled
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-black/70 text-slate-400 border-white/20 hover:text-white'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CC</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVoiceoverEnabled(!voiceoverEnabled);
                  }}
                  title="Toggle AI Voiceover Narration"
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                    voiceoverEnabled
                      ? 'bg-pink-500 text-white font-bold border-pink-400'
                      : 'bg-black/70 text-slate-400 border-white/20 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voiceover</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBgMusicEnabled(!bgMusicEnabled);
                  }}
                  title="Toggle Ambient Soundtrack"
                  className="p-1.5 rounded-xl bg-black/70 hover:bg-black text-amber-400 border border-white/20 transition-all cursor-pointer"
                >
                  {bgMusicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  title="Toggle Fullscreen (Press F)"
                  className="p-1.5 rounded-xl bg-black/70 hover:bg-black text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Floating Comments Overlay (Hidden in Clear Cinema Mode) */}
            {!isClearCinemaMode && (
              <div className="absolute top-16 right-4 sm:right-6 w-60 sm:w-72 max-h-48 overflow-hidden flex flex-col justify-end space-y-2 pointer-events-none z-20">
                {comments.slice(-3).map((c, i) => (
                  <div
                    key={c.id || i}
                    className="p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-left flex items-start space-x-2 animate-fadeIn shadow-lg"
                  >
                    <img
                      src={c.avatar_url}
                      alt={c.user_name}
                      className="w-5 h-5 rounded-full object-cover border border-amber-400 shrink-0"
                    />
                    <div className="text-[11px] min-w-0">
                      <span className="font-bold text-amber-300 mr-1.5">{c.user_name}</span>
                      <span className="text-slate-200">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Screen Overlay: Title, Scene Narration, Scrubber & Controls */}
            <div className={`absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-6 z-30 space-y-2 pointer-events-auto transition-opacity duration-300 ${
              isClearCinemaMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}>
              
              {/* Closed Caption Subtitle Glass Box */}
              {subtitlesEnabled && (
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-mono">
                    <span>{currentScene?.setting}</span>
                    <span>&bull;</span>
                    <span className="text-pink-300 font-semibold">{currentScene?.title}</span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-serif-luxury font-bold text-white drop-shadow-md truncate">
                    {currentShow.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-black/75 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 max-w-2xl shadow-xl">
                    "{currentScene?.narration}"
                  </p>
                </div>
              )}

              {/* CONTINUOUS SCRUBBER TIMELINE BAR */}
              <div className="space-y-1 pt-1">
                <div 
                  className="relative w-full h-3 sm:h-3.5 bg-white/20 hover:bg-white/30 rounded-full overflow-hidden cursor-pointer backdrop-blur-md border border-white/20 transition-all"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const fraction = Math.max(0, Math.min(clickX / rect.width, 1));
                    handleSeek(fraction * totalDuration);
                  }}
                >
                  {/* Played Progress Bar */}
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-600 rounded-full transition-all duration-100 ease-out relative"
                    style={{ width: `${Math.min(100, (playheadSeconds / totalDuration) * 100)}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md shadow-amber-500/80" />
                  </div>

                  {/* Scene Divider Ticks */}
                  {currentShow.scenes.map((_, i) => {
                    const sceneStartSec = currentShow.scenes.slice(0, i).reduce((acc, s) => acc + (s.durationSeconds || 12), 0);
                    const leftPct = (sceneStartSec / totalDuration) * 100;
                    if (leftPct === 0) return null;
                    return (
                      <div 
                        key={i} 
                        className="absolute top-0 bottom-0 w-0.5 bg-black/60 pointer-events-none"
                        style={{ left: `${leftPct}%` }}
                      />
                    );
                  })}
                </div>

                {/* Timeline Timers & Scene Milestones */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-amber-300">
                      {formatTime(playheadSeconds)} <span className="text-slate-400">/ {formatTime(totalDuration)}</span>
                    </span>

                    <span className="text-slate-400 hidden sm:inline">&bull;</span>
                    
                    {/* Scene indicator pills */}
                    <div className="hidden sm:flex items-center space-x-1.5 text-[10px]">
                      {currentShow.scenes.map((scene, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const startSec = currentShow.scenes.slice(0, idx).reduce((acc, s) => acc + (s.durationSeconds || 12), 0);
                            handleSeek(startSec);
                          }}
                          className={`px-2 py-0.5 rounded transition-all ${
                            idx === currentSceneIndex
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-black/40 text-slate-400 hover:text-white'
                          }`}
                        >
                          Scene {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentShow.sponsor && (
                      <span className="text-[10px] text-slate-400 hidden md:inline">
                        Sponsored by <strong className="text-amber-300">{currentShow.sponsor.name}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Cinema Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 bg-black/85 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-2">
                  {/* Play / Pause Toggle */}
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        handlePauseAndContinueLater();
                      } else {
                        setIsPlaying(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/30 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  {/* Dedicated Explicit "Pause & Continue Later" */}
                  <button
                    onClick={handlePauseAndContinueLater}
                    title="Pause video and bookmark current position to continue watching later"
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Pause &amp; Continue Later</span>
                  </button>

                  {/* Skip Rewind 10s */}
                  <button
                    onClick={() => handleSkip(-10)}
                    title="Rewind 10 seconds"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center space-x-1"
                  >
                    <Rewind className="w-3.5 h-3.5" />
                    <span className="text-[10px]">-10s</span>
                  </button>

                  {/* Skip Forward 10s */}
                  <button
                    onClick={() => handleSkip(10)}
                    title="Forward 10 seconds"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center space-x-1"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span className="text-[10px]">+10s</span>
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-700 text-[11px] font-mono">
                    {[1.0, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          playbackSpeed === spd
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Seamless Loop Toggle */}
                  <button
                    onClick={() => {
                      setIsLooping(!isLooping);
                      showToast(isLooping ? 'Episode Loop: OFF' : '🔁 Seamless Episode Loop: ON (Plays uninterrupted without stopping)');
                    }}
                    className={`text-[11px] px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-1 ${
                      isLooping
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title="Toggle continuous seamless looping without ever pausing"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Loop: {isLooping ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Auto-Play Next Toggle */}
                  <button
                    onClick={() => setAutoPlayNext(!autoPlayNext)}
                    className={`text-[11px] px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-1 ${
                      autoPlayNext
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span>Auto-Play: {autoPlayNext ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Share Episode Button */}
                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share (+50 Pts)</span>
                  </button>
                </div>
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
        
        {/* ROW 0: CONTINUE WATCHING (User's Saved In-Progress Episodes) */}
        {inProgressShows.length > 0 && (
          <div className="space-y-3 pb-2 border-b border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h2 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                  Continue Watching (Your Saved Episodes)
                </h2>
              </div>
              <span className="text-xs font-mono text-amber-300">
                {inProgressShows.length} paused in progress
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressShows.map(item => {
                const pct = Math.min(100, Math.round((item.playheadSeconds / item.totalSeconds) * 100));
                const isSelected = item.showId === currentShow?.id;

                return (
                  <div
                    key={item.showId}
                    onClick={() => handleSelectShow(item.show)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3.5 group ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-950/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="relative w-28 h-18 rounded-xl overflow-hidden shrink-0 bg-black">
                      <img 
                        src={item.show.thumbnail_url} 
                        alt={item.show.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-amber-300 font-bold">
                        Ep {item.show.episode_number}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                        {item.show.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{formatTime(item.playheadSeconds)} / {formatTime(item.totalSeconds)}</span>
                        <span className="text-amber-400 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 h-full rounded-full transition-all duration-300" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
