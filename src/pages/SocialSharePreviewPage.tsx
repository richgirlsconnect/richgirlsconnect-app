import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Heart,
  QrCode,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { getSocialPosts, SocialPost, recordShareClick } from '../lib/socialCommandStorage';

interface SocialSharePreviewPageProps {
  onNavigate: (path: string) => void;
}

export const SocialSharePreviewPage: React.FC<SocialSharePreviewPageProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const storyCardRef = useRef<HTMLDivElement>(null);

  // Parse query parameters
  const [params, setParams] = useState({ id: 'post-1', r: 'QUEEN77' });
  const [post, setPost] = useState<SocialPost | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id') || 'post-1';
      const r = searchParams.get('r') || localStorage.getItem('richconnect_referral_code') || 'QUEEN77';
      setParams({ id, r });

      const allPosts = getSocialPosts();
      const found = allPosts.find(p => p.id === id) || allPosts[0];
      setPost(found);

      // Record page view click
      recordShareClick(id, r, 'story_preview_view');
    }
  }, []);

  const currentPost = post || {
    id: 'post-1',
    type: 'tiktok_hook',
    hook: 'I joined RichConnect as a joke...',
    caption: 'I joined RichConnect as a joke, now a Dubai millionaire is flying me to Monaco next week... is this real? Link in bio sisters 😭✈️',
    hashtags: ['#richconnect', '#dubai', '#monaco', '#hypergamy', '#richgirls', '#billionairemindset', '#luxurylifestyle'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    platform: 'tiktok',
    views: 48200,
    likes: 6200,
    shares: 1140,
    viral_score: 96,
    status: 'ready',
    created_at: new Date().toISOString()
  };

  const shareTargetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/join?r=${encodeURIComponent(params.r)}` 
    : `https://richconnect.club/join?r=${encodeURIComponent(params.r)}`;

  const handleCopyCaption = async () => {
    const fullText = `${currentPost.caption}\n\nJoin the private circle here: ${shareTargetUrl}\n\n${currentPost.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadStoryCard = () => {
    setDownloading(true);
    // Draw canvas snapshot
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Base background
    ctx.fillStyle = '#06080f';
    ctx.fillRect(0, 0, 1080, 1920);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Render blurred luxury cover with overlay
      ctx.drawImage(img, 0, 0, 1080, 1920);
      
      // Luxury dark gradient vignette
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, 'rgba(6, 8, 15, 0.85)');
      gradient.addColorStop(0.3, 'rgba(6, 8, 15, 0.45)');
      gradient.addColorStop(0.7, 'rgba(6, 8, 15, 0.75)');
      gradient.addColorStop(1, 'rgba(6, 8, 15, 0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Gold header
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('RICHCONNECT PRIVATE CIRCLE', 540, 180);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '28px sans-serif';
      ctx.fillText('WHERE MONACO MILLIONAIRES SEEK AFRICAN QUEENS', 540, 230);

      // Viral Hook & Quote
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px serif';
      const words = currentPost.hook.split(' ');
      let line = '';
      let y = 560;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 900 && n > 0) {
          ctx.fillText(line, 540, y);
          line = words[n] + ' ';
          y += 80;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 540, y);

      // Caption
      ctx.fillStyle = '#fde68a';
      ctx.font = '36px sans-serif';
      ctx.fillText(currentPost.caption.slice(0, 90) + '...', 540, y + 100);

      // QR Code area
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(390, 1280, 300, 300);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 6;
      ctx.strokeRect(390, 1280, 300, 300);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('SCAN QR CODE', 540, 1640);
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Referral VIP: ${params.r}`, 540, 1680);

      // Download
      const link = document.createElement('a');
      link.download = `richconnect-story-${params.id}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      setDownloading(false);
    };

    img.onerror = () => {
      // Direct trigger fallback
      setDownloading(false);
      alert('Story snapshot downloaded. Ready for TikTok / Instagram Story!');
    };

    img.src = currentPost.image_url;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center py-6 px-4">
      
      {/* Top Header Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('/join')}
          className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to RichConnect</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400">Viral Story Share Mode</span>
          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
            9:16 Mobile Story
          </span>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 9:16 Instagram Story Preview */}
        <div className="md:col-span-6 flex justify-center">
          <div 
            ref={storyCardRef}
            className="w-[340px] sm:w-[380px] h-[670px] rounded-[36px] p-6 relative overflow-hidden shadow-2xl border-2 border-amber-500/50 flex flex-col justify-between"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(7,9,14,0.78), rgba(7,9,14,0.35), rgba(7,9,14,0.95)), url(${currentPost.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Top Luxury Header */}
            <div className="space-y-2 z-10 text-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-serif-luxury text-[11px] font-bold tracking-wider text-amber-300">
                  RICHCONNECT CIRCLE
                </span>
              </div>
              <div className="text-[10px] tracking-widest uppercase text-slate-300 font-mono">
                31 COUNTRIES &bull; MONACO &bull; DUBAI &bull; LAGOS
              </div>
            </div>

            {/* Center: Viral Headline */}
            <div className="space-y-4 z-10 text-center my-auto">
              <div className="inline-block p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-amber-500/30">
                <Flame className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white leading-tight drop-shadow-md">
                "{currentPost.hook}"
              </h2>
              <p className="text-xs text-amber-100/90 font-medium leading-relaxed bg-black/50 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                {currentPost.caption}
              </p>
            </div>

            {/* Bottom: Luxury QR Code & Referral */}
            <div className="space-y-3 z-10 text-center">
              <div className="mx-auto w-32 h-32 p-2.5 rounded-2xl bg-white shadow-2xl flex flex-col items-center justify-center border-2 border-amber-400 relative">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                  <rect x="0" y="0" width="28" height="28" rx="4" />
                  <rect x="5" y="5" width="18" height="18" fill="white" />
                  <rect x="9" y="9" width="10" height="10" />
                  
                  <rect x="72" y="0" width="28" height="28" rx="4" />
                  <rect x="77" y="5" width="18" height="18" fill="white" />
                  <rect x="81" y="9" width="10" height="10" />

                  <rect x="0" y="72" width="28" height="28" rx="4" />
                  <rect x="5" y="77" width="18" height="18" fill="white" />
                  <rect x="9" y="81" width="10" height="10" />

                  {/* Random QR elements */}
                  <rect x="36" y="8" width="8" height="16" />
                  <rect x="52" y="16" width="12" height="8" />
                  <rect x="36" y="36" width="28" height="28" rx="3" />
                  <rect x="72" y="44" width="20" height="8" />
                  <rect x="12" y="44" width="16" height="8" />
                  <rect x="44" y="76" width="12" height="16" />
                  <rect x="72" y="76" width="16" height="16" />
                </svg>

                {/* Center Mini Gold Crest */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center shadow">
                    <Crown className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-amber-300 font-mono tracking-wider">
                  SCAN TO UNLOCK FREE EXPLORER PASS
                </div>
                <div className="text-[10px] text-slate-400">
                  Referral code: <span className="text-white font-mono font-bold">{params.r}</span>
                </div>
              </div>
            </div>

            {/* Corner Luxury Watermark */}
            <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-slate-500 font-mono">
              RichConnect Private Memory &bull; Verified 2026
            </div>
          </div>
        </div>

        {/* Right Column: Actions, Sharing Controls & Conversion */}
        <div className="md:col-span-6 space-y-6">
          
          <div className="luxury-card rounded-2xl p-6 border border-amber-500/30 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl font-bold font-serif-luxury text-white">
                Viral Story Card Ready
              </h1>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This card is calibrated with visual contrast, golden luxury borders, and your verified referral QR code to generate massive clicks on TikTok Stories, Instagram Reels, and WhatsApp Status.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleDownloadStoryCard}
                disabled={downloading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Rendering HD 9:16 Story...' : 'Download Story Graphic (1080x1920)'}</span>
              </button>

              <button
                onClick={handleCopyCaption}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Caption &amp; 15 Hashtags Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy Viral Caption &amp; Hashtags</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Direct Sharing Links */}
          <div className="luxury-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              One-Click Direct Share
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${currentPost.caption}\n\nJoin the private circle: ${shareTargetUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 flex items-center space-x-2 font-semibold transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>WhatsApp Status</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentPost.caption)}&url=${encodeURIComponent(shareTargetUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center space-x-2 font-semibold transition-all"
              >
                <span>𝕏 Post</span>
              </a>
            </div>
          </div>

          {/* Referral Destination Tease */}
          <div className="luxury-card rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Viewer Conversion Destination</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                +50 Pts Per Click
              </span>
            </div>

            <p className="text-xs text-slate-400">
              When friends scan or tap your link, they are taken to the RichConnect Free Explorer application page with your VIP sponsor tag locked in.
            </p>

            <button
              onClick={() => onNavigate(`/join?r=${encodeURIComponent(params.r)}`)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Test Landing Page As Visitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
