'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useTilt(maxDeg = 10) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.55, ease: 'expo.out' });
    const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.55, ease: 'expo.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      xTo(x * maxDeg);
      yTo(-y * maxDeg);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [maxDeg]);

  return ref;
}
