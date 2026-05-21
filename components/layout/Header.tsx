"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SERVICES, SITE } from "@/lib/constants";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [torTime, setTorTime] = useState("");
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const bookCallMagRef = useMagnetic(0.55) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 32);
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
    const frame = requestAnimationFrame(() => {
      setMobileOpen(false);
      setMobileServicesOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close BOOK CALL dropdown when clicking outside it
  useEffect(() => {
    if (!bookCallOpen) return;
    const handler = (e: MouseEvent) => {
      const el = bookCallMagRef.current;
      if (el && !el.contains(e.target as Node)) setBookCallOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bookCallOpen, bookCallMagRef]);

  // Live Torrance time — updates every second
  useEffect(() => {
    const update = () => {
      setTorTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const isHome = pathname === "/";
  const isServicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

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
              className="flex shrink-0 items-center"
              onClick={() => {
                if (pathname === "/") window.scrollTo(0, 0);
              }}
            >
              <Image
                src="/images/logo/828logo_new_header.png"
                alt="828 Construction"
                width={360}
                height={48}
                className="h-5 w-auto sm:h-6 lg:h-8 xl:h-9"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                if (link.href === "/services") {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      {/* Trigger */}
                      <Link
                        href="/services"
                        className={`font-labels text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 relative flex items-center gap-1.5 ${
                          isServicesActive
                            ? "text-white"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {link.label}
                        <span
                          className={`absolute -bottom-1 left-0 right-0 h-px transition-transform duration-300 origin-left ${
                            isServicesActive
                              ? "bg-[#7B2D26] scale-x-100"
                              : `bg-white origin-left transition-transform duration-300 ${servicesOpen ? "scale-x-100" : "scale-x-0"}`
                          }`}
                        />
                      </Link>

                      {/* Dropdown panel — pt-2 gives visual gap without breaking hover area */}
                      <div
                        className={`absolute top-full left-0 pt-2 w-52 transition-all duration-200 ${
                          servicesOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
                        }`}
                        style={{ zIndex: 60 }}
                      >
                      <div className="bg-black border border-white/10">
                        {/* Maroon top accent */}
                        <div style={{ height: 1, background: "var(--color-accent)", opacity: 0.6 }} />

                        {/* Vertical service list — each service on its own line */}
                        <div className="py-1">
                          {SERVICES.map((service, idx) => (
                            <div key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                className="group/item flex items-center justify-between px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150"
                              >
                                <div>
                                  <span
                                    className={`font-display font-bold block leading-tight mb-0.5 transition-colors duration-150 ${
                                      pathname === `/services/${service.slug}`
                                        ? "text-white"
                                        : "text-white/75 group-hover/item:text-white"
                                    }`}
                                    style={{ fontSize: "0.78rem" }}
                                  >
                                    {service.title}
                                  </span>
                                  <span className="font-labels text-[8px] text-gray-600 tracking-[0.14em] uppercase">
                                    {service.short}
                                  </span>
                                </div>
                                {pathname === `/services/${service.slug}` && (
                                  <span
                                    className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
                                    style={{ background: "var(--color-accent)" }}
                                    aria-hidden="true"
                                  />
                                )}
                              </Link>
                              {idx < SERVICES.length - 1 && (
                                <div
                                  className="mx-4"
                                  style={{ height: 1, background: "var(--color-accent)", opacity: 0.12 }}
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-white/[0.06]">
                          <Link
                            href="/services"
                            className="font-labels text-[8px] text-gray-500 tracking-[0.15em] uppercase hover:text-white transition-colors"
                          >
                            All Services Overview →
                          </Link>
                        </div>
                      </div>{/* end bg-black inner card */}
                      </div>{/* end positioning wrapper */}
                    </div>
                  );
                }

                return (
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
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-px transition-transform duration-300 origin-left ${
                        pathname === link.href
                          ? "bg-[#7B2D26] scale-x-100"
                          : "bg-white scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right side: location + timestamp + BOOK CALL asterisk dropdown */}
            <div className="hidden lg:flex items-center gap-6">
              {torTime && (
                <span className="hidden xl:block font-labels text-[9px] text-white/30 tracking-[0.14em] uppercase whitespace-nowrap">
                  Torrance · {torTime}
                </span>
              )}
              {/* BOOK CALL — asterisk reveals phone number on click */}
              <div ref={bookCallMagRef} style={{ display: "inline-block" }} className="relative">
                <button
                  onClick={() => setBookCallOpen(!bookCallOpen)}
                  aria-expanded={bookCallOpen}
                  className="btn-shine book-call-cta flex items-center gap-2 bg-white text-black px-5 py-2.5 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-gray-100 transition-colors duration-200"
                >
                  BOOK CALL
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      transition: "transform 0.3s ease",
                      transform: bookCallOpen ? "rotate(45deg)" : "rotate(0deg)",
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                {bookCallOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "#000",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderTop: `1px solid var(--color-accent)`,
                      padding: "12px 20px",
                      animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both",
                      zIndex: 60,
                      minWidth: "180px",
                    }}
                  >
                    <a
                      href={SITE.phoneHref}
                      className="font-numbers text-sm text-white hover:text-gray-300 transition-colors whitespace-nowrap tracking-wide"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: phone + hamburger */}
            <div className="flex lg:hidden items-center gap-5">
              <a
                href={SITE.phoneHref}
                className="inline-flex min-h-11 items-center font-numbers text-xs text-gray-400 transition-colors hover:text-white"
              >
                {SITE.phone}
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span
                  className={`block h-px w-6 bg-white transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-px w-6 bg-white transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-px w-6 bg-white transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sub-header marquee strip — always on, below nav row */}
          <div
            className="overflow-hidden border-t hidden lg:block"
            style={{ height: 22, borderColor: "rgba(123,45,38,0.15)", background: "rgba(123,45,38,0.08)" }}
            aria-hidden="true"
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "max-content", height: "100%", animation: "marqueeScroll 35s linear infinite" }}
            >
              {[...Array(2)].map((_, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "2.5rem", paddingRight: "2.5rem" }}>
                  {["BUILT WITH INTENT", `CA LICENSE #${SITE.license}`, "20+ YRS EXPERIENCE", "828 CONSTRUCTION", "SOUTH BAY NATIVE", "QUALITY OVER QUANTITY"].map((text, j) => (
                    <span key={j} style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.18em", color: "var(--color-accent)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {text}
                    </span>
                  ))}
                </span>
              ))}
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
              {NAV_LINKS.map((link, i) => {
                if (link.href === "/services") {
                  return (
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
                      {/* Services accordion */}
                      <button
                        onClick={() =>
                          setMobileServicesOpen(!mobileServicesOpen)
                        }
                        className={`w-full flex items-center justify-between py-4 border-b font-display font-bold text-3xl tracking-tight transition-colors duration-200 ${
                          isServicesActive
                            ? "text-white border-gray-700"
                            : "text-gray-600 border-gray-900 hover:text-white hover:border-gray-700"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          className={`font-labels text-[9px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                            mobileServicesOpen
                              ? "text-[#7B2D26]"
                              : "text-gray-600"
                          }`}
                        >
                          {mobileServicesOpen ? "–" : "+"}
                        </span>
                      </button>

                      {/* Sub-items */}
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-2 space-y-0 border-b border-gray-900">
                              {/* Services overview */}
                              <Link
                                href="/services"
                                className="flex items-center justify-between py-3 border-b border-white/[0.04]"
                              >
                                <span className="font-labels text-[11px] text-gray-500 tracking-[0.18em] uppercase">
                                  All Services
                                </span>
                                <span className="font-labels text-[9px] text-gray-600 tracking-[0.1em] uppercase">
                                  →
                                </span>
                              </Link>
                              {SERVICES.map((service) => (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  className={`flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 transition-colors duration-150 ${
                                    pathname === `/services/${service.slug}`
                                      ? "text-[#7B2D26]"
                                      : "text-gray-400 hover:text-white"
                                  }`}
                                >
                                  <span className="font-display font-bold text-lg tracking-tight">
                                    {service.title}
                                  </span>
                                  <span className="font-labels text-[8px] text-gray-600 tracking-[0.15em] uppercase">
                                    {service.short}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
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
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 space-y-4"
            >
              <a
                href={SITE.phoneHref}
                className="btn-shine block text-center bg-white text-black px-6 py-4 font-labels text-[11px] tracking-[0.18em] uppercase"
              >
                Book Call
              </a>
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
