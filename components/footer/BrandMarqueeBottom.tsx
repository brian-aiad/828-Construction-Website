"use client";

import { useRef } from "react";

const REPETITIONS = 6;
const MARQUEE_TEXT = "828 CONSTRUCTION · TORRANCE / SOUTH BAY / LA COUNTY ·";

type BrandMarqueeBottomProps = {
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  compact?: boolean;
};

export default function BrandMarqueeBottom({
  className = "",
  itemClassName = "",
  separatorClassName = "",
  compact = false,
}: BrandMarqueeBottomProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const setPaused = (paused: boolean) => {
    if (!trackRef.current) return;
    trackRef.current.style.animationPlayState = paused ? "paused" : "running";
  };

  return (
    <div
      aria-hidden="true"
      className={`brand-marquee-bottom relative w-full overflow-hidden motion-reduce:hidden ${compact ? "h-12" : "h-[clamp(4.4rem,9vw,8.4rem)]"} ${className}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="animate-brand-marquee absolute left-0 top-0 flex h-full w-max items-center whitespace-nowrap will-change-transform"
      >
        {Array.from({ length: REPETITIONS }).map((_, i) => (
          <span
            key={i}
            className={`inline-flex items-center font-display font-bold uppercase ${compact ? "pr-10" : "pr-16"} ${itemClassName}`}
            style={{
              fontSize: compact ? "clamp(1.25rem, 2.2vw, 2.35rem)" : "clamp(1.9rem, 3.6vw, 3.75rem)",
              color: "rgba(255, 255, 255, 0.28)",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {MARQUEE_TEXT}
            <span
              className={`inline-block rounded-full bg-[var(--color-accent)] opacity-60 ${compact ? "mx-7" : "mx-12"} ${separatorClassName}`}
              style={{
                width: compact ? "0.24rem" : "0.35rem",
                height: compact ? "0.24rem" : "0.35rem",
                transform: "translateY(-0.4em)",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
