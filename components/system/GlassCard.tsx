import { ReactNode } from 'react';

type Tone = 'dark' | 'light';

export default function GlassCard({
  children,
  tone = 'dark',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const base = tone === 'dark'
    ? 'bg-black/30 border-white/10'
    : 'bg-white/60 border-black/10';

  return (
    <div
      className={`relative overflow-hidden border backdrop-blur-xl ${base} ${className}`}
      style={{
        boxShadow:
          '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 64px -24px rgba(0,0,0,0.5)',
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          opacity: 0.5,
        }}
      />
      {children}
    </div>
  );
}
