import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  variant?: 'light' | 'dark' | 'gradient';
}

export const EduSphereLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  animated = false,
  variant = 'gradient',
}) => {
  const sizeClasses = {
    sm: { icon: 'w-10 h-10', textTitle: 'text-xl sm:text-2xl', textSub: 'text-[7.5px] sm:text-[8.5px]', tag: 'text-[7px] sm:text-[8px]' },
    md: { icon: 'w-12 h-12', textTitle: 'text-2xl sm:text-3xl', textSub: 'text-[9px] sm:text-[10px]', tag: 'text-[8px] sm:text-[9px]' },
    lg: { icon: 'w-16 h-16', textTitle: 'text-4xl', textSub: 'text-[12px]', tag: 'text-[11px]' },
    xl: { icon: 'w-24 h-24', textTitle: 'text-6xl', textSub: 'text-[16px]', tag: 'text-[14px]' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem matching attached official brand logo */}
      <div className={`relative ${sizeClasses.icon} shrink-0`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-lg ${animated ? 'transition-transform duration-500 hover:scale-105' : ''}`}
        >
          <defs>
            {/* Emerald-Green Gradient */}
            <linearGradient id="logoGreenGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="45%" stopColor="#00C896" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Dark Navy Cap & Book Base */}
            <linearGradient id="logoNavyGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. MORTARBOARD GRADUATION CAP (TOP) */}
          <g className={animated ? 'svg-cap' : ''}>
            {/* Diamond Top Cap */}
            <path
              d="M100 18 L168 44 L100 70 L32 44 Z"
              fill="url(#logoNavyGrad)"
              stroke="#00C896"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Cap Underband */}
            <path
              d="M62 58 L62 74 C62 82 138 82 138 74 L138 58"
              fill="url(#logoNavyGrad)"
            />
            {/* Tassel Button & Cord Hanging to the Right */}
            <circle cx="100" cy="44" r="3.5" fill="#00C896" />
            <path
              d="M100 44 C122 48 158 54 158 80 L158 92"
              fill="none"
              stroke="#00C896"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Tassel Droplet */}
            <path
              d="M158 92 C154 96 154 110 158 114 C162 110 162 96 158 92 Z"
              fill="url(#logoGreenGrad)"
            />
          </g>

          {/* 2. CIRCUIT TRACE NODES (LEFT SIDE OF E) */}
          <g stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Top Node Trace */}
            <path d="M72 80 L52 80 L42 70 L32 70" />
            <circle cx="28" cy="70" r="4" fill="#00C896" stroke="none" />

            {/* Middle Node Trace */}
            <path d="M68 100 L38 100" />
            <circle cx="32" cy="100" r="4" fill="#00C896" stroke="none" />

            {/* Bottom Node Trace */}
            <path d="M72 120 L52 120 L42 130 L32 130" />
            <circle cx="28" cy="130" r="4" fill="#00C896" stroke="none" />
          </g>

          {/* 3. CENTRAL HEXAGONAL 'E' EMBLEM */}
          <g>
            {/* Outer Hex 'E' Frame */}
            <path
              d="M98 62 L132 80 V98 L112 98 L112 106 L132 106 V124 L98 142 L68 124 V80 Z"
              fill="url(#logoGreenGrad)"
              filter="url(#logoGlow)"
            />
            {/* Inner Cutout forming the E shape */}
            <path
              d="M84 78 L122 92 V94 L96 94 V112 L122 112 V114 L84 128 Z"
              fill="#0F172A"
            />
            {/* Middle Floating Bar inside 'E' */}
            <rect
              x="88"
              y="97"
              width="22"
              height="8"
              rx="4"
              fill="url(#logoGreenGrad)"
            />
          </g>

          {/* 4. OPEN BOOK (BOTTOM BASE) */}
          <g>
            {/* Book Base Outer Cover */}
            <path
              d="M100 180 C72 162 38 166 22 172 C22 160 52 150 100 168 C148 150 178 160 178 172 C162 166 128 162 100 180 Z"
              fill="url(#logoNavyGrad)"
            />
            {/* Green Radiating Pages */}
            <path
              d="M100 174 C74 154 46 157 30 162 C38 152 72 146 100 160 C128 146 162 152 170 162 C154 157 126 154 100 174 Z"
              fill="url(#logoGreenGrad)"
            />
            <path
              d="M100 168 C78 150 52 152 38 156 C46 148 76 142 100 154 C124 142 154 148 162 156 C148 152 122 150 100 168 Z"
              fill="#A7F3D0"
              opacity="0.6"
            />
            {/* Center Spine */}
            <path d="M100 154 V180" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Brand Text Block */}
      {showText && (
        <div className="flex flex-col justify-center">
          {/* Main Title: EduSphere */}
          <div className="flex items-baseline leading-none">
            <span className={`font-display font-black tracking-tight ${sizeClasses.textTitle} ${
              variant === 'light' ? 'text-white' : variant === 'dark' ? 'text-slate-900' : 'text-white'
            }`}>
              Edu<span className="text-[#00C896]">Sphere</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
