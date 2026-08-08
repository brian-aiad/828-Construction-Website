"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE, SERVICES } from "@/lib/constants";
import BrandMarqueeBottom from "@/components/footer/BrandMarqueeBottom";
import { SOCIAL_LINKS } from "@/components/footer/SocialIcons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

const FOOTER_LINKS = [
  ...NAV_LINKS,
  ...SERVICES.map((service) => ({
    href: `/services/${service.slug}`,
    label: service.title,
  })),
];

const labelClass = "font-labels text-[10px] uppercase tracking-[0.22em]";
// Joe (IMG_1127, 2026-07-09): footers must read as ONE black zone — no cream
// panels breaking the surface on the way up. All panel surfaces stay black.
// Packed nav column (~28px vertical pitch): the ::before extends the tap area
// to fill the row gap — max reach without overlapping the neighbour's target or
// changing any visual (44px would require respacing the column, which is not
// allowed here). Clears the WCAG 2.5.8 AA 24px floor.
const panelLinkClass =
  "group relative w-fit font-labels text-[11px] uppercase tracking-[0.16em] text-black/72 transition-colors before:absolute before:inset-x-0 before:-inset-y-[5px] before:content-[''] hover:text-black";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function Underline() {
  return (
    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100" />
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const formattedPhone = formatPhone(SITE.phone);
  const streetLine = SITE.address.street.replace(" STE", ", STE");

  return (
    <footer className="relative flex flex-col overflow-hidden bg-black text-white min-[1180px]:h-svh min-[1180px]:min-h-[720px]" data-section="footer" data-header-dark="">
      <section className="flex flex-col justify-center bg-black px-6 pb-7 pt-12 md:px-8 md:pb-8 md:pt-16 min-[1180px]:h-[31%] min-[1180px]:shrink-0 min-[1180px]:px-3 min-[1180px]:pb-8 min-[1180px]:pt-20" data-footer-section="top-band">
        <div className="grid w-full gap-5 min-[1180px]:grid-cols-2 min-[1180px]:items-start min-[1180px]:gap-0">
          <div>
            <h2 className="max-w-[18rem] font-display text-[1.85rem] font-normal leading-[1.02] tracking-[-0.01em] text-white md:text-[2.3rem] min-[1180px]:max-w-[22rem] min-[1180px]:text-[clamp(2.8rem,4vw,3.6rem)]">
              Quality is the strategy.
            </h2>

            <ul className="-ml-2 mt-4 flex items-center gap-3 min-[1180px]:mt-7 min-[1180px]:gap-5" aria-label="Social links">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={social.href === "#" ? undefined : "_blank"}
                    rel={social.href === "#" ? undefined : "noopener noreferrer"}
                    className="group relative flex h-10 w-10 items-center justify-center text-white/42 transition-colors before:absolute before:-inset-0.5 before:content-[''] hover:text-white/72"
                  >
                    <span className="h-6 w-6">{social.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-[1180px]:pt-1">
            <a
              href={SITE.phoneHref}
              className="relative block font-display text-[1.45rem] font-normal leading-[1.05] text-white/46 transition-colors before:absolute before:inset-x-0 before:-top-[11px] before:-bottom-[4px] before:content-[''] hover:text-white/68 md:text-[2.1rem] min-[1180px]:text-[clamp(2.1rem,3.2vw,3.2rem)] min-[1180px]:text-white/38 min-[1180px]:before:hidden"
            >
              {formattedPhone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="relative mt-1.5 block font-display text-[1rem] font-normal leading-[1.08] text-white/40 transition-colors before:absolute before:inset-x-0 before:-top-[4px] before:-bottom-[21px] before:content-[''] hover:text-white/62 md:text-[1.4rem] min-[1180px]:mt-3 min-[1180px]:text-[clamp(1.8rem,2.7vw,2.8rem)] min-[1180px]:text-white/30 min-[1180px]:before:hidden"
            >
              <span className="inline-block">828constructionca</span>
              <span className="inline-block">@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      <section className="relative grid grid-cols-1 min-[1180px]:min-h-0 min-[1180px]:flex-1 min-[1180px]:grid-cols-[2fr_1fr_1fr]" data-footer-section="panels">
        <a
          href={SITE.phoneHref}
          className="group relative min-h-[8.75rem] overflow-hidden bg-black text-white md:min-h-[12.5rem] min-[1180px]:h-full min-[1180px]:min-h-0"
        >
          <Image
            src="/images/generated/footer-consultation-cta.webp"
            alt="Builder-client consultation reviewing residential construction plans"
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            style={{ filter: "contrast(1.04) saturate(0.96) brightness(0.92)" }}
          />
          <div className="absolute inset-0 bg-black/18" aria-hidden="true" />
          <div className="absolute left-0 right-0 top-[44%] z-10 px-7 md:px-9 min-[1180px]:px-[5vw]">
            <span className="block border-b border-white/62 pb-2 font-display text-[clamp(1.25rem,1.65vw,1.55rem)] font-normal leading-none text-white">
              Book a Call
              <span className="ml-3" aria-hidden="true">→</span>
            </span>
          </div>
        </a>

        {/* Brian 2026-07-13 (two passes): the info boxes carry two tones —
            charcoal nav box + warm bone serving box ("lighter", after the
            deep-maroon try read too red). Black -> charcoal -> bone steps
            keep the footer in the site's ink/cream family. */}
        <div className="flex flex-col border-t border-black/8 bg-[#ECEBE7] px-6 py-6 text-[#141414] md:px-9 md:py-7 min-[1180px]:h-full min-[1180px]:min-h-0 min-[1180px]:justify-center min-[1180px]:border-l min-[1180px]:border-t-0 min-[1180px]:px-[4vw] min-[1180px]:py-[3rem]">
          <nav aria-label="Footer navigation" className="mt-0 grid grid-cols-2 gap-x-8 gap-y-2.5 min-[1180px]:flex min-[1180px]:flex-col min-[1180px]:gap-[0.7rem] min-[1180px]:pl-[26%]">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={panelLinkClass}>
                {link.label}
                <Underline />
              </Link>
            ))}
          </nav>

          <div className="mt-5 min-[1180px]:mt-9 min-[1180px]:pl-[26%]">
            <p className="font-labels text-[10px] uppercase tracking-[0.18em] text-black/55">
              &copy; {year} 828 Construction
            </p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-black/55">
              All rights reserved.
            </p>
          </div>
        </div>

        <div className="relative flex h-full min-h-0 flex-col overflow-hidden border-t border-black/8 bg-white px-6 pb-7 pt-6 text-[#141414] md:px-9 md:py-7 min-[1180px]:justify-center min-[1180px]:border-l min-[1180px]:border-t-0 min-[1180px]:px-[4.5vw] min-[1180px]:pb-24 min-[1180px]:pt-8">
          <div className="relative z-20 grid gap-5 md:grid-cols-2 min-[1180px]:block">
          <div>
            <p className={`${labelClass} text-black/52`}>Serving</p>
            <h3 className="mt-3 font-display text-[clamp(1.2rem,1.25vw,1.4rem)] font-medium leading-tight text-[#141414]">
              Torrance, CA
            </h3>
            <address className="mt-3 not-italic text-sm leading-6 text-black/72">
              {streetLine}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
          </div>

          <div className="min-[1180px]:mt-6">
            <p className={`${labelClass} text-black/52`}>Service Area</p>
            <p className="mt-3 max-w-md text-[13px] leading-6 text-black/62">
              {SITE.serviceArea.join(" / ")}
            </p>
          </div>
          </div>

          <div className="relative z-20 mt-5 min-[1180px]:mt-8">
            <p className="inline-flex border border-[var(--color-accent)]/60 px-4 py-2.5 font-labels text-[10px] uppercase tracking-[0.18em] text-black/72">
              CA License #{SITE.license}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[-1.05rem] z-10 hidden overflow-hidden min-[1180px]:block"
          >
            <BrandMarqueeBottom giant color="rgb(12, 12, 12)" itemClassName="text-[#0c0c0c]" />
          </div>
        </div>

        {/* NS-reference wordmark: lives INSIDE the white serving box only,
            fully visible with a little bottom padding (Brian round 2). */}
      </section>
    </footer>
  );
}
