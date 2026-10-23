const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  // Measure event-loop lag from t=0 for 8 seconds
  const lags = await page.evaluate(() => new Promise((resolve) => {
    const samples = [];
    let last = performance.now();
    const t0 = last;
    const tick = () => {
      const now = performance.now();
      samples.push({ t: Math.round(now - t0), lag: Math.round(now - last - 50) });
      last = now;
      if (now - t0 < 8000) setTimeout(tick, 50);
      else resolve(samples);
    };
    setTimeout(tick, 50);
  }));

  const heavy = lags.filter((s) => s.lag > 150);
  const max = lags.reduce((a, b) => (b.lag > a.lag ? b : a), { t: 0, lag: 0 });
  console.log('samples:', lags.length, '| max lag:', max.lag + 'ms @t=' + max.t + 'ms');
  console.log('lags >150ms:', JSON.stringify(heavy.slice(0, 20)));

  // Attempt a nav click at several times after load
  for (const t of [1000, 3000, 6000]) {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(t);
    const link = page.locator('header nav a', { hasText: /^Browse/ }).first();
    const start = Date.now();
    try {
      await link.click({ timeout: 5000, noWaitAfter: true });
      await page.waitForTimeout(300);
      console.log(`click @${t}ms: OK in ${Date.now() - start}ms -> url=${page.url().replace(BASE, '')}`);
    } catch (e) {
      await page.waitForTimeout(1500);
      console.log(`click @${t}ms: TIMEOUT after ${Date.now() - start}ms -> url now=${page.url().replace(BASE, '')}`);
    }
  }

  await browser.close();
})();
