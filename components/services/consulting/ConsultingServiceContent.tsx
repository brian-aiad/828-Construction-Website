"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { BlueprintCornerSilhouette } from "@/components/system/silhouettes";

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

function ConsultingHero() {
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
          yPercent: -75, ease: "none",
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
      data-section="consulting-hero"
      className="relative"
      style={{ minHeight: "100vh", overflowX: "clip" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-screen">

        {/* ── Image side (60%) ── */}
        <div
          className="relative overflow-hidden min-h-[55vh] lg:min-h-0 order-2 lg:order-1"
          aria-hidden="true"
        >
          {/* Drifting mesh gradient — Consulting: copper + maroon + warm white */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <div style={{
              position: "absolute", borderRadius: "50%",
              width: "65%", height: "75%", top: "-10%", left: "10%",
              background: "radial-gradient(ellipse, rgba(184,115,51,0.28) 0%, transparent 70%)",
              animation: "meshDrift1 16s ease-in-out infinite", opacity: 0.35,
            }} />
            <div style={{
              position: "absolute", borderRadius: "50%",
              width: "55%", height: "60%", bottom: "0%", right: "-5%",
              background: "radial-gradient(ellipse, rgba(123,45,38,0.28) 0%, transparent 70%)",
              animation: "meshDrift3 16s ease-in-out infinite 6s", opacity: 0.35,
            }} />
            <div style={{
              position: "absolute", borderRadius: "50%",
              width: "40%", height: "45%", top: "40%", left: "5%",
              background: "radial-gradient(ellipse, rgba(255,240,220,0.06) 0%, transparent 70%)",
              animation: "meshDrift2 16s ease-in-out infinite 3s", opacity: 0.35,
            }} />
          </div>

          <div
            ref={imgWrapRef}
            className="absolute inset-x-0"
            style={{ top: "-7.5%", height: "115%", zIndex: 2 }}
          >
            <Image
              src="/images/projects/consulting-blueprints.jpg"
              alt="828 Construction — consulting and inspection services, Torrance CA"
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
            style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.9))", zIndex: 3 }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 lg:hidden"
            style={{ background: "linear-gradient(to bottom, transparent, #000)", zIndex: 3 }}
            aria-hidden="true"
          />

          {/* BlueprintCornerSilhouette — 65vw, opacity 0.55, idle float */}
          <div
            ref={silhouetteRef}
            aria-hidden="true"
            className="absolute pointer-events-none hidden lg:block"
            style={{
              width: "65vw",
              right: "-8vw",
              top: "50%",
              zIndex: 4,
              color: "white",
              opacity: 0.55,
              willChange: "transform",
              animation: "silhouetteFloat 5s ease-in-out infinite 2s",
            }}
          >
            <BlueprintCornerSilhouette style={{ width: "100%", height: "auto" }} />
          </div>
        </div>

        {/* ── Copy side (40%) ── */}
        <div className="relative bg-black flex flex-col justify-center px-8 sm:px-12 lg:px-14 xl:px-20 py-20 lg:py-0 order-1 lg:order-2" style={{ zIndex: 5 }}>
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
            Consulting
          </span>

          <h1
            className="font-display font-bold text-white tracking-tight leading-[0.88] mb-10"
            style={{ fontSize: "clamp(2.8rem, 5vw, 6rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.4s" }}>
                Delivering
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.52s" }}>
                considerate
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-animate block" style={{ animationDelay: "0.64s" }}>
                solutions.
              </span>
            </span>
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="pulse-glow">
              <BookCallDropdown />
            </div>
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

// ─── Section 2: Identifying the Need + Benefits ───────────────────────────────

const CONSULTING_BENEFITS = [
  {
    num: "01",
    title: "Early detection of issues",
    subtitle: "Surface what others overlook before costs compound.",
  },
  {
    num: "02",
    title: "Creative problem solving",
    subtitle: "Practical solutions shaped by decades of field experience.",
  },
  {
    num: "03",
    title: "Expert insight for preventative care",
    subtitle: "Prevent expensive failures before they begin.",
  },
  {
    num: "04",
    title: "Design & structural enhancements",
    subtitle: "Informed assessments on what's worth doing — and what's not.",
  },
  {
    num: "05",
    title: "Peace of mind",
    subtitle: "Move forward with clarity and confidence on your investment.",
  },
];

function ConsultingNeed() {
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

        const benefitItems = sectionRef.current?.querySelectorAll<HTMLElement>(".benefit-item");
        if (benefitItems?.length) {
          gsap.fromTo(benefitItems, { opacity: 0, y: 16 }, {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
          });
        }
        return;
      }

      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 85%", end: "top 50%", scrub: 1.2 },
        });
      }

      const benefitItems = sectionRef.current?.querySelectorAll<HTMLElement>(".benefit-item");
      if (benefitItems?.length) {
        benefitItems.forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 88%", end: "top 60%", scrub: 1.1 },
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
      data-section="consulting-need"
      className="bg-white py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left: copy */}
          <div className="lg:col-span-5">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
              Identifying the Need
            </span>
            <h2
              className="font-display font-normal text-black tracking-tight leading-[0.95] mb-8"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              Clarity before commitment.
            </h2>
            <p ref={bodyRef} className="text-gray-600 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              As a consulting and inspection-led general contractor, we start by understanding your project&rsquo;s conditions, budget, timeline, goals, and design vision — what challenges you are currently facing. Through careful evaluation and clear communication, we deliver responsible, tailored solutions that align with your project&rsquo;s unique needs.
            </p>
          </div>

          {/* Right: 5 benefits */}
          <div className="lg:col-span-7">
            <div className="border-t border-gray-200">
              {CONSULTING_BENEFITS.map((benefit) => (
                <div
                  key={benefit.num}
                  className="benefit-item grid grid-cols-[3.5rem_1fr] gap-5 py-6 border-b border-gray-200"
                >
                  <span
                    className="font-numbers font-bold leading-none mt-0.5"
                    aria-hidden="true"
                    style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)", color: "var(--color-accent)" }}
                  >
                    {benefit.num}
                  </span>
                  <div>
                    <div
                      className="font-display font-bold text-black tracking-tight mb-1"
                      style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)" }}
                    >
                      {benefit.title}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {benefit.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Q&A (visible large-format prompts — NOT accordion) ────────────
// Consulting page signature: 3 large-format visible prompts with maroon numerals

const CONSULTING_QA = [
  {
    num: "01",
    question:
      "What challenges or uncertainties are you currently experiencing with your home project that require expert guidance?",
  },
  {
    num: "02",
    question:
      "What outcomes or improvements are you seeking through professional construction, consulting, and inspection services?",
  },
  {
    num: "03",
    question:
      "How important is clarity, accuracy, and expert oversight in achieving your project's success and long-term value?",
  },
];

function ConsultingQA() {
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

      const introEl = sectionRef.current?.querySelector<HTMLElement>(".qa-intro");
      if (introEl) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(introEl, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: introEl, start: "top 82%", once: true },
          });
        } else {
          gsap.fromTo(introEl, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: introEl, start: "top 85%", end: "top 55%", scrub: 1.2 },
          });
        }
      }

      const qaItems = sectionRef.current?.querySelectorAll<HTMLElement>(".qa-item");
      if (qaItems?.length) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(qaItems, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
          });
        } else {
          qaItems.forEach((item) => {
            gsap.fromTo(item, { opacity: 0, y: 32 }, {
              opacity: 1, y: 0, ease: "power2.out",
              scrollTrigger: { trigger: item, start: "top 85%", end: "top 50%", scrub: 1.2 },
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
      data-section="consulting-qa"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-16">
          <div className="lg:col-span-5">
            <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
              Before We Begin
            </span>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.88]"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
            >
              Consider these.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <p className="qa-intro text-gray-400 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              As a general contractor offering consulting and home inspection services, we provide peace of mind by uncovering hidden issues, ensuring structural integrity, and delivering tailored solutions that align with your vision.
            </p>
          </div>
        </div>

        {/* Three large-format prompts — always visible, no accordion */}
        <div className="space-y-0 divide-y divide-white/[0.06]">
          {CONSULTING_QA.map((item) => (
            <div
              key={item.num}
              className="qa-item grid grid-cols-[4rem_1fr] lg:grid-cols-[8rem_1fr] gap-6 lg:gap-10 py-10 lg:py-14"
            >
              <div>
                <span
                  className="font-numbers font-bold leading-none"
                  aria-hidden="true"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    color: "var(--color-accent)",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  {item.num}
                </span>
              </div>
              <div className="flex items-center">
                <p
                  className="font-display font-normal text-white leading-[1.1]"
                  style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)" }}
                >
                  {item.question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: CTA ───────────────────────────────────────────────────────────

function ConsultingCTA() {
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

      const ctaEls = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-el");
      if (ctaEls?.length) {
        if (!AnimationController.shouldAnimate()) {
          gsap.fromTo(ctaEls, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
          return;
        }
        ctaEls.forEach((el) => {
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
      data-section="consulting-cta"
      className="bg-black py-24 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          className="mb-10"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, transformOrigin: "left", maxWidth: 60 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7">
            <span className="cta-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-5">
              Start Here
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Engineered solutions tailored to your project.
            </h2>
            <p className="cta-el text-gray-400 leading-relaxed mb-10" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
              Precision begins with understanding. Let&rsquo;s explore what your project requires.
            </p>
            <div className="cta-el flex items-center gap-4 flex-wrap">
              <BookCallDropdown />
              <Link
                href="/contact"
                className="font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase border-b border-white/15 hover:border-[var(--color-accent)] hover:text-white transition-colors duration-200 pb-0.5"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="cta-el font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase mb-6">
              Also available
            </div>
            <div className="space-y-0 divide-y divide-white/[0.06]">
              {[
                { slug: "adu", label: "ADU Construction", short: "Accessory Dwelling Units" },
                { slug: "remediation", label: "Remediation", short: "Structural & Environmental" },
              ].map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="cta-el group flex items-center justify-between py-5 hover:text-white transition-colors duration-200"
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

export default function ConsultingServiceContent() {
  return (
    <>
      <ConsultingHero />
      <ConsultingNeed />
      <ConsultingQA />
      <ConsultingCTA />
    </>
  );
}
