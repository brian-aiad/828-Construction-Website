"use client";

import { useState, useRef } from "react";
import { SERVICES, SITE } from "@/lib/constants";

type FormState = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "email" | "service" | "message", string>>;

function validate(data: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = "Full name required";
  if (!data.phone || !/^\+?[\d\s\-(). ]{7,}$/.test(data.phone)) errors.phone = "Valid phone number required";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address";
  if (!data.service) errors.service = "Please select a service";
  if (!data.message || data.message.trim().length < 20) errors.message = "Please describe your project (min 20 characters)";
  return errors;
}

function CheckmarkSVG() {
  return (
    <svg
      viewBox="0 0 52 52"
      className="w-16 h-16 mx-auto"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="26"
        cy="26"
        r="23"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeDasharray="145"
        strokeDashoffset="145"
        style={{ animation: "drawCircle 0.55s ease forwards" }}
      />
      <polyline
        points="14,26 23,35 38,18"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="36"
        strokeDashoffset="36"
        style={{ animation: "drawCheck 0.4s ease forwards 0.45s" }}
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin inline-block mr-2"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submittingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    const form = e.currentTarget;
    const data: Record<string, string> = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
    };

    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstField = form.querySelector<HTMLElement>("[aria-invalid='true']");
      firstField?.focus();
      return;
    }
    setFieldErrors({});

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
        if (res.status === 429) throw new Error("Too many requests. Please try again in a few minutes or call us directly.");
        if (body.errors) {
          setFieldErrors(body.errors);
          setState("idle");
          submittingRef.current = false;
          return;
        }
        throw new Error(body.error || "Something went wrong");
      }

      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please call us directly.");
    } finally {
      submittingRef.current = false;
    }
  }

  const inputBase = "w-full bg-transparent border text-white px-4 py-3.5 text-sm focus:outline-none transition-colors duration-[240ms] placeholder:text-white/25 focus:[border-color:var(--color-accent)]";
  const inputClass = (field: keyof FieldErrors) =>
    `${inputBase} ${fieldErrors[field] ? "border-red-400/60" : "border-white/20"}`;

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center min-h-[420px]">
        <CheckmarkSVG />
        <h3
          className="font-display font-bold text-white mt-8 mb-4 tracking-tight"
          style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}
        >
          Message Received
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Joe will review your details and respond within 24 hours. For urgent
          work, call{" "}
          <a
            href={SITE.phoneHref}
            className="text-[var(--color-accent)] hover:text-white transition-colors"
          >
            {SITE.phone}
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label="Contact form"
    >
      {/* Honeypot — traps bots, invisible to real users */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <input
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="cf-name"
            className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3"
          >
            Full Name <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={!!fieldErrors.name || undefined}
            aria-describedby={fieldErrors.name ? "cf-name-err" : undefined}
            className={inputClass("name")}
            placeholder="John Smith"
          />
          {fieldErrors.name && (
            <p
              id="cf-name-err"
              role="alert"
              className="mt-2 text-red-400 text-[10px] font-labels tracking-wide"
            >
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="cf-phone"
            className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3"
          >
            Phone <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            aria-invalid={!!fieldErrors.phone || undefined}
            aria-describedby={fieldErrors.phone ? "cf-phone-err" : undefined}
            className={inputClass("phone")}
            placeholder="(310) 555-0000"
          />
          {fieldErrors.phone && (
            <p
              id="cf-phone-err"
              role="alert"
              className="mt-2 text-red-400 text-[10px] font-labels tracking-wide"
            >
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="cf-email"
          className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3"
        >
          Email{" "}
          <span className="text-gray-600 normal-case tracking-normal font-body text-xs">
            — optional
          </span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!fieldErrors.email || undefined}
          aria-describedby={fieldErrors.email ? "cf-email-err" : undefined}
          className={inputClass("email")}
          placeholder="john@example.com"
        />
        {fieldErrors.email && (
          <p
            id="cf-email-err"
            role="alert"
            className="mt-2 text-red-400 text-[10px] font-labels tracking-wide"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cf-service"
          className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3"
        >
          Project Type <span className="text-[var(--color-accent)]">*</span>
        </label>
        <select
          id="cf-service"
          name="service"
          required
          aria-invalid={!!fieldErrors.service || undefined}
          aria-describedby={fieldErrors.service ? "cf-service-err" : undefined}
          className={`${inputClass("service")} bg-[#0a0a0a] cursor-pointer`}
        >
          <option value="" className="bg-[#0a0a0a]">
            Choose project type *
          </option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.title} className="bg-[#0a0a0a]">
              {s.title}
            </option>
          ))}
          <option value="Not sure" className="bg-[#0a0a0a]">
            Not sure yet
          </option>
        </select>
        {fieldErrors.service && (
          <p
            id="cf-service-err"
            role="alert"
            className="mt-2 text-red-400 text-[10px] font-labels tracking-wide"
          >
            {fieldErrors.service}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cf-message"
          className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3"
        >
          Project Description <span className="text-[var(--color-accent)]">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          aria-invalid={!!fieldErrors.message || undefined}
          aria-describedby={fieldErrors.message ? "cf-message-err" : undefined}
          className={`${inputClass("message")} resize-none`}
          placeholder="Location, scope, timeline, and any specific concerns…"
        />
        {fieldErrors.message && (
          <p
            id="cf-message-err"
            role="alert"
            className="mt-2 text-red-400 text-[10px] font-labels tracking-wide"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      {state === "error" && (
        <div
          role="alert"
          className="border border-red-400/40 bg-red-950/20 px-4 py-3 text-sm text-red-300"
        >
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-white text-black py-4 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed group flex items-center justify-center"
      >
        {state === "loading" ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-600 text-center font-labels tracking-wide">
        Typically respond within 24 hours · For urgent work, call{" "}
        <a
          href={SITE.phoneHref}
          className="text-gray-500 hover:text-[var(--color-accent)] transition-colors"
        >
          {SITE.phone}
        </a>
      </p>
    </form>
  );
}
