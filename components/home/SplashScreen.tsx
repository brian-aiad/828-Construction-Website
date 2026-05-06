"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// V2 cinematic intro — plays once per session (sessionStorage gate).
// "828 Construction" ONE LINE, Space Grotesk Bold, vertical gradient background.
// Each letter slides up from 28px below — NS Builders signature reveal.
// V3: rotateX channel + gradient ignition overlay + curtain wipe exit.

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
  const [ignitionProgress, setIgnitionProgress] = useState(0);

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

    // Set initial clip-path for curtain exit
    gsap.set(splash, { opacity: 1, clipPath: "inset(0 0 0% 0)" });

    const chars828 = chars828Refs.current.filter(Boolean) as HTMLSpanElement[];
    const charsConstr = charsConstrRefs.current.filter(Boolean) as HTMLSpanElement[];
    const allChars = [...chars828, ...charsConstr];

    // Mask-cut reveal: chars slide up from below overflow-hidden parent + rotateX
    gsap.set(allChars, { yPercent: 110, rotateX: 88 });
    if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 0 });

    // No onComplete on the timeline — new one is on the last tween
    const tl = gsap.timeline();
    tlRef.current = tl;

    // IN: "828" chars — rotateX + slide reveal
    tl.to(
      chars828,
      { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.04, duration: 0.9, ease: "power4.out" },
      0
    );

    // IN: "Construction" chars (slight delayed start — word gap)
    tl.to(
      charsConstr,
      { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.032, duration: 0.9, ease: "power4.out" },
      0.18
    );

    // Gradient ignition — peaks at midpoint then decays
    tl.to({ val: 0 }, {
      val: 1,
      duration: 1.6,
      ease: "sine.inOut",
      onUpdate: function() {
        const v = (this.targets()[0] as { val: number }).val;
        const intensity = v < 0.5 ? v * 2 : (1 - v) * 2;
        setIgnitionProgress(intensity);
      },
    }, 0);

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

    // OUT: all chars left → right — clip up (25ms per char)
    tl.to(allChars, {
      yPercent: -110,
      stagger: { each: 0.025, from: "start" },
      duration: 0.35,
      ease: "power2.in",
    });

    // Curtain wipe exit — clips upward instead of fading
    tl.to(
      splash,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          sessionStorage.setItem("828-splash-seen", "1");
          dismiss();
        },
      },
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
      {/* Gradient ignition overlay — radial bloom behind text */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(123,45,38,${(ignitionProgress * 0.22).toFixed(3)}), transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* "828 Construction" — ONE LINE, Space Grotesk Bold, V3 with perspective + rotateX */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          userSelect: "none",
          gap: 0,
          perspective: "800px",
          perspectiveOrigin: "50% 50%",
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
                style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
              >
                <span
                  ref={(el) => { chars828Refs.current[i] = el; }}
                  style={{ display: "inline-block", transformStyle: "preserve-3d" }}
                >
                  {char}
                </span>
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
              style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
            >
              <span
                ref={(el) => { charsConstrRefs.current[i] = el; }}
                style={{ display: "inline-block", transformStyle: "preserve-3d" }}
              >
                {char}
              </span>
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
