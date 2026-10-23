const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const waitMs of [600, 3000]) {
    console.log(`\n=== pre-wait ${waitMs}ms ===`);
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(waitMs);
    const link = page.locator('header nav a', { hasText: /^Browse/ }).first();
    const box = await link.boundingBox();
    console.log('  box:', JSON.stringify(box));
    const hit = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return 'null';
      const cs = getComputedStyle(el);
      let chain = [];
      let cur = el;
      for (let i = 0; i < 4 && cur; i++) { chain.push(`${cur.tagName}.${(cur.className||'').toString().slice(0,25)}`); cur = cur.parentElement; }
      return { top: chain[0], chain, pe: cs.pointerEvents };
    }, [box.x + box.width / 2, box.y + box.height / 2]);
    console.log('  hit:', JSON.stringify(hit));
    // stability probe: sample box 10 times over 500ms
    const samples = [];
    for (let i = 0; i < 10; i++) {
      const b = await link.boundingBox();
      samples.push(`${Math.round(b.x)},${Math.round(b.y)}`);
      await page.waitForTimeout(50);
    }
    console.log('  box samples:', JSON.stringify(samples));
    try {
      await link.click({ timeout: 6000, noWaitAfter: true });
      console.log('  click: OK  url=', page.url().replace(BASE, ''));
    } catch (e) {
      console.log('  click: FAILED\n   ' + e.message.split('\n').slice(0, 14).join('\n   '));
      console.log('  url after failure =', page.url().replace(BASE, ''));
    }
  }

  await browser.close();
})();
