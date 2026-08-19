export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] bg-[url('/images/system/grain-828.png')] bg-repeat opacity-[0.045] mix-blend-overlay"
    />
  );
}
