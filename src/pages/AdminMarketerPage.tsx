import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Send, 
  Copy, 
  Check, 
  Instagram, 
  Share2, 
  FileText, 
  Users, 
  MapPin, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Crown, 
  MessageSquare, 
  ExternalLink,
  BookOpen,
  DollarSign,
  Flame,
  UserCheck,
  UserX,
  RefreshCw
} from 'lucide-react';
import { 
  getMarketingPosts, 
  saveMarketingPost, 
  getGirlApplications, 
  updateGirlApplicationStatus, 
  MarketingPost, 
  GirlApplication 
} from '../lib/marketplaceStorage';

interface ViralItem {
  type: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

interface SeoPost {
  title: string;
  meta_description: string;
  slug: string;
  target_keywords: string[];
  read_time: string;
  content_markdown: string;
}

interface PromoterTemplate {
  title: string;
  channel: string;
  subject: string;
  body: string;
  follow_up: string;
}

const MARKETING_CALENDAR = [
  { day: 'Monday', time: '11:00 AM', platform: 'Instagram Reels', task: 'Post Reels Hook: "Why girls in Dubai are quietly leaving dating apps"', target: 'Dubai & Monaco' },
  { day: 'Tuesday', time: '02:30 PM', platform: 'TikTok Video', task: 'Script: "POV: You entered a private non-indexed circle"', target: 'London & Lagos' },
  { day: 'Wednesday', time: '04:00 PM', platform: 'VIP DM Outreach', task: 'Send 20 cold invitations to Paris & Milan fashion curators', target: 'Paris & Milan' },
  { day: 'Thursday', time: '12:00 PM', platform: 'SEO Publication', task: 'Publish SEO Guide: "How to Find a High-Value Partner in Lagos & London"', target: 'Global Google Search' },
  { day: 'Friday', time: '06:00 PM', platform: 'Stories Q&A', task: 'Run Q&A on private matchmaking etiquette & application link', target: 'Waitlist Leads' }
];

interface AdminMarketerPageProps {
  onNavigate: (path: string) => void;
}

export const AdminMarketerPage: React.FC<AdminMarketerPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'viral' | 'seo' | 'promoter' | 'calendar' | 'applications'>('viral');

  // Viral Content Generator States
  const [targetCity, setTargetCity] = useState('Dubai');
  const [contentFocus, setContentFocus] = useState('Joining RichConnect Private Circle');
  const [viralItems, setViralItems] = useState<ViralItem[]>([]);
  const [isGeneratingViral, setIsGeneratingViral] = useState(false);
  const [copiedViralIndex, setCopiedViralIndex] = useState<number | null>(null);

  // SEO Generator States
  const [seoCity, setSeoCity] = useState('Dubai');
  const [seoTopic, setSeoTopic] = useState('How to Find a High-Value Partner & Rich Husband');
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [generatedSeoPost, setGeneratedSeoPost] = useState<SeoPost | null>(null);
  const [savedSeoPost, setSavedSeoPost] = useState(false);

  // AI Promoter States
  const [promoterAudience, setPromoterAudience] = useState('Luxury Lifestyle Influencers & Models');
  const [promoterChannel, setPromoterChannel] = useState('Instagram DM');
  const [promoterTemplates, setPromoterTemplates] = useState<PromoterTemplate[]>([]);
  const [isGeneratingPromoter, setIsGeneratingPromoter] = useState(false);
  const [copiedPromoterIndex, setCopiedPromoterIndex] = useState<number | null>(null);

  // Saved Marketing Posts & Applications
  const [marketingPosts, setMarketingPosts] = useState<MarketingPost[]>(() => getMarketingPosts());
  const [applications, setApplications] = useState<GirlApplication[]>(() => getGirlApplications());

  const handleGenerateViral = async () => {
    setIsGeneratingViral(true);
    try {
      const res = await fetch('/api/marketer/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: targetCity,
          platform: 'Instagram & TikTok',
          focus: contentFocus
        })
      });

      const data = await res.json();
      if (data.items) {
        setViralItems(data.items);
      }
    } catch (err) {
      console.error('Error generating viral content:', err);
    } finally {
      setIsGeneratingViral(false);
    }
  };

  const handleGenerateSeo = async () => {
    setIsGeneratingSeo(true);
    setSavedSeoPost(false);
    try {
      const res = await fetch('/api/marketer/generate-seo-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: seoCity,
          topic: seoTopic
        })
      });

      const data = await res.json();
      if (data.title) {
        setGeneratedSeoPost(data);

        // Auto save to marketing_posts table
        const newPost: MarketingPost = {
          id: `seo-${Date.now()}`,
          platform: 'Blog / SEO',
          content: `${data.title}\n\n${data.content_markdown}`,
          city_target: seoCity,
          status: 'published',
          created_at: new Date().toISOString()
        };
        await saveMarketingPost(newPost);
        setMarketingPosts(getMarketingPosts());
        setSavedSeoPost(true);
      }
    } catch (err) {
      console.error('Error generating SEO post:', err);
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const handleGeneratePromoter = async () => {
    setIsGeneratingPromoter(true);
    try {
      const res = await fetch('/api/marketer/generate-promoter-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAudience: promoterAudience,
          channel: promoterChannel
        })
      });

      const data = await res.json();
      if (data.templates) {
        setPromoterTemplates(data.templates);
      }
    } catch (err) {
      console.error('Error generating promoter templates:', err);
    } finally {
      setIsGeneratingPromoter(false);
    }
  };

  const handleUpdateAppStatus = async (id: string, status: 'approved' | 'rejected') => {
    const updated = await updateGirlApplicationStatus(id, status);
    setApplications(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
              AI Internal Marketer &amp; Growth Engine
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Autonomous Promoter
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous growth dashboard: Generate viral TikTok &amp; IG reels hooks, auto-rank city SEO blog posts, create cold promoter templates, and manage applicant approvals.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => onNavigate('/admin/social-command')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Viral Command Center &rarr;</span>
          </button>
          <button
            onClick={() => onNavigate('/join')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public /join Funnel</span>
          </button>
          <button
            onClick={() => onNavigate('/marketplace')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>Marketplace &rarr;</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('viral')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'viral' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Viral Social Content (10 Hooks)</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'seo' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>SEO Blog Articles (marketing_posts)</span>
        </button>

        <button
          onClick={() => setActiveTab('promoter')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'promoter' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>AI Promoter (Cold DMs)</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'calendar' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Growth Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'applications' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Girl Applications ({applications.length})</span>
        </button>
      </div>

      {/* Tab 1: Viral Content Generator */}
      {activeTab === 'viral' && (
        <div className="space-y-6">
          <div className="luxury-card rounded-2xl p-5 border border-amber-500/30 space-y-4">
            <h3 className="text-sm font-bold font-serif-luxury text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Viral Organic Content (Reels, TikTok &amp; IG Captions)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target City / Market</label>
                <select
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Dubai">Dubai (Palm Jumeirah &amp; DIFC)</option>
                  <option value="London">London (Mayfair &amp; Knightsbridge)</option>
                  <option value="Paris">Paris (8th Arrondissement)</option>
                  <option value="Lagos">Lagos (Ikoyi &amp; Banana Island)</option>
                  <option value="Monaco">Monaco (Monte Carlo)</option>
                  <option value="New York">New York (Manhattan &amp; Tribeca)</option>
                  <option value="Milan">Milan (Quadrilatero &amp; Como)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Angle</label>
                <input
                  type="text"
                  value={contentFocus}
                  onChange={(e) => setContentFocus(e.target.value)}
                  placeholder="e.g. Leaving dating apps for non-indexed private circles"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateViral}
              disabled={isGeneratingViral}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingViral ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting 10 Viral Assets with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Viral Content Pack (10 Scripts)</span>
                </>
              )}
            </button>
          </div>

          {/* Viral Items Output */}
          {viralItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Ready-to-Post Viral Scripts ({viralItems.length} Generated)
                </h4>
                <span className="text-[11px] text-slate-400">Targeting /join/{targetCity.toLowerCase()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {viralItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0b0e1a] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        {item.type}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${item.hook}\n\n${item.body}\n\n${item.cta}\n\n${item.hashtags.join(' ')}`);
                          setCopiedViralIndex(idx);
                          setTimeout(() => setCopiedViralIndex(null), 2000);
                        }}
                        className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 text-[11px] font-semibold cursor-pointer"
                      >
                        {copiedViralIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedViralIndex === idx ? 'Copied!' : 'Copy Script'}</span>
                      </button>
                    </div>

                    <div className="font-bold text-white leading-snug">
                      "{item.hook}"
                    </div>

                    <p className="text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      {item.body}
                    </p>

                    <div className="text-[11px] text-emerald-400 font-medium">
                      CTA: {item.cta}
                    </div>

                    {item.hashtags && (
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-mono">
                        {item.hashtags.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SEO Blog Post Generator */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="luxury-card rounded-2xl p-5 border border-amber-500/30 space-y-4">
            <h3 className="text-sm font-bold font-serif-luxury text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Auto-Generate SEO Article &amp; Save to marketing_posts Table</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">City Target *</label>
                <select
                  value={seoCity}
                  onChange={(e) => setSeoCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Lagos">Lagos</option>
                  <option value="London">London</option>
                  <option value="Paris">Paris</option>
                  <option value="Monaco">Monaco</option>
                  <option value="New York">New York</option>
                  <option value="Milan">Milan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">SEO Keyword Topic</label>
                <input
                  type="text"
                  value={seoTopic}
                  onChange={(e) => setSeoTopic(e.target.value)}
                  placeholder="e.g. How to Find a High-Value Partner & Rich Husband"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateSeo}
              disabled={isGeneratingSeo}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingSeo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authoring Full SEO Post with Gemini &amp; Syncing to Supabase...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Generate SEO Post for {seoCity}</span>
                </>
              )}
            </button>

            {savedSeoPost && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SEO Post generated and saved to Supabase table <strong>marketing_posts</strong>!</span>
              </div>
            )}
          </div>

          {generatedSeoPost && (
            <div className="luxury-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif-luxury text-white">{generatedSeoPost.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{generatedSeoPost.meta_description}</p>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {generatedSeoPost.read_time}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {generatedSeoPost.target_keywords?.map((kw, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono border border-slate-800">
                    {kw}
                  </span>
                ))}
              </div>

              <div className="bg-[#070912] p-4 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {generatedSeoPost.content_markdown}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Promoter (Cold DMs & VIP Outreach) */}
      {activeTab === 'promoter' && (
        <div className="space-y-6">
          <div className="luxury-card rounded-2xl p-5 border border-amber-500/30 space-y-4">
            <h3 className="text-sm font-bold font-serif-luxury text-white flex items-center space-x-2">
              <Send className="w-4 h-4 text-amber-400" />
              <span>AI Promoter: VIP Outreach &amp; Luxury Community Cold Templates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Community / Creators</label>
                <input
                  type="text"
                  value={promoterAudience}
                  onChange={(e) => setPromoterAudience(e.target.value)}
                  placeholder="e.g. Luxury Lifestyle Influencers & Models"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Outreach Channel</label>
                <select
                  value={promoterChannel}
                  onChange={(e) => setPromoterChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                >
                  <option value="Instagram DM">Instagram DM</option>
                  <option value="Email Pitch">Email Collaboration Pitch</option>
                  <option value="WhatsApp Direct">WhatsApp Concierge Invitation</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePromoter}
              disabled={isGeneratingPromoter}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPromoter ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting High-Status Templates with Gemini...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate Outreach Templates</span>
                </>
              )}
            </button>
          </div>

          {promoterTemplates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {promoterTemplates.map((tmpl, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{tmpl.title}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${tmpl.subject ? `Subject: ${tmpl.subject}\n\n` : ''}${tmpl.body}`);
                        setCopiedPromoterIndex(idx);
                        setTimeout(() => setCopiedPromoterIndex(null), 2000);
                      }}
                      className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                    >
                      {copiedPromoterIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPromoterIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {tmpl.subject && (
                    <div className="text-[11px] font-semibold text-amber-300">
                      Subject: {tmpl.subject}
                    </div>
                  )}

                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {tmpl.body}
                  </p>

                  {tmpl.follow_up && (
                    <div className="text-[11px] text-slate-400 italic">
                      Follow-up note: "{tmpl.follow_up}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Daily Marketing Tasks Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daily Growth Calendar &bull; RichConnect Global</h3>
            <span className="text-xs text-amber-400 font-mono">5-Day Viral Execution System</span>
          </div>

          <div className="space-y-3 text-xs">
            {MARKETING_CALENDAR.map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0b0e1a] border border-slate-800 hover:border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold">{slot.day.slice(0, 3)}</span>
                    <Clock className="w-3.5 h-3.5 mt-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{slot.platform}</span>
                      <span className="text-[10px] font-mono text-slate-400">&bull; {slot.time}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{slot.task}</p>
                    <span className="text-[10px] text-emerald-400 font-medium">Target: {slot.target}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('viral');
                    setTargetCity(slot.target.split('&')[0].trim());
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Create for this &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Girl Applications Approval Desk */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Girl Applications (girl_applications table)</h3>
              <p className="text-xs text-slate-400">Review, approve, or reject candidate submissions with paid $99 fees.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              Total Applicants: {applications.length}
            </span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div 
                key={app.id}
                className="p-4 rounded-2xl bg-[#0b0e1a] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start space-x-3.5">
                  <img
                    src={app.image_url}
                    alt={app.name}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-white text-sm">{app.name}</h4>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {app.instagram}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        app.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                        app.status === 'rejected' ? 'bg-rose-500/15 text-rose-400' :
                        'bg-amber-500/15 text-amber-300'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] flex items-center space-x-2">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{app.city}, {app.country}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-semibold">{app.net_worth}</span>
                      <span>&bull;</span>
                      <span className="text-slate-400 font-mono">Ref Code: {app.referral_code}</span>
                    </div>

                    <p className="text-slate-300 italic text-[11px] line-clamp-2 max-w-xl">
                      "{app.bio}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {app.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve Member</span>
                    </button>
                  )}

                  {app.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
