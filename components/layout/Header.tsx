"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 32);
      // Hide on scroll down past 300px, reveal on scroll up
      if (currentY > 300) {
        setHidden(currentY > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
            : isHome
            ? "bg-black/40 backdrop-blur-[6px] border-b border-white/5"
            : "bg-black/90 backdrop-blur-xl border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 lg:h-22">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center"
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo(0, 0);
                }
              }}
            >
              <Image
                src="/images/logo/828logo_trans.png"
                alt="828 Construction"
                width={280}
                height={96}
                className="h-12 w-auto lg:h-16"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-labels text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 relative group ${
                    pathname === link.href
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  {/* Active: copper underline. Hover: white underline slides in */}
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-px transition-transform duration-300 origin-left ${
                      pathname === link.href
                        ? "bg-[#B87333] scale-x-100"
                        : "bg-white scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right side: phone + CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href={SITE.phoneHref}
                className="font-numbers text-sm text-white/55 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="btn-shine bg-white text-black px-5 py-2.5 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-gray-100 transition-colors duration-200"
              >
                Get Estimate
              </Link>
            </div>

            {/* Mobile: phone + hamburger */}
            <div className="flex lg:hidden items-center gap-5">
              <a
                href={SITE.phoneHref}
                className="font-numbers text-xs text-gray-400 hover:text-white transition-colors"
              >
                {SITE.phone}
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex flex-col gap-[5px] w-6 py-1"
                aria-label="Toggle menu"
              >
                <span
                  className={`block h-px bg-white transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-white transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-white transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col pt-20 px-6 pb-10 overflow-y-auto"
          >
            <nav className="flex-1 flex flex-col justify-center space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.06,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={`block py-4 border-b font-display font-bold text-3xl tracking-tight transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-white border-gray-700"
                        : "text-gray-600 border-gray-900 hover:text-white hover:border-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 space-y-4"
            >
              <Link
                href="/contact"
                className="btn-shine block text-center bg-white text-black px-6 py-4 font-labels text-[11px] tracking-[0.18em] uppercase"
              >
                Get Free Estimate
              </Link>
              <a
                href={SITE.phoneHref}
                className="block text-center border border-gray-700 text-white px-6 py-4 font-labels text-[11px] tracking-[0.18em] uppercase font-numbers"
              >
                {SITE.phone}
              </a>
              <p className="text-center font-labels text-[9px] text-gray-700 tracking-[0.18em] uppercase mt-4">
                CA License #{SITE.license}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
