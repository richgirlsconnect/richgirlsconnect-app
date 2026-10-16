import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  MessageCircle, 
  PhoneCall, 
  Lock, 
  Check, 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  MessageSquare, 
  AlertTriangle,
  Building,
  Globe,
  Award,
  KeyRound,
  FileCheck2,
  Send
} from 'lucide-react';
import { Girl, PipelineStage } from '../types';
import { verifyAndRegisterPresidentialDaughter, PresidentialRegistrationPayload } from '../lib/storage';

interface PresidentialSuitePageProps {
  girls: Girl[];
  onNavigate: (path: string) => void;
  onRefreshGirls: () => void;
  onUpdateStage: (id: string, stage: PipelineStage) => void;
}

export const PresidentialSuitePage: React.FC<PresidentialSuitePageProps> = ({
  girls,
  onNavigate,
  onRefreshGirls,
  onUpdateStage,
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'portal'>('registry');

  // Registration Form States
  const [formData, setFormData] = useState<PresidentialRegistrationPayload>({
    name: '',
    age: 26,
    country: '',
    parent_title: 'President of the Republic',
    presidential_term: '',
    official_residence: '',
    security_protocol: '',
    diplomatic_passcode: '',
    whatsapp: '',
    relationship_intent: '',
    avatar_url: '',
    ig: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<Girl | null>(null);

  // Filter only presidential daughters
  const presidentialGirls = girls.filter(g => g.is_presidential_daughter === true);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsVerifying(true);

    setTimeout(() => {
      const result = verifyAndRegisterPresidentialDaughter(formData);
      setIsVerifying(false);

      if (result.success && result.girl) {
        setVerificationSuccess(result.girl);
        onRefreshGirls();
      } else {
        setFormError(result.error || 'Diplomatic pedigree verification failed.');
      }
    }, 1200);
  };

  const autofillLegitimateSample = () => {
    setFormData({
      name: 'Princess Clotilde de Valois-Bordeaux',
      age: 27,
      country: 'France / European Union',
      parent_title: 'Former President of the Republic',
      presidential_term: '2017 - 2024',
      official_residence: 'Élysée Palace Sovereign Enclave',
      security_protocol: 'GSPR (Groupe de Sécurité de la Présidence)',
      diplomatic_passcode: 'PRES-DIPLOMAT-774',
      whatsapp: '+33698765432',
      relationship_intent: 'Seeking an exceptional, confident African king who values loyalty, cultural sophistication, and sincere romance far away from political paparazzi.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      ig: '@clotilde_valois_priv',
    });
    setFormError(null);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Imperial Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-gradient-to-r from-[#0d0f17] via-[#161208] to-[#0a0c14] p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>SOVEREIGN HEAD OF STATE PROTOCOL • EXCLUSIVE ACCESS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-extrabold text-slate-100 tracking-wide leading-tight">
            The <span className="gold-gradient-text">Presidential Daughters</span> Suite
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            A discreet global enclave connecting ambitious gentlemen with the daughters of Presidents, Heads of State, 
            and Sovereign Dynasties. Built with diplomatic security clearance, direct verified WhatsApp channels, 
            and tailored AI emotional intelligence.
          </p>

          {/* Navigation Tabs */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'registry'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Sovereign Registry ({presidentialGirls.length} Verified)</span>
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>First Daughters Induction & Verification Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: The Sovereign Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-slate-100 flex items-center space-x-2">
                <span>Verified First Daughters Worldwide</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Accredited Pedigree
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Each profile has passed diplomatic security credentials, palace validation, and personal WhatsApp authentication.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('portal')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>+ Apply via Presidential Induction</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presidentialGirls.map((girl) => {
              const details = girl.presidential_details;
              const waNumber = (girl.whatsapp || details?.whatsapp || '').replace(/\D/g, '');
              const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Good day ${girl.name}, I received your accredited profile through the Presidential Suite.`)}` : null;

              return (
                <div
                  key={girl.id}
                  className="luxury-card rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Photo & Diplomatic Badges */}
                    <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                      <img
                        src={girl.avatar_url}
                        alt={girl.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-black/40" />

                      {/* Sovereign Seal Badge */}
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/40 shadow-xl">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-bold font-serif-luxury text-amber-300">
                          {girl.match_score}% Match Score
                        </span>
                      </div>

                      {/* Diplomatic Immunity status */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-extrabold shadow-md flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>PRESIDENTIAL DAUGHTER</span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-xl font-bold font-serif-luxury text-white drop-shadow">
                            {girl.name}, {girl.age}
                          </h3>
                          <p className="text-xs text-amber-200 drop-shadow flex items-center space-x-1.5 font-medium">
                            <Globe className="w-3 h-3 text-amber-400" />
                            <span>{details?.country || girl.location}</span>
                            <span>•</span>
                            <span>{girl.estimated_net_worth || '$50M+'}</span>
                          </p>
                        </div>

                        {girl.ig && (
                          <a
                            href={`https://instagram.com/${girl.ig.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-slate-700 text-amber-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <span>{girl.ig}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-4">
                      
                      {/* Presidential Lineage Dossier Box */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-black/50 border border-amber-500/20 space-y-2 text-xs">
                        <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                          <Building className="w-3.5 h-3.5" />
                          <span>Presidential Lineage & Palace Quarters</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Parent Head of State:</span>
                            <span className="text-slate-200 font-semibold">{details?.parent_title || 'Former President'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Administration Term:</span>
                            <span className="text-slate-200">{details?.presidential_term || 'Two Mandates'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[10px]">Official Sovereign Residence:</span>
                            <span className="text-amber-200 font-medium">{details?.official_residence || 'State Presidential Compound'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[10px]">Security Protection Detail:</span>
                            <span className="text-slate-300 font-mono text-[10px]">{details?.security_protocol || 'Presidential Guard Detail'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sincere Love Statement */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
                          Her Sincere Relationship Vision:
                        </span>
                        <p className="text-xs text-slate-200 italic leading-relaxed">
                          "{details?.relationship_intent || girl.bio}"
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {girl.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            #{t}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Direct WhatsApp Connect */}
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whatsapp-action-btn shadow-md transition-all cursor-pointer"
                        title="Open direct encrypted WhatsApp chat"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Chat WhatsApp ({girl.whatsapp || details?.whatsapp})</span>
                        <ExternalLink className="w-3 h-3 text-white/80" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">WhatsApp Confidential</span>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate(`/girls/${girl.id}`)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dossier</span>
                      </button>

                      <button
                        onClick={() => onNavigate(`/inbox/${girl.id}`)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20 flex items-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Wingman AI</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: First Daughters Diplomatic Induction Portal */}
      {activeTab === 'portal' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="luxury-card rounded-2xl p-6 sm:p-8 space-y-6 border border-amber-500/30">
            
            {/* Header */}
            <div className="border-b border-amber-500/20 pb-5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  First Daughters Sovereign Induction Portal
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Restricted access. Only biological or recognized daughters of Heads of State or Presidents may register. 
                Our diplomatic algorithm verifies official palace residences, security protection details, and private WhatsApp numbers.
              </p>
            </div>

            {/* Success Banner */}
            {verificationSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif-luxury font-bold text-emerald-300">
                  Diplomatic Credentials Accredited & Inducted!
                </h3>
                <p className="text-xs text-slate-200 max-w-lg mx-auto">
                  Welcome, <strong>{verificationSuccess.name}</strong>. Your palace lineage at <strong>{verificationSuccess.presidential_details?.official_residence}</strong> and diplomatic WhatsApp have been registered into the Sovereign Registry.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setVerificationSuccess(null);
                      setActiveTab('registry');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                  >
                    View in Sovereign Registry
                  </button>
                  <button
                    onClick={() => onNavigate(`/inbox/${verificationSuccess.id}`)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    Open AI Chat
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
                
                {/* Security Requirement Alert */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-slate-300">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="text-amber-300 font-semibold block mb-0.5">
                      Verification Standard:
                    </strong>
                    You must input legitimate official state quarters (e.g. Élysée Palace, White House, Bellevue, Aso Rock Villa, Los Pinos, Za'abeel Palace) 
                    and your diplomatic security escort unit name. False applications are immediately rejected.
                  </div>
                </div>

                {/* Row 1: Name and Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Full Diplomatic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexandra Moreau"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Age
                    </label>
                    <input
                      type="number"
                      min={18}
                      max={45}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Row 2: Country & Presidential Parent Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Sovereign Nation / State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. France, Germany, Nigeria, UAE, Brazil..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Parent's Head of State Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parent_title}
                      onChange={(e) => setFormData({ ...formData, parent_title: e.target.value })}
                      placeholder="e.g. President of the Republic, Head of State"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Row 3: Official Palace Residence & Term */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Official Presidential Palace / Residence *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.official_residence}
                      onChange={(e) => setFormData({ ...formData, official_residence: e.target.value })}
                      placeholder="e.g. Élysée Palace, Bellevue, Aso Rock Villa, White House..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Must match verified official executive quarters.
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Administration Term / Years
                    </label>
                    <input
                      type="text"
                      value={formData.presidential_term}
                      onChange={(e) => setFormData({ ...formData, presidential_term: e.target.value })}
                      placeholder="e.g. 2017 - 2024, or Active Mandate"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Row 4: Security Detail & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Security Protection Detail / Unit Code *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.security_protocol}
                      onChange={(e) => setFormData({ ...formData, security_protocol: e.target.value })}
                      placeholder="e.g. GSPR, Secret Service Detail, Presidential Guard..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Personal WhatsApp Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="e.g. +33612345678 (include country code)"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Must begin with + and valid international prefix.
                    </span>
                  </div>
                </div>

                {/* Row 5: Photo & Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Private Instagram @Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.ig}
                      onChange={(e) => setFormData({ ...formData, ig: e.target.value })}
                      placeholder="@username_priv"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                      Profile Portrait URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Sincere Relationship Intent */}
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    What Kind of Love & Relationship are you seeking beyond political life? *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.relationship_intent}
                    onChange={(e) => setFormData({ ...formData, relationship_intent: e.target.value })}
                    placeholder="Describe what you crave in an ambitious black king (e.g. authentic protection, discretion, mutual loyalty, freedom from political opportunists)..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={autofillLegitimateSample}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                  >
                    Load accredited sample credentials for testing
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{isVerifying ? 'Verifying Diplomatic Clearance...' : 'Verify & Induct to Registry'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
