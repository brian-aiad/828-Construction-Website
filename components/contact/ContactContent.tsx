"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/contact/ContactForm";
import ContactFlow from "@/components/contact/ContactFlow";
import { revealOnVisible } from "@/utils/revealOnVisible";
import { SERVICE_AREAS, SERVICES, SITE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

function imgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Joe's 01–04 list is frozen ("all this information stays, that's fine" — IMG_1125).
const prepItems = [
  "Property address or city",
  "Project type and current stage",
  "Photos, drawings, or concerns",
  "Timeline and decision deadline",
];

const inquiryRows = [
  {
    label: "Call",
    value: formatPhone(SITE.phone),
    href: SITE.phoneHref,
    detail: "Best for urgent remediation, site access, and scheduling.",
    numbers: true,
  },
  {
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    detail: "Useful when you already have photos, plans, or documents.",
    numbers: false,
  },
  {
    label: "Base",
    value: "Torrance, CA",
    href: `https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`,
    detail: "Serving South Bay homeowners and select nearby projects.",
    numbers: false,
  },
];

const SERVICE_PATH_ROWS = [
  { slug: "adu", image: "/images/projects/adu-exterior-new.jpg" },
  { slug: "remediation", image: "/images/projects/remediation-active.jpg" },
  { slug: "consulting", image: "/images/projects/consulting-plans.jpg" },
];

// Live-rect focus selection (services-index mechanic, PATTERNS.md Fix 22 timing
// rule): plain React state so it is sticky-proof and identical on mobile.
function useFocusIndex(
  refs: React.MutableRefObject<Array<HTMLElement | null>>,
  focusRatio = 0.52
) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const focus = window.innerHeight * focusRatio;
      let best = 0;
      let bestDist = Infinity;
      let contained = false;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (!contained && r.top <= focus && r.bottom >= focus) {
          best = i;
          contained = true;
          return;
        }
        if (contained) return;
        const dist = Math.abs(r.top + r.height / 2 - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [refs, focusRatio]);
  return active;
}

function useContactMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(
    () => () => {
      try {
        ctxRef.current?.revert();
      } catch {}
    },
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.innerWidth >= 1024;
    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // One-shot rises — IO-driven on every viewport (Fixes 15/22). Initial
      // states set here, never in JSX (Fix 14). Inside ContactFlow's sticky
      // stacked surfaces, scroll-math triggers go stale (Fix 25) — every
      // reveal below keys off actual visibility, never scroll position.
      const rises = gsap.utils.toArray<HTMLElement>(".ct-rise");
      if (!reduced) {
        rises.forEach((el) => gsap.set(el, { autoAlpha: 0, y: 26 }));
        revealCleanups.push(
          revealOnVisible(rises, (el) => {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
            });
          })
        );
      }

      // Hairline draws — decisive IO one-shots (scrub triggers would park
      // mid-draw once their surface pins; Fix 25).
      const lines = gsap.utils.toArray<HTMLElement>(".ct-line");
      if (!reduced) {
        lines.forEach((el) => gsap.set(el, { scaleX: 0.18 }));
        revealCleanups.push(
          revealOnVisible(lines, (el) => {
            gsap.to(el, { scaleX: 1, duration: 1.05, ease: "power3.inOut" });
          })
        );
      }

      if (desktop && !reduced) {
        // Row photo plates drift on a slower depth than the page. The paths
        // section is the flow's LAST surface (position relative, never pinned),
        // so these scrub triggers stay truthful.
        gsap.utils.toArray<HTMLElement>(".ct-plate img").forEach((img) => {
          gsap.to(img, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".ct-plate"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6,
            },
          });
        });
      }
    }, rootRef);

    ctxRef.current = ctx;
    return () => {
      revealCleanups.forEach((dispose) => dispose());
      ctxRef.current = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return rootRef;
}

// ── Section 01 — "Get in touch" photo band (Joe: NS grammar, verbiage frozen) ─
function ContactHero() {
  return (
    <section
      data-section="contact-hero"
      data-header-dark=""
      className="relative flex min-h-[88svh] flex-col justify-between overflow-hidden bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="absolute inset-0">
        <div className="ct-hero-img absolute inset-0 will-change-transform">
          <Image
            src="/images/contact/contact-hero.jpg"
            alt="Residential architecture detail at dusk"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            onError={imgError}
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(0.98)" }}
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-black/38"
          aria-hidden="true"
        />
      </div>

      {/* Off to the side (Joe, IMG_1123): the listening line rides the upper right. */}
      <div className="relative z-10 flex justify-end px-6 pt-28 lg:px-12 lg:pt-36">
        <p className="ct-rise max-w-xs text-right text-sm leading-7 text-white/82 sm:max-w-sm lg:text-[15px] lg:leading-8">
          Our journey begins with active listening, where each conversation
          begins the foundation of shaping your vision.
        </p>
      </div>

      <div className="relative z-10 px-6 pb-14 lg:px-12 lg:pb-20">
        <span className="font-labels text-[10px] uppercase tracking-[0.26em] text-white/62">
          Contact / 828 Construction
        </span>
        <h1 className="mt-5 max-w-3xl font-display font-normal leading-[1.04] tracking-[-0.01em] text-[clamp(2.2rem,4.5vw,4.6rem)]">
          Building lasting partnerships.
        </h1>
        <div className="ct-line mt-7 h-px w-full max-w-40 origin-left bg-[var(--color-accent)]" />
        <p className="mt-6 max-w-md text-sm leading-7 text-white/72">
          Forging exceptional partnership defined by artistry and enduring
          values
        </p>
      </div>
    </section>
  );
}

// ── Section 02 — all-black Get in touch band (Joe: "fatter, all contact info") ─
function GetInTouch() {
  return (
    <section
      data-section="contact-inquiry"
      data-header-dark=""
      className="relative overflow-hidden bg-black px-6 pb-20 pt-16 text-white lg:px-12 lg:pb-28 lg:pt-24"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-white/48">
              Project inquiry
            </span>
            <h2 className="mt-4 font-display font-normal leading-none tracking-[-0.01em] text-[clamp(2rem,3.6vw,3.4rem)]">
              Get in touch
            </h2>
          </div>
          <span className="border border-white/14 px-3 py-2 font-labels text-[9px] uppercase tracking-[0.16em] text-white/58">
            Typical response within 24 hours
          </span>
        </div>

        <div className="ct-line mt-10 h-px w-full origin-left bg-white/14" />

        <div className="mt-12 grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          {/* The application path — every way a project reaches Joe. */}
          <div>
            {inquiryRows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="ct-rise group block border-b border-white/10 py-7 first:border-t"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/46">
                    {row.label}
                  </span>
                  <span
                    className="h-px w-8 bg-[var(--color-accent)]/70 transition-all duration-300 group-hover:w-14"
                    aria-hidden="true"
                  />
                </div>
                <p
                  className={`mt-4 break-words leading-tight text-white transition-colors group-hover:text-[#d9c1bc] ${
                    row.numbers
                      ? "font-numbers text-[clamp(1.6rem,3vw,2.6rem)] font-bold"
                      : "font-display text-[clamp(1.15rem,2vw,1.7rem)] font-normal"
                  }`}
                >
                  {row.value}
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/56">
                  {row.detail}
                </p>
              </a>
            ))}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="border border-[var(--color-accent)]/60 px-4 py-2.5 font-labels text-[9px] uppercase tracking-[0.18em] text-white/72">
                CA License #{SITE.license}
              </span>
              <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/46">
                Est. 2004 / Torrance, CA
              </span>
            </div>
          </div>

          {/* Message form — visual form; backend remains on hold (CLAUDE.md). */}
          <div className="ct-rise border border-white/12 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-5 border-b border-white/10 pb-5">
              <div>
                <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/42">
                  Or send the details
                </span>
                <h3 className="mt-2 font-display text-2xl font-normal leading-none text-white">
                  Start here.
                </h3>
              </div>
              <span
                className="h-2 w-2 rounded-full bg-[var(--color-accent)]"
                aria-hidden="true"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 03 — critical elements (heading per IMG_1125, items frozen) ──────
function InsightsPrep() {
  return (
    <section
      data-section="contact-prep"
      data-header-light=""
      className="relative overflow-hidden bg-[#f7f7f3] px-6 pb-10 pt-16 text-[#141414] lg:px-12 lg:pb-12 lg:pt-24"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl">
        <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/54">
          Critical elements to include in your communication
        </span>
        <h2 className="ct-rise mt-5 max-w-3xl font-display font-normal leading-[1.12] tracking-[-0.01em] text-[clamp(1.6rem,2.9vw,2.9rem)]">
          Your insights help us provide solutions that are thoughtfully
          tailored to your needs
        </h2>

        <div className="ct-line mt-10 h-px w-full origin-left bg-black/12" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {prepItems.map((item, index) => (
            <div
              key={item}
              className="ct-rise border-b border-black/10 py-7 sm:border-b-0 sm:border-r sm:pr-6 sm:last:border-r-0 lg:py-9"
            >
              <span className="font-numbers text-xl font-bold text-[var(--color-accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 max-w-[16rem] text-sm leading-6 text-black/72 sm:pl-0">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 04 — service paths as full-bleed rows + shrunk South Bay row ─────
// Joe (IMG_1127): rows spread all the way across, illuminate on scroll with a
// picture illuminating alongside; the service-area box comes underneath, shrunk.
function ServicePathRows() {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const focusIdx = useFocusIndex(rowRefs, 0.55);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const activeIdx = hoverIdx ?? focusIdx;

  return (
    <section
      data-section="contact-paths"
      data-header-light=""
      className="relative overflow-hidden bg-[#f7f7f3] pb-20 pt-4 text-[#141414] lg:pb-28"
      style={{ overflowX: "clip" }}
    >
      <div className="px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/54">
            Focused service paths
          </span>
        </div>
      </div>

      <div className="mt-5">
        {SERVICE_PATH_ROWS.map((row, i) => {
          const service = SERVICES.find((s) => s.slug === row.slug)!;
          const active = activeIdx === i;
          return (
            <Link
              key={row.slug}
              href={`/services/${row.slug}`}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="group block border-t border-black/10 last:border-b"
              aria-current={active ? "true" : undefined}
            >
              <div className="mx-auto grid max-w-7xl items-center gap-x-10 gap-y-4 px-6 py-7 sm:grid-cols-[minmax(0,1fr)_9.5rem_auto] lg:px-12 lg:py-8">
                <div>
                  <h3
                    className={`font-display font-normal leading-none tracking-[-0.01em] text-[clamp(1.7rem,3.4vw,3.1rem)] transition-colors duration-500 ${
                      active ? "text-[#141414]" : "text-black/[0.46]"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-xl text-sm leading-6 transition-colors duration-500 ${
                      active ? "text-black/62" : "text-black/[0.46]"
                    }`}
                  >
                    {service.short}
                  </p>
                  <span
                    className={`mt-4 block h-px origin-left bg-[var(--color-accent)] transition-transform duration-700 ease-out ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                    style={{ width: "min(18rem, 60%)" }}
                    aria-hidden="true"
                  />
                </div>

                {/* The picture that illuminates with its row (desktop plate). */}
                <div
                  className="ct-plate relative hidden h-24 overflow-hidden sm:block lg:h-28"
                  aria-hidden="true"
                >
                  {/* Self-managed rest state: inactive plate holds opacity:0 +
                      clip inset by design. Opt out of LenisProvider's reveal
                      failsafe or it force-reveals the inactive plate after ~2.5s
                      in-viewport, lighting two photos at once (PATTERNS Fix 24). */}
                  <div
                    data-failsafe-exempt
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      clipPath: active
                        ? "inset(0% 0% 0% 0%)"
                        : "inset(0% 100% 0% 0%)",
                      opacity: active ? 1 : 0,
                    }}
                  >
                    <Image
                      src={row.image}
                      alt=""
                      fill
                      sizes="152px"
                      onError={imgError}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Mobile: the active row's photo expands beneath its title. */}
                <div
                  className="relative overflow-hidden transition-[height] duration-700 ease-out sm:hidden"
                  style={{ height: active ? "10rem" : "0rem" }}
                  aria-hidden="true"
                >
                  <Image
                    src={row.image}
                    alt=""
                    fill
                    sizes="100vw"
                    onError={imgError}
                    className="object-cover"
                  />
                </div>

                <span
                  className={`hidden font-labels text-[9px] uppercase tracking-[0.18em] transition-colors duration-500 sm:block ${
                    active ? "text-[var(--color-accent)]" : "text-black/[0.46]"
                  }`}
                >
                  Review →
                </span>
              </div>
            </Link>
          );
        })}

        {/* The shrunk fourth row — service area (verbiage per IMG_1127). */}
        <div
          ref={(el) => {
            rowRefs.current[SERVICE_PATH_ROWS.length] = el;
          }}
          className="border-b border-t border-black/10 bg-white/55"
        >
          <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-6 px-6 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-12">
            <div>
              <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-black/54">
                Service area
              </span>
              <h3 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,2.2rem)] font-normal leading-none">
                South Bay based.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-black/72">
                Whether improving your residence or addressing critical
                structural or system concerns, 828 Construction delivers expert
                diagnostic and tailored solutions with a commitment to
                excellence.
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-6 inline-flex bg-black px-6 py-3.5 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Call {formatPhone(SITE.phone)}
              </a>
            </div>
            <div className="lg:pt-7">
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.slice(0, 10).map((area) => (
                  <span
                    key={area}
                    className="border border-black/10 bg-[#f7f7f3] px-3 py-2 font-labels text-[8px] uppercase tracking-[0.16em] text-black/58"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-5 font-labels text-[9px] uppercase tracking-[0.18em] text-black/46">
                CA License #{SITE.license} / Est. 2004
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactContent() {
  const rootRef = useContactMotion();

  return (
    <div ref={rootRef} className="bg-[#f7f7f3]">
      <ContactFlow>
        <ContactHero />
        <GetInTouch />
        <InsightsPrep />
        <ServicePathRows />
      </ContactFlow>
    </div>
  );
}
