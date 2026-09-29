import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  RefreshCw,
  MessageSquare,
  Flame,
  Snowflake,
  Sun,
  LayoutGrid,
  List,
  Eye,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { CrmLead, LeadStatus, LeadPriority } from '../../types';
import { formatISTTimestamp } from '../../utils/dateUtils';
import { COUNTRY_ISD_LIST, formatFullPhoneNumber } from '../../utils/phoneUtils';

interface CrmLeadsTabProps {
  leads: CrmLead[];
  loading: boolean;
  onOpenLeadDetail: (lead: CrmLead) => void;
  onOpenAddLeadModal: () => void;
  onUpdateLeadStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
  onBulkUpdateStatus: (newStatus: LeadStatus) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  onBulkDeleteLeads: () => Promise<void>;
  onExportCSV: () => void;
  selectedLeadIds: Set<string>;
  setSelectedLeadIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onResendAlertEmail?: (lead: CrmLead) => Promise<void>;
  resendingId?: string | null;
}

export const CrmLeadsTab: React.FC<CrmLeadsTabProps> = ({
  leads,
  loading,
  onOpenLeadDetail,
  onOpenAddLeadModal,
  onUpdateLeadStatus,
  onBulkUpdateStatus,
  onDeleteLead,
  onBulkDeleteLeads,
  onExportCSV,
  selectedLeadIds,
  setSelectedLeadIds,
  onResendAlertEmail,
  resendingId,
}) => {
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lead.name?.toLowerCase().includes(q) ||
      lead.school?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.phone?.toLowerCase().includes(q) ||
      lead.city?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const verifiedCount = leads.filter((l) => l.status === 'VERIFIED_OTP' || l.status === 'CONVERTED').length;
  const pendingCount = leads.filter((l) => l.status === 'PHONE_OTP_PENDING' || l.status === 'NEW').length;

  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeadIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeadIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  // Kanban status columns
  const kanbanColumns: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'NEW', label: 'New Inquiries', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
    { status: 'VERIFIED_OTP', label: 'Verified OTP', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
    { status: 'CONTACTED', label: 'Contacted', color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400' },
    { status: 'DEMO_SCHEDULED', label: 'Demo Scheduled', color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
    { status: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'border-purple-500/50 bg-purple-500/10 text-purple-400' },
    { status: 'CONVERTED', label: 'Closed Won', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search, Filter & View Toggle Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search school name, contact, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-2xl text-xs text-white outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-bold outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Statuses ({leads.length})</option>
              <option value="VERIFIED_OTP" className="bg-slate-900 text-emerald-400">Verified OTP</option>
              <option value="PHONE_OTP_PENDING" className="bg-slate-900 text-amber-400">Pending OTP</option>
              <option value="CONTACTED" className="bg-slate-900 text-indigo-400">Contacted</option>
              <option value="DEMO_SCHEDULED" className="bg-slate-900 text-sky-400">Demo Scheduled</option>
              <option value="PROPOSAL_SENT" className="bg-slate-900 text-purple-400">Proposal Sent</option>
              <option value="CONVERTED" className="bg-slate-900 text-emerald-300">Closed Won</option>
              <option value="DISQUALIFIED" className="bg-slate-900 text-red-400">Disqualified</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-bold outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Priorities</option>
              <option value="HOT" className="bg-slate-900 text-red-400">🔥 Hot</option>
              <option value="WARM" className="bg-slate-900 text-amber-400">⚡ Warm</option>
              <option value="COLD" className="bg-slate-900 text-blue-400">❄️ Cold</option>
            </select>
          </div>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2.5 justify-end">
          {/* View Toggle */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'LIST' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'KANBAN' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddLeadModal}
            className="px-4 py-2 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* BULK ACTION BAR (When leads selected) */}
      {selectedLeadIds.size > 0 && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/90 border border-indigo-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-black text-xs font-mono flex items-center gap-1.5 shadow">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{selectedLeadIds.size} Selected</span>
            </div>
            <button
              onClick={toggleSelectAll}
              className="text-xs text-indigo-300 hover:text-white underline font-semibold transition cursor-pointer"
            >
              {selectedLeadIds.size === filteredLeads.length ? 'Deselect All' : 'Select All Filtered'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-indigo-500/40">
              <span className="text-[11px] text-slate-300 font-bold">Status:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkUpdateStatus(e.target.value as LeadStatus);
                    e.target.value = '';
                  }
                }}
                className="bg-transparent text-emerald-400 font-bold text-xs outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-300">-- Bulk Status --</option>
                <option value="VERIFIED_OTP" className="bg-slate-900 text-emerald-400">Verified OTP</option>
                <option value="PHONE_OTP_PENDING" className="bg-slate-900 text-amber-300">Pending OTP</option>
                <option value="CONTACTED" className="bg-slate-900 text-indigo-300">Contacted</option>
                <option value="DEMO_SCHEDULED" className="bg-slate-900 text-sky-300">Demo Scheduled</option>
                <option value="PROPOSAL_SENT" className="bg-slate-900 text-purple-300">Proposal Sent</option>
                <option value="CONVERTED" className="bg-slate-900 text-emerald-300">Closed Won</option>
                <option value="DISQUALIFIED" className="bg-slate-900 text-red-300">Disqualified</option>
              </select>
            </div>

            <button
              onClick={onBulkDeleteLeads}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedLeadIds.size})</span>
            </button>

            <button
              onClick={() => setSelectedLeadIds(new Set())}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">Syncing CRM leads with Firestore...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No leads match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting search terms or add a new lead record using the button above.
          </p>
        </div>
      ) : viewMode === 'KANBAN' ? (
        /* ================= KANBAN BOARD VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colLeads = filteredLeads.filter((l) => {
              if (col.status === 'VERIFIED_OTP') {
                return l.status === 'VERIFIED_OTP';
              }
              if (col.status === 'NEW') {
                return l.status === 'NEW' || l.status === 'PHONE_OTP_PENDING';
              }
              return l.status === col.status;
            });

            return (
              <div
                key={col.status}
                className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3.5 space-y-3 min-w-[240px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{col.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono font-bold">
                      {colLeads.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onOpenLeadDetail(lead)}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {lead.school || lead.name}
                        </h4>
                        {lead.priority && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                              lead.priority === 'HOT'
                                ? 'bg-red-500/20 text-red-300'
                                : lead.priority === 'WARM'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1 truncate">
                          <span className="text-slate-500">Contact:</span> {lead.name}
                        </div>
                        <div className="flex items-center gap-1 font-mono text-emerald-400 text-[10px]">
                          {lead.phone}
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{formatISTTimestamp(lead.createdAt).split(',')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= DATA TABLE VIEW ================= */
        <div className="space-y-3">
          {/* Table Header Controls */}
          <div className="px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedLeadIds.size > 0 && selectedLeadIds.size === filteredLeads.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <span>School / Institution</span>
            </div>
            <div className="hidden sm:flex items-center gap-8">
              <span>Contact Person & Phone</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
          </div>

          {/* Lead Rows */}
          {filteredLeads.map((lead) => {
            const isSelected = selectedLeadIds.has(lead.id);
            const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={lead.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Checkbox + School & Contact */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectLead(lead.id)}
                    className="w-4 h-4 mt-1 rounded text-emerald-500 accent-emerald-500 cursor-pointer shrink-0"
                  />

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        onClick={() => onOpenLeadDetail(lead)}
                        className="text-sm font-black text-white hover:text-emerald-300 transition cursor-pointer truncate"
                      >
                        {lead.school || lead.name}
                      </h4>
                      {lead.priority && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            lead.priority === 'HOT'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : lead.priority === 'WARM'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span className="text-slate-200 font-semibold">{lead.name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-emerald-400">{lead.phone}</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-400 truncate max-w-[160px]">{lead.email}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span>Captured: {formatISTTimestamp(lead.createdAt || lead.verifiedAt)}</span>
                      {lead.source && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">Source: {lead.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Selector + Action Buttons */}
                <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="NEW">New Inquiry</option>
                    <option value="VERIFIED_OTP">Verified OTP</option>
                    <option value="PHONE_OTP_PENDING">Pending OTP</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                    <option value="PROPOSAL_SENT">Proposal Sent</option>
                    <option value="CONVERTED">Closed Won</option>
                    <option value="DISQUALIFIED">Disqualified</option>
                  </select>

                  {/* 1-Click WhatsApp Button */}
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                      lead.name
                    )},%20following%20up%20from%20EduSphere%20Smart%20School%20ERP.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  {/* 1-Click Call Button */}
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 transition cursor-pointer"
                    title="Call Phone"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {/* View 360 Drawer */}
                  <button
                    onClick={() => onOpenLeadDetail(lead)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                    title="View Full Lead Details & Timeline"
                  >
                    <Eye className="w-4 h-4 text-slate-300" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete lead "${lead.name}"?`)) {
                        onDeleteLead(lead.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition cursor-pointer"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
