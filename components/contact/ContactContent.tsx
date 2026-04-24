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

const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`;
const cslbUrl = `https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=${SITE.license}`;

// ─── Section: Hero ────────────────────────────────────────────────────────────

function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(
    () => () => {
      if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
      try { ctxRef.current?.revert(); } catch {}
    },
    []
  );

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;

    let mounted = true;
    let splitFrame = -1;
    let heroLineEl: HTMLElement | null = null;
    let heroSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      // Triple-layer parallax (Pattern F + I)
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

      // SplitType char scatter exit (Fix 1: 4-guard cleanup)
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".ctct-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "words,chars" });
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

      // Hero meta + phone fade in — anchored to viewport entry via scrollTrigger
      // rather than a bare delay() so the reveal fires reliably on navigation too.
      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(fadeEls, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: sectionRef.current, start: "top 95%", once: true },
        });
      }
    }, sectionRef);

    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (heroSplit && heroLineEl?.isConnected) { try { heroSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="contact-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Background image with parallax travel room */}
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
          fetchPriority="high"
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "contrast(1.08) saturate(0.9) brightness(0.92)",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.88) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase mb-6 block" data-gsap-reveal="true">
          Get in Touch
        </span>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
          style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
        >
          <span className="ctct-lcp-line block">Let&apos;s Talk About</span>
          <span className="block overflow-hidden">
            <span
              className="ctct-hero-line hero-line-animate block"
              style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.1s" }}
            >
              Your Project.
            </span>
          </span>
        </h1>

        {/* Subline + phone CTA row — phone visible in hero for "is this real?" users */}
        <div className="hero-fade flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10" data-gsap-reveal="true">
          <p
            className="text-gray-300 max-w-md leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}
          >
            The estimate is free. Whether you know exactly what you need or
            you&apos;re still figuring it out — start the conversation.
          </p>
          <a
            href={SITE.phoneHref}
            className="flex-shrink-0 inline-flex items-center gap-3 group"
            style={{ minHeight: 48 }}
            aria-label={`Call 828 Construction at ${SITE.phone}`}
          >
            <span
              className="font-numbers font-bold text-white tracking-tight group-hover:text-[#B87333] transition-colors duration-200"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
            >
              {SITE.phone}
            </span>
            <span className="font-labels text-[8px] text-gray-400 tracking-[0.18em] uppercase border border-white/20 px-2 py-1">
              Call Now
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Section: City horizontal strip ──────────────────────────────────────────

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
          <span
            key={i}
            className="font-labels text-[9px] text-gray-500 tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-10"
          >
            {city}
            <span className="w-1 h-1 bg-[#B87333]/50 rounded-full inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Main contact layout (form first, reachable after one scroll) ────

function ContactMain() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(
    () => () => {
      if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
      try { ctxRef.current?.revert(); } catch {}
    },
    []
  );

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;

    let mounted = true;
    let splitFrame = -1;
    let ctaSplit: SplitType | null = null;
    const ctaEl = headlineRef.current;

    const ctx = gsap.context(() => {
      // Copper hairline scaleX scrub (Pattern D)
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // SplitType char reveal scrub on headline (Fix 1)
      if (ctaEl) {
        const _el = ctaEl;
        const _trigger = sectionRef.current;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "words,chars" });
          ctaSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(
              split.chars,
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

      // Left column stagger reveal (Pattern A)
      const leftEls = leftRef.current?.querySelectorAll<HTMLElement>(".left-el");
      if (leftEls?.length) {
        gsap.fromTo(leftEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power2.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 78%", once: true },
        });
      }

      // Right column (form) fade reveal
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
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="contact-main"
      className="bg-white py-20 lg:py-32"
      style={{ position: "relative", zIndex: 3 }}
    >
      {/* Copper hairline */}
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 lg:mb-16"
        style={{ height: 1, background: "#B87333", opacity: 0.4, transformOrigin: "left" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Left: Contact info + friction reducers ────────────────────── */}
          <div ref={leftRef}>
            <span className="left-el font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
              Contact
            </span>
            <h2
              ref={headlineRef}
              className="left-el font-display font-bold text-black tracking-tight leading-[0.9] mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Start the conversation.
            </h2>

            {/* Phone — primary CTA, tap-to-call on mobile (min 48px touch target) */}
            <div className="left-el mb-10">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-3">
                Call or Text
              </div>
              <MagneticButton strength={0.2}>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-3 group"
                  style={{ minHeight: 48 }}
                  aria-label={`Call 828 Construction at ${SITE.phone}`}
                >
                  <span
                    className="font-numbers font-bold text-black leading-none group-hover:text-[#B87333] transition-colors duration-200"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}
                  >
                    {SITE.phone}
                  </span>
                </a>
              </MagneticButton>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Joe answers personally. For urgent work, call directly.
              </p>
            </div>

            {/* Email + Address */}
            <div className="left-el space-y-0 mb-10">
              <div className="border-t border-gray-100 py-7">
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Email
                </div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-display font-bold text-black hover:text-[#B87333] transition-colors text-lg leading-tight flex items-center"
                  style={{ minHeight: 48 }}
                >
                  {SITE.email}
                </a>
                <p className="text-sm text-gray-500 mt-1.5">
                  We respond to every inquiry personally, within 24 hours.
                </p>
              </div>

              <div className="border-t border-gray-100 py-7">
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Office
                </div>
                {/* Address as tap-to-maps link (mobile requirement) */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  style={{ minHeight: 48 }}
                  aria-label={`Open ${SITE.address.full} in Google Maps`}
                >
                  <address className="not-italic text-black text-sm leading-relaxed group-hover:text-[#B87333] transition-colors">
                    {SITE.address.street}<br />
                    {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                  </address>
                  <span className="font-labels text-[8px] text-gray-400 tracking-[0.15em] uppercase mt-1.5 block group-hover:text-[#B87333] transition-colors">
                    Open in Maps →
                  </span>
                </a>
              </div>
            </div>

            {/* What to include — friction reducer */}
            <div className="left-el border border-gray-100 p-6 mb-8">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase mb-4">
                What to Include in Your Message
              </div>
              <ul className="space-y-2.5">
                {includeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="w-px h-3.5 flex-shrink-0 mt-[3px]"
                      style={{ background: "#B87333", opacity: 0.6 }}
                    />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What happens after — process transparency */}
            <div className="left-el">
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase mb-5">
                What Happens After You Send a Message
              </div>
              <div className="relative">
                {/* Vertical connector — gradient fades bottom */}
                <div
                  className="absolute left-4 top-6"
                  style={{
                    width: 1,
                    bottom: "1.5rem",
                    background: "linear-gradient(to bottom, rgba(184,115,51,0.55), rgba(184,115,51,0.06))",
                  }}
                  aria-hidden="true"
                />
                <div className="space-y-5">
                  {nextSteps.map((item) => (
                    <div key={item.step} className="flex items-start gap-4 relative">
                      <span
                        className="font-numbers font-bold leading-none flex-shrink-0 w-8 bg-white relative z-10"
                        style={{ color: "#B87333", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", paddingRight: "0.2rem" }}
                        aria-hidden="true"
                      >
                        {item.step}
                      </span>
                      <p className="text-gray-600 text-sm leading-relaxed pt-0.5">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────────────────────────────── */}
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

// ─── Section: Trust signals (dark, 2025 counter — page signature) ─────────────
// This section answers "are you real?" for visitors who scrolled past the form.
// Signature: 2025 scrub counter — the only place on the site this date appears
// as a count-up. Defined in design/PATTERNS.md Per-Page Signatures.

function ContactTrust() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const yearsRef = useRef<HTMLSpanElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Fix 14: set initial state before shouldAnimate gate so mobile can clear it
    if (imageWrapRef.current) {
      gsap.set(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
    }

    if (!AnimationController.shouldAnimate()) {
      // Mobile: immediately clear — image visible, simple page rendering
      if (imageWrapRef.current) gsap.set(imageWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    const ctx = gsap.context(() => {
      // Copper hairline scaleX scrub (Pattern D)
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Signature: 2025 establishment year counter (Fix 10: once:true, never reverses)
      if (yearRef.current) {
        const el = yearRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 2025, duration: 2.5, ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
          scrollTrigger: { trigger: wrapperRef.current, start: "top 72%", once: true },
        });
      }

      // Years experience counter (Fix 10: once:true)
      if (yearsRef.current) {
        const el = yearsRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 25, duration: 2, ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val) + "+"; },
          scrollTrigger: { trigger: wrapperRef.current, start: "top 72%", once: true },
        });
      }

      // Image clip-path reveal scrub (Pattern 3: inset wipe)
      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 90%", end: "top 20%", scrub: 1.2 },
        });
        // Scale-through-scroll (Pattern 4)
        const imgEl = imageWrapRef.current.querySelector("img");
        if (imgEl) {
          gsap.fromTo(imgEl, { scale: 1.1 }, {
            scale: 1.0, ease: "none",
            scrollTrigger: { trigger: wrapperRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
      }

      // Text stagger reveal (Pattern A)
      const textEls = wrapperRef.current?.querySelectorAll<HTMLElement>(".trust-el");
      if (textEls?.length) {
        gsap.fromTo(textEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 75%", once: true },
        });
      }
    }, wrapperRef);

    ctxRef.current = ctx;

    return () => {
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-section="contact-trust"
      className="bg-[#0a0a0a]"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Copper hairline */}
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "4rem" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: copy + counters + license */}
          <div className="lg:col-span-6">
            <span className="trust-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
              About 828 Construction
            </span>
            <h2
              className="trust-el font-display font-bold text-white tracking-tight leading-[0.9] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              South Bay roots.{" "}
              <span style={{ color: "rgba(255,255,255,0.38)" }}>25 years in.</span>
            </h2>
            <p className="trust-el text-gray-400 leading-relaxed max-w-md mb-12">
              Joe P has been diagnosing and solving construction problems across the South Bay
              since 2025. Licensed general contractor, personally involved in every project —
              not a call center, not a franchise.
            </p>

            {/* Stats grid — 2025 counter (signature) + 25+ years */}
            <div className="trust-el grid grid-cols-2 gap-0 border border-white/10 mb-8">
              <div className="p-6 border-r border-white/10">
                <div
                  className="font-numbers font-bold text-white leading-none mb-2"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  <span ref={yearsRef}>25+</span>
                </div>
                <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase">
                  Years Experience
                </div>
              </div>
              <div className="p-6">
                <div
                  className="font-numbers font-bold text-white leading-none mb-2"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  {/* Signature: 2025 scrub counter — only place on site */}
                  <span ref={yearRef}>2025</span>
                </div>
                <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase">
                  Est. · Torrance, CA
                </div>
              </div>
            </div>

            {/* License badge — with CSLB verification link */}
            <div className="trust-el">
              <a
                href={cslbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 border border-[#B87333]/40 px-5 hover:border-[#B87333] transition-colors group"
                style={{ minHeight: 48, display: "inline-flex" }}
                aria-label="Verify CA General Contractor License on CSLB"
              >
                <div>
                  <div className="font-labels text-[8px] text-gray-500 tracking-[0.2em] uppercase mb-0.5 group-hover:text-[#B87333] transition-colors">
                    CA General Contractor License
                  </div>
                  <div className="font-numbers font-bold text-white text-sm">
                    #{SITE.license}
                  </div>
                </div>
                <span className="font-labels text-[8px] text-gray-500 tracking-[0.15em] uppercase group-hover:text-[#B87333] transition-colors">
                  Verify →
                </span>
              </a>
            </div>
          </div>

          {/* Right: image + service area */}
          <div className="lg:col-span-6">
            {/* Scrub clip-path reveal image (Fix 14: initial state set in useEffect, not JSX) */}
            <div
              ref={imageWrapRef}
              className="relative overflow-hidden mb-8"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src="/images/contact/map-detail.jpg"
                alt="828 Construction — South Bay service area"
                fill
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(0.85)" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, rgba(10,10,10,0.35), transparent)" }}
              />
              <div className="absolute bottom-5 left-5">
                <span className="font-labels text-[9px] text-gray-300 tracking-[0.18em] uppercase">
                  South Bay, CA · Service Area
                </span>
              </div>
            </div>

            {/* Service area tags */}
            <div className="trust-el">
              <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase mb-4">
                Service Area
              </div>
              <div className="flex flex-wrap gap-2">
                {SITE.serviceArea.map((city) => (
                  <span
                    key={city}
                    className="font-labels text-[9px] text-gray-500 border border-white/10 px-3 py-1.5 tracking-[0.1em]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ContactContent() {
  return (
    <>
      <ContactHero />
      <ContactStrip />
      {/* ContactMain at zIndex:3 — form reachable after hero, no heavy pin in the way */}
      <ContactMain />
      {/* ContactTrust below form — answers "are you real?" for second-guessers */}
      <ContactTrust />
    </>
  );
}
