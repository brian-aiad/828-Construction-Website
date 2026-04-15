import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact - Get a Free Estimate",
  description:
    "Contact 828 Construction for a free estimate on ADU construction, remediation, or consulting in Torrance and South Bay, CA. Call 213-828-2388.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            Get in Touch
          </span>
          <h1 className="font-[var(--font-space-grotesk)] font-bold text-5xl lg:text-7xl text-white mt-4 tracking-tight leading-none">
            Let&apos;s Talk About
            <br />
            <span className="text-gray-600">Your Project.</span>
          </h1>
        </div>
      </section>

      {/* Contact content */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: info */}
            <div>
              <p className="text-gray-600 leading-relaxed mb-12 text-lg">
                The estimate is free. The conversation is easy. Whether you know
                exactly what you need or you&apos;re still figuring it out — reach
                out and we&apos;ll figure it out together.
              </p>

              <div className="space-y-8 mb-12">
                <div className="border-b border-gray-100 pb-8">
                  <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-3">
                    Phone
                  </div>
                  <a
                    href={SITE.phoneHref}
                    className="text-2xl font-[var(--font-space-mono)] text-black hover:text-gray-600 transition-colors"
                  >
                    {SITE.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Call or text. We respond.
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-8">
                  <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-3">
                    Email
                  </div>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-lg text-black hover:text-gray-600 transition-colors"
                  >
                    {SITE.email}
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Typically respond within 24 hours.
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-8">
                  <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-3">
                    Address
                  </div>
                  <address className="not-italic text-black leading-relaxed">
                    {SITE.address.street}
                    <br />
                    {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                  </address>
                </div>

                <div>
                  <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-3">
                    Service Area
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SITE.serviceArea.map((city) => (
                      <span
                        key={city}
                        className="text-xs text-gray-600 border border-gray-200 px-3 py-1"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* License badge */}
              <div className="bg-black text-white p-6 inline-block">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-2">
                  CA Contractor License
                </div>
                <div className="font-[var(--font-space-mono)] text-xl text-white">
                  #{SITE.license}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
