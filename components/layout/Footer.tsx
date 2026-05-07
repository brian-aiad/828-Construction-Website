"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { SITE, SERVICES } from "@/lib/constants";

// ─── Footer V2 ──────────────────────────────────────────────────────────────
// Structure:
//   1. Rolling marquee (top)
//   2. Schedule consultation CTA block
//   3. Broken-color info blocks (email, phone, address+license)
//   4. Nav columns + service area
//   5. 828 wordmark anchor (bottom, decorative)
//   6. Copyright strip

const MARQUEE_TEXT = [
  "BUILT WITH INTENT",
  "828 CONSTRUCTION",
  "SOUTH BAY NATIVE",
  `CA LICENSE #${SITE.license}`,
  "EST. 2004",
  "BUILT TO LAST",
  "TORRANCE, CA",
  "BUILDING SCIENCE",
];

export default function Footer() {
  const [callOpen, setCallOpen] = useState(false);
  const year = new Date().getFullYear();
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(anchor, "x", { duration: 1.2, ease: "expo.out" });
    const yTo = gsap.quickTo(anchor, "y", { duration: 1.2, ease: "expo.out" });

    const footer = anchor.closest("footer");
    if (!footer) return;

    const onMove = (e: MouseEvent) => {
      const rect = anchor.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * 0.03);
      yTo((e.clientY - (rect.top + rect.height / 2)) * 0.02);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    footer.addEventListener("mousemove", onMove);
    footer.addEventListener("mouseleave", onLeave);

    return () => {
      footer.removeEventListener("mousemove", onMove);
      footer.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <footer className="bg-black text-white" data-section="footer">

      {/* ── 1. Rolling marquee — two layers (v3: large bg + foreground size contrast) ── */}
      <div
        className="overflow-hidden py-3 border-t border-white/[0.06] relative"
        aria-hidden="true"
      >
        {/* Background layer — 2.2rem font, slow (70s), reversed, 0.18 opacity — visual depth */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ overflow: "hidden" }}
        >
          <div
            style={{ display: "flex", width: "max-content", animation: "marqueeScroll 70s linear infinite reverse", opacity: 0.18 }}
          >
            {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((item, i) => (
              <span
                key={i}
                className="font-labels text-white tracking-[0.22em] uppercase whitespace-nowrap px-10"
                style={{ fontSize: "2.2rem" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Foreground layer — 9px (original), 38s, full opacity, pause-on-hover */}
        <div
          className="relative flex items-center gap-10"
          style={{ width: "max-content", animation: "marqueeScroll 38s linear infinite" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
          }}
        >
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-labels text-[9px] text-white/25 tracking-[0.28em] uppercase whitespace-nowrap"
            >
              {item}
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)", opacity: 0.5 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── 2. Schedule consultation CTA block ──────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-end">
          <div className="lg:col-span-7 mb-10 lg:mb-0">
            <span className="font-labels text-[10px] text-white/40 tracking-[0.22em] uppercase block mb-5">
              Let&apos;s talk about your project
            </span>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-0"
              style={{ fontSize: "clamp(2.4rem, 5vw, 5rem)" }}
            >
              Start the conversation.
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            {/* BOOK CALL asterisk dropdown */}
            <div className="relative">
              <button
                onClick={() => setCallOpen(!callOpen)}
                aria-expanded={callOpen}
                className="group relative inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
              >
                <span
                  className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                  style={{ background: "var(--color-accent)" }}
                  aria-hidden="true"
                />
                <span className="relative">Book Call</span>
                <span
                  className="relative"
                  style={{
                    display: "inline-block",
                    transition: "transform 0.3s ease",
                    transform: callOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {callOpen && (
                <div
                  className="absolute top-full left-0 mt-2 bg-black border border-white/10 px-5 py-4 whitespace-nowrap"
                  style={{
                    overflow: "hidden",
                    animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both",
                    zIndex: 20,
                    borderTop: "1px solid var(--color-accent)",
                  }}
                >
                  <a
                    href={SITE.phoneHref}
                    className="font-numbers text-white text-xl tracking-wide hover:text-gray-300 transition-colors block"
                  >
                    {SITE.phone}
                  </a>
                  <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-1 block">
                    Mon – Fri · 7am – 6pm PT
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 font-labels text-[10px] text-white/50 tracking-[0.18em] uppercase border-b border-white/15 hover:text-white hover:border-white pb-0.5 transition-colors duration-200"
            >
              Get in touch
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. Broken-color info blocks ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Email block — black, large email focal point */}
        <div
          className="px-8 lg:px-10 py-12 lg:py-16"
          style={{ background: "#000000", borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase block mb-5">
            Email
          </span>
          <a
            href={`mailto:${SITE.email}`}
            className="font-numbers text-white transition-colors duration-200 hover:text-gray-300 break-all block"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", lineHeight: 1.5 }}
          >
            {SITE.email}
          </a>
        </div>

        {/* Phone block — near-black, large phone focal point */}
        <div
          className="px-8 lg:px-10 py-12 lg:py-16"
          style={{ background: "#0A0A0A", borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase block mb-5">
            Phone
          </span>
          <a
            href={SITE.phoneHref}
            className="font-numbers text-white transition-colors duration-200 hover:text-gray-300 block"
            style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)", letterSpacing: "-0.01em" }}
          >
            {SITE.phone}
          </a>
          <span className="font-labels text-[9px] text-white/30 tracking-[0.15em] uppercase mt-2 block">
            Torrance, CA
          </span>
        </div>

        {/* Address + License block */}
        <div
          className="px-8 lg:px-10 py-12 lg:py-16"
          style={{ background: "#0D0D0D" }}
        >
          <span className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase block mb-5">
            Address
          </span>
          <address className="not-italic text-white/65 text-sm leading-relaxed mb-6">
            {SITE.address.street}<br />
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </address>

          {/* License badge with maroon border + glow on hover */}
          <div
            className="license-badge inline-flex items-center gap-3 px-3 py-2"
            style={{ border: "1px solid var(--color-accent)", borderLeftWidth: 3 }}
          >
            <span className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase">
              CA License
            </span>
            <span className="font-numbers text-[11px] text-white/80 tracking-[0.08em]">
              #{SITE.license}
            </span>
          </div>

          {/* EST. 2004 */}
          <div className="mt-4">
            <span className="font-labels text-[9px] text-white/25 tracking-[0.22em] uppercase">
              Est. 2004
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Nav columns + service area ────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Navigate */}
          <div>
            <h3 className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase mb-6">Navigate</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-labels text-[10px] text-white/50 tracking-[0.12em] uppercase hover:text-white transition-colors duration-200 inline-flex items-center min-h-[28px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase mb-6">Services</h3>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-labels text-[10px] text-white/50 tracking-[0.12em] uppercase hover:text-white transition-colors duration-200 inline-flex items-center min-h-[28px]"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area */}
          <div className="col-span-2 lg:col-span-2">
            <h3 className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase mb-6">Service Area</h3>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {SITE.serviceArea.map((city, i) => (
                <span
                  key={city}
                  className="font-labels text-[10px] text-white/40 tracking-[0.1em] uppercase"
                >
                  {city}{i < SITE.serviceArea.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. 828 wordmark anchor — decorative, large, magnetic ─────────── */}
      <div
        className="relative overflow-hidden px-6 py-10 lg:px-12 lg:py-14"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        aria-hidden="true"
      >
        <div
          ref={anchorRef}
          className="relative mx-auto h-20 max-w-7xl select-none pointer-events-none sm:h-28 lg:h-36"
          style={{
            opacity: 0.075,
            willChange: "transform",
          }}
        >
          <Image
            src="/images/logo/828logo_new_full.png"
            alt=""
            fill
            sizes="100vw"
            className="object-contain object-left"
          />
        </div>
      </div>

      {/* ── 6. Copyright strip ────────────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="font-labels text-[9px] text-white/30 tracking-[0.18em] uppercase leading-relaxed">
          © {year} 828 Construction. All rights reserved.
        </p>
        <p className="font-labels text-[9px] text-white/20 tracking-[0.18em] uppercase">
          Torrance · South Bay · LA County
        </p>
      </div>

    </footer>
  );
}
