import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Plus, 
  Check, 
  Trash2, 
  ExternalLink, 
  Download, 
  Heart, 
  MessageSquare, 
  BookOpen, 
  Car, 
  Gift, 
  DollarSign, 
  Building,
  Plane,
  Wine,
  Camera
} from 'lucide-react';
import { Girl, DatePlan, PipelineStage } from '../types';

interface DatePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  girls: Girl[];
  datePlans: DatePlan[];
  onSaveDatePlan: (plan: DatePlan) => void;
  onDeleteDatePlan: (id: string) => void;
  onUpdateGirlStage: (id: string, stage: PipelineStage) => void;
  onNavigate: (path: string) => void;
  initialGirlId?: string;
}

const LUXURY_EXPERIENCE_TYPES = [
  'Fine Dining & Private Room',
  'Yacht Sunset Cruise & Beachfront',
  'Contemporary Art Gala & Auction',
  'Private Aviation / Helicopter Trip',
  'Vineyard & Rare Wine Tasting',
  'Equestrian Club / Polo Match',
  'Intimate Jazz & Cigar Lounge',
];

const SUGGESTED_VENUES = [
  'Zuma Private Dining (Dubai Marina)',
  'Matsuhisa & Annabel’s (Mayfair, London)',
  'Nok by Alara (Victoria Island, Lagos)',
  'L’Ambroisie (Place des Vosges, Paris)',
  'The Carlyle & Bemelmans Bar (Manhattan, NY)',
  'Ilashe Luxury Private Island (Lagos)',
  'Badrutt’s Palace (St. Moritz, Switzerland)',
];

export const DatePlannerModal: React.FC<DatePlannerModalProps> = ({
  isOpen,
  onClose,
  girls,
  datePlans,
  onSaveDatePlan,
  onDeleteDatePlan,
  onUpdateGirlStage,
  onNavigate,
  initialGirlId,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // New Date Plan Form States
  const [selectedGirlId, setSelectedGirlId] = useState<string>(initialGirlId || girls[0]?.id || '');
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(() => {
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + 4);
    nextFriday.setHours(19, 30, 0, 0);
    return nextFriday.toISOString().slice(0, 16);
  });
  const [city, setCity] = useState('London');
  const [venue, setVenue] = useState('Matsuhisa London (Private Salon)');
  const [experienceType, setExperienceType] = useState('Fine Dining & Private Room');
  const [notes, setNotes] = useState('Chauffeur arranged at 19:00. Order vintage wine and discuss her latest venture.');
  const [budgetTier, setBudgetTier] = useState('£2,500 - £4,000');
  const [status, setStatus] = useState<DatePlan['status']>('Confirmed');
  const [autoAdvanceStage, setAutoAdvanceStage] = useState(true);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = girls.find(g => g.id === selectedGirlId);
    if (!candidate) return;

    const newPlan: DatePlan = {
      id: 'dp-' + Date.now(),
      girl_id: candidate.id,
      girl_name: candidate.name,
      girl_avatar: candidate.avatar_url,
      title: title.trim() || `${experienceType} with ${candidate.name}`,
      date_time: new Date(dateTime).toISOString(),
      city: city.trim() || candidate.location,
      venue: venue.trim(),
      experience_type: experienceType,
      notes: notes.trim(),
      budget_tier: budgetTier,
      status,
      created_at: new Date().toISOString(),
    };

    onSaveDatePlan(newPlan);

    // Auto-advance candidate to Dating or Visit Planned if in earlier stage
    if (autoAdvanceStage) {
      if (candidate.stage === 'Found' || candidate.stage === 'Chatting' || candidate.stage === 'Close') {
        onUpdateGirlStage(candidate.id, 'Dating');
      }
    }

    setActiveTab('list');
    setTitle('');
  };

  // Helper to generate Google Calendar Web URL
  const getGoogleCalendarUrl = (plan: DatePlan) => {
    const start = new Date(plan.date_time);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration

    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const details = encodeURIComponent(
      `Private luxury date with ${plan.girl_name}.\nVenue: ${plan.venue} (${plan.city})\nExperience: ${plan.experience_type}\nNotes: ${plan.notes || 'None'}\nScheduled via RichConnect AI CRM.`
    );
    const location = encodeURIComponent(`${plan.venue}, ${plan.city}`);
    const text = encodeURIComponent(plan.title);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${formatGCalDate(start)}/${formatGCalDate(end)}&details=${details}&location=${location}`;
  };

  // Helper to download .ics iCalendar file
  const downloadIcsFile = (plan: DatePlan) => {
    const start = new Date(plan.date_time);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RichConnect AI//Private Luxury CRM Date Planner//EN',
      'BEGIN:VEVENT',
      `UID:${plan.id}@richconnect.ai`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${plan.title}`,
      `DESCRIPTION:Private luxury date with ${plan.girl_name}. Experience: ${plan.experience_type}. Notes: ${plan.notes || ''}`,
      `LOCATION:${plan.venue}, ${plan.city}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Date-${plan.girl_name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="luxury-card rounded-2xl max-w-3xl w-full p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto border border-amber-500/40 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-slate-100">
                  Dating Stage <span className="gold-gradient-text">Date Planner</span>
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Itinerary & Calendar
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Schedule and calendar-sync high-value dates, flights, and private dinners with your candidates.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Scheduled Dates ({datePlans.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'create'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Date</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Syncs with Google Calendar & Apple iCal
          </span>
        </div>

        {/* Tab 1: Scheduled Dates List */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            {datePlans.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl p-6">
                <Calendar className="w-10 h-10 text-amber-500/30 mx-auto mb-2" />
                <h4 className="text-base font-serif-luxury font-bold text-slate-200">
                  No Upcoming Dates Scheduled
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Lock in high-status dinner reservations, gallery galas, or yacht visits with candidates in your Dating pipeline.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                >
                  + Schedule First Luxury Date
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {datePlans.map((plan) => {
                  const planDate = new Date(plan.date_time);
                  const isPast = planDate.getTime() < Date.now();
                  const gCalLink = getGoogleCalendarUrl(plan);

                  return (
                    <div
                      key={plan.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-amber-500/25 hover:border-amber-500/50 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={plan.girl_avatar}
                            alt={plan.girl_name}
                            className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-serif-luxury font-bold text-sm text-slate-100">
                                {plan.title}
                              </h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                plan.status === 'Confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : plan.status === 'Completed'
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {plan.status}
                              </span>
                            </div>

                            <p className="text-xs text-amber-300 font-medium mt-0.5">
                              With {plan.girl_name} • {plan.experience_type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => downloadIcsFile(plan)}
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1"
                            title="Download iCal (.ics) file"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>iCal</span>
                          </button>

                          <a
                            href={gCalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-200 border border-amber-500/40 hover:border-amber-400 flex items-center space-x-1"
                            title="Add directly to Google Calendar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Google Cal</span>
                          </a>

                          <button
                            onClick={() => onDeleteDatePlan(plan.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                            title="Remove date entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Logistics Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-semibold text-slate-200">
                            {planDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {planDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">{plan.venue} ({plan.city})</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Budget: {plan.budget_tier || 'Luxury Class'}</span>
                        </div>
                      </div>

                      {/* Notes snippet */}
                      {plan.notes && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-300 italic">
                          <span className="font-semibold text-amber-300 not-italic mr-1.5">Itinerary:</span>
                          {plan.notes}
                        </div>
                      )}

                      {/* Jump actions */}
                      <div className="flex items-center justify-end space-x-2 pt-1 text-xs">
                        <button
                          onClick={() => {
                            onNavigate(`/girls/${plan.girl_id}`);
                            onClose();
                          }}
                          className="text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>Candidate Dossier</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate(`/inbox/${plan.girl_id}`);
                            onClose();
                          }}
                          className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat AI Prep</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Create Date Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            
            {/* Candidate selection */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                Select Partner Candidate *
              </label>
              <select
                required
                value={selectedGirlId}
                onChange={(e) => {
                  setSelectedGirlId(e.target.value);
                  const found = girls.find(g => g.id === e.target.value);
                  if (found) {
                    setCity(found.location);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
              >
                {girls.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.location} • Stage: {g.stage} • Match: {g.match_score}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Title */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                Date / Visit Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Private Rooftop Tasting & Art Preview"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
              />
            </div>

            {/* Date & Time, City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Calendar Date & Time *</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>City / Enclave *</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dubai, London, Lagos, Paris, Manhattan..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Experience Type & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Luxury Experience Type
                </label>
                <select
                  value={experienceType}
                  onChange={(e) => setExperienceType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
                >
                  {LUXURY_EXPERIENCE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Budget / Investment Tier
                </label>
                <input
                  type="text"
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  placeholder="e.g. $3,000 - $5,000 (Black Card)"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold uppercase tracking-wider">
                  Venue & Address *
                </label>
                <span className="text-[10px] text-amber-400">Curated Haute Spots</span>
              </div>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Zuma Private Dining, Matsuhisa, Annabel's Mayfair..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SUGGESTED_VENUES.slice(0, 4).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVenue(v)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-amber-300"
                  >
                    + {v.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Itinerary Notes */}
            <div>
              <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                Itinerary & Chauffeur Logistics Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Chauffeur pickup at 19:30, dress code black tie, gift: curated art catalog, favorite wine: Dom Pérignon 2012..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
              />
            </div>

            {/* Status & Auto-advance stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500 text-xs"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-4 sm:mt-0">
                <span className="text-xs text-amber-200 font-medium">
                  Auto-advance to 'Dating' stage in Kanban
                </span>
                <input
                  type="checkbox"
                  checked={autoAdvanceStage}
                  onChange={(e) => setAutoAdvanceStage(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Controls */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs shadow-md shadow-amber-500/20 flex items-center space-x-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Save to Calendar Itinerary</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
