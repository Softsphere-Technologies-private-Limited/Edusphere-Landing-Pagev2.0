import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Building2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Clock,
  Send,
  Trash2,
  Briefcase,
  Flame,
  Snowflake,
  Sun,
  User,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CrmLead, LeadStatus, LeadPriority, LeadActivityNote } from '../../types';
import { formatISTTimestamp } from '../../utils/dateUtils';
import { formatFullPhoneNumber } from '../../utils/phoneUtils';

interface CrmLeadDetailModalProps {
  lead: CrmLead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
  onUpdatePriority: (id: string, newPriority: LeadPriority) => Promise<void>;
  onAddActivityNote: (id: string, noteText: string, type: LeadActivityNote['type']) => Promise<void>;
  onConvertToDeal: (lead: CrmLead) => void;
  onDeleteLead: (id: string) => Promise<void>;
  currentUserName?: string;
}

export const CrmLeadDetailModal: React.FC<CrmLeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onAddActivityNote,
  onConvertToDeal,
  onDeleteLead,
  currentUserName = 'Admin',
}) => {
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<LeadActivityNote['type']>('NOTE');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !lead) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      await onAddActivityNote(lead.id, newNote.trim(), noteType);
      setNewNote('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
    lead.name
  )},%20this%20is%20${encodeURIComponent(
    currentUserName
  )}%20from%20EduSphere%20Smart%20School%20ERP.%20Following%20up%20on%20your%20inquiry%20for%20${encodeURIComponent(
    lead.school || 'your school'
  )}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white font-display truncate">
                  {lead.school || lead.name}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    lead.status === 'VERIFIED_OTP'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : lead.status === 'CONVERTED'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {lead.status === 'VERIFIED_OTP' ? 'Verified OTP' : lead.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Lead ID: <span className="font-mono text-slate-300">{lead.id}</span> • Captured:{' '}
                {formatISTTimestamp(lead.createdAt || lead.verifiedAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Contact & Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${lead.phone}`}
              className="p-3 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer shadow-sm"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>Call Lead</span>
            </a>

            <a
              href={`mailto:${lead.email}?subject=EduSphere%20Smart%20School%20ERP%20Demo`}
              className="p-3 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer shadow-sm"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Send Email</span>
            </a>

            <button
              onClick={() => {
                onConvertToDeal(lead);
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Convert to Deal</span>
            </button>
          </div>

          {/* Lead Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Box: Contact & School Information */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact & Institution Info</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Contact Person:</span>
                  <span className="font-bold text-white">{lead.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-bold text-emerald-400 font-mono">{lead.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-white font-mono truncate max-w-[180px]">{lead.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">School / Org:</span>
                  <span className="font-bold text-white">{lead.school || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Lead Source:</span>
                  <span className="font-bold text-slate-300">{lead.source || 'Website Demo Form'}</span>
                </div>
              </div>
            </div>

            {/* Right Box: Qualification, Priority & Stage */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Stage & Priority Qualification</span>
              </h3>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Pipeline Status</label>
                <select
                  value={lead.status}
                  onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="NEW">New Inquiry</option>
                  <option value="VERIFIED_OTP">Verified OTP</option>
                  <option value="PHONE_OTP_PENDING">Pending OTP</option>
                  <option value="CONTACTED">Contacted / Initial Call</option>
                  <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="CONVERTED">Converted (Closed Won)</option>
                  <option value="DISQUALIFIED">Disqualified</option>
                </select>
              </div>

              {/* Priority Tags */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-slate-400">Lead Priority Score</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HOT', 'WARM', 'COLD'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => onUpdatePriority(lead.id, p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        (lead.priority || 'WARM') === p
                          ? p === 'HOT'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-sm'
                            : p === 'WARM'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {p === 'HOT' && <Flame className="w-3.5 h-3.5 text-red-400" />}
                      {p === 'WARM' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                      {p === 'COLD' && <Snowflake className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Notes & Interaction History */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Activity Timeline & Notes</span>
            </h3>

            {/* Note Input Box */}
            <form onSubmit={handleAddNote} className="space-y-2.5">
              <div className="flex items-center gap-2">
                {(['NOTE', 'CALL', 'MEETING', 'WHATSAPP'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNoteType(t)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                      noteType === t
                        ? 'bg-indigo-500 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Log a ${noteType.toLowerCase()} or follow-up note...`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log</span>
                </button>
              </div>
            </form>

            {/* Existing Notes Feed */}
            <div className="space-y-2 pt-2">
              {(!lead.activityHistory || lead.activityHistory.length === 0) && (
                <div className="text-center py-4 text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-850">
                  No previous activity logged. Start by recording a call outcome or follow-up note above.
                </div>
              )}

              {lead.activityHistory?.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-bold uppercase">
                        {act.type}
                      </span>
                      <span className="font-bold text-slate-300">{act.author}</span>
                      <span className="text-[10px] text-slate-500">{formatISTTimestamp(act.timestamp)}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{act.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete lead "${lead.name} - ${lead.school}"?`)) {
                setIsDeleting(true);
                try {
                  await onDeleteLead(lead.id);
                  onClose();
                } finally {
                  setIsDeleting(false);
                }
              }
            }}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Lead</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
