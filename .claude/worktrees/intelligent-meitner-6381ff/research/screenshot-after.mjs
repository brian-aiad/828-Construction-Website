import { chromium } from 'playwright';

const browser = await chromium.launch();

async function shot(page, path) {
  await page.screenshot({ path, fullPage: false });
  console.log('saved:', path);
}

// Desktop 1440×900
const d = await browser.newPage();
await d.setViewportSize({ width: 1440, height: 900 });
await d.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await d.waitForTimeout(1500);

await d.screenshot({ path: 'research/after/homepage-1440-full.png', fullPage: true });
await shot(d, 'research/after/hero-1440.png');

for (const [name, y] of [['services',900],['about',2000],['projects',3200],['differentiator',5000],['cta',6800]]) {
  await d.evaluate(y => window.scrollTo(0, y), y);
  await d.waitForTimeout(700);
  await shot(d, `research/after/${name}-1440.png`);
}
await d.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await d.waitForTimeout(500);
await shot(d, 'research/after/footer-1440.png');

// Mobile 390×844
const m = await browser.newPage();
await m.setViewportSize({ width: 390, height: 844 });
await m.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await m.waitForTimeout(1500);

await m.screenshot({ path: 'research/after/homepage-390-full.png', fullPage: true });
await shot(m, 'research/after/hero-390.png');

for (const [name, y] of [['services',844],['about',2400],['projects',4200],['differentiator',5800],['cta',7500]]) {
  await m.evaluate(y => window.scrollTo(0, y), y);
  await m.waitForTimeout(700);
  await shot(m, `research/after/${name}-390.png`);
}
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await m.waitForTimeout(500);
await shot(m, 'research/after/footer-390.png');

await browser.close();
console.log('After screenshots complete.');
