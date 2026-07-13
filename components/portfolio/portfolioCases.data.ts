import { RESIDENCE_GALLERIES, ResidenceGallery } from "@/components/portfolio/residenceGalleries.data";
import { PROJECTS, Project } from "@/lib/constants";

// Curated editorial selects for the /portfolio case sections (Brian's
// 2026-07-13 revamp). Indices point into each residence's full photo set and
// were chosen from indexed contact sheets
// (.claude-work/research/portfolio-revamp/sheet-*.png) to avoid the
// near-duplicate walls the old uncurated grids produced. The full set stays
// reachable through the per-case lightbox.

export type PortfolioCase = {
  project: Project;
  gallery: ResidenceGallery;
  lead: string;
  /** Primary curated grid (chapter one for dual-scope projects) */
  grid: string[];
  /** Second chapter (El Sereno outdoor living) */
  gridB?: string[];
  chapterLabels?: [string, string];
  /** Traveling contact strip — decorative scrub layer, never content-critical */
  strip: string[];
};

const SELECTS: Record<
  string,
  { projectId: number; lead: number; grid: number[]; gridB?: number[]; chapterLabels?: [string, string]; strip: number[] }
> = {
  "cerritos-residence": {
    projectId: 1,
    lead: 0,
    grid: [1, 3, 5, 12, 19, 22],
    strip: [2, 14, 26],
  },
  "el-sereno-residence": {
    projectId: 2,
    lead: 4,
    grid: [0, 3, 13],
    gridB: [20, 28, 30],
    chapterLabels: ["The bath", "The hillside deck"],
    strip: [12, 15, 16],
  },
  "tustin-residence": {
    projectId: 3,
    lead: 0,
    grid: [3, 2, 12, 13, 15, 33],
    strip: [7, 8, 39],
  },
};

export const PORTFOLIO_CASES: PortfolioCase[] = RESIDENCE_GALLERIES.map((gallery) => {
  const sel = SELECTS[gallery.id];
  const project = PROJECTS.find((p) => p.id === sel.projectId)!;
  return {
    project,
    gallery,
    lead: gallery.photos[sel.lead],
    grid: sel.grid.map((i) => gallery.photos[i]),
    gridB: sel.gridB?.map((i) => gallery.photos[i]),
    chapterLabels: sel.chapterLabels,
    strip: sel.strip.map((i) => gallery.photos[i]),
  };
});

export const EXAMPLE_PROJECT = PROJECTS.find((p) => p.tempPhoto)!;
