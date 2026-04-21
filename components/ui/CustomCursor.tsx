"use client";

import { useEffect, useRef } from "react";
import { AnimationController } from "@/utils/animationControl";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide cursor elements entirely on touch/mobile
    if (!AnimationController.shouldAnimate()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Show elements (hidden by default via CSS)
    dot.style.display = "block";
    ring.style.display = "block";

    let rafId: number;
    let ringX = 0;
    let ringY = 0;
    let curX = 0;
    let curY = 0;

    const handleMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      dot.style.transform = `translate(${curX}px, ${curY}px)`;
    };

    const animate = () => {
      ringX += (curX - ringX) * 0.14;
      ringY += (curY - ringY) * 0.14;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const grow = () => {
      ring.style.width = "52px";
      ring.style.height = "52px";
      ring.style.opacity = "0.5";
    };

    const shrink = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMove);
    rafId = requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button, [data-cursor-grow]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      {/* Dot — hidden until JS confirms desktop */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "difference",
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          background: "#fff",
          transition: "transform 0.05s linear",
        }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9998,
          pointerEvents: "none",
          mixBlendMode: "difference",
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.9)",
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
        }}
      />
    </>
  );
}
