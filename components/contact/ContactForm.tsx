"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/constants";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
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
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
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
      <div className="border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black mb-4">
          Message Received
        </h3>
        <p className="text-gray-500 leading-relaxed">
          Thank you for reaching out. We&apos;ll review your project details and get
          back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-bold tracking-widest uppercase text-gray-600 mb-2"
          >
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold tracking-widest uppercase text-gray-600 mb-2"
          >
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="(310) 555-0000"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold tracking-widest uppercase text-gray-600 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="service"
          className="block text-xs font-bold tracking-widest uppercase text-gray-600 mb-2"
        >
          Service Needed *
        </label>
        <select
          id="service"
          name="service"
          required
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
        >
          <option value="">Select a service...</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Not sure">Not sure yet</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-bold tracking-widest uppercase text-gray-600 mb-2"
        >
          Project Description *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Tell us about your project — location, scope, timeline, and any specific concerns..."
        />
      </div>

      {state === "error" && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg || "Something went wrong. Please call us directly."}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        We typically respond within 24 hours. For immediate assistance, call{" "}
        <a href="tel:+12138282388" className="underline">
          213-828-2388
        </a>
        .
      </p>
    </form>
  );
}
