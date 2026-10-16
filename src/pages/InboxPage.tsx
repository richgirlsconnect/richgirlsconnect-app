import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  BookOpen, 
  User, 
  MessageSquare, 
  Clock, 
  Heart,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  PlusCircle,
  HelpCircle,
  Crown,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { Girl, Message, Memory, GeminiSuggestionResponse } from '../types';
import { getMessages, addMessage, getMemory } from '../lib/storage';

interface InboxPageProps {
  girlId?: string;
  girls: Girl[];
  onSelectGirl: (id: string) => void;
  onNavigate: (path: string) => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({
  girlId,
  girls,
  onSelectGirl,
  onNavigate,
}) => {
  // Select girl or default to first chatting girl
  const activeGirl = girls.find(g => g.id === girlId) || 
    girls.find(g => g.stage === 'Chatting') || 
    girls[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [memory, setMemory] = useState<Memory | null>(null);

  // Gemini AI Suggestion States
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<GeminiSuggestionResponse | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>('Charming & Poised');
  const [draftThought, setDraftThought] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showDossierSide, setShowDossierSide] = useState<boolean>(true);
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);
  const [simulateText, setSimulateText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages and memory whenever active girl changes
  useEffect(() => {
    if (activeGirl) {
      const msgs = getMessages(activeGirl.id);
      setMessages(msgs);
      const mem = getMemory(activeGirl.id);
      setMemory(mem);
      setAiSuggestion(null);
    }
  }, [activeGirl?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message from user
  const handleSendMessage = () => {
    if (!inputText.trim() || !activeGirl) return;
    const newMsg = addMessage(activeGirl.id, 'user', inputText.trim());
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  // Add simulated reply from girl (e.g. from real IG conversation)
  const handleSimulateReply = () => {
    if (!simulateText.trim() || !activeGirl) return;
    const newMsg = addMessage(activeGirl.id, 'girl', simulateText.trim());
    setMessages(prev => [...prev, newMsg]);
    setSimulateText('');
    setShowSimulateModal(false);
  };

  // Call /api/gemini with memory context
  const handleSuggestReply = async () => {
    if (!activeGirl) return;
    setIsGeneratingAI(true);
    setAiSuggestion(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          girlName: activeGirl.name,
          location: activeGirl.location,
          ethnicity: activeGirl.ethnicity,
          tags: activeGirl.tags,
          matchReason: activeGirl.match_reason,
          memory: memory || {},
          conversationHistory: messages.slice(-6),
          userDraft: draftThought || inputText,
          tone: selectedTone,
          isPresidentialDaughter: activeGirl.is_presidential_daughter,
          presidentialDetails: activeGirl.presidential_details,
        }),
      });

      if (res.ok) {
        const data: GeminiSuggestionResponse = await res.json();
        setAiSuggestion(data);
      } else {
        // Local intelligent fallback wingman response
        setAiSuggestion({
          primaryReply: `Honestly, couldn't agree more. Reminds me of that spot in ${activeGirl.location} with the private terrace—you strike me as someone who appreciates authentic taste over hype.`,
          rationale: "Creates relaxed, high-status familiarity without placing her on a pedestal. Refers to her cultured lifestyle.",
          alternatives: [
            {
              label: "Playful & Witty",
              text: `You have that 'I run three enterprises before espresso' aura. Should I be intimidated or intrigued?`
            },
            {
              label: "Direct & Date Invitation",
              text: `I'm curating an intimate dinner at a discreet private lounge next Thursday. I'd enjoy having you join my table.`
            }
          ],
          wingmanTip: "Don't rush to send multiple texts. Send this, then mirror her reply latency."
        });
      }
    } catch (e) {
      console.error('Error fetching AI suggestion', e);
      setAiSuggestion({
        primaryReply: `Sounds like a phenomenal week. We should coordinate a calm espresso or vintage tasting next time our calendars align in ${activeGirl.location}.`,
        rationale: "Effortlessly positions you as an equal high-value gentleman proposing a low-pressure rendezvous.",
        alternatives: [
          {
            label: "Playful Banter",
            text: `You definitely didn't acquire that equestrian poise overnight. Very impressive.`
          }
        ],
        wingmanTip: "Maintain chivalry and frame control."
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const applyToInput = (text: string) => {
    setInputText(text);
  };

  if (!activeGirl) {
    return (
      <div className="luxury-card rounded-2xl p-12 text-center">
        <MessageSquare className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
        <h3 className="text-xl font-serif-luxury font-bold text-slate-100">No Profile Selected</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Choose a connection from the Finder to initiate conversation.</p>
        <button
          onClick={() => onNavigate('/finder')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950"
        >
          Open Finder
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col pb-2">
      
      {/* 3-Column Layout: Contact List | Chat Window & AI Wingman | Dossier */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 h-full min-h-0">
        
        {/* Left: Contact List */}
        <div className="hidden md:flex md:col-span-3 flex-col luxury-card rounded-2xl overflow-hidden h-full">
          <div className="p-3.5 border-b border-amber-500/20 bg-slate-950/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active CRM Threads
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {girls.length} contacts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-1.5 space-y-1">
            {girls.map((girl) => {
              const isCurrent = girl.id === activeGirl.id;
              const girlMsgs = getMessages(girl.id);
              const lastMsg = girlMsgs[girlMsgs.length - 1];

              return (
                <div
                  key={girl.id}
                  onClick={() => onSelectGirl(girl.id)}
                  className={`p-2.5 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={girl.avatar_url}
                      alt={girl.name}
                      className="w-11 h-11 rounded-xl object-cover border border-amber-500/30"
                    />
                    {girl.public_likes_black_men && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950" title="Publicly likes Black men" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs truncate text-slate-100">
                        {girl.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold shrink-0">
                        {girl.match_score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : `${girl.location} • ${girl.stage}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Main Chat UI & Gemini Wingman Bar */}
        <div className={`col-span-12 ${showDossierSide ? 'md:col-span-6' : 'md:col-span-9'} flex flex-col luxury-card rounded-2xl overflow-hidden h-full`}>
          
          {/* Chat Header */}
          <div className="p-3.5 border-b border-amber-500/20 bg-slate-950/60 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <img
                src={activeGirl.avatar_url}
                alt={activeGirl.name}
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif-luxury font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                    <span>{activeGirl.name}, {activeGirl.age}</span>
                    {activeGirl.is_presidential_daughter && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center space-x-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        <span>FIRST DAUGHTER</span>
                      </span>
                    )}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                    {activeGirl.stage}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>{activeGirl.location}</span>
                  {activeGirl.presidential_details?.official_residence && (
                    <>
                      <span>•</span>
                      <span className="text-amber-200/90">{activeGirl.presidential_details.official_residence}</span>
                    </>
                  )}
                  <span>•</span>
                  <a
                    href={`https://instagram.com/${activeGirl.ig.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center space-x-0.5"
                  >
                    <span>{activeGirl.ig}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {(activeGirl.whatsapp || activeGirl.presidential_details?.whatsapp) && (
                <a
                  href={`https://wa.me/${(activeGirl.whatsapp || activeGirl.presidential_details?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${activeGirl.name}, I connected with you on RichConnect!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold whatsapp-action-btn flex items-center space-x-1.5 shadow-sm"
                  title={`Open direct external WhatsApp chat with ${activeGirl.name}`}
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp ({activeGirl.whatsapp || activeGirl.presidential_details?.whatsapp})</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              )}

              <button
                onClick={() => setShowSimulateModal(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                title="Log a message received from her on Instagram or WhatsApp"
              >
                + Log Her Message
              </button>

              <button
                onClick={() => setShowDossierSide(!showDossierSide)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  showDossierSide
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
                title="Toggle Memory Dossier Sidebar"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#07090f]/60 to-[#0a0d14]/90">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <Bot className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  No message history yet. Use the Gemini AI Wingman below to craft a high-status opener referencing her memory dossier!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 px-1">
                      <span className="text-[10px] text-slate-500">
                        {isUser ? 'Me' : activeGirl.name}
                      </span>
                      <span className="text-[9px] text-slate-600">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/10'
                          : 'bg-slate-900 border border-slate-700/80 text-slate-200 rounded-bl-none shadow'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestion Display Box (if generated) */}
          {aiSuggestion && (
            <div className="p-3.5 border-t border-amber-500/30 bg-[#0e121d] space-y-2.5 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gemini Wingman Suggested Reply</span>
                </div>
                <button
                  onClick={() => setAiSuggestion(null)}
                  className="text-[10px] text-slate-400 hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>

              {/* Primary Reply Box */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <p className="text-xs text-amber-100 font-medium leading-relaxed">
                  "{aiSuggestion.primaryReply}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 italic">
                    💡 {aiSuggestion.rationale}
                  </span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => copyToClipboard(aiSuggestion.primaryReply, 'primary')}
                      className="p-1 text-slate-400 hover:text-amber-300"
                      title="Copy to clipboard"
                    >
                      {copiedKey === 'primary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => applyToInput(aiSuggestion.primaryReply)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300"
                    >
                      Use in Box
                    </button>
                  </div>
                </div>
              </div>

              {/* Alternate Angles */}
              {aiSuggestion.alternatives && aiSuggestion.alternatives.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {aiSuggestion.alternatives.map((alt, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-amber-400 font-semibold text-[10px]">
                        <span>{alt.label}</span>
                        <button
                          onClick={() => applyToInput(alt.text)}
                          className="text-[10px] text-amber-300 hover:underline"
                        >
                          Use
                        </button>
                      </div>
                      <p className="text-slate-300 line-clamp-2">"{alt.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Trigger Bar & Input Form */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2 shrink-0">
            
            {/* Tone selector & AI generator button */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
                {['Charming & Poised', 'Playful & Witty', 'Date Invite', 'Cultural Harmony'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                      selectedTone === tone
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSuggestReply}
                disabled={isGeneratingAI}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAI ? 'Analyzing Dossier...' : 'Suggest Genuine Reply'}</span>
              </button>
            </div>

            {/* Input & Send */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message to track in CRM (No auto-send)..."
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-30 cursor-pointer"
                title="Log sent message in CRM history"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right: Girl Dossier & Memory Sidebar */}
        {showDossierSide && (
          <div className="hidden md:flex md:col-span-3 flex-col luxury-card rounded-2xl overflow-hidden h-full">
            <div className="p-3.5 border-b border-amber-500/20 bg-slate-950/40 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Memory Dossier
              </span>
              <button
                onClick={() => onNavigate(`/girls/${activeGirl.id}`)}
                className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Full Profile</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Business & Family Office
                </span>
                <p className="text-slate-200 font-medium">
                  {memory?.business || 'Senior Wealth / Executive'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Birthday / Zodiac
                </span>
                <p className="text-slate-200">
                  {memory?.birthday || 'Not logged yet'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Hobbies & Passions
                </span>
                <p className="text-slate-200">
                  {memory?.hobbies || activeGirl.tags.join(', ')}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Favorite Cuisine & Dining
                </span>
                <p className="text-slate-200">
                  {memory?.food || 'Fine dining & wine'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Match Intelligence
                </span>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-[11px] leading-relaxed">
                  {activeGirl.match_reason}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Private CRM Notes
                </span>
                <p className="text-slate-300 italic bg-black/40 p-2 rounded-lg border border-slate-800">
                  "{memory?.notes || 'Values confidence and genuine ambition.'}"
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Log Her Message Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="luxury-card rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-serif-luxury font-bold text-slate-100">
              Log Received Message from {activeGirl.name}
            </h3>
            <p className="text-xs text-slate-400">
              Paste what she sent you on Instagram DMs or WhatsApp to keep your Gemini memory context 100% accurate.
            </p>
            <textarea
              value={simulateText}
              onChange={(e) => setSimulateText(e.target.value)}
              placeholder="e.g. 'I’d love that! What time were you thinking for Thursday?'"
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSimulateModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateReply}
                disabled={!simulateText.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-40"
              >
                Save Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
