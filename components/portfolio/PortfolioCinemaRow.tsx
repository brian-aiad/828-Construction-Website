'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationController } from '@/utils/animationControl';
import { Project } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioCinemaRowProps {
  photos: Array<Pick<Project, 'image' | 'title' | 'location' | 'category'>>;
}

export default function PortfolioCinemaRow({ photos }: PortfolioCinemaRowProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressBar = progressRef.current;
    if (!section || !track || !progressBar) return;

    // Mobile: no pin-scroll, images are stacked vertically
    if (!AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      const slideWidth = window.innerWidth * 0.80;
      const totalDistance = (photos.length - 1) * slideWidth;

      // Main horizontal tween — pin + scrub
      const mainTween = gsap.to(track, {
        x: -totalDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(progressBar, { scaleX: self.progress, transformOrigin: 'left' });
          },
        },
      });

      // Per-photo: scale 1.15 → 1.0 → 0.85 + blur 6 → 0 → 4 across full pass
      const photoInners = track.querySelectorAll<HTMLElement>('.cinema-photo-inner');
      photoInners.forEach((inner) => {
        const article = inner.closest<HTMLElement>('.cinema-photo');
        if (!article) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: article,
            containerAnimation: mainTween,
            start: 'left right',
            end: 'right left',
            scrub: 1,
          },
        });
        tl
          .fromTo(inner,
            { scale: 1.15, filter: 'blur(6px)' },
            { scale: 1.0, filter: 'blur(0px)', ease: 'none' }
          )
          .to(inner, { scale: 0.85, filter: 'blur(4px)', ease: 'none' });
      });
    }, sectionRef);

    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, [photos.length]);

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  return (
    <section
      ref={sectionRef}
      data-section="portfolio-cinema"
      className="relative bg-black"
      style={{ height: '100svh', overflowX: 'clip', position: 'relative', zIndex: 2 }}
      aria-label="Portfolio cinema strip"
    >
      {/* Horizontal track — desktop only */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full items-center gap-[4vw] pl-[10vw]"
        style={{ display: 'flex', width: 'max-content' }}
      >
        {photos.map((photo, i) => (
          <article
            key={i}
            className="cinema-photo flex-shrink-0 relative overflow-hidden"
            style={{ width: '78vw', height: '82vh' }}
            aria-label={photo.title}
          >
            <div
              className="cinema-photo-inner absolute inset-0 will-change-transform"
              style={{ width: '100%', height: '100%' }}
            >
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="object-cover"
                style={{ filter: 'contrast(1.06) saturate(1.1)' }}
                sizes="80vw"
              />
            </div>
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)' }}
              aria-hidden="true"
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <p className="font-labels text-[9px] text-white/55 tracking-[0.22em] uppercase mb-2">
                {photo.location} · {photo.category}
              </p>
              <h3
                className="font-display font-bold text-white leading-[0.9] tracking-tight"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
              >
                {photo.title}
              </h3>
            </div>
            {/* Frame number */}
            <div className="absolute top-6 right-6">
              <span
                className="font-numbers font-bold text-white/20 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Maroon progress bar */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{ background: 'var(--color-accent)', transform: 'scaleX(0)', transformOrigin: 'left' }}
        aria-hidden="true"
      />

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 hidden lg:flex items-center gap-2">
        <span className="font-labels text-[8px] text-white/30 tracking-[0.24em] uppercase">scroll</span>
        <svg width="24" height="6" viewBox="0 0 24 6" fill="none" aria-hidden="true">
          <path d="M0 3h22M19 1l3 2-3 2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Mobile fallback — vertical stacked grid (no pin) */}
      <style>{`
        @media (max-width: 767px) {
          [data-section="portfolio-cinema"] > div:first-child {
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 3px;
            width: 100% !important;
            position: static !important;
            height: auto !important;
          }
          [data-section="portfolio-cinema"] .cinema-photo {
            width: 100% !important;
            height: clamp(260px, 45vw, 400px) !important;
            flex-shrink: unset !important;
          }
          [data-section="portfolio-cinema"] {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </section>
  );
}
