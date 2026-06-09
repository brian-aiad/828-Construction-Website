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
const panelLinkClass =
  "group relative w-fit font-labels text-[11px] uppercase tracking-[0.16em] text-black/72 transition-colors hover:text-black";

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
    <footer className="relative overflow-hidden bg-black text-white" data-section="footer">
      <section className="bg-black px-6 pb-14 pt-[4.5rem] md:px-8 md:pb-16 md:pt-[5.5rem] lg:px-14 lg:pb-20 lg:pt-24" data-footer-section="top-band">
        <div className="grid w-full gap-12 lg:grid-cols-[0.43fr_0.57fr] lg:items-start">
          <div>
            <h2 className="max-w-3xl font-display text-[clamp(3rem,4.05vw,4.1rem)] font-medium leading-[0.92] tracking-normal text-white">
              Quality is the strategy.
            </h2>

            <ul className="mt-8 flex items-center gap-5" aria-label="Social links">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={social.href === "#" ? undefined : "_blank"}
                    rel={social.href === "#" ? undefined : "noopener noreferrer"}
                    className="group flex h-9 w-9 items-center justify-center text-white/42 transition-colors hover:text-white/72"
                  >
                    <span className="h-6 w-6">{social.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-2">
            <a
              href={SITE.phoneHref}
              className="block font-display text-[clamp(2.35rem,3.95vw,4.05rem)] font-medium leading-[0.95] text-white/38 transition-colors hover:text-white/68"
            >
              {formattedPhone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-5 block font-display text-[clamp(1.55rem,2.85vw,3.35rem)] font-medium leading-[0.98] text-white/30 transition-colors hover:text-white/62"
            >
              <span className="inline-block">828constructionca</span>
              <span className="inline-block">@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      <section className="grid min-h-[34rem] grid-cols-1 lg:grid-cols-[4fr_3.3fr_2.7fr]" data-footer-section="panels">
        <a
          href={SITE.phoneHref}
          className="group relative min-h-[26rem] overflow-hidden bg-black text-white lg:min-h-[34.4rem]"
        >
          <Image
            src="/images/generated/footer-consultation-cta.webp"
            alt="Builder-client consultation reviewing residential construction plans"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            style={{ filter: "contrast(1.04) saturate(0.96) brightness(0.92)" }}
          />
          <div className="absolute inset-0 bg-black/18" aria-hidden="true" />
          <div className="absolute left-0 right-0 top-[62%] z-10 px-7 md:px-9 lg:px-10">
            <span className="block border-b border-white/62 pb-2 font-display text-[clamp(1.9rem,2.7vw,2.85rem)] font-medium leading-none text-white">
              Book a Call
              <span className="ml-3" aria-hidden="true">→</span>
            </span>
          </div>
        </a>

        <div className="flex min-h-[30rem] flex-col bg-[#e7e7e2] px-7 py-8 text-black md:px-9 lg:min-h-[34.4rem] lg:px-[8vw] lg:py-24">
          <nav aria-label="Footer navigation" className="mt-4 flex flex-col gap-[0.7rem] lg:mt-10">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={panelLinkClass}>
                {link.label}
                <Underline />
              </Link>
            ))}
          </nav>

          <div className="mt-10 lg:mt-auto">
            <p className="font-labels text-[10px] uppercase tracking-[0.18em] text-black/44">
              &copy; {year} 828 Construction
            </p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-black/44">
              All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex min-h-[30rem] flex-col overflow-hidden bg-[#f7f7f3] px-7 py-8 text-black md:px-9 lg:min-h-[34.4rem] lg:px-[5.2vw] lg:pb-0 lg:pt-24">
          <div>
            <p className={`${labelClass} text-black/42`}>Serving</p>
            <h3 className="mt-4 font-display text-[clamp(1.6rem,1.45vw,1.75rem)] font-medium leading-tight text-black">
              Torrance, CA
            </h3>
            <address className="mt-4 not-italic text-sm leading-6 text-black/72">
              {streetLine}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
          </div>

          <div className="mt-8">
            <p className={`${labelClass} text-black/42`}>Service Area</p>
            <p className="mt-3 max-w-md text-[13px] leading-6 text-black/62">
              {SITE.serviceArea.join(" / ")}
            </p>
          </div>

          <div className="mt-10">
            <p className="inline-flex border border-[var(--color-accent)]/55 px-4 py-2.5 font-labels text-[10px] uppercase tracking-[0.18em] text-black/72">
              CA License #{SITE.license}
            </p>
          </div>

          <BrandMarqueeBottom
            panel
            color="rgb(0, 0, 0)"
            showSeparator={false}
            className="mt-auto -mx-7 w-[calc(100%+3.5rem)] translate-y-[0.12rem] md:-mx-9 md:w-[calc(100%+4.5rem)] lg:-mx-[5.2vw] lg:w-[calc(100%+10.4vw)]"
            itemClassName="text-black"
          />
        </div>
      </section>
    </footer>
  );
}
