#!/usr/bin/env node

import { readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import sharp from "sharp";

const PUBLIC_ROOT = "public";
const RASTER_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const images = walk(PUBLIC_ROOT).filter((path) =>
  RASTER_EXTENSIONS.has(extname(path).toLowerCase())
);

if (images.length === 0) {
  throw new Error("Public image audit failed: no raster images were found.");
}

const failures = [];
const formats = new Map();

for (let index = 0; index < images.length; index += 8) {
  const batch = images.slice(index, index + 8);
  await Promise.all(
    batch.map(async (path) => {
      const label = relative(PUBLIC_ROOT, path);
      try {
        if (statSync(path).size === 0) {
          failures.push(`${label}: file is empty`);
          return;
        }

        const metadata = await sharp(path, { animated: true, failOn: "error" }).metadata();
        if (!metadata.width || !metadata.height || metadata.width < 1 || metadata.height < 1) {
          failures.push(`${label}: invalid dimensions ${metadata.width ?? 0}x${metadata.height ?? 0}`);
          return;
        }

        const format = metadata.format ?? "unknown";
        formats.set(format, (formats.get(format) ?? 0) + 1);
      } catch (error) {
        failures.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
      }
    })
  );
}

if (failures.length > 0) {
  throw new Error(`Public image audit failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

const summary = [...formats.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([format, count]) => `${format}:${count}`)
  .join(", ");

console.log(`Decoded ${images.length} public image(s) successfully (${summary}).`);
