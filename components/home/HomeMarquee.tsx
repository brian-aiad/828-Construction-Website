// Second homepage marquee — reversed direction, slower pace.
// Sits at the base of the homepage content, above the footer.
// Copper pill separators complement the existing ServicesPreview marquee.

const ITEMS = [
  "ADU Specialists",
  "South Bay",
  "25+ Years",
  "Torrance CA",
  "CA License #1141119",
  "Building Science First",
  "Remediation",
  "Free Consultation",
  "Est. 2025",
  "Structural Integrity",
];

function Pill() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "#B87333",
        opacity: 0.55,
        flexShrink: 0,
      }}
    />
  );
}

export default function HomeMarquee() {
  const track = (
    <div className="flex items-center gap-8 whitespace-nowrap px-4">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="font-labels text-[9px] text-white/30 tracking-[0.28em] uppercase">
            {item}
          </span>
          <Pill />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="hidden lg:block bg-[#0a0a0a] overflow-hidden py-3.5 border-t border-white/[0.04]"
      aria-hidden="true"
    >
      <div
        data-ambient-motion=""
        className="flex"
        style={{
          // reversed direction via animation: marqueeScroll with direction reverse
          animation: "marqueeScroll 60s linear infinite reverse",
          width: "max-content",
        }}
      >
        {/* Doubled for seamless loop */}
        {track}
        {track}
      </div>
    </div>
  );
}
