export const SITE = {
  name: "828 Construction",
  tagline: "Built with Intent. Not by Accident.",
  description:
    "25+ years of building science expertise. Specializing in ADU construction, remediation, and consulting in Torrance and South Bay, CA.",
  phone: "213-828-2388",
  phoneHref: "tel:+12138282388",
  email: "joe@828constructions.com",
  address: {
    street: "21223 Hawthorne Boulevard STE B 1087",
    city: "Torrance",
    state: "CA",
    zip: "90503",
    full: "21223 Hawthorne Blvd STE B 1087, Torrance, CA 90503",
  },
  license: "1141119",
  url: "https://828constructions.com",
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
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export const PROCESS_STEPS_V2 = [
  { number: "01", title: "Initial Contact", subtitle: "Pre-construction" },
  { number: "02", title: "Site Visit", subtitle: "Design & Planning" },
  { number: "03", title: "Permit & Approval", subtitle: "Code Compliance" },
  { number: "04", title: "Construction", subtitle: "Full Build Execution" },
  { number: "05", title: "Post-Construction", subtitle: "Project Completion" },
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

// ── V2 brand constants ────────────────────────────────────────────────────
// FOUNDING_YEAR = 2004. Joe's typed notes say "2025" — this is a typo.
// Verbal call + memory confirm 2004. Lock this value.
export const FOUNDING_YEAR = 2004;

export const SERVICE_AREAS = [
  "Torrance",
  "Redondo Beach",
  "Manhattan Beach",
  "Hermosa Beach",
  "El Segundo",
  "Carson",
  "Lomita",
  "Palos Verdes",
  "Rolling Hills",
  "San Pedro",
  "Wilmington",
  "Long Beach",
];

// ── Accent tokens ─────────────────────────────────────────────────────────
export const ACCENTS = {
  maroon: {
    DEFAULT: '#7B2D26',
    light: '#9A3F38',
    dark: '#5C1F1A',
  },
  copper: {
    DEFAULT: '#B87333',
    light: '#D4A574',
    dark: '#8B5A2B',
  },
} as const;

export const ACCENT_PRIMARY = ACCENTS.maroon.DEFAULT;

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
  /** True if image is a temporary stock photo pending replacement */
  tempPhoto?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Modern Herringbone Bath Remodel",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Custom herringbone tile · Wall-mount toilet · Stone accent wall",
    description:
      "Full bathroom renovation featuring a floor-to-ceiling herringbone tile shower wall, wall-mounted toilet with in-wall tank, natural stone accent, and recessed niche. A complete gut-and-rebuild executed to the millimeter.",
    image: "/images/projects/bathroom-herringbone.jpg",
    images: [
      "/images/projects/bathroom-herringbone.jpg",
      "/images/projects/bathroom-shower.jpg",
    ],
    featured: true,
  },
  {
    id: 2,
    title: "Geometric Feature Bath",
    category: "ADU Construction",
    location: "Redondo Beach, CA",
    spec: "Geometric tile · Matte black fixtures · Glass partition",
    description:
      "Bold starburst geometric tile dominates this ADU bathroom — black matte fixtures, frameless glass shower partition, and warm wood vanity. Proof that a small space can have maximum personality.",
    image: "/images/projects/bathroom-geometric.jpg",
  },
  {
    id: 3,
    title: "South Bay Outdoor Living",
    category: "ADU Construction",
    location: "South Bay, CA",
    spec: "Pergola · Pool deck · Custom wood decking",
    description:
      "Luxury outdoor living space built around an existing pool — custom wood deck, pergola with pendant lighting, and seamless indoor-outdoor flow. Designed for California life, built to last decades.",
    image: "/images/projects/outdoor-living-editorial.jpg",
    images: [
      "/images/projects/outdoor-living-editorial.jpg",
      "/images/hero/patio-pool.jpg",
      "/images/projects/outdoor-patio-pergola.jpg",
    ],
    featured: true,
  },
  {
    id: 4,
    title: "Shower Remediation & Niche Rebuild",
    category: "Remediation",
    location: "Torrance, CA",
    spec: "Waterproofing · Dual shower heads · Herringbone niche",
    description:
      "Shower torn out to the studs — improper waterproofing removed, rebuilt to code, large-format white tile installed with a custom herringbone-tile niche and dual shower system. The kind of work that fixes it right.",
    image: "/images/projects/bathroom-shower.jpg",
    images: [
      "/images/projects/bathroom-shower.jpg",
      "/images/projects/shower-black-fixtures.jpg",
      "/images/projects/niche-detail.jpg",
    ],
  },
  {
    id: 5,
    title: "Recessed Ceiling & LED Bath",
    category: "ADU Construction",
    location: "Manhattan Beach, CA",
    spec: "Tile ceiling · LED downlights · Copper sconce",
    description:
      "Contemporary bathroom with a fully tiled coffered ceiling, recessed LED downlights, and a warm copper wall sconce. Every surface considered — part of a larger ADU build for a long-term rental portfolio.",
    image: "/images/projects/bathroom-led.jpg",
  },
  {
    id: 6,
    title: "Custom Shower Niche — In Progress",
    category: "Remediation",
    location: "Torrance, CA",
    spec: "Microcement finish · Recessed niche · Dark tile ceiling",
    description:
      "Mid-project documentation of a precision shower niche in microcement finish — dark tile ceiling contrasts the light walls. This is what the work looks like before the glamour shot. Detail-first, always.",
    image: "/images/projects/niche-detail.jpg",
  },
  {
    id: 7,
    title: "Vanity & LED Strip Renovation",
    category: "ADU Construction",
    location: "South Bay, CA",
    spec: "LED strip lighting · Warm ambiance · Wood plank floor",
    description:
      "Bathroom renovation focused on atmosphere — LED strip lighting under the vanity shelf creates warm, indirect glow. Wood plank flooring and clean white walls complete a space designed for long-term comfort.",
    image: "/images/projects/bathroom-warm.jpg",
  },
  {
    id: 8,
    title: "Outdoor Living & Pool Surround",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Teak decking · Pergola · Woven pendant lighting · Pool surround",
    description:
      "Full outdoor living transformation — custom teak deck, pergola with statement woven pendants, and a complete pool surround redesign. The kind of project where every material decision matters for long-term performance outdoors.",
    image: "/images/projects/outdoor-patio-pergola.jpg",
    images: [
      "/images/projects/outdoor-patio-pergola.jpg",
      "/images/hero/patio-pool.jpg",
    ],
    featured: true,
  },
  {
    id: 12,
    title: "Detached ADU — New Construction",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Detached unit · 420 sq ft · Permit expedited",
    description:
      "Full-build detached ADU from foundation to finish — permitted, framed, wrapped, and finished to match the main structure. Built for long-term rental income with durable materials throughout.",
    image: "/images/projects/adu-exterior-new.jpg",
    images: [
      "/images/projects/adu-exterior-new.jpg",
      "/images/projects/exterior-stucco.jpg",
      "/images/projects/adu-interior-living.jpg",
      "/images/projects/waterproofing-membrane.jpg",
      "/images/projects/adu-framing.jpg",
      "/images/projects/adu-exterior.jpg",
      "/images/projects/adu-interior.jpg",
    ],
    featured: true,
  },
  {
    id: 13,
    title: "Garage Conversion — Glass Entry ADU",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Garage conversion · Steel glass doors · Polished concrete",
    description:
      "Former two-car garage converted to a full ADU — steel-framed glass bifold doors replace the garage opening, polished concrete floors, open kitchen, and seamless indoor-outdoor flow. Permitted and built to code.",
    image: "/images/projects/garage-conversion.jpg",
    featured: true,
  },
  {
    id: 14,
    title: "Kitchen Renovation — Dark Cabinet Build",
    category: "ADU Construction",
    location: "Manhattan Beach, CA",
    spec: "Matte black cabinetry · Waterfall island · Pendant lighting",
    description:
      "Full kitchen renovation with custom matte black lower cabinets, white uppers, waterfall-edge island with flush sink, and minimal pendant lighting. Part of a whole-home ADU conversion project.",
    image: "/images/projects/kitchen-dark.jpg",
    featured: false,
  },
  {
    id: 15,
    title: "Foundation — New ADU Construction",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Continuous footings · Rebar grid · Engineered pour",
    description:
      "Foundation work for a new detached ADU — continuous concrete footings with engineered rebar placement. This is the part no one photographs but everyone relies on. Built to outlast the structure above it.",
    image: "/images/projects/foundation-concrete.jpg",
    featured: false,
  },
  {
    id: 9,
    title: "Pre-Purchase Structural Evaluation",
    category: "Consulting",
    location: "Hermosa Beach, CA",
    spec: "Feasibility study · Defect report · Contractor review",
    description:
      "Pre-purchase consulting for a $1.4M investment property. Identified 11 hidden defects, reviewed contractor bids, and delivered a written feasibility analysis. Client negotiated $80K off the purchase price.",
    image: "/images/projects/consulting-blueprints.jpg",
    images: [
      "/images/projects/consulting-blueprints.jpg",
      "/images/projects/consulting-inspection.jpg",
      "/images/projects/consulting-plans.jpg",
      "/images/projects/consulting-crawlspace.jpg",
    ],
  },
  {
    id: 10,
    title: "Water Intrusion Remediation",
    category: "Remediation",
    location: "Redondo Beach, CA",
    spec: "Envelope failure · Moisture remediation · Rebuilt to code",
    description:
      "Chronic water intrusion traced to failed flashing and improper window installation — not a roofing issue as originally diagnosed. Scope rebuilt correctly, structure dried, and building envelope sealed. No recurrence.",
    image: "/images/projects/remediation-after.jpg",
    images: [
      "/images/projects/remediation-after.jpg",
      "/images/projects/remediation-restored.jpg",
      "/images/projects/remediation-active.jpg",
      "/images/projects/remediation-mold.jpg",
      "/images/projects/remediation-work.jpg",
      "/images/projects/remediation-damage.jpg",
    ],
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
      "Detailed planning using 25+ years of building science knowledge. Every decision is intentional — no guesswork, no surprises.",
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
