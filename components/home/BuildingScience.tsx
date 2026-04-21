"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";
import { useMobile } from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    num: "01",
    label: "Root Cause Over Symptom",
    body: "Most failures have a predictable cause. We find it before the fix — not after the second round of repairs.",
  },
  {
    num: "02",
    label: "Material Reality",
    body: "Materials move. Water finds paths. Assemblies fail in ways that are well understood — if you're paying attention. We are.",
  },
  {
    num: "03",
    label: "Scope Before Commitment",
    body: "Clear scope before a dollar is spent. No scope creep, no surprise costs, no additions that weren't agreed to.",
  },
];

// Three images for cross-fade as pillars advance
const pillarImages = [
  { src: "/images/about/building-science.jpg", alt: "Building science precision measurement" },
  { src: "/images/about/tools.jpg", alt: "Quality construction tools" },
  { src: "/images/about/contract.jpg", alt: "Scope and contract precision" },
];

export default function BuildingScience() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pillarsElRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !wrapperRef.current) return;

    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      // ── Headline line reveal ─────────────────────────────────────────────
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll<HTMLElement>(".hl");
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: wrapperRef.current, start: "top 75%", once: true },
          }
        );
      }

      // ── Body and link fade up ────────────────────────────────────────────
      const fadeEls = [
        bodyRef.current,
        wrapperRef.current?.querySelector<HTMLElement>(".bs-link"),
      ].filter((el): el is HTMLElement => !!el);

      fadeEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: 0.3 + i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: wrapperRef.current!, start: "top 75%", once: true },
          }
        );
      });

      if (isMobile) {
        // ── Mobile: simple stagger reveal, no pin ───────────────────────────
        const rows = wrapperRef.current!.querySelectorAll<HTMLElement>(".pillar-row");
        gsap.fromTo(
          rows,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: { trigger: wrapperRef.current, start: "top 70%", once: true },
          }
        );
        return;
      }

      // ── Desktop: PINNED SCROLL — 300vh pin ──────────────────────────────
      // Set initial state: pillar 01 active, 02 and 03 dim
      // Uses color tweens instead of opacity to keep text contrast accessible
      const setActive = (activeIndex: number) => {
        pillars.forEach((_, i) => {
          const pillarEl = pillarsElRef.current[i];
          const numEl = numbersRef.current[i];
          const imgEl = imagesRef.current[i];

          if (!pillarEl || !numEl) return;

          const isActive = i === activeIndex;

          // Tween heading color (black active, gray-600 inactive) — body text stays gray-500
          const pillarHeading = pillarEl.querySelector<HTMLElement>(".pillar-heading");
          if (pillarHeading) {
            gsap.to(pillarHeading, { color: isActive ? "#000000" : "#4b5563", duration: 0.4 });
          }

          gsap.to(numEl, {
            scale: isActive ? 1.1 : 0.95,
            opacity: isActive ? 1 : 0.2,
            color: isActive ? "#B87333" : "#666",
            duration: 0.4,
          });
          // copper accent bar
          const accent = pillarEl.querySelector<HTMLElement>(".pillar-accent");
          if (accent) {
            gsap.to(accent, {
              scaleX: isActive ? 1 : 0,
              opacity: isActive ? 1 : 0,
              duration: 0.35,
            });
          }
          // image cross-fade
          if (imgEl) {
            gsap.to(imgEl, {
              opacity: isActive ? 1 : 0,
              duration: 0.6,
              ease: "power2.inOut",
            });
          }
        });
      };

      // Initialize state
      setActive(0);

      // Create the scrubbed timeline
      // pinSpacing: false — we give wrapperRef explicit height so GSAP doesn't add a spacer div
      // This prevents the ghost whitespace that appears below the section after pinning ends
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: stickyRef.current,
          start: "top top",
          end: "+=" + window.innerHeight * 1.8,
          scrub: 0.8,
          pinSpacing: false,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress < 0.38) setActive(0);
            else if (progress < 0.72) setActive(1);
            else setActive(2);
          },
        },
      });

      // Keep timeline alive (GSAP needs at least one tween)
      tl.to({}, { duration: 1 });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} data-section="building-science" style={{ minHeight: isMobile ? "auto" : "280vh" }}>
      <div
        ref={stickyRef}
        className="bg-white overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: content */}
            <div>
              <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
                The Differentiator
              </span>

              <h2
                ref={headlineRef}
                className="font-display font-bold text-black tracking-tight leading-[0.9] mb-8"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                <span className="block overflow-hidden">
                  <span className="hl block">We Don&apos;t Estimate.</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hl block">We Measure.</span>
                </span>
              </h2>

              <p ref={bodyRef} className="text-gray-500 leading-relaxed max-w-md mb-12">
                Most contractors know how to build. Fewer understand why buildings
                fail — and fewer still can prevent it before it happens. Every
                decision at 828 starts from how buildings actually perform, not
                from habit or assumption.
              </p>

              {/* Pillars */}
              <div className="border-t border-gray-100">
                {pillars.map((p, i) => (
                  <div
                    key={p.num}
                    ref={(el) => { pillarsElRef.current[i] = el; }}
                    className="pillar-row py-7 border-b border-gray-100 grid grid-cols-[4.5rem_1fr] gap-6 items-start"
                  >
                    {/* Number */}
                    <span
                      ref={(el) => { numbersRef.current[i] = el; }}
                      aria-hidden="true"
                      className="font-numbers font-bold leading-none select-none"
                      style={{
                        fontSize: "3.5rem",
                        color: i === 0 ? "#B87333" : "#666",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        opacity: i === 0 ? 1 : 0,
                      }}
                    >
                      {p.num}
                    </span>

                    <div className="pt-1 relative">
                      {/* Copper accent bar — left of label */}
                      <div
                        className="pillar-accent absolute left-0 top-[0.15rem] w-0.5 h-4 bg-[#B87333]"
                        style={{
                          transform: i === 0 ? "scaleX(1)" : "scaleX(0)",
                          transformOrigin: "left",
                          opacity: i === 0 ? 1 : 0,
                          marginLeft: -16,
                        }}
                      />
                      <div className="pillar-body">
                        <h3
                          className="pillar-heading font-display font-bold text-base mb-2 leading-snug"
                          style={{ color: i === 0 ? "#000000" : "#4b5563" }}
                        >
                          {p.label}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="bs-link group inline-flex items-center gap-2 font-labels text-[11px] text-black tracking-[0.18em] uppercase border-b border-gray-300 pb-1 hover:border-[#B87333] hover:text-[#B87333] transition-colors duration-200 mt-10 block w-fit"
              >
                About 828 Construction
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Right: cross-fading images */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                {pillarImages.map((img, i) => (
                  <div
                    key={img.src}
                    ref={(el) => { imagesRef.current[i] = el; }}
                    className="absolute inset-0"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover saturate-[1.12] contrast-[1.06]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5">
                  <span className="font-labels text-[9px] text-gray-300 tracking-[0.18em] uppercase">
                    Structural Precision · Building Science
                  </span>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-black text-white p-6 w-44">
                <div className="font-numbers font-bold text-3xl text-white mb-1">20+</div>
                <div className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase leading-relaxed">
                  Years of Field Experience
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
