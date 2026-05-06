"use client";

import { useEffect, useState } from "react";

// Easter egg: clicking any tel: link on a page also copies the number
// to clipboard and shows a brief copper "Copied" toast notification.
// Progressive enhancement — does not prevent the tel: link from firing.

export default function PhoneCopyToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="tel:"]'
      );
      if (!target) return;

      const number = target.getAttribute("href")?.replace("tel:", "") ?? "";
      if (!number) return;

      navigator.clipboard?.writeText(number).then(() => {
        setVisible(true);
        clearTimeout(timer);
        timer = setTimeout(() => setVisible(false), 2200);
      });
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "12px"})`,
        zIndex: 9990,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        background: "#000",
        border: "1px solid rgba(184,115,51,0.5)",
        padding: "0.6rem 1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      {/* Copper dot */}
      <span
        aria-hidden="true"
        style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: "#B87333",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "9px",
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Copied to clipboard
      </span>
    </div>
  );
}
