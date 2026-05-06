"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Cinematic intro splash — plays once per session (sessionStorage gate).
// "828" large monospace + copper underline; "CONSTRUCTION" display font.
// Total ~2.9s. Skip button bottom-right. Prefers-reduced-motion respected.

const CHARS_828: string[] = ["8", "2", "8"];
const CHARS_CONSTRUCTION: string[] = [
  "C","O","N","S","T","R","U","C","T","I","O","N",
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

    // Respect prefers-reduced-motion
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

    // First visit — play full cinematic sequence
    gsap.set(splash, { opacity: 1 });

    const chars828 = chars828Refs.current.filter(Boolean) as HTMLSpanElement[];
    const charsConstr = charsConstrRefs.current.filter(Boolean) as HTMLSpanElement[];
    const allChars = [...chars828, ...charsConstr];

    gsap.set(allChars, { y: 14, opacity: 0 });
    if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("828-splash-seen", "1");
        dismiss();
      },
    });
    tlRef.current = tl;

    // IN: "828" chars (stagger 40ms per char)
    tl.to(
      chars828,
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.55, ease: "power3.out" },
      0
    );

    // IN: "CONSTRUCTION" chars (slight delayed start)
    tl.to(
      charsConstr,
      { y: 0, opacity: 1, stagger: 0.032, duration: 0.55, ease: "power3.out" },
      0.18
    );

    // Copper underline draws left → right
    if (underlineRef.current) {
      tl.to(
        underlineRef.current,
        { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
        0.28
      );
    }

    // Hold (all fully visible)
    tl.to({}, { duration: 0.88 });

    // OUT: all chars left → right (stagger 25ms per char)
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
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0, // useEffect sets to 1 on first visit; invisible for returning visitors
        pointerEvents: "auto",
      }}
    >
      <div style={{ textAlign: "center", userSelect: "none" }}>

        {/* "828" — large IBM Plex Mono numerals with copper underline */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "0.5rem" }}>
          <div
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontWeight: 700,
              fontSize: "clamp(5rem, 16vw, 13rem)",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              display: "flex",
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

          {/* Copper underline — scaleX 0→1 from left */}
          <div
            ref={underlineRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "3%",
              right: "3%",
              height: "3px",
              background: "#B87333",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* "CONSTRUCTION" — Space Grotesk display, small, ultra-wide tracking */}
        <div
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(0.7rem, 2vw, 1.5rem)",
            color: "#fff",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            marginTop: "1.4rem",
            display: "flex",
            justifyContent: "center",
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
