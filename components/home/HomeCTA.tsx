import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function HomeCTA() {
  return (
    <section className="bg-black py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
          Ready to Start?
        </span>
        <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl lg:text-6xl text-white mt-4 mb-6 tracking-tight">
          Let&apos;s Talk About
          <br />
          Your Project.
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Whether you&apos;re planning an ADU, dealing with a structural issue, or
          need expert advice before committing — we&apos;re here to help. No
          pressure, no jargon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
          >
            Get a Free Estimate
          </Link>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors font-[var(--font-space-mono)]"
          >
            Call {SITE.phone}
          </a>
        </div>
        <p className="mt-8 text-xs text-gray-600 tracking-wider">
          Serving Torrance · Redondo Beach · Manhattan Beach · South Bay, CA ·
          License #{SITE.license}
        </p>
      </div>
    </section>
  );
}
