import React from 'react';

interface ApexLogoProps {
  className?: string;
  size?: number;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({ className = '', size = 42 }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl overflow-hidden bg-[#060F0F] border border-[#1E7A72]/40 shadow-[0_0_24px_rgba(30,122,114,0.35)] ${className}`}
      style={{ width: size, height: size }}
      id="apex-brand-logo"
    >
      {/* Top-left cyan-green glow as specified in visual identity */}
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-[#7FDCCE]/30 blur-md pointer-events-none" />

      {/* Three parallel geometric diagonal stripes with gradient from dark teal to light mint */}
      <svg
        viewBox="0 0 100 100"
        className="w-4/5 h-4/5 transform -rotate-12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="apexGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0E5845" />
            <stop offset="50%" stopColor="#1E7A72" />
            <stop offset="100%" stopColor="#7FDCCE" />
          </linearGradient>
        </defs>
        {/* Stripe 1 */}
        <rect x="16" y="18" width="14" height="64" rx="7" fill="url(#apexGradient)" />
        {/* Stripe 2 (longer middle stripe) */}
        <rect x="42" y="12" width="14" height="76" rx="7" fill="url(#apexGradient)" />
        {/* Stripe 3 */}
        <rect x="68" y="24" width="14" height="58" rx="7" fill="url(#apexGradient)" />
      </svg>
    </div>
  );
};
