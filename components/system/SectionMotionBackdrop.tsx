"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

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
  const railRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let revealDispose = () => {};
    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) {
        gsap.set(root, { autoAlpha: 1 });
        return;
      }

      const pieces = [railRef.current, arcRef.current, cornerRef.current].filter(
        (piece): piece is HTMLDivElement => !!piece
      );
      gsap.set(pieces, {
        autoAlpha: 0,
        y: 14,
        force3D: true,
        transformPerspective: 1000,
      });
      if (railRef.current) gsap.set(railRef.current, { xPercent: -1.5 });
      if (arcRef.current) gsap.set(arcRef.current, { rotation: -3 });
      if (cornerRef.current) gsap.set(cornerRef.current, { rotation: 2 });

      revealDispose = revealOnVisible([root], (_el, _index, immediate) => {
        gsap.to(pieces, {
          autoAlpha: 1,
          y: 0,
          stagger: immediate ? 0 : 0.08,
          duration: immediate ? 0 : 0.8,
          ease: "power3.out",
          overwrite: "auto",
          onStart: () => {
            gsap.set(pieces, { willChange: "transform, opacity" });
          },
          onComplete: () => {
            gsap.set(pieces, { willChange: "auto" });
          },
        });
        if (railRef.current) {
          gsap.to(railRef.current, {
            xPercent: 0,
            duration: immediate ? 0 : 1.05,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        if (arcRef.current) {
          gsap.to(arcRef.current, {
            rotation: 0,
            duration: immediate ? 0 : 1.15,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        if (cornerRef.current) {
          gsap.to(cornerRef.current, {
            rotation: 0,
            duration: immediate ? 0 : 1,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });
    }, rootRef);

    return () => {
      revealDispose();
      try {
        ctx.revert();
      } catch {}
    };
  }, [density]);

  const ink = tone === "dark" ? "0,0,0" : "255,255,255";
  const accent = tone === "dark" ? "99,26,22" : "184,115,51";
  const baseOpacity = density === "standard" ? "opacity-[0.32]" : "opacity-[0.22]";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-section-motion-backdrop=""
      className={`pointer-events-none absolute inset-0 hidden overflow-hidden lg:block ${baseOpacity} ${className}`}
    >
      <div
        ref={railRef}
        className="absolute left-[-9%] top-[58%] h-14 w-[58%] border-y"
        style={{
          borderColor: `rgba(${ink},0.22)`,
          background: `repeating-linear-gradient(90deg, rgba(${ink},0.3) 0 1px, transparent 1px 24px, rgba(${ink},0.15) 24px 25px, transparent 25px 48px)`,
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
        style={{ borderColor: `rgba(${ink},0.18)` }}
      >
        <span className="absolute left-1/2 top-0 h-full w-px" style={{ background: `rgba(${ink},0.14)` }} />
        <span className="absolute left-0 top-1/2 h-px w-full" style={{ background: `rgba(${ink},0.12)` }} />
        <span className="absolute left-[31%] top-[20%] h-2 w-2 rounded-full" style={{ background: `rgba(${accent},0.5)` }} />
      </div>
      <div
        ref={cornerRef}
        className="absolute right-[10%] top-[14%] h-28 w-28 border"
        style={{ borderColor: `rgba(${ink},0.2)` }}
      >
        <span className="absolute left-1/2 top-0 h-full w-px" style={{ background: `rgba(${ink},0.14)` }} />
        <span className="absolute left-0 top-1/2 h-px w-full" style={{ background: `rgba(${ink},0.14)` }} />
      </div>
    </div>
  );
}
