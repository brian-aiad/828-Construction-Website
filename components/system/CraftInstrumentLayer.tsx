"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
import {
  BlueprintCornerSilhouette,
  CompassSilhouette,
  LevelSilhouette,
} from "@/components/system/silhouettes";

gsap.registerPlugin(ScrollTrigger);

type CraftInstrumentLayerProps = {
  className?: string;
  tone?: "light" | "dark";
  density?: "quiet" | "standard" | "rich";
};

export default function CraftInstrumentLayer({
  className = "",
  tone = "light",
  density = "standard",
}: CraftInstrumentLayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) return;

      const objects = [levelRef.current, compassRef.current, blueprintRef.current, railRef.current].filter(Boolean);
      gsap.set(objects, {
        force3D: true,
        transformPerspective: 1000,
        willChange: "transform, opacity",
      });

      gsap.fromTo(
        objects,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        }
      );

      if (levelRef.current) {
        gsap.to(levelRef.current, {
          xPercent: density === "rich" ? 18 : 10,
          yPercent: density === "quiet" ? -8 : -18,
          rotate: density === "rich" ? -5 : -3,
          force3D: true,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      if (compassRef.current) {
        gsap.to(compassRef.current, {
          yPercent: density === "rich" ? -34 : -22,
          rotate: density === "rich" ? 14 : 8,
          force3D: true,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.6 },
        });
      }

      if (blueprintRef.current) {
        gsap.to(blueprintRef.current, {
          xPercent: density === "rich" ? -18 : -10,
          yPercent: density === "quiet" ? -10 : -26,
          rotate: density === "rich" ? 7 : 4,
          force3D: true,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.35 },
        });
      }

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleX: 0.35, transformOrigin: "left center" },
          {
            scaleX: 1,
            force3D: true,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 30%", scrub: 1 },
          }
        );
      }
    }, rootRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, [density]);

  const colorClass = tone === "dark" ? "text-black" : "text-white";
  const opacity = density === "quiet"
    ? tone === "dark" ? "opacity-[0.055]" : "opacity-[0.12]"
    : density === "rich" ? "opacity-[0.2]" : "opacity-[0.16]";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block ${colorClass} ${className}`}
    >
      <div
        ref={railRef}
        className={`absolute left-[-8%] top-[22%] h-12 w-[58%] border-y border-current/20 ${opacity}`}
        style={{
          background:
            "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 30px)",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={levelRef}
        className={`absolute left-[-11%] top-[34%] w-[48rem] rotate-[-4deg] ${opacity}`}
        style={{ willChange: "transform, opacity" }}
      >
        <LevelSilhouette style={{ width: "100%", height: "auto" }} />
      </div>
      <div
        ref={compassRef}
        className={`absolute right-[5%] top-[12%] w-[18rem] rotate-[8deg] ${opacity}`}
        style={{ willChange: "transform, opacity" }}
      >
        <CompassSilhouette style={{ width: "100%", height: "auto" }} />
      </div>
      <div
        ref={blueprintRef}
        className={`absolute bottom-[-6rem] right-[-5rem] w-[32rem] ${opacity}`}
        style={{ willChange: "transform, opacity" }}
      >
        <BlueprintCornerSilhouette style={{ width: "100%", height: "auto" }} />
      </div>
    </div>
  );
}
