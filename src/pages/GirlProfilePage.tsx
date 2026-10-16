import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  Briefcase, 
  Heart, 
  Utensils, 
  Clock, 
  FileText, 
  Gift, 
  ExternalLink, 
  Save, 
  Check, 
  MessageSquare, 
  Trash2,
  Share2,
  MessageCircle
} from 'lucide-react';
import { Girl, Memory, PipelineStage } from '../types';
import { getMemory, saveMemory, updateGirlStage } from '../lib/storage';

interface GirlProfilePageProps {
  girlId: string;
  girls: Girl[];
  onBack: () => void;
  onNavigate: (path: string) => void;
  onUpdateStage: (id: string, stage: PipelineStage) => void;
}

export const GirlProfilePage: React.FC<GirlProfilePageProps> = ({
  girlId,
  girls,
  onBack,
  onNavigate,
  onUpdateStage,
}) => {
  const girl = girls.find(g => g.id === girlId);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Form states
  const [birthday, setBirthday] = useState('');
  const [business, setBusiness] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [food, setFood] = useState('');
  const [lastContact, setLastContact] = useState('');
  const [notes, setNotes] = useState('');
  const [giftIdeas, setGiftIdeas] = useState('');
  const [relationshipGoals, setRelationshipGoals] = useState('');

  useEffect(() => {
    if (girl) {
      const mem = getMemory(girl.id);
      setMemory(mem);
      setBirthday(mem.birthday || '');
      setBusiness(mem.business || '');
      setHobbies(mem.hobbies || '');
      setFood(mem.food || '');
      setLastContact(mem.last_contact || new Date().toISOString());
      setNotes(mem.notes || '');
      setGiftIdeas(mem.gift_ideas || '');
      setRelationshipGoals(mem.relationship_goals || '');
    }
  }, [girl?.id]);

  if (!girl) {
    return (
      <div className="luxury-card rounded-2xl p-12 text-center">
        <h3 className="text-xl font-serif-luxury font-bold text-slate-100">Profile Not Found</h3>
        <p className="text-xs text-slate-400 mt-2 mb-4">The selected contact does not exist in the database.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950"
        >
          Return to Previous
        </button>
      </div>
    );
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!memory) return;

    const updatedMem: Memory = {
      ...memory,
      birthday,
      business,
      hobbies,
      food,
      last_contact: lastContact,
      notes,
      gift_ideas: giftIdeas,
      relationship_goals: relationshipGoals,
      updated_at: new Date().toISOString(),
    };

    saveMemory(updatedMem);
    setMemory(updatedMem);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const setContactToNow = () => {
    setLastContact(new Date().toISOString());
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Finder</span>
        </button>

        <div className="flex items-center space-x-2">
          {(girl.whatsapp || girl.presidential_details?.whatsapp) && (
            <a
              href={`https://wa.me/${(girl.whatsapp || girl.presidential_details?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${girl.name}, I connected with you on RichConnect!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whatsapp-action-btn shadow-md"
              title={`Chat directly with ${girl.name} on WhatsApp`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp ({girl.whatsapp || girl.presidential_details?.whatsapp})</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>
          )}

          <button
            onClick={() => onNavigate(`/inbox/${girl.id}`)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Chat & AI Wingman</span>
          </button>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="luxury-card rounded-2xl overflow-hidden p-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img
              src={girl.avatar_url}
              alt={girl.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl shadow-amber-950/40"
            />
            {girl.public_likes_black_men && (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 border border-slate-900 shadow">
                VERIFIED
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
                  {girl.name}, {girl.age}
                </h1>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {girl.location} • {girl.ethnicity} • Net Worth Tier: {girl.estimated_net_worth || '$10M+'}
                </p>
              </div>

              {/* Match Score */}
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold font-serif-luxury text-sm flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{girl.match_score}% Match Score</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic">
              "{girl.bio}"
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={`https://instagram.com/${girl.ig.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-black/60 border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-semibold flex items-center space-x-1"
              >
                <span>{girl.ig}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {(girl.whatsapp || girl.presidential_details?.whatsapp) && (
                <a
                  href={`https://wa.me/${(girl.whatsapp || girl.presidential_details?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${girl.name}, I connected with you on RichConnect!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp: {girl.whatsapp || girl.presidential_details?.whatsapp}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
                </a>
              )}

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Pipeline Stage:</span>
                <select
                  value={girl.stage}
                  onChange={(e) => onUpdateStage(girl.id, e.target.value as PipelineStage)}
                  className="py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-semibold focus:border-amber-500 outline-none"
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
        </div>
      </div>

      {/* Memory Dossier Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="luxury-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-slate-100 flex items-center space-x-2">
                <span>Personal Memory Dossier</span>
                <span className="text-[10px] font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Used by Gemini AI for personalized replies
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep key psychological and lifestyle cues updated so every interaction feels deeply genuine.
              </p>
            </div>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all cursor-pointer shadow-md"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Saved!' : 'Save Memory'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* Birthday & Astrological */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Birthday & Zodiac Sign</span>
              </label>
              <input
                type="text"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="e.g. October 24 (Scorpio)"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Business / Career */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Business, Career & Ventures</span>
              </label>
              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="e.g. Managing Partner at Family Office in Mayfair"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Hobbies & Passions */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Hobbies, Travel & Music</span>
              </label>
              <input
                type="text"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="e.g. Showjumping, contemporary African art, Burna Boy concerts"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Food & Dining Spots */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                <span>Favorite Food & Restaurants</span>
              </label>
              <input
                type="text"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="e.g. Truffle pasta, Nobu, authentic spicy jollof rice"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Last Contact */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Last Contact Time</span>
                </label>
                <button
                  type="button"
                  onClick={setContactToNow}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Set to Just Now
                </button>
              </div>
              <input
                type="text"
                value={lastContact}
                onChange={(e) => setLastContact(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Gift Ideas */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gift Ideas & Milestone Wishlist</span>
              </label>
              <input
                type="text"
                value={giftIdeas}
                onChange={(e) => setGiftIdeas(e.target.value)}
                placeholder="e.g. Hermès leather equestrian gloves, art catalog"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
              />
            </div>

          </div>

          {/* Relationship Goals */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
              Relationship Goals & Courtship Vision
            </label>
            <input
              type="text"
              value={relationshipGoals}
              onChange={(e) => setRelationshipGoals(e.target.value)}
              placeholder="e.g. Monogamous power couple, mutual empire building, future family"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Detailed Private Strategy Notes */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Private Notes & Psychological Observations</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Log specific stories, conversational quirks, love language, topics she lights up about, or boundaries..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Last saved: {memory?.updated_at ? new Date(memory.updated_at).toLocaleString() : 'Never'}
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center space-x-2"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Changes Saved' : 'Save Memory Profile'}</span>
            </button>
          </div>

        </div>
      </form>

    </div>
  );
};
