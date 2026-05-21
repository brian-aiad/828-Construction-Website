export const SITE = {
  name: "828 Construction",
  tagline: "Built with Intent. Not by Accident.",
  description:
    "25+ years of building science expertise. Specializing in ADU construction, remediation, and consulting in Torrance and South Bay, CA.",
  phone: "213-828-2388",
  phoneHref: "tel:+12138282388",
  email: "828constructionca@gmail.com",
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
// Joe has been doing construction since 2004 — this is experience, not founding year.
// 828 Construction (the company) is newer. Never frame 2004 as "Est." or "Founded."
export const EXPERIENCE_SINCE = 2004;

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

const PROJECT_GALLERIES = {
  modernHerringboneBath: [
    "/images/projects/generated-angles/modern-herringbone-bath/01.jpg",
    "/images/projects/generated-angles/modern-herringbone-bath/02.jpg",
    "/images/projects/generated-angles/modern-herringbone-bath/03.jpg",
    "/images/projects/generated-angles/modern-herringbone-bath/04.jpg",
    "/images/projects/generated-angles/modern-herringbone-bath/05.jpg",
  ],
  geometricFeatureBath: [
    "/images/projects/generated-angles/geometric-feature-bath/01.jpg",
    "/images/projects/generated-angles/geometric-feature-bath/02.jpg",
    "/images/projects/generated-angles/geometric-feature-bath/03.jpg",
    "/images/projects/generated-angles/geometric-feature-bath/04.jpg",
    "/images/projects/generated-angles/geometric-feature-bath/05.jpg",
  ],
  southBayOutdoorLiving: [
    "/images/projects/generated-angles/south-bay-outdoor-living/01.jpg",
    "/images/projects/generated-angles/south-bay-outdoor-living/02.jpg",
    "/images/projects/generated-angles/south-bay-outdoor-living/03.jpg",
    "/images/projects/generated-angles/south-bay-outdoor-living/04.jpg",
    "/images/projects/generated-angles/south-bay-outdoor-living/05.jpg",
  ],
  showerRemediationNicheRebuild: [
    "/images/projects/generated-angles/shower-remediation-niche-rebuild/01.jpg",
    "/images/projects/generated-angles/shower-remediation-niche-rebuild/02.jpg",
    "/images/projects/generated-angles/shower-remediation-niche-rebuild/03.jpg",
    "/images/projects/generated-angles/shower-remediation-niche-rebuild/04.jpg",
    "/images/projects/generated-angles/shower-remediation-niche-rebuild/05.jpg",
  ],
  recessedCeilingLedBath: [
    "/images/projects/generated-angles/recessed-ceiling-led-bath/01.jpg",
    "/images/projects/generated-angles/recessed-ceiling-led-bath/02.jpg",
    "/images/projects/generated-angles/recessed-ceiling-led-bath/03.jpg",
    "/images/projects/generated-angles/recessed-ceiling-led-bath/04.jpg",
    "/images/projects/generated-angles/recessed-ceiling-led-bath/05.jpg",
  ],
  customShowerNicheProgress: [
    "/images/projects/generated-angles/custom-shower-niche-progress/01.jpg",
    "/images/projects/generated-angles/custom-shower-niche-progress/02.jpg",
    "/images/projects/generated-angles/custom-shower-niche-progress/03.jpg",
    "/images/projects/generated-angles/custom-shower-niche-progress/04.jpg",
    "/images/projects/generated-angles/custom-shower-niche-progress/05.jpg",
  ],
  vanityLedStripRenovation: [
    "/images/projects/generated-angles/vanity-led-strip-renovation/01.jpg",
    "/images/projects/generated-angles/vanity-led-strip-renovation/02.jpg",
    "/images/projects/generated-angles/vanity-led-strip-renovation/03.jpg",
    "/images/projects/generated-angles/vanity-led-strip-renovation/04.jpg",
    "/images/projects/generated-angles/vanity-led-strip-renovation/05.jpg",
  ],
  outdoorLivingPoolSurround: [
    "/images/projects/generated-angles/outdoor-living-pool-surround/01.jpg",
    "/images/projects/generated-angles/outdoor-living-pool-surround/02.jpg",
    "/images/projects/generated-angles/outdoor-living-pool-surround/03.jpg",
    "/images/projects/generated-angles/outdoor-living-pool-surround/04.jpg",
    "/images/projects/generated-angles/outdoor-living-pool-surround/05.jpg",
  ],
  detachedAduNewConstruction: [
    "/images/projects/generated-angles/detached-adu-new-construction/01.jpg",
    "/images/projects/generated-angles/detached-adu-new-construction/02.jpg",
    "/images/projects/generated-angles/detached-adu-new-construction/03.jpg",
    "/images/projects/generated-angles/detached-adu-new-construction/04.jpg",
    "/images/projects/generated-angles/detached-adu-new-construction/05.jpg",
  ],
  garageConversionGlassEntryAdu: [
    "/images/projects/generated-angles/garage-conversion-glass-entry-adu/01.jpg",
    "/images/projects/generated-angles/garage-conversion-glass-entry-adu/02.jpg",
    "/images/projects/generated-angles/garage-conversion-glass-entry-adu/03.jpg",
    "/images/projects/generated-angles/garage-conversion-glass-entry-adu/04.jpg",
    "/images/projects/generated-angles/garage-conversion-glass-entry-adu/05.jpg",
  ],
  kitchenRenovationDarkCabinetBuild: [
    "/images/projects/generated-angles/kitchen-renovation-dark-cabinet-build/01.jpg",
    "/images/projects/generated-angles/kitchen-renovation-dark-cabinet-build/02.jpg",
    "/images/projects/generated-angles/kitchen-renovation-dark-cabinet-build/03.jpg",
    "/images/projects/generated-angles/kitchen-renovation-dark-cabinet-build/04.jpg",
    "/images/projects/generated-angles/kitchen-renovation-dark-cabinet-build/05.jpg",
  ],
  foundationNewAduConstruction: [
    "/images/projects/generated-angles/foundation-new-adu-construction/01.jpg",
    "/images/projects/generated-angles/foundation-new-adu-construction/02.jpg",
    "/images/projects/generated-angles/foundation-new-adu-construction/03.jpg",
    "/images/projects/generated-angles/foundation-new-adu-construction/04.jpg",
    "/images/projects/generated-angles/foundation-new-adu-construction/05.jpg",
  ],
  prePurchaseStructuralEvaluation: [
    "/images/projects/generated-angles/pre-purchase-structural-evaluation/01.jpg",
    "/images/projects/generated-angles/pre-purchase-structural-evaluation/02.jpg",
    "/images/projects/generated-angles/pre-purchase-structural-evaluation/03.jpg",
    "/images/projects/generated-angles/pre-purchase-structural-evaluation/04.jpg",
    "/images/projects/generated-angles/pre-purchase-structural-evaluation/05.jpg",
  ],
  waterIntrusionRemediation: [
    "/images/projects/generated-angles/water-intrusion-remediation/01.jpg",
    "/images/projects/generated-angles/water-intrusion-remediation/02.jpg",
    "/images/projects/generated-angles/water-intrusion-remediation/03.jpg",
    "/images/projects/generated-angles/water-intrusion-remediation/04.jpg",
    "/images/projects/generated-angles/water-intrusion-remediation/05.jpg",
  ],
} as const;

const PROJECT_MAIN_IMAGES = {
  modernHerringboneBath: "/images/projects/bathroom-herringbone.jpg",
  geometricFeatureBath: "/images/projects/bathroom-geometric.jpg",
  southBayOutdoorLiving: "/images/projects/outdoor-patio-pergola.jpg",
  showerRemediationNicheRebuild: "/images/projects/shower-black-fixtures.jpg",
  recessedCeilingLedBath: "/images/projects/bathroom-led.jpg",
  customShowerNicheProgress: "/images/projects/niche-detail.jpg",
  vanityLedStripRenovation: "/images/projects/bathroom-warm.jpg",
  outdoorLivingPoolSurround: "/images/projects/outdoor-patio-pergola.jpg",
  detachedAduNewConstruction: "/images/projects/adu-exterior-new.jpg",
  garageConversionGlassEntryAdu: "/images/projects/garage-conversion.jpg",
  kitchenRenovationDarkCabinetBuild: "/images/projects/kitchen-dark.jpg",
  foundationNewAduConstruction: "/images/projects/foundation-concrete.jpg",
  prePurchaseStructuralEvaluation: "/images/projects/consulting-inspection.jpg",
  waterIntrusionRemediation: "/images/projects/remediation-damage.jpg",
} as const;

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Modern Herringbone Bath Remodel",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Custom herringbone tile · Wall-mount toilet · Stone accent wall",
    description:
      "Full bathroom renovation featuring a floor-to-ceiling herringbone tile shower wall, wall-mounted toilet with in-wall tank, natural stone accent, and recessed niche. A complete gut-and-rebuild executed to the millimeter.",
    image: PROJECT_MAIN_IMAGES.modernHerringboneBath,
    images: [PROJECT_MAIN_IMAGES.modernHerringboneBath, ...PROJECT_GALLERIES.modernHerringboneBath],
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
    image: PROJECT_MAIN_IMAGES.geometricFeatureBath,
    images: [PROJECT_MAIN_IMAGES.geometricFeatureBath, ...PROJECT_GALLERIES.geometricFeatureBath],
  },
  {
    id: 3,
    title: "South Bay Outdoor Living",
    category: "ADU Construction",
    location: "South Bay, CA",
    spec: "Pergola · Pool deck · Custom wood decking",
    description:
      "Luxury outdoor living space built around an existing pool — custom wood deck, pergola with pendant lighting, and seamless indoor-outdoor flow. Designed for California life, built to last decades.",
    image: PROJECT_MAIN_IMAGES.southBayOutdoorLiving,
    images: [PROJECT_MAIN_IMAGES.southBayOutdoorLiving, ...PROJECT_GALLERIES.southBayOutdoorLiving],
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
    image: PROJECT_MAIN_IMAGES.showerRemediationNicheRebuild,
    images: [PROJECT_MAIN_IMAGES.showerRemediationNicheRebuild, ...PROJECT_GALLERIES.showerRemediationNicheRebuild],
  },
  {
    id: 5,
    title: "Recessed Ceiling & LED Bath",
    category: "ADU Construction",
    location: "Manhattan Beach, CA",
    spec: "Tile ceiling · LED downlights · Copper sconce",
    description:
      "Contemporary bathroom with a fully tiled coffered ceiling, recessed LED downlights, and a warm copper wall sconce. Every surface considered — part of a larger ADU build for a long-term rental portfolio.",
    image: PROJECT_MAIN_IMAGES.recessedCeilingLedBath,
    images: [PROJECT_MAIN_IMAGES.recessedCeilingLedBath, ...PROJECT_GALLERIES.recessedCeilingLedBath],
  },
  {
    id: 6,
    title: "Custom Shower Niche — In Progress",
    category: "Remediation",
    location: "Torrance, CA",
    spec: "Microcement finish · Recessed niche · Dark tile ceiling",
    description:
      "Mid-project documentation of a precision shower niche in microcement finish — dark tile ceiling contrasts the light walls. This is what the work looks like before the glamour shot. Detail-first, always.",
    image: PROJECT_MAIN_IMAGES.customShowerNicheProgress,
    images: [PROJECT_MAIN_IMAGES.customShowerNicheProgress, ...PROJECT_GALLERIES.customShowerNicheProgress],
  },
  {
    id: 7,
    title: "Vanity & LED Strip Renovation",
    category: "ADU Construction",
    location: "South Bay, CA",
    spec: "LED strip lighting · Warm ambiance · Wood plank floor",
    description:
      "Bathroom renovation focused on atmosphere — LED strip lighting under the vanity shelf creates warm, indirect glow. Wood plank flooring and clean white walls complete a space designed for long-term comfort.",
    image: PROJECT_MAIN_IMAGES.vanityLedStripRenovation,
    images: [PROJECT_MAIN_IMAGES.vanityLedStripRenovation, ...PROJECT_GALLERIES.vanityLedStripRenovation],
  },
  {
    id: 8,
    title: "Outdoor Living & Pool Surround",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Teak decking · Pergola · Woven pendant lighting · Pool surround",
    description:
      "Full outdoor living transformation — custom teak deck, pergola with statement woven pendants, and a complete pool surround redesign. The kind of project where every material decision matters for long-term performance outdoors.",
    image: PROJECT_MAIN_IMAGES.outdoorLivingPoolSurround,
    images: [PROJECT_MAIN_IMAGES.outdoorLivingPoolSurround, ...PROJECT_GALLERIES.outdoorLivingPoolSurround],
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
    image: PROJECT_MAIN_IMAGES.detachedAduNewConstruction,
    images: [PROJECT_MAIN_IMAGES.detachedAduNewConstruction, ...PROJECT_GALLERIES.detachedAduNewConstruction],
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
    image: PROJECT_MAIN_IMAGES.garageConversionGlassEntryAdu,
    images: [PROJECT_MAIN_IMAGES.garageConversionGlassEntryAdu, ...PROJECT_GALLERIES.garageConversionGlassEntryAdu],
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
    image: PROJECT_MAIN_IMAGES.kitchenRenovationDarkCabinetBuild,
    images: [PROJECT_MAIN_IMAGES.kitchenRenovationDarkCabinetBuild, ...PROJECT_GALLERIES.kitchenRenovationDarkCabinetBuild],
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
    image: PROJECT_MAIN_IMAGES.foundationNewAduConstruction,
    images: [PROJECT_MAIN_IMAGES.foundationNewAduConstruction, ...PROJECT_GALLERIES.foundationNewAduConstruction],
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
    image: PROJECT_MAIN_IMAGES.prePurchaseStructuralEvaluation,
    images: [PROJECT_MAIN_IMAGES.prePurchaseStructuralEvaluation, ...PROJECT_GALLERIES.prePurchaseStructuralEvaluation],
  },
  {
    id: 10,
    title: "Water Intrusion Remediation",
    category: "Remediation",
    location: "Redondo Beach, CA",
    spec: "Envelope failure · Moisture remediation · Rebuilt to code",
    description:
      "Chronic water intrusion traced to failed flashing and improper window installation — not a roofing issue as originally diagnosed. Scope rebuilt correctly, structure dried, and building envelope sealed. No recurrence.",
    image: PROJECT_MAIN_IMAGES.waterIntrusionRemediation,
    images: [PROJECT_MAIN_IMAGES.waterIntrusionRemediation, ...PROJECT_GALLERIES.waterIntrusionRemediation],
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
