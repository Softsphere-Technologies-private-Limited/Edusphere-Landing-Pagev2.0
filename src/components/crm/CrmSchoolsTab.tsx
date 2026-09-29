import React, { useState } from 'react';
import {
  School,
  Plus,
  Search,
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Award,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { CrmSchool } from '../../types';

interface CrmSchoolsTabProps {
  schools: CrmSchool[];
  onAddSchool: (school: Omit<CrmSchool, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteSchool: (id: string) => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const CrmSchoolsTab: React.FC<CrmSchoolsTabProps> = ({
  schools,
  onAddSchool,
  onDeleteSchool,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [studentCount, setStudentCount] = useState<number>(850);
  const [decisionMaker, setDecisionMaker] = useState('');
  const [decisionMakerRole, setDecisionMakerRole] = useState('Principal');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<CrmSchool['tier']>('PREMIUM');
  const [status, setStatus] = useState<CrmSchool['status']>('OPPORTUNITY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSchools = schools.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.decisionMaker.toLowerCase().includes(q);
    const matchTier = tierFilter === 'ALL' || s.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city) return;
    setIsSubmitting(true);
    try {
      await onAddSchool({
        name,
        city,
        state,
        studentCount: Number(studentCount) || 0,
        decisionMaker,
        decisionMakerRole,
        email,
        phone,
        tier,
        status,
      });
      setName('');
      setCity('');
      setState('');
      setDecisionMaker('');
      setEmail('');
      setPhone('');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search school name, city, principal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-2xl text-xs text-white outline-none transition"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-bold outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Tiers ({schools.length})</option>
              <option value="STANDARD" className="bg-slate-900 text-slate-300">Standard</option>
              <option value="PREMIUM" className="bg-slate-900 text-emerald-400">Premium ERP</option>
              <option value="ENTERPRISE" className="bg-slate-900 text-purple-400">Enterprise Suite</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add School Account</span>
        </button>
      </div>

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((s) => {
          const cleanPhone = s.phone.replace(/[^0-9]/g, '');

          return (
            <div
              key={s.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 shadow-lg group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-emerald-400 shrink-0" />
                    <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition truncate">
                      {s.name}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.city}{s.state ? `, ${s.state}` : ''}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                    s.tier === 'ENTERPRISE'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : s.tier === 'PREMIUM'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {s.tier}
                </span>
              </div>

              {/* Stats & Contacts */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-850 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Student Strength</span>
                  <span className="font-bold text-white font-mono">{s.studentCount.toLocaleString('en-IN')} Students</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Account Status</span>
                  <span className="font-bold text-emerald-400">{s.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div className="text-[11px] text-slate-400">
                  Key Contact: <strong className="text-white">{s.decisionMaker}</strong> ({s.decisionMakerRole})
                </div>
                {s.phone && (
                  <div className="font-mono text-[11px] text-emerald-400">{s.phone}</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {s.phone && (
                    <>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                        title="WhatsApp Contact"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={`tel:${s.phone}`}
                        className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 transition cursor-pointer"
                        title="Call Phone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}

                  {s.email && (
                    <a
                      href={`mailto:${s.email}`}
                      className="p-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30 transition cursor-pointer"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete school account "${s.name}"?`)) {
                      onDeleteSchool(s.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredSchools.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-2 bg-slate-900/40 rounded-3xl border border-slate-800">
            <School className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No schools found</h4>
            <p className="text-xs text-slate-400">Add school client accounts using the button above.</p>
          </div>
        )}
      </div>

      {/* ADD SCHOOL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white font-display">Add School Institution</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">School / Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Public Senior Secondary School"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmedabad / Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Student Strength</label>
                  <input
                    type="number"
                    min="0"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">ERP License Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as CrmSchool['tier'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="STANDARD">Standard ERP (Basic)</option>
                    <option value="PREMIUM">Premium ERP (Full Modules)</option>
                    <option value="ENTERPRISE">Enterprise AI Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Decision Maker Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Sunita Rao"
                    value={decisionMaker}
                    onChange={(e) => setDecisionMaker(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Role / Designation</label>
                  <input
                    type="text"
                    placeholder="Principal / Chairman"
                    value={decisionMakerRole}
                    onChange={(e) => setDecisionMakerRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
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
                  {isSubmitting ? 'Saving...' : 'Save School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
