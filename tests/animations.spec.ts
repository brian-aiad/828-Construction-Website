import { test, expect } from "@playwright/test";

test.describe("Scroll Animations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // ── Desktop ───────────────────────────────────────────────────────────────

  test("Desktop: Hero parallax background moves on scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const bg = page.locator("div[style*='height: 130%']").first();
    const before = await bg.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);

    const after = await bg.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // Transform should have changed as the parallax moved
    expect(before).not.toBe(after);
  });

  test("Desktop: Scroll progress bar advances", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const bar = page.locator("#scroll-progress");
    await expect(bar).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    const scaleX = await bar.evaluate((el) => {
      const t = window.getComputedStyle(el).transform;
      // matrix(scaleX, 0, 0, scaleY, tx, ty)
      const match = t.match(/matrix\(([^,]+)/);
      return match ? parseFloat(match[1]) : 0;
    });

    expect(scaleX).toBeGreaterThan(0.1);
  });

  test("Desktop: Service cards become visible after scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const servicesSection = page.locator("section").filter({ hasText: "What We Do" }).first();
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const cards = page.locator(".service-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test("Desktop: Project cards become visible after scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const projectsSection = page.locator("section").filter({ hasText: "Recent Work" }).first();
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const cards = page.locator(".project-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  // ── Mobile ────────────────────────────────────────────────────────────────

  test("Mobile: Content is immediately visible without animation delay", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    // On mobile, FadeIn renders a plain <div> — content should be visible right away
    const heroText = page.locator("h1").filter({ hasText: "Built with Intent" });
    await expect(heroText).toBeVisible();

    // Opacity should be 1 (not animating from 0)
    const opacity = await heroText.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeCloseTo(1, 1);
  });

  test("Mobile: Service section text is readable on load", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const servicesHeading = page.locator("h2").filter({ hasText: "What We Do" });
    await servicesHeading.scrollIntoViewIfNeeded();

    const opacity = await servicesHeading.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeCloseTo(1, 1);
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  test("Reduced motion: Transitions are near-instant", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const prefersReduced = await page.evaluate(() =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    expect(prefersReduced).toBe(true);

    // CSS rule in globals.css should force transitions to 0.01ms
    const transitionDuration = await page.locator("body").evaluate((el) =>
      window.getComputedStyle(el).transitionDuration
    );
    // "0.01ms" or "0s" — both acceptable
    const ms = parseFloat(transitionDuration) * (transitionDuration.includes("ms") ? 1 : 1000);
    expect(ms).toBeLessThan(20);
  });

  // ── Performance ───────────────────────────────────────────────────────────

  test("Page load time is under 3 seconds", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  // ── Header ────────────────────────────────────────────────────────────────

  test("Desktop: Live timestamp is shown in header", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Timestamp appears after hydration — wait up to 3s
    const timestamp = page.locator("span").filter({ hasText: /Torrance, CA · \d{2}:\d{2}:\d{2}/ });
    await expect(timestamp).toBeVisible({ timeout: 3000 });
  });

  test("Desktop: Header becomes opaque after scrolling on homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const header = page.locator("header").first();

    // Initially transparent on homepage
    const initialBg = await header.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(initialBg).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);

    // After scrolling, background becomes dark
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(600);

    const scrolledBg = await header.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(scrolledBg).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  });
});
