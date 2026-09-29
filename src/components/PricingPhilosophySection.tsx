import React, { useState } from 'react';
import {
  School,
  Building2,
  Building,
  Landmark,
  Castle,
  Network,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Users,
  Check,
  ChevronRight,
  DollarSign,
} from 'lucide-react';

export interface SubscriptionTier {
  id: string;
  name: string;
  studentRange: string;
  price: string;
  period?: string;
  gstNote?: string;
  isCustom?: boolean;
  idealFor: string;
  description: string;
  badge?: string;
  ctaText: string;
  ctaType: 'standard' | 'custom';
  icon: React.ComponentType<{ className?: string }>;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'STARTER',
    studentRange: '1 – 500 Students',
    price: '₹2,199',
    period: '/ month',
    gstNote: 'Exclusive of GST',
    idealFor: 'Small Schools',
    description: 'Perfect for schools taking the first step towards digital transformation.',
    badge: 'STARTER',
    ctaText: 'Get Started',
    ctaType: 'standard',
    icon: School,
  },
  {
    id: 'growing',
    name: 'GROWING SCHOOL',
    studentRange: '501 – 1,000 Students',
    price: '₹3,199',
    period: '/ month',
    gstNote: 'Exclusive of GST',
    idealFor: 'Growing Schools',
    description: 'Better processes today to streamline operations and scale efficiently.',
    ctaText: 'Get Started',
    ctaType: 'standard',
    icon: Building,
  },
  {
    id: 'expanding',
    name: 'EXPANDING SCHOOL',
    studentRange: '1,001 – 1,500 Students',
    price: '₹3,699',
    period: '/ month',
    gstNote: 'Exclusive of GST',
    idealFor: 'Expanding Schools',
    description: 'For schools expanding programs, infrastructure, and student reach.',
    ctaText: 'Get Started',
    ctaType: 'standard',
    icon: Building2,
  },
  {
    id: 'established',
    name: 'ESTABLISHED SCHOOL',
    studentRange: '1,501 – 2,000 Students',
    price: '₹4,199',
    period: '/ month',
    gstNote: 'Exclusive of GST',
    idealFor: 'Established Schools',
    description: 'Empowering established schools with advanced management and automation.',
    ctaText: 'Get Started',
    ctaType: 'standard',
    icon: Landmark,
  },
  {
    id: 'large',
    name: 'LARGE SCHOOL',
    studentRange: '2,001 – 2,500 Students',
    price: '₹4,699',
    period: '/ month',
    gstNote: 'Exclusive of GST',
    idealFor: 'Large Schools',
    description: 'Designed to manage complex operations with ease and complete visibility.',
    ctaText: 'Get Started',
    ctaType: 'standard',
    icon: Castle,
  },
  {
    id: 'institutions',
    name: 'INSTITUTIONS & SCHOOL CHAINS',
    studentRange: '2,500+ Students / Multi-Campus',
    price: 'Custom Pricing',
    period: '',
    gstNote: 'Enterprise SLA & Multi-Branch Setup',
    isCustom: true,
    idealFor: 'Institutions & School Chains',
    description: 'Tailored solutions for large institutions and school networks.',
    ctaText: "Let's Talk",
    ctaType: 'custom',
    icon: Network,
  },
];

const VALUE_PROPOSITIONS = [
  {
    title: 'Affordable',
    subtitle: 'High value, low complexity',
    icon: CheckCircle2,
  },
  {
    title: 'Scalable',
    subtitle: 'Grows with your school',
    icon: TrendingUp,
  },
  {
    title: 'Transparent',
    subtitle: 'No hidden costs',
    icon: ShieldCheck,
  },
  {
    title: 'Future Ready',
    subtitle: "Built for what's next",
    icon: Zap,
  },
];

interface PricingPhilosophySectionProps {
  onOpenDemoModal?: () => void;
}

export const PricingPhilosophySection: React.FC<PricingPhilosophySectionProps> = ({ onOpenDemoModal }) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('starter');

  const handleCtaClick = (tier: SubscriptionTier, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (tier.ctaType === 'custom') {
      // WhatsApp sales link for custom multi-campus
      window.open(
        'https://wa.me/918742935355?text=Hello%20EduSphere%20Team,%20I%20am%20interested%20in%20custom%20pricing%20for%20our%20multi-campus%20institution.',
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      if (onOpenDemoModal) {
        onOpenDemoModal();
      }
    }
  };

  const selectedTier = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTierId) || SUBSCRIPTION_TIERS[0];

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 bg-[#06151B] relative overflow-hidden border-t border-slate-800/80 scroll-mt-12"
    >
      {/* Anchor for backward compatibility with #pricing-philosophy */}
      <span id="pricing-philosophy" className="absolute -top-20" aria-hidden="true" />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.25em] text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            OUR SUBSCRIPTION
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.15]">
            Simple Plans.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Bigger Possibilities.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Flexible monthly subscription plans designed for schools of every size.
          </p>
        </div>

        {/* ================= DESKTOP & TABLET: 3-COLUMN STRUCTURED PRICING TABLE ================= */}
        <div className="hidden md:block mb-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold font-mono uppercase tracking-widest text-slate-400">
              <div className="col-span-4 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Column 1: Number of Students</span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                <span>Column 2: Monthly Subscription</span>
              </div>
              <div className="col-span-5 flex items-center justify-between">
                <span>Column 3: Ideal For & Solution</span>
                <span className="text-[10px] text-slate-500 font-sans normal-case tracking-normal">Click any tier to select</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-800/80">
              {SUBSCRIPTION_TIERS.map((tier) => {
                const IconComponent = tier.icon;
                const isSelected = selectedTierId === tier.id;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`grid grid-cols-12 gap-4 px-8 py-5 items-center transition-all duration-300 cursor-pointer group ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/90 border-l-4 border-l-emerald-400 shadow-inner'
                        : 'hover:bg-slate-800/40 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* COLUMN 1: Student Range & Tier Name */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isSelected
                            ? 'bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(0,200,150,0.3)]'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-black tracking-wider uppercase font-mono ${
                              isSelected ? 'text-emerald-300' : 'text-slate-300 group-hover:text-white'
                            }`}
                          >
                            {tier.name}
                          </span>
                          {tier.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-full shadow-sm">
                              {tier.badge}
                            </span>
                          )}
                          {tier.isCustom && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                              Multi-Campus
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>{tier.studentRange}</span>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2: Monthly Subscription & GST */}
                    <div className="col-span-3">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-2xl font-black font-display tracking-tight ${
                            tier.isCustom
                              ? 'text-cyan-300 text-xl'
                              : isSelected
                              ? 'text-white'
                              : 'text-slate-100 group-hover:text-emerald-300'
                          }`}
                        >
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-xs font-semibold text-slate-400">
                            {tier.period}
                          </span>
                        )}
                      </div>
                      {tier.gstNote && (
                        <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                          {tier.gstNote}
                        </div>
                      )}
                    </div>

                    {/* COLUMN 3: Ideal For, Description & CTA */}
                    <div className="col-span-5 flex items-center justify-between gap-4">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700/60">
                            {tier.idealFor}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed truncate lg:whitespace-normal line-clamp-2">
                          {tier.description}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <button
                          onClick={(e) => handleCtaClick(tier, e)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md ${
                            tier.ctaType === 'custom'
                              ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
                              : isSelected
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:scale-105 shadow-emerald-500/25'
                              : 'bg-slate-800 text-slate-200 hover:bg-emerald-500 hover:text-slate-950 border border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          <span>{tier.ctaText}</span>
                          {tier.ctaType === 'custom' ? (
                            <PhoneCall className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= MOBILE: VERTICALLY STACKED CARDS ================= */}
        <div className="block md:hidden space-y-4 mb-12">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const IconComponent = tier.icon;
            const isSelected = selectedTierId === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-900/90 border-emerald-400 shadow-[0_0_25px_rgba(0,200,150,0.15)] ring-1 ring-emerald-400/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-400/20 border border-emerald-400/50 text-emerald-300'
                          : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-wider uppercase font-mono text-slate-200">
                          {tier.name}
                        </span>
                        {tier.badge && (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-full">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-emerald-400" />
                        <span>{tier.studentRange}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
                    {tier.idealFor}
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 my-3">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-2xl font-black font-display ${
                        tier.isCustom ? 'text-cyan-300 text-lg' : 'text-white'
                      }`}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-xs font-semibold text-slate-400">{tier.period}</span>
                    )}
                  </div>
                  {tier.gstNote && (
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                      {tier.gstNote}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {tier.description}
                </p>

                {/* Mobile CTA */}
                <button
                  onClick={(e) => handleCtaClick(tier, e)}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tier.ctaType === 'custom'
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  {tier.ctaType === 'custom' ? (
                    <PhoneCall className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ================= SELECTED PLAN HIGHLIGHT SUMMARY STRIP ================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16 shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">
                Selected Plan:{' '}
                <strong className="text-white font-mono uppercase">{selectedTier.name}</strong> ({selectedTier.studentRange})
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                {selectedTier.price} {selectedTier.period} • {selectedTier.idealFor}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={(e) => handleCtaClick(selectedTier, e)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{selectedTier.ctaText} with {selectedTier.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= BOTTOM VALUE PROPOSITION STRIP ================= */}
        <div className="pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {VALUE_PROPOSITIONS.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-start gap-2.5 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white tracking-tight">
                      {prop.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {prop.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
