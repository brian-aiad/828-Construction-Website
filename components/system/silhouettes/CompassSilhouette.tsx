import { CSSProperties } from 'react';

export default function CompassSilhouette({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Main pivot */}
      <circle cx="80" cy="42" r="5" stroke="currentColor" strokeWidth="1.1" />
      {/* Left leg */}
      <path d="M77 46 L46 138" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right leg */}
      <path d="M83 46 L114 138" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Joint hinge bar — crosses both legs */}
      <line x1="58" y1="88" x2="102" y2="88" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      {/* Left foot — pencil tip */}
      <path d="M44 133 L46 138 L50 133" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right foot — needle point */}
      <line x1="114" y1="138" x2="114" y2="145" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Decorative arc drawn by compass — asymmetric */}
      <path
        d="M 36 138 A 78 78 0 0 1 124 90"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 3.5"
        strokeLinecap="round"
      />
      {/* Center tension knob */}
      <rect x="75" y="30" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="0.8" />
      {/* Top stylus cap */}
      <path d="M76 30 L80 22 L84 30" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
    </svg>
  );
}
