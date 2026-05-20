"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

type SectionMotionBackdropProps = {
  tone?: "light" | "dark";
  density?: "quiet" | "standard";
  className?: string;
};

export default function SectionMotionBackdrop({
  tone = "light",
  density = "quiet",
  className = "",
}: SectionMotionBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const travel = density === "standard" ? 44 : 26;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) {
        gsap.set(root, { autoAlpha: 1 });
        return;
      }

      const pieces = [gridRef.current, railRef.current, arcRef.current, cornerRef.current].filter(Boolean);
      gsap.set(pieces, {
        force3D: true,
        transformPerspective: 1000,
        willChange: "transform, opacity",
      });
      gsap.fromTo(
        pieces,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        }
      );

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          x: -travel,
          y: travel * 0.48,
          force3D: true,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { xPercent: -10, rotate: -2 },
          {
            xPercent: 9,
            rotate: 1.5,
            force3D: true,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.2 },
          }
        );
      }

      if (arcRef.current) {
        gsap.to(arcRef.current, {
          rotate: density === "standard" ? 16 : 9,
          yPercent: density === "standard" ? -18 : -10,
          force3D: true,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.8 },
        });
      }

      if (cornerRef.current) {
        gsap.to(cornerRef.current, {
          xPercent: density === "standard" ? -12 : -7,
          yPercent: density === "standard" ? -10 : -5,
          force3D: true,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.35 },
        });
      }
    }, rootRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, [density]);

  const ink = tone === "dark" ? "0,0,0" : "255,255,255";
  const accent = tone === "dark" ? "123,45,38" : "184,115,51";
  const baseOpacity = density === "standard" ? "opacity-[0.32]" : "opacity-[0.22]";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 hidden overflow-hidden lg:block ${baseOpacity} ${className}`}
    >
      <div
        ref={gridRef}
        className="absolute inset-[-14%]"
        style={{
          backgroundImage:
            `linear-gradient(rgba(${ink},0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(${ink},0.12) 1px, transparent 1px), linear-gradient(rgba(${accent},0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(${accent},0.14) 1px, transparent 1px)`,
          backgroundSize: "104px 104px, 104px 104px, 26px 26px, 26px 26px",
          maskImage: "radial-gradient(circle at 46% 45%, black 0%, rgba(0,0,0,0.74) 34%, transparent 72%)",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={railRef}
        className="absolute left-[-9%] top-[58%] h-14 w-[58%] border-y"
        style={{
          borderColor: `rgba(${ink},0.22)`,
          background: `repeating-linear-gradient(90deg, rgba(${ink},0.3) 0 1px, transparent 1px 24px, rgba(${ink},0.15) 24px 25px, transparent 25px 48px)`,
          willChange: "transform, opacity",
        }}
      >
        <span
          className="absolute left-[18%] top-1/2 h-8 w-28 -translate-y-1/2 rounded-full border"
          style={{ borderColor: `rgba(${ink},0.28)` }}
        />
      </div>
      <div
        ref={arcRef}
        className="absolute -right-40 bottom-[-16rem] h-[34rem] w-[34rem] rounded-full border"
        style={{ borderColor: `rgba(${ink},0.18)`, willChange: "transform, opacity" }}
      >
        <span className="absolute left-1/2 top-0 h-full w-px" style={{ background: `rgba(${ink},0.14)` }} />
        <span className="absolute left-0 top-1/2 h-px w-full" style={{ background: `rgba(${ink},0.12)` }} />
        <span className="absolute left-[31%] top-[20%] h-2 w-2 rounded-full" style={{ background: `rgba(${accent},0.5)` }} />
      </div>
      <div
        ref={cornerRef}
        className="absolute right-[10%] top-[14%] h-28 w-28 border"
        style={{ borderColor: `rgba(${ink},0.2)`, willChange: "transform, opacity" }}
      >
        <span className="absolute left-1/2 top-0 h-full w-px" style={{ background: `rgba(${ink},0.14)` }} />
        <span className="absolute left-0 top-1/2 h-px w-full" style={{ background: `rgba(${ink},0.14)` }} />
      </div>
    </div>
  );
}
