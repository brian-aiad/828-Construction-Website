"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { flushSync } from "react-dom";
import { NAV_LINKS, SERVICES, SITE } from "@/lib/constants";

type HeaderSurface = "dark-transparent" | "dark-solid" | "light-solid";

function sectionHasMedia(el: Element) {
  return (
    el.matches("[data-header-transparent], [data-header-media]") ||
    el.closest("img, picture, video, canvas, [data-header-media]") !== null
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [surface, setSurface] = useState<HeaderSurface>("dark-transparent");
  const [torTime, setTorTime] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HeaderSurface>("dark-transparent");
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;

    // The header follows the surface currently passing beneath it. Photo/hero
    // sections stay transparent at any scroll depth; black and cream sections
    // become solid as soon as they cover the bar.
    const readSurface = (): HeaderSurface => {
      const headerHeight = window.matchMedia("(min-width: 1024px)").matches ? 52 : 48;
      const y = Math.min(window.innerHeight - 1, headerHeight - 6);
      const xs = [0.16, 0.32, 0.5, 0.68, 0.84].map((pct) => window.innerWidth * pct);
      const votes: HeaderSurface[] = [];

      const readAtPoint = (x: number): HeaderSurface | null => {
        const stack = document.elementsFromPoint(x, y);
        for (const el of stack) {
          if (el.closest("header")) continue;
          if (el.closest("[data-stack-surface][data-stack-covered]")) continue;

          const transparent = el.closest("[data-header-transparent]");
          if (transparent) return "dark-transparent";

          const light = el.closest("[data-header-light]");
          if (light) return "light-solid";

          const dark = el.closest("[data-header-dark]");
          if (dark) {
            return sectionHasMedia(dark) ? "dark-transparent" : "dark-solid";
          }
        }
        return null;
      };

      for (const x of xs) {
        const pointSurface = readAtPoint(x);
        if (pointSurface) votes.push(pointSurface);
      }

      if (votes.length) {
        const counts = votes.reduce<Record<HeaderSurface, number>>(
          (acc, item) => {
            acc[item] += 1;
            return acc;
          },
          { "dark-transparent": 0, "dark-solid": 0, "light-solid": 0 }
        );
        const center = readAtPoint(window.innerWidth / 2);
        const ranked = (Object.keys(counts) as HeaderSurface[]).sort(
          (a, b) => counts[b] - counts[a]
        );
        if (center && counts[center] === counts[ranked[0]]) return center;
        return ranked[0];
      }

      return window.scrollY < 32 ? "dark-transparent" : "dark-solid";
    };

    const checkZone = () => {
      const next = readSurface();
      if (surfaceRef.current === next) return;
      surfaceRef.current = next;
      flushSync(() => setSurface(next));
    };

    const syncHeader = () => {
      raf = 0;
      const currentY = window.scrollY;
      if (progressRef.current) {
        const doc = document.documentElement;
        const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
        progressRef.current.style.transform = `scaleX(${Math.min(currentY / max, 1).toFixed(4)})`;
      }
      checkZone();
    };

    const scheduleSync = () => {
      if (raf) return;
      raf = requestAnimationFrame(syncHeader);
    };

    syncHeader();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(scheduleSync)
        : null;
    mutationObserver?.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-stack-covered"],
      subtree: true,
    });
    // Scrub animations (e.g. the expanding photograph) keep settling AFTER
    // the last scroll event — a light poll keeps the header honest. The
    // check is a no-op re-render-wise unless the zone actually changes.
    const zonePoll = setInterval(scheduleSync, 50);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      mutationObserver?.disconnect();
      clearInterval(zonePoll);
    };
  }, [pathname]);

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

  const isServicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  // Light header mode — whenever a light-marked surface is under the bar, and
  // never while the (black) mobile menu overlay is open.
  const light = surface === "light-solid" && !mobileOpen;
  const transparent = surface === "dark-transparent" && !mobileOpen;
  const backgroundAlpha = light ? 0.95 : transparent ? 0.045 : 0.95;
  const blur = transparent ? 8 : 16;
  const borderAlpha = transparent ? 0.05 : 0.14;
  const progressOpacity = transparent ? 0.78 : 0.95;
  const inkBase = light ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white";
  const inkActive = light ? "text-black" : "text-white";

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: "translateY(0)",
          backgroundColor: light
            ? `rgba(247,247,243,${backgroundAlpha})`
            : `rgba(5,5,5,${backgroundAlpha})`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          borderBottom: `1px solid ${
            light
              ? `rgba(0,0,0,${borderAlpha})`
              : `rgba(255,255,255,${borderAlpha})`
          }`,
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="w-full px-3 sm:px-4 lg:px-8 2xl:px-10">
          <div
            className="flex h-12 items-center justify-between lg:h-[52px] lg:grid lg:grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] lg:gap-10"
          >
            {/* Logo — text wordmark, uniform weight */}
            <Link
              href="/"
              aria-label="828 Construction"
              className="flex min-h-11 shrink-0 items-center"
              onClick={() => {
                if (pathname === "/") window.scrollTo(0, 0);
              }}
            >
              <span
                className={`font-display font-semibold text-[15px] min-[390px]:text-base sm:text-[17px] lg:text-[18px] tracking-[0.085em] min-[390px]:tracking-[0.095em] lg:tracking-[0.105em] whitespace-nowrap transition-colors duration-200 ${
                  light ? "text-[#111]" : "text-white"
                }`}
              >
                828CONSTRUCTION
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center justify-center gap-8">
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
                          isServicesActive ? inkActive : inkBase
                        }`}
                      >
                        {link.label}
                        <span
                          className={`absolute -bottom-1 left-0 right-0 h-px transition-transform duration-300 origin-left ${
                            isServicesActive
                              ? "bg-[var(--color-accent)] scale-x-100"
                              : `${light ? "bg-black" : "bg-white"} origin-left transition-transform duration-300 ${servicesOpen ? "scale-x-100" : "scale-x-0"}`
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
                      pathname === link.href ? inkActive : inkBase
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-px transition-transform duration-300 origin-left ${
                        pathname === link.href
                          ? "bg-[var(--color-accent)] scale-x-100"
                          : `${light ? "bg-black" : "bg-white"} scale-x-0 group-hover:scale-x-100`
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right side: location + timestamp */}
            <div className="hidden lg:flex items-center justify-end">
              {torTime && (
                <span
                  className={`font-labels text-[9px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-200 ${
                    light ? "text-black/60" : "text-white/30"
                  }`}
                >
                  Torrance · {torTime}
                </span>
              )}
            </div>

            {/* Mobile: phone + hamburger */}
            <div className="flex lg:hidden items-center gap-2 min-[390px]:gap-3 sm:gap-5">
              <a
                href={SITE.phoneHref}
                className={`hidden min-[390px]:inline-flex min-h-11 items-center font-numbers text-[11px] transition-colors sm:text-xs ${
                  light ? "text-black/55 hover:text-black" : "text-gray-400 hover:text-white"
                }`}
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
                  className={`block h-px w-6 transition-all duration-300 origin-center ${light ? "bg-black" : "bg-white"} ${
                    mobileOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-px w-6 transition-all duration-300 ${light ? "bg-black" : "bg-white"} ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-px w-6 transition-all duration-300 origin-center ${light ? "bg-black" : "bg-white"} ${
                    mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Maroon page-progress hairline — lives on the header's bottom edge
            (replaces the detached #scroll-progress top bar) so it hides and
            reveals together with the bar. Driven direct-to-style on scroll. */}
        <div
          ref={progressRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--color-accent)] transition-[opacity,box-shadow] duration-200"
          style={{
            transform: "scaleX(0)",
            opacity: progressOpacity,
            boxShadow: transparent
              ? "0 0 14px rgba(184,115,51,0.5)"
              : "0 0 8px rgba(184,115,51,0.32)",
            willChange: "transform",
          }}
        />
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
                            : "text-gray-400 border-gray-800 hover:text-white hover:border-gray-600"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          className={`font-labels text-[9px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                            mobileServicesOpen
                              ? "text-[var(--color-accent-light)]"
                              : "text-gray-400"
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
                                className="relative flex items-center justify-between py-3 border-b border-white/[0.04] before:absolute before:inset-x-0 before:-top-0.5 before:bottom-0 before:content-['']"
                              >
                                <span className="font-labels text-[11px] text-gray-500 tracking-[0.18em] uppercase">
                                  All Services
                                </span>
                                <span className="font-labels text-[9px] text-gray-500 tracking-[0.1em] uppercase">
                                  →
                                </span>
                              </Link>
                              {SERVICES.map((service) => (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  className={`flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 transition-colors duration-150 ${
                                    pathname === `/services/${service.slug}`
                                      ? "text-[var(--color-accent-light)]"
                                      : "text-gray-300 hover:text-white"
                                  }`}
                                >
                                  <span className="font-display font-bold text-lg tracking-tight">
                                    {service.title}
                                  </span>
                                  <span className="font-labels text-[8px] text-gray-500 tracking-[0.15em] uppercase">
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
                          : "text-gray-400 border-gray-800 hover:text-white hover:border-gray-600"
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
