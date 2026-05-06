"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  }, []);

  return <div ref={ref}>{children}</div>;
}
