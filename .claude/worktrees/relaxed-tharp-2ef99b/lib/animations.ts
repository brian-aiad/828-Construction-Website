import { Variants } from "framer-motion";

// ── Easing ──────────────────────────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.87, 0, 0.13, 1] as const,
};

// ── Shared viewport config ────────────────────────────────────────────────
export const viewport = { once: true, margin: "-80px" };

// ── Fade in up ────────────────────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: ease.out },
  },
};

// ── Fade in from left ─────────────────────────────────────────────────────
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: ease.out },
  },
};

// ── Fade in from right ────────────────────────────────────────────────────
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: ease.out },
  },
};

// ── Stagger container ─────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// ── Stagger item ─────────────────────────────────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

// ── Clip reveal (line-by-line) ────────────────────────────────────────────
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: ease.out },
  },
};

// ── Scale in ─────────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: ease.out },
  },
};

// ── Hero entrance sequence ─────────────────────────────────────────────────
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.05,
    },
  },
};

export const heroLine: Variants = {
  hidden: { opacity: 0, y: 80, skewY: 2 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 1.0, ease: ease.out },
  },
};
