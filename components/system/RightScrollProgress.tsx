'use client';
import { useEffect, useState } from 'react';

export default function RightScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-0 z-[9999] h-screen w-[2px]"
    >
      <div
        className="origin-top"
        style={{
          height: '100%',
          background: 'var(--color-accent)',
          transform: `scaleY(${progress / 100})`,
          transition: 'transform 100ms linear',
        }}
      />
    </div>
  );
}
