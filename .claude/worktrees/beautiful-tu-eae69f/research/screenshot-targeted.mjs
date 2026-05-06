import { chromium } from 'playwright';

const browser = await chromium.launch();

// Desktop - find exact positions
const d = await browser.newPage();
await d.setViewportSize({ width: 1440, height: 900 });
await d.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await d.waitForTimeout(1500);

// Get section positions
const positions = await d.evaluate(() => {
  const sections = ['[data-section="projects"]', '[data-section="building-science"]', '[data-section="cta"]', '[data-section="footer"]'];
  return sections.map(sel => {
    const el = document.querySelector(sel);
    return { sel, top: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1 };
  });
});
console.log('Section positions:', JSON.stringify(positions));

for (const { sel, top } of positions) {
  if (top < 0) continue;
  const name = sel.replace('[data-section="', '').replace('"]', '');
  await d.evaluate(y => window.scrollTo(0, y), top);
  await d.waitForTimeout(800);
  await d.screenshot({ path: `research/after/${name}-exact-1440.png` });
  // Also 200px into the section (mid-scroll)
  await d.evaluate(y => window.scrollTo(0, y + 400), top);
  await d.waitForTimeout(600);
  await d.screenshot({ path: `research/after/${name}-mid-1440.png` });
}

// Mobile
const m = await browser.newPage();
await m.setViewportSize({ width: 390, height: 844 });
await m.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await m.waitForTimeout(1500);

const mpos = await m.evaluate(() => {
  const sections = ['[data-section="projects"]', '[data-section="building-science"]', '[data-section="footer"]'];
  return sections.map(sel => {
    const el = document.querySelector(sel);
    return { sel, top: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1 };
  });
});
console.log('Mobile positions:', JSON.stringify(mpos));

for (const { sel, top } of mpos) {
  if (top < 0) continue;
  const name = sel.replace('[data-section="', '').replace('"]', '');
  await m.evaluate(y => window.scrollTo(0, y), top);
  await m.waitForTimeout(800);
  await m.screenshot({ path: `research/after/${name}-exact-390.png` });
}

// Full footer mobile
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await m.waitForTimeout(500);
await m.screenshot({ path: 'research/after/page-bottom-390.png' });

await browser.close();
console.log('Targeted screenshots complete.');
