"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Homepage intro. Replays on refresh, keeps the smaller mark size, and uses
// the NS-style letter reveal the client liked.

const PREFIX = "828";
const SUFFIX = "CONSTRUCTION";
const PREFIX_CHARS = PREFIX.split("");
const SUFFIX_CHARS = SUFFIX.split("");

export default function SplashScreen() {
  const splashRef = useRef<HTMLDivElement>(null);
  const prefixCharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const suffixCharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
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
    const splash = splashRef.current;
    const underline = underlineRef.current;
    const glow = glowRef.current;
    const sweep = sweepRef.current;
    const prefixChars = prefixCharRefs.current.filter(Boolean) as HTMLSpanElement[];
    const suffixChars = suffixCharRefs.current.filter(Boolean) as HTMLSpanElement[];
    const chars = [...prefixChars, ...suffixChars];
    if (!splash || !underline || !glow || !sweep || chars.length === 0) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(splash, { opacity: 1 });
      gsap.to(splash, {
        opacity: 0,
        duration: 0.45,
        delay: 1,
        onComplete: dismiss,
      });
      return;
    }

    gsap.set(splash, {
      opacity: 1,
      clipPath: "inset(0 0 0% 0)",
    });
    gsap.set(chars, {
      yPercent: 118,
      rotateX: 88,
      opacity: 0,
      scale: 0.85,
      filter: "blur(8px)",
      textShadow: "0 0 0px rgba(123,45,38,0)",
      transformOrigin: "50% 85%",
    });
    gsap.set(underline, { scaleX: 0, opacity: 0 });
    gsap.set(glow, { opacity: 0, scale: 0.76 });
    gsap.set(sweep, { xPercent: -130, opacity: 0 });

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(glow, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "sine.out",
    });

    tl.to(
      prefixChars,
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: { each: 0.045, from: "start" },
        duration: 1.2,
        ease: "power4.out",
      },
      0.2
    );

    tl.to(
      suffixChars,
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: { each: 0.065, from: "start" },
        duration: 0.75,
        ease: "power3.out",
      },
      0.5
    );

    tl.to(
      underline,
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.6,
        ease: "expo.out",
      },
      1.7
    );

    chars.forEach((char, index) => {
      const isPrefix = index < prefixChars.length;
      const localIndex = isPrefix ? index : index - prefixChars.length;
      const landingTime = isPrefix
        ? 0.2 + localIndex * 0.045 + 0.72
        : 0.5 + localIndex * 0.065 + 0.42;

      tl.to(
        char,
        {
          textShadow: "0 0 24px rgba(123,45,38,0.5)",
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        landingTime
      );
    });

    tl.to(
      sweep,
      {
        xPercent: 130,
        opacity: 0.55,
        duration: 1.15,
        ease: "power2.inOut",
      },
      0.72
    );

    tl.to(sweep, { opacity: 0, duration: 0.22 }, 1.65);

    // Hold after the underline so the full mark can be read.
    tl.to({}, { duration: 1.0 }, 2.3);

    tl.to(chars, {
      yPercent: -116,
      rotateX: -46,
      opacity: 0,
      scale: 0.96,
      filter: "blur(4px)",
      stagger: { each: 0.022, from: "start" },
      duration: 0.42,
      ease: "power3.in",
    }, 3.3);

    tl.to(
      underline,
      {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.38"
    );

    tl.to(
      glow,
      {
        opacity: 0,
        scale: 1.12,
        duration: 0.5,
        ease: "sine.in",
      },
      "-=0.32"
    );

    tl.to(
      splash,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: dismiss,
      },
      3.3
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
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        pointerEvents: "auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent 34%)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "min(48vw, 440px)",
          aspectRatio: "1 / 0.55",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(123,45,38,0.28), rgba(123,45,38,0.08) 42%, transparent 72%)",
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "min(90vw, 720px)",
          minWidth: 260,
          overflow: "hidden",
          padding: "0.5rem 0 0.72rem",
          perspective: "900px",
          perspectiveOrigin: "50% 50%",
          userSelect: "none",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            width: "100%",
            whiteSpace: "nowrap",
            color: "#fff",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "0",
            fontSize: "clamp(1.14rem, 4.25vw, 3rem)",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {PREFIX_CHARS.map((char, i) => (
              <span
                key={`prefix-${char}-${i}`}
                ref={(el) => {
                  prefixCharRefs.current[i] = el;
                }}
                style={{
                  display: "inline-block",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                }}
              >
                {char}
              </span>
            ))}
            <span
              ref={underlineRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "-0.18em",
                height: "0.09em",
                background: "#fff",
                transformOrigin: "left center",
                pointerEvents: "none",
              }}
            />
          </span>
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.28em",
              flex: "0 0 auto",
            }}
          />
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {SUFFIX_CHARS.map((char, i) => (
              <span
                key={`suffix-${char}-${i}`}
                ref={(el) => {
                  suffixCharRefs.current[i] = el;
                }}
                style={{
                  display: "inline-block",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                }}
              >
                {char}
              </span>
            ))}
          </span>
          <div
            ref={sweepRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-35% auto -35% 0",
              width: "32%",
              transform: "skewX(-18deg)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.42), transparent)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

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
          color: "rgba(255,255,255,0.24)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.5rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.58)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.24)";
        }}
      >
        Skip
      </button>
    </div>
  );
}
