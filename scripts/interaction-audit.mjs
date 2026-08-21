#!/usr/bin/env node
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.argv[2] || "http://localhost:4001";
const outDir = join(".claude-work", "interaction-audit", new Date().toISOString().replace(/[:.]/g, "-"));
mkdirSync(join(outDir, "screenshots"), { recursive: true });

const devices = [
  { name: "iphone-se", viewport: { width: 375, height: 667 }, isMobile: true },
  { name: "iphone-15", viewport: { width: 393, height: 852 }, isMobile: true },
  { name: "ipad-portrait", viewport: { width: 820, height: 1180 }, isMobile: true },
  { name: "ipad-landscape", viewport: { width: 1180, height: 820 }, isMobile: false },
];

const routes = ["/", "/about", "/services", "/services/adu", "/services/remediation", "/services/consulting", "/portfolio", "/contact"];

function fail(result, message) {
  result.errors.push(message);
}

async function pageHealth(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const visibleInputs = Array.from(document.querySelectorAll("input, select, textarea, button, a"))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return (
          rect.width > 1 &&
          rect.height > 1 &&
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          Number(style.opacity) > 0.01 &&
          el.getAttribute("aria-hidden") !== "true" &&
          el.getAttribute("tabindex") !== "-1"
        );
      });
    return {
      overflow: html.scrollWidth > window.innerWidth + 2,
      scrollWidth: html.scrollWidth,
      viewportWidth: window.innerWidth,
      activeInvisible: visibleInputs.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.right < -2 || rect.left > window.innerWidth + 2;
      }),
      footerPresent: Boolean(document.querySelector("[data-footer-surface], footer")),
      headerPresent: Boolean(document.querySelector("header")),
    };
  });
}

async function scrollStress(page, result, label) {
  const max = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
  const positions = [0, max * 0.15, max * 0.38, max * 0.72, max, max * 0.45, 0];
  for (const y of positions) {
    await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), y);
    await page.waitForTimeout(220);
    const health = await pageHealth(page);
    if (health.overflow) fail(result, `${label}: horizontal overflow ${health.scrollWidth}/${health.viewportWidth}`);
    if (health.activeInvisible) fail(result, `${label}: visible interactive element outside viewport`);
    if (!health.headerPresent) fail(result, `${label}: missing header`);
  }
}

async function testMobileMenu(page, result, deviceName) {
  const menuButton = page.getByRole("button", { name: /menu|open menu|navigation/i }).first();
  if (!(await menuButton.count().catch(() => 0))) return;
  await menuButton.click();
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(outDir, "screenshots", `${deviceName}-menu-open.png`), fullPage: false });
  const navHealth = await pageHealth(page);
  if (navHealth.overflow) fail(result, `${deviceName}: mobile menu creates horizontal overflow`);
  const contactLink = page.locator(".fixed.inset-0.z-40 a[href='/contact']").first();
  if (!(await contactLink.count().catch(() => 0))) {
    fail(result, `${deviceName}: contact link not found in mobile menu`);
  } else {
    await contactLink.click();
    await page.waitForURL("**/contact", { timeout: 8000 }).catch(() => fail(result, `${deviceName}: contact menu navigation failed`));
  }
}

async function testContactForm(page, result, deviceName) {
  await page.goto(new URL("/contact", baseUrl).toString(), { waitUntil: "networkidle" });
  await page.locator("form[aria-label='Contact form']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /send message/i }).click();
  await page.waitForTimeout(350);
  const alerts = await page.locator("[role='alert']").count();
  if (alerts < 3) fail(result, `${deviceName}: contact form did not show field validation alerts`);
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  if (focused !== "name") fail(result, `${deviceName}: invalid form did not focus first required field`);
  await page.screenshot({ path: join(outDir, "screenshots", `${deviceName}-contact-errors.png`), fullPage: false });
}

async function runDevice(browser, device, reducedMotion = false) {
  const context = await browser.newContext({
    viewport: device.viewport,
    isMobile: device.isMobile,
    deviceScaleFactor: device.isMobile ? 2 : 1,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    try { sessionStorage.setItem("828:splash-seen", "1"); } catch {}
  });
  const result = { device: device.name, reducedMotion, errors: [], consoleErrors: [], requestFailures: [] };
  page.on("console", (msg) => {
    if (msg.type() === "error") result.consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText || "failed";
    const url = request.url();
    const isImage =
      /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(url) ||
      url.includes("/images/") ||
      url.includes("/_next/image?");
    if (errorText === "net::ERR_ABORTED" && isImage) return;
    result.requestFailures.push(`${errorText} ${url}`);
  });

  for (const route of routes) {
    await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(600);
    await scrollStress(page, result, `${device.name}${reducedMotion ? "-reduced" : ""} ${route}`);
  }

  if (device.viewport.width < 1024 && !reducedMotion) {
    await page.goto(new URL("/", baseUrl).toString(), { waitUntil: "networkidle" });
    await testMobileMenu(page, result, device.name);
  }
  if (!reducedMotion) await testContactForm(page, result, device.name);

  await context.close();
  return result;
}

async function main() {
  const browser = await chromium.launch();
  const results = [];
  for (const device of devices) {
    results.push(await runDevice(browser, device, false));
  }
  for (const device of [devices[0], devices[2]]) {
    results.push(await runDevice(browser, device, true));
  }
  await browser.close();

  const failed = results.filter((r) => r.errors.length || r.consoleErrors.length || r.requestFailures.length);
  writeFileSync(join(outDir, "report.json"), JSON.stringify({ baseUrl, failed, results }, null, 2));
  for (const result of results) {
    const status = result.errors.length || result.consoleErrors.length || result.requestFailures.length ? "FAIL" : "PASS";
    console.log(`${status} ${result.device}${result.reducedMotion ? " reduced-motion" : ""}`);
    [...result.errors, ...result.consoleErrors.slice(0, 3), ...result.requestFailures.slice(0, 3)].forEach((item) => console.log(`  - ${item}`));
  }
  console.log(`Report: ${join(outDir, "report.json")}`);
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
