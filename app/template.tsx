'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const [isNavigation, setIsNavigation] = useState(false);

  // On first mount in a session: no curtain (LCP-safe).
  // On subsequent mounts (route transitions): show curtain.
  useEffect(() => {
    if (sessionStorage.getItem('_tpl')) {
      setIsNavigation(true);
    }
    sessionStorage.setItem('_tpl', '1');
  }, []);

  return (
    <>
      {isNavigation && (
        <>
          {/* Black curtain — only on route transitions, NOT on initial page load */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black pointer-events-none"
            style={{ originY: 1 }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
            aria-hidden="true"
          />
          {/* Maroon hairline swipe */}
          <motion.div
            className="fixed top-1/2 left-0 right-0 z-[101] h-[1.5px] pointer-events-none"
            style={{ background: 'var(--color-accent)', originX: 0 }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 0.4, ease: [0.83, 0, 0.17, 1], delay: 0.1 }}
            aria-hidden="true"
          />
        </>
      )}
      {/* Children render directly — no opacity wrapper that delays LCP */}
      {children}
    </>
  );
}
