"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// V2 cinematic intro — plays once per session (sessionStorage gate).
// "828 Construction" ONE LINE, Space Grotesk Bold, vertical gradient background.
// Each letter slides up from 28px below — NS Builders signature reveal.
// Total ~2.9s. Skip button bottom-right. Prefers-reduced-motion respected.

const CHARS_828: string[] = ["8", "2", "8"];
const CHARS_CONSTRUCTION: string[] = [
  "C","o","n","s","t","r","u","c","t","i","o","n",
];

export default function SplashScreen() {
  const splashRef = useRef<HTMLDivElement>(null);
  const chars828Refs = useRef<(HTMLSpanElement | null)[]>([]);
  const charsConstrRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => setDismissed(true);

  const skip = () => {
    if (tlRef.current) {
      tlRef.current.progress(1);
    } else {
      dismiss();
    }
  };

  useEffect(() => {
    const seen = sessionStorage.getItem("828-splash-seen");
    const splash = splashRef.current;
    if (!splash) return;

    if (seen) {
      splash.style.pointerEvents = "none";
      dismiss();
      return;
    }

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(splash, { opacity: 1 });
      gsap.to(splash, {
        opacity: 0,
        duration: 0.4,
        delay: 0.6,
        onComplete: () => {
          sessionStorage.setItem("828-splash-seen", "1");
          dismiss();
        },
      });
      return;
    }

    gsap.set(splash, { opacity: 1 });

    const chars828 = chars828Refs.current.filter(Boolean) as HTMLSpanElement[];
    const charsConstr = charsConstrRefs.current.filter(Boolean) as HTMLSpanElement[];
    const allChars = [...chars828, ...charsConstr];

    // Vertical slide-up from 28px below — NS Builders signature
    gsap.set(allChars, { y: 28, opacity: 0 });
    if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("828-splash-seen", "1");
        dismiss();
      },
    });
    tlRef.current = tl;

    // IN: "828" chars (40ms stagger per char)
    tl.to(
      chars828,
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.55, ease: "power3.out" },
      0
    );

    // IN: "Construction" chars (slight delayed start — word gap)
    tl.to(
      charsConstr,
      { y: 0, opacity: 1, stagger: 0.032, duration: 0.55, ease: "power3.out" },
      0.18
    );

    // Maroon underline draws left → right
    if (underlineRef.current) {
      tl.to(
        underlineRef.current,
        { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
        0.28
      );
    }

    // Hold (all fully visible)
    tl.to({}, { duration: 0.88 });

    // OUT: all chars left → right (25ms per char)
    tl.to(allChars, {
      y: 20,
      opacity: 0,
      stagger: { each: 0.025, from: "start" },
      duration: 0.35,
      ease: "power2.in",
    });

    // Dissolve overlay
    tl.to(
      splash,
      { opacity: 0, duration: 0.28, ease: "power2.in" },
      "-=0.06"
    );

    return () => {
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
        position: "fixed",
        inset: 0,
        zIndex: 9980,
        background: "var(--gradient-splash-vertical)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        pointerEvents: "auto",
      }}
    >
      {/* "828 Construction" — ONE LINE, Space Grotesk Bold, V2 NS Builders style */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          userSelect: "none",
          gap: 0,
        }}
      >
        {/* "828" word — relative wrapper holds the maroon underline */}
        <div style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
          <div
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            {CHARS_828.map((char, i) => (
              <span
                key={i}
                ref={(el) => { chars828Refs.current[i] = el; }}
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Maroon underline — scaleX 0→1 from left */}
          <div
            ref={underlineRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "2%",
              right: "2%",
              height: "3px",
              background: "var(--color-accent)",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* Space between "828" and "Construction" */}
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
            display: "inline-block",
            width: "0.3em",
          }}
          aria-hidden="true"
        />

        {/* "Construction" word — inline block, nowrap prevents mid-word break */}
        <div
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "baseline",
            whiteSpace: "nowrap",
          }}
        >
          {CHARS_CONSTRUCTION.map((char, i) => (
            <span
              key={i}
              ref={(el) => { charsConstrRefs.current[i] = el; }}
              style={{ display: "inline-block" }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Skip button — bottom right, subtle */}
      <button
        onClick={skip}
        aria-label="Skip intro"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "9px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.5rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.22)";
        }}
      >
        Skip ↓
      </button>
    </div>
  );
}
