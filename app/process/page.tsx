import type { Metadata } from "next";
import Link from "next/link";
import { PROCESS_STEPS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Process - How 828 Construction Works",
  description:
    "Our structured, transparent process from consultation through completion. Learn how 828 Construction approaches every project in Torrance, CA.",
};

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            How We Work
          </span>
          <h1 className="font-[var(--font-space-grotesk)] font-bold text-5xl lg:text-7xl text-white mt-4 tracking-tight leading-none">
            The Process.
            <br />
            <span className="text-gray-600">No Surprises.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mt-8 leading-relaxed">
            Every project follows the same structured approach. Not because
            we&apos;re rigid — because we know what works.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-px bg-gray-100">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.number}
                className={`bg-white grid grid-cols-1 lg:grid-cols-3 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Number */}
                <div className="p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center">
                  <div className="font-[var(--font-space-mono)] text-8xl font-bold text-gray-100">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-2 p-12 lg:p-16">
                  <h2 className="font-[var(--font-space-grotesk)] font-bold text-3xl text-black mb-6 tracking-tight">
                    {step.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed text-lg mb-8">
                    {step.description}
                  </p>

                  {/* Additional detail per step */}
                  {index === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Understand your goals and constraints",
                        "Assess site conditions",
                        "Review existing documentation",
                        "Provide honest feasibility assessment",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="w-px h-4 bg-black flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {index === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Detailed scope of work",
                        "Material selection guidance",
                        "Timeline development",
                        "Budget planning",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="w-px h-4 bg-black flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {index === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Regular progress updates",
                        "Quality control checkpoints",
                        "Transparent communication",
                        "Problem-solving without passing blame",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="w-px h-4 bg-black flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {index === 3 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Complete walkthrough",
                        "Full project documentation",
                        "Warranty information",
                        "Post-project support",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="w-px h-4 bg-black flex-shrink-0 mt-1" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            Expectations
          </span>
          <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl text-white mt-4 mb-16 tracking-tight">
            What You Can Always Count On
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800">
            {[
              { title: "Transparency", body: "You'll know what's happening at every stage. No surprises." },
              { title: "Honesty", body: "If something changes, you'll hear it from us first — and we'll solve it together." },
              { title: "Quality", body: "We hold ourselves to the standard we'd apply to our own home." },
              { title: "Availability", body: "A real person answers. Not a call center." },
            ].map((item) => (
              <div key={item.title} className="bg-black p-10">
                <h3 className="font-[var(--font-space-grotesk)] font-bold text-lg text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[var(--font-space-grotesk)] font-bold text-3xl lg:text-4xl text-black mb-4 tracking-tight">
            Ready to Start Step 01?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            The first consultation is free. Let&apos;s understand your project
            together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors"
            >
              Request Consultation
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center border border-gray-300 text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-black transition-colors font-[var(--font-space-mono)]"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
