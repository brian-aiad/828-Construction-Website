#!/usr/bin/env node

import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.argv[2] || "http://localhost:4001";
const outDir = process.argv[3] || "output/playwright/deep-section-audit";
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
  { name: "iphone", width: 390, height: 844, mobile: true },
  { name: "ipad", width: 820, height: 1180, mobile: true },
  { name: "tablet-landscape", width: 1180, height: 820, mobile: false },
  { name: "desktop", width: 1280, height: 832, mobile: false },
  { name: "desktop-tall", width: 1600, height: 1200, mobile: false },
  { name: "wide", width: 1920, height: 1080, mobile: false },
  { name: "qhd", width: 2560, height: 1440, mobile: false },
];

mkdirSync(outDir, { recursive: true });

const slug = (value) =>
  value === "/" ? "home" : value.slice(1).replaceAll("/", "-");

async function inspect(page) {
  return page.evaluate(() => {
    const surfaces = Array.from(
      document.querySelectorAll("[data-stack-surface]")
    );
    const viewport = { width: innerWidth, height: innerHeight };
    const visibleElements = Array.from(
      document.querySelectorAll(
        "main h1, main h2, main h3, main h4, main p, main a, main button, main img"
      )
    ).filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return (
        rect.width > 1 &&
        rect.height > 1 &&
        rect.bottom > 0 &&
        rect.top < innerHeight &&
        rect.right > 0 &&
        rect.left < innerWidth &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        Number(style.opacity) > 0.02
      );
    });
    const visibleBounds = visibleElements.reduce(
      (bounds, element) => {
        const rect = element.getBoundingClientRect();
        bounds.top = Math.min(bounds.top, Math.max(0, rect.top));
        bounds.bottom = Math.max(
          bounds.bottom,
          Math.min(innerHeight, rect.bottom)
        );
        return bounds;
      },
      { top: innerHeight, bottom: 0 }
    );

    return {
      scrollY,
      viewport,
      horizontalOverflow:
        document.documentElement.scrollWidth > innerWidth + 2,
      visibleContent: visibleBounds,
      visibleContentHeight: Math.max(
        0,
        visibleBounds.bottom - visibleBounds.top
      ),
      surfaces: surfaces.map((surface) => {
        const section = surface.querySelector("[data-section]");
        const rect = surface.getBoundingClientRect();
        const style = getComputedStyle(surface);
        const sectionStyle = section ? getComputedStyle(section) : null;
        return {
          name: section?.getAttribute("data-section") || "unnamed",
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          position: style.position,
          background: style.backgroundColor,
          sectionBackground: sectionStyle?.backgroundColor || null,
          covered: surface.getAttribute("data-stack-covered"),
        };
      }),
    };
  });
}

async function run() {
  const browser = await chromium.launch();
  const report = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.mobile,
      deviceScaleFactor: 1,
    });

    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.addInitScript(() => {
        sessionStorage.setItem("828:splash-seen", "1");
      });
      await page.goto(new URL(route, baseUrl).toString(), {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      await page.waitForTimeout(600);
      await page.evaluate(() => scrollTo(0, 0));

      const positions = await page.evaluate(() => {
        const wrap = document.querySelector(
          "[data-editorial-flow], [data-about-flow], [data-services-flow], [data-adu-flow], [data-rem-flow], [data-consulting-flow], [data-portfolio-flow], [data-contact-flow]"
        );
        if (!wrap) return [];
        const wrapTop = wrap.getBoundingClientRect().top + scrollY;
        const surfaces = Array.from(
          wrap.querySelectorAll(":scope > [data-stack-surface]")
        );
        let top = wrapTop;
        return surfaces.map((surface, index) => {
          const section = surface.querySelector("[data-section]");
          const item = {
            index,
            name: section?.getAttribute("data-section") || `section-${index + 1}`,
            top,
            height: surface.offsetHeight,
          };
          top += surface.offsetHeight;
          return item;
        });
      });

      const routeReport = { route, viewport: viewport.name, errors, states: [] };
      for (const position of positions) {
        const targets = [
          { state: "rest", y: position.top },
          {
            state: "entry",
            y: Math.max(0, position.top - viewport.height * 0.48),
          },
        ];
        for (const target of targets) {
          await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), target.y);
          await page.waitForTimeout(450);
          const state = await inspect(page);
          const filename = `${viewport.name}-${slug(route)}-${String(position.index + 1).padStart(2, "0")}-${position.name || "unnamed"}-${target.state}.png`;
          await page.screenshot({ path: join(outDir, filename) });
          routeReport.states.push({
            section: position.name,
            expectedY: target.y,
            state: target.state,
            screenshot: filename,
            ...state,
          });
        }
      }
      report.push(routeReport);
      await page.close();
      console.log(`DONE ${viewport.name} ${route}`);
    }
    await context.close();
  }

  await browser.close();
  writeFileSync(
    join(outDir, "report.json"),
    JSON.stringify({ baseUrl, routes, viewports, report }, null, 2)
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
