"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
import FlowNode from "@/components/system/FlowNode";
import { useJunctionSettle } from "@/components/system/useJunctionSettle";

gsap.registerPlugin(ScrollTrigger);

// Services port of the About/home stacked-surface grammar (Brian's order,
// 2026-07-09: same cover-scroll on every page — wording/sections untouched).
// Faithful to components/about/AboutFlow.tsx, the debugged canonical:
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
// 2. Plumb line + igniting nodes down the left margin — the same rail every
//    other flow draws (Brian, 2026-07-09 "every page"). Node offsets are the
//    section document tops; the index's tall pinned runway shifts those tops
//    after ScrollTrigger builds its spacer, so measure() re-runs on refresh
//    (onRefresh) and on a debounced ResizeObserver, exactly like the others.
//
// Every surface carries an opaque background of its own (all four services
// sections do); the wrapper's black backstop only guards subpixel seams.

export default function ServicesFlow({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

  // Junction snap-settle (Brian 2026-07-10): stops mid-cover glide to the
  // nearest canonical rest. Shared hook — all guards live inside it.
  useJunctionSettle(wrapRef);

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

    // The index surface's internal 210vh pin builds a spacer after mount,
    // shifting the sections below it; a debounced ResizeObserver re-applies the
    // sticky tops and re-measures the node offsets so the rail stays true.
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
    <div ref={wrapRef} data-services-flow="" className="relative z-10 bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 left-[1.4rem] z-30 hidden w-px lg:block xl:left-6"
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
          className="relative bg-black shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.85)]"
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
