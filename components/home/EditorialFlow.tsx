"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// The connective tissue of the home page, two layers deep:
//
// 1. Stacked surfaces — every child section becomes position:sticky with a
//    measured negative top, so once a section has been fully read it holds
//    still while the next surface rides up and over it (the NS "one page"
//    feel). The covered surface settles back in scale and dims slightly for
//    depth. The last child stays in normal flow so the footer junction is
//    untouched.
//
// 2. Plumb line — one continuous maroon thread drawn down the left margin of
//    the whole region as the reader scrolls, with nodes that ignite per
//    section.

export default function EditorialFlow({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    const stacks = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-stack-surface]")
    );

    // Stacked surfaces — measured sticky tops (taller-than-viewport sections
    // stick only once their bottom reaches the viewport bottom).
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

    // Node positions for the plumb line
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

    if (!AnimationController.shouldAnimate()) {
      return () => window.removeEventListener("resize", onResize);
    }

    const ctx = gsap.context(() => {
      // Covered surfaces settle back while the next rides over them. Keep the
      // surface itself opaque; fading the whole section makes unrelated layers
      // bleed through during the overlap.
      stacks.forEach((el, i) => {
        const next = stacks[i + 1];
        if (!next) return;
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 0.975,
            ease: "none",
            transformOrigin: "center 80%",
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
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const items = React.Children.toArray(children);

  return (
    <div
      ref={wrapRef}
      data-editorial-flow=""
      className="relative z-10 mt-[4svh]"
    >
      {/* Plumb line — lives in the outer margin, desktop only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 left-[1.4rem] z-30 hidden w-px lg:block xl:left-6"
      >
        <div className="absolute inset-0 bg-black/[0.07]" />
        <div ref={lineRef} className="absolute inset-0 bg-[var(--color-accent)]/65" />
        {nodes.map((top, i) => (
          <FlowNode key={i} top={top} wrapRef={wrapRef} />
        ))}
      </div>

      {items.map((child, i) => (
        <div
          key={i}
          data-stack-surface=""
          data-header-light=""
          className="bg-[#f7f7f3] shadow-[0_-28px_90px_-64px_rgba(0,0,0,0.55)]"
          style={{ zIndex: i + 1, willChange: i < items.length - 1 ? "transform" : undefined }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function FlowNode({
  top,
  wrapRef,
}: {
  top: number;
  wrapRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const wrap = wrapRef.current;
    if (!dot || !wrap) return;
    if (!AnimationController.shouldAnimate()) return;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: `top+=${top} 72%`,
      onEnter: () => dot.classList.add("flow-node-lit"),
      onLeaveBack: () => dot.classList.remove("flow-node-lit"),
    });

    return () => st.kill();
  }, [top, wrapRef]);

  return (
    <div
      ref={dotRef}
      className="flow-node absolute -left-[3.5px] h-2 w-2 rotate-45 border border-black/25 bg-[#f7f7f3] transition-colors duration-500"
      style={{ top }}
    />
  );
}
