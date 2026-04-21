"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Tracks whether this is the initial mount vs a client-side navigation.
  // On initial mount (hard refresh) React fires children effects BEFORE parent
  // effects. Page components create ScrollTriggers first, then LenisProvider's
  // [pathname] effect runs — and without this guard it would kill all those
  // freshly-created triggers, leaving every image stuck at opacity:0/clipPath
  // hidden forever. On navigation Next.js renders new page content behind a
  // Suspense boundary, so the [pathname] effect fires before the new page's
  // effects and the kill is safe.
  const isFirstMount = useRef(true);

  // ── Scroll restoration — useLayoutEffect fires BEFORE all useEffects ─────
  // useLayoutEffect is synchronous and runs after React's DOM commit but before
  // the browser paints. Crucially, it runs before ANY useEffect (including
  // children's GSAP setup). This guarantees window.scrollY = 0 when page
  // components create their ScrollTriggers in their own useEffects.
  //
  // The original useEffect version ran AFTER GSAP was already initialised —
  // too late if the browser had restored a mid-page scroll position.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // ── Belt-and-suspenders useEffect version (preserved for SSR edge-cases) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Initial mount: skip the trigger kill.
    // Triggers were just created by page-component effects (children before
    // parents in React's effect order). Killing here would destroy them and
    // leave the page permanently broken until a full reload or navigation.
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // Still reset scroll position as belt-and-suspenders.
      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
      } else if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }

    // Navigation: kill all active ScrollTriggers from the departing page
    // BEFORE scrolling. lenis.scrollTo(0, { immediate }) fires the "scroll"
    // event which calls ScrollTrigger.update — executing every onUpdate
    // callback. If React is simultaneously unmounting the old page, those
    // callbacks run on detached nodes → "removeChild" NotFoundError.
    ScrollTrigger.getAll().forEach((st) => st.kill());

    if (window.innerWidth < 768) {
      window.scrollTo(0, 0);
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // After Lenis connects, refresh all ScrollTrigger positions. Page
    // components' triggers were created before Lenis was wired in; this
    // ensures they reflect the correct scroll origin (Y=0 after the
    // useLayoutEffect reset above).
    ScrollTrigger.refresh();

    // ── Resize: ScrollTrigger positions go stale after window resize ─────
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Visibility: tab switch back can leave Lenis out of sync ──────────
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        ScrollTrigger.refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(tick);
    };
  }, []);

  return <>{children}</>;
}
