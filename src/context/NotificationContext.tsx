import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Girl } from '../types';
import { playLuxuryChime } from '../utils/audioChime';

interface NotificationContextType {
  activeToast: Girl | null;
  threshold: number;
  setThreshold: (threshold: number) => void;
  dismissToast: () => void;
  triggerToastForGirl: (girl: Girl) => void;
  simulateNewHighMatch: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  checkGirlsForHighMatches: (girlsList: Girl[]) => void;
}

const NOTIFIED_STORAGE_KEY = 'rc_notified_matches_v1';
const MUTE_STORAGE_KEY = 'rc_alert_mute_setting_v1';
const THRESHOLD_STORAGE_KEY = 'rc_alert_threshold_v1';
const DEFAULT_THRESHOLD = 94;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode; girls: Girl[] }> = ({
  children,
  girls,
}) => {
  const [activeToast, setActiveToast] = useState<Girl | null>(null);
  
  const [threshold, setThresholdState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(THRESHOLD_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : DEFAULT_THRESHOLD;
    } catch {
      return DEFAULT_THRESHOLD;
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setThreshold = (val: number) => {
    setThresholdState(val);
    localStorage.setItem(THRESHOLD_STORAGE_KEY, val.toString());
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_STORAGE_KEY, next.toString());
      return next;
    });
  };

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerToastForGirl = useCallback((girl: Girl) => {
    setActiveToast(girl);
    if (!isMuted) {
      playLuxuryChime();
    }

    // Mark as notified
    try {
      const raw = sessionStorage.getItem(NOTIFIED_STORAGE_KEY);
      const notified: string[] = raw ? JSON.parse(raw) : [];
      if (!notified.includes(girl.id)) {
        sessionStorage.setItem(NOTIFIED_STORAGE_KEY, JSON.stringify([...notified, girl.id]));
      }
    } catch (e) {
      // ignore
    }
  }, [isMuted]);

  const checkGirlsForHighMatches = useCallback((girlsList: Girl[]) => {
    try {
      const raw = sessionStorage.getItem(NOTIFIED_STORAGE_KEY);
      const notified: string[] = raw ? JSON.parse(raw) : [];

      // Find candidates: in 'Found' stage with match_score >= threshold and unnotified
      const candidate = girlsList.find(
        (g) => g.stage === 'Found' && g.match_score >= threshold && !notified.includes(g.id)
      );

      if (candidate) {
        triggerToastForGirl(candidate);
      }
    } catch (e) {
      // ignore
    }
  }, [threshold, triggerToastForGirl]);

  // Initial check on mount or when girls list changes
  useEffect(() => {
    if (girls && girls.length > 0) {
      // Slight delay so the app layout mounts smoothly
      const timer = setTimeout(() => {
        checkGirlsForHighMatches(girls);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [girls, checkGirlsForHighMatches]);

  // Simulation function for manual testing
  const simulateNewHighMatch = () => {
    // Pick existing high match or simulate an extraordinary candidate
    const candidates = girls.filter(g => g.stage === 'Found' && g.match_score >= threshold);
    if (candidates.length > 0) {
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      triggerToastForGirl(randomCandidate);
    } else {
      // Create mock match alert
      const mockCandidate: Girl = {
        id: 'sim-' + Date.now(),
        name: 'Geneviève de Montmirail',
        age: 26,
        bio: 'Daughter of European ambassador. Art curator, lover of African history & bold kings.',
        ig: '@genevieve.montmirail',
        location: 'Europe',
        ethnicity: 'White / Caucasian',
        tags: ['Rich', 'Princess', 'Diplomatic Family', 'Loves African Men'],
        match_score: 98,
        match_reason: 'Stated direct admiration for African leaders & confident black gentlemen at Monaco Charity Gala.',
        stage: 'Found',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        public_likes_black_men: true,
        estimated_net_worth: '$40M+',
        verified: true,
        created_at: new Date().toISOString(),
      };
      triggerToastForGirl(mockCandidate);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        activeToast,
        threshold,
        setThreshold,
        dismissToast,
        triggerToastForGirl,
        simulateNewHighMatch,
        isMuted,
        toggleMute,
        checkGirlsForHighMatches,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
