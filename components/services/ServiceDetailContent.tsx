"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { useMobile } from "@/hooks/useMobile";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceData {
  slug: string;
  title: string;
  short: string;
  description: string;
  details: string[];
}

interface NextService {
  slug: string;
  title: string;
  short: string;
}

interface AduFaqItem {
  q: string;
  a: string;
}

interface Props {
  service: ServiceData;
  nextService: NextService;
  keywords: string[];
  aduFaq?: AduFaqItem[];
  serviceImageSrc: string;
  serviceImageCaption: string;
}

// ─── Strip labels per service ─────────────────────────────────────────────────

const STRIP_LABELS: Record<string, string[]> = {
  adu: [
    "ADU Construction",
    "Accessory Dwelling Unit",
    "Torrance CA",
    "South Bay",
    "Permitted Plans",
    "Full Build",
    "Site Prep",
    "CA Licensed",
  ],
  remediation: [
    "Remediation Services",
    "Moisture Control",
    "Mold Assessment",
    "Foundation Repair",
    "Torrance CA",
    "South Bay",
    "Structural Repair",
    "CA Licensed",
  ],
  consulting: [
    "Building Consulting",
    "Code Compliance",
    "Building Science",
    "South Bay CA",
    "Expert Advisory",
    "Site Assessment",
    "CA Licensed",
    "20+ Years",
  ],
};

// ─── Section 1: Hero ──────────────────────────────────────────────────────────
// Techniques: 1 (triple-layer parallax), 2 (SplitType exit), 9 (counter scrub), 10 (hairline scrub)

function DetailHero({
  service,
  serviceImageSrc,
}: {
  service: ServiceData;
  serviceImageSrc: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let locLineEl: HTMLElement | null = null;
    let locSplit: SplitType | null = null;
    const ctx = gsap.context(() => {
      // Technique 1: Triple-layer parallax
      gsap.to(bgRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(midRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(headlineRef.current, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Technique 10: Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(
          hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      }

      // Fix 10: once:true — years counter fires once, never reverses
      if (counterRef.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 20,
          duration: 2,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
          onUpdate: () => {
            const v = Math.round(obj.val);
            if (counterRef.current && v > 0)
              counterRef.current.textContent = v + "+";
          },
        });
      }

      // Technique 2: SplitType exit-scatter on location line (not LCP)
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const locLine =
          sectionRef.current?.querySelector<HTMLElement>(".loc-line");
        if (!locLine || !locLine.isConnected) return;
        locLineEl = locLine;
        const split = new SplitType(locLine, { types: "chars" });
        locSplit = split;
        splitRef.current = split;
        if (split.chars?.length) {
          gsap.to(split.chars, {
            yPercent: -120,
            opacity: 0,
            stagger: { each: 0.012, from: "random" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "20% top",
              end: "75% top",
              scrub: 0.8,
            },
          });
        }
      });
    }, sectionRef);
    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (locSplit && locLineEl?.isConnected) { try { locSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, [service.slug]);

  const heroImg = serviceImageSrc || "/images/hero/hero-1.jpg";

  return (
    <section
      ref={sectionRef}
      data-section="service-detail-hero"
      className="relative overflow-hidden"
      style={{ minHeight: "72vh" }}
    >
      {/* BG layer — parallax at -15% */}
      <div ref={bgRef} className="absolute inset-0" style={{ scale: "1.12" }}>
        <Image
          src={heroImg}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Mid layer — gradient overlay at -8% */}
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Content — headline counter-motion +5% */}
      <div
        ref={headlineRef}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-40 pb-24"
      >
        <div className="mb-6">
          <Link
            href="/services"
            className="font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Services
          </Link>
        </div>

        {/* Copper hairline — scaleX scrub */}
        <div
          ref={hairlineRef}
          className="mb-6"
          style={{
            height: 1,
            background: "#B87333",
            transformOrigin: "left",
            maxWidth: "60px",
          }}
        />

        <span
          className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4 hero-meta-animate"
          style={{ animationDelay: "0.1s" }}
        >
          {service.short}
        </span>

        <h1
          className="font-display font-bold text-white tracking-tight leading-[0.88]"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
        >
          {/* LCP line: CSS-only animation, NOT SplitType */}
          <span className="block overflow-hidden">
            <span
              className="hero-line-animate block"
              style={{ animationDelay: "0.15s" }}
            >
              {service.title}
            </span>
          </span>
          {/* Location line: SplitType exit-scatter on scroll-out */}
          <span className="block overflow-hidden">
            <span
              className="loc-line block"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {service.slug === "adu"
                ? "In Torrance, CA"
                : service.slug === "remediation"
                  ? "In Torrance, CA"
                  : "South Bay, CA"}
            </span>
          </span>
        </h1>

        {/* Scrubbed counter */}
        <div className="mt-10 flex items-baseline gap-3">
          <span
            ref={counterRef}
            className="font-numbers font-bold text-[#B87333]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1 }}
          >
            20+
          </span>
          <span className="font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase">
            Years Experience
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Service Strip ─────────────────────────────────────────────────
// Technique 7: horizontal-on-vertical scroll (CSS marquee)

function DetailStrip({ slug }: { slug: string }) {
  const labels = STRIP_LABELS[slug] ?? STRIP_LABELS["adu"];
  const doubled = [...labels, ...labels];

  return (
    <div
      className="bg-black border-t border-b border-[#B87333]/20 py-3 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          width: "max-content",
          animation: "marqueeScroll 18s linear infinite",
        }}
      >
        {doubled.map((label, i) => (
          <span
            key={i}
            className="font-labels text-[10px] tracking-[0.22em] uppercase px-8"
            style={{ color: i % 2 === 0 ? "#B87333" : "rgba(255,255,255,0.35)" }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section 3: Pinned "Why 828" ──────────────────────────────────────────────
// Techniques: 5 (pinned moment), 9 (counter scrub), 10 (hairline scrub)

const WHY_PANELS = [
  {
    num: "01",
    title: "20+ Years Experience",
    body: "Decades of hands-on building science knowledge applied to your project.",
  },
  {
    num: "02",
    title: "Licensed in California",
    body: `CA License #${SITE.license} — fully insured and compliant with all local codes.`,
  },
  {
    num: "03",
    title: "South Bay Focus",
    body: "We know local codes, contractors, and conditions in Torrance and surrounding cities.",
  },
  {
    num: "04",
    title: "Science-Backed Approach",
    body: "Every decision is grounded in building science, not guesswork or gut feel.",
  },
];

function PinnedWhy() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const pinCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (pinCtxRef.current) { try { pinCtxRef.current.revert(); } catch {} } }, []);

  const setActive = (activeIndex: number) => {
    WHY_PANELS.forEach((_, i) => {
      const panel = panelRefs.current[i];
      const num = numRefs.current[i];
      if (!panel || !num) return;
      const isActive = i === activeIndex;
      const heading = panel.querySelector<HTMLElement>(".why-heading");
      const body = panel.querySelector<HTMLElement>(".why-body");
      if (heading)
        gsap.to(heading, {
          color: isActive ? "#ffffff" : "rgba(255,255,255,0.25)",
          duration: 0.35,
        });
      if (body)
        gsap.to(body, { opacity: isActive ? 1 : 0.25, duration: 0.35 });
      gsap.to(num, {
        color: isActive ? "#B87333" : "rgba(255,255,255,0.25)",
        duration: 0.35,
      });
      gsap.to(panel, {
        borderColor: isActive
          ? "rgba(184,115,51,0.5)"
          : "rgba(255,255,255,0.04)",
        duration: 0.35,
      });
    });
  };

  useEffect(() => {
    // Always initialize active state so panels are visible on all devices
    setActive(0);
    if (!AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      // Copper hairline scaleX — desktop only (below 1024px no scrub)
      if (hairlineRef.current && window.innerWidth >= 1024) {
        gsap.fromTo(
          hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      } else if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", once: true },
        });
      }

      // Below 1024px: stagger reveal panels, no pin, no scrub counter
      if (window.innerWidth < 1024) {
        const panels = wrapperRef.current?.querySelectorAll<HTMLElement>(".why-panel");
        if (panels?.length) {
          gsap.fromTo(panels, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: wrapperRef.current, start: "top 72%", once: true },
          });
        }
        return;
      }

      // Desktop (≥1024px): panel counter + pin
      // Counter 0→4 synced with pin progress — shows which panel is active
      if (counterRef.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 4,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom 60%",
            scrub: 1.5,
          },
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = Math.round(obj.val)
                .toString()
                .padStart(2, "0");
          },
        });
      }

      // Pinned moment
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        pin: stickyRef.current,
        start: "top top",
        end: "+=" + window.innerHeight * 1.8,
        scrub: 0.8,
        pinSpacing: false,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.28) setActive(0);
          else if (p < 0.52) setActive(1);
          else if (p < 0.76) setActive(2);
          else setActive(3);
        },
      });
    }, wrapperRef);
    pinCtxRef.current = ctx;
    return () => { pinCtxRef.current = null; try { ctx.revert(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="bg-black"
      style={{ minHeight: isMobile ? "auto" : "280vh", position: "relative", zIndex: 2 }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex items-center justify-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
          {/* Header row */}
          <div className="flex items-end justify-between mb-16">
            <div>
              {/* Copper hairline */}
              <div
                ref={hairlineRef}
                className="mb-4"
                style={{
                  height: 1,
                  background: "#B87333",
                  transformOrigin: "left",
                  maxWidth: "48px",
                }}
              />
              <h2 className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
                Why 828 Construction
              </h2>
            </div>
            <div className="text-right">
              <span
                ref={counterRef}
                className="font-numbers font-bold text-[#B87333]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1 }}
              >
                04
              </span>
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.14em] uppercase block">
                / 04 Standards
              </span>
            </div>
          </div>

          {/* Panels */}
          <div className="space-y-0 divide-y divide-white/[0.04]">
            {WHY_PANELS.map((panel, i) => (
              <div
                key={panel.num}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="why-panel py-8 border border-transparent"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-start gap-8">
                  <span
                    ref={(el) => {
                      numRefs.current[i] = el;
                    }}
                    className="font-numbers font-bold flex-shrink-0"
                    aria-hidden="true"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      color: i === 0 ? "#B87333" : "rgba(255,255,255,0.25)",
                      lineHeight: 1,
                    }}
                  >
                    {panel.num}
                  </span>
                  <div>
                    <h3
                      className="why-heading font-display font-bold mb-3 tracking-tight"
                      style={{
                        fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                        color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {panel.title}
                    </h3>
                    <p
                      className="why-body text-gray-400 leading-relaxed"
                      style={{ opacity: i === 0 ? 1 : 0.25 }}
                    >
                      {panel.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 4: Main Content + Sidebar ───────────────────────────────────────
// Techniques: 2 (SplitType char scrub), 3 (scrubbed clip-path), 4 (scale-through-scroll),
//             6 (section overlap), 8 (MagneticButton)

function DetailContent({
  service,
  nextService,
  keywords,
  aduFaq,
  serviceImageSrc,
  serviceImageCaption,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const h2SplitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (h2SplitRef.current) { try { h2SplitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let h2SplitFrame = -1;
    let h2El: HTMLHeadingElement | null = h2Ref.current;
    let h2LocalSplit: SplitType | null = null;
    const ctx = gsap.context(() => {
      // Technique 10: Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(
          hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // Technique 3: Scrubbed clip-path on sidebar image (not fire-once)
      if (imagePaneRef.current) {
        gsap.fromTo(
          imagePaneRef.current,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: imagePaneRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
      }

      // Technique 4: Scale-through-scroll on sidebar image
      if (imgInnerRef.current) {
        gsap.fromTo(
          imgInnerRef.current,
          { scale: 1.08 },
          {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: imagePaneRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 1.5,
            },
          }
        );
      }

      // Technique 2: SplitType char-level scrub on "What's Included" h2
      if (h2El) {
        const _h2 = h2El;
        h2SplitFrame = requestAnimationFrame(() => {
          if (!mounted || !_h2.isConnected) return;
          const split = new SplitType(_h2, { types: "chars" });
          h2LocalSplit = split;
          h2SplitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(
              split.chars,
              { opacity: 0, yPercent: 40 },
              {
                opacity: 1,
                yPercent: 0,
                stagger: { each: 0.025 },
                ease: "none",
                scrollTrigger: {
                  trigger: _h2,
                  start: "top 85%",
                  end: "top 45%",
                  scrub: 1,
                },
              }
            );
          }
        });
      }

      // Main content stagger
      const mainEls =
        sectionRef.current?.querySelectorAll<HTMLElement>(".main-el");
      if (mainEls?.length) {
        gsap.fromTo(
          mainEls,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }

      // Sidebar stagger
      const sideEls =
        sidebarRef.current?.querySelectorAll<HTMLElement>(".side-el");
      if (sideEls?.length) {
        gsap.fromTo(
          sideEls,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sidebarRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(h2SplitFrame);
      if (h2LocalSplit && h2El?.isConnected) { try { h2LocalSplit.revert(); } catch {} }
      h2SplitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, [service.slug]);

  return (
    /* Technique 6: Section overlap — rides over PinnedWhy */
    <section
      ref={sectionRef}
      data-section="service-detail-content"
      className="bg-white py-24"
      style={{ position: "relative", zIndex: 3, marginTop: "-5vh" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Copper hairline at section top */}
        <div
          ref={hairlineRef}
          className="mb-16"
          style={{
            height: 1,
            background: "#B87333",
            transformOrigin: "left",
            maxWidth: "60px",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* ── Main Column ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Description */}
            <p className="main-el text-xl text-gray-600 leading-relaxed mb-12">
              {service.description}
            </p>

            {/* What's included */}
            <h2
              ref={h2Ref}
              className="font-display font-bold text-2xl text-black mb-6 tracking-tight"
            >
              What&apos;s Included
            </h2>
            <ul className="main-el space-y-4 mb-16">
              {service.details.map((detail) => (
                <li key={detail} className="flex items-start gap-4">
                  <span className="w-px h-4 bg-black flex-shrink-0 mt-1.5" />
                  <span className="text-gray-700 leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>

            {/* ADU FAQ */}
            {aduFaq && aduFaq.length > 0 && (
              <div className="main-el border-t border-gray-100 pt-12 mb-16">
                <h2 className="font-display font-bold text-2xl text-black mb-8 tracking-tight">
                  ADU Questions &amp; Answers
                </h2>
                <div className="space-y-6">
                  {aduFaq.map((item) => (
                    <div key={item.q} className="border-b border-gray-100 pb-6">
                      <h3 className="font-display font-bold text-base text-black mb-3">
                        {item.q}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="main-el border-t border-gray-100 pt-8">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="font-labels text-[10px] text-gray-500 border border-gray-200 px-3 py-1 tracking-[0.1em]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div ref={sidebarRef} className="space-y-6">
            {/* Service image: scrubbed clip-path + scale-through-scroll */}
            {serviceImageSrc && (
              <div
                ref={imagePaneRef}
                className="relative overflow-hidden"
                style={{ height: "280px" }}
              >
                <div
                  ref={imgInnerRef}
                  className="absolute inset-0"
                  style={{ scale: "1.08" }}
                >
                  <Image
                    src={serviceImageSrc}
                    alt={`828 Construction — ${service.title}`}
                    fill
                    className="object-cover project-img"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {serviceImageCaption && (
                  <div className="absolute bottom-4 left-4">
                    <span className="font-labels text-[9px] text-white/60 tracking-[0.18em] uppercase">
                      {serviceImageCaption}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CTA box — Technique 8: MagneticButton */}
            <div className="side-el bg-black p-8">
              <h3 className="font-display font-bold text-lg text-white mb-4">
                Get a Free Estimate
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Ready to discuss your {service.title.toLowerCase()} project?
                We&apos;ll get back to you within 24 hours.
              </p>
              <MagneticButton strength={0.3}>
                <Link
                  href="/contact"
                  className="btn-shine btn-lift block text-center bg-white text-black px-5 py-3 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-[#B87333] hover:text-white transition-colors mb-4"
                >
                  Request Estimate
                </Link>
              </MagneticButton>
              <a
                href={SITE.phoneHref}
                className="block text-center border border-gray-700 text-white px-5 py-3 font-labels text-[10px] tracking-[0.18em] uppercase hover:border-white transition-colors font-numbers"
              >
                {SITE.phone}
              </a>
            </div>

            {/* Service area */}
            <div className="side-el border border-gray-200 p-8">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">
                Service Area
              </div>
              <div className="space-y-2">
                {SITE.serviceArea.map((city) => (
                  <div key={city} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-sm text-gray-500">{city}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next service */}
            <div className="side-el border border-gray-200 p-8">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">
                Next Service
              </div>
              <Link
                href={`/services/${nextService.slug}`}
                className="group block"
              >
                <div className="font-display font-bold text-black group-hover:text-gray-600 transition-colors mb-1">
                  {nextService.title}
                </div>
                <div className="font-labels text-[10px] text-gray-500 tracking-[0.15em] uppercase">
                  {nextService.short} →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ServiceDetailContent(props: Props) {
  return (
    <>
      {/* Technique 1+2+9+10: DetailHero with bg image parallax + SplitType + counter + hairline */}
      <DetailHero service={props.service} serviceImageSrc={props.serviceImageSrc} />

      {/* Technique 7: CSS marquee horizontal strip */}
      <DetailStrip slug={props.service.slug} />

      {/* Technique 5+9+10: Pinned "Why 828" section */}
      <PinnedWhy />

      {/* Technique 2+3+4+6+8: Content with scrubbed clips, scale, overlap, MagneticButton */}
      <DetailContent {...props} />
    </>
  );
}
