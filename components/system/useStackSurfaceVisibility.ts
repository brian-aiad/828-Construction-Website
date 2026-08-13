"use client";

import { useEffect, type RefObject } from "react";
import { AnimationController } from "@/utils/animationControl";

export function useStackSurfaceVisibility(
  wrapRef: RefObject<HTMLElement | null>,
  surfaceSelector = "[data-stack-surface]"
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const surfaces = Array.from(
      wrap.querySelectorAll<HTMLElement>(surfaceSelector)
    );
    if (!surfaces.length) return;

    const update = () => {
      if (!AnimationController.shouldAnimate()) {
        surfaces.forEach((el) => el.removeAttribute("data-stack-covered"));
        return;
      }

      let frontIndex = -1;
      surfaces.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          frontIndex = i;
        }
      });
      const frontRect =
        frontIndex >= 0 ? surfaces[frontIndex].getBoundingClientRect() : null;
      const frontIsFlush = frontRect ? frontRect.top <= 1 : false;

      surfaces.forEach((el, i) => {
        if (frontIsFlush ? frontIndex > i : frontIndex - i > 1) {
          el.setAttribute("data-stack-covered", "true");
        }
        else el.removeAttribute("data-stack-covered");
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      surfaces.forEach((el) => el.removeAttribute("data-stack-covered"));
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [wrapRef, surfaceSelector]);
}
