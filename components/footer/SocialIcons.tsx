export const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "#", // TODO: replace with Joe's actual LinkedIn URL when ready.
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.5 18v-8H6v8h2.5zM7.25 8.8a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9zM18 18v-4.4c0-2.3-1.25-3.35-2.9-3.35-1.35 0-1.95.75-2.3 1.25v-1.05H10.3c.03.7 0 8.55 0 8.55h2.5v-4.8c0-.2.02-.45.1-.6.2-.45.6-.9 1.3-.9.9 0 1.3.7 1.3 1.7V18H18z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#", // TODO: replace with Joe's actual Facebook URL when ready.
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.9h-2.33v6.98C18.34 21.13 22 17 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#", // TODO: replace with Joe's actual Instagram URL when ready.
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.36.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.79-.47 2.43-.26.66-.6 1.22-1.15 1.77-.55.55-1.11.89-1.77 1.15-.64.25-1.36.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.5.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.31.88-.35 1.86C3.81 9.01 3.8 9.33 3.8 12s.01 2.99.06 4.04c.04.98.21 1.5.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.88.31 1.86.35 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.5-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.31-.88.35-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.21-1.5-.35-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.88-.31-1.86-.35C14.99 3.81 14.67 3.8 12 3.8zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68zm5.34-3.04a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
      </svg>
    ),
  },
];

export const ACTIVE_SOCIAL_LINKS = SOCIAL_LINKS.filter(
  (social) => social.href !== "#"
);

export default function SocialIcons() {
  return (
    <ul className="flex flex-row gap-3 md:flex-col md:gap-4">
      {ACTIVE_SOCIAL_LINKS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            aria-label={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
          >
            <span className="flex h-11 w-11 items-center justify-center border border-white/15 transition-colors duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/10 md:h-9 md:w-9">
              <span className="block h-4 w-4">{social.icon}</span>
            </span>
            <span className="hidden font-labels text-[10px] uppercase tracking-[0.18em] md:inline">
              {social.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
