import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  ArrowLeft, 
  Phone, 
  Globe2, 
  CheckCheck, 
  AlertCircle,
  Eye,
  UserCheck,
  Calendar,
  MessageSquare,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Match, MatchMessage, Client } from '../types';
import { getMatchById, getMatchMessages, sendMatchMessage } from '../lib/matchmakingStorage';

interface PrivateChatPageProps {
  matchId: string;
  onNavigate: (path: string) => void;
}

export const PrivateChatPage: React.FC<PrivateChatPageProps> = ({ matchId, onNavigate }) => {
  const [match, setMatch] = useState<Match | undefined>(() => getMatchById(matchId));
  const [messages, setMessages] = useState<MatchMessage[]>(() => getMatchMessages(matchId));
  const [inputText, setInputText] = useState('');
  const [activeSenderId, setActiveSenderId] = useState<string>('');
  const [moderationAlert, setModerationAlert] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = getMatchById(matchId);
    setMatch(m);
    setMessages(getMatchMessages(matchId));
    if (m?.client_a_id) {
      setActiveSenderId(m.client_a_id);
    }
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!match) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Private Match Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested matchmaking channel ID <code>{matchId}</code> could not be located in our encrypted registry.
        </p>
        <button
          onClick={() => onNavigate('/matchmaking')}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Matchmaking
        </button>
      </div>
    );
  }

  const clientA = match.client_a;
  const clientB = match.client_b;

  // STRICT PRIVACY CHECK: Only approved matches unlock chat!
  if (match.status !== 'approved') {
    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <div className="p-8 rounded-2xl bg-[#0b0e17] border border-amber-500/40 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Match Status: {match.status.toUpperCase()}
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-white pt-2">
              Private Channel Locked
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In accordance with our strict privacy protocol, <strong>direct 1-on-1 chats are only unlocked after human review and formal approval</strong> by the Senior Matchmaker.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Concierge Protocol Checklist:</span>
            </div>
            <p>&bull; Mutual liquid wealth tier verification ($5M+ minimum)</p>
            <p>&bull; Cultural &amp; values alignment inspection</p>
            <p>&bull; Signed mutual privacy &amp; anti-harassment agreement</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('/admin/matches')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 cursor-pointer"
            >
              Open /admin/matches to Approve &rarr;
            </button>
            <button
              onClick={() => onNavigate('/matchmaking')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine current active sender and partner
  const currentSender = activeSenderId === clientA?.id ? clientA : clientB;
  const partner = activeSenderId === clientA?.id ? clientB : clientA;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    setModerationAlert(null);
    setIsSending(true);

    // Event-Based Moderation Agent Hook (Triggered ONLY when message is sent)
    try {
      const modRes = await fetch('/api/agents/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          senderId: activeSenderId || (clientA?.id as string),
          matchId: match.id
        })
      });

      if (modRes.ok) {
        const modData = await modRes.json();
        if (modData.evaluation && !modData.evaluation.allowed) {
          setModerationAlert(`Moderation Intercept: ${modData.evaluation.reason || 'Message violates privacy or communication standards.'}`);
          setIsSending(false);
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    const newMsg: MatchMessage = {
      id: 'msg-' + Date.now(),
      match_id: match.id,
      sender_id: activeSenderId || (clientA?.id as string),
      sender_name: currentSender?.name || 'Client',
      text: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    await sendMatchMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsSending(false);
  };

  const handleSendIcebreaker = (phrase: string) => {
    setInputText(phrase);
    setModerationAlert(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-12">
      
      {/* Back button & View mode bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <button
          onClick={() => onNavigate('/admin/matches')}
          className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Testing Perspective:</span>
          <select
            value={activeSenderId}
            onChange={(e) => setActiveSenderId(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300 text-xs focus:outline-none"
          >
            <option value={clientA?.id}>Chatting as: {clientA?.name} (Client A)</option>
            <option value={clientB?.id}>Chatting as: {clientB?.name} (Client B)</option>
          </select>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#0b0e17] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col h-[750px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 sm:px-6 bg-[#0e121d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={partner?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={partner?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/80"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white text-base leading-tight">
                  {partner?.name || 'Approved Match'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Verified Match
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                <span>{partner?.location}</span>
                <span>&bull;</span>
                <span className="text-amber-300 font-medium">{partner?.wealth_level}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {partner?.whatsapp && (
              <a
                href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${partner.name}, connecting directly via our RichConnect approved introduction!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold whatsapp-action-btn flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
                title={`Open direct WhatsApp chat with ${partner.name}`}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">WhatsApp ({partner.whatsapp})</span>
                <span className="sm:hidden">WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-white/80" />
              </a>
            )}

            <div className="hidden sm:flex flex-col items-end text-right">
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{match.score}% Synergy</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">Approved Match</span>
            </div>

            <button
              onClick={() => onNavigate('/admin/chats')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center space-x-1 cursor-pointer"
              title="Open AI Concierge Chat Monitor"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Audit Chat</span>
            </button>
          </div>
        </div>

        {/* Pinned Safety & Quality Consent Notice */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Private &amp; Monitored:</strong> This 1-on-1 channel is encrypted and audited by the Senior Matchmaker for quality, decorum, and safety.
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">End-to-End Logged</span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Introductory Notice Card */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center max-w-md mx-auto space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Crown className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white">Private Introduction Established</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Both parties have completed private intake. The matchmaker has personally vetted and approved this channel. Maintain high conversational poise, chivalry, and respect.
            </p>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender_id === activeSenderId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-500 mb-1 px-1">
                  {msg.sender_name} &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div
                  className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-br-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Icebreakers Recommendation Bar */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#090c14] flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] shrink-0 font-medium">Icebreakers:</span>
          <button
            onClick={() => handleSendIcebreaker('I would be delighted to host you for private dinner in Mayfair or Zurich next week.')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap text-[11px] transition-colors"
          >
            🍽️ Propose Private Dinner
          </button>
          <button
            onClick={() => handleSendIcebreaker('I admired your foundation work and appreciation for African contemporary culture.')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap text-[11px] transition-colors"
          >
            🏛️ Compliment Arts &amp; Lineage
          </button>
          <button
            onClick={() => handleSendIcebreaker('Are you currently residing in Europe or traveling for upcoming summits?')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap text-[11px] transition-colors"
          >
            ✈️ Inquire on Travel Schedule
          </button>
        </div>

        {/* Event-Based Moderation Alert */}
        {moderationAlert && (
          <div className="px-4 py-2.5 bg-rose-500/15 border-t border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{moderationAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setModerationAlert(null)}
              className="text-[11px] underline hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#0d101b] border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${partner?.name || 'your match'} as ${currentSender?.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 transition-all flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
