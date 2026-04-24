"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

/**
 * Copper scroll-progress line pinned to the top of the viewport.
 * Desktop only — uses GSAP scrub so it stays in sync with Lenis.
 * CSS in globals.css defines the base styles (transform-origin: left, scaleX: 0).
 */
export default function ScrollProgress() {
  const ctxRef = useRef<gsap.Context | null>(null);
  const pathname = usePathname();
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;

    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0,
        },
      });
    });
    ctxRef.current = ctx;

    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, [pathname]);

  return <div id="scroll-progress" aria-hidden="true" />;
}
