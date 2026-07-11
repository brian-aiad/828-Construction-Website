"use client";

import { usePathname } from "next/navigation";
import { FLOW_NODE_CLASS } from "@/components/system/FlowNode";

// Line-only edge chrome (Brian, 2026-07-09: "I like the red line — delete the
// wording"). The rotated brand/license text is gone site-wide.
// Flow-less routes get a single quiet maroon hairline + one diamond that share
// the EXACT rail vocabulary of the animated flows (x-geometry, line opacity,
// diamond style) so the edge reads identically page to page.
// YIELD on every route that draws its OWN animated flow rail, or a second line
// doubles the chrome. As of 2026-07-10 EVERY page has a flow (PortfolioFlow
// was the last) — this static mark remains only as a fallback for any future
// flow-less route so the edge chrome never disappears entirely.
export default function VerticalBrandMark() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/services" ||
    pathname === "/services/adu" ||
    pathname === "/services/remediation" ||
    pathname === "/services/consulting" ||
    pathname === "/portfolio" ||
    pathname === "/contact"
  )
    return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-[1.4rem] top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-6"
    >
      <div className="relative h-[34vh] w-px bg-white/[0.07]">
        <div className="absolute inset-0 bg-[var(--color-accent)]/70" />
        <div className={`${FLOW_NODE_CLASS} top-1/2`} />
      </div>
    </div>
  );
}
