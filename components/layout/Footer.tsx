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

const labelClass = "font-labels text-[10px] uppercase tracking-[0.22em]";
const panelLinkClass =
  "group relative w-fit font-labels text-[11px] uppercase tracking-[0.16em] text-black/70 transition-colors hover:text-black";

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
      <section className="bg-black px-6 pb-16 pt-28 md:pb-20 md:pt-32 lg:px-12 lg:pb-24 lg:pt-44" data-footer-section="top-band">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <h2 className="max-w-4xl font-display text-[clamp(2.85rem,5.4vw,5.9rem)] font-medium leading-[0.9] tracking-normal text-white">
              Quality is the strategy.
            </h2>

            <ul className="mt-8 flex items-center gap-4" aria-label="Social links">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={social.href === "#" ? undefined : "_blank"}
                    rel={social.href === "#" ? undefined : "noopener noreferrer"}
                    className="group flex h-10 w-10 items-center justify-center border border-white/14 text-white/54 transition-colors hover:border-white/34 hover:text-white"
                  >
                    <span className="h-4 w-4">{social.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:text-right">
            <a
              href={SITE.phoneHref}
              className="block font-display text-[clamp(2.15rem,3.7vw,4.2rem)] font-medium leading-[0.95] text-white/34 transition-colors hover:text-white/68"
            >
              {formattedPhone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 block font-display text-[clamp(1.22rem,2.55vw,2.95rem)] font-medium leading-[0.98] text-white/28 transition-colors hover:text-white/62"
            >
              <span className="inline-block">828constructionca</span>
              <span className="inline-block">@gmail.com</span>
            </a>
            <Link
              href="/contact"
              className="mt-8 inline-flex w-fit items-center gap-2 border-b border-white/16 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-white/48 transition-colors hover:border-white/50 hover:text-white lg:ml-auto"
            >
              Get in touch
              <span aria-hidden="true">+</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid min-h-[34rem] grid-cols-1 lg:grid-cols-3" data-footer-section="panels">
        <a
          href={SITE.phoneHref}
          className="group relative flex min-h-[26rem] overflow-hidden bg-black text-white lg:min-h-[38rem]"
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
          <div className="relative z-10 mt-auto w-full p-7 md:p-9 lg:p-10">
            <span className="block border-b border-white/58 pb-4 font-display text-[clamp(2.1rem,3.8vw,4.4rem)] font-medium leading-none text-white">
              Book a Call
              <span className="ml-3" aria-hidden="true">→</span>
            </span>
          </div>
        </a>

        <div className="flex min-h-[30rem] flex-col bg-[#e7e7e2] px-7 py-8 text-black md:px-9 lg:min-h-[38rem] lg:p-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer navigation">
              <p className={`${labelClass} text-black/42`}>Navigate</p>
              <div className="mt-6 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={panelLinkClass}>
                    {link.label}
                    <Underline />
                  </Link>
                ))}
              </div>
            </nav>

            <nav aria-label="Footer services">
              <p className={`${labelClass} text-black/42`}>Services</p>
              <div className="mt-6 flex flex-col gap-4">
                {SERVICES.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className={panelLinkClass}
                  >
                    {service.title}
                    <Underline />
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="mt-auto pt-12">
            <p className="font-labels text-[10px] uppercase tracking-[0.18em] text-black/44">
              &copy; {year} 828 Construction
            </p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-black/44">
              All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex min-h-[30rem] flex-col bg-[#f7f7f3] px-7 py-8 text-black md:px-9 lg:min-h-[38rem] lg:p-10">
          <div>
            <p className={`${labelClass} text-black/42`}>Serving</p>
            <h3 className="mt-5 font-display text-[clamp(2.4rem,4vw,4.6rem)] font-medium leading-[0.92] text-black">
              Torrance, CA
            </h3>
            <address className="mt-8 not-italic text-sm leading-7 text-black/62">
              {streetLine}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
          </div>

          <div className="mt-10">
            <p className={`${labelClass} text-black/42`}>Service Area</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-black/58">
              {SITE.serviceArea.join(" / ")}
            </p>
          </div>

          <div className="mt-auto pt-12">
            <p className="inline-flex border border-[var(--color-accent)]/55 px-4 py-3 font-labels text-[10px] uppercase tracking-[0.18em] text-black/72">
              CA License #{SITE.license}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 bg-black py-4" data-footer-section="wordmark">
        <BrandMarqueeBottom
          itemClassName="text-white/24"
          separatorClassName="bg-[var(--color-accent)]"
        />
      </section>
    </footer>
  );
}
