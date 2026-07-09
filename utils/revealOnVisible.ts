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
export function revealOnVisible(
  targets: Element[],
  reveal: (el: Element, index: number) => void,
  options?: IntersectionObserverInit
): () => void {
  const els = targets.filter(Boolean);
  if (els.length === 0) return () => {};
  if (typeof IntersectionObserver === "undefined") {
    els.forEach((el, i) => reveal(el, i));
    return () => {};
  }
  const indices = new Map(els.map((el, i) => [el, i] as const));
  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        obs.unobserve(entry.target);
        reveal(entry.target, indices.get(entry.target) ?? 0);
      }
    },
    options ?? { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
