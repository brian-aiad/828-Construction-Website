// Sticky-proof one-shot reveals (PATTERNS.md Fix 22).
//
// ScrollTrigger computes trigger starts as document offsets at refresh time.
// Inside the EditorialFlow sticky stack — or after a route transition — those
// offsets go stale, and a `once: true` trigger whose start is never "reached"
// silently leaves its target hidden (yPercent 110 / opacity 0) forever.
//
// IntersectionObserver reads actual on-screen visibility, so it cannot go
// stale: if the element is on screen, it reveals. Use this for EVERY
// once-only entrance reveal on elements that live inside a sticky/stacked
// surface or on any page reachable by client-side navigation. Keep
// ScrollTrigger for scrubbed animations only.
import { gsap } from "gsap";

export function revealOnVisible(
  targets: Element[],
  reveal: (el: Element, index: number, immediate: boolean) => void,
  options?: IntersectionObserverInit
): () => void {
  const els = targets.filter(Boolean);
  if (els.length === 0) return () => {};
  if (typeof IntersectionObserver === "undefined") {
    els.forEach((el, i) => reveal(el, i, false));
    return () => {};
  }
  const indices = new Map(els.map((el, i) => [el, i] as const));
  const revealed = new Set<Element>();
  const entranceAnimations = new Set<gsap.core.Animation>();
  let windowStartedAt = performance.now();
  let windowStartedY = window.scrollY;
  let lastEventY = window.scrollY;
  let jumpUntil = 0;

  const noteScrollVelocity = () => {
    const now = performance.now();
    const currentY = window.scrollY;
    const directJump = Math.abs(currentY - lastEventY) > window.innerHeight * 0.55;
    lastEventY = currentY;
    if (now - windowStartedAt > 240) {
      windowStartedAt = now;
      windowStartedY = currentY;
    }
    if (
      directJump ||
      Math.abs(currentY - windowStartedY) > window.innerHeight * 0.65
    ) {
      jumpUntil = now + 360;
      entranceAnimations.forEach((animation) => {
        if (animation.totalProgress() < 1) animation.totalProgress(1);
        if (animation.totalProgress() >= 1) entranceAnimations.delete(animation);
      });
    }
  };
  window.addEventListener("scroll", noteScrollVelocity, { passive: true });

  let io: IntersectionObserver | null = null;
  const revealEntry = (el: Element, index: number, forceImmediate = false) => {
    if (revealed.has(el)) return;
    revealed.add(el);
    io?.unobserve(el);
    const immediate = forceImmediate || performance.now() < jumpUntil;
    const before = new Set(gsap.globalTimeline.getChildren(true, true, true));
    reveal(el, index, immediate);
    gsap.globalTimeline.getChildren(true, true, true).forEach((animation) => {
      if (before.has(animation)) return;
      if (immediate) animation.totalProgress(1);
      else entranceAnimations.add(animation);
    });
  };
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealEntry(entry.target, indices.get(entry.target) ?? 0);
      }
    },
    options ?? { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );
  els.forEach((el) => io.observe(el));

  let frame = 0;
  let previousY = window.scrollY;
  const inspect = () => {
    frame = 0;
    const currentY = window.scrollY;
    const movingDown = currentY >= previousY;
    previousY = currentY;
    els.forEach((el, index) => {
      if (revealed.has(el)) return;
      const rect = el.getBoundingClientRect();
      const inBand = rect.top <= window.innerHeight * 0.92 && rect.bottom >= window.innerHeight * 0.04;
      if (inBand) revealEntry(el, index);
      else if (movingDown && rect.bottom < window.innerHeight * 0.04) {
        revealEntry(el, index, true);
      }
    });
  };
  const scheduleInspect = () => {
    if (!frame) frame = requestAnimationFrame(inspect);
  };
  const onScroll = () => {
    noteScrollVelocity();
    scheduleInspect();
  };
  window.removeEventListener("scroll", noteScrollVelocity);
  window.addEventListener("scroll", onScroll, { passive: true });
  const probeTimers = [120, 420, 900].map((delay) => window.setTimeout(scheduleInspect, delay));

  return () => {
    if (frame) cancelAnimationFrame(frame);
    probeTimers.forEach(clearTimeout);
    io?.disconnect();
    window.removeEventListener("scroll", onScroll);
    entranceAnimations.clear();
  };
}
