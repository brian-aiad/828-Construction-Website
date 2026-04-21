"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import ContactForm from "@/components/contact/ContactForm";
import MagneticButton from "@/components/ui/MagneticButton";
import { AnimationController } from "@/utils/animationControl";
import { useMobile } from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const nextSteps = [
  { step: "01", text: "Joe reviews your message personally." },
  { step: "02", text: "You receive a response within 24 hours — often same day." },
  { step: "03", text: "We schedule a brief call to understand your project." },
  { step: "04", text: "If it's a fit, we arrange a site visit and provide a detailed estimate." },
];

const includeItems = [
  "Your city or neighborhood",
  "Type of project (ADU, repair, consulting)",
  "Stage of project — early planning or urgent issue",
  "Your timeline or any deadline",
  "Main question or concern",
];

// ─── Section: Hero ────────────────────────────────────────────────────────────

function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let heroLineEl: HTMLElement | null = null;
    let heroSplit: SplitType | null = null;
    const ctx = gsap.context(() => {
      // ── Technique 1: Triple-layer parallax ──────────────────────────────
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (midRef.current) {
        gsap.to(midRef.current, {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: 5, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // ── Technique 2: SplitType char scatter exit ─────────────────────────
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".ctct-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "chars" });
          heroSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          gsap.to(chars, {
            yPercent: -80, opacity: 0,
            stagger: { each: 0.014, from: "random" }, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "30% top", end: "bottom top", scrub: 1.2 },
          });
          const lcpLine = headlineRef.current?.querySelector(".ctct-lcp-line");
          if (lcpLine) {
            gsap.to(lcpLine, {
              opacity: 0, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "25% top", end: "65% top", scrub: 1.2 },
            });
          }
        }
      });

      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(fadeEls, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.35, ease: "power3.out",
          immediateRender: false,
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (heroSplit && heroLineEl?.isConnected) { try { heroSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="contact-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{ top: "-15%", height: "130%" }}
        role="presentation"
        aria-hidden="true"
      >
        <Image
          src="/images/contact/contact-hero.jpg"
          alt=""
          fill
          priority
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "contrast(1.08) saturate(0.9) brightness(0.92)",
          }}
        />
      </div>
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase mb-6 block">
          Get in Touch
        </span>
        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
          style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
        >
          <span className="ctct-lcp-line block">Let&apos;s Talk About</span>
          <span className="block overflow-hidden">
            <span className="ctct-hero-line hero-line-animate block" style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.1s" }}>
              Your Project.
            </span>
          </span>
        </h1>
        <p
          className="hero-fade text-gray-300 max-w-lg leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          The estimate is free. Whether you know exactly what you need or
          you&apos;re still figuring it out — start the conversation.
        </p>
      </div>
    </section>
  );
}

// ─── Section: City horizontal strip ──────────────────────────────────────────
// Technique 7: Horizontal-on-vertical scroll

function ContactStrip() {
  const cities = SITE.serviceArea;

  return (
    <div
      className="bg-black border-t border-b border-white/5 overflow-hidden py-3"
      style={{ position: "relative", zIndex: 2 }}
      aria-hidden="true"
    >
      <div
        className="flex gap-10 items-center"
        style={{ animation: "marqueeScroll 35s linear infinite", width: "max-content" }}
      >
        {[...cities, ...cities].map((city, i) => (
          <span key={i} className="font-labels text-[9px] text-gray-500 tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-10">
            {city}
            <span className="w-1 h-1 bg-[#B87333]/50 rounded-full inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Pinned trust stats ──────────────────────────────────────────────
// Technique 5: Pinned moment + Technique 9: Counter count-up

function PinnedTrust() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLSpanElement>(null);
  const citiesRef = useRef<HTMLSpanElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const pinCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (pinCtxRef.current) { try { pinCtxRef.current.revert(); } catch {} } }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Set GSAP initial state here (Fix 14) — before shouldAnimate() gate so the
    // mobile/error branch can explicitly clear it. imageWrapRef is hidden lg:block
    // (display:none < 1024px) but set defensively.
    if (imageWrapRef.current) {
      gsap.set(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
    }

    if (!AnimationController.shouldAnimate()) {
      // Mobile: clear initial state so element is visible if breakpoint changes.
      if (imageWrapRef.current) gsap.set(imageWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    const ctx = gsap.context(() => {
      // ── Technique 10: Copper hairline scaleX scrub ──────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Fix 10: once:true — counters fire on enter, never reverse
      if (yearsRef.current) {
        const el = yearsRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 20, duration: 2, ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val) + "+"; },
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", once: true },
        });
      }
      if (citiesRef.current) {
        const el = citiesRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 2004, duration: 2.5, ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", once: true },
        });
      }

      // ── Technique 3: Scrubbed clip-path on image ─────────────────────────
      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 90%", end: "top 30%", scrub: 1.2 },
        });
        // ── Technique 4: Scale-through-scroll ─────────────────────────────
        const imgEl = imageWrapRef.current.querySelector("img");
        if (imgEl) {
          gsap.fromTo(imgEl, { scale: 1.1 }, {
            scale: 1.0, ease: "none",
            scrollTrigger: { trigger: wrapperRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
      }

      // Fade text elements
      const textEls = stickyRef.current?.querySelectorAll<HTMLElement>(".trust-el");
      if (textEls?.length) {
        gsap.fromTo(textEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 75%", once: true },
        });
      }

      // ── Technique 5: Pin the stats while counters run ───────────────────
      const isMobile = window.innerWidth < 1024;
      if (!isMobile) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            pin: stickyRef.current,
            start: "top top",
            end: "+=" + window.innerHeight * 1.4,
            scrub: 0.8,
            pinSpacing: false,
          },
        });
        tl.to({}, { duration: 1 });
      }
    }, wrapperRef);
    pinCtxRef.current = ctx;

    return () => { pinCtxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <div ref={wrapperRef} data-section="contact-trust" style={{ minHeight: isMobile ? "auto" : "240vh", position: "relative", zIndex: 2 }}>
      <div ref={stickyRef} className="bg-[#0a0a0a]" style={{ minHeight: "100vh", overflowX: "clip" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          {/* Copper hairline scrub */}
          <div
            ref={hairlineRef}
            style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "4rem" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: copy + counters */}
            <div className="lg:col-span-5">
              <span className="trust-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
                About 828 Construction
              </span>
              <h2
                className="trust-el font-display font-bold text-white tracking-tight leading-[0.9] mb-8"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                Built on{" "}
                <span style={{ color: "rgba(255,255,255,0.38)" }}>20 years</span>
                {" "}of South Bay work.
              </h2>
              <p className="trust-el text-gray-400 leading-relaxed max-w-sm mb-12">
                Joe P has been diagnosing and solving construction problems in the South Bay
                since 2004. Licensed, experienced, and personally involved in every project.
              </p>

              {/* Scrub counters */}
              <div className="trust-el border-t border-white/5 divide-y divide-white/5">
                <div className="py-6 flex items-baseline gap-5">
                  <div className="font-numbers font-bold text-white leading-none" style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}>
                    <span ref={yearsRef}>20+</span>
                  </div>
                  <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase">
                    Years of Field Experience
                  </div>
                </div>
                <div className="py-6 flex items-baseline gap-5">
                  <div className="font-numbers font-bold text-white leading-none" style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}>
                    <span ref={citiesRef}>2004</span>
                  </div>
                  <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase">
                    Est. · Torrance, CA
                  </div>
                </div>
                <div className="py-6 flex items-center gap-4">
                  <div className="w-1 h-8 bg-[#B87333] flex-shrink-0" />
                  <div>
                    <div className="font-numbers font-bold text-white text-xl leading-none">
                      #{SITE.license}
                    </div>
                    <div className="font-labels text-[9px] text-gray-400 tracking-[0.15em] uppercase mt-1">
                      CA General Contractor License
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: scrub clip-path image */}
            <div className="lg:col-span-7 hidden lg:block">
              <div
                ref={imageWrapRef}
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src="/images/contact/map-detail.jpg"
                  alt="828 Construction — South Bay service area"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(0.85)" }}
                  sizes="(max-width: 1280px) 60vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="font-labels text-[9px] text-gray-300 tracking-[0.18em] uppercase">
                    South Bay, CA · Service Area
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Main contact layout ─────────────────────────────────────────────

function ContactMain() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let ctaSplit: SplitType | null = null;
    const ctaEl = headlineRef.current;
    const ctx = gsap.context(() => {
      // ── Technique 10: Copper hairline scaleX scrub ──────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // ── Technique 2: SplitType char reveal scrub ─────────────────────────
      if (ctaEl) {
        const _el = ctaEl;
        const _trigger = sectionRef.current;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
          ctaSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(split.chars,
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0, opacity: 1,
                stagger: { each: 0.02, from: "start" }, ease: "none",
                scrollTrigger: { trigger: _trigger, start: "top 75%", end: "top 30%", scrub: 1.2 },
              }
            );
          }
        });
      }

      // Left column stagger
      const leftEls = leftRef.current?.querySelectorAll<HTMLElement>(".left-el");
      if (leftEls?.length) {
        gsap.fromTo(leftEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power2.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 78%", once: true },
        });
      }

      // Right column fade
      const rightEls = rightRef.current?.querySelectorAll<HTMLElement>(".right-el");
      if (rightEls?.length) {
        gsap.fromTo(rightEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, delay: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: rightRef.current, start: "top 78%", once: true },
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (ctaSplit && ctaEl?.isConnected) { try { ctaSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="contact-main" className="bg-white py-16 lg:py-24" style={{ position: "relative", zIndex: 3 }}>
      {/* Copper hairline at top */}
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-12"
        style={{ height: 1, background: "#B87333", opacity: 0.4, transformOrigin: "left" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-black tracking-tight leading-[0.9] mb-16"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
        >
          Send a message.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Left: Info + trust ─────────────────────────────────────── */}
          <div ref={leftRef}>

            {/* Phone */}
            <div className="left-el mb-12">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-3">
                Fastest Response
              </div>
              {/* ── Technique 8: MagneticButton ───────────────────────── */}
              <MagneticButton strength={0.2}>
                <a href={SITE.phoneHref} className="inline-flex items-center gap-3 group">
                  <span className="font-numbers font-bold text-black text-3xl tracking-tight group-hover:text-[#B87333] transition-colors">
                    {SITE.phone}
                  </span>
                  <span className="font-labels text-[9px] text-gray-500 tracking-[0.15em] uppercase border border-gray-200 px-2 py-1">
                    Call or Text
                  </span>
                </a>
              </MagneticButton>
              <p className="text-sm text-gray-600 mt-2">For urgent inquiries, call directly. Joe answers.</p>
            </div>

            {/* Email + Address */}
            <div className="left-el space-y-8 mb-12">
              <div className="border-t border-gray-100 pt-8">
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Email
                </div>
                <a href={`mailto:${SITE.email}`} className="text-black hover:text-gray-600 transition-colors font-display font-bold">
                  {SITE.email}
                </a>
                <p className="text-sm text-gray-600 mt-1">Response within 24 hours.</p>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Office
                </div>
                <address className="not-italic text-black text-sm leading-relaxed">
                  {SITE.address.street}<br />
                  {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                </address>
              </div>
            </div>

            {/* What to include */}
            <div className="left-el bg-gray-50 p-8 mb-8">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">
                What to Include in Your Message
              </div>
              <ul className="space-y-2.5">
                {includeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-px h-3.5 bg-gray-400 flex-shrink-0 mt-[3px]" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next steps */}
            <div className="left-el mb-8">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-5">
                What Happens After You Send a Message
              </div>
              <div className="space-y-4">
                {nextSteps.map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="font-numbers text-[#B87333] font-bold text-2xl leading-none flex-shrink-0 w-8" aria-hidden="true">
                      {item.step}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service area */}
            <div className="left-el border-t border-gray-100 pt-8">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">
                Service Area
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {SITE.serviceArea.map((city) => (
                  <span key={city} className="font-labels text-[9px] text-gray-600 border border-gray-200 px-3 py-1 tracking-[0.1em]">
                    {city}
                  </span>
                ))}
              </div>

              <div className="inline-flex items-center gap-4 border border-gray-200 px-5 py-3">
                <div>
                  <div className="font-labels text-[8px] text-gray-500 tracking-[0.2em] uppercase mb-0.5">CA License</div>
                  <div className="font-numbers font-bold text-black text-sm">#{SITE.license}</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <div className="font-labels text-[8px] text-gray-500 tracking-[0.2em] uppercase mb-0.5">Founder</div>
                  <div className="font-display font-bold text-black text-sm">Joe P</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────────────────────────── */}
          <div ref={rightRef}>
            <div className="right-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase mb-8">
              Send a Message
            </div>
            <div className="right-el">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Section overlap — Technique 6 ──────────────────────────────────
// ContactMain rides over PinnedTrust via zIndex: 3 with marginTop negative

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ContactContent() {
  return (
    <>
      <ContactHero />
      <ContactStrip />
      <PinnedTrust />
      {/* Section overlap: ContactMain (zIndex 3) slides over PinnedTrust */}
      <div style={{ marginTop: "-5vh", position: "relative", zIndex: 3 }}>
        <ContactMain />
      </div>
    </>
  );
}
