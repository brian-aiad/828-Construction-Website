// The final desktop surface stays pinned while this wrapper rises above it.
// Mobile/tablet keep the footer in natural flow via the shared runway rules.

export default function FooterRevealWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // data-footer-surface: the footer is the site-wide LAST stacked surface —
  // flows pin their final section under it, the settle snaps its junction,
  // and z-50 lifts it above every flow's pinned surfaces (flows sit at z-10).
  return (
    <div
      data-footer-surface=""
      className="relative z-50 bg-black shadow-[0_-30px_90px_-48px_rgba(0,0,0,0.96)]"
    >
      {children}
    </div>
  );
}
