import { chromium } from 'playwright';
import fs from 'fs';

const URL = process.argv[2] || 'http://localhost:3000/';
const VIEWPORT = process.argv[3] === 'mobile'
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };
const OUT = `research/home-fixes/functional-qa-${process.argv[3] || 'desktop'}.json`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push({ type: 'pageerror', msg: e.message }));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push({ type: 'console', msg: m.text() });
});

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

// 1. Horizontal overflow
const overflow = await page.evaluate(() => ({
  docWidth: document.documentElement.scrollWidth,
  winWidth: window.innerWidth,
}));
const hasHOverflow = overflow.docWidth > overflow.winWidth + 1;

// 2. Hero visibility — check image and overlay are not fully black
const heroCheck = await page.evaluate(() => {
  const hero = document.querySelector('[data-testid="hero-section"], [data-section="hero"], .sticky');
  const img = document.querySelector('[data-section="hero"] img, .sticky img');
  return {
    found: !!hero,
    imgFound: !!img,
    imgFilter: img ? getComputedStyle(img).filter : null,
  };
});

// 3. Counter defaults — check about-preview stats show correct values (not 0 or blank)
const counters = await page.evaluate(() => {
  const section = document.querySelector('[data-section="about"]');
  if (!section) return { found: false, values: [] };
  const nums = Array.from(section.querySelectorAll('.font-numbers span, .font-numbers'));
  return {
    found: true,
    values: nums.map(el => el.textContent?.trim()).filter(Boolean),
  };
});
const brokenCounters = (counters.values || []).filter(v => v === '0' || v === '0+' || v === '' || v === '0');

// 4. BuildingScience pin gap — check for unexpected whitespace after pin section
const pinGap = await page.evaluate(() => {
  const bs = document.querySelector('[data-section="building-science"]');
  if (!bs) return { found: false };
  const rect = bs.getBoundingClientRect();
  const next = bs.nextElementSibling;
  const nextRect = next ? next.getBoundingClientRect() : null;
  return {
    found: true,
    bsBottom: rect.bottom,
    nextTop: nextRect?.top ?? null,
    gap: nextRect ? Math.round(nextRect.top - rect.bottom) : null,
  };
});

// 5. Scroll through full page, capture frames
const totalH = await page.evaluate(() => document.body.scrollHeight);
fs.mkdirSync('research/home-fixes', { recursive: true });

for (let i = 0; i < 14; i++) {
  const y = Math.round((totalH / 13) * i);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ fullPage: false });
  fs.writeFileSync(
    `research/home-fixes/frame-${process.argv[3] || 'desktop'}-${String(i).padStart(2, '0')}.png`,
    buf
  );
}

// 6. Navigate away and back — test removeChild (SplitType cleanup)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);
const navErrors = errors.filter(e => e.msg.includes('removeChild') || e.msg.includes('NotFoundError'));

const report = {
  url: URL,
  viewport: VIEWPORT,
  errors,
  navErrors,
  hasHOverflow,
  overflowDetail: overflow,
  heroCheck,
  counters,
  brokenCounters,
  pinGap,
  totalHeight: totalH,
  PASS: errors.length === 0 && !hasHOverflow && brokenCounters.length === 0 && navErrors.length === 0,
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log('PASS:', report.PASS);
console.log('Errors:', errors.length);
console.log('Nav errors (removeChild):', navErrors.length);
console.log('Horizontal overflow:', hasHOverflow, `(${overflow.docWidth}px vs ${overflow.winWidth}px)`);
console.log('Broken counters:', brokenCounters.length, JSON.stringify(counters.values));
console.log('BuildingScience gap:', pinGap.gap ?? 'N/A');

await browser.close();
