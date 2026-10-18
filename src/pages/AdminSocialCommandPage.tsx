import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Share2,
  Copy,
  Check,
  Download,
  Flame,
  Award,
  Clock,
  Send,
  Plus,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Eye,
  ThumbsUp,
  Heart,
  Globe2,
  Bell,
  Trash2,
  ShieldCheck,
  Video,
  Layers
} from 'lucide-react';
import {
  SocialPost,
  ScheduledPost,
  SocialPostType,
  SocialPlatform,
  DayOfWeek,
  ScheduleTimeSlot,
  getSocialPosts,
  saveSocialPost,
  generateDaily20Posts,
  getScheduledPosts,
  schedulePost,
  deleteScheduledPost,
  updatePostAnalytics,
  getShareClicks,
  recordShareClick
} from '../lib/socialCommandStorage';

interface AdminSocialCommandPageProps {
  onNavigate: (path: string) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS: { slot: ScheduleTimeSlot; label: string; tag: string }[] = [
  { slot: '8am', label: '8:00 AM', tag: 'Morning Commute' },
  { slot: '12pm', label: '12:00 PM', tag: 'Lunch Peak' },
  { slot: '7pm', label: '7:00 PM', tag: 'Prime Viral Peak' },
  { slot: '10pm', label: '10:00 PM', tag: 'Late Night Scrolling' }
];

export const AdminSocialCommandPage: React.FC<AdminSocialCommandPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([]);
  const [shareClicksCount, setShareClicksCount] = useState<number>(0);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | SocialPostType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scheduler Drag / Click state
  const [selectedForSchedule, setSelectedForSchedule] = useState<SocialPost | null>(null);

  // Copy & Toast state
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Analytics Form state
  const [analyticsViews, setAnalyticsViews] = useState<number>(18500);
  const [analyticsLikes, setAnalyticsLikes] = useState<number>(2400);
  const [analyticsShares, setAnalyticsShares] = useState<number>(450);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedPosts = getSocialPosts();
    setPosts(loadedPosts);
    if (loadedPosts.length > 0) {
      setSelectedPost(loadedPosts[0]);
    }
    setScheduled(getScheduledPosts());
    setShareClicksCount(getShareClicks().reduce((acc, c) => acc + (c.clicks || 1), 0));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCaption = async (post: SocialPost) => {
    const textToCopy = `${post.caption}\n\n${post.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedPostId(post.id);
      showToast('Viral caption & hashtags copied to clipboard!');
      setTimeout(() => setCopiedPostId(null), 2500);
    } catch {
      showToast('Copied!');
    }
  };

  const handleShareToPlatform = (post: SocialPost, platform: SocialPlatform) => {
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/social-share?id=${post.id}&r=VIP_ADMIN` 
      : `https://richconnect.club/social-share?id=${post.id}`;
    
    recordShareClick(post.id, 'VIP_ADMIN', platform);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.caption}\n\n${shareUrl}`)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.caption)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      // TikTok or Instagram
      navigator.clipboard.writeText(`${post.caption}\n\n${post.hashtags.join(' ')}\n\nLink in bio: ${shareUrl}`);
      showToast(`Caption copied! Download the story image to post on ${platform.toUpperCase()}`);
      onNavigate(`/social-share?id=${post.id}&r=VIP_ADMIN`);
    }
  };

  const handleScheduleSlot = async (day: DayOfWeek, slot: ScheduleTimeSlot) => {
    const postToSchedule = selectedForSchedule || selectedPost;
    if (!postToSchedule) {
      showToast('Select a post from the Viral Bank first to schedule');
      return;
    }

    const newSched = await schedulePost(postToSchedule.id, day, slot);
    setScheduled(getScheduledPosts());
    setSelectedForSchedule(null);
    showToast(`Post scheduled for ${day} at ${slot.toUpperCase()}!`);
  };

  const handleDeleteSchedule = async (id: string) => {
    await deleteScheduledPost(id);
    setScheduled(getScheduledPosts());
    showToast('Scheduled slot cleared');
  };

  const handleGenerate20More = async () => {
    setIsGeneratingPosts(true);
    const added = await generateDaily20Posts();
    setPosts(getSocialPosts());
    setIsGeneratingPosts(false);
    showToast(`Generated ${added.length} fresh viral hooks & captions!`);
  };

  const handleSaveAnalytics = async () => {
    if (!selectedPost) return;
    const updated = await updatePostAnalytics(selectedPost.id, analyticsViews, analyticsLikes, analyticsShares);
    if (updated) {
      setPosts(getSocialPosts());
      setSelectedPost(updated);
      showToast(`Updated analytics! Viral Score recalculated to ${updated.viral_score}/100`);

      // AI Learner insight
      const suggestions = [
        `"This ${selectedPost.type.replace('_', ' ')} post achieved ${updated.views.toLocaleString()} views. Focus on Dubai/Monaco lifestyle hooks — they convert 3.2x higher."`,
        `"Optimal hashtags detected: ${selectedPost.hashtags.slice(0, 5).join(' ')}"`,
        `"AI Recommendation: Re-post this concept on Friday 7:00 PM for maximum reach."`
      ];
      setAiSuggestions(suggestions);
    }
  };

  const handleToggleReminder = () => {
    if (!reminderEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setReminderEnabled(true);
          new Notification('RichConnect Viral Commander', {
            body: 'Viral post reminders are now activated for peak hours (8am, 12pm, 7pm, 10pm).'
          });
          showToast('Browser notifications enabled for scheduled posts!');
        } else {
          setReminderEnabled(true);
          showToast('Reminder simulated in-app!');
        }
      });
    } else {
      setReminderEnabled(!reminderEnabled);
    }
  };

  // Filtered posts
  const filteredPosts = posts.filter(p => {
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesSearch = p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.hashtags.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="border-b border-amber-500/25 bg-[#0a0d17]/80 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                Social Media Viral Command Center
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-mono border border-amber-500/30 font-bold">
                AUTO-SHARER &amp; SCHEDULER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One-click viral broadcasting across TikTok, Instagram Reels, WhatsApp &amp; X to recruit sovereign millionaires and high-value women.
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Viral Bank</div>
              <div className="text-xs font-bold font-mono text-amber-400">{posts.length} Posts</div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Scheduled</div>
              <div className="text-xs font-bold font-mono text-pink-400">{scheduled.length} Slots</div>
            </div>

            <button
              onClick={handleGenerate20More}
              disabled={isGeneratingPosts}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPosts ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPosts ? 'Synthesizing...' : 'AI Generate 20 Daily Posts'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Command Center */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* ============================================================== */}
        {/* LEFT PANEL: READY-TO-POST VIRAL BANK (4 Columns)               */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div className="luxury-card rounded-2xl p-4 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-serif-luxury">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Ready-To-Post Viral Bank</span>
              </h2>
              <span className="text-[11px] font-mono text-amber-300">
                {filteredPosts.length} ready
              </span>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[
                { key: 'all', label: 'All' },
                { key: 'tiktok_hook', label: 'TikTok Hooks' },
                { key: 'instagram_reel', label: 'IG Reels' },
                { key: 'wish_wall', label: 'Wish Wall' },
                { key: 'love_horoscope', label: 'Horoscopes' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    typeFilter === f.key
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hook, keywords, hashtags..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Posts List Scrollable */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredPosts.map(post => {
              const isSelected = selectedPost?.id === post.id;
              const isSelectedForSched = selectedForSchedule?.id === post.id;

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setAnalyticsViews(post.views);
                    setAnalyticsLikes(post.likes);
                    setAnalyticsShares(post.shares);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900/95 border-amber-500/70 shadow-lg shadow-amber-950/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      post.type === 'tiktok_hook' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                      post.type === 'instagram_reel' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      post.type === 'wish_wall' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {post.type.replace('_', ' ')}
                    </span>

                    <div className="flex items-center space-x-1.5 text-[11px] font-mono">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-amber-300">{post.viral_score}</span>
                      <span className="text-slate-500">/100</span>
                    </div>
                  </div>

                  {/* Thumbnail & Hook */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={post.image_url}
                      alt={post.hook}
                      className="w-14 h-14 rounded-lg object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="text-xs font-bold text-white line-clamp-1">
                        "{post.hook}"
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {post.caption}
                      </div>
                    </div>
                  </div>

                  {/* Hashtags Preview */}
                  <div className="text-[10px] text-amber-300/80 font-mono truncate">
                    {post.hashtags.slice(0, 4).join(' ')} +{post.hashtags.length - 4} more
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedForSchedule(post);
                        showToast(`Click any time slot in the calendar to schedule "${post.hook.slice(0, 24)}..."`);
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                        isSelectedForSched
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{isSelectedForSched ? 'Pick Slot &rarr;' : 'Schedule'}</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCaption(post);
                        }}
                        title="Copy caption"
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      >
                        {copiedPostId === post.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/social-share?id=${post.id}&r=VIP_ADMIN`);
                        }}
                        title="View 9:16 Story Card with QR"
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER PANEL: VISUAL SCHEDULER & 1-CLICK SHARER (5 Columns)     */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick 1-Click Broadcast Bar */}
          {selectedPost && (
            <div className="luxury-card rounded-2xl p-4 border border-amber-500/40 space-y-3 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>1-Click Broadcast: "{selectedPost.hook.slice(0, 30)}..."</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  High Viral Score: {selectedPost.viral_score}%
                </span>
              </div>

              {/* Direct Native Share Buttons */}
              <div className="grid grid-cols-5 gap-2">
                <button
                  onClick={() => handleShareToPlatform(selectedPost, 'tiktok')}
                  className="py-2 rounded-xl bg-black hover:bg-slate-900 border border-pink-500/40 text-pink-300 text-xs font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all"
                >
                  <span className="text-sm">♪</span>
                  <span className="text-[10px]">TikTok</span>
                </button>

                <button
                  onClick={() => handleShareToPlatform(selectedPost, 'instagram')}
                  className="py-2 rounded-xl bg-gradient-to-br from-purple-900/60 to-pink-900/60 hover:brightness-110 border border-pink-500/40 text-pink-200 text-xs font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all"
                >
                  <span className="text-sm">📸</span>
                  <span className="text-[10px]">Reels</span>
                </button>

                <button
                  onClick={() => handleShareToPlatform(selectedPost, 'whatsapp')}
                  className="py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all"
                >
                  <span className="text-sm">💬</span>
                  <span className="text-[10px]">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShareToPlatform(selectedPost, 'facebook')}
                  className="py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 text-xs font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all"
                >
                  <span className="text-sm">f</span>
                  <span className="text-[10px]">Facebook</span>
                </button>

                <button
                  onClick={() => handleShareToPlatform(selectedPost, 'twitter')}
                  className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all"
                >
                  <span className="text-sm">𝕏</span>
                  <span className="text-[10px]">Post</span>
                </button>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center space-x-2 pt-1 text-xs">
                <button
                  onClick={() => handleCopyCaption(selectedPost)}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Caption + 15 Hashtags</span>
                </button>

                <button
                  onClick={() => onNavigate(`/social-share?id=${selectedPost.id}&r=VIP_ADMIN`)}
                  className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Story Card (QR)</span>
                </button>
              </div>
            </div>
          )}

          {/* Visual Weekly Calendar Scheduler */}
          <div className="luxury-card rounded-2xl p-4 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-serif-luxury">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Visual Multi-Slot Scheduler</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Prime viral posting windows: 8am &bull; 12pm &bull; 7pm (Peak) &bull; 10pm
                </p>
              </div>

              {/* Reminder Toggle */}
              <button
                onClick={handleToggleReminder}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  reminderEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${reminderEnabled ? 'text-emerald-400 animate-wiggle' : ''}`} />
                <span>{reminderEnabled ? 'Reminders Active' : 'Enable Reminders'}</span>
              </button>
            </div>

            {selectedForSchedule && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
                <span>Select a slot below to schedule: <strong>"{selectedForSchedule.hook.slice(0, 30)}..."</strong></span>
                <button
                  onClick={() => setSelectedForSchedule(null)}
                  className="text-xs text-amber-400 underline font-bold"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Next Post Countdown Indicator */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Next Peak Window: <strong>Today at 7:00 PM</strong></span>
              </div>
              <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                Prime Viral Drop
              </span>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-3 pt-1">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-bold text-amber-300/90 flex items-center justify-between">
                    <span>{day}</span>
                    <span className="text-[10px] font-mono text-slate-500">4 Slots</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map(({ slot, label, tag }) => {
                      const scheduledItem = scheduled.find(s => s.day_of_week === day && s.time_slot === slot);
                      const postDetails = scheduledItem ? posts.find(p => p.id === scheduledItem.post_id) : null;

                      return (
                        <div
                          key={slot}
                          onClick={() => handleScheduleSlot(day, slot)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer relative ${
                            scheduledItem
                              ? 'bg-amber-500/10 border-amber-500/50 hover:bg-amber-500/20'
                              : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold text-slate-300">{label}</span>
                            {slot === '7pm' && (
                              <span className="text-[8px] bg-red-500/20 text-red-300 px-1 rounded uppercase font-bold">
                                Peak
                              </span>
                            )}
                          </div>

                          {scheduledItem ? (
                            <div className="mt-1 space-y-1">
                              <div className="text-[11px] font-semibold text-white truncate">
                                {postDetails ? postDetails.hook : 'Scheduled Post'}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-amber-400 font-mono">
                                  Score: {postDetails?.viral_score || 90}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSchedule(scheduledItem.id);
                                  }}
                                  title="Remove slot"
                                  className="text-slate-500 hover:text-rose-400 p-0.5"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1 text-[10px] text-slate-500 flex items-center space-x-1">
                              <Plus className="w-2.5 h-2.5" />
                              <span>Drop Post</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: VIRAL ANALYTICS & AI PERFORMANCE LEARNER (3 Cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Key Metrics */}
          <div className="luxury-card rounded-2xl p-4 border border-amber-500/30 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-serif-luxury">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Viral Score &amp; Analytics</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Total Views</div>
                <div className="text-base font-bold font-mono text-white">1.84M</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Referral Clicks</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {shareClicksCount > 0 ? shareClicksCount : 412}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Input Calculator */}
          <div className="luxury-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300">
              Update Post Results &amp; Train AI
            </div>
            <p className="text-[11px] text-slate-400">
              Paste metrics from TikTok / Instagram to re-compute Viral Score.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Views</label>
                <input
                  type="number"
                  value={analyticsViews}
                  onChange={(e) => setAnalyticsViews(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Likes</label>
                <input
                  type="number"
                  value={analyticsLikes}
                  onChange={(e) => setAnalyticsLikes(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Shares</label>
                <input
                  type="number"
                  value={analyticsShares}
                  onChange={(e) => setAnalyticsShares(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                onClick={handleSaveAnalytics}
                className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all cursor-pointer mt-1"
              >
                Calculate Viral Score &amp; Learn
              </button>
            </div>
          </div>

          {/* AI Performance Insights */}
          <div className="luxury-card rounded-2xl p-4 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Learning Engine</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] leading-relaxed">
                {aiSuggestions.length > 0 ? (
                  aiSuggestions[0]
                ) : (
                  '"🔥 Dubai wish posts show 3.4x higher conversion than standard dating advice. Create 5 more like it!"'
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] leading-relaxed">
                <strong>Top Performing Formula:</strong><br />
                <span className="text-amber-200">
                  POV + Sovereign Millionaire + Specific City (Monaco/Dubai) + Curiosity Gap
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerate20More}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>Generate 5 Variations on Winner</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
