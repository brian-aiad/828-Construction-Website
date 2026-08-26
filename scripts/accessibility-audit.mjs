#!/usr/bin/env node

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.argv[2] || "http://localhost:4001";
const routes = [
  "/",
  "/about",
  "/services",
  "/services/adu",
  "/services/remediation",
  "/services/consulting",
  "/portfolio",
  "/contact",
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const axeSource = readFileSync(join("node_modules", "axe-core", "axe.min.js"), "utf8");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputDirectory = join(".claude-work", "accessibility-audit", timestamp);
mkdirSync(outputDirectory, { recursive: true });

const browser = await chromium.launch();
const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("828:splash-seen", "1");
      } catch {}
    });

    for (const route of routes) {
      const page = await context.newPage();
      const response = await page.goto(new URL(route, baseUrl).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });
      await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(700);
      await page.addScriptTag({ content: axeSource });
      const audit = await page.evaluate(async () => {
        const axe = window.axe;
        const report = await axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
          },
          resultTypes: ["violations"],
        });
        return report.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        }));
      });

      results.push({
        route,
        viewport: viewport.name,
        status: response?.status() ?? 0,
        violations: audit,
      });
      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

const failures = results.filter((result) => result.status !== 200 || result.violations.length > 0);
writeFileSync(
  join(outputDirectory, "report.json"),
  JSON.stringify({ baseUrl, results, failures }, null, 2)
);

for (const result of results) {
  const status = result.status === 200 && result.violations.length === 0 ? "PASS" : "FAIL";
  console.log(`${status} ${result.viewport} ${result.route}`);
  for (const violation of result.violations) {
    console.log(`  - ${violation.id} (${violation.impact}): ${violation.nodes.length} node(s)`);
  }
}
console.log(`Report: ${join(outputDirectory, "report.json")}`);

if (failures.length > 0) process.exit(1);
