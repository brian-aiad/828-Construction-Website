import Link from "next/link";
import { SERVICES } from "@/lib/constants";

export default function ServicesPreview() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-[var(--font-space-mono)] text-gray-400 tracking-widest uppercase">
              What We Do
            </span>
            <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl lg:text-5xl text-black mt-3 tracking-tight">
              Three Services.
              <br />
              One Standard.
            </h2>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold tracking-widest uppercase text-black border-b-2 border-black pb-1 hover:border-gray-400 hover:text-gray-500 transition-colors self-start sm:self-auto"
          >
            All Services →
          </Link>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {SERVICES.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white p-10 lg:p-12 flex flex-col hover:bg-black transition-colors duration-300"
            >
              <div className="font-[var(--font-space-mono)] text-4xl font-bold text-gray-100 group-hover:text-gray-800 transition-colors mb-8">
                0{index + 1}
              </div>
              <h3 className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black group-hover:text-white transition-colors mb-4">
                {service.title}
              </h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-400 tracking-widest uppercase mb-6">
                {service.short}
              </p>
              <p className="text-sm text-gray-600 group-hover:text-gray-300 leading-relaxed flex-1">
                {service.description}
              </p>
              <div className="mt-8 text-xs font-bold tracking-widest uppercase text-black group-hover:text-white transition-colors border-b border-black group-hover:border-white pb-1 self-start">
                Learn More →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
