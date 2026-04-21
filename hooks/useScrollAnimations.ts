"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
// AnimationController.shouldAnimate() = width >= 768 AND no prefers-reduced-motion

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Fade + slide up on scroll, fires once. Desktop only. */
export function useFadeInUp<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 52 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return ref;
}

/** Stagger direct children on scroll. Desktop only. */
export function useStaggerReveal(stagger = 0.12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !ref.current) return;
    const children = Array.from(ref.current.children) as HTMLElement[];
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger]);

  return ref;
}

/** Parallax — element scrolls at a different rate. Desktop only. */
export function useParallax(speed = 0.25) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/** Clip-reveal — wipes from bottom on scroll. Desktop only. */
export function useClipReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/** Horizontal stagger — children slide in from left. Desktop only. */
export function useSlideInLeft(stagger = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !ref.current) return;
    const children = Array.from(ref.current.children) as HTMLElement[];
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger]);

  return ref;
}
