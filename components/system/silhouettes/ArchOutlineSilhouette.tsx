import { CSSProperties } from 'react';

export default function ArchOutlineSilhouette({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Ground line */}
      <line x1="4" y1="170" x2="156" y2="170" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Main structure walls */}
      <polyline
        points="24,170 24,88 80,34 136,88 136,170"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ridge line */}
      <line x1="80" y1="34" x2="80" y2="40" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Floor line — level 1 */}
      <line x1="24" y1="122" x2="136" y2="122" stroke="currentColor" strokeWidth="0.8" />
      {/* Window grid — left upper */}
      <rect x="34" y="94" width="28" height="22" stroke="currentColor" strokeWidth="0.8" />
      <line x1="48" y1="94" x2="48" y2="116" stroke="currentColor" strokeWidth="0.5" />
      <line x1="34" y1="105" x2="62" y2="105" stroke="currentColor" strokeWidth="0.5" />
      {/* Window grid — right upper */}
      <rect x="98" y="94" width="28" height="22" stroke="currentColor" strokeWidth="0.8" />
      <line x1="112" y1="94" x2="112" y2="116" stroke="currentColor" strokeWidth="0.5" />
      <line x1="98" y1="105" x2="126" y2="105" stroke="currentColor" strokeWidth="0.5" />
      {/* Door — centered lower */}
      <rect x="66" y="136" width="28" height="34" stroke="currentColor" strokeWidth="0.9" />
      {/* Door knob */}
      <circle cx="70" cy="154" r="1.5" stroke="currentColor" strokeWidth="0.7" />
      {/* Chimney — right side */}
      <rect x="118" y="50" width="12" height="26" stroke="currentColor" strokeWidth="0.8" />
      <line x1="116" y1="50" x2="132" y2="50" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
