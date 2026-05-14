"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE, SERVICES } from "@/lib/constants";
import PrecisionOverlay from "@/components/shared/PrecisionOverlay";

export default function Footer() {
  const [callOpen, setCallOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black text-white" data-section="footer">
      <PrecisionOverlay tone="dark" opacity={0.08} className="hidden lg:block" />

      <div className="relative z-10 border-y border-white/10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-6 py-16 lg:px-12 lg:py-24">
            <p className="mb-5 font-labels text-[10px] uppercase tracking-[0.24em] text-white/36">
              One conversation begins the build
            </p>
            <h2 className="max-w-4xl font-display text-[clamp(3rem,7vw,7.5rem)] font-bold leading-[0.88] tracking-tight">
              Build your vision.
            </h2>
          </div>

          <div className="flex flex-col justify-end border-t border-white/10 px-6 py-10 lg:border-l lg:border-t-0 lg:px-12">
            <div className="relative w-fit">
              <button
                onClick={() => setCallOpen(!callOpen)}
                aria-expanded={callOpen}
                className="group relative inline-flex min-h-12 items-center gap-3 bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:text-white"
              >
                <span
                  className="absolute inset-0 translate-x-[-101%] transition-transform duration-300 group-hover:translate-x-0"
                  style={{ background: "var(--color-accent)" }}
                  aria-hidden="true"
                />
                <span className="relative">Book call</span>
                <span
                  className="relative inline-block transition-transform duration-300"
                  style={{ transform: callOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {callOpen && (
                <div
                  className="absolute left-0 top-full z-20 mt-2 border border-white/10 bg-black px-5 py-4"
                  style={{ borderTop: "1px solid var(--color-accent)", animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
                >
                  <a href={SITE.phoneHref} className="font-numbers text-lg tracking-wide text-white hover:text-white/70">
                    {SITE.phone}
                  </a>
                  <p className="mt-1 whitespace-nowrap font-labels text-[9px] uppercase tracking-[0.18em] text-white/30">
                    Mon-Fri / 7am-6pm PT
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="mt-5 inline-flex w-fit items-center gap-2 border-b border-white/15 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-white/48 transition-colors hover:border-white hover:text-white"
            >
              Get in touch
              <span aria-hidden="true">+</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid border-b border-white/10 lg:grid-cols-3">
        <Link href="/contact" className="group min-h-[18rem] border-b border-white/10 p-7 transition-colors hover:bg-white/[0.035] lg:border-b-0 lg:border-r lg:p-10">
          <span className="font-numbers text-4xl font-bold text-[var(--color-accent)]">01</span>
          <div className="mt-16">
            <p className="mb-3 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35">Schedule consultation</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/58">
              Start with active listening, scope clarity, and the right next step.
            </p>
          </div>
        </Link>

        <Link href="/services" className="group min-h-[18rem] border-b border-white/10 p-7 transition-colors hover:bg-white/[0.035] lg:border-b-0 lg:border-r lg:p-10">
          <span className="font-numbers text-4xl font-bold text-[var(--color-accent)]">02</span>
          <div className="mt-16">
            <p className="mb-3 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35">Services</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/58">
              ADU construction, remediation, and consulting. Three disciplines, one standard.
            </p>
          </div>
        </Link>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group min-h-[18rem] p-7 transition-colors hover:bg-white/[0.035] lg:p-10"
        >
          <span className="font-numbers text-4xl font-bold text-[var(--color-accent)]">03</span>
          <div className="mt-16">
            <p className="mb-3 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35">Serving South Bay</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/58">
              Torrance-based, South Bay focused, and available for the right projects beyond the area.
            </p>
          </div>
        </a>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_1fr_2fr] lg:px-12">
        <div>
          <p className="mb-5 font-labels text-[9px] uppercase tracking-[0.28em] text-white/30">Contact</p>
          <a href={`mailto:${SITE.email}`} className="block break-all text-sm text-white/64 transition-colors hover:text-white">
            {SITE.email}
          </a>
          <a href={SITE.phoneHref} className="mt-3 block font-numbers text-xl text-white transition-colors hover:text-white/70">
            {SITE.phone}
          </a>
        </div>

        <div>
          <p className="mb-5 font-labels text-[9px] uppercase tracking-[0.28em] text-white/30">Navigate</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-1">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/services", label: "Services" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="font-labels text-[10px] uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-5 font-labels text-[9px] uppercase tracking-[0.28em] text-white/30">Services / Area</p>
          <div className="mb-5 flex flex-wrap gap-3">
            {SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="font-labels text-[10px] uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-white">
                {service.title}
              </Link>
            ))}
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-white/38">
            {SITE.serviceArea.join(" / ")}
          </p>
          <p className="mt-5 font-labels text-[9px] uppercase tracking-[0.18em] text-white/24">
            CA License #{SITE.license} / Est. 2004
          </p>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 px-6 py-5 lg:px-12">
        <p className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/25">
          (c) {year} 828 Construction. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
