"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

type DraftingMotionLayerProps = {
  intensity?: "quiet" | "standard" | "strong";
  variant?: "default" | "intro";
  className?: string;
};

export default function DraftingMotionLayer({
  intensity = "standard",
  variant = "default",
  className = "",
}: DraftingMotionLayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const travel =
      variant === "intro"
        ? intensity === "strong"
          ? 58
          : intensity === "quiet"
            ? 22
            : 40
        : intensity === "strong"
          ? 72
          : intensity === "quiet"
            ? 26
            : 46;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) {
        gsap.set(root, { autoAlpha: 1, y: 0 });
        return;
      }

      if (variant === "intro") {
        gsap.fromTo(
          root,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 92%",
              end: "top 52%",
              scrub: 0.9,
            },
          }
        );
      }

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          x: variant === "intro" ? -travel * 0.8 : -travel,
          y: variant === "intro" ? travel * 0.32 : travel * 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: variant === "intro" ? "top 88%" : "top bottom",
            end: variant === "intro" ? "bottom 30%" : "bottom top",
            scrub: 1.4,
          },
        });
      }

      if (rulerRef.current) {
        gsap.fromTo(
          rulerRef.current,
          { xPercent: variant === "intro" ? -10 : -18, rotate: variant === "intro" ? -2 : -5 },
          {
            xPercent: variant === "intro" ? 12 : 18,
            rotate: variant === "intro" ? 1.5 : 3,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: variant === "intro" ? "top 84%" : "top bottom",
              end: variant === "intro" ? "bottom 32%" : "bottom top",
              scrub: 1.1,
            },
          }
        );
      }

      if (arcRef.current) {
        gsap.to(arcRef.current, {
          rotate: variant === "intro" ? 10 : 18,
          yPercent: variant === "intro" ? -10 : -20,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: variant === "intro" ? "top 90%" : "top bottom",
            end: variant === "intro" ? "bottom 35%" : "bottom top",
            scrub: 1.7,
          },
        });
      }
    }, rootRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, [intensity, variant]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={gridRef}
        className={`absolute ${variant === "intro" ? "inset-[-18%] opacity-[0.5]" : "inset-[-12%] opacity-[0.28]"}`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(rgba(99,26,22,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,26,22,0.16) 1px, transparent 1px)",
          backgroundSize: variant === "intro" ? "78px 78px, 78px 78px, 19.5px 19.5px, 19.5px 19.5px" : "96px 96px, 96px 96px, 24px 24px, 24px 24px",
          maskImage: variant === "intro"
            ? "linear-gradient(90deg, black 0%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,0.34) 72%, transparent 100%)"
            : "radial-gradient(circle at 54% 42%, black 0%, rgba(0,0,0,0.75) 36%, transparent 72%)",
          mixBlendMode: variant === "intro" ? "screen" : "normal",
          willChange: "transform",
        }}
      />
      <div
        ref={rulerRef}
        className={`absolute ${variant === "intro" ? "left-[-10%] top-[49%] h-20 w-[64%]" : "left-[-8%] top-[20%] h-16 w-[72%]"} border-y border-white/14`}
        style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.34) 0 1px, transparent 1px 20px, rgba(255,255,255,0.18) 20px 21px, transparent 21px 40px)",
          opacity: variant === "intro" ? 0.9 : 1,
          mixBlendMode: variant === "intro" ? "screen" : "normal",
          willChange: "transform",
        }}
      >
        <div className={`absolute ${variant === "intro" ? "left-[24%] h-8 w-32 border-white/30" : "left-[24%] h-8 w-28"} top-1/2 -translate-y-1/2 rounded-full border`} />
        <div className={`absolute ${variant === "intro" ? "right-[10%]" : "right-[12%]"} top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white/28`} />
      </div>
      <div
        ref={arcRef}
        className={`absolute ${variant === "intro" ? "bottom-[-12rem] left-[42%] h-[34rem] w-[34rem]" : "bottom-[-18rem] right-[-13rem] h-[38rem] w-[38rem]"} rounded-full border border-white/10`}
        style={{ willChange: "transform" }}
      >
        <div className="absolute left-1/2 top-0 h-full w-px origin-bottom bg-white/10" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/8" />
        <div className="absolute left-[26%] top-[18%] h-2 w-2 rounded-full bg-white/18" />
      </div>
    </div>
  );
}
