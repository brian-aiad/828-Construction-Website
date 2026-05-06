"use client";

import { useEffect, useLayoutEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseParallaxOptions {
  /** The container element (defines scroll trigger bounds) */
  containerRef: RefObject<HTMLElement | null>;
  /** The image/element that moves. Defaults to containerRef if omitted. */
  targetRef?: RefObject<HTMLElement | null>;
  /** Parallax intensity as a yPercent value (negative = up). Default -10 */
  yPercent?: number;
  /** scrub value for ScrollTrigger. true = 1:1, number = lag seconds. Default true */
  scrub?: boolean | number;
  /** ScrollTrigger start. Default "top bottom" */
  start?: string;
  /** ScrollTrigger end. Default "bottom top" */
  end?: string;
}

/**
 * Scroll-linked parallax on an image or element.
 * Uses GPU-only transform: translateY (yPercent).
 * Sets will-change: transform before animation, removes on cleanup.
 * No-ops on mobile and prefers-reduced-motion.
 */
export function useParallax({
  containerRef,
  targetRef,
  yPercent = -10,
  scrub = true,
  start = "top bottom",
  end = "bottom top",
}: UseParallaxOptions) {
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !containerRef.current) return;

    const container = containerRef.current;
    const target = targetRef?.current ?? container;

    target.style.willChange = "transform";

    const ctx = gsap.context(() => {
      gsap.to(target, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
        },
      });
    });
    ctxRef.current = ctx;

    return () => {
      ctxRef.current = null;
      try { target.style.willChange = "auto"; } catch {}
      try { ctx.revert(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Clip-path reveal from an edge direction.
 * direction: "bottom" = inset(100% 0 0 0) → inset(0% 0 0 0)   (reveals from top down after scrolling)
 * direction: "right"  = inset(0 100% 0 0) → inset(0 0% 0 0)   (wipes left to right)
 * direction: "left"   = inset(0 0 0 100%) → inset(0 0 0 0%)   (wipes right to left)
 */
export function useClipRevealFrom(
  elementRef: RefObject<HTMLElement | null>,
  direction: "bottom" | "right" | "left" | "top" = "bottom",
  {
    duration = 1.1,
    delay = 0,
    ease = "power3.out",
    start = "top 78%",
  }: { duration?: number; delay?: number; ease?: string; start?: string } = {}
) {
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !elementRef.current) return;
    const el = elementRef.current;

    const clipStart: Record<string, string> = {
      bottom: "inset(100% 0% 0% 0%)",
      top:    "inset(0% 0% 100% 0%)",
      right:  "inset(0% 100% 0% 0%)",
      left:   "inset(0% 0% 0% 100%)",
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: clipStart[direction] },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration,
          delay,
          ease,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    });
    ctxRef.current = ctx;

    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
