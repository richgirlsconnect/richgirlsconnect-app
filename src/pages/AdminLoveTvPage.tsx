import React, { useState, useEffect } from 'react';
import {
  Tv,
  Sparkles,
  RefreshCw,
  Plus,
  Play,
  Check,
  X,
  Vote,
  Eye,
  Heart,
  BarChart3,
  ExternalLink,
  Flame,
  Award,
  Crown,
  Share2,
  Clock,
  Layers,
  ChevronRight,
  Edit2
} from 'lucide-react';
import {
  LoveShow,
  ShowTitleSuggestion,
  getLoveShows,
  saveLoveShow,
  getTitleSuggestions,
  generate5AiEpisodes
} from '../lib/loveTvStorage';

interface AdminLoveTvPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoveTvPage: React.FC<AdminLoveTvPageProps> = ({ onNavigate }) => {
  const [shows, setShows] = useState<LoveShow[]>([]);
  const [suggestions, setSuggestions] = useState<ShowTitleSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'episodes' | 'suggestions' | 'analytics'>('episodes');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingShow, setEditingShow] = useState<LoveShow | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCliffhanger, setEditCliffhanger] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setShows(getLoveShows());
    setSuggestions(getTitleSuggestions());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerate5 = async () => {
    setIsGenerating(true);
    const added = await generate5AiEpisodes();
    setShows(getLoveShows());
    setIsGenerating(false);
    showToast(`🎬 Generated ${added.length} fresh Pixar-style 3-scene reality episodes!`);
  };

  const handleTogglePublish = async (show: LoveShow) => {
    const updated: LoveShow = {
      ...show,
      status: show.status === 'published' ? 'draft' : 'published'
    };
    await saveLoveShow(updated);
    setShows(getLoveShows());
    showToast(`Episode ${show.episode_number} ${updated.status === 'published' ? 'published to /love-tv' : 'moved to draft'}!`);
  };

  const handleStartEdit = (show: LoveShow) => {
    setEditingShow(show);
    setEditTitle(show.title);
    setEditCliffhanger(show.cliffhanger);
  };

  const handleSaveEdit = async () => {
    if (!editingShow) return;
    const updated: LoveShow = {
      ...editingShow,
      title: editTitle.trim(),
      cliffhanger: editCliffhanger.trim()
    };
    await saveLoveShow(updated);
    setShows(getLoveShows());
    setEditingShow(null);
    showToast(`Episode ${editingShow.episode_number} updated successfully!`);
  };

  const handlePickWinnerTitle = async (sug: ShowTitleSuggestion) => {
    // Generate episode with this title
    const nextEpNum = shows.length + 1;
    const newEp: LoveShow = {
      id: `show-sug-${Date.now()}`,
      title: sug.suggested_title,
      format: sug.format,
      season: 1,
      episode_number: nextEpNum,
      hook: `Community Chosen Episode ${nextEpNum}: Suggested by ${sug.user_name}. ${sug.concept}`,
      thumbnail_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      hero_banner_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      synopsis: `Winner of the audience title poll! Follow this story inspired by ${sug.user_name}.`,
      sponsor: { name: 'Audience Choice Studio', tag: 'Community Winner' },
      suggested_by: sug.user_name,
      views: 12400,
      likes: 2190,
      shares: 410,
      status: 'published',
      broadcast_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      cliffhanger: 'Will the sovereign prince unveil her true feelings at the grand gala?',
      poll_question: 'Should she accept the private invitation to Dubai?',
      poll_options: [
        { id: 'opt-win-a', label: 'Yes, Fly to Dubai (81%)', votes: 1200 },
        { id: 'opt-win-b', label: 'Stay and Test His Loyalty (19%)', votes: 280 }
      ],
      scenes: [
        {
          sceneNumber: 1,
          title: 'Scene 1: The Inciting Spark',
          setting: 'Lagos Waterfront Terrace',
          narration: `Inspired by ${sug.user_name}: She received an unexpected notification on RichConnect.`,
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
          characterA: 'The Queen',
          durationSeconds: 12
        },
        {
          sceneNumber: 2,
          title: 'Scene 2: High Society Crossroads',
          setting: 'Mayfair / Dubai Marina',
          narration: `Sovereign elegance meets deep ambition. A secret proposal is offered.`,
          imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
          characterA: 'The Suitor',
          durationSeconds: 14
        },
        {
          sceneNumber: 3,
          title: 'Scene 3: The Midnight Choice',
          setting: 'Helipad Lounge',
          narration: `The flight is ready for takeoff. Her decision will determine the next dynasty chapter.`,
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
          characterA: 'The Decision',
          durationSeconds: 15
        }
      ]
    };

    await saveLoveShow(newEp);
    setShows(getLoveShows());
    showToast(`🏆 Picked winner! Created Episode ${nextEpNum}: "${sug.suggested_title}" and published to /love-tv!`);
  };

  const totalViews = shows.reduce((sum, s) => sum + s.views, 0);
  const totalVotes = shows.reduce((sum, s) => sum + s.poll_options.reduce((oSum, opt) => oSum + opt.votes, 0), 0);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="border-b border-amber-500/25 bg-[#0a0d17]/90 px-4 sm:px-6 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                <Tv className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                Love TV™ Executive Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-mono border border-amber-500/30 font-bold">
                PRODUCER DESK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage AI reality episodes, approve audience suggested titles, and monitor live viewer ratings.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => onNavigate('/love-tv')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public /love-tv</span>
            </button>

            <button
              onClick={handleGenerate5}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate 5 Episodes Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="luxury-card rounded-2xl p-4 border border-amber-500/20 text-center space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Reality Episodes</div>
            <div className="text-2xl font-bold font-mono text-amber-400">{shows.length}</div>
          </div>

          <div className="luxury-card rounded-2xl p-4 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Viewer Impressions</div>
            <div className="text-2xl font-bold font-mono text-white">{totalViews.toLocaleString()}</div>
          </div>

          <div className="luxury-card rounded-2xl p-4 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Audience Votes</div>
            <div className="text-2xl font-bold font-mono text-pink-400">{totalVotes.toLocaleString()}</div>
          </div>

          <div className="luxury-card rounded-2xl p-4 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400">Community Title Submissions</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{suggestions.length}</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'episodes' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Reality Episodes ({shows.length})
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'suggestions' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Community Suggested Titles ({suggestions.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Ratings &amp; Voting Analytics
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: EPISODES MANAGEMENT                                     */}
        {/* ============================================================== */}
        {activeTab === 'episodes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Broadcast queue for /love-tv reality stream</span>
              <span className="font-mono text-amber-300">4 Show Formats Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shows.map(show => (
                <div
                  key={show.id}
                  className="luxury-card rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-black/60 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                          EPISODE {show.episode_number}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {show.format.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleTogglePublish(show)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          show.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {show.status === 'published' ? '● Published' : 'Draft (Offline)'}
                      </button>
                    </div>

                    <div className="flex items-start space-x-3">
                      <img
                        src={show.thumbnail_url}
                        alt={show.title}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-bold text-white text-sm">
                          {show.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {show.hook}
                        </p>
                      </div>
                    </div>

                    {/* Cliffhanger preview */}
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-[11px] text-slate-300 space-y-0.5">
                      <span className="text-[9px] uppercase font-mono text-amber-400 font-bold">Cliffhanger:</span>
                      <p className="line-clamp-2">{show.cliffhanger}</p>
                    </div>

                    {/* Poll snapshot */}
                    <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                      <span>Poll: <strong>{show.poll_question}</strong></span>
                      <span className="text-pink-300">
                        {show.poll_options.reduce((s, o) => s + o.votes, 0).toLocaleString()} votes
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <button
                      onClick={() => handleStartEdit(show)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Title &amp; Cliffhanger</span>
                    </button>

                    <button
                      onClick={() => onNavigate('/love-tv')}
                      className="text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <span>Preview</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: COMMUNITY TITLE SUGGESTIONS                             */}
        {/* ============================================================== */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Audience submitted episode concepts — Pick winner to synthesize into next episode</span>
              <span className="font-mono text-emerald-400">{suggestions.length} submitted</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((sug, i) => (
                <div
                  key={sug.id || i}
                  className="luxury-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">By <strong className="text-amber-300">{sug.user_name}</strong></span>
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        {sug.upvotes} Upvotes
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">
                      "{sug.suggested_title}"
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sug.concept}
                    </p>

                    <div className="text-[10px] font-mono text-slate-400">
                      Format: <span className="text-amber-400 uppercase">{sug.format.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePickWinnerTitle(sug)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Pick Winner &amp; Publish Episode</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ANALYTICS                                               */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="luxury-card rounded-3xl p-6 border border-amber-500/30 space-y-4">
              <h3 className="font-serif-luxury font-bold text-white text-base flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span>Audience Engagement by Reality Episode</span>
              </h3>

              <div className="space-y-3">
                {shows.map(s => {
                  const maxViews = 60000;
                  const pct = Math.min(100, Math.round((s.views / maxViews) * 100));

                  return (
                    <div key={s.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">
                          Ep {s.episode_number}: {s.title}
                        </span>
                        <span className="font-mono text-amber-300">{s.views.toLocaleString()} views</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Episode Modal */}
      {editingShow && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="luxury-card rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-amber-500/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="font-serif-luxury font-bold text-white text-base">
                Edit Episode {editingShow.episode_number}
              </h3>
              <button onClick={() => setEditingShow(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Episode Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cliffhanger Text:</label>
                <textarea
                  rows={3}
                  value={editCliffhanger}
                  onChange={(e) => setEditCliffhanger(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleSaveEdit}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
              >
                Save Changes &amp; Sync
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
