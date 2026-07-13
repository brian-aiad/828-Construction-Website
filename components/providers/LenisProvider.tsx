"use client";

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });
ScrollTrigger.config({ ignoreMobileResize: true });

// ── Global animation failsafe ──────────────────────────────────────────────────
// Elements with data-gsap-reveal="true" start at opacity:0 or clipPath:hidden via
// GSAP. If their ScrollTrigger fires correctly, they reveal as intended. If the
// trigger misfires (stale positions, navigation race, etc.), this observer gives
// them a 2s grace window while in-viewport, then force-reveals them so users
// never see permanently invisible content on a live production site.
function attachRevealFailsafe() {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

  const GRACE_MS = 2500;

  const shouldForceReveal = (el: HTMLElement): boolean => {
    if (!el.isConnected) return false;
    const style = window.getComputedStyle(el);
    const opacity = parseFloat(style.opacity);
    const clip = style.clipPath;
    // Invisible: opacity near 0 OR fully clipped via inset
    if (opacity < 0.08) return true;
    if (clip && (
      clip.includes("inset(100%") ||
      clip.includes("inset(0% 100%") ||
      clip.includes("inset(0% 0% 100%")
    )) return true;
    return false;
  };

  const forceReveal = (el: HTMLElement) => {
    gsap.to(el, {
      // autoAlpha (not bare opacity): GSAP's autoAlpha-hidden elements carry
      // visibility:hidden alongside opacity:0 — restoring only opacity left
      // them invisible and "rescued" at the same time (found 2026-07-13).
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      x: 0,
      yPercent: 0,
      xPercent: 0,
      scale: 1,
      duration: 0.55,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);

        setTimeout(() => {
          if (shouldForceReveal(el)) forceReveal(el);
        }, GRACE_MS);
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
  );

  // Explicit data-gsap-reveal targets
  document.querySelectorAll<HTMLElement>("[data-gsap-reveal]").forEach((el) => observer.observe(el));

  // Broader catch: any element with GSAP-applied inline clipPath or opacity:0
  // This catches elements that weren't tagged but still need recovery.
  document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const s = el.style;
    if (!s) return;
    // Skip aria-hidden decorative elements (ghost numbers, watermarks)
    if (el.getAttribute("aria-hidden") === "true") return;
    // Skip self-managed hidden UI (toasts, overlays) — force-revealing these
    // paints stuck chrome over the page (see PhoneCopyToast, 2026-07-09).
    if (el.hasAttribute("data-failsafe-exempt")) return;
    const hasHiddenClip = s.clipPath && (
      s.clipPath.includes("inset(100%") ||
      s.clipPath.includes("inset(0% 100%") ||
      s.clipPath.includes("inset(0% 0% 100%")
    );
    const hasZeroOpacity = s.opacity === "0";
    if (hasHiddenClip || hasZeroOpacity) {
      observer.observe(el);
    }
  });

  return observer;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isFirstMount = useRef(true);
  const failsafeObserverRef = useRef<IntersectionObserver | null>(null);

  const refreshMotion = useCallback(() => {
    if (lenisRef.current) lenisRef.current.resize();
    ScrollTrigger.refresh(true);
    failsafeObserverRef.current?.disconnect();
    failsafeObserverRef.current = attachRevealFailsafe() ?? null;
  }, []);

  // ── Scroll restoration — fires synchronously before any useEffect ──────────
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;

      // Scroll reset
      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
      } else if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }

      // On hard refresh: trigger positions are calculated before images finish
      // loading. Refresh after window.load so layout is final.
      const doRefresh = () => {
        refreshMotion();
      };

      if (document.readyState === "complete") {
        // Already loaded — refresh on next frame (after this effect batch)
        requestAnimationFrame(() => requestAnimationFrame(doRefresh));
      } else {
        window.addEventListener("load", doRefresh, { once: true });
      }

      // Cleanup runs when navigating away from the initial page.
      // Must be in CLEANUP (not body) so it fires BEFORE the new page's
      // children useEffects create their ScrollTriggers.
      return () => {
        window.scrollTo(0, 0);
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }

    // ── Client-side navigation ────────────────────────────────────────────
    // Triggers from the departing page were already killed in the CLEANUP of the
    // previous effect run (see return below). This effect body only needs to scroll
    // to top and schedule the post-mount refresh — it must NOT kill triggers here
    // because the new page's children useEffects have already run and created their
    // ScrollTriggers by the time this parent effect body executes.
    if (window.innerWidth < 768) {
      window.scrollTo(0, 0);
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    const refreshTimer = setTimeout(() => {
      refreshMotion();
    }, 300);

    return () => {
      clearTimeout(refreshTimer);
      // Kill departing page's triggers in CLEANUP so they're gone before the
      // next page's children effects run and create fresh triggers.
      window.scrollTo(0, 0);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname, refreshMotion]);

  useEffect(() => {
    if (window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.88,
    });

    lenisRef.current = lenis;
    // Global handle: Lenis owns desktop scroll, so anything that needs a
    // programmatic glide (junction settle, anchor jumps) must go THROUGH it —
    // raw window.scrollTo animations get reconciled away by Lenis' raf.
    (window as unknown as { __lenis828?: Lenis }).__lenis828 = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Initial refresh — fires after all children useEffects have created their
    // ScrollTriggers. Recalculates positions with correct scroll origin (Y=0).
    ScrollTrigger.refresh();

    document.fonts?.ready
      .then(() => {
        lenis.resize();
        ScrollTrigger.refresh(true);
      })
      .catch(() => {});

    // ── Resize ───────────────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        refreshMotion();
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Visibility change ─────────────────────────────────────────────────────
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
      failsafeObserverRef.current?.disconnect();
      lenis.destroy();
      delete (window as unknown as { __lenis828?: Lenis }).__lenis828;
      lenisRef.current = null;
      gsap.ticker.remove(tick);
    };
  }, [refreshMotion]);

  return <>{children}</>;
}
