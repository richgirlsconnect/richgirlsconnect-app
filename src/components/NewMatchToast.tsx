import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Crown, 
  X, 
  ArrowRight, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  Bell, 
  Volume2, 
  VolumeX,
  ExternalLink
} from 'lucide-react';
import { Girl } from '../types';

interface NewMatchToastProps {
  girl: Girl;
  threshold: number;
  onViewDossier: (girlId: string) => void;
  onChatAI: (girlId: string) => void;
  onDismiss: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const NewMatchToast: React.FC<NewMatchToastProps> = ({
  girl,
  threshold,
  onViewDossier,
  onChatAI,
  onDismiss,
  isMuted = false,
  onToggleMute,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const durationMs = 9000; // 9 seconds
  const stepMs = 50;

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Reset progress and pause state when a new girl candidate is alerted
  useEffect(() => {
    setProgress(100);
    setIsPaused(false);
  }, [girl.id]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - (stepMs / durationMs) * 100;
        return next <= 0 ? 0 : next;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Safely trigger onDismiss in an effect after render commit when countdown reaches 0
  useEffect(() => {
    if (progress <= 0) {
      onDismissRef.current();
    }
  }, [progress]);

  const isPresidential = girl.is_presidential_daughter === true;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      role="alert"
    >
      {/* Toast Luxury Card */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0a0d15]/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl shadow-amber-950/60 p-4 sm:p-5 gold-border-glow">
        
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700" />

        {/* Header Alert Pill & Dismiss */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
              {isPresidential ? <Crown className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="text-[11px] font-bold font-serif-luxury tracking-wider text-amber-300 uppercase">
                {isPresidential ? 'Sovereign Match Alert' : 'High-Value Match Detected'}
              </span>
              <span className="text-[10px] text-slate-400 ml-1.5 font-sans">
                Stage: <strong className="text-slate-200">Found</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {onToggleMute && (
              <button
                onClick={onToggleMute}
                className="p-1 rounded-lg text-slate-400 hover:text-amber-300 transition-colors"
                title={isMuted ? 'Unmute alerts' : 'Mute alert sounds'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            )}

            <button
              onClick={onDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex items-start space-x-3.5">
          <div className="relative shrink-0">
            <img
              src={girl.avatar_url}
              alt={girl.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500/40 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold shadow font-serif-luxury">
              {girl.match_score}%
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-serif-luxury text-slate-100 truncate">
                {girl.name}, {girl.age}
              </h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shrink-0 ml-1">
                ≥ {threshold}%
              </span>
            </div>

            <p className="text-[11px] text-amber-200/90 font-medium truncate mt-0.5">
              {girl.location} • {girl.ethnicity} • {girl.estimated_net_worth || '$10M+'}
            </p>

            <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 italic leading-relaxed">
              "{girl.match_reason || girl.bio}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="text-[10px] text-slate-400 font-mono">
            Auto-closing in {Math.ceil((progress / 100) * 9)}s
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onViewDossier(girl.id);
                onDismiss();
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-1 transition-all"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Dossier</span>
            </button>

            <button
              onClick={() => {
                onChatAI(girl.id);
                onDismiss();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center space-x-1 transition-all"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat Wingman</span>
            </button>
          </div>
        </div>

        {/* Progress Bar (Visual Auto-Dismiss Indicator) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
};
