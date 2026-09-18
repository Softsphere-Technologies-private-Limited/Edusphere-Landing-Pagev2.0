import React, { useState, useEffect } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import {
  UserCheck,
  UserPlus,
  CreditCard,
  Users,
  FileBarChart,
  MessageSquare,
  BarChart3,
  Search,
  Bell,
  Building2,
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  Filter,
  Download,
  Plus,
  Layers,
  Laptop,
} from 'lucide-react';

type DashboardTab = 'attendance' | 'admissions' | 'finance' | 'staff' | 'reports' | 'communication' | 'analytics';

export const UserRolesSection: React.FC = () => {
  // Step 0: Sphere, 1: Shell, 2: Sidebar, 3: TopNav, 4: Metrics, 5: Charts, 6: Activity (Full Assembly)
  const [animStep, setAnimStep] = useState<number>(6);
  const [isAutoAssembling, setIsAutoAssembling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('finance');
  const [activeBranch, setActiveBranch] = useState<string>('Main Campus (New Delhi)');

  // Progressive assembly animation loop
  const runProgressiveAssembly = () => {
    setIsAutoAssembling(true);
    setAnimStep(0);
    
    const steps = [1, 2, 3, 4, 5, 6];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnimStep(step);
        if (index === steps.length - 1) {
          setIsAutoAssembling(false);
        }
      }, (index + 1) * 700);
    });
  };

  // Nav menu items matching prompt specs
  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'attendance', label: 'Attendance', icon: <UserCheck className="w-4 h-4" />, badge: '98.2%' },
    { id: 'admissions', label: 'Admissions', icon: <UserPlus className="w-4 h-4" />, badge: '+18' },
    { id: 'finance', label: 'Finance', icon: <CreditCard className="w-4 h-4" />, badge: '₹1.4Cr' },
    { id: 'staff', label: 'Staff', icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare className="w-4 h-4" />, badge: 'Live' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  // Live Activity Feed entries
  const liveActivities = [
    { time: '2 mins ago', type: 'finance', text: '₹38,500 Fee payment received via UPI', sub: 'Aarav Sharma (Grade 10-A)' },
    { time: '8 mins ago', type: 'attendance', text: 'Biometric Gate Sync Complete: 1,248/1,280 Present', sub: '97.5% Attendance Recorded' },
    { time: '15 mins ago', type: 'admissions', text: 'New Grade 1 Admission Application Submitted', sub: 'Inquiry ID #ED-2026-891' },
    { time: '24 mins ago', type: 'communication', text: 'WhatsApp Circular Dispatched: Sports Meet 2026', sub: 'Sent to 1,280 Parent Phones' },
    { time: '35 mins ago', type: 'staff', text: 'Leave Approval Requested by Mrs. Verma', sub: 'Senior Mathematics Faculty' },
  ];

  return (
    <section id="roles" className="py-20 sm:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PRINCIPAL DASHBOARD
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display mb-3">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Principals.</span>
          </h2>

          <p className="text-lg sm:text-2xl font-semibold text-slate-300 font-display max-w-xl mx-auto leading-relaxed">
            One view of the school. <br className="hidden sm:inline" />
            <span className="text-emerald-400">One place to make better decisions.</span>
          </p>
        </div>

        {/* Assembly Controls & Step Indicator */}
        <div className="max-w-3xl mx-auto mb-8 p-3.5 glass-panel rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={runProgressiveAssembly}
              disabled={isAutoAssembling}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-lg disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>{isAutoAssembling ? 'Assembling Dashboard...' : 'Replay Assembly Animation'}</span>
            </button>

            <div className="text-xs text-slate-400 hidden md:block">
              Stage {animStep}/6: <span className="text-white font-bold">{['Sphere', 'Shell', 'Sidebar', 'Navigation', 'Metrics', 'Charts', 'Complete Workspace'][animStep]}</span>
            </div>
          </div>

          {/* Assembly Step Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {['Shell', 'Sidebar', 'Nav', 'Metrics', 'Charts', 'Activity'].map((label, idx) => {
              const stepNum = idx + 1;
              const isPassed = animStep >= stepNum;
              return (
                <button
                  key={idx}
                  onClick={() => setAnimStep(stepNum)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CINEMATIC LAPTOP/DESKTOP WORKSPACE CONTAINER */}
        <div className="relative w-full max-w-6xl mx-auto transition-all duration-700">
          
          {/* SPHERE TO LAPTOP MORPHING STAGE (Stage 0: Sphere shape) */}
          {animStep === 0 && (
            <div className="w-full h-[520px] rounded-3xl glass-panel border border-slate-800 flex items-center justify-center p-8 text-center animate-pulse">
              <div className="p-10 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/80 border-4 border-emerald-400 shadow-[0_0_100px_rgba(0,200,150,0.5)] flex flex-col items-center justify-center scale-110">
                <EduSphereLogo size="lg" showText={true} variant="gradient" />
                <span className="mt-3 text-xs font-mono-code font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
                  Stretching into Desktop Workspace...
                </span>
              </div>
            </div>
          )}

          {/* LAPTOP / DESKTOP INTERFACE (Stage 1 to 6) */}
          {animStep >= 1 && (
            <div className="relative rounded-[28px] bg-slate-950 p-2 sm:p-4 border-2 border-slate-800 shadow-[0_0_80px_rgba(0,200,150,0.15)] overflow-hidden transition-all duration-700">
              
              {/* Laptop Screen Bezel Top & Camera Notch */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/90 rounded-t-[20px] text-[11px] text-slate-400 font-mono-code">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400 text-[10px] hidden sm:inline">EduSphere OS — Principal Terminal v4.2</span>
                </div>
                
                {/* Center WebCam Notch */}
                <div className="w-16 h-3 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
                </div>

                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Encrypted SSL</span>
                </div>
              </div>

              {/* DASHBOARD INNER BODY GRID */}
              <div className="min-h-[580px] bg-slate-950 rounded-b-[20px] flex flex-col md:flex-row text-left overflow-hidden">
                
                {/* SIDEBAR NAVIGATION (Visible from Stage 2) */}
                {animStep >= 2 ? (
                  <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 transition-all duration-500">
                    <div>
                      {/* Brand Logo Header */}
                      <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-800">
                        <EduSphereLogo size="sm" showText={true} variant="gradient" />
                      </div>

                      {/* Branch Switcher Dropdown */}
                      <div className="mb-6 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700 transition">
                        <div className="flex items-center gap-2 text-slate-200 font-semibold truncate">
                          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{activeBranch}</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-2">
                          Core Modules
                        </div>
                        {navItems.map((item) => {
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveTab(item.id)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{item.icon}</span>
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full font-mono-code font-bold ${
                                    isActive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Principal Profile Footer */}
                    <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white">
                          🏛️
                        </div>
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">Dr. R. K. Sharma</div>
                        <div className="text-[10px] text-emerald-400 truncate">Principal & Director</div>
                      </div>
                    </div>
                  </aside>
                ) : (
                  <div className="w-16 bg-slate-900/40 border-r border-slate-800/60 p-4 animate-pulse flex flex-col gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800" />
                    <div className="w-8 h-8 rounded-xl bg-slate-800" />
                    <div className="w-8 h-8 rounded-xl bg-slate-800" />
                  </div>
                )}

                {/* MAIN DASHBOARD CONTENT VIEW */}
                <div className="flex-1 flex flex-col bg-slate-950 p-4 sm:p-6 overflow-y-auto space-y-6">
                  
                  {/* TOP NAVIGATION HEADER BAR (Visible from Stage 3) */}
                  {animStep >= 3 ? (
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Institutional Control Center
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                          {activeTab.toUpperCase()} OVERVIEW — TODAY
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Global Search Bar */}
                        <div className="relative flex-1 sm:w-64">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search student, fee receipt, staff..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                          />
                        </div>

                        {/* Notification Bell */}
                        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300">
                          <Bell className="w-4 h-4 text-slate-300" />
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                        </button>
                      </div>
                    </header>
                  ) : (
                    <div className="h-12 bg-slate-900/50 rounded-xl animate-pulse" />
                  )}

                  {/* METRIC CARDS ROW (Visible from Stage 4) */}
                  {animStep >= 4 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Today's Attendance</span>
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white font-display">97.8%</div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                          <TrendingUp className="w-3 h-3" />
                          <span>+1.2% vs Last Week</span>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Fee Collection YTD</span>
                          <CreditCard className="w-4 h-4 text-teal-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white font-display">₹1.42 Cr</div>
                        <div className="text-[10px] text-teal-400 flex items-center gap-1 mt-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>94% On-time Receipts</span>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>New Admissions</span>
                          <UserPlus className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white font-display">184 Enrolled</div>
                        <div className="text-[10px] text-sky-400 flex items-center gap-1 mt-1 font-semibold">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Target 200 Seats</span>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Staff On Duty</span>
                          <Users className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white font-display">82 / 84</div>
                        <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-semibold">
                          <Zap className="w-3 h-3" />
                          <span>2 On Leave Approved</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-slate-900/40 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  )}

                  {/* CHARTS & ANALYTICS VISUALIZERS (Visible from Stage 5) */}
                  {animStep >= 5 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Attendance & Fee Collection Trajectory Chart */}
                      <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-xs font-bold text-white">ATTENDANCE & FEE COLLECTION TRAJECTORY</div>
                            <div className="text-[10px] text-slate-400">Monthly breakdown across all 12 grades</div>
                          </div>
                          <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            LIVE DATA
                          </span>
                        </div>

                        {/* Interactive Bar Chart Visualization */}
                        <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-800">
                          {[
                            { month: 'Apr', fee: 85, att: 96 },
                            { month: 'May', fee: 92, att: 98 },
                            { month: 'Jun', fee: 60, att: 90 },
                            { month: 'Jul', fee: 88, att: 97 },
                            { month: 'Aug', fee: 95, att: 99 },
                            { month: 'Sep', fee: 78, att: 95 },
                            { month: 'Oct', fee: 91, att: 98 },
                            { month: 'Nov', fee: 96, att: 99 },
                          ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                              <div className="w-full flex items-end justify-center gap-1 h-32">
                                <div
                                  className="w-2.5 sm:w-3.5 bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                                  style={{ height: `${d.fee}%` }}
                                />
                                <div
                                  className="w-2.5 sm:w-3.5 bg-gradient-to-t from-sky-600 to-cyan-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                                  style={{ height: `${d.att}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono-code">{d.month}</span>
                            </div>
                          ))}
                        </div>

                        {/* Chart Legend */}
                        <div className="flex items-center justify-center gap-6 mt-3 text-[11px] text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded bg-emerald-400" />
                            <span>Fee Receipts (%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded bg-cyan-400" />
                            <span>Student Attendance (%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Admission Overview Funnel Box */}
                      <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-white mb-1">ADMISSION OVERVIEW 2026</div>
                          <div className="text-[10px] text-slate-400 mb-4">Inquiries to Final Enrollments</div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                                <span>Inquiries Received</span>
                                <span>420 Leads</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-400 w-full" />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                                <span>Campus Tours Completed</span>
                                <span>280 Visited</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-400 w-[66%]" />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                                <span>Documents Verified</span>
                                <span>210 Ready</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[50%]" />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                                <span>Final Fee Paid & Enrolled</span>
                                <span className="text-emerald-400">184 Seats</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[44%]" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-emerald-300 font-medium">
                          ⚡ 88% Conversion Rate — 16 Seats remaining for Grade 11 Science.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-slate-900/40 rounded-2xl animate-pulse" />
                  )}

                  {/* LIVE ACTIVITY FEED (Visible from Stage 6) */}
                  {animStep >= 6 ? (
                    <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Live School Operations Feed
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono-code">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          REAL-TIME AUDIT STREAM
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {liveActivities.map((act, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Zap className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-bold text-white">{act.text}</div>
                                <div className="text-[10px] text-slate-400">{act.sub}</div>
                              </div>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono-code shrink-0">
                              {act.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-slate-900/40 rounded-2xl animate-pulse" />
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
