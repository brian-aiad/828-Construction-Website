"use client";

import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import PrecisionOverlay from "@/components/shared/PrecisionOverlay";
import { SERVICES, SITE } from "@/lib/constants";

const includeItems = [
  "Project type: ADU, remediation, consulting, or not sure yet",
  "Property location and current project stage",
  "Timeline, urgency, budget range, or deadline",
  "Main concern, goal, or condition you want reviewed",
];

const actionBlocks = [
  {
    num: "01",
    title: "Schedule consultation",
    body: "Start with a direct call so 828 can listen, clarify the scope, and identify the next right step.",
    href: SITE.phoneHref,
  },
  {
    num: "02",
    title: "Services",
    body: "Review the three focused paths: ADU construction, remediation, and consulting.",
    href: "/services",
  },
  {
    num: "03",
    title: "Serving South Bay",
    body: "Based in Torrance with South Bay roots, and available for the right projects beyond the area.",
    href: `https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`,
  },
];

function ContactHero() {
  return (
    <section data-section="contact-hero" className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.58fr_0.42fr]">
        <div className="relative min-h-[54vh] lg:min-h-screen">
          <Image
            src="/images/contact/contact-hero.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
            style={{ filter: "contrast(1.08) saturate(0.92)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/70" />
          <PrecisionOverlay tone="dark" opacity={0.18} className="hidden lg:block" />
        </div>

        <div className="relative flex items-end border-l border-white/10 px-6 pb-16 pt-32 lg:px-12 lg:pb-24">
          <div>
            <div className="mb-8 h-px w-20 bg-[var(--color-accent)]" />
            <p className="mb-5 font-labels text-[10px] uppercase tracking-[0.24em] text-white/42">
              Get in touch
            </p>
            <h1 className="max-w-2xl font-display text-[clamp(3rem,7vw,7.6rem)] font-bold leading-[0.88] tracking-tight">
              Our first step is listening.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/58">
              One conversation begins the foundation of building your vision.
              828 creates lasting partnerships defined by artistry, clarity,
              and enduring residential value.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-9 inline-flex min-h-12 items-center gap-4 border border-white/15 px-5 py-3 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--color-accent)]"
            >
              Book call
              <span className="font-numbers text-white/48">{SITE.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFormSection() {
  return (
    <section data-section="contact-main" className="relative overflow-hidden bg-black py-20 text-white lg:py-32">
      <PrecisionOverlay tone="dark" opacity={0.13} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 h-px w-full bg-gradient-to-r from-[var(--color-accent)] via-white/10 to-transparent" />
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="mb-5 font-labels text-[10px] uppercase tracking-[0.24em] text-white/38">
              Get in touch
            </p>
            <h2 className="max-w-xl font-display text-[clamp(2.6rem,5.4vw,5.8rem)] font-bold leading-[0.9] tracking-tight">
              Essential components to highlight in your message.
            </h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-white/54">
              The more specific the message, the faster 828 can respond with a
              grounded next step. Keep it simple, but include the conditions
              that shape the project.
            </p>

            <div className="mt-10 border-y border-white/10">
              {includeItems.map((item, index) => (
                <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5 last:border-b-0">
                  <span className="font-numbers text-2xl font-bold text-white/16">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-white/55">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="mb-4 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35">
                Available services
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {SERVICES.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="border border-white/10 px-4 py-3 font-labels text-[9px] uppercase tracking-[0.14em] text-white/48 transition-colors hover:border-[var(--color-accent)] hover:text-white"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-[#090909]/92 p-6 shadow-[0_50px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:p-10">
            <p className="mb-8 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35">
              Project inquiry
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactVisionSplit() {
  return (
    <section data-section="contact-vision" className="grid min-h-[80vh] bg-[#f4f2ef] lg:grid-cols-2">
      <div className="relative flex items-center border-b border-black/10 px-6 py-20 lg:border-b-0 lg:border-r lg:px-12">
        <PrecisionOverlay tone="light" opacity={0.16} />
        <div className="relative z-10">
          <p className="mb-5 font-labels text-[10px] uppercase tracking-[0.24em] text-black/45">
            Build your vision
          </p>
          <h2 className="max-w-xl font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-tight text-black">
            Dedicated to your dream.
          </h2>
        </div>
      </div>
      <div className="relative min-h-[60vh] overflow-hidden">
        <Image
          src="/images/contact/map-detail.jpg"
          alt="828 Construction planning detail"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          style={{ filter: "contrast(1.05) saturate(0.9)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-transparent" />
      </div>
    </section>
  );
}

function ContactActionBlocks() {
  return (
    <section data-section="contact-actions" className="bg-black text-white">
      <div className="grid border-y border-white/10 lg:grid-cols-3">
        {actionBlocks.map((item) => {
          const external = item.href.startsWith("http");
          const className =
            "group flex min-h-[18rem] flex-col justify-between border-b border-white/10 p-7 transition-colors hover:bg-white/[0.035] lg:border-b-0 lg:border-r lg:p-10";
          const content = (
            <>
              <span className="font-numbers text-4xl font-bold text-[var(--color-accent)]">
                {item.num}
              </span>
              <div>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-white/45">
                  {item.body}
                </p>
              </div>
            </>
          );
          return external ? (
            <a key={item.num} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          ) : (
            <Link key={item.num} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
      <div className="overflow-hidden py-5">
        <div
          className="flex w-max gap-10 whitespace-nowrap font-display text-[clamp(3rem,9vw,9rem)] font-bold uppercase leading-none text-white/[0.05]"
          style={{ animation: "marqueeScroll 42s linear infinite" }}
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>828 Construction</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContactContent() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <ContactVisionSplit />
      <ContactActionBlocks />
    </>
  );
}
