import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Layers, ShieldCheck, Zap } from 'lucide-react';

interface Stage {
  id: string;
  phaseNumber: string;
  title: string;
  subtitle: string;
  status: 'Deployed' | 'In Progress' | 'Planned' | 'Future Horizon';
  details: string[];
}

export const AiRoadmapSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages: Stage[] = [
    {
      id: 'stage-1',
      phaseNumber: 'STAGE 01',
      title: 'Foundation',
      subtitle: 'Core Infrastructure & Data Unification',
      status: 'Deployed',
      details: [
        'Unified ERP data schema across fee, attendance, and academics',
        'Secure multi-tenant Cloud Run containers with encrypted data boundaries',
        'Role-based permissions and instant WhatsApp notification gateways',
      ],
    },
    {
      id: 'stage-2',
      phaseNumber: 'STAGE 02',
      title: 'Connected Campus',
      subtitle: 'Real-time Stakeholder Synchronization',
      status: 'Deployed',
      details: [
        'Biometric RFID gate sync with live parent entry/exit alerts',
        'Direct teacher-parent communication without personal phone exposure',
        '1-click digital fee receipts and instant attendance roll calls',
      ],
    },
    {
      id: 'stage-3',
      phaseNumber: 'STAGE 03',
      title: 'Intelligent Automation',
      subtitle: 'Assisted Workflows & Time Saving',
      status: 'In Progress',
      details: [
        'Automated NEP 2020 lesson outline generation for educators',
        'Smart fee defaulter reminders with scheduled payment links',
        'Automated gradebook comment summaries for report cards',
      ],
    },
    {
      id: 'stage-4',
      phaseNumber: 'STAGE 04',
      title: 'Responsible AI',
      subtitle: 'Privacy First & Governance Framework',
      status: 'Planned',
      details: [
        'Strict zero-data retention agreements with model providers',
        'Human-in-the-loop verification for all AI suggestions',
        'Explainable learning analytics for principal oversight',
      ],
    },
    {
      id: 'stage-5',
      phaseNumber: 'STAGE 05',
      title: 'Future Learning Ecosystem',
      subtitle: 'Adaptive Learning & Continuous Innovation',
      status: 'Future Horizon',
      details: [
        'Personalized student practice paths based on exam performance',
        'Multi-lingual broadcast capabilities for diverse parent communities',
        'Predictive operational cashflow forecasting for decision makers',
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-20 sm:py-28 bg-[#06151B] relative overflow-hidden border-t border-slate-800/60">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            STRATEGIC ROADMAP
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4">
            AI Implementation <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Roadmap.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Our AI journey is being introduced progressively through carefully planned phases of innovation.
          </p>
        </div>

        {/* DESKTOP TIMELINE (Horizontal Line with Active Nodes) */}
        <div className="hidden md:block mb-12">
          <div className="relative flex items-center justify-between max-w-5xl mx-auto px-8">
            {/* Thin Glowing Line Behind */}
            <div className="absolute left-12 right-12 top-6 h-[2px] bg-slate-800 z-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
              />
            </div>

            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              const isPassed = activeStage >= idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  {/* Glowing Node Button */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono-code font-bold text-xs transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-950 border-emerald-400 text-emerald-400 shadow-[0_0_25px_rgba(0,200,150,0.6)] scale-110 ring-4 ring-emerald-500/20'
                        : isPassed
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    0{idx + 1}
                  </div>

                  {/* Node Label Below */}
                  <div className="mt-3 text-center">
                    <div
                      className={`text-xs font-bold font-display transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono-code mt-0.5">
                      {stage.status}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE TIMELINE CONTROLS (Horizontal scroll pills) */}
        <div className="block md:hidden mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max px-2">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-400 text-slate-950 shadow-lg'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  0{idx + 1}. {stage.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STAGE DETAIL CARD */}
        <div className="max-w-4xl mx-auto glass-panel border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono-code font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  {stages[activeStage].phaseNumber}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Status: <span className="text-emerald-300 font-mono-code">{stages[activeStage].status}</span>
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                {stages[activeStage].title}
              </h3>
              <p className="text-sm text-slate-300 font-medium">
                {stages[activeStage].subtitle}
              </p>
            </div>

            {/* Stage Progress Indicator */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-mono-code">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stage {activeStage + 1} of 5</span>
            </div>
          </div>

          {/* Phase Deliverables Checklist */}
          <div className="mt-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Strategic Phase Objectives:
            </div>
            {stages[activeStage].details.map((detail, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-200 leading-relaxed font-medium">{detail}</span>
              </div>
            ))}
          </div>

          {/* Navigation Next Stage Trigger */}
          <div className="mt-8 pt-4 flex justify-between items-center border-t border-slate-800 text-xs">
            <button
              onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : prev))}
              disabled={activeStage === 0}
              className="text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 font-bold"
            >
              ← Previous Phase
            </button>
            <button
              onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev))}
              disabled={activeStage === stages.length - 1}
              className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:hover:text-emerald-400 font-bold flex items-center gap-1"
            >
              <span>Next Strategic Phase</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
