import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  Heart,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import { recordShareClick } from '../lib/socialCommandStorage';
import { awardLovePoints } from '../lib/loveChannelStorage';

interface ViralShareBarProps {
  title?: string;
  text?: string;
  targetPath?: string;
  storyId?: string;
  referralCode?: string;
  category?: 'wish' | 'horoscope' | 'movie' | 'date' | 'general';
  pointsReward?: number;
  className?: string;
  onNavigate?: (path: string) => void;
}

export const ViralShareBar: React.FC<ViralShareBarProps> = ({
  title = 'Share this story',
  text = 'Monaco millionaires are searching in Lagos & Dubai right now. Check this out on RichConnect: ',
  targetPath = '/social-share',
  storyId = 'post-1',
  referralCode = 'QUEEN77',
  category = 'general',
  pointsReward = 50,
  className = '',
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Retrieve user referral or fallback
  const effectiveReferral = typeof window !== 'undefined' 
    ? (localStorage.getItem('richconnect_referral_code') || referralCode || 'VIP_MEMBER') 
    : referralCode;

  // Generate full referral share URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://richconnect.club';
  const fullShareUrl = `${baseUrl}${targetPath}?id=${storyId}&r=${encodeURIComponent(effectiveReferral)}`;

  const triggerReward = async (platform: string) => {
    // Record analytics click
    await recordShareClick(storyId, effectiveReferral, platform);

    // Award +50 Love Points if not claimed yet in this session
    if (!rewardClaimed) {
      await awardLovePoints(pointsReward, `Viral ${platform} share bonus`);
      setRewardClaimed(true);
      setToastMessage(`🎉 +${pointsReward} Love Points Added to Your Love Channel!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${fullShareUrl}`);
      setCopied(true);
      await triggerReward('copy_link');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write note:', e);
    }
  };

  const handleWhatsApp = async () => {
    await triggerReward('whatsapp');
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n\n${fullShareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitter = async () => {
    await triggerReward('twitter');
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullShareUrl)}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = async () => {
    await triggerReward('facebook');
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTikTokOrIG = async (platform: 'tiktok' | 'instagram') => {
    await triggerReward(platform);
    // Copy caption and open /social-share story generator
    try {
      await navigator.clipboard.writeText(`${text} #richconnect #dubai #monaco #datingadvice ${fullShareUrl}`);
      setToastMessage(`📸 Caption copied! Opening viral story card for ${platform === 'tiktok' ? 'TikTok' : 'Instagram Reels'}...`);
    } catch {
      setToastMessage(`Opening viral story card...`);
    }

    setTimeout(() => {
      if (onNavigate) {
        onNavigate(`/social-share?id=${storyId}&r=${encodeURIComponent(effectiveReferral)}`);
      } else if (typeof window !== 'undefined') {
        window.location.href = `/social-share?id=${storyId}&r=${encodeURIComponent(effectiveReferral)}`;
      }
    }, 900);
  };

  return (
    <div className={`rounded-xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-amber-500/10 border border-amber-500/30 p-3 sm:p-3.5 ${className}`}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-2.5 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] uppercase font-mono bg-emerald-500/30 px-1.5 py-0.5 rounded text-emerald-200">
            +{pointsReward} Pts
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Incentivized Hook */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shrink-0 shadow-sm">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>Share to TikTok</span>
              <span className="text-amber-400 font-mono text-[11px]">&bull; Get {pointsReward} Love Points</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Ref link automatically attached: <span className="font-mono text-amber-300">?r={effectiveReferral}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Share Action Buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* TikTok */}
          <button
            onClick={() => handleTikTokOrIG('tiktok')}
            title="Share to TikTok (Copies caption + opens Story Card)"
            className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-slate-200 hover:text-white border border-pink-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm hover:border-pink-400"
          >
            <span className="text-pink-400 font-mono text-[11px]">♪</span>
            <span className="text-[11px]">TikTok</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => handleTikTokOrIG('instagram')}
            title="Share to Instagram Stories / Reels"
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-900/60 to-pink-900/60 hover:from-purple-800/80 hover:to-pink-800/80 text-pink-200 border border-pink-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span className="text-pink-300 text-[11px]">IG</span>
            <span className="text-[11px]">Reels</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            title="Share directly via WhatsApp"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span className="text-emerald-400 text-[11px]">WA</span>
            <span className="text-[11px]">WhatsApp</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleTwitter}
            title="Post on X (Twitter)"
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span className="text-[11px]">𝕏</span>
          </button>

          {/* Copy Referral Link */}
          <button
            onClick={handleCopyLink}
            title="Copy share link with your referral code"
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Copy Link</span>
              </>
            )}
          </button>

          {/* Story Card Preview */}
          {onNavigate && (
            <button
              onClick={() => onNavigate(`/social-share?id=${storyId}&r=${encodeURIComponent(effectiveReferral)}`)}
              title="Preview vertical 9:16 Instagram Story card with QR code"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
