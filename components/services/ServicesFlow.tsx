"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// Services port of the About/home stacked-surface grammar (Brian's order,
// 2026-07-09: same cover-scroll on every page — wording/sections untouched).
// Faithful to components/about/AboutFlow.tsx, which is the debugged canonical:
//
// 1. Each section becomes position:sticky with a measured negative top — a
//    fully-read surface holds still while the next rides up and COVERS it
//    edge-to-edge. The services index brings its own internal pin (100svh
//    panel over a 210vh runway); because a taller-than-viewport surface pins
//    at its BOTTOM edge (top = vh - height), it only holds once its runway is
//    fully consumed — the traveling-picture walk finishes, then Vision covers
//    it. Geometry stays full-bleed at every frame: covered surfaces dim under
//    an opacity veil, NEVER a scale settle (transform insets open edge gaps —
//    Brian's 2026-07-09 gap report on About).
// 2. No plumb line here: the site-wide line-only sidebar rail (2026-07-09)
//    already draws the left-margin thread on every page — a second line would
//    double the chrome. Surfaces + veils only.
//
// Every surface must carry an opaque background of its own (all four services
// sections do); the wrapper's black backstop only guards against subpixel
// seams at cover junctions.

export default function ServicesFlow({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const stacks = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-stack-surface]")
    );

    const applyStackTops = () => {
      stacks.forEach((el, i) => {
        const isLast = i === stacks.length - 1;
        if (isLast) {
          el.style.position = "relative";
          el.style.top = "auto";
          return;
        }
        el.style.position = "sticky";
        el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
      });
    };
    applyStackTops();

    const onResize = () => applyStackTops();
    window.addEventListener("resize", onResize, { passive: true });

    if (!AnimationController.shouldAnimate()) {
      return () => window.removeEventListener("resize", onResize);
    }

    const ctx = gsap.context(() => {
      stacks.forEach((el, i) => {
        const next = stacks[i + 1];
        if (!next) return;
        const veil = el.querySelector<HTMLElement>("[data-cover-veil]");
        if (!veil) return;
        gsap.fromTo(
          veil,
          { opacity: 0 },
          {
            opacity: 0.28,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: 0.9,
            },
          }
        );
      });
    }, wrapRef);

    return () => {
      window.removeEventListener("resize", onResize);
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const items = React.Children.toArray(children);

  return (
    <div ref={wrapRef} data-services-flow="" className="relative z-10 bg-black">
      {items.map((child, i) => (
        <div
          key={i}
          data-stack-surface=""
          className="relative bg-black shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.85)]"
          style={{ zIndex: i + 1 }}
        >
          {child}
          {i < items.length - 1 && (
            <div
              data-cover-veil=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[60] bg-black opacity-0"
            />
          )}
        </div>
      ))}
    </div>
  );
}
