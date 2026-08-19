#!/usr/bin/env node

import { chromium, firefox, webkit } from "@playwright/test";

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

const [
  baseUrl = "http://localhost:3001",
  name = "phone",
  widthValue = "390",
  heightValue = "844",
  pointerValue = "touch",
  motionValue = "full",
  engineValue = "chromium",
] = process.argv.slice(2);
const width = Number.parseInt(widthValue, 10);
const height = Number.parseInt(heightValue, 10);
const hasTouch = pointerValue === "touch";
const reducedMotion = motionValue === "reduced";
const expectedMode = reducedMotion
  ? "none"
  : width >= 1280 && !(hasTouch && width <= 1366)
    ? "desktop"
    : "touch";

function unique(values) {
  return [...new Set(values)];
}

async function auditRoute(context, route) {
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("requestfailed", (request) => {
    requestFailures.push(
      `${request.failure()?.errorText || "failed"} ${request.url()}`
    );
  });

  const failures = [];
  try {
    const response = await page.goto(new URL(route, baseUrl).toString(), {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    if (response?.status() !== 200) failures.push(`HTTP ${response?.status()}`);
    // Home restores scroll during hydration. Wait for the load boundary so the
    // audit's own jump cannot be overwritten by that one-time reset.
    await page.waitForLoadState("load");
    await page.waitForFunction(
      (mode) =>
        document.querySelector("[data-stack-mode]")?.dataset.stackMode === mode,
      expectedMode,
      { timeout: 10_000 }
    );
    // `none` is both the SSR default and the reduced-motion final mode, so a
    // mode-only readiness check can resolve before hydration in WebKit/Firefox.
    await page.waitForTimeout(reducedMotion ? 1600 : 500);
    await page.evaluate(() => {
      document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    });

    const initial = await page.evaluate(() => {
      const flow = document.querySelector("[data-stack-mode]");
      const surfaces = [...flow.querySelectorAll("[data-stack-surface]")];
      return {
        count: surfaces.length,
        mode: flow.dataset.stackMode,
        overflow: document.documentElement.scrollWidth - innerWidth,
        positions: uniqueValues(surfaces.map((surface) =>
          getComputedStyle(surface).position
        )),
        runway: document.querySelector("[data-footer-runway]")
          ?.getBoundingClientRect().height || 0,
      };

      function uniqueValues(values) {
        return [...new Set(values)];
      }
    });
    if (!initial.count) failures.push("no stack surfaces");
    if (initial.mode !== expectedMode) failures.push(`mode ${initial.mode}`);
    if (initial.overflow > 1) failures.push(`overflow ${initial.overflow}`);
    const expectedPosition = expectedMode === "none" ? "relative" : "sticky";
    if (initial.positions.some((position) => position !== expectedPosition)) {
      failures.push(`positions ${initial.positions.join(",")}`);
    }
    if (expectedMode === "touch" && initial.runway > 1) {
      failures.push(`touch runway ${initial.runway}`);
    }
    if (expectedMode === "desktop" && Math.abs(initial.runway - (height - 52)) > 2) {
      failures.push(`desktop runway ${initial.runway}`);
    }

    if (expectedMode === "touch") {
      for (let index = 1; index < initial.count; index += 1) {
        const target = await page.evaluate((surfaceIndex) => {
          const flow = document.querySelector("[data-stack-mode]");
          const surfaces = [...flow.querySelectorAll("[data-stack-surface]")];
          const flowTop = flow.getBoundingClientRect().top + scrollY;
          const priorHeight = surfaces
            .slice(0, surfaceIndex)
            .reduce((total, surface) => total + surface.offsetHeight, 0);
          return flowTop + priorHeight - innerHeight * 0.52;
        }, index);
        await page.evaluate((y) => {
          document.documentElement.style.setProperty(
            "scroll-behavior",
            "auto",
            "important"
          );
          const lenis = window.__lenis828;
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else scrollTo(0, y);
        }, target);
        await page.waitForTimeout(300);
        const junction = await page.evaluate((surfaceIndex) => {
          const flow = document.querySelector("[data-stack-mode]");
          const surfaces = [...flow.querySelectorAll("[data-stack-surface]")];
          const previous = surfaces[surfaceIndex - 1];
          const next = surfaces[surfaceIndex];
          return {
            nextTop: next.getBoundingClientRect().top,
            veil: Number.parseFloat(
              getComputedStyle(previous.querySelector("[data-cover-veil]")).opacity
            ),
          };
        }, index);
        if (junction.nextTop < height * 0.48 || junction.nextTop > height * 0.56) {
          failures.push(`junction ${index} top ${junction.nextTop.toFixed(1)}`);
        }
        if (junction.veil <= 0) failures.push(`junction ${index} veil`);
      }
    }

    await page.evaluate(() => {
      const target = document.documentElement.scrollHeight - innerHeight;
      const lenis = window.__lenis828;
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else scrollTo(0, target);
    });
    await page.waitForTimeout(engineValue === "firefox" ? 2500 : 900);
    const bottom = await page.evaluate(() => {
      const footerRect = document
        .querySelector("[data-footer-surface]")
        ?.getBoundingClientRect();
      const visibleHiddenReveals = [
        ...document.querySelectorAll("[data-motion-reveal],[data-gsap-reveal]"),
      ].filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          rect.bottom > 64 &&
          rect.top < innerHeight - 24 &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          !element.closest("[data-stack-covered]") &&
          Number.parseFloat(style.opacity) < 0.02
        );
      }).length;
      const brokenImages = [...document.images].filter((image) => {
        const rect = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        const occludedByFooter = Boolean(
          footerRect &&
          footerRect.bottom > 0 &&
          footerRect.top <= Math.max(64, rect.top)
        );
        return (
          rect.bottom > 0 &&
          rect.top < innerHeight &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          !image.closest("[data-stack-covered]") &&
          !occludedByFooter &&
          (!image.complete || image.naturalWidth === 0)
        );
      }).length;
      return {
        y: scrollY,
        max: document.documentElement.scrollHeight - innerHeight,
        overflow: document.documentElement.scrollWidth - innerWidth,
        visibleHiddenReveals,
        brokenImages,
      };
    });
    if (Math.abs(bottom.y - bottom.max) > 3) {
      failures.push(`bottom ${bottom.y}/${bottom.max}`);
    }
    if (bottom.overflow > 1) failures.push(`bottom overflow ${bottom.overflow}`);
    if (bottom.visibleHiddenReveals) {
      failures.push(`hidden reveals ${bottom.visibleHiddenReveals}`);
    }
    if (bottom.brokenImages) failures.push(`broken images ${bottom.brokenImages}`);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  if (consoleErrors.length) {
    failures.push(`console errors ${unique(consoleErrors).length}`);
  }
  if (requestFailures.length) {
    failures.push(`request failures ${unique(requestFailures).length}`);
  }
  await page.close();
  return {
    route,
    pass: failures.length === 0,
    failures,
    consoleErrors: unique(consoleErrors),
    requestFailures: unique(requestFailures),
  };
}

const browserTypes = { chromium, firefox, webkit };
const browserType = browserTypes[engineValue];
if (!browserType) {
  throw new Error(`Unknown browser engine: ${engineValue}`);
}
const browser = await browserType.launch();
const contextOptions = {
  viewport: { width, height },
  hasTouch,
  deviceScaleFactor: 1,
  reducedMotion: reducedMotion ? "reduce" : "no-preference",
};
// Playwright's Firefox backend does not implement the `isMobile` context
// option. Touch and viewport emulation still exercise the responsive contract.
if (engineValue !== "firefox") {
  contextOptions.isMobile = hasTouch && width < 768;
}
const context = await browser.newContext(contextOptions);
await context.addInitScript(() => {
  sessionStorage.setItem("828-splash-seen", "true");
  sessionStorage.setItem("828:splash-seen", "1");
});

const results = [];
for (const route of routes) {
  results.push(await auditRoute(context, route));
}
await context.close();
await browser.close();

const failed = results.filter((result) => !result.pass);
console.log(
  JSON.stringify(
    {
      viewport: {
        name,
        width,
        height,
        pointer: pointerValue,
        motion: motionValue,
        engine: engineValue,
      },
      expectedMode,
      passed: results.length - failed.length,
      total: results.length,
      failed,
    },
    null,
    2
  )
);
if (failed.length) process.exit(1);
