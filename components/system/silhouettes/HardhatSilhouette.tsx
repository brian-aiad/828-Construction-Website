import { CSSProperties } from 'react';

export default function HardhatSilhouette({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Helmet dome */}
      <path
        d="M20 68 Q18 44 60 28 Q102 44 100 68"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Brim */}
      <line x1="10" y1="68" x2="110" y2="68" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Brim underside curve */}
      <path d="M10 68 Q60 74 110 68" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Crown suspension rib — center */}
      <path d="M60 28 L60 56" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" strokeLinecap="round" />
      {/* Ventilation slot left */}
      <line x1="35" y1="46" x2="42" y2="44" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Ventilation slot right */}
      <line x1="78" y1="44" x2="85" y2="46" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Logo indent placeholder on front */}
      <rect x="50" y="52" width="20" height="10" rx="1" stroke="currentColor" strokeWidth="0.7" />
      {/* Chin strap attach left */}
      <line x1="22" y1="68" x2="18" y2="78" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Chin strap attach right */}
      <line x1="98" y1="68" x2="102" y2="78" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
