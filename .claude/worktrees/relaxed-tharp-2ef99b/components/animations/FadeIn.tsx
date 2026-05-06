"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { ease } from "@/lib/animations";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: Direction;
  once?: boolean;
}

const directionOffset: Record<Direction, object> = {
  up:    { y: 48 },
  down:  { y: -48 },
  left:  { x: 48 },
  right: { x: -48 },
  none:  {},
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  direction = "up",
  once = true,
}: FadeInProps) {
  // Assume animations are enabled until the effect says otherwise.
  // This means desktop always starts with animation; mobile removes it after hydration.
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reducedMotion) setAnimate(false);
  }, []);

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: ease.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
