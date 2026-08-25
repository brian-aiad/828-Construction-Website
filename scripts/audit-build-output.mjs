#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const staticRoot = join(".next", "static");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const cssFiles = walk(staticRoot).filter((path) => path.endsWith(".css"));
if (cssFiles.length === 0) {
  throw new Error("Build audit failed: no compiled CSS files were produced.");
}

const unsafeGlobalCursorRules = [
  "@media(pointer:fine){*,:before,:after{cursor:none!important}",
  "@media(pointer:fine){*,*::before,*::after{cursor:none!important}",
];

for (const path of cssFiles) {
  const css = readFileSync(path, "utf8").replace(/\s+/g, "");
  const unsafeRule = unsafeGlobalCursorRules.find((rule) => css.includes(rule));
  if (unsafeRule) {
    throw new Error(
      `Build audit failed: ${path} hides every fine-pointer cursor (${unsafeRule}).`
    );
  }
}

console.log(`Audited ${cssFiles.length} compiled CSS file(s); cursor fallback is safe.`);
