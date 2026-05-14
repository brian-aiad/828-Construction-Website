"use client";

import { useRef } from "react";

const REPETITIONS = 6;

export default function BrandMarqueeBottom() {
  const trackRef = useRef<HTMLDivElement>(null);

  const setPaused = (paused: boolean) => {
    if (!trackRef.current) return;
    trackRef.current.style.animationPlayState = paused ? "paused" : "running";
  };

  return (
    <div
      aria-hidden="true"
      className="brand-marquee-bottom relative h-20 w-full overflow-hidden"
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
            className="inline-flex items-center pr-16 font-display font-bold uppercase"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 3.75rem)",
              color: "rgba(255, 255, 255, 0.28)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            828 Construction
            <span
              className="mx-12 inline-block rounded-full bg-[var(--color-accent)] opacity-60"
              style={{
                width: "0.35rem",
                height: "0.35rem",
                transform: "translateY(-0.4em)",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
