"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowNode from "@/components/system/FlowNode";
import { useJunctionSettle } from "@/components/system/useJunctionSettle";
import { useStackSurfaceVisibility } from "@/components/system/useStackSurfaceVisibility";

gsap.registerPlugin(ScrollTrigger);

type StackedSurfaceFlowProps = {
  children: React.ReactNode;
  flowAttribute: string;
  className?: string;
  surfaceClassName?: string;
  settleSelector?: string;
  darkVeilOpacity?: number;
  lightVeilOpacity?: number;
  resizeDebounceMs?: number;
};

export default function StackedSurfaceFlow({
  children,
  flowAttribute,
  className = "relative z-10 bg-[#050505]",
  surfaceClassName = "relative bg-[#050505] shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.85)]",
  settleSelector = "[data-stack-surface]",
  darkVeilOpacity = 0.28,
  lightVeilOpacity = 0.08,
  resizeDebounceMs = 180,
}: StackedSurfaceFlowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const coarseTablet = window.matchMedia(
      "(pointer: coarse) and (max-width: 1366px)"
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const sync = () => {
      setMotionEnabled(
        desktop.matches && !coarseTablet.matches && !reducedMotion.matches
      );
    };

    sync();
    desktop.addEventListener("change", sync);
    coarseTablet.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      desktop.removeEventListener("change", sync);
      coarseTablet.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  useJunctionSettle(wrapRef, settleSelector);
  useStackSurfaceVisibility(wrapRef);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    const stacks = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-stack-surface]")
    );

    const applySurfaceBackdrops = () => {
      stacks.forEach((el) => {
        const childSurface =
          el.querySelector<HTMLElement>("[data-header-light], [data-header-dark]") ??
          el.firstElementChild as HTMLElement | null;
        if (!childSurface) return;

        const childStyle = window.getComputedStyle(childSurface);
        const childBg = childStyle.backgroundColor;
        if (childBg && childBg !== "rgba(0, 0, 0, 0)" && childBg !== "transparent") {
          el.style.backgroundColor = childBg;
        }

        if (childSurface.closest("[data-header-light]")) {
          el.setAttribute("data-header-light", "");
          el.removeAttribute("data-header-dark");
        } else {
          el.setAttribute("data-header-dark", "");
          el.removeAttribute("data-header-light");
        }
      });
    };

    const applyStackTops = () => {
      stacks.forEach((el) => {
        if (!motionEnabled) {
          el.style.position = "relative";
          el.style.top = "auto";
          return;
        }

        el.style.position = "sticky";
        el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
      });
    };

    const measure = () => {
      // A sticky element's viewport and offset coordinates can both change
      // while it is pinned. The surfaces remain normal-flow siblings, though,
      // so their cumulative heights are the stable source of truth for every
      // cover junction and rail diamond.
      let top = 0;
      const junctions = stacks.map((surface) => {
          const junction = top;
          top += surface.offsetHeight;
          return junction;
        });
      setNodes(junctions);
    };

    let railFrame = 0;
    const updateRail = () => {
      railFrame = 0;
      if (!motionEnabled) {
        line.style.transform = "scaleY(0)";
        wrap.querySelectorAll<HTMLElement>("[data-flow-node]").forEach((node) =>
          node.classList.remove("flow-node-lit")
        );
        return;
      }

      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      const start = wrapTop - window.innerHeight * 0.72;
      const travel = Math.max(1, wrap.offsetHeight - window.innerHeight * 0.28);
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / travel)
      );
      const drawnY = progress * wrap.offsetHeight;

      line.style.transform = `scaleY(${progress.toFixed(5)})`;
      wrap.querySelectorAll<HTMLElement>("[data-flow-node]").forEach((node) => {
        const top = Number.parseFloat(node.style.top) || 0;
        node.classList.toggle(
          "flow-node-lit",
          progress > 0 && top <= drawnY + 0.5
        );
      });
    };
    const scheduleRail = () => {
      if (!railFrame) railFrame = requestAnimationFrame(updateRail);
    };

    applyStackTops();
    applySurfaceBackdrops();
    measure();
    scheduleRail();

    const refresh = () => {
      applyStackTops();
      applySurfaceBackdrops();
      measure();
      scheduleRail();
    };

    const onResize = () => refresh();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", scheduleRail, { passive: true });

    let roTimer: ReturnType<typeof setTimeout> | undefined;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            clearTimeout(roTimer);
            roTimer = setTimeout(() => {
              refresh();
              try {
                ScrollTrigger.refresh();
              } catch {}
            }, resizeDebounceMs);
          })
        : undefined;
    stacks.forEach((el) => ro?.observe(el));

    if (!motionEnabled) {
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", scheduleRail);
        if (railFrame) cancelAnimationFrame(railFrame);
        clearTimeout(roTimer);
        ro?.disconnect();
      };
    }

    const ctx = gsap.context(() => {
      stacks.forEach((el, i) => {
        const next =
          stacks[i + 1] ??
          document.querySelector<HTMLElement>("[data-footer-surface]");
        const veil = el.querySelector<HTMLElement>("[data-cover-veil]");
        if (!next || !veil) return;

        const light = el.querySelector("[data-header-light]") !== null;
        gsap.fromTo(
          veil,
          { opacity: 0 },
          {
            opacity: light ? lightVeilOpacity : darkVeilOpacity,
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
    }, wrapRef);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", scheduleRail);
      if (railFrame) cancelAnimationFrame(railFrame);
      clearTimeout(roTimer);
      ro?.disconnect();
      try {
        ctx.revert();
      } catch {}
    };
  }, [darkVeilOpacity, lightVeilOpacity, motionEnabled, resizeDebounceMs, settleSelector]);

  const items = React.Children.toArray(children);

  return (
    <div ref={wrapRef} {...{ [flowAttribute]: "" }} className={className}>
      <div
        data-flow-rail=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 left-[1.4rem] z-30 hidden w-px xl:left-6 xl:block"
      >
        <div data-flow-track="" className="absolute inset-0 bg-[var(--color-accent)]/24" />
        <div
          ref={lineRef}
          data-flow-fill=""
          className="absolute inset-0 origin-top bg-[var(--color-accent)]/80 will-change-transform"
        />
        {nodes.map((top, i) => (
          <FlowNode key={i} top={top} />
        ))}
      </div>

      {items.map((child, i) => (
        <div
          key={i}
          data-stack-surface=""
          className={surfaceClassName}
          style={{ zIndex: i + 1 }}
        >
          {child}
          <div
            data-cover-veil=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[60] bg-black opacity-0"
          />
        </div>
      ))}
      <div aria-hidden="true" data-footer-runway="" className="pointer-events-none h-svh" />
    </div>
  );
}
