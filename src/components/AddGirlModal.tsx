import React, { useState } from 'react';
import { X, Plus, Sparkles, UserCheck, Instagram } from 'lucide-react';
import { Girl, PipelineStage } from '../types';

interface AddGirlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (girl: Girl) => void;
}

export const AddGirlModal: React.FC<AddGirlModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [ig, setIg] = useState('');
  const [location, setLocation] = useState('UK');
  const [ethnicity, setEthnicity] = useState('White / Caucasian');
  const [bio, setBio] = useState('');
  const [tagsInput, setTagsInput] = useState('Rich, Queen lifestyle, Afrobeats Lover');
  const [matchScore, setMatchScore] = useState(95);
  const [matchReason, setMatchReason] = useState('Publicly enjoys African culture, high-status London social circle.');
  const [publicLikesBlackMen, setPublicLikesBlackMen] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [stage, setStage] = useState<PipelineStage>('Found');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newGirl: Girl = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      age: Number(age) || 25,
      ig: ig.startsWith('@') ? ig : (ig ? `@${ig}` : '@private_profile'),
      location,
      ethnicity,
      bio: bio.trim() || 'Private luxury profile curator.',
      tags: tags.length ? tags : ['Rich', 'Princess'],
      match_score: Number(matchScore) || 90,
      match_reason: matchReason.trim() || 'High affinity with cultural appreciation.',
      public_likes_black_men: publicLikesBlackMen,
      stage,
      avatar_url: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString(),
    };

    onAdd(newGirl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="luxury-card rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-serif-luxury font-bold text-slate-100">
              Add New Private Connection
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arabella Rothschild"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Age</label>
              <input
                type="number"
                min={18}
                max={50}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Instagram @Handle</label>
              <input
                type="text"
                value={ig}
                onChange={(e) => setIg(e.target.value)}
                placeholder="@username"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
              >
                <option value="US">US (New York, LA, Miami)</option>
                <option value="UK">UK (London, Mayfair, Surrey)</option>
                <option value="Canada">Canada (Toronto, Vancouver)</option>
                <option value="Europe">Europe (Monaco, Paris, Zurich)</option>
                <option value="Dubai">Dubai (Marina, Palm Jumeirah)</option>
                <option value="Lagos">Lagos (Ikoyi, Victoria Island)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bio / Public Details</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Gallery founder, art enthusiast, loves travelling to Nigeria & Ghana..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lifestyle Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Rich, Princess, Queen lifestyle, Equestrian"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Match Reason / Cultural Interest</label>
            <input
              type="text"
              value={matchReason}
              onChange={(e) => setMatchReason(e.target.value)}
              placeholder="Why this person is a top match for you..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Photo URL (Unsplash or direct image)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div>
              <span className="block font-semibold text-amber-200">Publicly States Preference for Black Men</span>
              <span className="text-[10px] text-slate-400">Verifies high cultural alignment</span>
            </div>
            <input
              type="checkbox"
              checked={publicLikesBlackMen}
              onChange={(e) => setPublicLikesBlackMen(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
            >
              Add Profile to CRM
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
