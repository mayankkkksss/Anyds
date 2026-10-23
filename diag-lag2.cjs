const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

const probe = (page) => page.evaluate(() => new Promise((resolve) => {
  const samples = [];
  let last = performance.now();
  const t0 = last;
  const tick = () => {
    const now = performance.now();
    samples.push({ t: Math.round(now - t0), lag: Math.round(now - last - 50) });
    last = now;
    if (now - t0 < 7000) setTimeout(tick, 50);
    else resolve(samples);
  };
  setTimeout(tick, 50);
}));

const report = (name, samples) => {
  const max = samples.reduce((a, b) => (b.lag > a.lag ? b : a), { t: 0, lag: 0 });
  const heavy = samples.filter((s) => s.lag > 150);
  console.log(`${name}: samples=${samples.length} maxLag=${max.lag}ms @${max.t}ms heavy=${JSON.stringify(heavy.slice(0, 8))}`);
};

(async () => {
  const browser = await chromium.launch();

  // 1. baseline homepage
  let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  report('HOME baseline   ', await probe(page));
  await page.close();

  // 2. /browse (no 3D canvas)
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/browse', { waitUntil: 'domcontentloaded' });
  report('/browse (no 3D) ', await probe(page));
  await page.close();

  // 3. homepage with HeroCanvas chunk blocked
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route('**/HeroCanvas*', (route) => route.abort());
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  report('HOME no-canvas   ', await probe(page));
  await page.close();

  // 4. homepage: measure again from t=8s (after initial block) to see steady state
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000);
  report('HOME steady@9s   ', await probe(page));

  // 5. what is running during the block? collect long tasks if available
  const longTasks = await page.evaluate(() => new Promise((r) => {
    const tasks = [];
    try {
      const po = new PerformanceObserver((list) => {
        list.getEntries().forEach((e) => tasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }));
      });
      po.observe({ entryTypes: ['longtask'] });
      setTimeout(() => { po.disconnect(); r(tasks); }, 500);
    } catch (e) { r(['no longtask api: ' + e.message]); }
  }));
  console.log('long tasks (late sample):', JSON.stringify(longTasks).slice(0, 300));
  await page.close();

  await browser.close();
})();
