import React, { useState } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import {
  UserCheck,
  BookOpen,
  FileCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  Smartphone,
  RotateCcw,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Zap,
  Bell,
  Mic,
  Award,
  Layers,
  FileText,
  ThumbsUp,
  AlertTriangle,
  GraduationCap,
  PenTool,
  Check,
  BarChart2,
} from 'lucide-react';

type TeacherModule =
  | 'attendance'
  | 'gradebook'
  | 'homework'
  | 'lesson'
  | 'substitution'
  | 'remarks'
  | 'ai_assistant';

export const BentoGrid: React.FC = () => {
  const [activeModule, setActiveModule] = useState<TeacherModule>('attendance');
  const [phoneRotation, setPhoneRotation] = useState<number>(-4);

  // Interactive Attendance Roll Call State
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Sharma', roll: '101', status: 'present' },
    { id: 2, name: 'Ananya Verma', roll: '102', status: 'present' },
    { id: 3, name: 'Devendra Patel', roll: '103', status: 'absent' },
    { id: 4, name: 'Isha Gupta', roll: '104', status: 'present' },
    { id: 5, name: 'Karan Malhotra', roll: '105', status: 'late' },
  ]);

  const toggleStudentStatus = (id: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'present' ? 'absent' : s.status === 'absent' ? 'late' : 'present';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Interactive Gradebook state
  const [marks, setMarks] = useState([
    { id: 1, name: 'Aarav Sharma', score: 48, max: 50, grade: 'A+' },
    { id: 2, name: 'Ananya Verma', score: 45, max: 50, grade: 'A+' },
    { id: 3, name: 'Devendra Patel', score: 32, max: 50, grade: 'B' },
    { id: 4, name: 'Isha Gupta', score: 49, max: 50, grade: 'A+' },
  ]);

  const handleScoreChange = (id: number, newScore: number) => {
    setMarks((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const clamped = Math.min(Math.max(newScore, 0), 50);
          const grade = clamped >= 45 ? 'A+' : clamped >= 40 ? 'A' : clamped >= 35 ? 'B+' : 'B';
          return { ...m, score: clamped, grade };
        }
        return m;
      })
    );
  };

  // Voice note simulated state for Homework
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(true);

  // Modules metadata tailored exclusively for Teachers App
  const modulesList: {
    id: TeacherModule;
    label: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
    featureDesc: string;
  }[] = [
    {
      id: 'attendance',
      label: 'Class Roll Call',
      icon: <UserCheck className="w-4 h-4" />,
      color: '#00C896',
      badge: '10-SEC ATTENDANCE',
      featureDesc: '1-Tap class roll call with biometric sync and automatic parent absent notifications.',
    },
    {
      id: 'gradebook',
      label: 'Marks & Gradebook',
      icon: <FileCheck className="w-4 h-4" />,
      color: '#38BDF8',
      badge: 'EXAM SCORE ENTRY',
      featureDesc: 'Instant score entry, automatic grade computation and class performance analytics.',
    },
    {
      id: 'homework',
      label: 'Homework & Diary',
      icon: <BookOpen className="w-4 h-4" />,
      color: '#F59E0B',
      badge: 'VOICE & PHOTO BROADCAST',
      featureDesc: 'Broadcast daily homework with teacher voice notes and textbook page photos in 1 click.',
    },
    {
      id: 'lesson',
      label: 'Syllabus Tracker',
      icon: <Layers className="w-4 h-4" />,
      color: '#A855F7',
      badge: 'NEP 2020 CURRICULUM',
      featureDesc: 'Track CBSE/ICSE chapter progress, learning outcomes & practical lab completion.',
    },
    {
      id: 'substitution',
      label: 'Timetable & Proxy',
      icon: <Calendar className="w-4 h-4" />,
      color: '#6366F1',
      badge: 'FREE PERIOD ALERTS',
      featureDesc: 'Personal period schedule with live substitution alerts when covering proxy classes.',
    },
    {
      id: 'remarks',
      label: 'Student Remarks',
      icon: <Award className="w-4 h-4" />,
      color: '#EC4899',
      badge: 'PRAISE & CONCERN LOGS',
      featureDesc: 'Issue positive accomplishment badges or academic concern notes directly to profiles.',
    },
    {
      id: 'ai_assistant',
      label: 'AI Quiz Creator',
      icon: <Sparkles className="w-4 h-4" />,
      color: '#10B981',
      badge: 'WORKSHEET GENERATOR',
      featureDesc: 'Generate custom revision worksheets, quiz questions & answer keys in seconds with AI.',
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            TEACHERS APP & WORKSPACE
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display mb-3">
            Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Teachers.</span>
          </h2>

          <p className="text-lg sm:text-2xl font-semibold text-slate-300 font-display max-w-xl mx-auto leading-relaxed">
            Zero administrative paperwork. <br className="hidden sm:inline" />
            <span className="text-emerald-400">100% focus on teaching & inspiring students.</span>
          </p>
        </div>

        {/* Interactive Controls & View Transformation Toggle */}
        <div className="max-w-3xl mx-auto mb-12 p-3.5 glass-panel rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
            <PenTool className="w-4 h-4 text-emerald-400" />
            <span>Interactive Teacher Mobile Interface</span>
          </div>

          {/* Angle Adjuster */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Tilt:</span>
            {[-6, -4, 0, 4, 6].map((angle) => (
              <button
                key={angle}
                onClick={() => setPhoneRotation(angle)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-bold transition ${
                  phoneRotation === angle
                    ? 'bg-emerald-400 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DISPLAY STAGE: ROTATED SMARTPHONE & SCROLL-DRIVEN FEATURE LABELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* LEFT FEATURE LABELS COLUMN (Desktop) */}
          <div className="lg:col-span-3 space-y-3.5 order-2 lg:order-1">
            {modulesList.slice(0, 4).map((m) => {
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
                      {m.featureDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CENTER SMARTPHONE MOCKUP FRAME FOR TEACHERS APP */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2 my-4 lg:my-0">
            <div
              className="relative w-full max-w-[340px] sm:max-w-[360px] transition-all duration-700 ease-out"
              style={{
                transform: `rotate(${phoneRotation}deg)`,
              }}
            >
              {/* Smartphone Outer Metallic Hardware Frame */}
              <div className="rounded-[48px] bg-slate-900 p-3 sm:p-4 border-4 border-slate-700/80 shadow-[0_0_80px_rgba(0,200,150,0.25)] relative overflow-hidden ring-1 ring-white/10">
                
                {/* Dynamic Island / Top Camera Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-28 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-between px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                </div>

                {/* Smartphone Display Screen */}
                <div className="rounded-[38px] bg-slate-950 min-h-[580px] sm:min-h-[620px] flex flex-col justify-between overflow-hidden border border-slate-800/80 text-left pt-7 pb-4 px-3 sm:px-4 relative">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-2 text-[10px] font-mono-code font-bold text-slate-400 mb-2">
                    <span>09:41 AM</span>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Zap className="w-3 h-3" />
                      <span>5G • 100%</span>
                    </div>
                  </div>

                  {/* Teacher App Header Bar */}
                  <div className="p-3 rounded-2xl glass-panel border border-emerald-500/30 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-0.5 shrink-0 shadow-[0_0_15px_rgba(32,180,134,0.4)]">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs">
                          👩‍🏫
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">Mrs. Ananya Verma</div>
                        <div className="text-[10px] text-emerald-400 font-semibold">Grade 10-A • Mathematics Teacher</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      TEACHER SUITE
                    </span>
                  </div>

                  {/* Module Selector Pill Slider */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                    {modulesList.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModule(m.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                          activeModule === m.id
                            ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* SCREEN DYNAMIC CONTENT VIEWS */}
                  <div className="flex-1 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3 overflow-y-auto space-y-3">
                    
                    {/* VIEW 1: CLASS ROLL CALL */}
                    {activeModule === 'attendance' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-white">Class 10-A Roll Call</div>
                            <div className="text-[10px] text-slate-400">Total 32 Students • Period 1</div>
                          </div>
                          <span className="text-[9px] font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            29 PRESENT
                          </span>
                        </div>

                        {students.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => toggleStudentStatus(s.id)}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-slate-700 transition"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono-code font-bold text-slate-500">#{s.roll}</span>
                              <span className="text-xs font-bold text-slate-200">{s.name}</span>
                            </div>

                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                s.status === 'present'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : s.status === 'absent'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {s.status}
                            </span>
                          </div>
                        ))}

                        <button className="w-full py-2 bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submit & Send WhatsApp Alerts</span>
                        </button>
                      </div>
                    )}

                    {/* VIEW 2: MARKS & GRADEBOOK */}
                    {activeModule === 'gradebook' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-white">Unit Test 2 — Mathematics</div>
                            <div className="text-[10px] text-slate-400">Class Avg: 43.5 / 50 (87%)</div>
                          </div>
                          <span className="text-[9px] font-mono-code font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                            MARKS ENTRY
                          </span>
                        </div>

                        <div className="space-y-2">
                          {marks.map((m) => (
                            <div key={m.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-200 truncate max-w-[120px]">{m.name}</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={m.score}
                                  onChange={(e) => handleScoreChange(m.id, parseInt(e.target.value) || 0)}
                                  className="w-12 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono-code font-bold text-white p-1"
                                />
                                <span className="text-[10px] text-slate-400">/ 50</span>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                                  {m.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button className="w-full py-2 bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md">
                          <BarChart2 className="w-3.5 h-3.5" />
                          <span>Publish Scores to Parent Portal</span>
                        </button>
                      </div>
                    )}

                    {/* VIEW 3: HOMEWORK & DIARY */}
                    {activeModule === 'homework' && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-extrabold text-white">Post Homework & Voice Note</div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="text-[11px] font-bold text-amber-400">Mathematics — Ch. 4 Quadratic Equations</div>
                          <p className="text-[10px] text-slate-300 leading-relaxed">
                            Solve Exercise 4.2 Questions 1 to 8 in fair notebook.
                          </p>

                          {/* Voice Note Simulation */}
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-2 text-amber-400 font-bold">
                              <Mic className="w-3.5 h-3.5 animate-pulse" />
                              <span>Voice Note (0:24s attached)</span>
                            </div>
                            <span className="text-emerald-400 text-[9px] font-mono-code font-bold">RECORDED ✓</span>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                            <span>📷 Textbook_Page_84.jpg</span>
                            <span className="text-emerald-400 font-bold">Attached</span>
                          </div>
                        </div>

                        <button className="w-full py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md">
                          <Send className="w-3.5 h-3.5" />
                          <span>Broadcast to Class Diary & WhatsApp</span>
                        </button>
                      </div>
                    )}

                    {/* VIEW 4: SYLLABUS TRACKER */}
                    {activeModule === 'lesson' && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-extrabold text-white">NEP 2020 Syllabus Tracker</div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="text-[10px] font-bold text-purple-400 uppercase">Unit 3 — Trigonometric Ratios</div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-200">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Topic 3.1: Sine & Cosine
                              </span>
                              <span className="text-[9px] text-emerald-400 font-bold">COMPLETED</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-200">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Topic 3.2: Heights & Distances
                              </span>
                              <span className="text-[9px] text-emerald-400 font-bold">COMPLETED</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-300">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-amber-400" /> Topic 3.3: Practical Lab Session
                              </span>
                              <span className="text-[9px] text-amber-400 font-bold">IN PROGRESS</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW 5: TIMETABLE & SUBSTITUTION */}
                    {activeModule === 'substitution' && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-extrabold text-white">Today's Teaching Schedule</div>

                        <div className="space-y-1.5">
                          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-mono-code font-bold">08:30 - 09:15</span>
                            <span className="text-white font-bold">Period 1 • Math 10-A (Home)</span>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px]">
                            <span className="text-teal-400 font-mono-code font-bold">09:15 - 10:00</span>
                            <span className="text-white font-bold">Period 2 • Math 9-B</span>
                          </div>

                          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between text-[10px] text-indigo-300">
                            <span className="font-mono-code font-bold">11:00 - 11:45</span>
                            <span className="font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-indigo-400" /> Substitution • Class 8-C
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW 6: REMARKS & BADGES */}
                    {activeModule === 'remarks' && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-extrabold text-white">Log Student Remarks</div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[10px]">
                          <div className="text-slate-300 font-bold">Select Student: Aarav Sharma (#101)</div>
                          
                          <div className="grid grid-cols-2 gap-1.5">
                            <button className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 font-bold">
                              <ThumbsUp className="w-3 h-3" /> Star Performer
                            </button>
                            <button className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-300 flex items-center gap-1 font-bold">
                              <Award className="w-3 h-3" /> Helpful Peer
                            </button>
                          </div>

                          <p className="p-2 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                            "Demonstrated exceptional problem-solving in quadratic equations test."
                          </p>
                        </div>
                      </div>
                    )}

                    {/* VIEW 7: AI QUIZ & WORKSHEET CREATOR */}
                    {activeModule === 'ai_assistant' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Teaching Assistant</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                          <div className="text-[10px] text-slate-300 font-medium">
                            Generate a 10-minute HOTS Mathematics revision quiz with answer key?
                          </div>
                          
                          <button className="w-full py-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-[11px] rounded-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate Worksheet & Answer Key PDF</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Phone Bottom Navigation Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-[10px] text-slate-400">
                    <button
                      onClick={() => setActiveModule('attendance')}
                      className={`flex flex-col items-center gap-0.5 ${
                        activeModule === 'attendance' ? 'text-emerald-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Roll Call</span>
                    </button>
                    <button
                      onClick={() => setActiveModule('gradebook')}
                      className={`flex flex-col items-center gap-0.5 ${
                        activeModule === 'gradebook' ? 'text-sky-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Marks</span>
                    </button>
                    <button
                      onClick={() => setActiveModule('homework')}
                      className={`flex flex-col items-center gap-0.5 ${
                        activeModule === 'homework' ? 'text-amber-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Diary</span>
                    </button>
                    <button
                      onClick={() => setActiveModule('ai_assistant')}
                      className={`flex flex-col items-center gap-0.5 ${
                        activeModule === 'ai_assistant' ? 'text-emerald-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Quiz</span>
                    </button>
                  </div>

                  {/* Phone Home Indicator Bar */}
                  <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FEATURE LABELS COLUMN (Desktop) */}
          <div className="lg:col-span-3 space-y-3.5 order-3">
            {modulesList.slice(4, 7).map((m) => {
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
                      {m.featureDesc}
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

