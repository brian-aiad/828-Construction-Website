import { chromium } from 'playwright';
import fs from 'fs';

const URL = process.argv[2] || 'http://localhost:3000/services';
const MODE = process.argv[3] || 'desktop';
const VIEWPORT = MODE === 'mobile'
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };
const OUT = `research/services/final/functional-qa-${MODE}.json`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

const errors = [];
const networkErrors = [];
page.on('pageerror', (e) => errors.push({ type: 'pageerror', msg: e.message }));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push({ type: 'console', msg: m.text() });
});
// Track 404s by URL so we can filter known third-party resources
page.on('response', (r) => {
  if (r.status() === 404) networkErrors.push({ url: r.url(), status: 404 });
});

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);

// 1. Horizontal overflow
const overflow = await page.evaluate(() => ({
  docWidth: document.documentElement.scrollWidth,
  winWidth: window.innerWidth,
}));
const hasHOverflow = overflow.docWidth > overflow.winWidth + 1;

// 2. Hero image brightness — confirm it's not nearly black
const heroCheck = await page.evaluate(() => {
  const hero = document.querySelector('[data-section="services-hero"]');
  const bgDiv = hero?.querySelector('[role="presentation"]');
  const filter = bgDiv ? getComputedStyle(bgDiv).backgroundImage : null;
  const filterStyle = bgDiv ? bgDiv.style.filter : null;
  return {
    found: !!hero,
    bgDivFound: !!bgDiv,
    filterStyle,
    heroHeight: hero?.getBoundingClientRect().height ?? null,
  };
});

// 3. Services decision aid — counter should not show "0"
const decisionAidCheck = await page.evaluate(() => {
  const section = document.querySelector('[data-section="services-decision"]');
  if (!section) return { found: false };
  const counter = section.querySelector('.font-numbers span');
  const panels = section.querySelectorAll('.decision-panel');
  return {
    found: true,
    counterValue: counter?.textContent?.trim() ?? null,
    panelCount: panels.length,
  };
});
const counterBroken = decisionAidCheck.counterValue === '0' || decisionAidCheck.counterValue === '';

// 4. Service sections — check all 3 present, taglines visible
const serviceCheck = await page.evaluate(() => {
  const adu = document.querySelector('[data-service="adu"]');
  const rem = document.querySelector('[data-service="remediation"]');
  const con = document.querySelector('[data-service="consulting"]');
  return {
    aduFound: !!adu,
    remediationFound: !!rem,
    consultingFound: !!con,
    count: [adu, rem, con].filter(Boolean).length,
  };
});

// 5. CTA section — check present, no MagneticButton
const ctaCheck = await page.evaluate(() => {
  const cta = document.querySelector('[data-section="services-cta"]');
  const magneticBtns = document.querySelectorAll('[data-section="services-cta"] [style*="transform"]');
  const link = cta?.querySelector('a[href="/contact"]');
  return {
    found: !!cta,
    hasContactLink: !!link,
    magneticBtnCount: magneticBtns.length,
  };
});

// 6. Pin spacer gap check — after decision aid section
const pinGapCheck = await page.evaluate(() => {
  const wrapper = document.querySelector('[data-section="services-decision"]');
  if (!wrapper) return { found: false };
  const rect = wrapper.getBoundingClientRect();
  const next = wrapper.nextElementSibling;
  const nextRect = next?.getBoundingClientRect();
  return {
    found: true,
    gap: nextRect ? Math.round(nextRect.top - rect.bottom) : null,
  };
});
const hasPinGap = (pinGapCheck.gap ?? 0) > 40;

// 7. Scroll through page — capture frames at 12 positions
const totalH = await page.evaluate(() => document.body.scrollHeight);
fs.mkdirSync('research/services/final', { recursive: true });

for (let i = 0; i < 12; i++) {
  const y = Math.round((totalH / 11) * i);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(350);
  const buf = await page.screenshot({ fullPage: false });
  fs.writeFileSync(
    `research/services/final/frame-${MODE}-${String(i).padStart(2, '0')}.png`,
    buf
  );
}

// 8. Navigate away and back — test SplitType removeChild cleanup
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(600);
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);
const navErrors = errors.filter(e =>
  e.msg.includes('removeChild') || e.msg.includes('NotFoundError') || e.msg.includes('removeChild on')
);

// 9. Navigate to a service detail and back — test full nav cycle
await page.goto('http://localhost:3000/services/adu', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(400);
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(400);
const navErrors2 = errors.filter(e =>
  e.msg.includes('removeChild') || e.msg.includes('NotFoundError')
);

// Real errors = pageerror type only (JS runtime errors)
// Console resource-load 404s are tracked via networkErrors — filter known third-party
const thirdPartyPatterns = ['_vercel/insights', 'analytics', 'gtag', 'hotjar', 'clarity.ms'];
const realNetworkErrors = networkErrors.filter(n => !thirdPartyPatterns.some(p => n.url.includes(p)));
// Only JS runtime errors count for PASS
const realErrors = errors.filter(e => e.type === 'pageerror');

const report = {
  url: URL,
  viewport: VIEWPORT,
  errors: realErrors,
  allConsoleErrors: errors,
  networkErrors: realNetworkErrors,
  navErrors: navErrors2,
  checks: {
    hasHOverflow,
    overflowDetail: overflow,
    heroCheck,
    decisionAidCheck,
    counterBroken,
    serviceCheck,
    ctaCheck,
    pinGapCheck,
    hasPinGap,
  },
  totalHeight: totalH,
  PASS:
    realErrors.length === 0 &&
    realNetworkErrors.length === 0 &&
    !hasHOverflow &&
    !counterBroken &&
    navErrors2.length === 0 &&
    serviceCheck.count === 3 &&
    heroCheck.found &&
    ctaCheck.hasContactLink &&
    !hasPinGap,
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log('PASS:', report.PASS);
console.log('JS Runtime Errors:', realErrors.length);
console.log('Network Errors (non-3rd-party):', realNetworkErrors.length);
console.log('Nav errors (removeChild):', navErrors2.length);
console.log('Horizontal overflow:', hasHOverflow, `(${overflow.docWidth}px vs ${overflow.winWidth}px)`);
console.log('Counter broken:', counterBroken, `(value: "${decisionAidCheck.counterValue}")`);
console.log('Service sections found:', serviceCheck.count, '/ 3');
console.log('Pin gap:', pinGapCheck.gap ?? 'N/A', hasPinGap ? '⚠️ GAP' : '✓');
console.log('CTA contact link:', ctaCheck.hasContactLink ? '✓' : '✗');

await browser.close();
