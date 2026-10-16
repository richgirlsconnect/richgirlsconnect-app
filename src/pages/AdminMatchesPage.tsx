import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Unlock, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  Filter, 
  Crown, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Users
} from 'lucide-react';
import { Match, MatchStatus } from '../types';
import { getMatches, updateMatchStatus, getClients, saveMatch } from '../lib/matchmakingStorage';

interface AdminMatchesPageProps {
  onNavigate: (path: string) => void;
}

export const AdminMatchesPage: React.FC<AdminMatchesPageProps> = ({ onNavigate }) => {
  const [matches, setMatches] = useState<Match[]>(() => getMatches());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedMatchId, setCopiedMatchId] = useState<string | null>(null);
  const [isBulkMatching, setIsBulkMatching] = useState(false);

  const handleRefresh = () => {
    setMatches(getMatches());
  };

  const handleSetStatus = async (id: string, status: MatchStatus) => {
    await updateMatchStatus(id, status);
    handleRefresh();
  };

  const handleCopyChatLink = (matchId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/chat/${matchId}`;
    navigator.clipboard.writeText(link);
    setCopiedMatchId(matchId);
    setTimeout(() => setCopiedMatchId(null), 2500);
  };

  const handleBulkMatchmaking = async () => {
    setIsBulkMatching(true);
    try {
      const clients = getClients();
      if (clients.length < 2) {
        alert('Need at least 2 clients to calculate matches.');
        return;
      }

      // Run matchmaker for first few clients
      for (let i = 0; i < Math.min(clients.length, 3); i++) {
        const target = clients[i];
        const others = clients.filter((c) => c.id !== target.id);

        const res = await fetch('/api/matchmaker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetClient: target,
            candidates: others,
          }),
        });

        const data = await res.json();
        if (data.matches && Array.isArray(data.matches)) {
          for (const m of data.matches) {
            // Check if match already exists
            const existing = matches.find(
              (ex) =>
                (ex.client_a_id === target.id && ex.client_b_id === m.candidateId) ||
                (ex.client_b_id === target.id && ex.client_a_id === m.candidateId)
            );

            if (!existing) {
              const newMatch: Match = {
                id: 'match-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
                client_a_id: target.id,
                client_b_id: m.candidateId,
                score: m.score,
                reason: m.reason,
                status: 'pending',
                created_at: new Date().toISOString(),
                approved_at: null,
              };
              await saveMatch(newMatch);
            }
          }
        }
      }
      handleRefresh();
    } catch (e) {
      console.error('Bulk matchmaking error:', e);
    } finally {
      setIsBulkMatching(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const pendingCount = matches.filter((m) => m.status === 'pending').length;
  const approvedCount = matches.filter((m) => m.status === 'approved').length;
  const rejectedCount = matches.filter((m) => m.status === 'rejected').length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match Curation &amp; Quality Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
            Suggested Matches &amp; Approvals (/admin/matches)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review Gemini AI compatibility scores. <strong className="text-amber-300">Only approved matches unlock the private chatroom</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleBulkMatchmaking}
            disabled={isBulkMatching}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center space-x-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBulkMatching ? 'animate-spin' : ''}`} />
            <span>{isBulkMatching ? 'Comparing Enclave...' : 'Run Global Matchmaker'}</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/chats')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Monitor Chats</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Matches ({matches.length})
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
              filterStatus === 'pending'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
              filterStatus === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Approved &amp; Unlocked</span>
            <span className="text-[10px] text-emerald-400">({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'rejected'
                ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Strict Privacy: Users only see matches after your manual approval</span>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-5">
        {filteredMatches.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/30 border border-slate-800 rounded-2xl">
            <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No matches in this view</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Run the global matchmaker to auto-generate synergy scores between registered clients.
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const clientA = match.client_a;
            const clientB = match.client_b;
            const isApproved = match.status === 'approved';
            const isRejected = match.status === 'rejected';

            return (
              <div
                key={match.id}
                className={`rounded-2xl border p-6 transition-all ${
                  isApproved
                    ? 'bg-[#0a0f1d] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : isRejected
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : 'bg-[#0b0e17] border-amber-500/30 shadow-xl shadow-amber-950/20'
                }`}
              >
                {/* Match Card Top Row: Pair Details */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-800">
                  
                  {/* Client A */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={clientA?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                      alt={clientA?.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-base">{clientA?.name || 'Client A'}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {clientA?.gender}, {clientA?.age}y
                        </span>
                      </div>
                      <div className="text-xs text-amber-300/90 font-medium mt-0.5">
                        {clientA?.wealth_level}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {clientA?.location} &bull; <span className="text-slate-300">{clientA?.partner_preference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge & Synergy Bridge */}
                  <div className="flex flex-col items-center justify-center shrink-0 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-mono font-black text-xl">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>{match.score}%</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                      Compatibility
                    </span>

                    {/* Status Pill */}
                    <div className="mt-2">
                      {isApproved && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase flex items-center space-x-1">
                          <Unlock className="w-3 h-3" />
                          <span>Chat Unlocked</span>
                        </span>
                      )}
                      {match.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold uppercase flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Client B */}
                  <div className="flex items-center space-x-4 flex-1 lg:justify-end text-left lg:text-right">
                    <div className="order-2 lg:order-1">
                      <div className="flex items-center space-x-2 lg:justify-end">
                        <h3 className="font-semibold text-white text-base">{clientB?.name || 'Client B'}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {clientB?.gender}, {clientB?.age}y
                        </span>
                      </div>
                      <div className="text-xs text-amber-300/90 font-medium mt-0.5">
                        {clientB?.wealth_level}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {clientB?.location} &bull; <span className="text-slate-300">{clientB?.partner_preference}</span>
                      </div>
                    </div>
                    <img
                      src={clientB?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={clientB?.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0 order-1 lg:order-2"
                    />
                  </div>

                </div>

                {/* AI Rationale Section */}
                <div className="py-4">
                  <div className="text-xs font-semibold uppercase text-amber-400 mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Matchmaker Synergy Analysis:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    {match.reason}
                  </p>
                </div>

                {/* Card Actions Bottom Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>
                      {isApproved
                        ? `Approved on ${match.approved_at ? new Date(match.approved_at).toLocaleDateString() : 'Today'} &bull; Direct chatroom enabled`
                        : 'Approval is required for either client to unlock the private 1-on-1 chatroom.'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    {match.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleSetStatus(match.id, 'rejected')}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleSetStatus(match.id, 'approved')}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Match (Unlock Chat)</span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <>
                        <button
                          onClick={() => handleCopyChatLink(match.id)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
                          title="Copy Private 1-on-1 Chat Link for Clients"
                        >
                          {copiedMatchId === match.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Link Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onNavigate(`/chat/${match.id}`)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Open 1-on-1 Chat (/chat/{match.id}) &rarr;</span>
                        </button>

                        <button
                          onClick={() => handleSetStatus(match.id, 'pending')}
                          className="p-2 text-slate-500 hover:text-slate-300 text-xs"
                          title="Revoke approval back to pending"
                        >
                          Revoke
                        </button>
                      </>
                    )}

                    {isRejected && (
                      <button
                        onClick={() => handleSetStatus(match.id, 'approved')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Re-evaluate &amp; Approve
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
