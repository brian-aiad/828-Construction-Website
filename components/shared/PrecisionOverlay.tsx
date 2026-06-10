"use client";

type PrecisionOverlayProps = {
  tone?: "light" | "dark";
  className?: string;
  opacity?: number;
};

export default function PrecisionOverlay({
  tone = "dark",
  className = "",
  opacity = 0.18,
}: PrecisionOverlayProps) {
  const color = tone === "light" ? "black" : "white";
  const grid = tone === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.10)";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 58% 42%, black 0%, transparent 72%)",
        }}
      />
      <svg
        viewBox="0 0 900 620"
        className="absolute right-[-12%] top-1/2 h-[115%] w-[76%] -translate-y-1/2"
        fill="none"
        style={{ color }}
      >
        <path d="M118 488 A314 314 0 0 1 746 488" stroke="currentColor" strokeOpacity="0.42" strokeWidth="1.5" />
        <path d="M184 488 A248 248 0 0 1 680 488" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
        <line x1="114" y1="488" x2="754" y2="488" stroke="currentColor" strokeOpacity="0.32" />
        {Array.from({ length: 32 }).map((_, i) => (
          <line
            key={i}
            x1={142 + i * 18}
            y1={i % 4 === 0 ? 470 : 478}
            x2={142 + i * 18}
            y2="506"
            stroke="currentColor"
            strokeOpacity={i % 4 === 0 ? 0.46 : 0.24}
          />
        ))}
        <g className="precision-overlay-needle" style={{ transformOrigin: "438px 488px", animation: "precisionNeedle 7s ease-in-out infinite alternate" }}>
          <line x1="438" y1="488" x2="642" y2="172" stroke="currentColor" strokeOpacity="0.62" strokeWidth="1.5" />
          <line x1="438" y1="488" x2="316" y2="194" stroke="currentColor" strokeOpacity="0.34" />
          <circle cx="438" cy="488" r="9" stroke="currentColor" strokeOpacity="0.56" />
        </g>
        <line
          x1="84"
          y1="342"
          x2="812"
          y2="342"
          stroke="var(--color-accent)"
          strokeOpacity="0.72"
          strokeWidth="1.2"
          style={{ filter: "drop-shadow(0 0 10px rgba(99,26,22,0.45))" }}
        />
        <text x="120" y="132" fill="currentColor" fillOpacity="0.42" fontFamily="monospace" fontSize="12" letterSpacing="3">
          MEASURE / ALIGN / BUILD
        </text>
        <text x="626" y="532" fill="currentColor" fillOpacity="0.36" fontFamily="monospace" fontSize="11" letterSpacing="2">
          828 / PRECISION
        </text>
      </svg>
    </div>
  );
}
