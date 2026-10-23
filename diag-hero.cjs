const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text().slice(0, 200)); });

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const probe = () => page.evaluate(() => {
    const out = {};
    const sel = ['.hero-title-line', '.hero-subtext', '.hero-cta-btn', '.hero-secondary-btn', '.hero-indicator', '.pillar-card', '.featured-spread-section', '#discover'];
    for (const s of sel) {
      const el = document.querySelector(s);
      if (!el) { out[s] = 'MISSING'; continue; }
      const cs = getComputedStyle(el);
      out[s] = `op=${cs.opacity} t=${cs.transform.slice(0, 34)} vis=${cs.visibility}`;
    }
    return out;
  });

  const times = [300, 800, 1500, 2500, 4000, 6000];
  let prev = 0;
  for (const t of times) {
    await page.waitForTimeout(t - prev);
    prev = t;
    const p = await probe();
    console.log(`\n@${t}ms`);
    for (const k of Object.keys(p)) console.log(`   ${k.padEnd(26)} ${p[k]}`);
  }

  // Check for gsap tweens still active / paused
  const gsapInfo = await page.evaluate(() => {
    const g = window.gsap;
    if (!g) return 'no window.gsap (module-scoped)';
    return { globalTweens: g.globalTimeline ? g.globalTimeline.getChildren(true, true, false).length : 'n/a' };
  });
  console.log('\ngsap info:', JSON.stringify(gsapInfo));

  // Does anything intercept hero CTA clicks in normal (non-test) conditions?
  console.log('\n--- CTA hit test at 6s ---');
  const cta = page.locator('.hero-cta-btn').first();
  const box = await cta.boundingBox();
  if (box) {
    const hit = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return el ? `${el.tagName}.${(el.className || '').toString().slice(0, 50)}` : 'null';
    }, [box.x + box.width / 2, box.y + box.height / 2]);
    console.log('hit:', hit, 'ctaBox:', JSON.stringify(box));
  }

  await browser.close();
})();
