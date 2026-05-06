import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch();

async function shot(page, path, opts = {}) {
  await page.screenshot({ path, fullPage: opts.fullPage ?? false, ...opts });
  console.log('saved:', path);
}

// Desktop 1440×900
const d = await browser.newPage();
await d.setViewportSize({ width: 1440, height: 900 });
await d.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await d.waitForTimeout(1500);

// Full page
await shot(d, 'research/before/homepage-1440-full.png', { fullPage: true });
// Above fold
await shot(d, 'research/before/hero-1440.png');
// Scroll to each section
for (const [name, y] of [['services',900],['about',2000],['projects',3200],['differentiator',4400],['cta',5800]]) {
  await d.evaluate(y => window.scrollTo(0, y), y);
  await d.waitForTimeout(600);
  await shot(d, `research/before/${name}-1440.png`);
}
// Footer
await d.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await d.waitForTimeout(400);
await shot(d, 'research/before/footer-1440.png');

// Mobile 390×844
const m = await browser.newPage();
await m.setViewportSize({ width: 390, height: 844 });
await m.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await m.waitForTimeout(1500);

await shot(m, 'research/before/homepage-390-full.png', { fullPage: true });
await shot(m, 'research/before/hero-390.png');
for (const [name, y] of [['services',844],['about',2400],['projects',4200],['differentiator',6000],['cta',7500]]) {
  await m.evaluate(y => window.scrollTo(0, y), y);
  await m.waitForTimeout(600);
  await shot(m, `research/before/${name}-390.png`);
}
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await m.waitForTimeout(400);
await shot(m, 'research/before/footer-390.png');

await browser.close();
console.log('Phase 0 screenshots complete.');
