import React, { useState, useEffect, useRef } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import {
  UserCheck,
  CreditCard,
  UserPlus,
  BookOpen,
  Bus,
  Calendar,
  Calculator,
  MessageSquare,
  FileText,
  Users,
  GraduationCap,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Unplug,
  Zap,
  CheckCircle2,
  XCircle,
  Building2,
} from 'lucide-react';

interface ElementNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  chaosLabel: string;
  // Percentage coordinates relative to canvas center
  organized: { x: number; y: number };
  chaos: { x: number; y: number; rotate: number };
}

export const ScrollModules: React.FC = () => {
  const [chaosLevel, setChaosLevel] = useState<number>(100); // 0 = fully organized, 100 = full chaos
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [direction, setDirection] = useState<'increasing' | 'decreasing'>('increasing');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto-playing animation loop smoothly transitioning between organized and chaos
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setChaosLevel((prev) => {
        if (prev >= 100) {
          setDirection('decreasing');
          return 98;
        } else if (prev <= 0) {
          setDirection('increasing');
          return 2;
        }
        return direction === 'increasing' ? prev + 1.5 : prev - 1.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, direction]);

  // Operational Elements Data
  const elements: ElementNode[] = [
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#00C896',
      chaosLabel: 'Unsynced Logs',
      organized: { x: 30, y: 20 },
      chaos: { x: 10, y: 8, rotate: -20 },
    },
    {
      id: 'fees',
      label: 'Fees',
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#38BDF8',
      chaosLabel: 'Tally Mismatch',
      organized: { x: 50, y: 14 },
      chaos: { x: 50, y: 4, rotate: 15 },
    },
    {
      id: 'admissions',
      label: 'Admissions',
      icon: <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#F59E0B',
      chaosLabel: 'Dropped Leads',
      organized: { x: 70, y: 20 },
      chaos: { x: 90, y: 10, rotate: 24 },
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#A855F7',
      chaosLabel: 'Lost Diaries',
      organized: { x: 80, y: 38 },
      chaos: { x: 94, y: 44, rotate: -28 },
    },
    {
      id: 'transport',
      label: 'Transport',
      icon: <Bus className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#EC4899',
      chaosLabel: 'No Live GPS',
      organized: { x: 76, y: 62 },
      chaos: { x: 88, y: 88, rotate: 32 },
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#6366F1',
      chaosLabel: 'Clash Errors',
      organized: { x: 62, y: 80 },
      chaos: { x: 68, y: 95, rotate: -18 },
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#10B981',
      chaosLabel: 'Excel Silo',
      organized: { x: 38, y: 80 },
      chaos: { x: 30, y: 94, rotate: 22 },
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#06B6D4',
      chaosLabel: 'SMS Delayed',
      organized: { x: 20, y: 62 },
      chaos: { x: 6, y: 82, rotate: -35 },
    },
    {
      id: 'circulars',
      label: 'Circulars',
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#F43F5E',
      chaosLabel: 'Unread Notice',
      organized: { x: 18, y: 38 },
      chaos: { x: 5, y: 38, rotate: 28 },
    },
    {
      id: 'parents',
      label: 'Parents',
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#8B5CF6',
      chaosLabel: 'Support Calls',
      organized: { x: 34, y: 50 },
      chaos: { x: 18, y: 60, rotate: -22 },
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: '#EAB308',
      chaosLabel: 'Overburdened',
      organized: { x: 66, y: 50 },
      chaos: { x: 80, y: 64, rotate: 19 },
    },
  ];

  // Helper to interpolate between organized (0) and chaos (100)
  const getPosition = (el: ElementNode) => {
    const factor = chaosLevel / 100;
    const x = el.organized.x + (el.chaos.x - el.organized.x) * factor;
    const y = el.organized.y + (el.chaos.y - el.organized.y) * factor;
    const rotate = el.chaos.rotate * factor;
    return { x, y, rotate };
  };

  const isHighChaos = chaosLevel > 50;

  return (
    <section id="modules" className="py-20 sm:py-28 bg-slate-950 relative overflow-hidden" ref={sectionRef}>
      {/* Background ambient lighting */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 ${
          isHighChaos ? 'bg-red-500/10' : 'bg-emerald-500/15'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Scene Indicator & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-4 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SCHOOL CHAOS
          </div>

          {/* Main Headline as requested */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display mb-4 leading-tight">
            Running a School <br className="hidden sm:inline" />
            <span className={isHighChaos ? 'text-red-400 drop-shadow-[0_0_20px_rgba(248,113,113,0.3)]' : 'text-emerald-400'}>
              Shouldn't Feel Like Managing Chaos.
            </span>
          </h2>

          {/* Supporting Copy as requested */}
          <p className="text-slate-300 text-base sm:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Every department works. <br />
            <span className="text-slate-400 font-normal">But nothing works together.</span>
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="max-w-2xl mx-auto mb-8 p-3 sm:p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-2 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Motion' : 'Auto Play'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setChaosLevel(chaosLevel < 50 ? 100 : 0);
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition text-xs font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-teal-400" />
              <span>{chaosLevel < 50 ? 'Break Connections' : 'Restore Order'}</span>
            </button>
          </div>

          {/* Scrubber Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 sm:max-w-xs">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${!isHighChaos ? 'text-emerald-400' : 'text-slate-500'}`}>
              Organized
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={chaosLevel}
              onChange={(e) => {
                setIsPlaying(false);
                setChaosLevel(Number(e.target.value));
              }}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isHighChaos ? 'text-red-400' : 'text-slate-500'}`}>
              Chaos
            </span>
          </div>
        </div>

        {/* Dynamic Storytelling Canvas */}
        <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl glass-panel border border-slate-800/80 overflow-hidden shadow-2xl p-4 sm:p-8 flex items-center justify-center">
          {/* Canvas SVG Connecting Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {elements.map((el) => {
              const pos = getPosition(el);
              const isDisconnected = chaosLevel > 40;

              return (
                <g key={el.id}>
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${pos.x}%`}
                    y2={`${pos.y}%`}
                    stroke={isDisconnected ? '#EF4444' : el.color}
                    strokeWidth={isDisconnected ? '1.5' : '2'}
                    strokeDasharray={isDisconnected ? '4,6' : '6,4'}
                    opacity={isDisconnected ? Math.max(0.2, 1 - chaosLevel / 110) : 0.6}
                    className="transition-all duration-300"
                  />
                  {/* Cable pulse node when organized */}
                  {!isDisconnected && (
                    <circle
                      r="3"
                      fill={el.color}
                      className="animate-ping"
                      style={{
                        cx: `${50 + (pos.x - 50) * 0.5}%`,
                        cy: `${50 + (pos.y - 50) * 0.5}%`,
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* CENTER: Hero School Ecosystem Campus Node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
            <div
              className={`p-5 sm:p-7 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center ${
                isHighChaos
                  ? 'glass-panel border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.25)] bg-slate-950/90'
                  : 'glass-panel border-2 border-emerald-400/80 shadow-[0_0_50px_rgba(0,200,150,0.3)] bg-slate-900/95'
              }`}
            >
              {/* Smaller Hero Logo centered at school campus */}
              <div className="mb-2 transition-transform duration-500 hover:scale-105">
                <EduSphereLogo size="sm" showText={false} variant="gradient" />
              </div>

              {/* Abstract Campus Graphic */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-bold text-white mb-1">
                <Building2 className={`w-3.5 h-3.5 ${isHighChaos ? 'text-red-400' : 'text-emerald-400'}`} />
                <span>Central Campus</span>
              </div>

              {/* Status Indicator Tag */}
              <div
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isHighChaos
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isHighChaos ? 'Connections Breaking' : 'Unified Ecosystem'}
              </div>
            </div>
          </div>

          {/* FLOATING OPERATIONAL ELEMENTS */}
          {elements.map((el) => {
            const pos = getPosition(el);
            const isDisconnected = chaosLevel > 45;

            return (
              <div
                key={el.id}
                className="absolute z-20 transition-all duration-300 ease-out"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                }}
              >
                <div
                  className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap shadow-xl ${
                    isDisconnected
                      ? 'glass-panel border-red-500/40 bg-slate-950/90 text-slate-300 shadow-red-950/30'
                      : 'glass-panel-light border-slate-700/80 bg-slate-900/90 text-white shadow-emerald-950/20'
                  }`}
                  style={{
                    borderColor: isDisconnected ? 'rgba(239, 68, 68, 0.4)' : `${el.color}60`,
                  }}
                >
                  {/* Element Icon */}
                  <div
                    className="p-1.5 sm:p-2 rounded-xl shrink-0"
                    style={{
                      backgroundColor: isDisconnected ? 'rgba(239, 68, 68, 0.15)' : `${el.color}20`,
                      color: isDisconnected ? '#F87171' : el.color,
                    }}
                  >
                    {el.icon}
                  </div>

                  {/* Element Name & Chaos Status */}
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-white leading-tight">{el.label}</div>
                    <div
                      className={`text-[9px] sm:text-[10px] font-semibold ${
                        isDisconnected ? 'text-red-400 font-mono-code' : 'text-slate-400'
                      }`}
                    >
                      {isDisconnected ? `⚠️ ${el.chaosLabel}` : 'Connected'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Context Banner */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 shrink-0 mt-0.5">
              <Unplug className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Uncoordinated Department Silos</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When attendance, transport, and fees live in standalone apps or spreadsheets, staff waste hours manually syncing data across broken systems.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">The EduSphere Solution</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                EduSphere binds every operational element into a single live engine — eliminating manual data reentry and restoring peace to school leadership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
