import React, { useState } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import {
  BookOpen,
  CreditCard,
  UserCheck,
  TrendingUp,
  Bell,
  Bus,
  FileText,
  Sparkles,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Send,
  HeartHandshake,
  ChevronRight,
  Download,
  AlertCircle,
  Zap,
  Plus,
  Check,
  DollarSign,
  MessageSquare,
  Award,
} from 'lucide-react';

type ParentModule =
  | 'homework'
  | 'fees'
  | 'attendance'
  | 'progress'
  | 'notifications'
  | 'transport'
  | 'leave';

export const CaseStudy: React.FC = () => {
  // Ecosystem perspective state: 'teacher' vs 'parent'
  const [perspective, setPerspective] = useState<'teacher' | 'parent'>('parent');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<ParentModule>('homework');
  const [phoneTilt, setPhoneTilt] = useState<number>(4);

  // Leave request state
  const [leaveApplied, setLeaveApplied] = useState<boolean>(false);
  const [leaveReason, setLeaveReason] = useState<string>('Family Event');

  // Fee payment simulated state
  const [feePaid, setFeePaid] = useState<boolean>(false);

  // Ecosystem Transition Trigger
  const handlePerspectiveChange = (newPerspective: 'teacher' | 'parent') => {
    if (newPerspective === perspective || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setPerspective(newPerspective);
      setIsTransitioning(false);
    }, 600);
  };

  // Modules metadata matching user prompt requirements
  const parentModules: {
    id: ParentModule;
    label: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
    description: string;
  }[] = [
    {
      id: 'homework',
      label: 'Homework',
      icon: <BookOpen className="w-4 h-4" />,
      color: '#00C896',
      badge: 'DAILY FEED',
      description: 'View daily homework broadcasts, teacher voice notes & attached worksheets.',
    },
    {
      id: 'fees',
      label: 'Fees',
      icon: <CreditCard className="w-4 h-4" />,
      color: '#38BDF8',
      badge: '1-TAP UPI PAYMENT',
      description: 'Instant 10-second fee clearance with WhatsApp digital receipt delivery.',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <UserCheck className="w-4 h-4" />,
      color: '#F59E0B',
      badge: 'GATE RFID SYNC',
      description: 'Live entry/exit timestamps when your child steps inside the school campus.',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-4 h-4" />,
      color: '#A855F7',
      badge: 'NEP REPORT CARDS',
      description: 'Subject-wise exam analytics, gradebook trends & competency growth scores.',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      color: '#EC4899',
      badge: 'INSTANT ALERTS',
      description: 'Emergency updates, exam schedules & official school circulars.',
    },
    {
      id: 'transport',
      label: 'Transport',
      icon: <Bus className="w-4 h-4" />,
      color: '#06B6D4',
      badge: 'LIVE 3D GPS TRACK',
      description: 'Real-time school bus location map with geofenced pickup countdowns.',
    },
    {
      id: 'leave',
      label: 'Leave Requests',
      icon: <FileText className="w-4 h-4" />,
      color: '#10B981',
      badge: '1-CLICK APPLY',
      description: 'Digital medical & personal leave applications directly to class teacher.',
    },
  ];

  return (
    <section id="casestudy" className="py-20 sm:py-28 bg-slate-950 relative overflow-hidden">
      {/* Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            PARENT APP
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display mb-3">
            Connected to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Parents.</span>
          </h2>

          <p className="text-lg sm:text-2xl font-semibold text-slate-300 font-display max-w-xl mx-auto leading-relaxed">
            Real-time peace of mind. <br className="hidden sm:inline" />
            <span className="text-emerald-400">Every update delivered straight to your pocket.</span>
          </p>
        </div>

        {/* ECOSYSTEM PERSPECTIVE SWITCHER BAR */}
        <div className="max-w-3xl mx-auto mb-12 p-3.5 glass-panel rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ecosystem Perspective:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-emerald-500/30">
              <span className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md">
                👨‍👩‍👧 Parent Portal App
              </span>
            </div>
          </div>

          {/* Tilt Angle Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Tilt:</span>
            {[-6, -4, 0, 4, 6].map((angle) => (
              <button
                key={angle}
                onClick={() => setPhoneTilt(angle)}
                className={`px-2 py-1 rounded-lg text-xs font-mono-code font-bold transition ${
                  phoneTilt === angle
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>
        </div>

        {/* MAIN INTERACTIVE DISPLAY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* LEFT FEATURE CARDS (4 Modules) */}
          <div className="lg:col-span-3 space-y-3.5 order-2 lg:order-1">
            {parentModules.slice(0, 4).map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-3 shadow-lg cursor-pointer ${
                    isActive
                      ? 'glass-panel border-emerald-400 bg-emerald-950/30 text-white ring-1 ring-emerald-400/80 scale-102'
                      : 'glass-panel-light border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div
                    className="p-2 rounded-xl shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isActive ? `${m.color}25` : 'rgba(30, 41, 59, 0.8)',
                      color: isActive ? m.color : '#94A3B8',
                    }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                      {m.badge}
                    </div>
                    <div className="text-sm font-extrabold text-white">{m.label}</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CENTER ROTATED SMARTPHONE DISPLAY */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2 my-4 lg:my-0">
            <div
              className={`relative w-full max-w-[340px] sm:max-w-[360px] transition-all duration-700 ease-out ${
                isTransitioning ? 'scale-90 rotate-180 opacity-20 blur-sm' : ''
              }`}
              style={{
                transform: isTransitioning ? 'rotateY(180deg) scale(0.9)' : `rotate(${phoneTilt}deg)`,
              }}
            >
              {/* Smartphone Outer Shell */}
              <div className="rounded-[48px] bg-slate-900 p-3 sm:p-4 border-4 border-slate-700/80 shadow-[0_0_80px_rgba(0,200,150,0.25)] relative overflow-hidden ring-1 ring-white/10">
                
                {/* Top Notch Camera */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-28 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-between px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                </div>

                {/* Smartphone Screen Body */}
                <div className="rounded-[38px] bg-slate-950 min-h-[580px] sm:min-h-[620px] flex flex-col justify-between overflow-hidden border border-slate-800/80 text-left pt-7 pb-4 px-3 sm:px-4 relative">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-2 text-[10px] font-mono-code font-bold text-slate-400 mb-2">
                    <span>09:42 AM</span>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Zap className="w-3 h-3" />
                      <span>5G • 100%</span>
                    </div>
                  </div>

                  {/* Student Switcher Profile Header */}
                  <div className="p-3 rounded-2xl glass-panel border border-slate-800 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs">
                          🎒
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">Aarav Sharma</div>
                        <div className="text-[10px] text-emerald-400">Grade 10-A • Roll #101</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PARENT PORTAL
                    </span>
                  </div>

                  {/* Horizontal Module Quick Pill Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                    {parentModules.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModule(m.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                          activeModule === m.id
                            ? 'bg-emerald-400 text-slate-950 font-extrabold shadow-md'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* DYNAMIC SCREEN CONTENT AREA */}
                  <div className="flex-1 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3 overflow-y-auto space-y-3">
                    
                    {/* MODULE 1: HOMEWORK */}
                    {activeModule === 'homework' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-extrabold text-white">Daily Homework Broadcast</span>
                          <span className="text-[9px] text-slate-400 font-mono-code">TODAY</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-emerald-400">Mathematics • Mrs. Verma</span>
                            <span className="text-slate-500">Due Tomorrow</span>
                          </div>
                          <p className="text-[10px] text-slate-300 leading-relaxed">
                            Complete Exercise 4.2 Questions 1-8 in fair notebook.
                          </p>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">📄 Worksheet_Q4.pdf</span>
                            <span className="text-emerald-400 font-bold">Download</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-teal-400">Physics • Mr. Kapoor</span>
                            <span className="text-slate-500">Submitted</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Read Chapter 5: Ohm's Law and solve numericals 1-5.</p>
                        </div>
                      </div>
                    )}

                    {/* MODULE 2: FEES */}
                    {activeModule === 'fees' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-extrabold text-white">Fee Management</span>
                          <span className="text-[9px] text-emerald-400 font-bold">Q3 DUES READY</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-[10px] text-slate-400">Quarter 3 Tuition & Transport</div>
                              <div className="text-xl font-black text-white font-display">₹38,500</div>
                            </div>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                feePaid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {feePaid ? 'PAID CLEAR' : 'DUE BY OCT 15'}
                            </span>
                          </div>

                          {!feePaid ? (
                            <button
                              onClick={() => setFeePaid(true)}
                              className="w-full py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay ₹38,500 via UPI / Card</span>
                            </button>
                          ) : (
                            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-300 flex items-center justify-between">
                              <span className="flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Payment Received
                              </span>
                              <span className="underline cursor-pointer">Receipt PDF</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* MODULE 3: ATTENDANCE */}
                    {activeModule === 'attendance' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-extrabold text-white">Attendance & Gate Logs</span>
                          <span className="text-[9px] text-emerald-400 font-mono-code font-bold">98.2% MONTHLY</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-300 font-bold">Today's Campus Entry:</span>
                            <span className="text-emerald-400 font-mono-code font-bold">07:54 AM (RFID Gate 2)</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-300 font-bold">Status:</span>
                            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-extrabold">
                              PRESENT IN CLASS
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] space-y-1">
                          <div className="text-slate-400 font-bold">Weekly Overview:</div>
                          <div className="grid grid-cols-5 gap-1 text-center font-mono-code pt-1">
                            {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                              <div key={i} className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                {day} ✓
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MODULE 4: PROGRESS */}
                    {activeModule === 'progress' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-extrabold text-white">Academic Performance</span>
                          <span className="text-[9px] text-purple-400 font-bold">RANK #3 IN CLASS</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-white">Mid-Term Assessment</span>
                            <span className="text-emerald-400">92.4% Overall</span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[9px] text-slate-300">
                              <span>Mathematics</span>
                              <span className="font-bold text-emerald-400">96/100 (A+)</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-300">
                              <span>Physics</span>
                              <span className="font-bold text-teal-400">91/100 (A+)</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-300">
                              <span>English</span>
                              <span className="font-bold text-sky-400">89/100 (A)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MODULE 5: NOTIFICATIONS */}
                    {activeModule === 'notifications' && (
                      <div className="space-y-2">
                        <div className="text-xs font-extrabold text-white pb-1 border-b border-slate-800">
                          School Broadcasts
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-pink-400">📢 Sports Meet 2026 Announcement</span>
                            <span className="text-[9px] text-slate-500">10m ago</span>
                          </div>
                          <p className="text-[10px] text-slate-300">
                            Annual Inter-School Athletics Meet scheduled for Nov 12. Registration open.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-emerald-400">🗓️ Parent-Teacher Conference</span>
                            <span className="text-[9px] text-slate-500">Yesterday</span>
                          </div>
                          <p className="text-[10px] text-slate-300">Slot booked for Saturday 10:30 AM with Class Teacher.</p>
                        </div>
                      </div>
                    )}

                    {/* MODULE 6: TRANSPORT */}
                    {activeModule === 'transport' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-extrabold text-white">Live School Bus GPS</span>
                          <span className="text-[9px] text-cyan-400 font-mono-code font-bold">BUS #04 IN TRANSIT</span>
                        </div>

                        {/* Simulated Map Visualizer */}
                        <div className="h-28 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden p-2.5 flex flex-col justify-between">
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

                          <div className="relative z-10 flex justify-between items-center text-[10px]">
                            <span className="bg-slate-900/90 px-2 py-0.5 rounded text-white font-bold border border-slate-800">
                              Route 14 • Delhi North
                            </span>
                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono-code font-bold">
                              ETA: 8 MINS
                            </span>
                          </div>

                          <div className="relative z-10 flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px]">
                            <Bus className="w-4 h-4 text-cyan-400 animate-bounce" />
                            <div>
                              <div className="font-bold text-white">Current Location: Ring Road Junction</div>
                              <div className="text-[9px] text-slate-400">Driver: Rajesh Kumar (+91 98765-XXXXX)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MODULE 7: LEAVE REQUESTS */}
                    {activeModule === 'leave' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-extrabold text-white">Digital Leave Application</span>
                          <span className="text-[9px] text-emerald-400 font-bold">INSTANT RESPONSE</span>
                        </div>

                        {!leaveApplied ? (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="text-[10px] font-bold text-slate-300">Select Leave Reason:</div>
                            <select
                              value={leaveReason}
                              onChange={(e) => setLeaveReason(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[10px] text-white"
                            >
                              <option>Medical Leave / Health</option>
                              <option>Family Event / Outstation</option>
                              <option>Personal Urgency</option>
                            </select>

                            <button
                              onClick={() => setLeaveApplied(true)}
                              className="w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Leave Request</span>
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[10px] space-y-1.5">
                            <div className="flex items-center justify-between font-bold text-emerald-300">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Request Approved
                              </span>
                              <span className="text-[9px] font-mono-code text-slate-400">Ref #LV-882</span>
                            </div>
                            <p className="text-slate-300">Class Teacher Mrs. Verma approved leave for tomorrow.</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Phone Bottom Navigation Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-[10px] text-slate-400">
                    <button className="flex flex-col items-center gap-0.5 text-emerald-400 font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Parent</span>
                    </button>
                    <button className="flex flex-col items-center gap-0.5 hover:text-white">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Fees</span>
                    </button>
                    <button className="flex flex-col items-center gap-0.5 hover:text-white">
                      <Bus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Bus</span>
                    </button>
                  </div>

                  {/* Phone Home Bar */}
                  <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FEATURE CARDS (Remaining 3 Modules) */}
          <div className="lg:col-span-3 space-y-3.5 order-3">
            {parentModules.slice(4, 7).map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-3 shadow-lg cursor-pointer ${
                    isActive
                      ? 'glass-panel border-emerald-400 bg-emerald-950/30 text-white ring-1 ring-emerald-400/80 scale-102'
                      : 'glass-panel-light border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div
                    className="p-2 rounded-xl shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isActive ? `${m.color}25` : 'rgba(30, 41, 59, 0.8)',
                      color: isActive ? m.color : '#94A3B8',
                    }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                      {m.badge}
                    </div>
                    <div className="text-sm font-extrabold text-white">{m.label}</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
