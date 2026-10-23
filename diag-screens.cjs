const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Dark theme hero (design identity)
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const themeLabel = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className || '(none)');
  console.log('initial theme attr:', themeLabel);
  // toggle to dark if currently light
  const isLight = await page.evaluate(() => {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t === 'light';
    return getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)';
  });
  console.log('isLight guess:', isLight);
  await page.locator('header button[aria-label*="theme"]').first().click();
  await page.waitForTimeout(6500);
  await page.screenshot({ path: 'after-hero-dark.png' });
  console.log('captured after-hero-dark.png; theme now:', await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className));

  // Scroll below hero (dark)
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(2600);
  await page.screenshot({ path: 'after-below-hero.png' });

  await page.evaluate(() => window.scrollTo(0, 3600));
  await page.waitForTimeout(2600);
  await page.screenshot({ path: 'after-archive.png' });

  // Browse
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'after-browse.png' });

  // Detail
  await page.goto(BASE + '/reference/ref-05', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'after-detail.png' });

  // Collections
  await page.goto(BASE + '/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'after-collections.png' });

  // Mobile 390
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await m.waitForTimeout(6500);
  await m.screenshot({ path: 'after-mobile.png' });
  const overflow = await m.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  console.log('mobile overflow check:', JSON.stringify(overflow));

  await browser.close();
})();
