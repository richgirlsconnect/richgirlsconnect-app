import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Search, 
  MapPin, 
  Instagram, 
  Copy, 
  Check, 
  Plus, 
  ShieldCheck, 
  Loader2, 
  ExternalLink, 
  Heart, 
  Crown, 
  UserPlus, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  DollarSign,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { saveGirl, getGirls } from '../lib/storage';
import { Girl } from '../types';

interface AiHunterPersona {
  name: string;
  suggested_handle: string;
  profile_type: string;
  bio_style: string;
  why_good_client: string;
  approach_message: string;
  icebreaker: string;
  estimated_wealth: string;
  avatar_url: string;
  interests: string[];
}

interface AiHuntHistory {
  id: string;
  niche: string;
  location: string;
  results: AiHunterPersona[];
  created_at: string;
}

const POPULAR_NICHES = [
  'Luxury Lifestyle & High Fashion',
  'Family Office & Sovereign Lineage',
  'Contemporary African Art & Philanthropy',
  'Equestrian & Polo Circuits',
  'Haute Horlogerie & Superyacht Design',
  'Biotech & Longevity Founders'
];

const POPULAR_LOCATIONS = [
  'Lagos & London',
  'Dubai Marina & DIFC',
  'Monaco & French Riviera',
  'Geneva & Zurich',
  'Paris & Bordeaux',
  'New York & Miami'
];

interface AiHunterPageProps {
  onNavigate: (path: string) => void;
}

export const AiHunterPage: React.FC<AiHunterPageProps> = ({ onNavigate }) => {
  // Input states
  const [niche, setNiche] = useState('Luxury Lifestyle & High Fashion');
  const [location, setLocation] = useState('Lagos & London');
  const [platform, setPlatform] = useState<'Instagram' | 'TikTok'>('Instagram');
  const [keywords, setKeywords] = useState('Afrobeats, contemporary art, private aviation, Mayfair dining');

  // Execution states
  const [isHunting, setIsHunting] = useState(false);
  const [results, setResults] = useState<AiHunterPersona[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [addedLeadIds, setAddedLeadIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<AiHuntHistory[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load hunt history from Supabase or localStorage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_hunts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          setHistory(data as AiHuntHistory[]);
          return;
        }
      } catch (err) {
        // fallback to local storage
      }

      const stored = localStorage.getItem('rc_ai_hunts_history_v1');
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    };

    loadHistory();
  }, []);

  const handleHunt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHunting(true);
    setError(null);

    try {
      const res = await fetch('/api/hunter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          location,
          platform,
          keywords
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate leads (status ${res.status})`);
      }

      const data = await res.json();
      const personas: AiHunterPersona[] = data.results || [];

      if (personas.length === 0) {
        throw new Error('No personas returned from intelligence model.');
      }

      setResults(personas);

      // Save to Supabase 'ai_hunts' table as specified
      const huntRecord: AiHuntHistory = {
        id: `hunt-${Date.now()}`,
        niche,
        location,
        results: personas,
        created_at: new Date().toISOString()
      };

      try {
        await supabase.from('ai_hunts').insert([huntRecord]);
      } catch (sbErr) {
        console.warn('Supabase ai_hunts table sync error:', sbErr);
      }

      // Update local history
      const updatedHistory = [huntRecord, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('rc_ai_hunts_history_v1', JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error('Hunt error:', err);
      setError(err?.message || 'Error occurred while running AI Hunter');
    } finally {
      setIsHunting(false);
    }
  };

  const handleCopyDm = (message: string, index: number) => {
    navigator.clipboard.writeText(message);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddToLeads = async (persona: AiHunterPersona, index: number) => {
    const leadKey = `${persona.name}-${index}`;
    if (addedLeadIds.has(leadKey)) return;

    // 1. Insert into Supabase 'rich_girls' table with status = 'hunted'
    try {
      await supabase.from('rich_girls').insert([
        {
          name: persona.name,
          instagram: persona.suggested_handle,
          image_url: persona.avatar_url,
          status: 'hunted'
        }
      ]);
    } catch (sbErr) {
      console.warn('Supabase rich_girls insert warning:', sbErr);
    }

    // 2. Also register in local CRM Girls storage so admin sees her in Finder & Pipeline
    const newGirl: Girl = {
      id: `hunted-${Date.now()}-${index}`,
      name: persona.name,
      age: 26,
      ig: persona.suggested_handle,
      location: location,
      ethnicity: 'High Society / International',
      bio: `${persona.profile_type} &bull; ${persona.bio_style}`,
      tags: persona.interests || ['Hunted Lead', 'High Affinity'],
      match_score: 96,
      match_reason: persona.why_good_client,
      public_likes_black_men: true,
      stage: 'Found',
      avatar_url: persona.avatar_url,
      created_at: new Date().toISOString()
    };
    saveGirl(newGirl);

    setAddedLeadIds(prev => new Set(prev).add(leadKey));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
              AI Girls Hunter &amp; Scouter
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Gemini 3.8 Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate and scout 10 high-value candidate personas by niche, location, and platform with psychological approach scripts and 1-click lead injection into <code className="text-amber-300 font-mono">rich_girls</code>.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Past Hunts ({history.length})</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('/admin/clients')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>Private Clients &rarr;</span>
          </button>
        </div>
      </div>

      {/* Hunter Filter Form */}
      <div className="luxury-card rounded-2xl p-5 sm:p-6 border border-amber-500/30 shadow-xl">
        <form onSubmit={handleHunt} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Niche Input */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Niche Archetype *</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Luxury Lifestyle & High Fashion"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {POPULAR_NICHES.slice(0, 3).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNiche(n)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {n.split('&')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Geographic Enclave *</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos, Dubai, London"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {POPULAR_LOCATIONS.slice(0, 3).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selector */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Discovery Platform *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlatform('Instagram')}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
                    platform === 'Instagram'
                      ? 'bg-gradient-to-r from-pink-600 to-amber-600 text-white border-pink-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('TikTok')}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
                    platform === 'TikTok'
                      ? 'bg-gradient-to-r from-cyan-600 to-slate-900 text-white border-cyan-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>TikTok</span>
                </button>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">Keywords &amp; Signals</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Afrobeats, Polo, contemporary art"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400">Triggers psychological alignment</span>
            </div>

          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Persona Modeling &bull; Auto-saves history to Supabase table <code className="text-amber-300 font-mono">ai_hunts</code></span>
            </div>

            <button
              type="submit"
              disabled={isHunting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isHunting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Hunting 10 Ideal Personas with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Hunt with AI (Generate 10 Leads)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif-luxury text-white flex items-center space-x-2">
                <span>Hunted Personas &amp; Outreach Blueprints</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {results.length} Leads
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Targeting: <span className="text-amber-300 font-medium">{niche}</span> &bull; <span className="text-slate-300">{location}</span> &bull; <span className="text-slate-300">{platform}</span>
              </p>
            </div>

            <div className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hunted Leads saved to ai_hunts table</span>
            </div>
          </div>

          {/* Cards Grid: 10 Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map((persona, idx) => {
              const leadKey = `${persona.name}-${idx}`;
              const isAdded = addedLeadIds.has(leadKey);

              return (
                <div
                  key={idx}
                  className="luxury-card rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 space-y-4 shadow-xl transition-all"
                >
                  {/* Top: Photo, Name, Handle, Wealth */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={persona.avatar_url}
                        alt={persona.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white text-sm">{persona.name}</h3>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {persona.suggested_handle}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium mt-0.5">
                          {persona.profile_type}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                          {persona.estimated_wealth}
                        </div>
                      </div>
                    </div>

                    {/* Platform Tag */}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
                      {platform}
                    </span>
                  </div>

                  {/* Bio Style */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                    "{persona.bio_style}"
                  </div>

                  {/* Why Good Client */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 flex items-center space-x-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Why She Is an Ideal Client / Partner:</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                      {persona.why_good_client}
                    </p>
                  </div>

                  {/* DM Script with 1-Click Copy */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        <span>Recommended {platform} DM Script:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyDm(persona.approach_message, idx)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-semibold cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#070a12] p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200 font-sans leading-relaxed relative">
                      "{persona.approach_message}"
                    </div>
                  </div>

                  {/* Icebreaker */}
                  <div className="flex items-start space-x-2 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 text-[10px] uppercase tracking-wider block">Icebreaker Hook:</span>
                      <span className="text-[11px]">{persona.icebreaker}</span>
                    </div>
                  </div>

                  {/* Interests Tags */}
                  {persona.interests && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {persona.interests.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action: Add to Leads */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Target: rich_girls table (status='hunted')
                    </span>

                    <button
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddToLeads(persona, idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added to Leads</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add to Leads</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold font-serif-luxury text-white">
                  Past AI Hunter Sessions (ai_hunts)
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item, hIdx) => (
                <div
                  key={item.id || hIdx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{item.niche}</div>
                    <div className="text-[11px] text-slate-400">{item.location} &bull; {new Date(item.created_at).toLocaleString()}</div>
                    <span className="text-[10px] text-amber-400 font-mono">{item.results?.length || 10} Personas generated</span>
                  </div>

                  <button
                    onClick={() => {
                      setResults(item.results);
                      setNiche(item.niche);
                      setLocation(item.location);
                      setShowHistoryModal(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 cursor-pointer"
                  >
                    Load Results
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
