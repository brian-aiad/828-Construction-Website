"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black shadow-lg" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-white">
              <span className="text-white font-[var(--font-space-grotesk)] font-bold text-sm tracking-wider">
                828
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-[var(--font-space-grotesk)] font-bold text-lg tracking-wide leading-none">
                828 Construction
              </div>
              <div className="text-gray-400 text-xs tracking-widest uppercase mt-0.5">
                Built with Intent
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wider uppercase font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={SITE.phoneHref}
              className="text-white font-[var(--font-space-mono)] text-sm tracking-wide hover:text-gray-300 transition-colors"
            >
              {SITE.phone}
            </a>
            <Link
              href="/contact"
              className="bg-white text-black px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Get Estimate
            </Link>
          </div>

          {/* Mobile: phone + hamburger */}
          <div className="flex lg:hidden items-center gap-4">
            <a
              href={SITE.phoneHref}
              className="text-white font-[var(--font-space-mono)] text-sm"
            >
              {SITE.phone}
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-1"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    mobileOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800">
          <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base tracking-wider uppercase font-medium py-2 border-b border-gray-800 transition-colors ${
                  pathname === link.href ? "text-white" : "text-gray-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 bg-white text-black px-5 py-3 text-xs font-bold tracking-widest uppercase text-center"
            >
              Get Free Estimate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
