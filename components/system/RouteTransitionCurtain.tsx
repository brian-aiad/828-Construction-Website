"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const COVER_MS = 260;
const REVEAL_MS = 640;

export default function RouteTransitionCurtain() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const firstPathRef = useRef(pathname);
  const intentStartedAtRef = useRef(0);
  const phaseTimerRef = useRef<number | undefined>(undefined);
  const safetyTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onNavigationIntent = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (
        destination.origin !== current.origin ||
        (destination.pathname === current.pathname &&
          destination.search === current.search)
      ) {
        return;
      }

      const curtain = curtainRef.current;
      if (!curtain) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      intentStartedAtRef.current = performance.now();
      curtain.dataset.phase = "covering";
      clearTimeout(phaseTimerRef.current);
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = window.setTimeout(() => {
        delete curtain.dataset.phase;
      }, 4000);
    };

    document.addEventListener("click", onNavigationIntent, true);
    return () => {
      document.removeEventListener("click", onNavigationIntent, true);
      clearTimeout(phaseTimerRef.current);
      clearTimeout(safetyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain || firstPathRef.current === pathname) {
      firstPathRef.current = pathname;
      return;
    }

    firstPathRef.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      delete curtain.dataset.phase;
      return;
    }

    clearTimeout(phaseTimerRef.current);
    clearTimeout(safetyTimerRef.current);
    const elapsed = intentStartedAtRef.current
      ? performance.now() - intentStartedAtRef.current
      : 0;
    if (!intentStartedAtRef.current) curtain.dataset.phase = "covering";

    let revealFrame = 0;
    let revealPaintFrame = 0;
    phaseTimerRef.current = window.setTimeout(() => {
      curtain.dataset.phase = "covered";
      revealFrame = requestAnimationFrame(() => {
        revealPaintFrame = requestAnimationFrame(() => {
          curtain.dataset.phase = "revealing";
          safetyTimerRef.current = window.setTimeout(() => {
            delete curtain.dataset.phase;
            intentStartedAtRef.current = 0;
          }, REVEAL_MS);
        });
      });
    }, Math.max(0, COVER_MS - elapsed));

    return () => {
      if (revealFrame) cancelAnimationFrame(revealFrame);
      if (revealPaintFrame) cancelAnimationFrame(revealPaintFrame);
      clearTimeout(phaseTimerRef.current);
      clearTimeout(safetyTimerRef.current);
    };
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      data-route-curtain=""
      className="pointer-events-none fixed inset-0 z-[100] origin-bottom bg-black"
      aria-hidden="true"
    >
      <span className="absolute top-1/2 left-0 right-0 h-px origin-left bg-[var(--color-accent)]" />
    </div>
  );
}
