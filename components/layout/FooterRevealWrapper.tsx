"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLOW_NODE_CLASS } from "@/components/system/FlowNode";

gsap.registerPlugin(ScrollTrigger);

// Parallax-reveal wrapper for the footer.
// As the user approaches the bottom of the page, the footer rises smoothly
// into view rather than sitting statically. Scrub-tied (not once-on-enter).

export default function FooterRevealWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip parallax on mobile (Lenis is off; native scroll only)
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      // Opacity-only reveal to avoid transform overflow on body-width container
      gsap.set(el, { opacity: 0.65 });
      gsap.fromTo(
        el,
        { opacity: 0.65 },
        {
          opacity: 1,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 98%",
            end: "top 60%",
            scrub: 1.4,
          },
        }
      );
    }, ref);

    return () => { try { ctx.revert(); } catch {} };
  }, [pathname]);

  // data-footer-surface: the footer is the site-wide LAST stacked surface —
  // flows pin their final section under it, the settle snaps its junction,
  // and z-20 lifts it above every flow's pinned surfaces (flows sit at z-10).
  return (
    <div ref={ref} data-footer-surface="" className="relative z-20">
      <div
        data-flow-terminal=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[1.4rem] top-0 z-30 hidden w-px xl:left-6 xl:block"
      >
        <div className={`${FLOW_NODE_CLASS} flow-node-lit top-0`} />
      </div>
      {children}
    </div>
  );
}
