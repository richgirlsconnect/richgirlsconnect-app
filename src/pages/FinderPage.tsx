import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  BookOpen, 
  Plus, 
  ShieldCheck, 
  RotateCcw,
  SlidersHorizontal,
  BookmarkCheck,
  MessageCircle
} from 'lucide-react';
import { Girl, PipelineStage } from '../types';

interface FinderPageProps {
  girls: Girl[];
  onUpdateStage: (id: string, stage: PipelineStage) => void;
  onNavigate: (path: string) => void;
  onOpenAddGirlModal: () => void;
}

export const FinderPage: React.FC<FinderPageProps> = ({
  girls,
  onUpdateStage,
  onNavigate,
  onOpenAddGirlModal,
}) => {
  // Filter States
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minAge, setMinAge] = useState<number>(22);
  const [maxAge, setMaxAge] = useState<number>(32);
  const [selectedEthnicity, setSelectedEthnicity] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedBioKeyword, setSelectedBioKeyword] = useState<string>('All');
  const [onlyPublicLikesBlackMen, setOnlyPublicLikesBlackMen] = useState<boolean>(true); // default true for high precision
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const locations = ['All', 'US', 'UK', 'Canada', 'Europe', 'Dubai', 'Lagos'];
  const ethnicities = ['All', 'White / Caucasian'];
  const popularTags = ['All', 'Presidential Daughter', 'Rich', 'Princess', 'Queen lifestyle', 'Equestrian', 'Heiress', 'Dubai lifestyle', 'High Fashion', 'Afrobeats Lover'];
  const bioKeywords = [
    'All',
    'love black men',
    'black kings',
    'interracial dating',
    'loves African men',
  ];

  const handleToggleSave = (id: string) => {
    setSavedStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetFilters = () => {
    setSelectedLocation('All');
    setMinAge(22);
    setMaxAge(32);
    setSelectedEthnicity('All');
    setSelectedTag('All');
    setSelectedBioKeyword('All');
    setOnlyPublicLikesBlackMen(false);
    setSearchQuery('');
  };

  // Filter Logic
  const filteredGirls = useMemo(() => {
    return girls.filter((girl) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = girl.name.toLowerCase().includes(q);
        const matchesBio = girl.bio.toLowerCase().includes(q);
        const matchesIg = girl.ig.toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesIg) return false;
      }

      // Location
      if (selectedLocation !== 'All' && girl.location !== selectedLocation) {
        return false;
      }

      // Age range
      if (girl.age < minAge || girl.age > maxAge) {
        return false;
      }

      // Ethnicity
      if (selectedEthnicity !== 'All' && girl.ethnicity !== selectedEthnicity) {
        return false;
      }

      // Tags
      if (selectedTag !== 'All' && !girl.tags.includes(selectedTag)) {
        return false;
      }

      // Bio Keywords
      if (selectedBioKeyword !== 'All') {
        const textToCheck = (girl.bio + ' ' + (girl.match_reason || '')).toLowerCase();
        if (!textToCheck.includes(selectedBioKeyword.toLowerCase())) {
          return false;
        }
      }

      // Toggle: Only girls who publicly state they like black men
      if (onlyPublicLikesBlackMen && !girl.public_likes_black_men) {
        return false;
      }

      return true;
    });
  }, [girls, selectedLocation, minAge, maxAge, selectedEthnicity, selectedTag, selectedBioKeyword, onlyPublicLikesBlackMen, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
              Curated <span className="gold-gradient-text">Match Finder</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {filteredGirls.length} Matches Found
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Precision targeting for affluent women aligned with your culture, lifestyle, and preferences.
          </p>
        </div>

        <button
          onClick={onOpenAddGirlModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Profile</span>
        </button>
      </div>

      {/* Filter Control Center */}
      <div className="luxury-card rounded-2xl p-5 sm:p-6 space-y-5">
        
        {/* Row 1: Search and Golden Toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search bar */}
          <div className="lg:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, Instagram @handle, bio keywords, or lifestyle..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Golden Special Toggle */}
          <div className="lg:col-span-5">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-black/40 border border-amber-500/40 cursor-pointer shadow-sm shadow-amber-950/50 hover:border-amber-400 transition-all">
              <div className="flex items-center space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-semibold text-amber-200">
                  Only girls who publicly state they like Black men
                </span>
              </div>
              <input
                type="checkbox"
                checked={onlyPublicLikesBlackMen}
                onChange={(e) => setOnlyPublicLikesBlackMen(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

        </div>

        {/* Row 2: Locations & Age */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-800/80">
          
          {/* Locations */}
          <div className="md:col-span-8">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Location Tier
            </span>
            <div className="flex flex-wrap gap-1.5">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedLocation === loc
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/30'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Age range slider / selector */}
          <div className="md:col-span-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Target Age: 22 - 32</span>
              <span className="text-amber-400 font-bold">{minAge} - {maxAge} yrs</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="22"
                max="32"
                value={minAge}
                onChange={(e) => setMinAge(Math.min(parseInt(e.target.value), maxAge))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <input
                type="range"
                min="22"
                max="32"
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(parseInt(e.target.value), minAge))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Row 3: Ethnicity, Lifestyle Tags & Bio Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          
          {/* Ethnicity */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Ethnicity
            </label>
            <select
              value={selectedEthnicity}
              onChange={(e) => setSelectedEthnicity(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="All">All Ethnicities</option>
              <option value="White / Caucasian">White / Caucasian (Target)</option>
            </select>
          </div>

          {/* Lifestyle Tags */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Lifestyle Tag Filter
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-amber-500 outline-none"
            >
              {popularTags.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Lifestyle Tags' : t}</option>
              ))}
            </select>
          </div>

          {/* Bio Keywords */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Bio Keyword Match
            </label>
            <select
              value={selectedBioKeyword}
              onChange={(e) => setSelectedBioKeyword(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-amber-500 outline-none"
            >
              {bioKeywords.map(k => (
                <option key={k} value={k}>{k === 'All' ? 'All Bio Keywords' : `"${k}"`}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Reset Filter Action */}
        <div className="flex justify-end pt-1">
          <button
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-amber-300 flex items-center space-x-1.5 py-1 px-2.5 rounded hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>

      </div>

      {/* Profiles Grid */}
      {filteredGirls.length === 0 ? (
        <div className="luxury-card rounded-2xl p-12 text-center">
          <Filter className="w-10 h-10 text-amber-500/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif-luxury font-bold text-slate-200">
            No profiles match this specific combination
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your age slider or unchecking the specific keyword filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGirls.map((girl) => {
            const isSaved = savedStatus[girl.id];
            return (
              <div
                key={girl.id}
                className="luxury-card luxury-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Header Bar */}
                  <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={girl.avatar_url}
                      alt={girl.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-black/30" />

                    {/* Match Score Badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold font-serif-luxury text-amber-300">
                        {girl.match_score}% Match
                      </span>
                    </div>

                    {/* Verified Tag / Likes Black Men tag */}
                    {girl.public_likes_black_men && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold shadow-md flex items-center space-x-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Publicly Likes Black Men</span>
                      </div>
                    )}

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <h2 className="text-xl font-bold font-serif-luxury text-white drop-shadow">
                          {girl.name}, {girl.age}
                        </h2>
                        <p className="text-xs text-amber-200/90 drop-shadow flex items-center space-x-1">
                          <span>{girl.location}</span>
                          <span>•</span>
                          <span>{girl.ethnicity}</span>
                          {girl.estimated_net_worth && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-300">{girl.estimated_net_worth}</span>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Instagram link */}
                      <a
                        href={`https://instagram.com/${girl.ig.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <span>{girl.ig}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Bio */}
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{girl.bio}"
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {girl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 border border-amber-500/20 text-amber-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Match Reason Box */}
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>Match Intelligence Reason:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-normal">
                        {girl.match_reason}
                      </p>
                    </div>

                    {/* Pipeline Stage Quick Changer */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Dating Stage:
                      </span>
                      <select
                        value={girl.stage}
                        onChange={(e) => onUpdateStage(girl.id, e.target.value as PipelineStage)}
                        className="py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-medium focus:border-amber-500 outline-none"
                      >
                        <option value="Found">Found</option>
                        <option value="Chatting">Chatting</option>
                        <option value="Close">Close</option>
                        <option value="Dating">Dating</option>
                        <option value="Visit Planned">Visit Planned</option>
                        <option value="Partner">Partner</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 space-y-2.5">
                  {/* Direct WhatsApp External Connect Button */}
                  {(girl.whatsapp || girl.presidential_details?.whatsapp) && (
                    <a
                      href={`https://wa.me/${(girl.whatsapp || girl.presidential_details?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${girl.name}, I discovered your profile on RichConnect!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl whatsapp-action-btn flex items-center justify-center space-x-1.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                      title={`Chat directly with ${girl.name} on WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Chat on WhatsApp ({girl.whatsapp || girl.presidential_details?.whatsapp})</span>
                      <ExternalLink className="w-3 h-3 text-white/80" />
                    </a>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSave(girl.id)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Heart className="w-3.5 h-3.5" />}
                      <span>{isSaved ? 'Saved to CRM' : 'Save'}</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate(`/girls/${girl.id}`)}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all"
                        title="View Memory Profile"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dossier</span>
                      </button>

                      <button
                        onClick={() => onNavigate(`/inbox/${girl.id}`)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat AI</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
