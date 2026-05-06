import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'research/final/homepage-1440-final.png', fullPage: false });
console.log('Desktop screenshot saved.');

const page2 = await browser.newPage();
await page2.setViewportSize({ width: 390, height: 844 });
await page2.goto('http://localhost:4000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page2.waitForTimeout(2000);
await page2.screenshot({ path: 'research/final/homepage-390-final.png', fullPage: false });
console.log('Mobile screenshot saved.');

await browser.close();
