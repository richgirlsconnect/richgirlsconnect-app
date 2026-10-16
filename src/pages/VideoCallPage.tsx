import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  MessageSquare, 
  Volume2, 
  Settings, 
  Share2, 
  Maximize2,
  Clock,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';

interface VideoCallPageProps {
  onNavigate: (path: string) => void;
}

export const VideoCallPage: React.FC<VideoCallPageProps> = ({ onNavigate }) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [backgroundBlur, setBackgroundBlur] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // seconds
  const [showConciergeTips, setShowConciergeTips] = useState(true);
  const [activePartner, setActivePartner] = useState({
    name: 'Genevieve Laurent',
    title: 'Contemporary Art Curator',
    location: 'Paris & Monaco',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    tier: 'Presidential Suite'
  });

  // Call timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Top Video Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a0e18] border border-amber-500/20 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                VIP Encrypted Video Suite
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>E2EE Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Private 1-on-1 call with <strong className="text-amber-300">{activePartner.name}</strong> • Strictly confidential
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300 flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatDuration(callDuration)}</span>
          </div>
          <button
            onClick={() => onNavigate('/chat/match-celebration-101')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Switch to Text Chat</span>
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Remote Feed (Partner) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-2xl group">
            {/* Partner Video Background Image / Stream */}
            <img
              src={activePartner.avatar}
              alt={activePartner.name}
              className={`w-full h-full object-cover transition-all ${
                backgroundBlur ? 'blur-xs scale-102' : ''
              }`}
            />

            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Partner Details */}
            <div className="absolute top-4 left-4 flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-white font-semibold text-xs flex items-center space-x-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePartner.name}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300">
                {activePartner.location}
              </span>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            <div className="absolute bottom-4 left-5 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center space-x-0.5 h-3">
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
              </div>
              <span className="text-[10px] font-mono text-emerald-300">HD Voice 48kHz</span>
            </div>

            {/* Picture-in-Picture Local Self Preview */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-slate-900 z-10 group-hover:scale-105 transition-transform">
              {cameraActive ? (
                <div className="w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Self"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-amber-300 font-semibold">
                    You (Host)
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center">
                  <VideoOff className="w-5 h-5 text-red-400 mb-1" />
                  <span className="text-[10px]">Camera Paused</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-[#0b0f19] border border-amber-500/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle */}
              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  micActive
                    ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                    : 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
                }`}
                title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-400" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  cameraActive
                    ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                    : 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
                }`}
                title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
              </button>

              {/* Blur Toggle */}
              <button
                onClick={() => setBackgroundBlur(!backgroundBlur)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  backgroundBlur
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{backgroundBlur ? 'Luxury Blur On' : 'Blur Off'}</span>
              </button>
            </div>

            {/* End Call Button */}
            <button
              onClick={() => onNavigate('/swipe')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-red-500/25 cursor-pointer transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Video Room</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Concierge In-Call Teleprompter & Safety */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI In-Call Wingman Teleprompter */}
          <div className="rounded-2xl border border-amber-500/25 bg-[#0c101a] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Concierge Live Wingman</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Listening
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The <strong>Concierge Agent</strong> dynamically serves discreet talking points calibrated to Genevieve's profile and fine arts curation background.
            </p>

            {/* Talking Points Cards */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Suggested Topic #1</span>
                <p className="text-xs text-slate-200">
                  "How was the recent vernissage at the Venice Biennale? I heard the pavilions were exceptional this year."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Suggested Topic #2</span>
                <p className="text-xs text-slate-200">
                  "Do you prefer the quiet season in St. Moritz or spending winters sailing the Grenadines?"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">First Rendezvous Idea</span>
                <p className="text-xs text-slate-200">
                  Propose dinner at <strong className="text-amber-300">L'Ambroisie</strong> on Île Saint-Louis or a private tasting salon.
                </p>
              </div>
            </div>

            {/* 24/7 Moderation Agent Safety Badge */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Moderation Agent Guard Active</strong>
                <span>Recording and screen capture prohibited. All video packets end-to-end encrypted.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
