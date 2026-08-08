"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

gsap.registerPlugin(ScrollTrigger);

// NS-grammar services: dark editorial section, compact enough for all three
// service entries to read together on desktop, with captions below the frame.

const SERVICE_IMAGES: Record<string, string> = {
  adu: "/images/generated/home-services-adu-v3.jpg",
  remediation: "/images/generated/home-services-remediation-v3.jpg",
  consulting: "/images/generated/home-services-consulting-v3.jpg",
};

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwNzA3MDciLz48L3N2Zz4=";

function imgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

export default function ServicesPreviewV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverCleanups = useRef<Array<() => void>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // One-shot reveals use IntersectionObserver — ScrollTrigger positional
    // once-triggers go stale after route transitions (PATTERNS.md Fix 22).
    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const headlineLines = gsap.utils.toArray<HTMLElement>(".svc-headline-line");
      const frames = cards
        .map((card) => card.querySelector<HTMLElement>(".svc-frame"))
        .filter(Boolean) as HTMLElement[];
      const captions = cards
        .map((card) => card.querySelector<HTMLElement>(".svc-caption"))
        .filter(Boolean) as HTMLElement[];

      gsap.set(frames, { clipPath: "inset(0% 0% 14% 0%)" });
      gsap.set(captions, { y: 18, opacity: 0 });
      if (introRef.current) gsap.set(introRef.current, { y: 20, opacity: 0 });

      const { isMobile, prefersReducedMotion } = AnimationController.getConfig();

      if (!AnimationController.shouldAnimate()) {
        // Images always resolve instantly on mobile — no image entrance.
        gsap.set(headlineLines, { yPercent: 0 });
        gsap.set(frames, { clipPath: "inset(0%)" });

        if (prefersReducedMotion || !isMobile) {
          gsap.set(captions, { y: 0, opacity: 1 });
          if (introRef.current) gsap.set(introRef.current, { y: 0, opacity: 1 });
          return;
        }

        // Mobile text entrance: lightweight decisive IO rises. Every hidden
        // state is y+opacity, so LenisProvider's global failsafe (Fix 18)
        // resets it (y:0/opacity:1) if an IntersectionObserver ever misses —
        // content can never be stranded invisible.
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { y: 22, opacity: 0 });
          revealCleanups.push(
            revealOnVisible([headlineRef.current], (el) =>
              gsap.to(el, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
            )
          );
        }
        if (introRef.current) {
          revealCleanups.push(
            revealOnVisible([introRef.current], (el) =>
              gsap.to(el, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
            )
          );
        }
        captions.forEach((cap) => {
          revealCleanups.push(
            revealOnVisible([cap], (el) =>
              gsap.to(el, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" })
            )
          );
        });
        return;
      }

      // Headline mask reveal — decisive one-shot so it always completes
      revealCleanups.push(
        revealOnVisible([headlineRef.current ?? section], () => {
          gsap.fromTo(
            headlineLines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.95,
              stagger: 0.1,
              ease: "power3.out",
            }
          );
        })
      );

      if (introRef.current) {
        revealCleanups.push(
          revealOnVisible([introRef.current], (el) => {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
          })
        );
      }

      // Each card: frame clip-reveal + caption rise, tied to its own position
      cards.forEach((card) => {
        const frame = card.querySelector<HTMLElement>(".svc-frame");
        const caption = card.querySelector<HTMLElement>(".svc-caption");
        const inner = card.querySelector<HTMLElement>(".svc-img-inner");

        if (frame) {
          gsap.to(frame, {
            clipPath: "inset(0%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 55%",
              scrub: 1,
            },
          });
        }
        if (caption) {
          revealCleanups.push(
            revealOnVisible([card], () => {
              gsap.to(caption, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" });
            })
          );
        }
        // Parallax inside the frame
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      });

      // Hover — quiet image scale only (Fix 20: store removers)
      if (window.matchMedia("(hover: hover)").matches) {
        cards.forEach((card) => {
          const img = card.querySelector<HTMLElement>(".svc-img-inner img");
          const onEnter = () => {
            if (img) gsap.to(img, { scale: 1.045, duration: 0.8, ease: "power2.out" });
          };
          const onLeave = () => {
            if (img) gsap.to(img, { scale: 1, duration: 0.8, ease: "power2.out" });
          };
          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          hoverCleanups.current.push(() => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          });
        });
      }
    }, sectionRef);

    return () => {
      revealCleanups.forEach((dispose) => dispose());
      hoverCleanups.current.forEach((fn) => fn());
      hoverCleanups.current = [];
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const [adu, remediation, consulting] = SERVICES;

  const renderCaption = (
    service: (typeof SERVICES)[number],
    index: number
  ) => (
    <div className="svc-caption mt-3 flex flex-col gap-2 border-t border-white/12 pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-5 lg:mt-4">
      <div>
        <h3 className="font-editorial text-[clamp(1.35rem,1.55vw,1.75rem)] font-normal leading-tight text-white">
          {service.title}
        </h3>
      </div>
      <div className="shrink-0 text-left sm:max-w-[12rem] sm:text-right">
        <p className="font-labels text-[8px] uppercase leading-[1.7] tracking-[0.24em] text-white/38 sm:text-[9px]">
          {service.short}
        </p>
        <p className="mt-1 font-numbers text-[10px] text-[#b98b82]">
          0{index + 1}
        </p>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] pb-16 pt-20 text-white lg:min-h-svh lg:pb-12 lg:pt-[5.75rem]"
      data-section="services-v2"
      data-header-dark=""
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-accent)] opacity-70"
      />
      <div className="mx-auto max-w-[1680px] px-5 sm:px-6 lg:px-10 2xl:px-12">
        {/* Header row — headline left, copy + link right */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h2
              ref={headlineRef}
              className="font-editorial text-[clamp(2.15rem,3.35vw,3.45rem)] font-normal leading-[1.02] text-white"
            >
              <span className="-my-[0.14em] block overflow-hidden py-[0.14em]">
                <span className="svc-headline-line block">One company,</span>
              </span>
              <span className="-my-[0.14em] block overflow-hidden py-[0.14em]">
                <span className="svc-headline-line block text-[var(--color-accent)]">
                  multiple solutions.
                </span>
              </span>
            </h2>
          </div>
          <div ref={introRef} className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-[14px] leading-6 text-white/58 lg:max-w-sm">
              Whether it&apos;s an ongoing maintenance, essential repairs, or a
              new ADU. 828 Construction helps homeowners bring their vision to
              life and keep their homes performing at their best.
            </p>
            <Link
              href="/services"
              className="group mt-4 hidden w-fit items-center gap-2 border-b border-white/22 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:border-white hover:text-white lg:inline-flex"
            >
              All Services
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Work grid — one tall frame left, two stacked right, captions below */}
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-9 lg:mt-8 lg:grid-cols-12 lg:gap-y-0">
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className="lg:col-span-7"
          >
            <Link href={`/services/${adu.slug}`} aria-label={adu.title} className="block">
              <div
                className="svc-frame relative aspect-[4/3] overflow-hidden bg-[#111] lg:aspect-[16/8.7]"
                data-gsap-reveal="true"
              >
                <div className="svc-img-inner absolute -inset-y-[8%] inset-x-0" style={{ willChange: "transform" }}>
                  <Image
                    src={SERVICE_IMAGES[adu.slug]}
                    alt={adu.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    quality={93}
                    unoptimized
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    onError={imgError}
                    className="object-cover"
                    style={{ filter: "contrast(1.08) saturate(0.95) brightness(0.84)" }}
                  />
                </div>
              </div>
              {renderCaption(adu, 0)}
            </Link>
          </div>

          <div className="flex flex-col gap-9 lg:col-span-4 lg:col-start-9 lg:gap-5 lg:pt-0">
            {[remediation, consulting].map((service, i) => (
              <div
                key={service.slug}
                ref={(el) => {
                  cardRefs.current[i + 1] = el;
                }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  aria-label={service.title}
                  className="block"
                >
                  <div
                    className="svc-frame relative aspect-[4/3] overflow-hidden bg-[#111] lg:aspect-[16/6.35]"
                    data-gsap-reveal="true"
                  >
                    <div className="svc-img-inner absolute -inset-y-[8%] inset-x-0" style={{ willChange: "transform" }}>
                      <Image
                        src={SERVICE_IMAGES[service.slug]}
                        alt={service.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 34vw"
                        quality={93}
                        unoptimized
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        onError={imgError}
                        className="object-cover"
                        style={{ filter: "contrast(1.08) saturate(0.95) brightness(0.84)" }}
                      />
                    </div>
                  </div>
                  {renderCaption(service, i + 1)}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile "All Services" link */}
        <div className="mt-12 lg:hidden">
          <Link
            href="/services"
            className="group inline-flex min-h-[44px] items-center gap-2 border-b border-white/22 pb-1.5 pt-3 font-labels text-[10px] uppercase tracking-[0.18em] text-white/58"
          >
            All Services
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
