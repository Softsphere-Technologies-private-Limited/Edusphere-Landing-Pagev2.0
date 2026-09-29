import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  Phone,
  Video,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Filter,
  Search,
  MessageSquare,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { CrmActivity, ActivityType, ActivityStatus, ActivityPriority } from '../../types';
import { formatISTTimestamp } from '../../utils/dateUtils';

interface CrmActivitiesTabProps {
  activities: CrmActivity[];
  onAddActivity: (activity: Omit<CrmActivity, 'id' | 'createdAt'>) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: ActivityStatus) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const CrmActivitiesTab: React.FC<CrmActivitiesTabProps> = ({
  activities,
  onAddActivity,
  onToggleStatus,
  onDeleteActivity,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'TODAY' | 'COMPLETED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('DEMO');
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState<string>('11:00 AM');
  const [priority, setPriority] = useState<ActivityPriority>('HIGH');
  const [assignedTo, setAssignedTo] = useState('Sales Team');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredActivities = activities.filter((act) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      act.title.toLowerCase().includes(q) ||
      act.schoolName.toLowerCase().includes(q) ||
      act.contactName.toLowerCase().includes(q);

    let matchFilter = true;
    if (filter === 'PENDING') matchFilter = act.status === 'PENDING';
    else if (filter === 'TODAY') matchFilter = act.dueDate === todayStr && act.status === 'PENDING';
    else if (filter === 'COMPLETED') matchFilter = act.status === 'COMPLETED';

    return matchSearch && matchFilter;
  });

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !schoolName) return;
    setIsSubmitting(true);
    try {
      await onAddActivity({
        title,
        type,
        schoolName,
        contactName,
        dueDate,
        dueTime,
        priority,
        status: 'PENDING',
        assignedTo,
        notes,
      });
      setTitle('');
      setSchoolName('');
      setContactName('');
      setNotes('');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (t: ActivityType) => {
    switch (t) {
      case 'CALL':
        return <Phone className="w-4 h-4 text-sky-400" />;
      case 'DEMO':
        return <Video className="w-4 h-4 text-emerald-400" />;
      case 'VISIT':
        return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-indigo-400" />;
      case 'WHATSAPP':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, schools, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-2xl text-xs text-white outline-none transition"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            {(['PENDING', 'TODAY', 'COMPLETED', 'ALL'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                  filter === tab
                    ? 'bg-emerald-400 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'TODAY' ? "Today's Tasks" : tab}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Activity</span>
        </button>
      </div>

      {/* Activities Feed */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-slate-900/40 rounded-3xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
            <h4 className="text-sm font-bold text-white">No tasks found</h4>
            <p className="text-xs text-slate-400">All follow-ups for this filter are completed or clear.</p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isCompleted = act.status === 'COMPLETED';

            return (
              <div
                key={act.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/60 border-slate-850 opacity-60'
                    : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Left: Checkmark + Task Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleStatus(act.id, act.status)}
                    className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center transition cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-700 hover:border-emerald-400 bg-slate-950 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-1 rounded-md bg-slate-800">{getTypeIcon(act.type)}</div>
                      <h4
                        className={`text-sm font-bold truncate ${
                          isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {act.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          act.priority === 'HIGH'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : act.priority === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {act.priority} Priority
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span className="text-slate-200 font-semibold">{act.schoolName}</span>
                      {act.contactName && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span>{act.contactName}</span>
                        </>
                      )}
                      {act.notes && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 italic truncate max-w-sm">{act.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Due Date & Delete */}
                <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                      <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{act.dueDate}</span>
                    </div>
                    {act.dueTime && <div className="text-[10px] text-slate-400">{act.dueTime}</div>}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete activity "${act.title}"?`)) {
                        onDeleteActivity(act.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SCHEDULE ACTIVITY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white font-display">Schedule Follow-up Activity</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Activity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ERP Demonstration with Principal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Activity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="DEMO">Live Online Demo</option>
                    <option value="VISIT">In-Person School Visit</option>
                    <option value="CALL">Phone Follow-up Call</option>
                    <option value="WHATSAPP">WhatsApp Conversation</option>
                    <option value="EMAIL">Email Proposal Follow-up</option>
                    <option value="TASK">General Task</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">School Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier International"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Due Time</label>
                  <input
                    type="text"
                    placeholder="11:30 AM"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ActivityPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Notes / Agenda</label>
                <textarea
                  rows={2}
                  placeholder="Key topics to demonstrate (e.g. Fees module, GPS bus tracking, biometric attendance)..."
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
                  {isSubmitting ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
