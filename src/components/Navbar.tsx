import React, { useState, useEffect } from 'react';
import { EduSphereLogo } from './EduSphereLogo';
import { PhoneCall, Calendar, Menu, X, ArrowRight, ShieldCheck, Database, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onOpenLeadsDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal, onOpenLeadsDashboard }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Impact', href: '#impact' },
    { name: 'Modules', href: '#modules' },
    { name: 'Roles', href: '#roles' },
    { name: 'Features', href: '#features' },
    { name: 'AI Future', href: '#ai-future' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Mobile App', href: '#download-app' },
    { name: 'Mission', href: '#mission' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 glass-panel border-b border-emerald-500/20 bg-slate-950/80 shadow-xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <EduSphereLogo size="md" animated variant="gradient" />
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel px-5 py-2 rounded-full border border-slate-700/60 bg-slate-900/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-[#00C896] rounded-full transition-colors hover:bg-slate-800/80"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenLeadsDashboard && (
              <button
                onClick={onOpenLeadsDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-full border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
                title="Admin Portal Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Login</span>
              </button>
            )}

            <a
              href="https://wa.me/918742935355?text=Hello%20EduSphere%20Team,%20I%20want%20to%20know%20more%20about%20the%20Smart%20School%20ERP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white glass-panel-light rounded-full border border-white/10 hover:border-[#00C896]/40 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#00C896]" />
              <span>Talk to Sales</span>
            </a>

            <button
              onClick={onOpenDemoModal}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white bg-[#00875A] hover:bg-[#00C896] rounded-full shadow-[0_0_15px_rgba(0,135,90,0.4)] hover:shadow-[0_0_25px_rgba(0,200,150,0.6)] transition-all duration-300 cursor-pointer group"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Live Demo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white glass-panel rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-panel border-b border-emerald-500/30 bg-slate-950/95 px-6 py-6 mt-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-200 hover:text-emerald-400 py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              {onOpenLeadsDashboard && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLeadsDashboard();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-300 bg-slate-900 border border-emerald-500/40 rounded-xl"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Login</span>
                </button>
              )}

              <a
                href="https://wa.me/918742935355"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-200 glass-panel-light rounded-xl"
              >
                <PhoneCall className="w-4 h-4 text-teal-400" />
                Call Sales (+91 87429 35355)
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemoModal();
                }}
                className="w-full py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Book Free Live Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
