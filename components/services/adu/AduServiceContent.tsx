"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// ─── Shared: BOOK CALL asterisk dropdown ─────────────────────────────────────

function BookCallDropdown({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Book a call — reveals phone number"
        className={`flex items-center gap-2 px-6 py-3 font-labels text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 ${
          dark
            ? "bg-white text-black hover:bg-gray-100"
            : "bg-black text-white hover:bg-gray-900 border border-white/20"
        }`}
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

function AduHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image parallax scrub — desktop + mobile
      if (imgWrapRef.current) {
        gsap.to(imgWrapRef.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="adu-hero"
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
              src="/images/projects/adu-exterior-new.jpg"
              alt="828 Construction — detached ADU exterior, Torrance CA"
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 60vw"
              style={{ filter: "contrast(1.05) saturate(1.08)" }}
            />
          </div>
          {/* Gradient where image meets copy side */}
          <div
            className="absolute inset-y-0 right-0 w-1/3 lg:w-2/5"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.9))" }}
            aria-hidden="true"
          />
          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 lg:hidden"
            style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
            aria-hidden="true"
          />
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
            ADU — accessory dwelling unit
          </span>

          <h1
            className="font-display font-bold text-white tracking-tight leading-[0.88] mb-10"
            style={{ fontSize: "clamp(3.2rem, 5.5vw, 6.5rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.1s" }}>
                Built with
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.2s" }}>
                intent.
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

          {/* License badge */}
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

const ADU_FAQ = [
  {
    q: "How much does an ADU cost in Torrance?",
    a: "ADU construction costs in Torrance typically range from $150,000 to $350,000 depending on size, design, and finishes. 828 Construction provides detailed estimates after a free consultation.",
  },
  {
    q: "Do I need a permit for an ADU in Torrance?",
    a: "Yes, all ADU construction in Torrance requires building permits. 828 Construction manages the permitting process and ensures full compliance with Torrance zoning regulations.",
  },
  {
    q: "How long does it take to build an ADU in Torrance?",
    a: "A typical ADU takes 6–12 months from initial consultation to completion, including design, permitting, and construction. The permit phase alone can take 2–4 months depending on city workload.",
  },
  {
    q: "What types of ADUs can be built on my property?",
    a: "Depending on your lot and zoning, you may qualify for a detached ADU, an attached ADU, a garage conversion, or a Junior ADU (JADU). We assess your property and advise which option is feasible.",
  },
];

function AduNeed() {
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
      data-section="adu-need"
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

          {/* Left: label + body copy */}
          <div className="lg:col-span-5">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
              Identifying the Need
            </span>
            <h2
              className="font-display font-normal text-black tracking-tight leading-[0.95] mb-8"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              The case for an ADU.
            </h2>
            <p ref={bodyRef} className="text-gray-600 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              Whether you&rsquo;re looking to refine a private retreat, host guests, accommodate family, or expand your living space while elevating the property&rsquo;s overall value — an ADU is one of the most flexible additions a home can carry.
            </p>
          </div>

          {/* Right: FAQ accordion */}
          <div className="lg:col-span-7">
            <div className="border-t border-gray-200">
              {ADU_FAQ.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i} className="faq-item border-b border-gray-200">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`adu-faq-${i}`}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span
                        className="font-labels text-[11px] text-black tracking-[0.12em] uppercase group-hover:text-gray-600 transition-colors duration-200 pr-4"
                      >
                        {item.q}
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
                      id={`adu-faq-${i}`}
                      style={{
                        overflow: "hidden",
                        maxHeight: isOpen ? "300px" : "0",
                        transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <p className="text-gray-500 text-sm leading-relaxed pb-6 pr-8">
                        {item.a}
                      </p>
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

const ADU_PROCESS = [
  {
    num: "01",
    title: "Initial contact / Pre-construction",
    desc: "First meeting to understand scope, goals, and site constraints. No commitment required.",
  },
  {
    num: "02",
    title: "Site visit / Design",
    desc: "On-site walkthrough and design coordination — scope aligned before any permit is filed.",
  },
  {
    num: "03",
    title: "Permit & approval",
    desc: "828 manages the Torrance permit process start to finish. You don't chase two parties.",
  },
  {
    num: "04",
    title: "Construction / Full build / Project completion",
    desc: "Licensed full build from foundation to finish. One point of accountability, end to end.",
  },
  {
    num: "05",
    title: "Post-construction",
    desc: "Walkthrough, documentation, and continued support. We don't disappear after handoff.",
  },
];

function AduProcess() {
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
      data-section="adu-process"
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
              A structured approach to every ADU project — from first contact through post-construction support.
            </p>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-white/[0.05]">
          {ADU_PROCESS.map((step) => (
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

// ─── Section 4: ADU Acronym + Invitation ─────────────────────────────────────
// ADU page signature: "ADU" watermark backdrop with scrub-reveal letter definitions

const ADU_DEFINITIONS = [
  {
    letter: "A",
    word: "Aligned",
    definition:
      '"Aligned with the client\'s vision, ensuring every detail reflects their lifestyle and goals."',
  },
  {
    letter: "D",
    word: "Dedicated",
    definition:
      '"Unwavering commitment to exceptional quality, precision, and craftsmanship at every stage."',
  },
  {
    letter: "U",
    word: "Understanding",
    definition:
      '"Renovation is both a structural transformation and a personal journey — guiding clients through with clarity, care, and steady expertise to make the process feel seamless and supportive."',
  },
];

const INVITATION_ITEMS = [
  "Seeking a collaboration with a bespoke builder",
  "Is uncompromising quality non-negotiable for your project",
  "Prepared to invest the time and resources required to realize your vision",
  "Do you value clear communication and a highly considered building experience",
];

function AduAcronym() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
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

      // ADU page signature: watermark drifts subtly on scroll (unique to this page)
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      const defItems = sectionRef.current?.querySelectorAll<HTMLElement>(".def-item");
      if (defItems?.length) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(defItems, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
          });
          return;
        }
        defItems.forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 32 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 88%", end: "top 55%", scrub: 1.2 },
          });
        });
      }

      const invItems = sectionRef.current?.querySelectorAll<HTMLElement>(".inv-item");
      if (invItems?.length) {
        if (AnimationController.shouldAnimate()) {
          invItems.forEach((item) => {
            gsap.fromTo(item, { opacity: 0, x: -16 }, {
              opacity: 1, x: 0, ease: "power2.out",
              scrollTrigger: { trigger: item, start: "top 88%", end: "top 60%", scrub: 1.1 },
            });
          });
        }
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="adu-acronym"
      className="bg-black py-24 lg:py-40 relative overflow-hidden"
    >
      {/* ADU watermark backdrop — page signature */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-display font-bold text-white leading-none"
          style={{
            fontSize: "clamp(14rem, 45vw, 36rem)",
            opacity: 0.04,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          ADU
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
          <div className="lg:col-span-4">
            <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
              Why 828
            </span>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.88]"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
            >
              The ADU<br />standard.
            </h2>
          </div>
        </div>

        {/* A / D / U definitions */}
        <div className="space-y-0 divide-y divide-white/[0.06] mb-20">
          {ADU_DEFINITIONS.map((item) => (
            <div
              key={item.letter}
              className="def-item grid grid-cols-[3.5rem_1fr] lg:grid-cols-[8rem_1fr] gap-6 lg:gap-10 py-10 lg:py-12"
            >
              <div className="flex flex-col items-start">
                <span
                  className="font-display font-bold leading-none"
                  aria-hidden="true"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    color: "var(--color-accent)",
                  }}
                >
                  {item.letter}
                </span>
              </div>
              <div>
                <span
                  className="font-display font-bold text-white block mb-3 tracking-tight"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
                >
                  {item.word}
                </span>
                <p className="text-gray-400 leading-relaxed italic" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                  {item.definition}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* An invitation to work together */}
        <div className="border-t border-white/[0.08] pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
                An invitation to work together
              </span>
              <h3
                className="font-display font-normal text-white tracking-tight leading-[0.95]"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Does this resonate?
              </h3>
            </div>

            <div className="lg:col-span-8">
              <ul className="space-y-0 divide-y divide-white/[0.06]" aria-label="Invitation to work together">
                {INVITATION_ITEMS.map((item, i) => (
                  <li
                    key={i}
                    className="inv-item flex items-start gap-5 py-6"
                  >
                    <span
                      className="font-numbers font-bold leading-none flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                      style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)", color: "var(--color-accent)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-gray-300 leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                      {item}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-gray-500 italic leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                &ldquo;If this resonates with your expectations, welcome the opportunity to explore your project.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Start Here ────────────────────────────────────────────────────

const WHAT_HAPPENS = [
  "Company will review and reach out",
  "You'll receive a response",
  "Scheduled call understanding the project",
  "If aligned, we'll arrange a site visit / initial brief",
];

function AduStartHere() {
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
      data-section="adu-start-here"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">

          {/* Left: headline + body + CTA */}
          <div className="lg:col-span-6">
            <span className="start-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-5">
              Start Here
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
            >
              Prepared to proceed with your vision?
            </h2>
            <p className="start-el text-gray-400 leading-relaxed mb-10" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              Whether your vision is fully defined or still evolving, start by completing the form and 828 Construction will personally contact you to review the project and explore it further.
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

          {/* Right: what happens after */}
          <div className="lg:col-span-6">
            <div className="start-el font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase mb-6">
              What happens after
            </div>
            <div className="relative">
              <div
                className="absolute left-4 top-6"
                style={{
                  width: 1,
                  bottom: "1.5rem",
                  background: "linear-gradient(to bottom, rgba(123,45,38,0.5), rgba(123,45,38,0.06))",
                }}
                aria-hidden="true"
              />
              <div className="space-y-5">
                {WHAT_HAPPENS.map((text, i) => (
                  <div key={i} className="start-el flex items-start gap-4 relative">
                    <span
                      className="font-numbers font-bold leading-none flex-shrink-0 w-8 relative z-10"
                      style={{ color: "var(--color-accent)", fontSize: "clamp(1rem, 1.8vw, 1.2rem)", paddingRight: "0.2rem" }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-gray-500 text-sm leading-relaxed pt-0.5">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AduServiceContent() {
  return (
    <>
      <AduHero />
      <AduNeed />
      <AduProcess />
      <AduAcronym />
      <AduStartHere />
    </>
  );
}
