import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Clock,
  DollarSign,
  Users,
  Target,
  CalendarCheck,
  Zap,
  ArrowUpRight,
  PhoneCall,
  Plus,
  School,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';
import { CrmLead, CrmDeal, CrmActivity, CrmSchool } from '../../types';

interface CrmOverviewTabProps {
  leads: CrmLead[];
  deals: CrmDeal[];
  activities: CrmActivity[];
  schools: CrmSchool[];
  onNavigateTab: (tab: 'overview' | 'leads' | 'deals' | 'activities' | 'schools' | 'team' | 'smtp' | 'security') => void;
  onOpenAddLead: () => void;
  onOpenAddDeal: () => void;
  onOpenAddActivity: () => void;
}

export const CrmOverviewTab: React.FC<CrmOverviewTabProps> = ({
  leads,
  deals,
  activities,
  schools,
  onNavigateTab,
  onOpenAddLead,
  onOpenAddDeal,
  onOpenAddActivity,
}) => {
  // Calculations
  const totalLeads = leads.length;
  const verifiedLeads = leads.filter((l) => l.status === 'VERIFIED_OTP' || l.status === 'CONVERTED' || l.status === 'DEMO_SCHEDULED').length;
  const pendingLeads = leads.filter((l) => l.status === 'PHONE_OTP_PENDING' || l.status === 'NEW').length;
  const convertedLeads = leads.filter((l) => l.status === 'CONVERTED').length;

  const totalPipelineValue = deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const wonDeals = deals.filter((d) => d.stage === 'CLOSED_WON');
  const wonValue = wonDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const pendingActivities = activities.filter((a) => a.status === 'PENDING');
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter((a) => a.dueDate === todayDateStr && a.status === 'PENDING');

  const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  // Format currency in Indian Lakhs/Thousands or standard INR
  const formatINR = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Recent leads slice
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Quick Actions */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/60 border border-emerald-500/30 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>EduSphere Intelligent CRM Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              School Admissions & Sales Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track school demo inquiries, active negotiations, scheduled visits, and team conversions in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenAddLead}
              className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </button>
            <button
              onClick={onOpenAddDeal}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold text-xs transition-all hover:border-emerald-500/50 flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Add Deal</span>
            </button>
            <button
              onClick={onOpenAddActivity}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold text-xs transition-all hover:border-indigo-500/50 flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-indigo-400" />
              <span>Log Follow-up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total School Inquiries</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalLeads}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {verifiedLeads} Verified
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-medium">{pendingLeads} Pending</span>
          </div>
        </div>

        {/* Pipeline Deal Value */}
        <div
          onClick={() => onNavigateTab('deals')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pipeline Deal Value</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{formatINR(totalPipelineValue)}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-indigo-300 font-bold">{deals.length} Active Deals</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">{formatINR(wonValue)} Won</span>
          </div>
        </div>

        {/* Follow-ups & Tasks */}
        <div
          onClick={() => onNavigateTab('activities')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Follow-ups & Demos</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{pendingActivities.length}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-amber-400 font-bold">{todayActivities.length} Scheduled Today</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{activities.length} Total</span>
          </div>
        </div>

        {/* Win Rate & Institutional Reach */}
        <div
          onClick={() => onNavigateTab('schools')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Schools & Win Rate</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono">{winRate}%</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-slate-300 font-bold">{schools.length} Accounts</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">{convertedLeads} Won Leads</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Pipeline Funnel & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sales Pipeline Stage Funnel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Sales Pipeline Stages</span>
              </h3>
              <p className="text-xs text-slate-400">Deal progression from initial lead to ERP rollout</p>
            </div>
            <button
              onClick={() => onNavigateTab('deals')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                stage: 'QUALIFICATION',
                label: '1. Discovery & Lead Qualification',
                color: 'bg-blue-500',
                deals: deals.filter((d) => d.stage === 'QUALIFICATION'),
              },
              {
                stage: 'DEMO_SCHEDULED',
                label: '2. Live ERP Demo Scheduled',
                color: 'bg-indigo-500',
                deals: deals.filter((d) => d.stage === 'DEMO_SCHEDULED'),
              },
              {
                stage: 'PROPOSAL_SENT',
                label: '3. Quote & Proposal Sent',
                color: 'bg-amber-500',
                deals: deals.filter((d) => d.stage === 'PROPOSAL_SENT'),
              },
              {
                stage: 'NEGOTIATION',
                label: '4. Trustee / Management Review',
                color: 'bg-purple-500',
                deals: deals.filter((d) => d.stage === 'NEGOTIATION'),
              },
              {
                stage: 'CLOSED_WON',
                label: '5. Closed Won (Agreement Signed)',
                color: 'bg-emerald-500',
                deals: deals.filter((d) => d.stage === 'CLOSED_WON'),
              },
            ].map((st) => {
              const stageValue = st.deals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
              const percentage = totalPipelineValue > 0 ? Math.round((stageValue / totalPipelineValue) * 100) : 0;
              return (
                <div key={st.stage} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                      <span className="font-bold text-slate-200">{st.label}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-mono">
                        {st.deals.length} deals
                      </span>
                    </div>
                    <div className="font-black text-white font-mono">{formatINR(stageValue)}</div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${st.color} transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, st.deals.length > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Follow-ups & Recent Inquiries (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Follow-up Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white font-display flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>Today's Actions ({todayActivities.length})</span>
              </h3>
              <button
                onClick={() => onNavigateTab('activities')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>All Tasks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayActivities.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800/60">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 opacity-80" />
                <p className="font-bold text-slate-300">All caught up for today!</p>
                <p className="text-[11px] text-slate-500 mt-0.5">No overdue follow-up calls or demo meetings.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayActivities.slice(0, 3).map((act) => (
                  <div key={act.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{act.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{act.schoolName} • {act.contactName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-bold shrink-0">
                      {act.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries Snippet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white font-display flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Latest Inquiries</span>
              </h3>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({leads.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentLeads.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800/60">
                  No inquiries recorded yet.
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{lead.school || lead.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{lead.name} • {lead.phone}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase shrink-0 ${
                        lead.status === 'VERIFIED_OTP'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : lead.status === 'CONVERTED'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {lead.status === 'VERIFIED_OTP' ? 'Verified OTP' : lead.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
