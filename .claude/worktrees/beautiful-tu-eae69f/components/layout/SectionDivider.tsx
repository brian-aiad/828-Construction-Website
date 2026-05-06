"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

interface SectionDividerProps {
  /** Opacity of the copper line. Default 0.45 */
  opacity?: number;
}

/**
 * 1px copper hairline that draws in (scaleX 0→1 from left) as it enters the viewport.
 * Placed between sections to create intentional seams between dark/light transitions.
 */
export default function SectionDivider({ opacity = 0.45 }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.85,
          ease: "power2.inOut",
          transformOrigin: "left",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    });
    ctxRef.current = ctx;

    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        height: 1,
        background: "#B87333",
        opacity,
        transformOrigin: "left",
      }}
    />
  );
}
