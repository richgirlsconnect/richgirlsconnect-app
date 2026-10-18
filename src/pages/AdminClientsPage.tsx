import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  Search, 
  Filter, 
  Sparkles, 
  EyeOff, 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Trash2, 
  ArrowRight,
  DollarSign,
  Heart,
  Globe2,
  Lock,
  Upload,
  Loader2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Client, Match } from '../types';
import { getClients, saveClient, deleteClient, getMatches, saveMatch } from '../lib/matchmakingStorage';
import { supabase } from '../lib/supabase';

interface AdminClientsPageProps {
  onNavigate: (path: string) => void;
}

export const AdminClientsPage: React.FC<AdminClientsPageProps> = ({ onNavigate }) => {
  const [clients, setClients] = useState<Client[]>(() => getClients());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'All' | 'Male' | 'Female'>('All');
  const [filterWealth, setFilterWealth] = useState<string>('All');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isMatchingClientId, setIsMatchingClientId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form in Modal
  const [newName, setNewName] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newAge, setNewAge] = useState(29);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newLocation, setNewLocation] = useState('London & Monaco');
  const [newPartnerPref, setNewPartnerPref] = useState('Ambitious Black Kings & African Visionaries');
  const [newWealth, setNewWealth] = useState('Ultra High Net Worth ($25M - $50M)');
  const [newBio, setNewBio] = useState('');
  const [newWhatTheyWant, setNewWhatTheyWant] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');

  // Supabase Image Upload & Storage State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const matches = getMatches();

  const handleRefresh = () => {
    setClients(getClients());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove private client dossier "${name}"?`)) {
      deleteClient(id);
      handleRefresh();
      if (selectedClient?.id === id) setSelectedClient(null);
    }
  };

  const handleRunMatchmaker = async (client: Client) => {
    setIsMatchingClientId(client.id);
    try {
      const candidates = clients.filter((c) => c.id !== client.id);
      const res = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetClient: client,
          candidates,
        }),
      });

      const data = await res.json();
      if (data.matches && Array.isArray(data.matches)) {
        for (const m of data.matches) {
          const cand = candidates.find((c) => c.id === m.candidateId);
          if (cand) {
            const newMatch: Match = {
              id: 'match-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              client_a_id: client.id,
              client_b_id: cand.id,
              score: m.score,
              reason: m.reason,
              status: 'pending',
              created_at: new Date().toISOString(),
              approved_at: null,
            };
            await saveMatch(newMatch);
          }
        }
        alert(`AI Matchmaker successfully analyzed compatibility with ${candidates.length} clients and added top suggested matches for ${client.name}!`);
        onNavigate('/admin/matches');
      }
    } catch (err) {
      console.error('Error running matchmaker:', err);
      alert('Error running AI Matchmaker.');
    } finally {
      setIsMatchingClientId(null);
    }
  };

  const handleUploadAndInsert = async (fileToUpload: File, clientName: string, clientInstagram: string): Promise<string | null> => {
    setIsLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileName = `${Date.now()}-${fileToUpload.name}`;
      const uploadRes = await supabase.storage.from('client-images').upload(fileName, fileToUpload);
      if (uploadRes.error) {
        throw new Error(uploadRes.error.message || 'Failed to upload image to Supabase storage bucket client-images');
      }

      const { data: { publicUrl: generatedUrl } } = supabase.storage.from('client-images').getPublicUrl(fileName);

      const insertRes = await supabase.from('rich_girls').insert([
        { 
          name: clientName, 
          instagram: clientInstagram, 
          image_url: generatedUrl 
        }
      ]);
      if (insertRes.error) {
        throw new Error(insertRes.error.message || 'Failed to insert client into rich_girls table');
      }

      setPublicUrl(generatedUrl);
      setUploadSuccess(`Successfully uploaded to bucket 'client-images' and inserted into 'rich_girls'!`);
      return generatedUrl;
    } catch (err: any) {
      console.error('Supabase error:', err);
      const msg = err?.message || 'Error uploading image or inserting client into Supabase.';
      setUploadError(msg);
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
    setUploadError(null);
    setUploadSuccess(null);
    setPublicUrl(null);

    // If client name is already filled, automatically run the upload & insert
    if (newName.trim()) {
      const ig = newInstagram.trim() || `@${newName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      await handleUploadAndInsert(file, newName.trim(), ig);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let finalImageUrl = publicUrl || newAvatar;

    // If file was selected but not uploaded yet (or re-upload needed):
    if (selectedFile && !publicUrl) {
      const ig = newInstagram.trim() || `@${newName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const uploadedUrl = await handleUploadAndInsert(selectedFile, newName.trim(), ig);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        // Keep modal open so user sees error and can fix or retry
        return;
      }
    }

    const created: Client = {
      id: 'client-' + Date.now(),
      name: newName.trim(),
      age: Number(newAge) || 28,
      gender: newGender,
      location: newLocation.trim(),
      avatar_url: finalImageUrl,
      photos: [finalImageUrl],
      partner_preference: newPartnerPref,
      wealth_level: newWealth,
      bio: newBio.trim(),
      what_they_want: newWhatTheyWant.trim(),
      is_public: false,
      whatsapp: newWhatsapp.trim(),
      email: newEmail.trim(),
      consultation_paid: true,
      consultation_amount: 2500,
      consultation_gateway: 'Stripe',
      created_at: new Date().toISOString(),
    };

    await saveClient(created);
    setShowAddModal(false);
    setNewName('');
    setNewInstagram('');
    setSelectedFile(null);
    setImagePreview(null);
    setPublicUrl(null);
    setUploadError(null);
    setUploadSuccess(null);
    handleRefresh();
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partner_preference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = filterGender === 'All' || c.gender === filterGender;
    const matchesWealth = filterWealth === 'All' || c.wealth_level.includes(filterWealth);

    return matchesSearch && matchesGender && matchesWealth;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Master Agency Administration &bull; Confidential</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
            Private Client Profiles (/admin/clients)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Only administrators can access. Strictly private non-indexed rosters (<code>is_public = false</code>).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/admin/matches')}
            className="px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Matches ({matches.length})</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/chats')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chat Monitor</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Private Clients</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{clients.length}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">100% Non-indexed</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Gender Ratio</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {clients.filter(c => c.gender === 'Male').length} M : {clients.filter(c => c.gender === 'Female').length} F
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Balanced Enclave</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Consultations Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            ${(clients.reduce((acc, c) => acc + (c.consultation_amount || 2500), 0)).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Paystack &amp; Stripe Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Active Matches</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">{matches.length}</div>
          <div className="text-[11px] text-amber-300/80 mt-0.5">
            {matches.filter(m => m.status === 'approved').length} Approved &bull; {matches.filter(m => m.status === 'pending').length} Pending
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, preference, city..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {(['All', 'Male', 'Female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setFilterGender(g)}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterGender === g
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <select
            value={filterWealth}
            onChange={(e) => setFilterWealth(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Wealth Tiers</option>
            <option value="$20M">$20M+</option>
            <option value="$40M">$40M+</option>
            <option value="Dynasty">Dynasty &amp; Sovereign</option>
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientMatches = matches.filter(
            (m) => m.client_a_id === client.id || m.client_b_id === client.id
          );

          return (
            <div
              key={client.id}
              className="bg-[#0b0e17] rounded-xl border border-slate-800 hover:border-amber-500/40 p-5 flex flex-col justify-between transition-all group relative"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={client.avatar_url}
                      alt={client.name}
                      className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 group-hover:border-amber-400 transition-colors"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-semibold text-white text-base leading-snug">
                          {client.name}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {client.age}y
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                        <Globe2 className="w-3 h-3 text-slate-500" />
                        <span>{client.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Paid {client.consultation_amount ? `$${client.consultation_amount}` : '$2,500'}
                  </span>
                </div>

                {/* Badges */}
                <div className="mt-3.5 space-y-2">
                  <div className="text-xs">
                    <span className="text-slate-400">Wealth: </span>
                    <span className="font-medium text-amber-300">{client.wealth_level}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400">Desires: </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-[11px] inline-block">
                      {client.partner_preference}
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                  {client.bio}
                </p>

                {/* What they want snippet */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
                  <strong className="text-amber-400">Relationship Intent: </strong>
                  {client.what_they_want}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3">
                    <a
                      href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${client.name}, reaching out via RichConnect Concierge.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                      title="Open external WhatsApp chat"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp: {client.whatsapp}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
                    </a>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {clientMatches.length} suggested {clientMatches.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleRunMatchmaker(client)}
                    disabled={isMatchingClientId === client.id}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {isMatchingClientId === client.id ? 'Analyzing...' : 'AI Matchmaker'}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedClient(client)}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
                    title="View Full Dossier"
                  >
                    Dossier
                  </button>

                  <button
                    onClick={() => handleDelete(client.id, client.name)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client Full Dossier Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              &times;
            </button>

            <div className="flex items-center space-x-4 border-b border-slate-800 pb-5">
              <img
                src={selectedClient.avatar_url}
                alt={selectedClient.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-amber-400"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-serif-luxury font-bold text-white">
                    {selectedClient.name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    {selectedClient.age} yrs &bull; {selectedClient.gender}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                  <span>{selectedClient.location}</span>
                  <span>&bull;</span>
                  <span className="text-amber-300 font-semibold">{selectedClient.wealth_level}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-5">
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">Partner Preference</h4>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-amber-300 font-semibold">
                  {selectedClient.partner_preference}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">Full Biography &amp; Pedigree</h4>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedClient.bio}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">What They Seek</h4>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedClient.what_they_want}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block mb-0.5">WhatsApp Direct</span>
                    <span className="font-mono text-emerald-400">{selectedClient.whatsapp}</span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedClient.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedClient.name}, reaching out via RichConnect Concierge.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg whatsapp-action-btn text-white text-[11px] font-bold flex items-center space-x-1"
                  >
                    <span>Message</span>
                    <ExternalLink className="w-2.5 h-2.5 text-white/80" />
                  </a>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">Confidential Email</span>
                  <span className="font-mono text-blue-400 truncate block">{selectedClient.email}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleRunMatchmaker(selectedClient);
                    setSelectedClient(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Matchmaker for this Client</span>
                </button>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              &times;
            </button>

            <h3 className="text-lg font-serif-luxury font-bold text-white mb-4">
              Add New Private Client Profile
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              {/* Error Alert */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-200">Supabase Upload / Insert Error</p>
                    <p className="text-[11px] text-rose-300/90 break-words mt-0.5">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-200">Supabase Upload Complete</p>
                    <p className="text-[11px] text-emerald-300/90 break-words mt-0.5">{uploadSuccess}</p>
                  </div>
                </div>
              )}

              {/* Name & Instagram */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Lady Genevieve Vance"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Instagram (@handle) *</label>
                  <input
                    type="text"
                    value={newInstagram}
                    onChange={(e) => setNewInstagram(e.target.value)}
                    placeholder="e.g. @genevieve_vance"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Image File Input (Uploads to Supabase 'client-images' bucket & inserts to 'rich_girls' table) */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-200 font-semibold text-xs flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Client Image (Supabase Storage: bucket 'client-images')</span>
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                    table: rich_girls
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
                      Selecting an image uploads directly to <code className="text-amber-300">client-images</code> bucket as <code className="text-amber-300">Date.now()-file.name</code> and inserts record to <code className="text-amber-300">rich_girls</code>.
                    </p>
                  </div>
                </div>

                {/* Upload Status / Loading Indicator */}
                {isLoading && (
                  <div className="flex items-center space-x-2 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                    <span>Uploading to Supabase storage & inserting to rich_girls table...</span>
                  </div>
                )}

                {publicUrl && (
                  <div className="text-[10px] text-emerald-400 break-all bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                    <span className="font-semibold">Public URL:</span> {publicUrl}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. London & Geneva"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Partner Preference</label>
                <input
                  type="text"
                  value={newPartnerPref}
                  onChange={(e) => setNewPartnerPref(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Wealth Level</label>
                <input
                  type="text"
                  value={newWealth}
                  onChange={(e) => setNewWealth(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Private career, lifestyle notes..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">What They Want</label>
                <textarea
                  rows={2}
                  value={newWhatTheyWant}
                  onChange={(e) => setNewWhatTheyWant(e.target.value)}
                  placeholder="Relationship aspirations..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    placeholder="+44..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isLoading ? 'Uploading & Saving...' : 'Save to Clients Table'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
