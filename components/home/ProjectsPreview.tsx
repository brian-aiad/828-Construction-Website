import Link from "next/link";

const placeholderProjects = [
  {
    id: 1,
    title: "Torrance ADU",
    category: "ADU Construction",
    location: "Torrance, CA",
    description: "Detached ADU — 480 sq ft, permitted & built",
    bg: "bg-gray-200",
  },
  {
    id: 2,
    title: "Redondo Beach Remediation",
    category: "Remediation",
    location: "Redondo Beach, CA",
    description: "Structural remediation following water intrusion",
    bg: "bg-gray-300",
  },
  {
    id: 3,
    title: "South Bay Consultation",
    category: "Consulting",
    location: "Manhattan Beach, CA",
    description: "Pre-purchase feasibility analysis & contractor review",
    bg: "bg-gray-400",
  },
];

export default function ProjectsPreview() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-[var(--font-space-mono)] text-gray-400 tracking-widest uppercase">
              Our Work
            </span>
            <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl lg:text-5xl text-black mt-3 tracking-tight">
              Recent Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold tracking-widest uppercase text-black border-b-2 border-black pb-1 hover:border-gray-400 hover:text-gray-500 transition-colors self-start sm:self-auto"
          >
            All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-200">
          {placeholderProjects.map((project) => (
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
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              {/* Info */}
              <div className="p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-3">
                  {project.category} · {project.location}
                </div>
                <h3 className="font-[var(--font-space-grotesk)] font-bold text-xl text-black mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 font-[var(--font-space-mono)] tracking-wider">
            Project photos in progress — check back soon
          </p>
        </div>
      </div>
    </section>
  );
}
