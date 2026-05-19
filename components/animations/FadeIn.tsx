"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
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
  up:    { y: 32 },
  down:  { y: -32 },
  left:  { x: 32 },
  right: { x: -32 },
  none:  {},
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.72,
  className = "",
  direction = "up",
  once = true,
}: FadeInProps) {
  const [animate] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 768 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

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
