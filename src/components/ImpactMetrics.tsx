import React, { useEffect, useState, useRef } from 'react';
import { Building2, Users, ShieldCheck, Star, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  isVisible: boolean;
}

const AnimatedCounterCard: React.FC<MetricCardProps> = ({
  label,
  targetValue,
  prefix = '',
  suffix = '',
  decimals = 0,
  description,
  icon,
  accentColor,
  isVisible,
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = easeOut * targetValue;
      
      setCurrentValue(val);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCurrentValue(targetValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, targetValue]);

  const formattedValue =
    decimals > 0
      ? currentValue.toFixed(decimals)
      : Math.floor(currentValue).toLocaleString('en-IN');

  return (
    <div className="relative group glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden glass-card-hover">
      {/* Background Accent Gradient Glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-center justify-between mb-6">
        <div
          className="p-3.5 rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
        >
          {icon}
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          Verified Stat
        </span>
      </div>

      <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter">
        <span style={{ color: accentColor }}>{prefix}</span>
        <span>{formattedValue}</span>
        <span style={{ color: accentColor }}>{suffix}</span>
      </div>

      <h3 className="text-base font-bold text-slate-100 mb-1">{label}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export const ImpactMetrics: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      label: 'Partner Schools Across Bharat',
      targetValue: 10,
      suffix: '+',
      description: 'Budget, CBSE, ICSE & State Board Schools running on EduSphere.',
      icon: <Building2 className="w-6 h-6" />,
      accentColor: '#00C896',
    },
    {
      label: 'Enrolled Active Students',
      targetValue: 500,
      suffix: '+',
      description: 'Students tracking attendance, report cards, and digital learning.',
      icon: <Users className="w-6 h-6" />,
      accentColor: '#38BDF8',
    },
    {
      label: 'Uptime & Data Security SLA',
      targetValue: 99.9,
      suffix: '%',
      decimals: 1,
      description: 'Hosted on multi-region AWS cloud infrastructure with automated backups.',
      icon: <ShieldCheck className="w-6 h-6" />,
      accentColor: '#10B981',
    },
    {
      label: 'Platform User Rating',
      targetValue: 4.8,
      suffix: ' / 5',
      decimals: 1,
      description: 'Based on 1,200+ verified school management & teacher reviews.',
      icon: <Star className="w-6 h-6" />,
      accentColor: '#EAB308',
    },
  ];

  return (
    <section id="impact" className="py-24 bg-slate-950 relative overflow-hidden" ref={sectionRef}>
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[#00C896] font-mono-code text-xs sm:text-sm tracking-[0.3em] uppercase font-bold mb-3 block">
            PROVEN QUANTIFIABLE IMPACT
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter font-display mb-4 uppercase">
            MEASURED AT <span className="text-stroke-emerald">NATIONWIDE SCALE</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Empowering school management, teachers, parents, and students with real-time intelligence and zero administrative friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <AnimatedCounterCard key={idx} {...stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};
