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
  Lock
} from 'lucide-react';
import { Client, Match } from '../types';
import { getClients, saveClient, deleteClient, getMatches, saveMatch } from '../lib/matchmakingStorage';

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

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: Client = {
      id: 'client-' + Date.now(),
      name: newName.trim(),
      age: Number(newAge),
      gender: newGender,
      location: newLocation.trim(),
      avatar_url: newAvatar,
      photos: [newAvatar],
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
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Lady Genevieve Vance"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
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
                  placeholder="e.g. London &amp; Geneva"
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
                >
                  Save to Clients Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
