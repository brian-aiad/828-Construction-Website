"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
import FlowNode from "@/components/system/FlowNode";
import { useJunctionSettle } from "@/components/system/useJunctionSettle";
import { useStackSurfaceVisibility } from "@/components/system/useStackSurfaceVisibility";

gsap.registerPlugin(ScrollTrigger);

// Desktop restores the homepage stacked-surface grammar: each section pins,
// the next section covers it, and scroll-end settles to a clean boundary.
// Touch/tablet layouts remain normal flow for stability and form ergonomics.
export default function AboutFlow({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

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
        el.style.position = "sticky";
        el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
      });
    };

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

    applyStackTops();
    measure();

    const onResize = () => {
      applyStackTops();
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });

    let roTimer: ReturnType<typeof setTimeout> | undefined;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            clearTimeout(roTimer);
            roTimer = setTimeout(() => {
              applyStackTops();
              measure();
              ScrollTrigger.refresh();
            }, 180);
          })
        : undefined;
    stacks.forEach((el) => ro?.observe(el));

    if (!AnimationController.shouldAnimate()) {
      return () => {
        window.removeEventListener("resize", onResize);
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
            opacity: light ? 0.08 : 0.28,
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
      ro?.disconnect();
      ctx.revert();
    };
  }, []);

  const items = React.Children.toArray(children);

  return (
    <div ref={wrapRef} data-about-flow="" className="relative z-10 bg-[#050505]">
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
