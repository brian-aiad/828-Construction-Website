"use client";

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseRevealOptions {
  /** The container element that acts as the ScrollTrigger trigger */
  elementRef: RefObject<HTMLElement | null>;
  /** CSS selector for children to stagger (e.g. '.line-inner', '.card'). If omitted, animates elementRef itself. */
  childSelector?: string;
  /** Seconds between each child's animation start. Default 0.08 */
  stagger?: number;
  /** Delay before animation starts (seconds). Default 0 */
  delay?: number;
  /** Y distance to travel (px). Default 40. Only used when useClipPath is false */
  yDistance?: number;
  /** When true: uses clip-path bottom reveal (line-by-line press). When false: y+opacity fade. Default false */
  useClipPath?: boolean;
  /** ScrollTrigger start position. Default "top 72%" */
  start?: string;
}

/**
 * Scroll-triggered reveal animation.
 * Supports both clip-path line reveal (for headlines) and y+opacity fade (for body copy).
 * Reduced-motion and mobile: no-ops gracefully.
 */
export function useReveal({
  elementRef,
  childSelector,
  stagger = 0.08,
  delay = 0,
  yDistance = 40,
  useClipPath = false,
  start = "top 72%",
}: UseRevealOptions) {
  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !elementRef.current) return;

    const el = elementRef.current;
    const targets = childSelector
      ? el.querySelectorAll<HTMLElement>(childSelector)
      : [el];

    if (!targets.length) return;

    const ctx = gsap.context(() => {
      if (useClipPath) {
        // Line-by-line clip-path reveal — each target must have overflow:hidden on its parent
        gsap.fromTo(
          targets,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: 0.8,
            stagger,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      } else {
        // Standard y+opacity reveal
        gsap.fromTo(
          targets,
          { y: yDistance, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      }
    });

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Manually wraps each text line in overflow:hidden + inner span for clip-path animation.
 * Call this once in useEffect before useReveal, on a ref that contains text.
 * Returns the generated .line-inner elements.
 */
export function splitTextToLines(el: HTMLElement): HTMLSpanElement[] {
  const originalHTML = el.innerHTML;
  const text = el.textContent ?? "";

  // Simple approach: split on <br> tags or newlines
  // For real line-wrapping, we measure and group words
  const words = text.split(" ").filter(Boolean);
  const lineInners: HTMLSpanElement[] = [];

  // Measure line breaks by temporarily rendering
  el.innerHTML = originalHTML; // restore for measurement
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 48;
  const rect = el.getBoundingClientRect();
  const totalHeight = rect.height;
  const numLines = Math.round(totalHeight / lineHeight) || 1;

  // Rebuild HTML with line wrappers
  // For simplicity: split on existing <br> elements, then treat each segment as a line
  const brSplit = originalHTML.split(/<br\s*\/?>/i);

  if (brSplit.length > 1) {
    // Has explicit line breaks — use those
    el.innerHTML = brSplit
      .map(
        (segment) =>
          `<span class="line-wrap" style="display:block;overflow:hidden"><span class="line-inner" style="display:block">${segment}</span></span>`
      )
      .join("");
  } else if (numLines > 1) {
    // Wrap all content in a single line-wrap (fallback for variable-width text)
    el.innerHTML = `<span class="line-wrap" style="display:block;overflow:hidden"><span class="line-inner" style="display:block">${originalHTML}</span></span>`;
  } else {
    el.innerHTML = `<span class="line-wrap" style="display:block;overflow:hidden"><span class="line-inner" style="display:block">${originalHTML}</span></span>`;
  }

  return Array.from(el.querySelectorAll<HTMLSpanElement>(".line-inner"));
}
