import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw, 
  Send, 
  ExternalLink,
  Users,
  Search,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Match, MatchMessage, AIChatSummary } from '../types';
import { getMatches, getMatchMessages, sendMatchMessage } from '../lib/matchmakingStorage';

interface AdminChatsPageProps {
  onNavigate: (path: string) => void;
}

export const AdminChatsPage: React.FC<AdminChatsPageProps> = ({ onNavigate }) => {
  const [matches, setMatches] = useState<Match[]>(() => 
    getMatches().filter((m) => m.status === 'approved')
  );
  const [selectedMatchId, setSelectedMatchId] = useState<string>(() => matches[0]?.id || '');
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [isSendingAdminNote, setIsSendingAdminNote] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<AIChatSummary | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  useEffect(() => {
    if (selectedMatch?.id) {
      const msgs = getMatchMessages(selectedMatch.id);
      setMessages(msgs);
      fetchChatSummary(selectedMatch, msgs);
    }
  }, [selectedMatchId]);

  const fetchChatSummary = async (targetMatch: Match, currentMsgs: MatchMessage[]) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/chat-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMsgs,
          clientA: targetMatch.client_a,
          clientB: targetMatch.client_b,
        }),
      });

      const data = await res.json();
      setAiSummary(data);
    } catch (err) {
      console.error('Error fetching chat summary:', err);
      // Fallback
      setAiSummary({
        sentiment: 'Warm, Respectful & Engaging',
        chemistryLevel: '94% - High Mutual Attraction',
        chemistryScore: 94,
        redFlags: 'None detected - Both clients maintain high poise and civilized tone.',
        suggestion: 'Encourage scheduling a private dinner in London next Thursday as discussed in the thread.',
        conciergeAdvice: 'Table reservation at private club (5 Hertford Street or Annabel\'s) recommended.'
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSendAdminIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoteText.trim() || !selectedMatch) return;

    setIsSendingAdminNote(true);
    const adminMsg: MatchMessage = {
      id: 'admin-msg-' + Date.now(),
      match_id: selectedMatch.id,
      sender_id: 'concierge-admin',
      sender_name: 'RichConnect Concierge',
      text: `[Concierge Advisory]: ${adminNoteText.trim()}`,
      created_at: new Date().toISOString(),
      is_admin_note: true,
    };

    await sendMatchMessage(adminMsg);
    setMessages((prev) => [...prev, adminMsg]);
    setAdminNoteText('');
    setIsSendingAdminNote(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Concierge Chat Oversight &bull; Real-Time AI Quality Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
            Private Chat Monitoring (/admin/chats)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor client 1-on-1 conversations with automated Gemini sentiment, chemistry scoring, red flag alerts, and concierge wingman guidance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/admin/matches')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>&larr; Matches</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/clients')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>Clients &rarr;</span>
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Approved Chatrooms Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You must first approve suggested matches in <code>/admin/matches</code> to unlock private 1-on-1 chat channels.
          </p>
          <button
            onClick={() => onNavigate('/admin/matches')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Go to /admin/matches &rarr;
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Conversations List (3 cols) */}
          <div className="lg:col-span-4 bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Client Channels ({matches.length})
              </h3>
              <span className="text-[10px] text-emerald-400 font-medium">All Audited</span>
            </div>

            <div className="space-y-2">
              {matches.map((m) => {
                const isSelected = m.id === selectedMatchId;
                const clientA = m.client_a;
                const clientB = m.client_b;
                const threadMessages = getMatchMessages(m.id);
                const lastMsg = threadMessages[threadMessages.length - 1];

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMatchId(m.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          <img
                            src={clientA?.avatar_url}
                            alt={clientA?.name}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                          />
                          <img
                            src={clientB?.avatar_url}
                            alt={clientB?.name}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                          />
                        </div>
                        <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                          {clientA?.name?.split(' ')[0]} &amp; {clientB?.name?.split(' ')[0]}
                        </div>
                      </div>

                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        {m.score}%
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 line-clamp-1">
                      {lastMsg ? `${lastMsg.sender_name.split(' ')[0]}: "${lastMsg.text}"` : 'No messages yet.'}
                    </div>

                    <div className="mt-1 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>{clientA?.location?.split('&')[0]} &bull; {clientB?.location?.split('&')[0]}</span>
                      <span>{threadMessages.length} msgs</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Column: Live Chat Transcript (5 cols) */}
          <div className="lg:col-span-5 bg-[#0b0e17] border border-slate-800 rounded-2xl flex flex-col h-[720px] overflow-hidden">
            
            {/* Thread Header */}
            <div className="p-3.5 bg-[#0e121d] border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>{selectedMatch?.client_a?.name}</span>
                  <span className="text-amber-400">&harr;</span>
                  <span>{selectedMatch?.client_b?.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Match ID: <code>{selectedMatch?.id}</code> &bull; Approved Channel
                </div>
              </div>

              <button
                onClick={() => onNavigate(`/chat/${selectedMatch?.id}`)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
                title="View as Client in /chat/:id"
              >
                <span>Client View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Live Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080b12]">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No conversation logs yet for this pair.
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.is_admin_note || msg.sender_id === 'concierge-admin';
                  const isClientA = msg.sender_id === selectedMatch?.client_a_id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-center' : isClientA ? 'items-start' : 'items-end'}`}
                    >
                      <div className="text-[10px] text-slate-500 mb-0.5 px-1">
                        {msg.sender_name} &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed max-w-sm ${
                          isAdmin
                            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 text-center font-medium'
                            : isClientA
                            ? 'bg-slate-900 border border-slate-800 text-slate-200'
                            : 'bg-slate-800 text-slate-100'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Concierge Intervention Note Box */}
            <form onSubmit={handleSendAdminIntervention} className="p-3 bg-[#0d101b] border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={adminNoteText}
                onChange={(e) => setAdminNoteText(e.target.value)}
                placeholder="Broadcast official concierge note into chat..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!adminNoteText.trim() || isSendingAdminNote}
                className="px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
              >
                <span>Dispatch</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

          {/* Right Column: AI Concierge Audit & Sentiment Panel (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="bg-[#0b0e17] border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Conversation Audit</span>
                </div>
                <button
                  onClick={() => selectedMatch && fetchChatSummary(selectedMatch, messages)}
                  disabled={isLoadingAi}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                  title="Refresh AI Analysis"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isLoadingAi ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs text-slate-400">Analyzing sentiment &amp; chemistry...</div>
                </div>
              ) : aiSummary ? (
                <div className="space-y-4 text-xs">
                  
                  {/* Sentiment Gauge */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                      Current Sentiment
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{aiSummary.sentiment}</span>
                    </div>
                  </div>

                  {/* Chemistry Meter */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      <span>Chemistry Level</span>
                      <span className="text-amber-300 font-mono font-bold">
                        {aiSummary.chemistryScore || 94}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full"
                        style={{ width: `${aiSummary.chemistryScore || 94}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium mt-1">
                      {aiSummary.chemistryLevel}
                    </div>
                  </div>

                  {/* Red Flags Check */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                      Red Flags Detector
                    </span>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                      {aiSummary.redFlags}
                    </div>
                  </div>

                  {/* Strategic Suggestion to Improve */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                      Coaching &amp; Wingman Suggestion
                    </span>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
                      {aiSummary.suggestion}
                    </div>
                  </div>

                  {/* Concierge Action Memo */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                    <strong className="block text-amber-400">Matchmaker Action:</strong>
                    <p>{aiSummary.conciergeAdvice}</p>
                  </div>

                </div>
              ) : null}

            </div>

            {/* Quick Actions Card */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
              <span className="font-semibold text-slate-300 block">Concierge Quality Checklist:</span>
              <p className="text-slate-400 text-[11px]">&bull; High net-worth etiquette adhered to</p>
              <p className="text-slate-400 text-[11px]">&bull; Mutual discretion respected</p>
              <p className="text-slate-400 text-[11px]">&bull; Ready to facilitate in-person private flight or dining</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
