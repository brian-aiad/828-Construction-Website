/**
 * Generates Low Quality Image Placeholders (LQIP) for every curated
 * project photo. Outputs lib/image-placeholders.ts with a typed map
 * from image path → base64 data URL.
 *
 * Run: node scripts/generate-lqip.mjs
 */
import sharp from "sharp";
import { readFile, readdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "../public");

async function projectFolderImages(folder) {
  const dir = join(PUBLIC, "/images/projects", folder);
  const files = (await readdir(dir)).filter((file) => /\.(jpg|jpeg)$/i.test(file)).sort();
  return files.map((file) => `/images/projects/${folder}/${file}`);
}

// Every image that appears in the gallery (hero + curated set)
const STATIC_IMAGES = [
  // Cerritos Residence
  "/images/projects/cerritos-residence/01-2176.jpg",
  "/images/projects/cerritos-residence/03-2077.jpg",
  "/images/projects/cerritos-residence/04-2070.jpg",
  "/images/projects/cerritos-residence/05-2069.jpg",
  "/images/projects/cerritos-residence/06-2062.jpg",
  "/images/projects/cerritos-residence/07-2082.jpg",
  "/images/projects/cerritos-residence/10-2138.jpg",
  "/images/projects/cerritos-residence/11-2144.jpg",
  "/images/projects/cerritos-residence/13-2110.jpg",
  "/images/projects/cerritos-residence/15-2169.jpg",
  "/images/projects/cerritos-residence/16-2182.jpg",
  "/images/projects/cerritos-residence/21-2088.jpg",
  "/images/projects/cerritos-residence/25-2127.jpg",
  "/images/projects/cerritos-residence/27-2141.jpg",
  "/images/projects/cerritos-residence/30-2160.jpg",
  // Tustin Residence
  "/images/projects/tustin-residence/01-1883.jpg",
  "/images/projects/tustin-residence/02-1905.jpg",
  "/images/projects/tustin-residence/04-1838.jpg",
  "/images/projects/tustin-residence/05-1845.jpg",
  "/images/projects/tustin-residence/07-1852.jpg",
  "/images/projects/tustin-residence/09-1909.jpg",
  "/images/projects/tustin-residence/13-1947.jpg",
  "/images/projects/tustin-residence/14-1951.jpg",
  "/images/projects/tustin-residence/17-2010.jpg",
  "/images/projects/tustin-residence/25-1889.jpg",
  "/images/projects/tustin-residence/28-1920.jpg",
  "/images/projects/tustin-residence/36-1978.jpg",
  "/images/projects/tustin-residence/41-2019.jpg",
];

const IMAGES = Array.from(new Set([
  ...STATIC_IMAGES,
  ...(await projectFolderImages("cerritos-residence")),
  ...(await projectFolderImages("tustin-residence")),
]));

async function toLQIP(webPath) {
  const buf = await readFile(join(PUBLIC, webPath));
  const lqip = await sharp(buf)
    .resize(24, 24, { fit: "inside" })
    .blur(2)
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${lqip.toString("base64")}`;
}

console.log(`Generating ${IMAGES.length} LQIPs…`);

const entries = [];
for (const img of IMAGES) {
  try {
    const b64 = await toLQIP(img);
    entries.push(`  "${img}": "${b64}"`);
    process.stdout.write(".");
  } catch (err) {
    console.error(`\n  ✗ ${img}: ${err.message}`);
    // Fallback to generic dark blur
    entries.push(`  "${img}": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAAYABgBAREA/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EACUQAAIBAwMEAgMAAAAAAAAAAAECAwAEERIhMUEFE1HRBP/aAAgBAQABPxCbFwj0LGb2K4PQ4JGdSe1WYGjkFvFsqjRhggknR2MjCuEOBvONq2K7ZfnSE9Vf/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oACAECAQE/AEzF/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oACAEDAQE/AEzF/9k="`);
  }
}

process.stdout.write("\n");

const output = `// AUTO-GENERATED — do not edit manually
// Run: node scripts/generate-lqip.mjs to regenerate

export const LQIP: Record<string, string> = {
${entries.join(",\n")}
};

export function lqip(src: string): string {
  return LQIP[src] ?? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAAYABgBAREA/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EACUQAAIBAwMEAgMAAAAAAAAAAAECAwAEERIhMUEFE1HRBP/aAAgBAQABPxCbFwj0LGb2K4PQ4JGdSe1WYGjkFvFsqjRhggknR2MjCuEOBvONq2K7ZfnSE9Vf/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oACAECAQE/AEzF/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oACAEDAQE/AEzF/9k=";
}
`;

await writeFile(join(__dirname, "../lib/image-placeholders.ts"), output);
console.log(`✅ Written to lib/image-placeholders.ts`);
