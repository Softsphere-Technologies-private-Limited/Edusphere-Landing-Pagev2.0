import React, { useEffect, useRef, useState } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import {
  ArrowRight,
  Linkedin,
  Facebook,
  Instagram,
  ShieldCheck,
} from 'lucide-react';

interface CtaFooterProps {
  onOpenDemoModal?: () => void;
  onOpenLeadsDashboard?: () => void;
}

export const CtaFooter: React.FC<CtaFooterProps> = ({ onOpenDemoModal, onOpenLeadsDashboard }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [logoVisible, setLogoVisible] = useState(false);

  // Trigger smooth reveal of central logo on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Converging Particle Field Canvas Simulation
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

    // Target focal point (Logo area in upper third of section)
    const targetX = width / 2;
    const targetY = height * 0.32;

    // Create 45 converging particles
    const particleCount = 45;
    interface Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      angle: number;
    }

    const particles: Particle[] = [];

    const resetParticle = (p: Partial<Particle> = {}): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (width * 0.45) + 200;
      return {
        x: p.x ?? targetX + Math.cos(angle) * distance,
        y: p.y ?? targetY + Math.sin(angle) * distance,
        radius: Math.random() * 1.8 + 1,
        speed: Math.random() * 0.35 + 0.15, // Slow calm movement
        opacity: Math.random() * 0.5 + 0.2,
        angle,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(resetParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentTargetX = width / 2;
      const currentTargetY = height * 0.32;

      particles.forEach((p) => {
        // Calculate direction towards focal target
        const dx = currentTargetX - p.x;
        const dy = currentTargetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 35) {
          // Re-spawn near outer perimeter when reaching the logo source
          const newP = resetParticle();
          p.x = newP.x;
          p.y = newP.y;
          p.speed = newP.speed;
          p.opacity = newP.opacity;
        } else {
          // Slowly converge inward towards target
          p.x += (dx / dist) * p.speed;
          p.y += (dy / dist) * p.speed;
        }

        // Draw particle with emerald glow
        ctx.fillStyle = `rgba(32, 180, 134, ${p.opacity * (dist < 120 ? dist / 120 : 1)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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
    <footer id="contact" className="relative bg-[#06151B] text-slate-300 pt-28 pb-12 overflow-hidden border-t border-slate-800/80">
      {/* Canvas Animated Converging Particle Field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70" />

      {/* Extremely subtle ambient glow around center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#20B486]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ==================== FINAL CINEMATIC CTA ==================== */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-6 pb-24">
          
          {/* Official Edusphere Logo with Opacity + Scale + Blur reveal */}
          <div
            className={`mb-8 transform transition-all duration-1000 ease-out ${
              logoVisible ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
            }`}
          >
            <EduSphereLogo size="lg" variant="gradient" />
          </div>

          {/* Large Centered Headline */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight leading-[1.1] mb-6">
            Ready to Build <br />
            What's <span className="text-[#20B486]">Next?</span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-[600px] mx-auto leading-relaxed mb-10">
            Bring your school into a smarter, more connected future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full sm:w-auto">
            {/* Primary CTA: Book a Demo */}
            <button
              onClick={onOpenDemoModal}
              className="group w-full sm:w-auto px-8 py-4 bg-[#20B486] hover:bg-[#1ca177] text-white font-extrabold text-base rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(32,180,134,0.35)] cursor-pointer flex items-center justify-center gap-2.5"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>

            {/* Secondary CTA: Talk to Our Team */}
            <a
              href="https://wa.me/918742935355?text=Hello%20EduSphere%20Team,%20I%20would%20like%20to%20talk%20to%20your%20team."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-700 hover:border-[#20B486] hover:bg-[#20B486]/10 text-slate-200 hover:text-white font-bold text-base rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Talk to Our Team
            </a>
          </div>

          {/* Brand Statement / Philosophy */}
          <div className="text-xs sm:text-sm text-slate-400 font-mono-code font-medium uppercase tracking-[0.2em]">
            "We grow when your school grows."
          </div>
        </div>

        {/* ==================== MINIMAL FOOTER ==================== */}
        <div className="pt-16 pb-12 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Left Brand Identity */}
          <div className="md:col-span-4 space-y-3">
            <EduSphereLogo size="md" variant="gradient" />
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs pt-1">
              Bharat's Next Generation School Platform.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://www.linkedin.com/company/edusphere-bharat/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#20B486] hover:border-[#20B486]/50 transition-all cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/eduspherebharat/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#20B486] hover:border-[#20B486]/50 transition-all cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/eduspherebharat"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#20B486] hover:border-[#20B486]/50 transition-all cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Minimal Links Columns (4 Groups) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
            {/* PLATFORM */}
            <div>
              <h4 className="font-extrabold uppercase tracking-wider text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><a href="#download-app" className="hover:text-[#20B486] transition font-bold text-emerald-400">Mobile Apps</a></li>
                <li><a href="#roles" className="hover:text-[#20B486] transition">Principal Suite</a></li>
                <li><a href="#features" className="hover:text-[#20B486] transition">Teachers App</a></li>
                <li><a href="#casestudy" className="hover:text-[#20B486] transition">Parent Portal</a></li>
                <li><a href="#modules" className="hover:text-[#20B486] transition">ERP Modules</a></li>
              </ul>
            </div>

            {/* PRODUCT */}
            <div>
              <h4 className="font-extrabold uppercase tracking-wider text-white mb-3">Product</h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><a href="#impact" className="hover:text-[#20B486] transition">Impact Stats</a></li>
                <li><a href="#ai-future" className="hover:text-[#20B486] transition">AI Capabilities</a></li>
                <li><a href="#roadmap" className="hover:text-[#20B486] transition">AI Roadmap</a></li>
                <li><a href="#pricing-philosophy" className="hover:text-[#20B486] transition">Pricing Model</a></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="font-extrabold uppercase tracking-wider text-white mb-3">Company</h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><a href="#mission" className="hover:text-[#20B486] transition">Our Mission</a></li>
                <li><a href="#contact" className="hover:text-[#20B486] transition">Contact Us</a></li>
                <li>
                  <button onClick={onOpenDemoModal} className="hover:text-[#20B486] transition text-left cursor-pointer">
                    Book Walkthrough
                  </button>
                </li>
                {onOpenLeadsDashboard && (
                  <li>
                    <button
                      onClick={onOpenLeadsDashboard}
                      className="text-emerald-400 font-bold hover:text-emerald-300 transition text-left cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Login</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* RESOURCES & LEGAL */}
            <div>
              <h4 className="font-extrabold uppercase tracking-wider text-white mb-3">Support</h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><a href="mailto:support@edusphere.in" className="hover:text-[#20B486] transition">Help Desk</a></li>
                <li><a href="#contact" className="hover:text-[#20B486] transition">Privacy Policy</a></li>
                <li><a href="#contact" className="hover:text-[#20B486] transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* ==================== BOTTOM BAR ==================== */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>© 2026 Edusphere. All rights reserved.</div>
          <div className="font-medium text-slate-500">Built for the future of education.</div>
        </div>

      </div>
    </footer>
  );
};
