"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport width is < 1024px (tablet/mobile breakpoint).
 * Used to gate GSAP pins and scroll-hijacking animations — anything below 1024px
 * gets simple on-enter reveals instead. Defaults to false on SSR.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
