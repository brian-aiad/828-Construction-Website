"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ease, viewport } from "@/lib/animations";

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
  up: { y: 48 },
  down: { y: -48 },
  left: { x: 48 },
  right: { x: -48 },
  none: {},
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  direction = "up",
  once = true,
}: FadeInProps) {
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
