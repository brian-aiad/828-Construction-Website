"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
import FlowNode from "@/components/system/FlowNode";
import { useJunctionSettle } from "@/components/home/useJunctionSettle";

gsap.registerPlugin(ScrollTrigger);

// Faithful contact-page copy of components/services/adu/AduFlow.tsx (itself the
// canonical AboutFlow stacked-surface grammar — measured sticky tops, gap-free
// opacity veil, plumb line + igniting nodes). Deviations, both required here,
// are marked CONTACT-ONLY:
//   1. The service-path rows expand a photo strip on mobile when a row ignites,
//      changing surface heights after mount — the debounced ResizeObserver
//      re-applies stack tops (same rationale as ADU's FAQ expanders).
//   2. Two surfaces are light (#f7f7f3 prep + paths), so the idle track keeps
//      AduFlow's subtle shadow to stay legible crossing the light bands.

export default function ContactFlow({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

  // Scroll-end settle: never rest half-covered at a junction (Fix 26, additive).
  useJunctionSettle(wrapRef);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

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

    // CONTACT-ONLY: the mobile row-photo strips resize their surface after
    // mount; stale sticky tops open junction gaps. Debounced past the 700ms
    // strip transition.
    let roTimer: ReturnType<typeof setTimeout> | undefined;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (roTimer) clearTimeout(roTimer);
            roTimer = setTimeout(() => {
              applyStackTops();
              measure();
              try {
                ScrollTrigger.refresh();
              } catch {}
            }, 780);
          })
        : undefined;
    stacks.forEach((el) => ro?.observe(el));

    if (!AnimationController.shouldAnimate()) {
      return () => {
        window.removeEventListener("resize", onResize);
        if (roTimer) clearTimeout(roTimer);
        ro?.disconnect();
      };
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
      if (roTimer) clearTimeout(roTimer);
      ro?.disconnect();
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const items = React.Children.toArray(children);

  return (
    <div ref={wrapRef} data-contact-flow="" className="relative z-10 bg-[#050505]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 left-[1.4rem] z-30 hidden w-px lg:block xl:left-6"
      >
        <div
          className="absolute inset-0 bg-white/[0.07]"
          style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08)" }}
        />
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
