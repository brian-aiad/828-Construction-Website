"use client";

import React from "react";

// Contact contains a real form, so section containers must not pin or overlap.
// The old sticky stack could leave later surfaces intercepting clicks while the
// form was still visible. Keep surface markers for tests, but use normal flow.
export default function ContactFlow({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);

  return (
    <div data-contact-flow="" className="relative z-10 bg-[#050505]">
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
