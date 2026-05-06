"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import GlassCard from "@/components/system/GlassCard";
import { ConstructionLineSilhouette } from "@/components/system/silhouettes";

gsap.registerPlugin(ScrollTrigger);

// ─── Shared: BOOK CALL asterisk dropdown ─────────────────────────────────────

function BookCallDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Book a call — reveals phone number"
        className="flex items-center gap-2 bg-white text-black px-6 py-3 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-gray-100 transition-colors duration-200"
      >
        BOOK CALL
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          role="region"
          aria-label="Phone number"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "#000",
            border: "1px solid rgba(255,255,255,0.1)",
            borderTop: "1px solid var(--color-accent)",
            padding: "12px 20px",
            animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both",
            zIndex: 20,
            minWidth: "180px",
          }}
        >
          <a
            href={SITE.phoneHref}
            className="font-numbers text-sm text-white hover:text-gray-300 transition-colors whitespace-nowrap tracking-wide"
          >
            {SITE.phone}
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Section 1: Visual Hero ───────────────────────────────────────────────────

function RemediationHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const silhouetteRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imgWrapRef.current) {
        gsap.to(imgWrapRef.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }

      if (silhouetteRef.current && AnimationController.shouldAnimate()) {
        gsap.to(silhouetteRef.current, {
          yPercent: -30, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.2 },
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="remediation-hero"
      className="relative"
      style={{ minHeight: "100vh" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-screen">

        {/* ── Image side (60%) ── */}
        <div
          className="relative overflow-hidden min-h-[55vh] lg:min-h-0 order-2 lg:order-1"
          aria-hidden="true"
        >
          <div
            ref={imgWrapRef}
            className="absolute inset-x-0"
            style={{ top: "-7.5%", height: "115%" }}
          >
            <Image
              src="/images/projects/remediation-after.jpg"
              alt="828 Construction — remediation work, Torrance CA"
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 60vw"
              style={{ filter: "contrast(1.05) saturate(1.08)" }}
            />
          </div>
          <div
            className="absolute inset-y-0 right-0 w-1/3 lg:w-2/5"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.9))" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 lg:hidden"
            style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
            aria-hidden="true"
          />
          {/* Architectural silhouette — parallax depth layer */}
          <div
            ref={silhouetteRef}
            aria-hidden="true"
            className="absolute bottom-0 right-8 pointer-events-none hidden lg:block"
            style={{ width: "25%", zIndex: 10, color: "white", opacity: 0.12, willChange: "transform" }}
          >
            <ConstructionLineSilhouette style={{ width: "100%", height: "auto" }} />
          </div>
        </div>

        {/* ── Copy side (40%) ── */}
        <div className="relative bg-black flex flex-col justify-center px-8 sm:px-12 lg:px-14 xl:px-20 py-20 lg:py-0 order-1 lg:order-2">
          <Link
            href="/services"
            className="font-labels text-[10px] text-gray-500 tracking-[0.18em] uppercase hover:text-white transition-colors inline-flex items-center gap-1 mb-12 lg:mb-16"
          >
            ← Services
          </Link>

          <div
            className="mb-5"
            style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, maxWidth: 48 }}
            aria-hidden="true"
          />

          <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5 hero-meta-animate">
            Service — Remediation
          </span>

          <h1
            className="font-display font-bold text-white tracking-tight leading-[0.88] mb-10"
            style={{ fontSize: "clamp(2.8rem, 5vw, 6rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.1s" }}>
                Complex conditions,
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.22s" }}>
                refined expertise.
              </span>
            </span>
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            <BookCallDropdown />
            <Link
              href="/contact"
              className="font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase border-b border-white/15 hover:border-[var(--color-accent)] hover:text-white transition-colors duration-200 pb-0.5"
            >
              Get in touch
            </Link>
          </div>

          <div className="mt-auto pt-16 border-t border-white/[0.06]">
            <span className="font-labels text-[9px] text-gray-600 tracking-[0.18em] uppercase">
              CA License #{SITE.license} · Est. 2004
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Identifying the Need + FAQ ───────────────────────────────────

const REMEDIATION_FAQ = [
  {
    q: "What causes mold growth?",
    a: "Mold needs moisture, oxygen, and organic materials to grow. Common causes are poor ventilation, high humidity, and water intrusion or leaks.",
  },
  {
    q: "What is mold remediation?",
    a: "It's the process of identifying, containing, removing, and preventing mold growth. It includes cleanup, air filtration, and addressing the moisture source.",
  },
  {
    q: "Can mold affect my health?",
    a: "Yes — exposure may cause coughing, sneezing, headaches, skin irritation, asthma flare-ups, and fatigue, especially in sensitive individuals.",
  },
];

function RemediationNeed() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1 },
        });
      }

      if (!AnimationController.shouldAnimate()) {
        if (bodyRef.current) gsap.fromTo(bodyRef.current, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 82%", once: true },
        });
        return;
      }

      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 85%", end: "top 50%", scrub: 1.2 },
        });
      }

      const faqItems = sectionRef.current?.querySelectorAll<HTMLElement>(".faq-item");
      if (faqItems?.length) {
        faqItems.forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 88%", end: "top 62%", scrub: 1.1 },
          });
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="remediation-need"
      className="bg-white py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          <div className="lg:col-span-5">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
              Identifying the Need
            </span>
            <h2
              className="font-display font-normal text-black tracking-tight leading-[0.95] mb-8"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              When remediation becomes necessary.
            </h2>
            <p ref={bodyRef} className="text-gray-600 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              Mold remediation becomes necessary when moisture intrudes on a structure — whether from a leaky roof, cracked pipes, or aged windows. Beyond visible damage, the hidden danger lies in mold spores between materials. Long-term exposure may contribute to respiratory issues, allergies, and other health concerns.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-gray-200">
              {REMEDIATION_FAQ.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i} className="faq-item border-b border-gray-200">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`rem-faq-${i}`}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span className="font-labels text-[11px] text-black tracking-[0.12em] uppercase group-hover:text-gray-600 transition-colors duration-200 pr-4">
                        {String(i + 1).padStart(2, "0")} — {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-block",
                          flexShrink: 0,
                          transition: "transform 0.3s ease",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          color: "var(--color-accent)",
                          fontWeight: 300,
                          fontSize: "1.5rem",
                          lineHeight: 1,
                          width: "1.5rem",
                          textAlign: "center",
                        }}
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={`rem-faq-${i}`}
                      style={{
                        overflow: "hidden",
                        maxHeight: isOpen ? "300px" : "0",
                        transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <GlassCard tone="light" className="p-4 mt-2 mb-4">
                        <p className="text-gray-600 text-sm leading-relaxed pr-4">
                          {item.a}
                        </p>
                      </GlassCard>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: The Process ───────────────────────────────────────────────────

const REMEDIATION_PROCESS = [
  {
    num: "01",
    title: "Initial call",
    desc: "Understanding the situation — scope, urgency, and known conditions before site time is committed.",
  },
  {
    num: "02",
    title: "Visual inspection / testing",
    desc: "On-site diagnostic with 20+ years of pattern recognition. We look where others don't.",
  },
  {
    num: "03",
    title: "Remediation / scope of work",
    desc: "Written scope and transparent pricing before a single tool is picked up. No surprises.",
  },
  {
    num: "04",
    title: "Build back / reconstruction",
    desc: "Full build-back to code with documentation. Useful for insurance claims and resale disclosure.",
  },
];

function RemediationProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1 },
        });
      }

      const steps = sectionRef.current?.querySelectorAll<HTMLElement>(".process-step");
      if (steps?.length) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(steps, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
          return;
        }
        steps.forEach((step) => {
          gsap.fromTo(step, { opacity: 0, y: 28 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: step, start: "top 85%", end: "top 52%", scrub: 1.2 },
          });
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="remediation-process"
      style={{ background: "#0a0a0a" }}
      className="py-24 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-16">
          <div className="lg:col-span-4">
            <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
              The Approach
            </span>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.88]"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
            >
              Build<br />philosophy.
            </h2>
          </div>
          <div className="lg:col-span-8 lg:pt-3">
            <p className="text-gray-400 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              A disciplined four-step approach — from first call through complete reconstruction.
            </p>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-white/[0.05]">
          {REMEDIATION_PROCESS.map((step) => (
            <div key={step.num} className="process-step grid grid-cols-[4rem_1fr] lg:grid-cols-[6rem_1fr] gap-6 lg:gap-10 py-8">
              <div>
                <span
                  className="font-numbers font-bold leading-none"
                  aria-hidden="true"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--color-accent)", display: "block" }}
                >
                  {step.num}
                </span>
              </div>
              <div>
                <h3
                  className="font-display font-bold text-white tracking-tight mb-2"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Why 828 + Equipment Showcase ──────────────────────────────────
// Remediation page signature: equipment model showcase (Flair E8 / F277 MR)

function RemediationWhy() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1 },
        });
      }

      const whyEls = sectionRef.current?.querySelectorAll<HTMLElement>(".why-el");
      if (whyEls?.length) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(whyEls, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
          return;
        }
        whyEls.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: 1.2 },
          });
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="remediation-why"
      className="bg-black py-24 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">

          {/* Left: Why 828 copy */}
          <div className="lg:col-span-5">
            <span className="why-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-5">
              Why 828
            </span>
            <h2
              className="why-el font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}
            >
              Expertise beyond the surface.
            </h2>
            <div className="why-el space-y-6 text-gray-400 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              <p>
                With decades of expertise, 828 brings a refined understanding of mold and its underlying causes — beyond visible factors such as water intrusion and construction defects. We employ a comprehensive diagnostic approach to considered conditions.
              </p>
              <p>
                This informs an advanced remediation methodology that exceeds industry standards.
              </p>
            </div>
          </div>

          {/* Right: Equipment showcase */}
          <div className="lg:col-span-7">
            <span className="why-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-6">
              Equipment Used
            </span>
            <div className="why-el grid grid-cols-1 sm:grid-cols-2 gap-[2px]">

              {/* Flair E8 */}
              <div className="relative bg-[#111] overflow-hidden" style={{ aspectRatio: "4/3" }}>
                {/* TODO: REMEDIATION_EQUIPMENT_PHOTOS_PENDING — replace with real Flair E8 photo from Joe */}
                <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <div>
                    <div
                      className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-1"
                    >
                      Equipment
                    </div>
                    <div
                      className="font-numbers font-bold text-white"
                      style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)" }}
                    >
                      Flair E8
                    </div>
                    <div className="font-labels text-[9px] tracking-[0.15em] uppercase mt-1" style={{ color: "var(--color-accent)" }}>
                      Dehumidification unit
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="font-labels text-[10px] text-gray-700 tracking-[0.2em] uppercase">
                    Photo pending
                  </span>
                </div>
              </div>

              {/* F277 MR */}
              <div className="relative bg-[#111] overflow-hidden" style={{ aspectRatio: "4/3" }}>
                {/* TODO: REMEDIATION_EQUIPMENT_PHOTOS_PENDING — replace with real F277 MR photo from Joe */}
                <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <div>
                    <div
                      className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-1"
                    >
                      Equipment
                    </div>
                    <div
                      className="font-numbers font-bold text-white"
                      style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)" }}
                    >
                      F277 MR
                    </div>
                    <div className="font-labels text-[9px] tracking-[0.15em] uppercase mt-1" style={{ color: "var(--color-accent)" }}>
                      Air filtration unit
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="font-labels text-[10px] text-gray-700 tracking-[0.2em] uppercase">
                    Photo pending
                  </span>
                </div>
              </div>
            </div>
            <p className="why-el text-gray-600 text-xs mt-3 leading-relaxed font-labels tracking-[0.1em]">
              Real equipment photos from Joe — pending delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Start Here ────────────────────────────────────────────────────

function RemediationStartHere() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {};
  }, []);

  useEffect(() => {
    let mounted = true;
    let splitFrame = -1;
    let localSplit: SplitType | null = null;
    const headlineEl = headlineRef.current;

    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1 },
        });
      }

      const bodyEls = sectionRef.current?.querySelectorAll<HTMLElement>(".start-el");
      if (bodyEls?.length) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(bodyEls, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
          return;
        }
        bodyEls.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: 1.2 },
          });
        });
      }

      if (headlineEl && AnimationController.shouldAnimate()) {
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !headlineEl.isConnected) return;
          const split = new SplitType(headlineEl, { types: "words,chars" });
          localSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(split.chars, { opacity: 0, yPercent: 40 }, {
              opacity: 1, yPercent: 0,
              stagger: { each: 0.02 }, ease: "none",
              scrollTrigger: { trigger: headlineEl, start: "top 85%", end: "top 45%", scrub: 1 },
            });
          }
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (localSplit && headlineEl?.isConnected) { try { localSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {};
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="remediation-start-here"
      style={{ background: "#0a0a0a" }}
      className="py-24 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          <div>
            <span className="start-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-5">
              Start Restoration
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Begin the path to renewal.
            </h2>
            <p className="start-el text-gray-400 leading-relaxed mb-10" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              Above all else, your peace of mind is paramount. We understand the disruption and urgency that follows damage — from restoring environmental integrity to complete reconstruction. 828 Construction delivers a seamless, disciplined process from remediation through completion.
            </p>
            <div className="start-el flex items-center gap-4 flex-wrap">
              <BookCallDropdown />
              <Link
                href="/contact"
                className="font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase border-b border-white/15 hover:border-[var(--color-accent)] hover:text-white transition-colors duration-200 pb-0.5"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div>
            <div className="start-el font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase mb-6">
              Three services, one standard
            </div>
            <div className="space-y-0 divide-y divide-white/[0.06]">
              {[
                { slug: "adu", label: "ADU Construction", short: "Accessory Dwelling Units" },
                { slug: "consulting", label: "Consulting", short: "Expert Advisory Services" },
              ].map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="start-el group flex items-center justify-between py-5 hover:text-white transition-colors duration-200"
                >
                  <div>
                    <div className="font-labels text-[9px] text-gray-600 tracking-[0.2em] uppercase mb-1">{s.short}</div>
                    <div className="font-display font-bold text-gray-400 group-hover:text-white transition-colors" style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}>
                      {s.label}
                    </div>
                  </div>
                  <span className="font-labels text-gray-600 group-hover:text-[var(--color-accent)] transition-colors ml-4">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function RemediationServiceContent() {
  return (
    <>
      <RemediationHero />
      <RemediationNeed />
      <RemediationProcess />
      <RemediationWhy />
      <RemediationStartHere />
    </>
  );
}
