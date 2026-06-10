"use client";

import { useEffect, useRef, useState } from "react";
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
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem("828:splash-seen", "1");
    } catch {}
    // Release the splash scroll lock and guarantee the hero lands full-frame
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
    setDismissed(true);
  };
  const skip    = () => {
    if (tlRef.current) {
      tlRef.current.progress(1);
      return;
    }
    dismiss();
  };

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("828:splash-seen") === "1") {
        const frame = requestAnimationFrame(() => setDismissed(true));
        return () => cancelAnimationFrame(frame);
      }
    } catch {}

    const splash    = splashRef.current;
    const underline = underlineRef.current;
    const tagline   = taglineRef.current;
    const pChars    = prefixRefs.current.filter(Boolean) as HTMLSpanElement[];
    const sChars    = suffixRefs.current.filter(Boolean) as HTMLSpanElement[];
    const allChars  = [...pChars, ...sChars];
    if (!splash || !underline || !tagline || allChars.length === 0) return;

    // Lock scrolling while the splash plays — wheel input during the intro
    // was leaving the page slightly scrolled, revealing a sliver of the
    // next section under the hero on first land.
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(splash, { opacity: 1 });
      gsap.to(splash, { opacity: 0, duration: 0.4, delay: 1.1, onComplete: dismiss });
      return;
    }

    gsap.set(splash,   { opacity: 1, clipPath: "inset(0 0 0% 0)" });
    gsap.set(allChars, { yPercent: 56, rotationX: 14, opacity: 0, scale: 0.97, filter: "blur(3px)", transformOrigin: "50% 80%" });
    gsap.set(underline,{ scaleX: 0, opacity: 0 });
    gsap.set(tagline,  { opacity: 0, yPercent: 6 });

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
    tlRef.current = tl;

    // "828" rises in, letter by letter
    tl.to(pChars, {
      yPercent: 0, rotationX: 0, opacity: 1, scale: 1, filter: "blur(0px)",
      stagger: { each: 0.05, from: "start" },
      duration: 0.95, ease: "expo.out",
    }, 0.18);

    // "CONSTRUCTION" follows
    tl.to(sChars, {
      yPercent: 0, rotationX: 0, opacity: 1, scale: 1, filter: "blur(0px)",
      stagger: { each: 0.028, from: "start" },
      duration: 0.88, ease: "expo.out",
    }, 0.34);

    // maroon underline draws left-to-right
    tl.to(underline, { scaleX: 1, opacity: 1, duration: 0.62, ease: "power4.out" }, 1.22);

    // tagline fades in quietly during hold
    tl.to(tagline, { opacity: 1, yPercent: 0, duration: 0.55, ease: "power2.out" }, 1.64);

    // hold — the mark sits briefly, then clears fast enough for repeat visits to feel direct
    tl.to({}, { duration: 0.42 }, 1.74);

    // exit — tagline fades first
    tl.to(tagline, { opacity: 0, duration: 0.22, ease: "sine.in" }, 2.18);

    // chars drift upward and dissolve
    tl.to(allChars, {
      yPercent: -38, opacity: 0, filter: "blur(4px)",
      stagger: { each: 0.016, from: "start" },
      duration: 0.45, ease: "power2.inOut",
    }, 2.22);

    // underline retracts
    tl.to(underline, { scaleX: 0, opacity: 0, duration: 0.28, ease: "power3.inOut" }, 2.24);

    // curtain wipes up
    tl.to(splash, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.58, ease: "expo.inOut",
      onComplete: dismiss,
    }, 2.54);

    return () => {
      document.body.style.overflow = "";
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      ref={splashRef}
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 9980,
        background: "var(--gradient-splash-vertical)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "1.4em",
        opacity: 0, pointerEvents: "auto",
      }}
    >
      {/* maroon vignette from bottom */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(99,26,22,0.20) 0%, rgba(99,26,22,0.06) 28%, transparent 52%)",
      }} />

      {/* wordmark */}
      <div className="splash-wordmark" style={{
        position: "relative",
        display: "flex", alignItems: "baseline", gap: "0.18em",
        fontFamily: "var(--font-inter), 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
        fontSize: "clamp(0.82rem, 2.4vw, 1.82rem)",
        letterSpacing: "-0.01em",
        textTransform: "uppercase",
        color: "#fff",
        lineHeight: 1,
        userSelect: "none",
        perspective: "900px",
        perspectiveOrigin: "50% 50%",
      }}>
        {/* "828" + underline */}
        <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
          {PREFIX_CHARS.map((char, i) => (
            <span
              key={i}
              ref={(el) => { prefixRefs.current[i] = el; }}
              style={{ display: "inline-block", transformStyle: "preserve-3d", willChange: "transform, opacity, filter" }}
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
              style={{ display: "inline-block", transformStyle: "preserve-3d", willChange: "transform, opacity, filter" }}
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
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.48rem, 0.9vw, 0.68rem)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.28)",
          opacity: 0,
        }}
      >
        Torrance · CA · Since 2004
      </span>

      <button
        onClick={skip}
        aria-label="Skip intro"
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
