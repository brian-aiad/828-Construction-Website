import Link from "next/link";
import { SITE, NAV_LINKS, SERVICES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 border-2 border-white">
                <span className="text-white font-[var(--font-space-grotesk)] font-bold text-sm tracking-wider">
                  828
                </span>
              </div>
              <div>
                <div className="font-[var(--font-space-grotesk)] font-bold text-lg tracking-wide leading-none">
                  828 Construction
                </div>
                <div className="text-gray-400 text-xs tracking-widest uppercase mt-0.5">
                  Built with Intent
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              20+ years of building science expertise. Quality over quantity —
              every time.
            </p>
            <div className="text-xs text-gray-500 tracking-wider uppercase">
              CA License #{SITE.license}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
                Service Area
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {SITE.serviceArea.join(" · ")}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">
              Contact
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Phone
                </div>
                <a
                  href={SITE.phoneHref}
                  className="text-white font-[var(--font-space-mono)] text-sm hover:text-gray-300 transition-colors"
                >
                  {SITE.phone}
                </a>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Email
                </div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {SITE.email}
                </a>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Address
                </div>
                <address className="text-sm text-gray-400 not-italic leading-relaxed">
                  {SITE.address.street}
                  <br />
                  {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                </address>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block bg-white text-black px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
              >
                Get Estimate
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 tracking-wide">
            © {new Date().getFullYear()} 828 Construction. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 tracking-wide">
            Torrance, CA · South Bay · Los Angeles County
          </p>
        </div>
      </div>
    </footer>
  );
}
