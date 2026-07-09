"use client";

import { usePathname } from "next/navigation";

// Line-only edge chrome (Brian, 2026-07-09: "I like the red line — delete the
// wording"). The rotated brand/license text is gone site-wide.
// - Home: removed entirely per client review (round 1).
// - About: AboutFlow draws its own animated maroon plumb line at the same
//   edge; rendering a second static line would double it, so yield.
// - All other routes: a quiet centered maroon hairline keeps the edge
//   treatment consistent with the About plumb line.
export default function VerticalBrandMark() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/about") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative h-[34vh] w-px bg-white/[0.07]">
        <div className="absolute inset-0 bg-[var(--color-accent)]/60" />
        <div className="absolute -left-[3.5px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border border-white/25 bg-[#0b0b0b]" />
      </div>
    </div>
  );
}
