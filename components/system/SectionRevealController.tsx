"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

type RevealDirection = "left" | "right" | "up";

type RevealUnit = {
  trigger: HTMLElement;
  targets: HTMLElement[];
  direction: RevealDirection;
  delay: number;
  stagger: number;
  revealed: boolean;
};

const SELECTOR = "[data-motion-reveal]";

function numberFromDataset(value: string | undefined, fallback = 0) {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function directionFromDataset(value: string | undefined): RevealDirection {
  if (value === "left" || value === "right") return value;
  return "up";
}

export default function SectionRevealController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (!roots.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const distance = window.innerWidth < 768 ? 24 : window.innerWidth < 1280 ? 30 : 40;
    const duration = window.innerWidth < 768 ? 0.72 : 0.82;
    const units: RevealUnit[] = roots.map((trigger) => {
      const stagger = numberFromDataset(trigger.dataset.motionStagger);
      const children = stagger > 0
        ? Array.from(trigger.children).filter(
            (child): child is HTMLElement =>
              child instanceof HTMLElement && !child.hasAttribute("data-motion-static")
          )
        : [];

      return {
        trigger,
        targets: children.length ? children : [trigger],
        direction: directionFromDataset(trigger.dataset.motionReveal),
        delay: numberFromDataset(trigger.dataset.motionDelay),
        stagger,
        revealed: false,
      };
    });

    const allTargets = units.flatMap((unit) => unit.targets);
    const activeTweens = new Set<gsap.core.Tween>();
    const ctx = gsap.context(() => {
      if (reducedMotion.matches) {
        gsap.set(allTargets, { opacity: 1, x: 0, y: 0, clearProps: "willChange" });
        units.forEach((unit) => {
          unit.revealed = true;
          unit.trigger.setAttribute("data-motion-revealed", "true");
        });
        return;
      }

      units.forEach((unit) => {
        const from =
          unit.direction === "left"
            ? { x: -distance, y: 0 }
            : unit.direction === "right"
              ? { x: distance, y: 0 }
              : { x: 0, y: distance };
        gsap.set(unit.targets, {
          opacity: 0,
          ...from,
          willChange: "transform, opacity",
          force3D: true,
        });
      });
    }, document.body);

    const reveal = (unit: RevealUnit, immediate = false) => {
      if (unit.revealed) return;
      unit.revealed = true;
      unit.trigger.setAttribute("data-motion-revealed", "true");

      if (immediate || reducedMotion.matches) {
        gsap.set(unit.targets, {
          opacity: 1,
          x: 0,
          y: 0,
          clearProps: "transform,opacity,willChange",
        });
        return;
      }

      const tween = gsap.to(unit.targets, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay: unit.delay,
        stagger: unit.stagger,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => {
          activeTweens.delete(tween);
          gsap.set(unit.targets, { clearProps: "transform,opacity,willChange" });
        },
      });
      activeTweens.add(tween);
    };

    const viewportBand = (unit: RevealUnit) => {
      const rect = unit.trigger.getBoundingClientRect();
      const topEdge = window.innerHeight * 0.9;
      const bottomEdge = window.innerHeight * 0.08;
      return {
        inBand: rect.top <= topEdge && rect.bottom >= bottomEdge,
        passed: rect.bottom < bottomEdge,
      };
    };

    units.forEach((unit) => {
      const state = viewportBand(unit);
      if (state.passed) reveal(unit, true);
      else if (state.inBand) reveal(unit);
    });

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const unit = units.find((candidate) => candidate.trigger === entry.target);
              if (!unit) return;
              reveal(unit);
              observer?.unobserve(unit.trigger);
            });
          },
          { threshold: 0.04, rootMargin: "0px 0px -9% 0px" }
        );

    units.forEach((unit) => {
      if (!unit.revealed) observer?.observe(unit.trigger);
    });

    let frame = 0;
    let lastScrollY = window.scrollY;
    const inspect = () => {
      frame = 0;
      const movingDown = window.scrollY >= lastScrollY;
      lastScrollY = window.scrollY;
      units.forEach((unit) => {
        if (unit.revealed) return;
        const state = viewportBand(unit);
        if (state.inBand) reveal(unit);
        else if (movingDown && state.passed) reveal(unit, true);
      });
    };
    const scheduleInspect = () => {
      if (!frame) frame = requestAnimationFrame(inspect);
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(SELECTOR)
        : null;
      const unit = target
        ? units.find((candidate) => candidate.trigger === target)
        : undefined;
      if (unit) reveal(unit, true);
    };
    const finishForReducedMotion = () => {
      if (!reducedMotion.matches) return;
      units.forEach((unit) => reveal(unit, true));
    };

    window.addEventListener("scroll", scheduleInspect, { passive: true });
    window.addEventListener("resize", scheduleInspect, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    reducedMotion.addEventListener("change", finishForReducedMotion);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleInspect);
      window.removeEventListener("resize", scheduleInspect);
      document.removeEventListener("focusin", onFocusIn);
      reducedMotion.removeEventListener("change", finishForReducedMotion);
      units.forEach((unit) => unit.trigger.removeAttribute("data-motion-revealed"));
      activeTweens.forEach((tween) => tween.kill());
      gsap.set(allTargets, { clearProps: "transform,opacity,willChange" });
      try {
        ctx.revert();
      } catch {}
    };
  }, [pathname]);

  return null;
}
