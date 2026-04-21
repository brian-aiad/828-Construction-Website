"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport width is < 768px (mobile breakpoint).
 * Defaults to false on SSR so hydration is consistent.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
