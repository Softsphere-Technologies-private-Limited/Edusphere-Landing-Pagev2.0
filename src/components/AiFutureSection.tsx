import React, { useState, useEffect, useRef } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import {
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Radio,
  Layers,
  Zap,
} from 'lucide-react';

export const AiFutureSection: React.FC = () => {
  const [isDissolved, setIsDissolved] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

  // Neural Canvas Reference for particle connections
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleReplayDissolve = () => {
    setIsAnimating(true);
    setIsDissolved(false);
    setTimeout(() => {
      setIsDissolved(true);
      setIsAnimating(false);
    }, 1200);
  };

  // Canvas-based neural particles background simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate neural nodes
    const nodeCount = 38;
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; opacity: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2, // Upward bias
        radius: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    // Render neural core loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = `rgba(0, 200, 150, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.y < 0) node.y = height;
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;

        ctx.fillStyle = index % 3 === 0 ? `rgba(0, 200, 150, ${node.opacity})` : `rgba(56, 189, 248, ${node.opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="ai-future" className="relative overflow-hidden transition-colors duration-1000">
      {/* EduSphere Brand Deep Navy/Teal Background (#06151B) */}
      <div className="w-full bg-[#06151B] pt-24 pb-32 text-slate-100 relative border-t border-slate-800/60">
        
        {/* Subtle Ambient Atmosphere Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[200px] pointer-events-none" />

        {/* Neural Connections Interactive Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Sub-header Pill */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              INTELLIGENT ECOSYSTEM LAYER
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display mb-4 leading-tight">
              The Future of School Management <br className="hidden sm:inline" />
              is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Intelligent.</span>
            </h2>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Our AI journey is being introduced progressively through carefully planned phases of innovation.
            </p>
          </div>

          {/* Interactive Dissolve Stage & Abstract AI Core Visualization */}
          <div className="relative w-full max-w-4xl mx-auto my-12 rounded-3xl glass-panel border border-slate-800/80 p-8 sm:p-12 shadow-[0_0_90px_rgba(0,200,150,0.12)] flex flex-col items-center justify-center overflow-hidden">
            
            {/* Control Button to Replay Dissolve Effect */}
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={handleReplayDissolve}
                disabled={isAnimating}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isDissolved ? 'Replay App Dissolve' : 'Dissolving Phone into AI Core...'}</span>
              </button>
            </div>

            {/* ABSTRACT NEURAL CORE GRAPHIC CONTAINER */}
            <div className="relative w-full min-h-[380px] flex items-center justify-center">
              
              {/* STAGE A: PHONE DISSOLVING INTO PARTICLES */}
              {!isDissolved && (
                <div className="relative w-56 h-96 rounded-[36px] border-2 border-emerald-400/60 bg-slate-900/80 flex flex-col items-center justify-center p-4 animate-pulse shadow-2xl transition-all duration-1000">
                  <div className="text-xs font-mono-code text-emerald-300 uppercase tracking-widest text-center">
                    Phone Dissolving...
                  </div>
                  {/* Floating upward particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDuration: `${1 + i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STAGE B: ABSTRACT AI CORE (Soft Emerald Light, Deep Navy Depth, Restrained Glow) */}
              {isDissolved && (
                <div className="relative flex flex-col items-center justify-center text-center transition-all duration-1000">
                  
                  {/* Outer Concentric Neural Rings */}
                  <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border border-emerald-500/20 animate-spin-slow pointer-events-none" />
                  <div className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full border border-cyan-500/20 animate-reverse-spin pointer-events-none" />

                  {/* Central Abstract Glowing Intelligence Sphere */}
                  <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-[#06151B] border-2 border-emerald-400/80 shadow-[0_0_80px_rgba(0,200,150,0.35)] flex flex-col items-center justify-center p-6 group cursor-pointer transition-all duration-500 hover:scale-105">
                    <EduSphereLogo size="lg" showText={true} variant="gradient" />
                    
                    <span className="mt-3 text-[10px] font-mono-code font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      INTELLIGENT LAYER
                    </span>
                  </div>

                  {/* Subtle Node Orbit Indicators */}
                  <div className="mt-8 flex items-center justify-center gap-6 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono-code">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Progressive Rollout</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono-code">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Enterprise Security</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Confidential Guarantee Note */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center max-w-lg">
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Designed to naturally complement administrative workflows without disruption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
