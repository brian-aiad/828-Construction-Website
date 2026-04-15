import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Projects - Our Work in Torrance & South Bay",
  description:
    "See 828 Construction's work — ADU builds, structural remediation, and consulting projects across Torrance and South Bay, CA.",
};

const projects = [
  {
    id: 1,
    title: "Torrance ADU Build",
    category: "ADU Construction",
    location: "Torrance, CA",
    size: "480 sq ft",
    description:
      "Detached ADU designed for long-term rental income. Full permit package, foundation, framing, MEP, and finish work.",
    bg: "bg-gray-200",
  },
  {
    id: 2,
    title: "Redondo Beach Water Intrusion",
    category: "Remediation",
    location: "Redondo Beach, CA",
    size: "2,400 sq ft",
    description:
      "Comprehensive remediation after chronic water intrusion compromised structural framing. Root cause identified and corrected.",
    bg: "bg-gray-300",
  },
  {
    id: 3,
    title: "South Bay Pre-Purchase Consultation",
    category: "Consulting",
    location: "Manhattan Beach, CA",
    size: "N/A",
    description:
      "Pre-purchase feasibility analysis and contractor vetting for a $1.2M investment property. Client avoided costly hidden defects.",
    bg: "bg-gray-400",
  },
  {
    id: 4,
    title: "Garage Conversion ADU",
    category: "ADU Construction",
    location: "Lomita, CA",
    size: "380 sq ft",
    description:
      "Attached ADU from existing garage. Full permit expediting, structural engineering coordination, and complete interior build-out.",
    bg: "bg-gray-200",
  },
  {
    id: 5,
    title: "Foundation Remediation",
    category: "Remediation",
    location: "Carson, CA",
    size: "1,800 sq ft",
    description:
      "Post-earthquake foundation assessment and remediation. Structural reinforcement and concrete repair.",
    bg: "bg-gray-300",
  },
  {
    id: 6,
    title: "Construction Defect Review",
    category: "Consulting",
    location: "Hermosa Beach, CA",
    size: "N/A",
    description:
      "Expert witness review and report for construction defect litigation. Identified 14 code violations in new construction.",
    bg: "bg-gray-400",
  },
];

const categories = ["All", "ADU Construction", "Remediation", "Consulting"];

export default function ProjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            Our Work
          </span>
          <h1 className="font-[var(--font-space-grotesk)] font-bold text-5xl lg:text-7xl text-white mt-4 tracking-tight leading-none">
            Projects.
            <br />
            <span className="text-gray-600">Real Work. Real Results.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mt-8 leading-relaxed">
            Every project below represents a real problem solved — not just
            aesthetics, but structural integrity, code compliance, and lasting
            value.
          </p>
          <p className="text-gray-600 text-sm mt-4 font-[var(--font-space-mono)]">
            Note: Project photos being compiled — check back soon.
          </p>
        </div>
      </section>

      {/* Category filter (static for now) */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap py-1 ${
                  cat === "All"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white">
                {/* Image placeholder */}
                <div
                  className={`${project.bg} aspect-[4/3] relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500 tracking-widest uppercase font-[var(--font-space-mono)]">
                      Photo Coming Soon
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-xs px-3 py-1 tracking-widest uppercase font-[var(--font-space-mono)]">
                      {project.category}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-8">
                  <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-3">
                    {project.location}
                    {project.size !== "N/A" && ` · ${project.size}`}
                  </div>
                  <h3 className="font-[var(--font-space-grotesk)] font-bold text-xl text-black mb-3">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[var(--font-space-grotesk)] font-bold text-3xl lg:text-4xl text-white mb-4 tracking-tight">
            Ready to be our next project?
          </h2>
          <p className="text-gray-400 mb-8">
            Let&apos;s talk about what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors font-[var(--font-space-mono)]"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
