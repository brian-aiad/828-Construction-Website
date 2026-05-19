"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

export function useServicePageMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    try {
      ctxRef.current?.revert();
    } catch {}
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>(".detail-reveal");
      const images = gsap.utils.toArray<HTMLElement>(".detail-image");
      const lines = gsap.utils.toArray<HTMLElement>(".detail-line");
      const scans = gsap.utils.toArray<HTMLElement>(".detail-scan");

      if (!AnimationController.shouldAnimate()) {
        gsap.set([...reveals, ...images, ...lines, ...scans], {
          autoAlpha: 1,
          y: 0,
          x: 0,
          clipPath: "inset(0%)",
          scaleX: 1,
        });
        return;
      }

      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: 1.35 },
          }
        );
      });

      images.forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 46%", scrub: 1.45 },
          }
        );

        const img = el.querySelector("img");
        if (img) {
          gsap.to(img, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.75 },
          });
        }
      });

      lines.forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 60%", scrub: 1.2 },
          }
        );
      });

      scans.forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -110, autoAlpha: 0.2 },
          {
            xPercent: 110,
            autoAlpha: 0.8,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top 82%", end: "bottom 42%", scrub: 1.7 },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".detail-stagger").forEach((wrap) => {
        const children = Array.from(wrap.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: wrap, start: "top 86%", end: "top 58%", scrub: 1.25 },
          }
        );
      });
    }, root);

    ctxRef.current = ctx;
    return () => {
      ctxRef.current = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return rootRef;
}
