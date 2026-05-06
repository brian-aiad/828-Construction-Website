import { chromium } from 'playwright';

const browser = await chromium.launch();

// Desktop — projects section
const d = await browser.newPage();
await d.setViewportSize({ width: 1440, height: 900 });
await d.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await d.waitForTimeout(1500);

const dpos = await d.evaluate(() => {
  const el = document.querySelector('[data-section="projects"]');
  return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
});
await d.evaluate(y => window.scrollTo(0, y + 300), dpos);
await d.waitForTimeout(800);
await d.screenshot({ path: 'research/after/projects-desktop-final.png' });

// Scroll to building-science
const bspos = await d.evaluate(() => {
  const el = document.querySelector('[data-section="building-science"]');
  return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
});
await d.evaluate(y => window.scrollTo(0, y), bspos);
await d.waitForTimeout(800);
await d.screenshot({ path: 'research/after/building-science-desktop-final.png' });

// Check for empty space - scroll 500px after building science
await d.evaluate(y => window.scrollTo(0, y + 500), bspos);
await d.waitForTimeout(600);
await d.screenshot({ path: 'research/after/building-science-post-desktop.png' });

// Mobile — projects
const m = await browser.newPage();
await m.setViewportSize({ width: 390, height: 844 });
await m.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await m.waitForTimeout(1500);

const mpos = await m.evaluate(() => {
  const el = document.querySelector('[data-section="projects"]');
  return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
});
await m.evaluate(y => window.scrollTo(0, y), mpos);
await m.waitForTimeout(800);
await m.screenshot({ path: 'research/after/projects-mobile-final.png' });

await m.evaluate(y => window.scrollTo(0, y + 600), mpos);
await m.waitForTimeout(800);
await m.screenshot({ path: 'research/after/projects-mobile-mid.png' });

// Footer full view
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 800));
await m.waitForTimeout(600);
await m.screenshot({ path: 'research/after/footer-mobile-full.png' });
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await m.waitForTimeout(600);
await m.screenshot({ path: 'research/after/footer-mobile-bottom.png' });

await browser.close();
console.log('Final check screenshots done.');
