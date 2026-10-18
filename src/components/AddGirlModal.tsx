import React, { useState } from 'react';
import { X, Plus, Sparkles, UserCheck, Instagram, Upload, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Girl, PipelineStage } from '../types';
import { supabase } from '../lib/supabase';

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

  // Supabase File & Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUploadAndInsert = async (fileToUpload: File, girlName: string, girlIg: string): Promise<string | null> => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const fileName = `${Date.now()}-${fileToUpload.name}`;
      const uploadRes = await supabase.storage.from('client-images').upload(fileName, fileToUpload);
      if (uploadRes.error) {
        throw new Error(uploadRes.error.message || 'Failed to upload image to Supabase storage bucket client-images');
      }

      const { data: { publicUrl: generatedUrl } } = supabase.storage.from('client-images').getPublicUrl(fileName);

      const insertRes = await supabase.from('rich_girls').insert([
        { 
          name: girlName, 
          instagram: girlIg, 
          image_url: generatedUrl 
        }
      ]);
      if (insertRes.error) {
        throw new Error(insertRes.error.message || 'Failed to insert client into rich_girls table');
      }

      setPublicUrl(generatedUrl);
      setAvatarUrl(generatedUrl);
      setSuccessMsg(`Image uploaded to 'client-images' & client inserted into 'rich_girls' table!`);
      return generatedUrl;
    } catch (err: any) {
      console.error('Supabase error:', err);
      const msg = err?.message || 'Error uploading image or inserting client into Supabase.';
      setErrorMsg(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMsg(null);
    setSuccessMsg(null);
    setPublicUrl(null);

    // If name is already provided, immediately execute the upload and insert
    if (name.trim()) {
      const cleanIg = ig.startsWith('@') ? ig : (ig ? `@${ig}` : `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
      await handleUploadAndInsert(file, name.trim(), cleanIg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const instagramHandle = ig.startsWith('@') ? ig : (ig ? `@${ig}` : `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
    let finalImageUrl = publicUrl || avatarUrl.trim();

    // If file was selected but not uploaded yet:
    if (selectedFile && !publicUrl) {
      const uploadedUrl = await handleUploadAndInsert(selectedFile, name.trim(), instagramHandle);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        // Keep modal open so user can review the error
        return;
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newGirl: Girl = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      age: Number(age) || 25,
      ig: instagramHandle,
      location,
      ethnicity,
      bio: bio.trim() || 'Private luxury profile curator.',
      tags: tags.length ? tags : ['Rich', 'Princess'],
      match_score: Number(matchScore) || 90,
      match_reason: matchReason.trim() || 'High affinity with cultural appreciation.',
      public_likes_black_men: publicLikesBlackMen,
      stage,
      avatar_url: finalImageUrl,
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
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-200">Supabase Error</p>
                <p className="text-[11px] text-rose-300/90 break-words mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-emerald-200">Supabase Connected</p>
                <p className="text-[11px] text-emerald-300/90 break-words mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

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

          {/* Supabase Storage 'client-images' & 'rich_girls' insert File Input */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-200 font-semibold text-xs flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Image (Supabase Bucket: client-images)</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                rich_girls table
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-14 h-14 rounded-lg object-cover border border-amber-500/50 shadow-md shrink-0" 
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-500 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-[9px]">Preview</span>
                </div>
              )}

              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isLoading}
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer bg-slate-950 p-1.5 rounded-lg border border-slate-800"
                />
                <p className="text-[10px] text-slate-400">
                  Select image to upload to <code className="text-amber-300">client-images</code> as <code className="text-amber-300">Date.now()-file.name</code> and save to <code className="text-amber-300">rich_girls</code>.
                </p>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center space-x-2 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                <span>Uploading to Supabase bucket 'client-images' & inserting into rich_girls...</span>
              </div>
            )}

            {publicUrl && (
              <div className="text-[10px] text-emerald-400 break-all bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                <span className="font-semibold">Public URL:</span> {publicUrl}
              </div>
            )}
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
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isLoading ? 'Uploading...' : 'Add Profile to CRM'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
