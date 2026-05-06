import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });

async function capture(url, slug, scrollPositions = []) {
  const page = await browser.newPage();
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `research/reference/${slug}-desktop.png`, fullPage: false });
    
    for (const [name, y] of scrollPositions) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(800);
      await page.screenshot({ path: `research/reference/${slug}-${name}-desktop.png` });
    }
    
    // Footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `research/reference/${slug}-footer-desktop.png` });
    
    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `research/reference/${slug}-mobile.png` });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `research/reference/${slug}-footer-mobile.png` });
    
    console.log(`Done: ${slug}`);
  } catch (e) {
    console.log(`Error ${slug}: ${e.message}`);
  } finally {
    await page.close();
  }
}

await Promise.all([
  capture('https://www.nsbuilders.com', 'nsbuilders', [['projects', 2000], ['portfolio', 3500]]),
  capture('https://feldmanarchitecture.com/projects', 'feldman', [['grid', 1000]]),
  capture('https://olsonkundig.com/projects', 'olsonkundig', [['grid', 1000]]),
]);

await browser.close();
console.log('Reference screenshots complete.');
