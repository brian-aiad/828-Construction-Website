'use client';

import { useEffect, useRef, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationController } from '@/utils/animationControl';

gsap.registerPlugin(ScrollTrigger);

type RevealStyle = 'mask' | 'blur' | 'scale';

type RevealImageProps = Omit<ImageProps, 'ref'> & {
  revealStyle?: RevealStyle;
};

export default function RevealImage({ revealStyle = 'mask', ...props }: RevealImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;

    // Fix 14: set initial states before shouldAnimate check
    if (revealStyle === 'mask') {
      gsap.set(img, { clipPath: 'inset(100% 0 0 0)' });
    } else if (revealStyle === 'blur') {
      gsap.set(img, { filter: 'blur(20px)', scale: 1.08, opacity: 0 });
    } else if (revealStyle === 'scale') {
      gsap.set(img, { scale: 1.12, opacity: 0 });
    }

    if (!AnimationController.shouldAnimate()) {
      // Fix 15: mobile — clear immediately without animation
      if (revealStyle === 'mask') {
        gsap.set(img, { clipPath: 'inset(0% 0 0 0)' });
      } else {
        gsap.set(img, { filter: 'none', scale: 1, opacity: 1 });
      }
      return;
    }

    if (!loaded) return;

    const ctx = gsap.context(() => {
      if (revealStyle === 'mask') {
        gsap.to(img, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: wrapper, start: 'top 80%', once: true },
        });
      } else if (revealStyle === 'blur') {
        gsap.to(img, {
          filter: 'blur(0px)',
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 80%', once: true },
        });
      } else if (revealStyle === 'scale') {
        gsap.to(img, {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 80%', once: true },
        });
      }
    }, wrapper);

    return () => { try { ctx.revert(); } catch {} };
  }, [loaded, revealStyle]);

  return (
    <div ref={wrapperRef} className="relative overflow-hidden w-full h-full" data-gsap-reveal="true">
      <Image
        {...props}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={imgRef as any}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
