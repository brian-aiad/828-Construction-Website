"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const PREFIX = "828";
const SUFFIX = "CONSTRUCTION";
const PREFIX_CHARS = PREFIX.split("");
const SUFFIX_CHARS = SUFFIX.split("");

export default function SplashScreen() {
  const splashRef    = useRef<HTMLDivElement>(null);
  const prefixRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const suffixRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const taglineRef   = useRef<HTMLSpanElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const releaseModalRef = useRef<() => void>(() => {});
  const [dismissed, setDismissed] = useState(false);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem("828:splash-seen", "1");
    } catch {}
    releaseModalRef.current();
    releaseModalRef.current = () => {};
    // Guarantee the hero lands full-frame after the modal releases.
    window.scrollTo(0, 0);
    setDismissed(true);
  }, []);
  const skip = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.progress(1);
      return;
    }
    dismiss();
  }, [dismiss]);

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 1279px)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactIntro = compactQuery.matches || coarseQuery.matches;
    if (compactIntro) {
      try {
        window.sessionStorage.setItem("828:splash-seen", "1");
      } catch {}
      const frame = requestAnimationFrame(() => setDismissed(true));
      return () => cancelAnimationFrame(frame);
    }

    try {
      if (window.sessionStorage.getItem("828:splash-seen") === "1") {
        const frame = requestAnimationFrame(() => setDismissed(true));
        return () => cancelAnimationFrame(frame);
      }
    } catch {}

    if (reducedMotionQuery.matches) {
      const frame = requestAnimationFrame(() => setDismissed(true));
      return () => cancelAnimationFrame(frame);
    }

    const splash    = splashRef.current;
    const underline = underlineRef.current;
    const tagline   = taglineRef.current;
    const pChars    = prefixRefs.current.filter(Boolean) as HTMLSpanElement[];
    const sChars    = suffixRefs.current.filter(Boolean) as HTMLSpanElement[];
    const allChars  = [...pChars, ...sChars];
    if (!splash || !underline || !tagline || allChars.length === 0) return;

    splash.setAttribute("role", "dialog");
    splash.setAttribute("aria-modal", "true");
    splash.setAttribute("aria-label", "828 Construction introduction");
    splash.removeAttribute("aria-hidden");
    splash.inert = false;
    splash.style.pointerEvents = "auto";
    splash.querySelector<HTMLButtonElement>("button")?.removeAttribute("tabindex");
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const main = document.querySelector<HTMLElement>("#main-content");
    const background = [
      document.querySelector<HTMLElement>(".skip-link"),
      document.querySelector<HTMLElement>("header"),
      document.querySelector<HTMLElement>("[data-footer-surface]"),
      ...Array.from(main?.children ?? []).filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element !== splash
      ),
    ].filter((element): element is HTMLElement => Boolean(element));
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });

    const focusFrame = requestAnimationFrame(() => {
      splash.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
        return;
      }
      if (event.key !== "Tab") return;
      const button = splash.querySelector<HTMLButtonElement>("button");
      if (!button) return;
      event.preventDefault();
      button.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);

    releaseModalRef.current = () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      const previousFocus = previousFocusRef.current;
      const focusTarget =
        previousFocus && previousFocus !== document.body && previousFocus.isConnected
          ? previousFocus
          : main;
      focusTarget?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };

    // Lock scrolling while the splash plays — wheel input during the intro
    // was leaving the page slightly scrolled, revealing a sliver of the
    // next section under the hero on first land.
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    gsap.set(splash, { opacity: 1 });
    gsap.set(pChars, { yPercent: 22, opacity: 0 });
    gsap.set(sChars, { yPercent: 18, opacity: 0 });
    gsap.set(underline, { scaleX: 0, opacity: 0 });
    gsap.set(tagline, { opacity: 0, y: 6 });

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
    tlRef.current = tl;

    const dismissForPreference = () => {
      if (compactQuery.matches || coarseQuery.matches || reducedMotionQuery.matches) {
        tl.progress(1);
      }
    };
    compactQuery.addEventListener("change", dismissForPreference);
    coarseQuery.addEventListener("change", dismissForPreference);
    reducedMotionQuery.addEventListener("change", dismissForPreference);

    // "828" rises in, letter by letter
    tl.to(pChars, {
      yPercent: 0,
      opacity: 1,
      stagger: { each: 0.025, from: "start" },
      duration: 0.42,
      ease: "power3.out",
    }, 0.08);

    // "CONSTRUCTION" follows
    tl.to(sChars, {
      yPercent: 0,
      opacity: 1,
      stagger: { each: 0.012, from: "start" },
      duration: 0.42,
      ease: "power3.out",
    }, 0.14);

    // maroon underline draws left-to-right
    tl.to(underline, { scaleX: 1, opacity: 1, duration: 0.28, ease: "power3.out" }, 0.52);

    // tagline fades in quietly during hold
    tl.to(tagline, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.66);

    // hold — the mark sits briefly, then clears fast enough for repeat visits to feel direct
    tl.to({}, { duration: 0.12 }, 0.84);

    // exit — tagline fades first
    tl.to(tagline, { opacity: 0, duration: 0.12, ease: "sine.in" }, 0.98);

    // chars drift upward and dissolve
    tl.to(allChars, {
      yPercent: -18,
      opacity: 0,
      stagger: { each: 0.006, from: "start" },
      duration: 0.22,
      ease: "power2.inOut",
    }, 1);

    // underline retracts
    tl.to(underline, { scaleX: 0, opacity: 0, duration: 0.18, ease: "power3.inOut" }, 1.02);

    // curtain clears
    tl.to(splash, {
      opacity: 0,
      duration: 0.28,
      ease: "power2.inOut",
      onComplete: dismiss,
    }, 1.12);

    return () => {
      compactQuery.removeEventListener("change", dismissForPreference);
      coarseQuery.removeEventListener("change", dismissForPreference);
      reducedMotionQuery.removeEventListener("change", dismissForPreference);
      releaseModalRef.current();
      releaseModalRef.current = () => {};
      tl.kill();
      tlRef.current = null;
    };
  }, [dismiss, skip]);

  if (dismissed) return null;

  return (
    <div
      ref={splashRef}
      aria-hidden="true"
      inert
      className="splash-screen"
      style={{
        position: "fixed", inset: 0, zIndex: 9980,
        background: "var(--color-splash-background)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "1.05rem",
        opacity: 0, pointerEvents: "none",
      }}
    >
      {/* wordmark */}
      <div className="splash-wordmark" style={{
        position: "relative",
        display: "flex", alignItems: "baseline", gap: "0.18em",
        fontFamily: "var(--font-inter), 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
        fontSize: "clamp(1.1rem, 2.2vw, 1.85rem)",
        letterSpacing: "0",
        textTransform: "uppercase",
        color: "#fff",
        lineHeight: 1,
        userSelect: "none",
      }}>
        {/* "828" + underline */}
        <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
          {PREFIX_CHARS.map((char, i) => (
            <span
              key={i}
              ref={(el) => { prefixRefs.current[i] = el; }}
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {char}
            </span>
          ))}
          <span
            ref={underlineRef}
            aria-hidden="true"
            style={{
              position: "absolute", left: 0, right: 0, bottom: "-0.2em",
              height: "0.065em", background: "var(--color-accent)",
              transformOrigin: "left center", pointerEvents: "none",
            }}
          />
        </span>

        {/* "CONSTRUCTION" */}
        <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {SUFFIX_CHARS.map((char, i) => (
            <span
              key={i}
              ref={(el) => { suffixRefs.current[i] = el; }}
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>

      {/* quiet tagline that fades in during hold */}
      <span
        ref={taglineRef}
        className="splash-tagline"
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.48rem, 0.9vw, 0.68rem)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.36)",
          opacity: 0,
        }}
      >
        Torrance / CA / Since 2004
      </span>

      <button
        onClick={skip}
        aria-label="Skip intro"
        tabIndex={-1}
        className="splash-skip"
        style={{
          position: "absolute", bottom: "2rem", right: "2rem",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "9px", color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.22em", textTransform: "uppercase",
          background: "none", border: "none", cursor: "pointer",
          padding: "0.5rem", transition: "color 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; }}
      >
        Skip
      </button>
    </div>
  );
}
