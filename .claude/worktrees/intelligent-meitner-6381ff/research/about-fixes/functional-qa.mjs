import { chromium } from 'playwright';
import fs from 'fs';

const URL = process.argv[2] || 'http://localhost:3000/about';
const VIEWPORT = process.argv[3] === 'mobile'
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };
const OUT = `research/about-fixes/functional-qa-${process.argv[3] || 'desktop'}.json`;

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

// 2. Hero visibility
const heroBrightness = await page.evaluate(() => {
  const hero = document.querySelector('[data-section="about-hero"]');
  if (!hero) return { found: false };
  const img = hero.querySelector('[role="presentation"]');
  const overlay = hero.querySelector('.bg-gradient-to-t');
  return {
    found: true,
    imgFilter: img ? getComputedStyle(img).filter : null,
    hasImg: !!img,
  };
});

// 3. Counter defaults — check for 0 or 1 as unintended placeholders
const counters = await page.evaluate(() => {
  const section = document.querySelector('[data-section="about-stats"]');
  if (!section) return [];
  return Array.from(section.querySelectorAll('.font-numbers span')).map(el => ({
    text: el.textContent?.trim(),
  }));
});
const brokenCounters = counters.filter(c =>
  c.text === '0' || c.text === '' || c.text === 'null'
);

// 4. Pin overlap — check philosophy section for multiple visible panels
const pinIssues = await page.evaluate(() => {
  const section = document.querySelector('[data-section="about-philosophy-pinned"]');
  if (!section) return [];
  const panels = section.querySelectorAll('.absolute.inset-0[style*="opacity"]');
  const visible = Array.from(panels).filter(p => {
    const opacity = parseFloat(p.style.opacity ?? '1');
    return opacity > 0.5;
  });
  if (visible.length > 1) {
    return [{ visibleCount: visible.length, msg: 'Multiple panels visible simultaneously' }];
  }
  return [];
});

// 5. Scroll through page, capture frames
const totalH = await page.evaluate(() => document.body.scrollHeight);
fs.mkdirSync('research/about-fixes', { recursive: true });

for (let i = 0; i < 12; i++) {
  const y = Math.round((totalH / 11) * i);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(350);
  const buf = await page.screenshot({ fullPage: false });
  fs.writeFileSync(
    `research/about-fixes/frame-${process.argv[3] || 'desktop'}-${String(i).padStart(2, '0')}.png`,
    buf
  );
}

// 6. Navigate away and back — test removeChild
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
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
  heroBrightness,
  counters,
  brokenCounters,
  pinIssues,
  totalHeight: totalH,
  PASS: errors.length === 0 && !hasHOverflow && brokenCounters.length === 0 && pinIssues.length === 0 && navErrors.length === 0,
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log('PASS:', report.PASS);
console.log('Errors:', errors.length);
console.log('Nav errors (removeChild):', navErrors.length);
console.log('Horizontal overflow:', hasHOverflow, `(${overflow.docWidth}px vs ${overflow.winWidth}px)`);
console.log('Broken counters:', brokenCounters.length, counters.map(c => c.text).join(', '));
console.log('Pin overlap issues:', pinIssues.length);

await browser.close();
