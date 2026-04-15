import Link from "next/link";
import { PROCESS_STEPS } from "@/lib/constants";

export default function ProcessPreview() {
  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-[var(--font-space-mono)] text-gray-400 tracking-widest uppercase">
              How We Work
            </span>
            <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl lg:text-5xl text-black mt-3 tracking-tight">
              The Process
            </h2>
          </div>
          <Link
            href="/process"
            className="text-xs font-bold tracking-widest uppercase text-black border-b-2 border-black pb-1 hover:border-gray-400 hover:text-gray-500 transition-colors self-start sm:self-auto"
          >
            Full Process →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="bg-white p-8 lg:p-10">
              <div className="font-[var(--font-space-mono)] text-5xl font-bold text-gray-100 mb-8">
                {step.number}
              </div>
              <h3 className="font-[var(--font-space-grotesk)] font-bold text-xl text-black mb-4">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
