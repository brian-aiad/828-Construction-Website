"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
import FlowNode from "@/components/system/FlowNode";
import { useJunctionSettle } from "@/components/system/useJunctionSettle";
import { useStackSurfaceVisibility } from "@/components/system/useStackSurfaceVisibility";

gsap.registerPlugin(ScrollTrigger);

// Faithful per-page copy of components/about/AboutFlow.tsx (the canonical
// stacked-surface component — Brian's 2026-07-09 fan-out directive). Do not
// diverge from the About mechanics: measured sticky tops, opacity-veil covers
// (NEVER a scale settle — transform insets open edge gaps between alternating
// dark/light surfaces), plumb line + igniting nodes down the left margin.

export default function RemediationFlow({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

  // Fix 26 — never rest half-covered: settle to the nearest clean boundary
  // after a genuine scroll-end inside a cover transition. All guards internal
  // (direction-aware, Lenis-driven glide, cancel-on-input, desktop-only). This
  // flow's FAQ answers resize surfaces after mount; the hook re-measures on
  // live rects each idle so the settle target stays correct.
  useJunctionSettle(wrapRef);
  useStackSurfaceVisibility(wrapRef);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    const stacks = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-stack-surface]")
    );

    const applyStackTops = () => {
      const stackEnabled = AnimationController.shouldAnimate();
      stacks.forEach((el) => {
        if (!stackEnabled) {
          el.style.position = "relative";
          el.style.top = "auto";
          return;
        }
        // Footer-cover (Brian 2026-07-13): the LAST surface pins too — the
        // site footer ([data-footer-surface], z-20) rides over it like any
        // next surface, so no page tail ever peeks above the footer at rest.
        el.style.position = "sticky";
        el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
      });
    };
    applyStackTops();

    const measure = () => {
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      const anchors = Array.from(
        wrap.querySelectorAll<HTMLElement>("[data-section]")
      );
      setNodes(
        anchors.map((el) => {
          const top = el.getBoundingClientRect().top + window.scrollY;
          return top - wrapTop;
        })
      );
    };
    measure();

    const onResize = () => {
      applyStackTops();
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Page-specific guard: the FAQ answer expanders change a surface's height,
    // which stales the measured sticky tops (gap risk). Re-measure debounced.
    let roTimer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(() => {
        applyStackTops();
        measure();
        try {
          ScrollTrigger.refresh();
        } catch {}
      }, 180);
    });
    stacks.forEach((el) => ro.observe(el));

    if (!AnimationController.shouldAnimate()) {
      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(roTimer);
        ro.disconnect();
      };
    }

    const ctx = gsap.context(() => {
      stacks.forEach((el, i) => {
        // The footer is the surface after the last stack child.
        const next =
          stacks[i + 1] ??
          document.querySelector<HTMLElement>("[data-footer-surface]");
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

      gsap.set(line, { scaleY: 0, transformOrigin: "top" });
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 72%",
          end: "bottom bottom",
          scrub: 0.8,
          onRefresh: measure,
        },
      });
    }, wrapRef);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(roTimer);
      ro.disconnect();
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const items = React.Children.toArray(children);

  return (
    <div ref={wrapRef} data-rem-flow="" className="relative z-10 bg-[#050505]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 left-[1.4rem] z-30 hidden w-px xl:block xl:left-6"
      >
        <div className="absolute inset-0 bg-white/[0.07]" />
        <div ref={lineRef} className="absolute inset-0 bg-[var(--color-accent)]/70" />
        {nodes.map((top, i) => (
          <FlowNode key={i} top={top} wrapRef={wrapRef} />
        ))}
      </div>

      {items.map((child, i) => (
        <div
          key={i}
          data-stack-surface=""
          className="relative bg-[#050505] shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.85)]"
          style={{ zIndex: i + 1 }}
        >
          {child}
          {(
            <div
              data-cover-veil=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[60] bg-black opacity-0"
            />
          )}
        </div>
      ))}
      {/* Footer runway: a sticky element cannot pin at its container's
          end — this spacer gives the LAST surface room to stay pinned
          while the site footer (z-20) rides over it, exactly like every
          other cover junction (Brian 2026-07-13 full-screen footer). */}
      <div aria-hidden="true" data-footer-runway="" className="pointer-events-none h-svh" />
    </div>
  );
}
