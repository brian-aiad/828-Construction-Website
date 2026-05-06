"use client";

import { useEffect, useRef } from "react";
import { AnimationController } from "@/utils/animationControl";

// Custom cursor: main dot (mixBlendMode:difference) + lagging ring + copper trail.
// Ring turns copper and expands on image hover — white ring on link/button hover.
// Hidden on touch devices via AnimationController.shouldAnimate() gate.

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const copperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply custom cursor class to body on pointer-fine devices (before animation gate)
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.classList.add("has-custom-cursor");
    }

    if (!AnimationController.shouldAnimate()) {
      return () => {
        document.body.classList.remove("has-custom-cursor");
      };
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const copper = copperRef.current;
    if (!dot || !ring || !copper) return;

    dot.style.display = "block";
    ring.style.display = "block";
    copper.style.display = "block";

    let rafId: number;
    let ringX = 0, ringY = 0;
    let copperX = 0, copperY = 0;
    let curX = 0, curY = 0;

    const handleMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      dot.style.transform = `translate(${curX}px, ${curY}px)`;
    };

    const animate = () => {
      // Ring: 14% lerp
      ringX += (curX - ringX) * 0.14;
      ringY += (curY - ringY) * 0.14;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      // Copper trail: 9% lerp (slightly faster than ring for warmth)
      copperX += (curX - copperX) * 0.09;
      copperY += (curY - copperY) * 0.09;
      copper.style.transform = `translate(${copperX}px, ${copperY}px)`;

      rafId = requestAnimationFrame(animate);
    };

    // Default: white ring (upgraded 32→36px)
    const resetRing = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.marginLeft = "-18px";
      ring.style.marginTop = "-18px";
      ring.style.borderColor = "rgba(255,255,255,0.65)";
      ring.style.opacity = "1";
    };

    // Hover over links/buttons: ring grows (upgraded 44→64px)
    const onInteractive = () => {
      ring.style.width = "64px";
      ring.style.height = "64px";
      ring.style.marginLeft = "-32px";
      ring.style.marginTop = "-32px";
      ring.style.borderColor = "rgba(255,255,255,0.9)";
      ring.style.opacity = "1";
    };

    // Hover over images: ring becomes maroon and expands (upgraded 52→70px)
    const onImage = () => {
      ring.style.width = "70px";
      ring.style.height = "70px";
      ring.style.marginLeft = "-35px";
      ring.style.marginTop = "-35px";
      ring.style.borderColor = "var(--color-accent)";
      ring.style.opacity = "0.85";
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button, [data-cursor-grow]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onInteractive);
      el.addEventListener("mouseleave", resetRing);
    });

    // Images get copper ring on hover
    const images = document.querySelectorAll("img, [data-cursor-image]");
    images.forEach((el) => {
      el.addEventListener("mouseenter", onImage);
      el.addEventListener("mouseleave", resetRing);
    });

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onInteractive);
        el.removeEventListener("mouseleave", resetRing);
      });
      images.forEach((el) => {
        el.removeEventListener("mouseenter", onImage);
        el.removeEventListener("mouseleave", resetRing);
      });
    };
  }, []);

  return (
    <>
      {/* Main dot — mixBlendMode:difference (white on dark, black on light) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "difference",
          width: 8, height: 8,
          marginLeft: -4, marginTop: -4,
          borderRadius: "50%",
          background: "#fff",
        }}
      />

      {/* Copper trail dot — subtle warmth, trails behind cursor */}
      <div
        ref={copperRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 9997,
          pointerEvents: "none",
          width: 5, height: 5,
          marginLeft: -2.5, marginTop: -2.5,
          borderRadius: "50%",
          background: "var(--color-accent)",
          opacity: 0.5,
        }}
      />

      {/* Lagging ring — transitions to copper on image hover (upgraded 32→36px base) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 9998,
          pointerEvents: "none",
          width: 36, height: 36,
          marginLeft: -18, marginTop: -18,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.65)",
          transition: "width 0.25s ease, height 0.25s ease, margin 0.25s ease, border-color 0.25s ease, opacity 0.25s ease",
        }}
      />
    </>
  );
}
