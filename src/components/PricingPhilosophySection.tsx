import React, { useState } from 'react';
import { Users, GraduationCap, Building2, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

export const PricingPhilosophySection: React.FC = () => {
  // Step 0: 1 student, 1: 10 students, 2: 100 students, 3: 500 students, 4: Entire School
  const [scaleStep, setScaleStep] = useState<number>(2);

  const scaleLevels = [
    { label: '1 Student', count: '1', desc: 'Single Monthly Student Fee Equivalent' },
    { label: '10 Students', count: '10', desc: 'Small Pre-School Cohort' },
    { label: '100 Students', count: '100', desc: 'Primary School Campus' },
    { label: '500 Students', count: '500', desc: 'Comprehensive K-12 Institution' },
    { label: 'Entire School', count: '1,280+', desc: 'Complete Unified Connected Ecosystem' },
  ];

  return (
    <section id="pricing-philosophy" className="py-24 sm:py-32 bg-[#06151B] relative overflow-hidden border-t border-slate-800/80">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          PRICING PHILOSOPHY
        </div>

        {/* Dynamic Scale Sequence Visualizer (Roadmap collapses into glowing point -> student growth) */}
        <div className="mb-12 max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl glass-panel border border-slate-800 shadow-2xl relative overflow-hidden">
          
          {/* Glowing Point / Student Avatar Sequence */}
          <div className="flex flex-col items-center justify-center min-h-[220px] relative">
            
            {/* Glowing Point Center */}
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 p-1 shadow-[0_0_60px_rgba(0,200,150,0.6)] flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl sm:text-3xl">
                  {scaleStep === 0 && '🎒'}
                  {scaleStep === 1 && '🎒👧'}
                  {scaleStep === 2 && '🏫'}
                  {scaleStep === 3 && '🎓'}
                  {scaleStep === 4 && '🏛️'}
                </div>
              </div>
              <div className="absolute -inset-2 rounded-full border border-emerald-400/40 animate-ping pointer-events-none" />
            </div>

            {/* Scale Count Typography */}
            <div className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight mb-2">
              {scaleLevels[scaleStep].count} {scaleStep === 4 ? '' : scaleStep === 0 ? 'Student' : 'Students'}
            </div>

            <div className="text-xs sm:text-sm text-emerald-400 font-mono-code uppercase tracking-widest font-bold">
              {scaleLevels[scaleStep].desc}
            </div>
          </div>

          {/* Interactive Scale Controls */}
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-800/80 overflow-x-auto">
            {scaleLevels.map((lvl, idx) => (
              <button
                key={idx}
                onClick={() => setScaleStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  scaleStep === idx
                    ? 'bg-emerald-400 text-slate-950 font-extrabold shadow-md scale-105'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* HIGHLY TYPOGRAPHIC HEADLINE & STATEMENT */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight leading-[1.1]">
            The Average Monthly Fee <br className="hidden sm:inline" />
            of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">One Student</span> <br />
            Powers Your School Management System.
          </h2>

          <div className="pt-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-200 font-display tracking-tight">
              We Grow When Your School Grows.
            </span>
          </div>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed pt-2">
            Fair, transparent, and scalable institutional partnership. No hidden setup fees, no per-module lock-ins—just a predictable model aligned with student enrollment.
          </p>
        </div>

      </div>
    </section>
  );
};
