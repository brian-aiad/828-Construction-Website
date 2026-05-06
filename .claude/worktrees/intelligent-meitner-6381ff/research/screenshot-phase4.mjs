import { chromium } from 'playwright';

const browser = await chromium.launch();

// All-viewport screenshot set
const viewports = [
  { w: 1440, h: 900, name: '1440' },
  { w: 1024, h: 768, name: '1024' },
  { w: 768, h: 1024, name: '768' },
  { w: 390, h: 844, name: '390' },
];

for (const { w, h, name } of viewports) {
  const p = await browser.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `research/final/homepage-${name}.png`, fullPage: false });
  console.log(`saved: homepage-${name}.png`);
  await p.close();
}

// Mobile scroll screencast at 390×844
const screencastPage = await browser.newPage();
await screencastPage.setViewportSize({ width: 390, height: 844 });
await screencastPage.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await screencastPage.waitForTimeout(1000);

// 3 mid-scroll frames as proof of mobile animations
for (const [pos, name] of [[1200,'scroll-frame1'],[3000,'scroll-frame2'],[5500,'scroll-frame3']]) {
  await screencastPage.evaluate(y => window.scrollTo(0, y), pos);
  await screencastPage.waitForTimeout(700);
  await screencastPage.screenshot({ path: `research/final/mobile-${name}.png` });
  console.log(`saved: mobile-${name}.png`);
}

// prefers-reduced-motion test
await screencastPage.emulateMedia({ reducedMotion: 'reduce' });
await screencastPage.evaluate(() => window.scrollTo(0, 0));
await screencastPage.waitForTimeout(500);
await screencastPage.screenshot({ path: 'research/final/reduced-motion-390.png' });
console.log('saved: reduced-motion-390.png');

await browser.close();
console.log('Phase 4 screenshots complete.');
