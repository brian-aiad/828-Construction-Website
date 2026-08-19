"use client";

import { useEffect, type RefObject } from "react";
import { AnimationController } from "@/utils/animationControl";

export function useStackSurfaceVisibility(
  wrapRef: RefObject<HTMLElement | null>,
  surfaceSelector = "[data-stack-surface]",
  enabled = true
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const surfaces = Array.from(
      wrap.querySelectorAll<HTMLElement>(surfaceSelector)
    );
    if (!surfaces.length) return;
    if (!enabled) {
      surfaces.forEach((el) => el.removeAttribute("data-stack-covered"));
      return;
    }
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!AnimationController.shouldAnimate()) {
        surfaces.forEach((el) => el.removeAttribute("data-stack-covered"));
        return;
      }

      const rects = surfaces.map((el) => el.getBoundingClientRect());
      let frontIndex = -1;
      rects.forEach((rect, i) => {
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          frontIndex = i;
        }
      });
      const frontRect = frontIndex >= 0 ? rects[frontIndex] : null;
      const frontIsFlush = frontRect ? frontRect.top <= 1 : false;

      surfaces.forEach((el, i) => {
        const covered = frontIsFlush ? frontIndex > i : frontIndex - i > 1;
        if (el.hasAttribute("data-stack-covered") !== covered) {
          el.toggleAttribute("data-stack-covered", covered);
        }
      });
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      surfaces.forEach((el) => el.removeAttribute("data-stack-covered"));
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [enabled, wrapRef, surfaceSelector]);
}
