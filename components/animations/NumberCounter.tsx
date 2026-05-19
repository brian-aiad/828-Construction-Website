"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface NumberCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function NumberCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 1800,
  className = "",
}: NumberCounterProps) {
  const [count, setCount] = useState(target); // Start at final value — no blank flash
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;

    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reducedMotion) {
      return;
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    let current = 0;
    const step = target / (duration / 16);

    const frame = requestAnimationFrame(() => {
      setCount(0);
      timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        if (timer) clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
      }, 16);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearInterval(timer);
    };
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
