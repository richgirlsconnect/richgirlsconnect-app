import React, { useState } from 'react';
import { 
  Kanban, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Girl, PipelineStage, DatePlan } from '../types';
import { getDatePlans, saveDatePlan, deleteDatePlan } from '../lib/storage';
import { DatePlannerModal } from '../components/DatePlannerModal';

interface PipelinePageProps {
  girls: Girl[];
  onUpdateStage: (id: string, stage: PipelineStage) => void;
  onNavigate: (path: string) => void;
  onOpenAddGirlModal: () => void;
}

const PIPELINE_COLUMNS: { stage: PipelineStage; title: string; color: string; desc: string }[] = [
  { stage: 'Found', title: 'Found', color: 'border-slate-700 bg-slate-900/40 text-slate-300', desc: 'Discovered & Vetted' },
  { stage: 'Chatting', title: 'Chatting', color: 'border-sky-500/40 bg-sky-950/20 text-sky-300', desc: 'Active DM conversations' },
  { stage: 'Close', title: 'Close', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300', desc: 'Deep connection & chemistry' },
  { stage: 'Dating', title: 'Dating', color: 'border-rose-500/40 bg-rose-950/20 text-rose-300', desc: 'In-person exclusive dates' },
  { stage: 'Visit Planned', title: 'Visit Planned', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300', desc: 'Flights & luxury getaways' },
  { stage: 'Partner', title: 'Partner', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300', desc: 'Committed Relationship' },
];

export const PipelinePage: React.FC<PipelinePageProps> = ({
  girls,
  onUpdateStage,
  onNavigate,
  onOpenAddGirlModal,
}) => {
  const [draggedGirlId, setDraggedGirlId] = useState<string | null>(null);
  const [datePlans, setDatePlans] = useState<DatePlan[]>(() => getDatePlans());
  const [isDatePlannerOpen, setIsDatePlannerOpen] = useState(false);
  const [selectedCandidateForDate, setSelectedCandidateForDate] = useState<string | undefined>(undefined);

  const getStageIndex = (stage: PipelineStage) => {
    return PIPELINE_COLUMNS.findIndex(col => col.stage === stage);
  };

  const moveStage = (girl: Girl, direction: 'prev' | 'next') => {
    const currentIndex = getStageIndex(girl.stage);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < PIPELINE_COLUMNS.length) {
      onUpdateStage(girl.id, PIPELINE_COLUMNS[nextIndex].stage);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedGirlId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedGirlId;
    if (id) {
      onUpdateStage(id, targetStage);
    }
    setDraggedGirlId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
              Relationship <span className="gold-gradient-text">Kanban Pipeline</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {girls.length} Active Connections
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Systematic progression from initial discovery to committed power-couple partnership.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCandidateForDate(undefined);
              setIsDatePlannerOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500/20 via-rose-600/25 to-amber-500/20 hover:from-rose-500/35 hover:to-amber-500/35 text-rose-300 border border-rose-500/40 shadow-sm transition-all cursor-pointer"
            title="Open Date Planner & Luxury Visit Scheduler"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>Date Planner ({datePlans.length})</span>
          </button>

          <button
            onClick={onOpenAddGirlModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Connection</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="overflow-x-auto pb-6">
        <div className="flex space-x-4 min-w-[1300px]">
          {PIPELINE_COLUMNS.map((column, colIdx) => {
            const columnGirls = girls.filter(g => g.stage === column.stage);
            const isDatingColumn = column.stage === 'Dating';
            const datingDates = datePlans.filter(d => columnGirls.some(g => g.id === d.girl_id));

            return (
              <div
                key={column.stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.stage)}
                className={`w-[260px] shrink-0 rounded-2xl border ${column.color} flex flex-col min-h-[580px] bg-[#090c14]/80 backdrop-blur-md overflow-hidden`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-luxury font-bold text-xs uppercase tracking-wider text-slate-100 flex items-center space-x-1.5">
                      {isDatingColumn && <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />}
                      <span>{column.title}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 border border-slate-700 text-amber-300">
                      {columnGirls.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {column.desc}
                  </p>

                  {/* Dedicated Dating Stage Date Planner Action Bar */}
                  {isDatingColumn && (
                    <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center justify-between">
                      <span className="text-[10px] text-rose-300 font-medium flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        <span>{datingDates.length} Dates Booked</span>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCandidateForDate(undefined);
                          setIsDatePlannerOpen(true);
                        }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 border border-rose-500/40 transition-colors"
                      >
                        + Plan Date
                      </button>
                    </div>
                  )}
                </div>

                {/* Cards Container */}
                <div className="flex-1 p-2.5 space-y-3 overflow-y-auto max-h-[70vh]">
                  {columnGirls.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-[11px] text-slate-500 text-center p-3">
                      Drop cards here or advance from previous stage
                    </div>
                  ) : (
                    columnGirls.map((girl) => {
                      const canMovePrev = colIdx > 0;
                      const canMoveNext = colIdx < PIPELINE_COLUMNS.length - 1;

                      return (
                        <div
                          key={girl.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, girl.id)}
                          className="luxury-card rounded-xl p-3 space-y-2.5 cursor-grab active:cursor-grabbing hover:border-amber-500/40 transition-all shadow-md group"
                        >
                          {/* Top: Avatar & Name */}
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={girl.avatar_url}
                              alt={girl.name}
                              className="w-10 h-10 rounded-lg object-cover border border-amber-500/30 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs text-slate-100 truncate">
                                {girl.name}, {girl.age}
                              </h4>
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>{girl.location}</span>
                                <span className="text-amber-400 font-bold">
                                  {girl.match_score}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* IG Link */}
                          <div className="flex items-center justify-between text-[10px]">
                            <a
                              href={`https://instagram.com/${girl.ig.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 hover:underline flex items-center space-x-1"
                            >
                              <span>{girl.ig}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            {girl.public_likes_black_men && (
                              <span className="text-[9px] text-amber-400 font-medium">
                                ★ Verified
                              </span>
                            )}
                          </div>

                          {/* Scheduled Date Preview Badge if present */}
                          {(() => {
                            const girlDate = datePlans.find(d => d.girl_id === girl.id);
                            if (!girlDate) return null;
                            const dObj = new Date(girlDate.date_time);
                            return (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidateForDate(girl.id);
                                  setIsDatePlannerOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/35 hover:border-rose-400 text-[10px] text-rose-200 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
                                title="View Date Itinerary & Calendar Entry"
                              >
                                <div className="flex items-center space-x-1.5 truncate">
                                  <Calendar className="w-3 h-3 text-rose-400 shrink-0" />
                                  <span className="truncate font-medium">{girlDate.title}</span>
                                </div>
                                <span className="text-[9px] font-bold px-1 rounded bg-rose-500/30 text-rose-200 shrink-0 ml-1">
                                  {dObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            );
                          })()}

                          {/* Quick Actions */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {(girl.whatsapp || girl.presidential_details?.whatsapp) && (
                                <a
                                  href={`https://wa.me/${(girl.whatsapp || girl.presidential_details?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${girl.name}, I connected with you on RichConnect!`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/40"
                                  title={`Open direct WhatsApp chat (${girl.whatsapp || girl.presidential_details?.whatsapp})`}
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-300" />
                                </a>
                              )}
                              <button
                                onClick={() => onNavigate(`/inbox/${girl.id}`)}
                                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300"
                                title="Chat in Inbox"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onNavigate(`/girls/${girl.id}`)}
                                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300"
                                title="Open Dossier"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCandidateForDate(girl.id);
                                  setIsDatePlannerOpen(true);
                                }}
                                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300"
                                title="Schedule / View Date in Date Planner"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Stage advance controls */}
                            <div className="flex items-center space-x-1">
                              {canMovePrev && (
                                <button
                                  onClick={() => moveStage(girl, 'prev')}
                                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                                  title="Move to previous stage"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}
                              {canMoveNext && (
                                <button
                                  onClick={() => moveStage(girl, 'next')}
                                  className="p-1 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold"
                                  title="Advance to next stage"
                                >
                                  <ChevronRight className="w-3 h-3" />
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
          })}
        </div>
      </div>

      {/* Date Planner Modal */}
      <DatePlannerModal
        isOpen={isDatePlannerOpen}
        onClose={() => setIsDatePlannerOpen(false)}
        girls={girls}
        datePlans={datePlans}
        onSaveDatePlan={(newPlan) => {
          saveDatePlan(newPlan);
          setDatePlans(getDatePlans());
        }}
        onDeleteDatePlan={(planId) => {
          deleteDatePlan(planId);
          setDatePlans(getDatePlans());
        }}
        onUpdateGirlStage={onUpdateStage}
        onNavigate={onNavigate}
        initialGirlId={selectedCandidateForDate}
      />

    </div>
  );
};
