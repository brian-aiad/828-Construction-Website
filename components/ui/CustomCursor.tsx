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
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    copper.style.opacity = "0";

    let rafId = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let ringX = 0, ringY = 0;
    let copperX = 0, copperY = 0;
    let curX = 0, curY = 0;
    let hasPointer = false;

    const hideCursor = () => {
      clearTimeout(idleTimer);
      hasPointer = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      copper.style.opacity = "0";
    };

    const handleMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      if (!hasPointer) {
        hasPointer = true;
        ringX = curX;
        ringY = curY;
        copperX = curX;
        copperY = curY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        copper.style.opacity = "0.5";
      }
      dot.style.transform = `translate(${curX}px, ${curY}px)`;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(hideCursor, 900);
      if (!rafId) rafId = requestAnimationFrame(animate);
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

      const ringSettled = Math.abs(curX - ringX) < 0.1 && Math.abs(curY - ringY) < 0.1;
      const copperSettled =
        Math.abs(curX - copperX) < 0.1 && Math.abs(curY - copperY) < 0.1;
      if (ringSettled && copperSettled) {
        ringX = copperX = curX;
        ringY = copperY = curY;
        ring.style.transform = `translate(${curX}px, ${curY}px)`;
        copper.style.transform = `translate(${curX}px, ${curY}px)`;
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
    };

    // Default: white ring (upgraded 32→36px)
    const resetRing = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.marginLeft = "-18px";
      ring.style.marginTop = "-18px";
      ring.style.borderColor = "rgba(255,255,255,0.65)";
      ring.style.opacity = hasPointer ? "1" : "0";
    };

    // Hover over links/buttons: ring grows (upgraded 44→64px)
    const onInteractive = () => {
      ring.style.width = "64px";
      ring.style.height = "64px";
      ring.style.marginLeft = "-32px";
      ring.style.marginTop = "-32px";
      ring.style.borderColor = "rgba(255,255,255,0.9)";
      ring.style.opacity = hasPointer ? "1" : "0";
    };

    // Hover over images: ring becomes maroon and expands (upgraded 52→70px)
    const onImage = () => {
      ring.style.width = "70px";
      ring.style.height = "70px";
      ring.style.marginLeft = "-35px";
      ring.style.marginTop = "-35px";
      ring.style.borderColor = "var(--color-accent)";
      ring.style.opacity = hasPointer ? "0.85" : "0";
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("scroll", hideCursor, { passive: true });
    document.addEventListener("mouseleave", hideCursor);

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest("a, button, [role='button'], input, select, textarea, [data-cursor-grow]"));

    const isImageTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest("img, picture, [data-cursor-image]"));

    const handlePointerOver = (e: PointerEvent) => {
      if (isImageTarget(e.target)) {
        onImage();
        return;
      }
      if (isInteractiveTarget(e.target)) onInteractive();
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (!(e.relatedTarget instanceof Element)) {
        resetRing();
        return;
      }

      const leavingImage = isImageTarget(e.target);
      const enteringImage = isImageTarget(e.relatedTarget);
      const leavingInteractive = isInteractiveTarget(e.target);
      const enteringInteractive = isInteractiveTarget(e.relatedTarget);

      if ((leavingImage && !enteringImage) || (leavingInteractive && !enteringInteractive)) {
        resetRing();
      }
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", hideCursor);
      document.removeEventListener("mouseleave", hideCursor);
      clearTimeout(idleTimer);
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
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
          willChange: "transform, opacity",
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
          willChange: "transform, opacity",
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
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
