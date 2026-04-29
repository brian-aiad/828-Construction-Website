import Link from "next/link";
import Image from "next/image";
import { SITE, SERVICES } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white" data-section="footer">
      {/* Copper top accent line */}
      <div style={{ height: 1, background: "#B87333", opacity: 0.5 }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── DESKTOP layout (lg+) ─────────────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-16 pt-20 pb-16 border-b border-gray-900">

          {/* Brand — col 1-5 */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo/828logo_trans.png"
                alt="828 Construction"
                width={160}
                height={55}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
              Building science over guesswork. Quality over volume.
              25+ years serving South Bay homeowners and investors.
            </p>
            <div className="space-y-2">
              <a href={SITE.phoneHref} className="font-numbers text-white text-xl tracking-wide hover:text-[#B87333] transition-colors duration-200 block">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="font-labels text-[10px] text-gray-400 tracking-[0.15em] uppercase hover:text-[#B87333] transition-colors duration-200 block">
                {SITE.email}
              </a>
            </div>
          </div>

          {/* Nav + Services — col 6-9 */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-10">
            <div>
              <h3 className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-6">Navigation</h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/services", label: "Services" },
                  { href: "/projects", label: "Projects" },
                  { href: "/process", label: "Process" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-labels text-[11px] text-gray-400 tracking-[0.12em] uppercase hover:text-[#B87333] transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-6">Services</h3>
              <ul className="space-y-3">
                {SERVICES.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="font-labels text-[11px] text-gray-400 tracking-[0.12em] uppercase hover:text-[#B87333] transition-colors duration-200">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Address + CTA — col 10-12 */}
          <div className="lg:col-span-3">
            <h3 className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-6">Location</h3>
            <address className="text-sm text-gray-400 not-italic leading-relaxed mb-6">
              {SITE.address.street}<br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
            <div className="mb-8">
              <h3 className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-3">Service Area</h3>
              <p className="font-labels text-[10px] text-gray-400 tracking-[0.1em] leading-relaxed">
                {SITE.serviceArea.join(" · ")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-[#B87333] hover:text-white transition-colors duration-300 group"
            >
              Get Estimate
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* ── MOBILE layout (<lg) — editorial, restrained, premium ─────────── */}
        <div className="lg:hidden pt-12 pb-2">

          {/* Logo — modest, no tagline (tagline reads as filler on mobile) */}
          <Link href="/" className="inline-block mb-9" aria-label="828 Construction home">
            <Image
              src="/images/logo/828logo_trans.png"
              alt="828 Construction"
              width={96}
              height={33}
              className="h-7 w-auto"
            />
          </Link>

          {/* Hairline 1 — copper, signature */}
          <div className="h-px bg-[#B87333]/40 mb-7" aria-hidden="true" />

          {/* CONTACT — typography-driven, modest scale, single rhythm */}
          <div className="mb-9">
            <span className="font-labels text-[9px] text-white/40 tracking-[0.28em] uppercase block mb-5">
              Contact
            </span>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="font-numbers text-white text-[15px] tracking-tight transition-colors duration-200 hover:text-[#B87333] active:text-[#B87333]"
                >
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-numbers text-white/70 text-[13px] tracking-tight transition-colors duration-200 hover:text-[#B87333] active:text-[#B87333] break-all"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <address className="not-italic text-white/55 text-[13px] leading-[1.55] tracking-tight">
                  {SITE.address.street}<br />
                  {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                </address>
              </li>
            </ul>
          </div>

          {/* Hairline 2 — white/[0.07], thinner divider */}
          <div className="h-px bg-white/[0.07] mb-7" aria-hidden="true" />

          {/* NAVIGATE / SERVICES — compact 2-col, generous tap targets, copper hover */}
          <div className="grid grid-cols-2 gap-x-6 mb-9">
            <div>
              <span className="font-labels text-[9px] text-white/40 tracking-[0.28em] uppercase block mb-5">
                Navigate
              </span>
              <nav>
                <ul className="space-y-3.5">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about", label: "About" },
                    { href: "/services", label: "Services" },
                    { href: "/projects", label: "Projects" },
                    { href: "/process", label: "Process" },
                    { href: "/contact", label: "Contact" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-labels text-[11px] text-white/65 tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#B87333] active:text-[#B87333] inline-flex items-center min-h-[28px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div>
              <span className="font-labels text-[9px] text-white/40 tracking-[0.28em] uppercase block mb-5">
                Services
              </span>
              <nav>
                <ul className="space-y-3.5">
                  {SERVICES.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="font-labels text-[11px] text-white/65 tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#B87333] active:text-[#B87333] inline-flex items-center min-h-[28px]"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Hairline 3 */}
          <div className="h-px bg-white/[0.07] mb-7" aria-hidden="true" />

          {/* CTA — premium copper outline, full width */}
          <Link
            href="/contact"
            className="group flex items-center justify-between border border-[#B87333]/70 text-[#B87333] px-5 py-4 font-labels text-[10.5px] tracking-[0.22em] uppercase transition-colors duration-300 hover:bg-[#B87333] hover:text-white active:bg-[#B87333] active:text-white"
          >
            <span>Get a Free Estimate</span>
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* ── BOTTOM STRIP — both viewports ───────────────────────────────── */}
        <div className="border-t border-white/[0.07] lg:border-t-0 mt-10 lg:mt-0 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
          <p className="font-labels text-[9px] text-white/40 tracking-[0.18em] uppercase leading-relaxed">
            © {year} 828 Construction
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">CA License #{SITE.license}</span>
          </p>
          <p className="font-labels text-[9px] text-white/35 tracking-[0.18em] uppercase">
            Torrance · South Bay · LA County
          </p>
        </div>

      </div>
    </footer>
  );
}
