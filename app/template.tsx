'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Black curtain — drops from bottom of viewport, animates away on route enter */}
      <motion.div
        className="fixed inset-0 z-[100] bg-black pointer-events-none"
        style={{ originY: 1 }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        aria-hidden="true"
      />
      {/* Maroon hairline swipe — fires at peak of curtain */}
      <motion.div
        className="fixed top-1/2 left-0 right-0 z-[101] h-[1.5px] pointer-events-none"
        style={{ background: 'var(--color-accent)', originX: 0 }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1], delay: 0.15 }}
        aria-hidden="true"
      />
      {/* Page content fades up after curtain clears */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
