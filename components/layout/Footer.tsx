"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SERVICE_AREAS, SITE, SERVICES } from "@/lib/constants";
import SocialIcons from "@/components/footer/SocialIcons";
import PrecisionOverlay from "@/components/shared/PrecisionOverlay";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

const FOOTER_AREAS = SITE.serviceArea.filter((area) => SERVICE_AREAS.includes(area));

const eyebrowClass =
  "font-labels text-[11px] uppercase tracking-[0.2em] text-white/50";
const bodyClass = "text-[13px] leading-relaxed text-white/60";
const linkClass =
  "group/link relative w-fit text-[15px] leading-relaxed text-white/80 transition-colors duration-300 hover:text-white";
const underlineClass =
  "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover/link:scale-x-100";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function Footer() {
  const [callOpen, setCallOpen] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();
  const formattedPhone = formatPhone(SITE.phone);
  const streetLine = SITE.address.street.replace(" STE", ", STE");

  useEffect(() => {
    const footer = footerRef.current;
    const watermark = watermarkRef.current;
    if (!footer || !watermark) return;

    const handleMove = (event: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 3;
      watermark.style.setProperty("--footer-wm-x", `${x.toFixed(2)}%`);
      watermark.style.setProperty("--footer-wm-y", `${y.toFixed(2)}%`);
    };

    const handleLeave = () => {
      watermark.style.setProperty("--footer-wm-x", "0%");
      watermark.style.setProperty("--footer-wm-y", "0%");
    };

    footer.addEventListener("mousemove", handleMove);
    footer.addEventListener("mouseleave", handleLeave);

    return () => {
      footer.removeEventListener("mousemove", handleMove);
      footer.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#050505] text-white"
      data-section="footer"
    >
      <PrecisionOverlay tone="dark" opacity={0.08} className="hidden lg:block" />
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-0.22em] left-1/2 z-0 whitespace-nowrap font-display text-[clamp(5rem,16vw,14rem)] font-bold uppercase leading-none text-white/[0.025] transition-transform duration-500 ease-out"
        style={{
          transform:
            "translate(calc(-50% + var(--footer-wm-x, 0%)), var(--footer-wm-y, 0%))",
        }}
      >
        828 Construction
      </div>

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
                  style={{
                    borderTop: "1px solid var(--color-accent)",
                    animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  <a
                    href={SITE.phoneHref}
                    className="font-numbers text-lg tracking-wide text-white hover:text-white/70"
                  >
                    {formattedPhone}
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

      <div className="relative z-10 mx-auto grid max-w-7xl gap-y-10 px-6 py-16 md:grid-cols-2 md:gap-x-14 lg:grid-cols-[1.35fr_0.8fr_1.05fr_0.65fr] lg:gap-x-20 lg:px-12 lg:pb-24 lg:pt-[120px]">
        <div className="border-b border-white/10 pb-10 md:border-b-0 md:pb-0">
          <p className={eyebrowClass}>Contact</p>
          <div className="mt-7 space-y-4">
            <a href={`mailto:${SITE.email}`} className={`${linkClass} break-all`}>
              {SITE.email}
              <span className={underlineClass} />
            </a>
            <a href={SITE.phoneHref} className={`${linkClass} block font-numbers`}>
              {formattedPhone}
              <span className={underlineClass} />
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${bodyClass} block max-w-[18rem] transition-colors duration-300 hover:text-white`}
            >
              {streetLine}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </a>
            <p className="inline-flex border border-[var(--color-accent)]/55 px-3 py-2 font-labels text-[10px] uppercase tracking-[0.18em] text-white/72">
              CA License #{SITE.license}
            </p>
          </div>
        </div>

        <div className="border-b border-white/10 pb-10 md:border-b-0 md:pb-0">
          <p className={eyebrowClass}>Navigate</p>
          <nav className="mt-7 flex flex-col gap-3" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
                <span className={underlineClass} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-b border-white/10 pb-10 md:border-b-0 md:pb-0">
          <p className={eyebrowClass}>Services</p>
          <div className="mt-7 flex flex-col gap-3">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={linkClass}
              >
                {service.title}
                <span className={underlineClass} />
              </Link>
            ))}
          </div>

          <p className="mt-10 font-labels text-[10px] uppercase tracking-[0.2em] text-white/42">
            Service area
          </p>
          <p className={`${bodyClass} mt-5 max-w-sm`}>{FOOTER_AREAS.join(" / ")}</p>
        </div>

        <div>
          <p className={eyebrowClass}>Connect</p>
          <div className="mt-7">
            <SocialIcons />
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-[var(--color-accent)]/30 bg-black px-6 py-6 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/35">
            &copy; {year} 828 Construction. All rights reserved.
          </p>
          <p className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/35">
            Torrance &middot; South Bay &middot; LA County
          </p>
        </div>
      </div>
    </footer>
  );
}
