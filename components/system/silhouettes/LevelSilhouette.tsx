import { CSSProperties } from 'react';

export default function LevelSilhouette({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Main body */}
      <rect x="4" y="20" width="192" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" />
      {/* Top edge divider */}
      <line x1="4" y1="24" x2="196" y2="24" stroke="currentColor" strokeWidth="0.6" />
      {/* Bottom edge divider */}
      <line x1="4" y1="36" x2="196" y2="36" strokeWidth="0.6" stroke="currentColor" />
      {/* Bubble vial housing */}
      <rect x="78" y="22" width="44" height="16" rx="8" stroke="currentColor" strokeWidth="1" />
      {/* Bubble */}
      <ellipse cx="100" cy="30" rx="7" ry="5" stroke="currentColor" strokeWidth="0.9" />
      {/* Center crosshair */}
      <line x1="100" y1="22" x2="100" y2="38" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 2" />
      {/* Left end cap hole */}
      <circle cx="18" cy="30" r="4" stroke="currentColor" strokeWidth="0.9" />
      {/* Right end cap hole */}
      <circle cx="182" cy="30" r="4" stroke="currentColor" strokeWidth="0.9" />
      {/* Measurement ticks — left side */}
      <line x1="32" y1="24" x2="32" y2="28" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="44" y1="24" x2="44" y2="27" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="56" y1="24" x2="56" y2="28" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      {/* Measurement ticks — right side */}
      <line x1="144" y1="24" x2="144" y2="28" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="156" y1="24" x2="156" y2="27" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="168" y1="24" x2="168" y2="28" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}
