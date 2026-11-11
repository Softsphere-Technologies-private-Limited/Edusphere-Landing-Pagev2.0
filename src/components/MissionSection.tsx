import React from 'react';
import { CheckCircle2, Heart, Sparkles } from 'lucide-react';

export const MissionSection: React.FC = () => {
  const missionPoints = [
    'Every teacher deserves AI that empowers them.',
    'Every school deserves access to innovation.',
    'Every child deserves the opportunity to become AI-ready.',
  ];

  return (
    <section id="mission" className="py-24 sm:py-32 bg-[#06151B] text-slate-100 relative overflow-hidden border-t border-slate-800/80 transition-colors duration-1000">
      {/* Soft dark green glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-6">
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
          OUR MISSION
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight leading-[1.15] mb-12">
          Democratizing Responsible AI <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">for Every School.</span>
        </h2>

        {/* Sequential Mission Statements with Checks */}
        <div className="space-y-4 max-w-2xl mx-auto text-left mb-12">
          {missionPoints.map((point, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl glass-panel border border-slate-800 shadow-xl flex items-start gap-4 transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/80"
            >
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white font-display leading-snug">
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* Small Note */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto leading-relaxed pt-2">
          Our AI journey is being introduced progressively through carefully planned phases of innovation.
        </p>

      </div>
    </section>
  );
};
