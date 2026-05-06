"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

interface Props {
  serviceTitle: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export default function ServicePageContactForm({ serviceTitle }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      service: serviceTitle,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "success") {
    return (
      <div className="py-10 text-center">
        <div
          className="font-numbers font-bold leading-none mb-4"
          style={{ fontSize: "3rem", color: "#B87333" }}
        >
          ✓
        </div>
        <h3
          className="font-display font-bold text-white mb-3"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
        >
          Message Received
        </h3>
        <p className="text-gray-400 leading-relaxed max-w-sm mx-auto text-sm">
          Joe will review your {serviceTitle.toLowerCase()} inquiry and get
          back to you within 24 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border-b border-white/20 px-0 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#B87333] transition-colors duration-200";
  const labelClass =
    "block font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label htmlFor="sp-name" className={labelClass}>
            Full Name *
          </label>
          <input
            id="sp-name"
            name="name"
            type="text"
            required
            className={inputClass}
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="sp-phone" className={labelClass}>
            Phone *
          </label>
          <input
            id="sp-phone"
            name="phone"
            type="tel"
            required
            className={inputClass}
            placeholder="(310) 555-0000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label htmlFor="sp-email" className={labelClass}>
            Email
          </label>
          <input
            id="sp-email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="sp-address" className={labelClass}>
            Project Address{" "}
            <span className="text-gray-600 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <input
            id="sp-address"
            name="address"
            type="text"
            className={inputClass}
            placeholder="123 Main St, Torrance"
          />
        </div>
      </div>
      <div>
        <label htmlFor="sp-message" className={labelClass}>
          Project Description *
        </label>
        <textarea
          id="sp-message"
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your project — timeline, scope, and any specific concerns..."
        />
      </div>

      {state === "error" && (
        <div className="border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {errorMsg || "Something went wrong. Please call us directly."}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full border border-[#B87333] text-white py-4 font-labels text-[10px] tracking-[0.22em] uppercase hover:bg-[#B87333] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "loading"
          ? "Sending..."
          : `Request ${serviceTitle} Consultation`}
      </button>

      <p className="font-labels text-[9px] text-gray-500 tracking-[0.12em] text-center">
        We respond personally within 24 hours. Or call{" "}
        <a
          href={SITE.phoneHref}
          className="text-gray-400 hover:text-[#B87333] transition-colors"
        >
          {SITE.phone}
        </a>
      </p>
    </form>
  );
}
