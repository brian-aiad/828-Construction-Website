#!/usr/bin/env node
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.argv[2] || "http://localhost:4001";
const requestedRoute = process.argv[3];
const routes = [
  "/",
  "/about",
  "/services",
  "/services/adu",
  "/services/remediation",
  "/services/consulting",
  "/portfolio",
  "/contact",
].filter((route) => !requestedRoute || route === requestedRoute);

if (requestedRoute && routes.length === 0) {
  console.error(`Unknown route: ${requestedRoute}`);
  process.exit(1);
}

const viewports = [
  { name: "iphone-se", width: 375, height: 667, isMobile: true },
  { name: "iphone-15", width: 393, height: 852, isMobile: true },
  { name: "ipad-portrait", width: 820, height: 1180, isMobile: true },
  { name: "ipad-landscape", width: 1180, height: 820, isMobile: false },
];

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = join(".claude-work", "responsive-audit", timestamp);
mkdirSync(join(outDir, "screenshots"), { recursive: true });

function routeName(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const viewportWidth = window.innerWidth;
    const issues = {
      horizontalOverflow: doc.scrollWidth > viewportWidth + 2,
      scrollWidth: doc.scrollWidth,
      viewportWidth,
      brokenImages: [],
      clippedInteractiveText: [],
      fixedOverflow: [],
    };

    document.querySelectorAll("img").forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (img.loading === "lazy" && !img.complete) return;
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
        issues.brokenImages.push(img.currentSrc || img.src || img.alt || "unknown image");
      }
    });

    document.querySelectorAll("a, button").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") return;
      if (el.scrollWidth > el.clientWidth + 3) {
        issues.clippedInteractiveText.push((el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 80));
      }
    });

    document.querySelectorAll("*").forEach((el) => {
      const style = getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "sticky") return;
      if (el.classList.contains("home-vision-marquee")) return;
      if (el.closest("[aria-hidden='true']")) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      if (rect.left < -2 || rect.right > viewportWidth + 2) {
        issues.fixedOverflow.push(`${el.tagName.toLowerCase()} ${el.className || ""}`.trim().slice(0, 120));
      }
    });

    return issues;
  });
}

async function run() {
  const browser = await chromium.launch();
  const report = [];

  for (const viewport of viewports) {
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        deviceScaleFactor: viewport.isMobile ? 2 : 1,
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        try {
          sessionStorage.setItem("828:splash-seen", "1");
        } catch {}
      });

      const result = {
        viewport: viewport.name,
        route,
        status: 0,
        consoleErrors: [],
        requestFailures: [],
        image404s: [],
        snapshots: [],
        inspections: [],
        pass: false,
      };

      page.on("console", (message) => {
        if (message.type() === "error") result.consoleErrors.push(message.text());
      });
      page.on("requestfailed", (request) => {
        result.requestFailures.push(`${request.failure()?.errorText || "failed"} ${request.url()}`);
      });
      page.on("response", (response) => {
        const url = response.url();
        const isImage = /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(url) || url.includes("/images/");
        if (isImage && response.status() >= 400) {
          result.image404s.push(`${response.status()} ${url}`);
        }
      });

      try {
        const response = await page.goto(new URL(route, baseUrl).toString(), {
          waitUntil: "load",
          timeout: 60_000,
        });
        result.status = response?.status() || 0;
        await page.waitForTimeout(900);

        const maxScroll = await page.evaluate(() =>
          Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        );
        const positions = [0, maxScroll * 0.28, maxScroll * 0.58, maxScroll];
        for (let i = 0; i < positions.length; i++) {
          await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
          await page.waitForLoadState("networkidle", { timeout: 2500 }).catch(() => {});
          await page.waitForTimeout(900);
          result.inspections.push(await inspectPage(page));
          const shot = `${viewport.name}-${routeName(route)}-${i}.png`;
          await page.screenshot({ path: join(outDir, "screenshots", shot), fullPage: false });
          result.snapshots.push(shot);
        }

        result.pass =
          result.status === 200 &&
          result.consoleErrors.length === 0 &&
          result.requestFailures.length === 0 &&
          result.image404s.length === 0 &&
          result.inspections.every((item) =>
            !item.horizontalOverflow &&
            item.brokenImages.length === 0 &&
            item.clippedInteractiveText.length === 0 &&
            item.fixedOverflow.length === 0
          );
      } catch (error) {
        result.consoleErrors.push(error instanceof Error ? error.message : String(error));
      }

      report.push(result);
      await context.close();
      const mark = result.pass ? "PASS" : "FAIL";
      console.log(`${mark} ${viewport.name} ${route}`);
    }
  }

  await browser.close();
  const failed = report.filter((item) => !item.pass);
  writeFileSync(join(outDir, "report.json"), JSON.stringify({ baseUrl, failed, report }, null, 2));
  console.log(`\nReport: ${join(outDir, "report.json")}`);
  console.log(`Screenshots: ${join(outDir, "screenshots")}`);
  if (failed.length) {
    console.error(`Failed checks: ${failed.length}`);
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
