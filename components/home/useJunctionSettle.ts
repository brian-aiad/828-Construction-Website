"use client";

import { useEffect } from "react";
import { AnimationController } from "@/utils/animationControl";

// Junction snap/settle for the home stacked-surface flow (Brian, 2026-07-10).
//
// The covers are clean IN MOTION, but when the reader STOPS mid-junction the
// page can rest half-covered — the previous surface peeking above the incoming
// one (his "hero sliver above the cream SINCE 2004 surface"). This finishes the
// gesture: after scroll settles inside a cover transition, glide to the nearest
// clean boundary so the page never RESTS half-covered.
//
// Geometry (no natural-offset math needed): in this flow exactly one surface at
// a time is mid-cover, and that surface's live viewport-top travels vh -> 0 as
// it covers the one before it. So `top ∈ (0, vh)` == "mid-junction".
// The settle is DIRECTION-AWARE (not 50%-based): resting mid-junction after
// scrolling DOWN completes the cover (scroll +top, top→0); after scrolling UP
// it backs off (scroll -(vh-top), top→vh). A percent rule traps gentle
// scrollers — every small forward step under 50% gets undone and the reader
// can never cross the junction. Direction always honors the gesture.
//
// Drive: Lenis owns desktop scroll — a raw window.scrollTo glide gets
// reconciled away by Lenis' raf (torture run: 18/40 stops still rested
// half-covered). The glide must go THROUGH lenis.scrollTo (window.__lenis828,
// exposed by LenisProvider); the rAF path below is only a fallback for the
// no-Lenis case. We never fight the reader: settle only fires after a genuine
// ~180ms scroll-end and cancels instantly on any real input. It lands OUTSIDE
// the band, so it can never re-trigger itself. Desktop only; reduced-motion /
// mobile opt out via AnimationController (Lenis is inactive there and surfaces
// stack flush anyway).

const MARGIN = 32; // px from a clean edge that still counts as "resting clean"
const IDLE_MS = 180; // quiet window that marks a genuine scroll-end
const GLIDE_MS = 520; // settle glide duration — reads as finishing, not yanking

export function useJunctionSettle(
  wrapRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return; // reduced-motion / mobile
    if (typeof window === "undefined" || window.innerWidth < 1024) return; // desktop (Lenis)
    const wrap = wrapRef.current;
    if (!wrap) return;

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let glideRAF = 0;
    let settling = false;
    let cancelled = false;
    let lastY = window.scrollY;
    let direction: 1 | -1 | 0 = 0;

    const activeJunctionTop = (): number | null => {
      const vh = window.innerHeight;
      const surfaces = wrap.querySelectorAll<HTMLElement>("[data-stack-surface]");
      for (const el of surfaces) {
        const top = el.getBoundingClientRect().top;
        if (top > MARGIN && top < vh - MARGIN) return top;
      }
      return null;
    };

    const glideTo = (targetY: number) => {
      settling = true;
      cancelled = false;
      const lenis = (
        window as unknown as {
          __lenis828?: {
            scrollTo: (
              y: number,
              opts: {
                duration: number;
                easing: (t: number) => number;
                onComplete?: () => void;
              }
            ) => void;
          };
        }
      ).__lenis828;
      if (lenis) {
        lenis.scrollTo(targetY, {
          duration: GLIDE_MS / 1000,
          easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
          onComplete: () => {
            settling = false;
          },
        });
        return;
      }
      // Fallback (no Lenis): manual rAF glide.
      const fromY = window.scrollY;
      const dist = targetY - fromY;
      const t0 = performance.now();
      const tick = (now: number) => {
        if (cancelled) { settling = false; return; }
        const k = Math.min(1, (now - t0) / GLIDE_MS);
        const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
        window.scrollTo(0, Math.round(fromY + dist * e));
        if (k < 1) glideRAF = window.requestAnimationFrame(tick);
        else settling = false;
      };
      glideRAF = window.requestAnimationFrame(tick);
    };

    const onScrollEnd = () => {
      if (settling || direction === 0) return;
      const top = activeJunctionTop();
      if (top === null) return;
      const vh = window.innerHeight;
      const target =
        direction === 1
          ? window.scrollY + top // scrolling down → complete the cover
          : window.scrollY - (vh - top); // scrolling up → back off to uncovered
      if (Math.abs(target - window.scrollY) < 2) return;
      glideTo(Math.max(0, target));
    };

    const arm = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(onScrollEnd, IDLE_MS);
    };

    // Our own glide fires scroll events — ignore those; only re-arm for input-
    // driven scrolling (scrollbar drag included, which emits scroll not wheel).
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 1 && !settling) {
        direction = y > lastY ? 1 : -1;
      }
      lastY = y;
      if (settling) return;
      arm();
    };
    const cancel = () => {
      cancelled = true;
      settling = false;
      window.cancelAnimationFrame(glideRAF);
      arm(); // a fresh stop after the input can still settle
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    window.addEventListener("pointerdown", cancel);

    return () => {
      clearTimeout(idleTimer);
      window.cancelAnimationFrame(glideRAF);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("pointerdown", cancel);
    };
  }, [wrapRef]);
}
