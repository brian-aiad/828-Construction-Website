"use client";

import { useEffect } from "react";

export default function ScrollRestorationReset() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.history.scrollRestoration = "manual";
    } catch {}
    window.scrollTo(0, 0);
  }, []);

  return null;
}
