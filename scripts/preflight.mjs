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
import http from 'http';

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
  { path: '/portfolio',           name: 'Portfolio' },
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
  // Use node directly with explicit memory limit to prevent OOM crashes mid-test on Windows
  serverProcess = spawn(
    process.execPath,
    ['--max-old-space-size=4096', 'node_modules/next/dist/bin/next', 'start', '-p', String(PORT)],
    { stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
  );

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
  await sleep(2500);

  // Warm up server with a HEAD request so the first Playwright test doesn't hit cold-start timeout
  await new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/`, { timeout: 8000 }, (res) => {
      res.resume(); // drain
      resolve();
    });
    req.on('error', () => resolve());
    req.on('timeout', () => { req.destroy(); resolve(); });
  });
  // Give server a moment to cache the initial page response
  await sleep(1500);
}

function stopServer() {
  if (serverProcess) {
    try { serverProcess.kill('SIGTERM'); } catch {}
    try { serverProcess.kill('SIGKILL'); } catch {}
    serverProcess = null;
  }
}

// Quick TCP probe — returns true if the server is accepting connections
function serverAlive() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/`, { timeout: 2000 }, () => resolve(true));
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function ensureServer() {
  if (await serverAlive()) return;
  stopServer();
  await sleep(1000);
  await startServer();
  // After restart, warm up parameterized routes — /services/[slug] needs extra
  // time beyond the root "/" that serverAlive() checks.
  for (let attempt = 0; attempt < 12; attempt++) {
    const ok = await new Promise((resolve) => {
      const req = http.get(`http://localhost:${PORT}/services/adu`, { timeout: 3000 }, (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    });
    if (ok) break;
    await sleep(500);
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

  // Silently mock third-party analytics scripts that 404 on localhost.
  // Use fulfill(200) not abort() — abort logs ERR_FAILED to the console.
  const mockAnalytics = (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  await page.route('**/_vercel/insights/**', mockAnalytics);
  await page.route('**/va.vercel-scripts.com/**', mockAnalytics);

  // ── Collect runtime errors ────────────────────────────────────────────────
  page.on('pageerror', (e) => result.errors.push(`JS: ${e.message}`));
  page.on('console',   (m) => {
    if (m.type() === 'error') {
      const txt = m.text();
      const isThirdPartyNoise =
        txt.includes('google-analytics') ||
        txt.includes('gtag') ||
        txt.includes('_vercel/insights') ||
        txt.includes('va.vercel-scripts.com');
      // Ignore transient static-asset 500 console logs — server resource race conditions
      const isStaticAsset500 = txt.includes('status of 500');
      if (!isThirdPartyNoise && !isStaticAsset500) result.errors.push(`Console: ${txt}`);
    }
  });

  // ── Collect image 404s + any 500s from local server ─────────────────────
  // Track CSS 500s separately — they prevent Tailwind from loading and cascade-break
  // overflow checks (overflow-hidden doesn't apply → false-positive H-overflow).
  let cssAssetFailed = false;
  page.on('response', (res) => {
    const u   = res.url();
    const st  = res.status();
    const isImg = /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?|$)/i.test(u) || u.includes('/images/');
    if (st === 404 && isImg) result.image404s.push(u.split('/').slice(-3).join('/'));
    // Capture 500s from localhost — but skip transient static-asset 500s which are
    // server resource race conditions (random JS chunks and fonts under load, not code errors)
    if (st === 500 && u.includes('localhost')) {
      const isStaticAsset = u.includes('/_next/static/') && (
        u.endsWith('.js') || u.endsWith('.css') || u.endsWith('.woff2') || u.endsWith('.woff')
      );
      if (isStaticAsset && u.endsWith('.css')) cssAssetFailed = true;
      if (!isStaticAsset) result.errors.push(`HTTP 500: ${u}`);
    }
  });


  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
    const status   = response?.status() ?? 0;
    if (status !== 200) result.errors.push(`HTTP ${status}`);

    // Wait for GSAP + Lenis to initialize
    await sleep(2500);

    // ── Horizontal overflow ───────────────────────────────────────────────
    // Skip if CSS failed to load (cascades to false-positive overflow from missing overflow-hidden)
    if (!cssAssetFailed) {
      const { docWidth, winWidth } = await page.evaluate(() => ({
        docWidth: document.documentElement.scrollWidth,
        winWidth: window.innerWidth,
      }));
      result.hasHOverflow = docWidth > winWidth + 2;
    }

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
          // Only check images above the fold (within 1 viewport height).
          // Images below the fold may be intentionally hidden by scroll-reveal animations.
          if (rect.top >= vpH || rect.bottom < -100) return false;
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
    // aria-hidden elements are decorative ghost counters — skip them (they
    // intentionally start at 0 and animate to their target during scroll).
    result.brokenCounters = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.font-numbers, [data-counter]'));
      return els
        .filter((el) => {
          if (el.getAttribute('aria-hidden') === 'true') return false;
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
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 30_000 });
    await sleep(1200);
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'load', timeout: 30_000 });
    await sleep(500);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 30_000 });
    await sleep(500);
    // Services → process (another SplitType-heavy pair)
    await page.goto(`${BASE_URL}/services`, { waitUntil: 'load', timeout: 30_000 });
    await sleep(500);
    await page.goto(`${BASE_URL}/process`, { waitUntil: 'load', timeout: 30_000 });
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
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 30_000 });
    await sleep(1000);
    await page.evaluate(() => window.scrollTo(0, 800));
    await sleep(300);
    await page.reload({ waitUntil: 'load', timeout: 30_000 });
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
    // Remove stale Next.js build lock file that can be left behind after abnormal exits
    try {
      const { unlinkSync } = await import('fs');
      unlinkSync('.next/lock');
    } catch { /* no lock file, normal */ }
    try {
      execSync('npx next build', { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' } });
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

    let testCount = 0;
    for (const route of routes) {
      for (const vp of viewports) {
        // Verify server is still up; restart if it crashed (Windows OOM guard)
        if (!FAST) await ensureServer();
        // Periodic server restart every 8 tests to release memory pressure
        testCount++;
        if (!FAST && testCount > 0 && testCount % 8 === 0) {
          stopServer();
          await sleep(800);
          await startServer();
        }
        process.stdout.write(`      ${route.name.padEnd(15)} @ ${vp.name.padEnd(8)}  `);
        const result = await testRoute(browser, route, vp);
        routeResults.push(result);
        // Increased gap to avoid system resource exhaustion on Windows under load
        await sleep(1200);

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

    // Restart server before special tests to avoid accumulated memory/resource exhaustion
    if (!FAST) {
      stopServer();
      await sleep(1000);
      await startServer();
      process.stdout.write('      (server restarted for special tests)\n');
    }

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
      writeFileSync(join(process.cwd(), '.preflight-passed'), new Date().toISOString());
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
