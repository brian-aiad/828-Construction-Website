#!/usr/bin/env node
/**
 * 828 Construction — Production Preflight Checker
 *
 * Usage:
 *   node .claude-work/scripts/preflight.mjs           # full build + all routes
 *   node .claude-work/scripts/preflight.mjs --fast    # skip build, server must be on :4001
 *   node .claude-work/scripts/preflight.mjs --route / # test one route only (with --fast)
 *   node .claude-work/scripts/preflight.mjs --desktop # desktop only (skip mobile)
 *   node .claude-work/scripts/preflight.mjs --mobile  # mobile only (skip desktop)
 *
 * Exit code 0 = all checks pass. Exit code 1 = one or more failures.
 */

import { chromium } from 'playwright';
import { execSync, spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// ─── Configuration ────────────────────────────────────────────────────────────

const PORT = 4001;
const BASE_URL = `http://localhost:${PORT}`;

const ALL_ROUTES = [
  { path: '/',                    name: 'Home' },
  { path: '/about',               name: 'About' },
  { path: '/services',            name: 'Services' },
  { path: '/services/adu',        name: 'ADU' },
  { path: '/services/remediation',name: 'Remediation' },
  { path: '/services/consulting', name: 'Consulting' },
  { path: '/process',             name: 'Process' },
  { path: '/projects',            name: 'Projects' },
  { path: '/contact',             name: 'Contact' },
];

const DESKTOP = { name: 'desktop', width: 1440, height: 900 };
const MOBILE  = { name: 'mobile',  width: 390,  height: 844 };

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const FAST         = args.includes('--fast');
const DESKTOP_ONLY = args.includes('--desktop');
const MOBILE_ONLY  = args.includes('--mobile');
const routeArg     = args.find(a => a.startsWith('/'));
const routes       = routeArg ? ALL_ROUTES.filter(r => r.path === routeArg) : ALL_ROUTES;
const viewports    = DESKTOP_ONLY ? [DESKTOP] : MOBILE_ONLY ? [MOBILE] : [DESKTOP, MOBILE];

if (routeArg && routes.length === 0) {
  console.error(`Unknown route: ${routeArg}`);
  process.exit(1);
}

// ─── Output directory ─────────────────────────────────────────────────────────

const ts     = new Date().toISOString().slice(0, 16).replace('T', '-').replace(/:/g, '-');
const outDir = join('.claude-work', 'preflight', ts);
mkdirSync(join(outDir, 'screenshots'), { recursive: true });

// ─── Server management ────────────────────────────────────────────────────────

let serverProcess = null;

async function startServer() {
  console.log(`\n  Starting next start on :${PORT}...`);
  serverProcess = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Server failed to start within 90s')),
      90_000
    );
    const check = (data) => {
      const str = data.toString();
      if (str.includes('Ready') || str.includes('started server') || str.includes(String(PORT))) {
        clearTimeout(timeout);
        resolve();
      }
    };
    serverProcess.stdout.on('data', check);
    serverProcess.stderr.on('data', check);
    serverProcess.on('error', (e) => { clearTimeout(timeout); reject(e); });
  });

  // Extra buffer for GSAP/Lenis module loads
  await sleep(1500);
}

function stopServer() {
  if (serverProcess) {
    try { serverProcess.kill('SIGTERM'); } catch {}
    serverProcess = null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Per-route test ───────────────────────────────────────────────────────────

async function testRoute(browser, routeObj, viewport) {
  const { path, name } = routeObj;
  const url = `${BASE_URL}${path}`;

  const result = {
    route: path,
    name,
    viewport: viewport.name,
    errors:          [],
    image404s:       [],
    hasHOverflow:    false,
    invisibleImages: [],
    brokenCounters:  [],
    PASS: false,
  };

  const ctx  = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await ctx.newPage();

  // ── Collect runtime errors ────────────────────────────────────────────────
  page.on('pageerror', (e) => result.errors.push(`JS: ${e.message}`));
  page.on('console',   (m) => {
    if (m.type() === 'error') {
      const txt = m.text();
      // Ignore known benign Next.js hydration hints and GA noise
      if (!txt.includes('google-analytics') && !txt.includes('gtag')) {
        result.errors.push(`Console: ${txt}`);
      }
    }
  });

  // ── Collect image 404s ────────────────────────────────────────────────────
  page.on('response', (res) => {
    const u   = res.url();
    const st  = res.status();
    const isImg = /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?|$)/i.test(u) || u.includes('/images/');
    if (st === 404 && isImg) result.image404s.push(u.split('/').slice(-3).join('/'));
  });

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
    const status   = response?.status() ?? 0;
    if (status !== 200) result.errors.push(`HTTP ${status}`);

    // Wait for GSAP + Lenis to initialize
    await sleep(2500);

    // ── Horizontal overflow ───────────────────────────────────────────────
    const { docWidth, winWidth } = await page.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      winWidth: window.innerWidth,
    }));
    result.hasHOverflow = docWidth > winWidth + 2;

    // ── Trigger ScrollTrigger (scroll 1px and back) ───────────────────────
    await page.evaluate(() => window.scrollTo(0, 1));
    await sleep(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);

    // ── Check for above-fold invisible images (Fix 14 / Fix 16) ──────────
    result.invisibleImages = await page.evaluate((vpH) => {
      return Array.from(document.querySelectorAll('img'))
        .filter((img) => {
          const rect = img.getBoundingClientRect();
          // Only check images in the top 1.5 viewports
          if (rect.top > vpH * 1.5 || rect.bottom < -100) return false;
          if (rect.width === 0 || rect.height === 0)       return false;

          const cs = getComputedStyle(img);
          if (parseFloat(cs.opacity) < 0.05) return true;

          // Walk up 3 levels checking clipPath
          let el = img;
          for (let i = 0; i < 3; i++) {
            const cp = getComputedStyle(el).clipPath;
            if (cp && cp.startsWith('inset(100%')) return true;
            if (!el.parentElement) break;
            el = el.parentElement;
          }
          return false;
        })
        .map((img) => img.getAttribute('src') || img.src || '(no src)');
    }, viewport.height);

    // ── Broken counters (shows "0" or blank) ─────────────────────────────
    result.brokenCounters = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.font-numbers, [data-counter]'));
      return els
        .filter((el) => {
          const t = (el.textContent ?? '').trim();
          return t === '0' || t === '0+' || t === '0%' || t === '';
        })
        .map((el) => ({ text: (el.textContent ?? '').trim(), cls: el.className.slice(0, 50) }));
    });

    // ── Screenshots (top / mid / bottom) ─────────────────────────────────
    const slug = name.toLowerCase().replace(/\//g, '-');
    const vp   = viewport.name;
    await page.screenshot({ path: join(outDir, 'screenshots', `${slug}-${vp}-top.png`) });

    const totalH = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate((h) => window.scrollTo(0, h * 0.45), totalH);
    await sleep(700);
    await page.screenshot({ path: join(outDir, 'screenshots', `${slug}-${vp}-mid.png`) });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(700);
    await page.screenshot({ path: join(outDir, 'screenshots', `${slug}-${vp}-bot.png`) });

    await page.evaluate(() => window.scrollTo(0, 0));

  } catch (err) {
    result.errors.push(`Navigation: ${err.message.slice(0, 120)}`);
  } finally {
    await ctx.close();
  }

  result.PASS = (
    result.errors.length        === 0 &&
    result.image404s.length     === 0 &&
    !result.hasHOverflow                &&
    result.invisibleImages.length === 0 &&
    result.brokenCounters.length  === 0
  );

  return result;
}

// ─── Navigation / SplitType cleanup test ─────────────────────────────────────

async function runNavTest(browser) {
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const removeChildErrors = [];

  page.on('pageerror', (e) => {
    const msg = e.message;
    if (msg.includes('removeChild') || msg.includes('NotFoundError')) {
      removeChildErrors.push(msg);
    }
  });

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(1200);
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(500);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(500);
    // Services → process (another SplitType-heavy pair)
    await page.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(500);
    await page.goto(`${BASE_URL}/process`, { waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(500);
  } finally {
    await ctx.close();
  }

  return { PASS: removeChildErrors.length === 0, errors: removeChildErrors };
}

// ─── Hard-refresh test (Fix 13 / Fix 16) ────────────────────────────────────

async function runHardRefreshTest(browser) {
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];

  page.on('pageerror', (e) => errors.push(e.message));

  try {
    // Navigate, scroll partway, hard reload
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(1000);
    await page.evaluate(() => window.scrollTo(0, 800));
    await sleep(300);
    await page.reload({ waitUntil: 'networkidle', timeout: 30_000 });
    await sleep(2500);

    // After reload, above-fold images should be visible
    const invisible = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter((img) => {
          const rect = img.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0) return false;
          if (rect.width === 0 || rect.height === 0) return false;
          return parseFloat(getComputedStyle(img).opacity) < 0.05;
        })
        .map((img) => img.getAttribute('src') || '(no src)');
    });

    return { PASS: errors.length === 0 && invisible.length === 0, errors, invisibleAfterRefresh: invisible };
  } finally {
    await ctx.close();
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let exitCode = 0;

  console.log('\n════════════════════════════════════════════════════');
  console.log('  828 CONSTRUCTION — PRODUCTION PREFLIGHT');
  console.log('════════════════════════════════════════════════════');
  console.log(`  Routes:    ${routes.map(r => r.name).join(', ')}`);
  console.log(`  Viewports: ${viewports.map(v => v.name).join(', ')}`);
  console.log(`  Mode:      ${FAST ? 'fast (pre-built)' : 'full (build + test)'}`);
  console.log(`  Output:    ${outDir}`);

  // ── Step 1: Build ─────────────────────────────────────────────────────────
  if (!FAST) {
    console.log('\n[1/4] Building production bundle...');
    try {
      execSync('npx next build', { stdio: 'inherit' });
      console.log('      ✅ Build succeeded');
    } catch {
      console.error('      ❌ Build FAILED — stopping preflight');
      process.exit(1);
    }
  }

  // ── Step 2: Start server ──────────────────────────────────────────────────
  if (!FAST) {
    console.log('\n[2/4] Starting production server...');
    await startServer();
    console.log(`      ✅ Server ready on :${PORT}`);
  } else {
    console.log(`\n[2/4] Fast mode — using server on :${PORT}`);
  }

  const browser = await chromium.launch();
  const routeResults = [];

  try {
    // ── Step 3: Route tests ────────────────────────────────────────────────
    console.log('\n[3/4] Testing routes...\n');

    for (const route of routes) {
      for (const vp of viewports) {
        process.stdout.write(`      ${route.name.padEnd(15)} @ ${vp.name.padEnd(8)}  `);
        const result = await testRoute(browser, route, vp);
        routeResults.push(result);

        if (result.PASS) {
          process.stdout.write('✅\n');
        } else {
          process.stdout.write('❌\n');
          exitCode = 1;
          if (result.errors.length)
            console.log(`        • JS errors:        ${result.errors.slice(0, 2).join(' | ')}`);
          if (result.image404s.length)
            console.log(`        • Image 404s:       ${result.image404s.join(', ')}`);
          if (result.hasHOverflow)
            console.log(`        • H-overflow:       detected`);
          if (result.invisibleImages.length)
            console.log(`        • Invisible images: ${result.invisibleImages.join(', ')}`);
          if (result.brokenCounters.length)
            console.log(`        • Broken counters:  ${JSON.stringify(result.brokenCounters)}`);
        }
      }
    }

    // ── Step 4: Cross-page navigation test ───────────────────────────────
    console.log('\n[4/4] Special tests...\n');

    process.stdout.write('      Nav / SplitType cleanup        ');
    const navResult = await runNavTest(browser);
    if (navResult.PASS) {
      process.stdout.write('✅\n');
    } else {
      process.stdout.write('❌\n');
      console.log(`        • removeChild errors: ${navResult.errors.length}`);
      exitCode = 1;
    }

    process.stdout.write('      Hard-refresh stability          ');
    const refreshResult = await runHardRefreshTest(browser);
    if (refreshResult.PASS) {
      process.stdout.write('✅\n');
    } else {
      process.stdout.write('❌\n');
      if (refreshResult.errors.length)
        console.log(`        • JS errors after reload: ${refreshResult.errors.slice(0, 2).join(' | ')}`);
      if (refreshResult.invisibleAfterRefresh.length)
        console.log(`        • Invisible after reload: ${refreshResult.invisibleAfterRefresh.join(', ')}`);
      exitCode = 1;
    }

    // ── Write report ──────────────────────────────────────────────────────
    const report = {
      timestamp:    new Date().toISOString(),
      fast:         FAST,
      routes:       routeResults,
      navTest:      navResult,
      refreshTest:  refreshResult,
      passing:      routeResults.filter(r => r.PASS).length,
      failing:      routeResults.filter(r => !r.PASS).length,
      totalChecked: routeResults.length,
      overallPASS:  exitCode === 0,
    };
    writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));

    // ── Summary ───────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════');
    console.log(`  Routes: ${report.passing}/${report.totalChecked} passing`);
    console.log(`  Report: ${outDir}/report.json`);
    console.log(`  Screenshots: ${outDir}/screenshots/`);
    if (exitCode === 0) {
      console.log('\n  ✅  PREFLIGHT PASSED — safe to push\n');
    } else {
      console.log('\n  ❌  PREFLIGHT FAILED — fix issues above before pushing\n');
    }

  } finally {
    await browser.close();
    if (!FAST) stopServer();
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error('\nPreflight crashed:', err.message);
  stopServer();
  process.exit(1);
});
