import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Edit2,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { CrmDeal, DealStage } from '../../types';

interface CrmDealsTabProps {
  deals: CrmDeal[];
  onAddDeal: (deal: Omit<CrmDeal, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateDealStage: (dealId: string, newStage: DealStage) => Promise<void>;
  onDeleteDeal: (dealId: string) => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const STAGES: { stage: DealStage; label: string; color: string; badge: string }[] = [
  { stage: 'QUALIFICATION', label: '1. Discovery & Needs', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400', badge: 'bg-blue-500' },
  { stage: 'DEMO_SCHEDULED', label: '2. Demo Scheduled', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400', badge: 'bg-indigo-500' },
  { stage: 'PROPOSAL_SENT', label: '3. Proposal Sent', color: 'border-amber-500/40 bg-amber-500/10 text-amber-400', badge: 'bg-amber-500' },
  { stage: 'NEGOTIATION', label: '4. In Negotiation', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400', badge: 'bg-purple-500' },
  { stage: 'CLOSED_WON', label: '5. Closed Won', color: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300', badge: 'bg-emerald-500' },
  { stage: 'CLOSED_LOST', label: '6. Closed Lost', color: 'border-red-500/40 bg-red-500/10 text-red-400', badge: 'bg-red-500' },
];

export const CrmDealsTab: React.FC<CrmDealsTabProps> = ({
  deals,
  onAddDeal,
  onUpdateDealStage,
  onDeleteDeal,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('ALL');

  // Form State for Add Deal
  const [title, setTitle] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [stage, setStage] = useState<DealStage>('QUALIFICATION');
  const [amount, setAmount] = useState<number>(120000);
  const [probability, setProbability] = useState<number>(50);
  const [expectedCloseDate, setExpectedCloseDate] = useState<string>(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [assignedTo, setAssignedTo] = useState<string>('Sales Team');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatINR = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const totalPipeline = deals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const wonPipeline = deals.filter((d) => d.stage === 'CLOSED_WON').reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

  const filteredDeals = deals.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.schoolName.toLowerCase().includes(q) ||
      d.contactName.toLowerCase().includes(q);
    const matchStage = filterStage === 'ALL' || d.stage === filterStage;
    return matchSearch && matchStage;
  });

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !schoolName) return;
    setIsSubmitting(true);
    try {
      await onAddDeal({
        title,
        schoolName,
        contactName,
        contactEmail,
        contactPhone,
        stage,
        amount: Number(amount) || 0,
        probability: Number(probability) || 50,
        expectedCloseDate,
        assignedTo,
        notes,
      });
      // Reset
      setTitle('');
      setSchoolName('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setNotes('');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Metrics Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pipeline</span>
            <span className="text-2xl font-black text-white font-mono">{formatINR(totalPipeline)}</span>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Closed Won Revenue</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{formatINR(wonPipeline)}</span>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Active Deals</span>
            <span className="text-2xl font-black text-indigo-300 font-mono">{deals.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Board (Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((st) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === st.stage);
          const stageValue = stageDeals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

          return (
            <div
              key={st.stage}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-3.5 space-y-3 flex flex-col min-w-[250px] shadow-md"
            >
              {/* Stage Header */}
              <div className="pb-2.5 border-b border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${st.badge}`} />
                    <h4 className="text-xs font-black text-white truncate">{st.label}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono font-bold">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 font-mono">{formatINR(stageValue)}</div>
              </div>

              {/* Deal Cards */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/50 transition-all space-y-2.5 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                          {deal.title}
                        </h5>
                        <div className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-emerald-400" />
                          <span>{deal.schoolName}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-400 font-mono shrink-0">
                        {formatINR(deal.amount)}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-850 pt-2">
                      <span className="truncate">{deal.contactName}</span>
                      <span className="text-indigo-400 font-bold">{deal.probability}% Win</span>
                    </div>

                    {/* Quick Move Stage Action */}
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <select
                        value={deal.stage}
                        onChange={(e) => onUpdateDealStage(deal.id, e.target.value as DealStage)}
                        className="bg-slate-900 border border-slate-750 text-slate-300 rounded-lg px-2 py-1 text-[10px] font-bold outline-none cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s.stage} value={s.stage}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete deal "${deal.title}"?`)) {
                            onDeleteDeal(deal.id);
                          }
                        }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition cursor-pointer"
                        title="Delete Deal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE DEAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white font-display">Create School Sales Deal</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Deal Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier Annual ERP License"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">School / Institution Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi Public Academy"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Principal / Trustee"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Contact Email</label>
                  <input
                    type="email"
                    placeholder="principal@school.edu"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Deal Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono font-bold outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Initial Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as DealStage)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    {STAGES.map((s) => (
                      <option key={s.stage} value={s.stage}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Win Probability %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={probability}
                    onChange={(e) => setProbability(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-indigo-300 font-mono font-bold outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Notes / Negotiation Scope</label>
                <textarea
                  rows={2}
                  placeholder="Key requirements, module choices, student strength discounts..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
