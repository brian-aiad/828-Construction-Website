import { expect, test, type Page } from "@playwright/test";

async function mockChallenge(page: Page) {
  let challengeRequests = 0;
  await page.route("**/api/contact/challenge", async (route) => {
    challengeRequests++;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: `browser-challenge-${challengeRequests}`, minWaitMs: 0 }),
    });
  });
  return () => challengeRequests;
}

async function waitForFormHydration(challengeRequests: () => number) {
  await expect.poll(challengeRequests, { timeout: 10_000 }).toBeGreaterThan(0);
}

async function fillMainForm(page: Page) {
  await page.locator("#cf-name").fill("Browser Regression Customer");
  await page.locator("#cf-phone").fill("(310) 555-0182");
  await page.locator("#cf-email").fill("browser.regression@example.com");
  await page.locator("#cf-service").selectOption("ADU Construction");
  await page
    .locator("#cf-message")
    .fill("Browser regression inquiry with enough detail to verify the complete form flow.");
}

test.describe("contact form browser hardening", () => {
  test("desktop form remains clickable, validates, debounces, and confirms a reference", async ({
    page,
  }) => {
    const challengeRequests = await mockChallenge(page);
    let postCount = 0;
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      postCount++;
      const submitted = route.request().postDataJSON() as Record<string, unknown>;
      expect(String(submitted.challengeToken)).toMatch(/^browser-challenge-/);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, reference: "828-BROWSER" }),
      });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await waitForFormHydration(challengeRequests);

    const submit = page.getByRole("button", { name: /send message/i });
    await submit.click();
    await expect(
      page.getByText("Please complete the highlighted required fields before sending.")
    ).toBeVisible();
    await expect(page.locator("#cf-name")).toBeFocused();
    expect(postCount).toBe(0);

    await fillMainForm(page);
    await submit.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });

    await expect(page.getByRole("heading", { name: "Message Received" })).toBeVisible();
    await expect(page.getByText("Confirmation 828-BROWSER")).toBeVisible();
    expect(postCount).toBe(1);
  });

  test("expired browser challenge is refreshed and retried once", async ({ page }) => {
    const challengeRequests = await mockChallenge(page);
    let postCount = 0;
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      postCount++;
      if (postCount === 1) {
        await route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Security check expired.",
            code: "challenge_expired",
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, reference: "828-RETRIED" }),
      });
    });

    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await waitForFormHydration(challengeRequests);
    await fillMainForm(page);
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText("Confirmation 828-RETRIED")).toBeVisible();
    expect(postCount).toBe(2);
    expect(challengeRequests()).toBeGreaterThanOrEqual(2);
  });

  test("rate limits and provider outages show actionable recovery without losing the page", async ({
    page,
  }) => {
    const challengeRequests = await mockChallenge(page);
    let status = 429;
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            status === 429
              ? "Too many requests. Please try again in a few minutes."
              : "Failed to send email. Please call us directly.",
        }),
      });
    });

    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await waitForFormHydration(challengeRequests);
    await fillMainForm(page);
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/too many requests/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "213-828-2388" }).last()).toBeVisible();

    status = 503;
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/failed to send email/i)).toBeVisible();
    await expect(page.locator("body")).toBeVisible();
  });

  test("mobile form validates and completes without overflow", async ({ page }) => {
    const challengeRequests = await mockChallenge(page);
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, reference: "828-MOBILE" }),
      });
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await waitForFormHydration(challengeRequests);
    await fillMainForm(page);
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText("Confirmation 828-MOBILE")).toBeVisible();
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  });

});
