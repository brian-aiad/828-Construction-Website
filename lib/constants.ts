export const SITE = {
  name: "828 Construction",
  tagline: "Built with Intent. Not by Accident.",
  description:
    "20+ years of building science expertise. Specializing in ADU construction, remediation, and consulting in Torrance and South Bay, CA.",
  phone: "213-828-2388",
  phoneHref: "tel:+12138282388",
  email: "joe@828construction.com",
  address: {
    street: "21223 Hawthorne Boulevard STE B 1087",
    city: "Torrance",
    state: "CA",
    zip: "90503",
    full: "21223 Hawthorne Blvd STE B 1087, Torrance, CA 90503",
  },
  license: "1141119",
  url: "https://828construction.com",
  serviceArea: [
    "Torrance",
    "Redondo Beach",
    "Manhattan Beach",
    "Hermosa Beach",
    "Lomita",
    "Carson",
    "El Segundo",
    "Hawthorne",
  ],
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export const SERVICES = [
  {
    slug: "adu",
    title: "ADU Construction",
    short: "Accessory Dwelling Units",
    description:
      "Accessory Dwelling Units designed for functionality, efficiency, and long-term value. Whether you're expanding your property or creating additional living space, each project is built with precision and purpose.",
    details: [
      "Detached and attached ADUs",
      "Garage conversions",
      "Junior ADUs (JADUs)",
      "Permit expediting",
      "Design coordination",
      "Full-build general contracting",
    ],
  },
  {
    slug: "remediation",
    title: "Remediation",
    short: "Structural & Environmental",
    description:
      "Specialized solutions for complex construction issues. From structural concerns to environmental damage, we approach every project with a deep understanding of building science to restore and strengthen your property.",
    details: [
      "Structural remediation",
      "Water damage repair",
      "Foundation issues",
      "Construction defect correction",
      "Post-disaster recovery",
      "Building envelope failures",
    ],
  },
  {
    slug: "consulting",
    title: "Consulting",
    short: "Expert Advisory Services",
    description:
      "Professional construction consulting for homeowners and investors who want clarity before committing. We help you understand your project, avoid costly mistakes, and move forward with confidence.",
    details: [
      "Pre-construction analysis",
      "Project feasibility studies",
      "Contractor vetting",
      "Construction defect review",
      "Owner's representation",
      "Code compliance review",
    ],
  },
];

// ── Project types ─────────────────────────────────────────────────────────
export type ProjectCategory = "ADU Construction" | "Remediation" | "Consulting";

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  location: string;
  spec: string;
  description: string;
  /** Path relative to /public — show designed plate if file missing */
  image: string;
  /** Optional additional images for lightbox */
  images?: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Modern Herringbone Bath Remodel",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Custom herringbone tile · Built-in lighting · Full remodel",
    description:
      "A complete bathroom overhaul showcasing precision tile work and modern fixtures. Custom herringbone pattern, integrated LED strip lighting, and a seamless design that maximizes the space.",
    image: "/images/projects/bathroom-herringbone.jpg",
    images: [
      "/images/projects/bathroom-herringbone.jpg",
      "/images/projects/bathroom-led.jpg",
    ],
    featured: true,
  },
  {
    id: 2,
    title: "Geometric ADU Interior",
    category: "ADU Construction",
    location: "Redondo Beach, CA",
    spec: "Bold geometric design · Modern fixtures · Full ADU build",
    description:
      "ADU interior with a bold geometric wallpaper feature wall, contemporary fixtures, and clean lines throughout. Every detail was selected to maximize the impact of the 420 sq ft space.",
    image: "/images/projects/bathroom-geometric.jpg",
    images: [
      "/images/projects/bathroom-geometric.jpg",
      "/images/projects/bathroom-angle.jpg",
    ],
  },
  {
    id: 3,
    title: "South Bay Outdoor Living",
    category: "ADU Construction",
    location: "South Bay, CA",
    spec: "Custom patio · Pool integration · Luxury outdoor space",
    description:
      "Luxury outdoor living space with custom concrete work, pool integration, and covered patio. Designed for California outdoor living — built to last decades.",
    image: "/images/hero/patio-pool.jpg",
    featured: true,
  },
  {
    id: 4,
    title: "Precision Shower & Niche Detail",
    category: "Remediation",
    location: "Torrance, CA",
    spec: "Waterproofing · Custom niche · Tile remediation",
    description:
      "Complete shower remediation — removed improper waterproofing, rebuilt to code, installed custom herringbone tile and a recessed niche with built-in shelf. The kind of work that lasts.",
    image: "/images/projects/bathroom-shower.jpg",
    images: [
      "/images/projects/bathroom-shower.jpg",
      "/images/projects/niche-detail.jpg",
    ],
  },
  {
    id: 5,
    title: "LED Bath with Custom Niche",
    category: "ADU Construction",
    location: "Manhattan Beach, CA",
    spec: "LED lighting · Custom niche · Modern finishes",
    description:
      "Clean, contemporary bathroom with integrated LED lighting, a custom built-in niche, and large-format tile. Part of a full ADU build for a long-term rental property.",
    image: "/images/projects/bathroom-led.jpg",
  },
  {
    id: 6,
    title: "Pre-Purchase Feasibility Analysis",
    category: "Consulting",
    location: "Hermosa Beach, CA",
    spec: "Feasibility study · Defect report · Contractor review",
    description:
      "Pre-purchase consulting for a $1.4M investment property. Identified 11 hidden defects, reviewed contractor bids, and provided a complete feasibility analysis. Client avoided a costly mistake.",
    image: "/images/projects/niche-detail.jpg",
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We start by listening. A thorough consultation to understand your goals, constraints, and vision before any work begins.",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "Detailed planning using 20+ years of building science knowledge. Every decision is intentional — no guesswork, no surprises.",
  },
  {
    number: "03",
    title: "Execution",
    description:
      "Precise, quality-focused execution. We build with durability in mind, not just aesthetics.",
  },
  {
    number: "04",
    title: "Completion",
    description:
      "Thorough walkthrough, full documentation, and continued support. We don't disappear after handoff.",
  },
];
