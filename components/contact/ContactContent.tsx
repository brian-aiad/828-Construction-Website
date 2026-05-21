"use client";

import { type SyntheticEvent, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/contact/ContactForm";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import SectionMotionBackdrop from "@/components/system/SectionMotionBackdrop";
import { SERVICE_AREAS, SERVICES, SITE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=";

function imgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

const prepItems = [
  "Property address or city",
  "Project type and current stage",
  "Photos, drawings, or concerns",
  "Timeline and decision deadline",
];

const contactCards = [
  {
    label: "Call",
    value: SITE.phone,
    detail: "Best for urgent remediation, site access, and scheduling.",
    href: SITE.phoneHref,
  },
  {
    label: "Email",
    value: SITE.email,
    detail: "Useful when you already have photos, plans, or documents.",
    href: `mailto:${SITE.email}`,
  },
  {
    label: "Base",
    value: "Torrance, CA",
    detail: "Serving South Bay homeowners and select nearby projects.",
    href: `https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`,
  },
];

function useContactMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    try {
      ctxRef.current?.revert();
    } catch {}
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.innerWidth < 1024 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".contact-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 62%",
              scrub: 1.15,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".contact-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 58%",
              scrub: 1.2,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".contact-photo").forEach((el) => {
        const image = el.querySelector("img");
        gsap.fromTo(
          el,
          { clipPath: "inset(10% 0% 10% 0%)", autoAlpha: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            autoAlpha: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: 1.2 },
          }
        );
        if (image) {
          gsap.to(image, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.6 },
          });
        }
      });
    }, rootRef);

    ctxRef.current = ctx;
    return () => {
      ctxRef.current = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return rootRef;
}

function ContactCard({ item }: { item: (typeof contactCards)[number] }) {
  const external = item.href.startsWith("http");
  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="font-labels text-[9px] uppercase tracking-[0.2em] text-black/42">
          {item.label}
        </span>
        <span className="h-px w-8 bg-[var(--color-accent)]/55" />
      </div>
      <div className="mt-5">
        <p className="font-numbers text-xl font-bold text-black">{item.value}</p>
        <p className="mt-3 text-sm leading-6 text-black/52">{item.detail}</p>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-reveal block border border-black/10 bg-white/72 p-5 transition-colors hover:border-[var(--color-accent)]"
      >
        {content}
      </a>
    );
  }

  return (
    <a
      href={item.href}
      className="contact-reveal block border border-black/10 bg-white/72 p-5 transition-colors hover:border-[var(--color-accent)]"
    >
      {content}
    </a>
  );
}

function ContactMain() {
  return (
    <section className="relative overflow-hidden bg-[#f5f0e9] px-6 pb-16 pt-32 text-black lg:px-12 lg:pb-24 lg:pt-36">
      <DraftingMotionLayer intensity="quiet" variant="intro" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="order-1">
          <div className="contact-reveal">
            <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/42">
              Contact 828 Construction
            </span>
            <h1 className="mt-5 max-w-2xl font-editorial text-[clamp(3.1rem,7vw,7.2rem)] leading-[0.86]">
              Contact Joe.
            </h1>
            <p className="mt-7 max-w-md text-base leading-8 text-black/58">
              Call directly or send the project details. 828 will review the property, the scope, and the next practical step.
            </p>
          </div>

          <div className="contact-line mt-8 h-px origin-left bg-[var(--color-accent)]/55" />

          <div className="mt-6 hidden gap-3 lg:grid">
            {contactCards.map((item) => (
              <ContactCard key={item.label} item={item} />
            ))}
          </div>

          <div className="mt-8 hidden overflow-hidden border border-black/10 bg-black text-white lg:block">
            <div className="relative h-56">
              <Image
                src="/images/contact/map-detail.jpg"
                alt="Construction plans and review material for a project inquiry"
                fill
                priority
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 38vw"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onError={imgError}
                className="object-cover"
                style={{ filter: "contrast(1.04) saturate(0.95)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-labels text-[9px] uppercase tracking-[0.18em] text-white/52">
                Plans, photos, scope, timeline
              </span>
            </div>
          </div>
        </div>

        <div className="contact-reveal order-2 border border-white/10 bg-black p-5 shadow-[0_45px_110px_rgba(20,12,8,0.28)] sm:p-7 lg:p-10">
          <div className="mb-7 flex items-center justify-between gap-5 border-b border-white/10 pb-5">
            <div>
              <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/35">
                Project inquiry
              </span>
              <h2 className="mt-2 font-editorial text-3xl leading-none text-white">
                Start here.
              </h2>
            </div>
            <span className="hidden border border-white/12 px-3 py-2 font-labels text-[8px] uppercase tracking-[0.16em] text-white/38 sm:block">
              24hr response
            </span>
          </div>
          <ContactForm />
        </div>

        <div className="order-3 grid gap-3 sm:grid-cols-3 lg:hidden">
          {contactCards.map((item) => (
            <ContactCard key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPrep() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-14 text-white lg:px-12 lg:py-18">
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.16]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="contact-reveal grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
          <div>
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/38">
              Before you send it
            </span>
            <h2 className="mt-4 max-w-lg font-editorial text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] text-white">
              The details that make the first reply useful.
            </h2>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {prepItems.map((item, index) => (
              <div key={item} className="bg-black p-5">
                <span className="font-numbers text-2xl font-bold text-[var(--color-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-sm leading-6 text-white/54">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceAreaFooter() {
  return (
    <section className="relative overflow-hidden bg-[#f5f0e9] px-6 py-14 text-black lg:px-12 lg:py-18">
      <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.11]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="contact-reveal">
          <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/42">
            Focused service paths
          </span>
          <div className="mt-6 grid gap-3">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group grid gap-3 border border-black/10 bg-white/66 p-5 transition-colors hover:border-[var(--color-accent)] sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <h3 className="font-editorial text-3xl leading-none text-black">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">{service.short}</p>
                </div>
                <span className="font-labels text-[9px] uppercase tracking-[0.16em] text-black/38 transition-colors group-hover:text-[var(--color-accent)]">
                  Review
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="contact-reveal border border-black/10 bg-white/66 p-6 lg:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/42">
                Service area
              </span>
              <h2 className="mt-4 font-editorial text-[clamp(2.5rem,5vw,5.3rem)] leading-[0.9]">
                South Bay based.
              </h2>
            </div>
            <span className="hidden border border-black/12 px-3 py-2 font-labels text-[8px] uppercase tracking-[0.16em] text-black/38 sm:block">
              CA #{SITE.license}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {SERVICE_AREAS.slice(0, 10).map((area) => (
              <span key={area} className="border border-black/10 bg-[#f5f0e9] px-3 py-2 font-labels text-[8px] uppercase tracking-[0.16em] text-black/45">
                {area}
              </span>
            ))}
          </div>
          <div className="mt-8 border-t border-black/10 pt-6">
            <p className="text-sm leading-7 text-black/55">
              828 is selective about fit. If the project needs careful diagnosis, clear scope, and accountable field standards, start the conversation.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-6 inline-flex bg-black px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactContent() {
  const rootRef = useContactMotion();

  return (
    <div ref={rootRef} className="bg-[#f5f0e9]">
      <ContactMain />
      <ContactPrep />
      <ServiceAreaFooter />
    </div>
  );
}
