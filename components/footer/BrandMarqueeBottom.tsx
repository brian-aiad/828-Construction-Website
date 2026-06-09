"use client";

import { useRef } from "react";

const REPETITIONS = 6;

type BrandMarqueeBottomProps = {
  className?: string;
  itemClassName?: string;
  compact?: boolean;
  panel?: boolean;
  text?: string;
  color?: string;
};

export default function BrandMarqueeBottom({
  className = "",
  itemClassName = "",
  compact = false,
  panel = false,
  text = "828 CONSTRUCTION · TORRANCE / SOUTH BAY / LA COUNTY ·",
  color = "rgba(255, 255, 255, 0.28)",
}: BrandMarqueeBottomProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const heightClass = panel
    ? "h-[4.3rem]"
    : compact
      ? "h-12"
      : "h-[clamp(4.4rem,9vw,8.4rem)]";
  const fontSize = panel
    ? "clamp(2.55rem, 4.25vw, 3.45rem)"
    : compact
      ? "clamp(1.25rem, 2.2vw, 2.35rem)"
      : "clamp(1.9rem, 3.6vw, 3.75rem)";
  const paddingClass = panel ? "pr-14" : compact ? "pr-10" : "pr-16";

  const setPaused = (paused: boolean) => {
    if (!trackRef.current) return;
    trackRef.current.style.animationPlayState = paused ? "paused" : "running";
  };

  return (
    <div
      aria-hidden="true"
      className={`brand-marquee-bottom relative w-full overflow-hidden motion-reduce:hidden ${heightClass} ${className}`}
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
            className={`inline-flex items-center font-display font-bold uppercase ${paddingClass} ${itemClassName}`}
            style={{
              fontSize,
              color,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
