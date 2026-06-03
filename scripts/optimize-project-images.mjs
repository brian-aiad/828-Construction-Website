/**
 * Pre-optimize project photos before Next.js sees them.
 * Resizes to max 2400px (handles 2x retina at 1200px wide),
 * converts to progressive JPEG at 85% quality.
 * Runs once; subsequent runs skip already-optimized files.
 */
import sharp from "sharp";
import { readdir, stat, writeFile, rename, unlink } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(__dirname, "../public/images/projects");

const FOLDERS = ["cerritos-residence", "tustin-residence"];
const MAX_DIMENSION = 2400; // px — handles 2x retina at 1200px viewport
const QUALITY = 88;
const SIZE_THRESHOLD_KB = 600; // skip if already under this (already optimized)

let processed = 0, skipped = 0, saved = 0;

for (const folder of FOLDERS) {
  const dir = join(PROJECT_DIR, folder);
  const files = (await readdir(dir)).filter((f) => /\.(jpg|jpeg)$/i.test(f));

  console.log(`\n📁 ${folder} — ${files.length} files`);

  for (const file of files) {
    const filePath = join(dir, file);
    const { size } = await stat(filePath);
    const sizeKB = size / 1024;

    if (sizeKB < SIZE_THRESHOLD_KB) {
      console.log(`  ⏭  ${file} (${Math.round(sizeKB)}KB — already small)`);
      skipped++;
      continue;
    }

    const before = size;
    const img = sharp(filePath);
    const meta = await img.metadata();

    const needsResize = (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;

    let pipeline = img;
    if (needsResize) {
      pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const buf = await pipeline
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();

    const after = buf.length;
    const pct = Math.round((1 - after / before) * 100);

    const tmpPath = filePath + ".tmp";
    await writeFile(tmpPath, buf);
    try { await unlink(filePath); } catch {}
    await rename(tmpPath, filePath);

    console.log(
      `  ✓  ${file}  ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB  (−${pct}%)`
    );
    saved += before - after;
    processed++;
  }
}

const savedMB = (saved / 1024 / 1024).toFixed(1);
console.log(`\n✅ Done — ${processed} optimized, ${skipped} skipped, ${savedMB}MB saved`);
