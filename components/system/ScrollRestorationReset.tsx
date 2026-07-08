"use client";

import { useEffect } from "react";

// Hard refreshes must land at the very top with no flash of mid-page
// content. The browser applies scroll restoration BEFORE React hydrates,
// so a useEffect reset paints one wrong frame first (a strip of the light
// section under the hero). The inline script below executes synchronously
// during HTML parse — before first paint — killing restoration at the
// source. The useEffect remains as a belt-and-suspenders second layer.
const RESET_SCRIPT =
  "try{history.scrollRestoration='manual'}catch(e){};window.scrollTo(0,0);";

export default function ScrollRestorationReset() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.history.scrollRestoration = "manual";
    } catch {}
    window.scrollTo(0, 0);
  }, []);

  return <script dangerouslySetInnerHTML={{ __html: RESET_SCRIPT }} />;
}
