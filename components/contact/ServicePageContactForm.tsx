"use client";

import { useState, useRef } from "react";
import { SITE } from "@/lib/constants";

interface Props {
  serviceTitle: string;
}

type FormState = "idle" | "loading" | "success" | "error";

function CheckmarkSVG() {
  return (
    <svg viewBox="0 0 52 52" className="w-14 h-14 mx-auto" fill="none" aria-hidden="true">
      <circle
        cx="26" cy="26" r="23"
        stroke="#B87333" strokeWidth="2"
        strokeDasharray="145" strokeDashoffset="145"
        style={{ animation: "drawCircle 0.55s ease forwards" }}
      />
      <polyline
        points="14,26 23,35 38,18"
        stroke="#B87333" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="36" strokeDashoffset="36"
        style={{ animation: "drawCheck 0.4s ease forwards 0.45s" }}
      />
    </svg>
  );
}

export default function ServicePageContactForm({ serviceTitle }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const submittingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      address: (form.elements.namedItem("address") as HTMLInputElement).value.trim(),
      service: serviceTitle,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
    };

    submittingRef.current = true;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) throw new Error("Too many requests. Please try again shortly.");
        throw new Error(body.error || "Something went wrong");
      }
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      submittingRef.current = false;
    }
  }

  if (state === "success") {
    return (
      <div className="py-12 text-center flex flex-col items-center">
        <CheckmarkSVG />
        <h3
          className="font-display font-bold text-white mt-6 mb-3 tracking-tight"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
        >
          Message Received
        </h3>
        <p className="text-gray-400 leading-relaxed max-w-sm text-sm">
          Joe will review your {serviceTitle.toLowerCase()} inquiry and get back to you within 24 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border-b border-white/20 px-0 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#B87333] transition-colors duration-200";
  const labelClass =
    "block font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="Service inquiry form">
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
        <input name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label htmlFor="sp-name" className={labelClass}>
            Full Name <span className="text-[#B87333]">*</span>
          </label>
          <input
            id="sp-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="sp-phone" className={labelClass}>
            Phone <span className="text-[#B87333]">*</span>
          </label>
          <input
            id="sp-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            placeholder="(310) 555-0000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label htmlFor="sp-email" className={labelClass}>
            Email{" "}
            <span className="text-gray-600 normal-case tracking-normal">— optional</span>
          </label>
          <input
            id="sp-email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="sp-address" className={labelClass}>
            Project Address{" "}
            <span className="text-gray-600 normal-case tracking-normal">— optional</span>
          </label>
          <input
            id="sp-address"
            name="address"
            type="text"
            autoComplete="street-address"
            className={inputClass}
            placeholder="123 Main St, Torrance"
          />
        </div>
      </div>
      <div>
        <label htmlFor="sp-message" className={labelClass}>
          Project Description <span className="text-[#B87333]">*</span>
        </label>
        <textarea
          id="sp-message"
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Timeline, scope, and any specific concerns…"
        />
      </div>

      {state === "error" && (
        <div role="alert" className="border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {errorMsg || "Something went wrong. Please call us directly."}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full border border-[#B87333] text-white py-4 font-labels text-[10px] tracking-[0.22em] uppercase hover:bg-[#B87333] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
      >
        {state === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Sending…
          </>
        ) : (
          `Request ${serviceTitle} Consultation`
        )}
      </button>

      <p className="font-labels text-[9px] text-gray-500 tracking-[0.12em] text-center">
        We respond personally within 24 hours · Or call{" "}
        <a href={SITE.phoneHref} className="text-gray-400 hover:text-[#B87333] transition-colors">
          {SITE.phone}
        </a>
      </p>
    </form>
  );
}
