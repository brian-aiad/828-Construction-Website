'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export function useSectionScrub(
  build: (section: HTMLElement) => gsap.core.Timeline | gsap.core.Tween | void,
  options: { pin?: boolean; scrub?: number | boolean; end?: string } = {}
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = gsap.context(() => {
      const animation = build(el);
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: options.end ?? '+=120%',
        pin: options.pin ?? true,
        scrub: options.scrub ?? 1,
        animation: animation as gsap.core.Animation,
      });
    }, el);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
