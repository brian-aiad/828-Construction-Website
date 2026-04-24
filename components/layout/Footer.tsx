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
              20+ years serving South Bay homeowners and investors.
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
                {SITE.serviceArea.slice(0, 5).join(" · ")}
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

        {/* ── MOBILE layout (<lg) ──────────────────────────────────────────── */}
        {/* Variation A: Stacked editorial — large phone, clear hierarchy, copper accents */}
        <div className="lg:hidden">

          {/* Logo + tagline */}
          <div className="pt-10 pb-7 border-b border-white/5">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/images/logo/828logo_trans.png"
                alt="828 Construction"
                width={120}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-[13px] leading-relaxed max-w-[280px]">
              Building science over guesswork. Quality over volume. 20+ years serving South Bay.
            </p>
          </div>

          {/* Contact — large phone number as anchor */}
          <div className="py-7 border-b border-white/5">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3">
              Contact
            </span>
            <a
              href={SITE.phoneHref}
              className="font-numbers text-[1.75rem] font-bold text-white tracking-tight hover:text-[#B87333] transition-colors duration-200 block mb-2 leading-none"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="font-labels text-[10px] text-gray-400 tracking-[0.12em] uppercase hover:text-gray-300 transition-colors duration-200"
            >
              {SITE.email}
            </a>
          </div>

          {/* Navigation — inline flex wrap */}
          <div className="py-6 border-b border-white/5">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
              Navigate
            </span>
            <nav className="flex flex-wrap gap-x-4 gap-y-0">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/projects", label: "Projects" },
                { href: "/process", label: "Process" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-labels text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-[#B87333] transition-colors duration-200 py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="py-6 border-b border-white/5">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
              Services
            </span>
            <nav className="flex flex-wrap gap-x-4 gap-y-0">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="font-labels text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-[#B87333] transition-colors duration-200 py-2"
                >
                  {service.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Address */}
          <div className="py-6 border-b border-white/5">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3">
              Location
            </span>
            <address className="text-[12px] text-gray-400 not-italic leading-relaxed">
              {SITE.address.street}<br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
          </div>

          {/* CTA button */}
          <div className="py-6">
            <Link
              href="/contact"
              className="flex items-center justify-between bg-white text-black px-5 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-[#B87333] hover:text-white transition-colors duration-300 group"
            >
              <span>Get a Free Estimate</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM STRIP — both viewports ───────────────────────────────── */}
        <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-gray-900">
          <p className="font-labels text-[9px] text-gray-400 tracking-[0.15em] uppercase">
            © {year} 828 Construction · CA License #{SITE.license}
          </p>
          <p className="font-labels text-[9px] text-gray-400 tracking-[0.15em] uppercase">
            Torrance · South Bay · Los Angeles County
          </p>
        </div>

      </div>
    </footer>
  );
}
