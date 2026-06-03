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
export type ProjectCategory = "Bath Remodel" | "ADU Construction" | "Remediation" | "Consulting";

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
  /** True when the project has an image strong enough for the portfolio hero grid */
  heroReady?: boolean;
  /** Lower values appear earlier in the portfolio hero grid */
  portfolioRank?: number;
  /** True if image is a temporary stock photo pending replacement */
  tempPhoto?: boolean;
}

const PROJECT_GALLERIES = {
  cerritosResidence: [
    "/images/projects/cerritos-residence/02-2132.jpg",
    "/images/projects/cerritos-residence/03-2077.jpg",
    "/images/projects/cerritos-residence/07-2082.jpg",
    "/images/projects/cerritos-residence/08-2085.jpg",
    "/images/projects/cerritos-residence/25-2127.jpg",
    "/images/projects/cerritos-residence/26-2128.jpg",
    "/images/projects/cerritos-residence/21-2088.jpg",
    "/images/projects/cerritos-residence/20-2083.jpg",
    "/images/projects/cerritos-residence/06-2062.jpg",
    "/images/projects/cerritos-residence/04-2070.jpg",
    "/images/projects/cerritos-residence/05-2069.jpg",
    "/images/projects/cerritos-residence/12-2150.jpg",
    "/images/projects/cerritos-residence/28-2146.jpg",
    "/images/projects/cerritos-residence/27-2141.jpg",
    "/images/projects/cerritos-residence/10-2138.jpg",
    "/images/projects/cerritos-residence/11-2144.jpg",
    "/images/projects/cerritos-residence/17-2063.jpg",
    "/images/projects/cerritos-residence/18-2064.jpg",
    "/images/projects/cerritos-residence/15-2169.jpg",
    "/images/projects/cerritos-residence/30-2160.jpg",
    "/images/projects/cerritos-residence/31-2161.jpg",
    "/images/projects/cerritos-residence/33-2164.jpg",
    "/images/projects/cerritos-residence/13-2110.jpg",
    "/images/projects/cerritos-residence/14-2115.jpg",
    "/images/projects/cerritos-residence/16-2182.jpg",
    "/images/projects/cerritos-residence/35-2186.jpg",
  ],
  tustinResidence: [
    "/images/projects/tustin-residence/02-1905.jpg",
    "/images/projects/tustin-residence/25-1889.jpg",
    "/images/projects/tustin-residence/03-1893.jpg",
    "/images/projects/tustin-residence/04-1838.jpg",
    "/images/projects/tustin-residence/05-1845.jpg",
    "/images/projects/tustin-residence/08-1900.jpg",
    "/images/projects/tustin-residence/10-1928.jpg",
    "/images/projects/tustin-residence/11-1933.jpg",
    "/images/projects/tustin-residence/09-1909.jpg",
    "/images/projects/tustin-residence/13-1947.jpg",
    "/images/projects/tustin-residence/12-1940.jpg",
    "/images/projects/tustin-residence/14-1951.jpg",
    "/images/projects/tustin-residence/19-2054.jpg",
    "/images/projects/tustin-residence/17-2010.jpg",
    "/images/projects/tustin-residence/15-1974.jpg",
    "/images/projects/tustin-residence/34-1975.jpg",
    "/images/projects/tustin-residence/35-1977.jpg",
    "/images/projects/tustin-residence/07-1852.jpg",
    "/images/projects/tustin-residence/28-1920.jpg",
    "/images/projects/tustin-residence/43-2034.jpg",
    "/images/projects/tustin-residence/36-1978.jpg",
    "/images/projects/tustin-residence/41-2019.jpg",
    "/images/projects/tustin-residence/40-2006.jpg",
  ],
  modernHerringboneBath: [
    "/images/projects/bathroom-herringbone.jpg",
    "/images/projects/bathroom-shower.jpg",
    "/images/projects/niche-detail.jpg",
  ],
  geometricFeatureBath: [
    "/images/projects/bathroom-geometric.jpg",
    "/images/projects/shower-black-fixtures.jpg",
    "/images/projects/niche-detail.jpg",
  ],
  southBayOutdoorLiving: [
    "/images/projects/outdoor-patio-pergola.jpg",
    "/images/projects/outdoor-living-editorial.jpg",
  ],
  showerRemediationNicheRebuild: [
    "/images/projects/shower-black-fixtures.jpg",
    "/images/projects/waterproofing-membrane.jpg",
    "/images/projects/niche-detail.jpg",
  ],
  recessedCeilingLedBath: [
    "/images/projects/bathroom-led.jpg",
    "/images/projects/bathroom-warm.jpg",
    "/images/projects/bathroom-herringbone.jpg",
  ],
  customShowerNicheProgress: [
    "/images/projects/niche-detail.jpg",
  ],
  vanityLedStripRenovation: [
    "/images/projects/bathroom-warm.jpg",
    "/images/projects/bathroom-led.jpg",
  ],
  outdoorLivingPoolSurround: [
    "/images/projects/outdoor-patio-pergola.jpg",
    "/images/projects/outdoor-living-editorial.jpg",
  ],
  detachedAduNewConstruction: [
    "/images/projects/adu-construction.jpg",
    "/images/projects/adu-framing.jpg",
    "/images/projects/adu-interior.jpg",
    "/images/projects/adu-interior-living.jpg",
    "/images/projects/adu-exterior.jpg",
  ],
  garageConversionGlassEntryAdu: [
    "/images/projects/adu-interior-living.jpg",
    "/images/projects/kitchen-dark.jpg",
    "/images/projects/adu-interior.jpg",
  ],
  kitchenRenovationDarkCabinetBuild: [
    "/images/projects/garage-conversion.jpg",
    "/images/projects/adu-interior-living.jpg",
    "/images/projects/adu-interior.jpg",
  ],
  foundationNewAduConstruction: [
    "/images/projects/adu-construction.jpg",
    "/images/projects/adu-framing.jpg",
    "/images/projects/adu-exterior-new.jpg",
  ],
  prePurchaseStructuralEvaluation: [
    "/images/projects/consulting-blueprints.jpg",
  ],
  waterIntrusionRemediation: [
    "/images/projects/remediation-active.jpg",
    "/images/projects/remediation-work.jpg",
    "/images/projects/remediation-after.jpg",
    "/images/projects/remediation-restored.jpg",
    "/images/projects/waterproofing-membrane.jpg",
  ],
} as const;

const PROJECT_MAIN_IMAGES = {
  cerritosResidence: "/images/projects/cerritos-residence/01-2176.jpg",
  tustinResidence: "/images/projects/tustin-residence/01-1883.jpg",
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
    id: 16,
    title: "Cerritos Residence Bath Remodel",
    category: "Bath Remodel",
    location: "Cerritos, CA",
    spec: "Glass shower enclosure · Dark feature tile · Dual marble vanity · Rain + hand shower",
    description:
      "Full master bath remodel in Cerritos: frameless sliding glass shower enclosure, dark vertical tile feature wall, recessed shower niches, dual-sink marble vanity with Pfister brushed-nickel faucets, and LED backlit mirror. Gallery runs from wide room overviews down to millimeter-level fixture details.",
    image: PROJECT_MAIN_IMAGES.cerritosResidence,
    images: [PROJECT_MAIN_IMAGES.cerritosResidence, ...PROJECT_GALLERIES.cerritosResidence],
    featured: true,
    heroReady: true,
    portfolioRank: 5,
  },
  {
    id: 17,
    title: "Tustin Residence Bath Refresh",
    category: "Bath Remodel",
    location: "Tustin, CA",
    spec: "Tub/shower surround · Blue herringbone niche · Barn-door hardware · Wood bath tray",
    description:
      "Tustin bathroom remodel across two spaces: light blue soaking tub with ribbed white tile surround and custom blue herringbone-tile recessed niche, plus a second room with white square soaking tub, lit alcove, and wall-mount fixtures. Barn-door sliding hardware throughout. Gallery covers wide room views, fixture details, and material close-ups.",
    image: PROJECT_MAIN_IMAGES.tustinResidence,
    images: [PROJECT_MAIN_IMAGES.tustinResidence, ...PROJECT_GALLERIES.tustinResidence],
    featured: true,
    heroReady: true,
    portfolioRank: 6,
  },
  {
    id: 1,
    title: "Modern Herringbone Bath Remodel",
    category: "Bath Remodel",
    location: "Torrance, CA",
    spec: "Custom herringbone tile · Wall-mount toilet · Recessed niche",
    description:
      "Bathroom detail set focused on the herringbone shower wall, recessed niche, wall-mounted toilet, and clean compact-room finish work.",
    image: PROJECT_MAIN_IMAGES.modernHerringboneBath,
    images: [PROJECT_MAIN_IMAGES.modernHerringboneBath, ...PROJECT_GALLERIES.modernHerringboneBath],
    featured: true,
  },
  {
    id: 2,
    title: "Geometric Feature Shower",
    category: "Bath Remodel",
    location: "Redondo Beach, CA",
    spec: "Geometric tile · Matte black fixtures · Glass partition",
    description:
      "Compact bath detail set centered on the geometric tile wall, matte black shower hardware, and clean glass partition line.",
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
      "Outdoor living scope built around a pool edge: custom deck surface, pergola structure, pendant lighting, and warm material detailing.",
    image: PROJECT_MAIN_IMAGES.southBayOutdoorLiving,
    images: [PROJECT_MAIN_IMAGES.southBayOutdoorLiving, ...PROJECT_GALLERIES.southBayOutdoorLiving],
    featured: true,
    heroReady: true,
    portfolioRank: 1,
  },
  {
    id: 4,
    title: "Shower Remediation & Niche Rebuild",
    category: "Remediation",
    location: "Torrance, CA",
    spec: "Waterproofing · Dual shower heads · Recessed niche",
    description:
      "Shower scope focused on the finished shower hardware, niche detail, and waterproofing layer instead of mixing in unrelated room photography.",
    image: PROJECT_MAIN_IMAGES.showerRemediationNicheRebuild,
    images: [PROJECT_MAIN_IMAGES.showerRemediationNicheRebuild, ...PROJECT_GALLERIES.showerRemediationNicheRebuild],
  },
  {
    id: 5,
    title: "Recessed Ceiling & LED Bath",
    category: "Bath Remodel",
    location: "Manhattan Beach, CA",
    spec: "Tile ceiling · LED downlights · Warm wall lighting",
    description:
      "Contemporary bathroom detail set with a tiled ceiling plane, recessed lighting, warm wall glow, and restrained finish palette.",
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
      "Single-photo field record of the in-progress recessed shower niche. This gallery intentionally stays limited to the niche instead of mixing in unrelated shower photos.",
    image: PROJECT_MAIN_IMAGES.customShowerNicheProgress,
    images: [PROJECT_MAIN_IMAGES.customShowerNicheProgress, ...PROJECT_GALLERIES.customShowerNicheProgress],
  },
  {
    id: 7,
    title: "Vanity & LED Strip Renovation",
    category: "Bath Remodel",
    location: "South Bay, CA",
    spec: "LED strip lighting · Warm ambiance · Wood plank floor",
    description:
      "Bathroom renovation focused on atmosphere: indirect LED strip lighting, warm wall tone, and simple finish details for a compact bath.",
    image: PROJECT_MAIN_IMAGES.vanityLedStripRenovation,
    images: [PROJECT_MAIN_IMAGES.vanityLedStripRenovation, ...PROJECT_GALLERIES.vanityLedStripRenovation],
  },
  {
    id: 8,
    title: "Outdoor Living & Pool Surround",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "Decking · Pergola · Pendant lighting · Pool surround",
    description:
      "Outdoor living transformation with a custom deck, pergola, and pool surround composition. Kept to exterior photos so the gallery reads as one project type.",
    image: PROJECT_MAIN_IMAGES.outdoorLivingPoolSurround,
    images: [PROJECT_MAIN_IMAGES.outdoorLivingPoolSurround, ...PROJECT_GALLERIES.outdoorLivingPoolSurround],
    featured: false,
    tempPhoto: true,
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
    heroReady: true,
    portfolioRank: 2,
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
    heroReady: true,
    portfolioRank: 3,
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
    tempPhoto: true,
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
    tempPhoto: true,
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
    tempPhoto: true,
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
