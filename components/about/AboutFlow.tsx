"use client";

import React from "react";

// About uses normal document flow by design. The old sticky stack kept earlier
// sections painted under later ones during fast scrolls and browser resizes,
// which caused the overlapping/glitching reports. Keep the surface marker for
// regression tests, but do not pin or scrub the section containers.

export default function AboutFlow({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);

  return (
    <div data-about-flow="" className="relative z-10 bg-[#050505]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 left-[1.4rem] z-30 hidden w-px bg-white/[0.07] min-[1180px]:block xl:left-6"
      >
        <div className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-accent)]/55" />
      </div>

      {items.map((child, i) => (
        <div
          key={i}
          data-stack-surface=""
          className="relative bg-[#050505]"
          style={{ zIndex: i + 1 }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
