import { CSSProperties } from 'react';

export default function ConstructionLineSilhouette({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Primary structural line — diagonal sweep */}
      <line x1="20" y1="160" x2="220" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Parallel offset — architectural underlay depth */}
      <line x1="40" y1="170" x2="240" y2="30" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
      {/* Cross-brace 1 */}
      <line x1="10" y1="80" x2="180" y2="80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Cross-brace 2 — offset lower */}
      <line x1="60" y1="140" x2="260" y2="60" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      {/* Vertical plumb line — asymmetric */}
      <line x1="140" y1="10" x2="140" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 5" strokeLinecap="round" />
      {/* Node joints */}
      <circle cx="140" cy="80" r="3" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="20" cy="160" r="2.5" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="220" cy="20" r="2.5" stroke="currentColor" strokeWidth="0.9" />
      {/* Measurement annotation tick */}
      <line x1="10" y1="73" x2="10" y2="87" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="180" y1="73" x2="180" y2="87" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Short perpendicular — drafting mark */}
      <line x1="78" y1="60" x2="90" y2="72" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="90" y1="60" x2="78" y2="72" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {/* Sketch arc — implied construction radius */}
      <path d="M 60 80 A 80 80 0 0 1 140 20" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 4" strokeLinecap="round" />
    </svg>
  );
}
