"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// Single source of truth for the left-margin plumb-line diamond, shared by
// every stacked-surface flow (home EditorialFlow, AboutFlow, AduFlow) and the
// flow-less VerticalBrandMark. One vocabulary site-wide (Brian, 2026-07-09
// rail-consistency pass):
//   • shape/size: 8px square rotated 45° → diamond
//   • x: node center collinear with the rail (−3.5px inside the w-px track)
//   • seam placement: −translate-y-1/2 centers the diamond ON its junction
//   • pre-ignition: maroon ring + faint maroon center — legible on light AND
//     dark surfaces (home crosses both), so it never disappears or flips look
//   • ignited: .flow-node-lit (globals.css) fills solid maroon
// The class is exported so VerticalBrandMark renders a pixel-identical diamond
// without duplicating the string.
export const FLOW_NODE_CLASS =
  "flow-node absolute -left-[3.5px] h-2 w-2 -translate-y-1/2 rotate-45 border border-[var(--color-accent)]/55 bg-[var(--color-accent)]/12 transition-colors duration-500";

export default function FlowNode({
  top,
  wrapRef,
}: {
  top: number;
  wrapRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const wrap = wrapRef.current;
    if (!dot || !wrap) return;
    if (!AnimationController.shouldAnimate()) return;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: `top+=${top} 72%`,
      onEnter: () => dot.classList.add("flow-node-lit"),
      onLeaveBack: () => dot.classList.remove("flow-node-lit"),
    });

    return () => st.kill();
  }, [top, wrapRef]);

  return <div ref={dotRef} className={FLOW_NODE_CLASS} style={{ top }} />;
}
