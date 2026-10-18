import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  ChevronRight, 
  ExternalLink,
  DollarSign,
  Compass,
  ArrowRight,
  ListTodo,
  BookOpen,
  Lock,
  ShoppingBag,
  Eye,
  Star,
  Tv
} from 'lucide-react';
import { Client, Match } from '../types';
import { 
  getClients, 
  getClientById, 
  getMatches, 
  getClientAdminMessages, 
  sendClientAdminMessage, 
  getClientTasks, 
  toggleClientTask,
  ClientAdminMessage,
  ClientTask
} from '../lib/matchmakingStorage';
import { getDigitalProducts, DigitalProduct } from '../lib/marketplaceStorage';
import { LiveGirlsGallery } from '../components/LiveGirlsGallery';
import { SmartPaywallModal } from '../components/SmartPaywallModal';

interface ClientPortalPageProps {
  onNavigate: (path: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ onNavigate }) => {
  const clients = getClients();
  
  // Check for unique link in query string (?clientId=client-1 or ?id=...)
  const [currentClientId, setCurrentClientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramId = params.get('clientId') || params.get('id');
      if (paramId && clients.some(c => c.id === paramId)) {
        return paramId;
      }
    }
    // Default to the first client if available
    return clients[0]?.id || 'client-1';
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'messages' | 'matches' | 'resources'>('overview');
  const [newMessageText, setNewMessageText] = useState('');
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<DigitalProduct | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const digitalProducts = getDigitalProducts();

  const client: Client | undefined = clients.find(c => c.id === currentClientId) || clients[0];
  const [messages, setMessages] = useState<ClientAdminMessage[]>(() => 
    client ? getClientAdminMessages(client.id) : []
  );
  const [tasks, setTasks] = useState<ClientTask[]>(() => 
    client ? getClientTasks(client.id) : []
  );

  // Sync client messages & tasks when currentClientId changes
  useEffect(() => {
    if (client) {
      setMessages(getClientAdminMessages(client.id));
      setTasks(getClientTasks(client.id));
    }
  }, [currentClientId, client]);

  // Handle client switching or unique link login
  const handleSelectClient = (id: string) => {
    setCurrentClientId(id);
    setIsClientLoggedIn(true);
    setLoginError(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('clientId', id);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSimpleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const found = clients.find(c => 
      c.email?.toLowerCase() === loginEmail.trim().toLowerCase() ||
      c.name.toLowerCase().includes(loginEmail.trim().toLowerCase()) ||
      c.id === loginEmail.trim()
    );

    if (found) {
      handleSelectClient(found.id);
    } else {
      setLoginError('No private client dossier found with that email or identifier. You may select a demo VIP profile below.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !client) return;

    const newMsg: ClientAdminMessage = {
      id: `cam-${Date.now()}`,
      client_id: client.id,
      sender: 'client',
      sender_name: client.name,
      text: newMessageText.trim(),
      created_at: new Date().toISOString(),
    };

    sendClientAdminMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);
    setNewMessageText('');

    // Simulate auto-concierge response after a brief delay
    setTimeout(() => {
      const conciergeReply: ClientAdminMessage = {
        id: `cam-reply-${Date.now()}`,
        client_id: client.id,
        sender: 'admin',
        sender_name: 'Lord Sterling (Chief Concierge)',
        text: `Understood, ${client.name.split(' ')[0]}. Our concierge desk has logged your request and is discreetly coordinating with our senior matchmakers.`,
        created_at: new Date().toISOString(),
      };
      sendClientAdminMessage(conciergeReply);
      setMessages(prev => [...prev, conciergeReply]);
    }, 1500);
  };

  const handleToggleTask = (taskId: string) => {
    if (!client) return;
    const updated = toggleClientTask(taskId, client.id);
    setTasks(updated);
  };

  // Find candidate matches for this client
  const allMatches = getMatches();
  const clientMatches = allMatches.filter(m => m.client_a_id === client?.id || m.client_b_id === client?.id);
  const matchedCandidateProfiles = clientMatches.map(m => {
    const candidateId = m.client_a_id === client?.id ? m.client_b_id : m.client_a_id;
    const cand = clients.find(c => c.id === candidateId);
    return { match: m, candidate: cand };
  }).filter(item => item.candidate !== undefined);

  // Fallback candidate recommendation cards if no matches generated yet
  const otherCandidates = clients.filter(c => c.id !== client?.id);

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 75;

  // If client logs out or wants to enter credentials
  if (!isClientLoggedIn || !client) {
    return (
      <div className="min-h-screen bg-[#06080f] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0d17] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
              <Crown className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-serif-luxury text-white">Client Portal Access</h1>
            <p className="text-xs text-slate-400">
              Welcome to your private client dossier. Enter your registered email or select your private profile below.
            </p>
          </div>

          <form onSubmit={handleSimpleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Client Email or Dossier ID
              </label>
              <input
                type="text"
                autoComplete="off"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. k.balogun@monarchcap.uk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-500"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Access Private Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick VIP Profiles Selector for instant seamless testing */}
          <div className="border-t border-slate-800 pt-4 space-y-2.5">
            <p className="text-[11px] font-semibold text-slate-400 text-center">
              Or Instant Access as Verified Client:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {clients.slice(0, 4).map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectClient(c.id)}
                  className="w-full p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left flex items-center justify-between text-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src={c.avatar_url} 
                      alt={c.name} 
                      className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0" 
                    />
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.location} &bull; {c.wealth_level}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/matchmaking')}
              className="text-xs text-amber-400 hover:underline"
            >
              Need to apply for membership? Visit /matchmaking &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col">
      {/* Top Client Portal Bar */}
      <header className="border-b border-amber-500/20 bg-[#080c16]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-serif-luxury tracking-wide text-white">
                  RICHCONNECT
                </span>
                <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Client Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Discreet Sovereign Dossier &bull; {client.name}
              </p>
            </div>
          </div>

          {/* Quick Client Switcher & Actions */}
          <div className="flex items-center space-x-2">
            {/* Our Private Love Channel Quick Access Button */}
            <button
              onClick={() => onNavigate('/love-channel')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-pink-500/20 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Our Private Love Channel</span>
              <span className="sm:hidden">Love Channel</span>
            </button>

            {/* Love TV Quick Access Button */}
            <button
              onClick={() => onNavigate('/love-tv')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Love TV</span>
              <span className="text-[9px] bg-rose-600 text-white px-1 rounded uppercase font-mono">Live</span>
            </button>

            {/* Unique Link Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="text-amber-400 font-mono font-bold">VIP ID:</span>
              <span className="font-mono text-slate-300">{client.id}</span>
            </div>

            {/* Client Switcher Dropdown */}
            <select
              value={client.id}
              onChange={(e) => handleSelectClient(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-amber-500 outline-none cursor-pointer"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  Switch Client: {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsClientLoggedIn(false)}
              title="Sign Out of Client Portal"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-24 md:pb-12">
        
        {/* Profile Hero Card */}
        <div className="luxury-card rounded-2xl p-5 sm:p-6 border border-amber-500/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={client.avatar_url}
                  alt={client.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-xl shadow-amber-950/50"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#06080f] flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-white">
                    {client.name}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    VIP Member
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{client.location}</span>
                  </span>
                  <span>&bull;</span>
                  <span>Age {client.age}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-semibold">{client.wealth_level}</span>
                </div>

                <p className="text-xs text-slate-300 italic pt-0.5 max-w-xl line-clamp-2">
                  "{client.bio}"
                </p>
              </div>
            </div>

            {/* Status & Key Stats */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 gap-2">
              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Membership Status</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center sm:justify-end space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified & Non-Indexed</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Concierge Retainer</div>
                <div className="text-xs font-mono font-bold text-amber-300">
                  ${client.consultation_amount || 2500} &bull; {client.consultation_gateway || 'Stripe'} Verified
                </div>
              </div>
            </div>

          </div>

          {/* Quick Partner Preference Banner */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="text-slate-400">Partner Preference:</span>
              <span className="text-white font-medium">{client.partner_preference}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('/love-channel')}
                className="px-3 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
                <span>Our Private Love Channel &rarr;</span>
              </button>

              {client.whatsapp && (
                <a
                  href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Concierge, this is ${client.name} regarding my RichConnect membership.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Encrypted Line ({client.whatsapp})</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Client Navigation Tabs (Desktop & Tablet) */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Overview &amp; Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Tasks &amp; Milestones ({completedTasksCount}/{tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'messages'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Admin Messages ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'matches'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Curated Matches</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'resources'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>VIP Guides &amp; Teasers</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-slate-950 font-bold rounded">Free</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Bar Widget */}
            <div className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">Matchmaking Journey Progress</span>
                  <span className="text-slate-400 text-[11px] ml-2">({completedTasksCount} of {tasks.length} Milestones Cleared)</span>
                </div>
                <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1. Onboarding</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2. Verification</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-300 font-medium">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>3. Match Curation</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>4. Private Rendezvous</span>
                </div>
              </div>
            </div>

            {/* Two column grid: Latest Admin Message & Active Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Latest Admin Messages Box */}
              <div className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-white text-xs">Direct Messages from Admin</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-amber-400 hover:text-amber-300 text-xs font-semibold cursor-pointer"
                  >
                    View All ({messages.length}) &rarr;
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {messages.slice(-3).map(msg => (
                    <div 
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        msg.sender === 'admin' 
                          ? 'bg-amber-500/10 border border-amber-500/20 text-slate-200' 
                          : 'bg-slate-900 border border-slate-800 text-slate-300 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-amber-300">{msg.sender_name}</span>
                        <span className="text-slate-500">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Reply to Chief Concierge..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Tasks Checklist */}
              <div className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <ListTodo className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-xs">Priority Client Milestones</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-amber-400 hover:text-amber-300 text-xs font-semibold cursor-pointer"
                  >
                    Manage &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-start space-x-3 cursor-pointer transition-all"
                    >
                      <button className="mt-0.5 text-amber-400">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : task.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600" />
                        )}
                      </button>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            task.status === 'in_progress' ? 'bg-amber-500/10 text-amber-300' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Relationship Aspirations Card */}
            <div className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Your Sovereign Relationship Vision</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                "{client.what_they_want}"
              </p>
            </div>

            {/* Sales Copy Block for Men */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1424] via-[#090d18] to-[#060810] border-2 border-cyan-500/30 shadow-2xl space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONFIDENTIAL CLIENT GUARANTEE</span>
              </div>

              <h4 className="font-serif-luxury font-bold text-white text-lg sm:text-xl leading-snug">
                "Your money can buy anything except true loyalty. We have only girls who passed 7-Layer Verification — Face, Wealth Mindset, Loyalty Test, AI Purity Scan. No fakes. No scammers."
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                Every candidate presented in your enclave undergoes rigorous background vetting, lifestyle alignment assessment, and private interviewing by our senior concierge. Only candidates seeking genuine partnership and long-term legacy are approved.
              </p>
            </div>

            {/* LIVE GIRLS GALLERY */}
            <LiveGirlsGallery 
              onNavigate={onNavigate}
              title="Verified Candidate Ghost Showcase"
              subtitle="Confidential silhouettes of vetted African queens & European heiresses in active rotation. Click to unveil or request concierge intro."
              onOpenPaywall={() => setIsPaywallOpen(true)}
            />

          </div>
        )}

        {/* Tab 2: Tasks Detailed */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Client Action Items &amp; Concierge Checklist</h3>
                <p className="text-xs text-slate-400">Click any task to toggle between completed, in-progress, or pending.</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                {completedTasksCount} / {tasks.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="p-4 rounded-xl bg-[#0b0e1a] border border-slate-800 hover:border-amber-500/40 flex items-start justify-between gap-4 cursor-pointer transition-all"
                >
                  <div className="flex items-start space-x-3.5">
                    <button className="mt-0.5">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-600" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">Category: {task.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-md font-mono shrink-0 font-semibold ${
                    task.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    task.status === 'in_progress' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Messages Full Feed */}
        {activeTab === 'messages' && (
          <div className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs">Encrypted Private Messages with Matchmaker Desk</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Concierge Online</span>
              </span>
            </div>

            {/* Messages Thread */}
            <div className="space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto pr-1">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs space-y-1 shadow-md ${
                      msg.sender === 'client'
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-700/80 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                      <span className="font-bold">{msg.sender_name}</span>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-3 border-t border-slate-800">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type confidential memo or question to your Senior Matchmaker..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Matches */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Curated Private Matches &amp; Intros</h3>
                <p className="text-xs text-slate-400">High-affinity candidates aligned to your cultural and lifestyle preferences.</p>
              </div>
              <button
                onClick={() => onNavigate('/swipe')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
              >
                Open Swipe Deck &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedCandidateProfiles.length > 0 ? (
                matchedCandidateProfiles.map(({ match, candidate }) => (
                  <div 
                    key={match.id}
                    className="p-5 rounded-2xl bg-[#0b0e1a] border border-amber-500/30 space-y-3.5 shadow-lg"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={candidate!.avatar_url}
                        alt={candidate!.name}
                        className="w-14 h-14 rounded-xl object-cover border border-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs">{candidate!.name}</h4>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {match.score}% Synergy
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{candidate!.location} &bull; Age {candidate!.age}</div>
                        <div className="text-[10px] text-amber-300 font-medium">{candidate!.wealth_level}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      "{match.reason || candidate!.bio}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onNavigate(`/chat/${match.id}`)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open 1-on-1 Chat</span>
                      </button>

                      {candidate!.whatsapp && (
                        <a
                          href={`https://wa.me/${candidate!.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${candidate!.name}, this is ${client.name} via RichConnect Private Enclave.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                otherCandidates.slice(0, 4).map(cand => (
                  <div 
                    key={cand.id}
                    className="p-5 rounded-2xl bg-[#0b0e1a] border border-slate-800 space-y-3 shadow-lg"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={cand.avatar_url}
                        alt={cand.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs">{cand.name}</h4>
                          <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            94% Potential
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{cand.location} &bull; Age {cand.age}</div>
                        <div className="text-[10px] text-amber-300 font-medium">{cand.wealth_level}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      "{cand.bio}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          const newMatch: Match = {
                            id: `match-${Date.now()}`,
                            client_a_id: client.id,
                            client_b_id: cand.id,
                            score: 95,
                            reason: `Hand-selected by private concierge based on mutual partner preference alignment.`,
                            status: 'approved',
                            created_at: new Date().toISOString(),
                            approved_at: new Date().toISOString()
                          };
                          onNavigate(`/chat/${newMatch.id}`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Request Introduction</span>
                      </button>

                      {cand.whatsapp && (
                        <a
                          href={`https://wa.me/${cand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${cand.name}, this is ${client.name} via RichConnect Private Enclave.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: VIP Resources & Digital Guides (Free Teasers + Upsell) */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Sovereign Knowledge Vault &amp; Courtship Playbooks</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Complimentary member excerpts, dating psychology frameworks, and direct access to full digital masterclasses.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/marketplace')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shrink-0 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Visit Digital Marketplace &rarr;</span>
              </button>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {digitalProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-[#0b0e1a] border border-slate-800 hover:border-amber-500/40 p-4 flex flex-col justify-between space-y-4 shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-800">
                      <img
                        src={prod.cover_url}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                          {prod.type}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Free Teaser
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 text-xs font-mono font-bold text-amber-300 bg-black/75 px-2 py-0.5 rounded border border-amber-500/30">
                        ${prod.price} Full Access
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug group-hover:text-amber-300 transition-colors">
                        {prod.title}
                      </h4>
                      {prod.subtitle && (
                        <p className="text-[11px] text-amber-400/80 mt-0.5 italic">
                          {prod.subtitle}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Chapters Teaser Preview */}
                    {prod.chapters_outline && prod.chapters_outline.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400 font-semibold text-[10px]">
                          <span>TABLE OF CONTENTS:</span>
                          <span className="text-amber-400 font-mono">{prod.chapters_outline.length} Chapters</span>
                        </div>
                        {prod.chapters_outline.slice(0, 3).map((ch, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-slate-300">
                            {idx === 0 ? (
                              <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate">Ch. {ch.chapter_number}: {ch.title}</span>
                            {idx === 0 && (
                              <span className="text-[9px] text-emerald-400 font-bold uppercase ml-auto">Free</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions: Read Free Chapter vs Upsell Full Edition */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setPreviewResource(prod)}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Read Free Sample Chapter</span>
                    </button>

                    <button
                      onClick={() => onNavigate('/marketplace')}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-900/20 transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Full Edition (${prod.price}) &rarr;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VIP Client Upsell Callout */}
            <div className="p-6 rounded-2xl bg-[#090d18] border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif-luxury font-bold text-white text-sm">
                    All-Access VIP Digital Masterclass Pass
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Private concierge clients enjoy direct digital library unlocks, audiobook recordings, and live Q&amp;A sessions with relationship strategists.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/marketplace')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 shrink-0 shadow-lg cursor-pointer"
              >
                Browse Marketplace Bundles
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Free Sample Chapter Reader Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="luxury-card rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">{previewResource.title}</h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Complimentary VIP Teaser Excerpt</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <LogOut className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed text-slate-200">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <strong>Executive Summary:</strong> {previewResource.description}
              </div>

              <div className="whitespace-pre-line bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-serif text-slate-200 leading-loose">
                {previewResource.full_chapter_sample || 
                 "Chapter 1: The Sovereign Mindset Shift\n\nHigh-value gentlemen who have founded technology enterprises or manage sovereign family trusts are inundated with superficial attention. When navigating private lounges in Mayfair, DIFC, or Monaco, the primary differentiator is quiet confidence, intellectual curiosity, and unhurried charm..."}
              </div>

              {previewResource.chapters_outline && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-white text-xs">Upcoming Chapters in Full Edition:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewResource.chapters_outline.slice(1).map((ch) => (
                      <div key={ch.chapter_number} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2">
                        <Lock className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">Ch. {ch.chapter_number}: {ch.title}</span>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{ch.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-400">Complete Masterclass: </span>
                <span className="font-bold text-amber-300">${previewResource.price}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setPreviewResource(null);
                    onNavigate('/marketplace');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Unlock Full Edition in Marketplace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Ultra-responsive on mobile devices) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#080c16]/95 backdrop-blur-lg border-t border-amber-500/20 px-2 py-2 flex items-center justify-around z-50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'overview' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'tasks' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-5 h-5 mb-0.5" />
          <span>Tasks ({completedTasksCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-semibold transition-colors relative ${
            activeTab === 'messages' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Messages</span>
          {messages.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'matches' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Matches</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'resources' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Guides</span>
        </button>
      </nav>

      {/* Smart Paywall Modal */}
      <SmartPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onNavigate={onNavigate}
        targetFeature="Verified Diamond Candidate"
      />

    </div>
  );
};
