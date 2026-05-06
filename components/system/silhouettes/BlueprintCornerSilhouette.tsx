import { CSSProperties } from 'react';

export default function BlueprintCornerSilhouette({
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
      {/* Border L-shape — top + left only */}
      <polyline points="140,10 10,10 10,150" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      {/* Grid lines — vertical */}
      <line x1="30" y1="10" x2="30" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="55" y1="10" x2="55" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="80" y1="10" x2="80" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="105" y1="10" x2="105" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="130" y1="10" x2="130" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      {/* Grid lines — horizontal */}
      <line x1="10" y1="35" x2="150" y2="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="10" y1="60" x2="150" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="10" y1="85" x2="150" y2="85" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="10" y1="110" x2="150" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      <line x1="10" y1="135" x2="150" y2="135" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
      {/* Callout arrow — diagonal to upper-right */}
      <line x1="55" y1="85" x2="105" y2="48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <polyline points="97,42 105,48 98,56" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Callout leader box */}
      <rect x="108" y="30" width="38" height="18" stroke="currentColor" strokeWidth="0.8" rx="1" />
      {/* Cross registration mark — top-left corner */}
      <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
