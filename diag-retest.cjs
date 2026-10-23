const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));

  // ---- detail page source link ----
  console.log('--- DETAIL SOURCE LINK ---');
  await page.goto(BASE + '/reference/ref-05', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const txt = await page.locator('main').innerText();
  console.log('  has "Visit Original Source":', txt.includes('Visit Original Source'));
  console.log('  has "Source Link Unavailable":', txt.includes('Source Link Unavailable'));
  console.log('  has "Back to Archive":', txt.includes('Back to Archive'));
  const anchors = await page.locator('main a').evaluateAll((els) =>
    els.map((a) => `${a.getAttribute('href')} | tgt=${a.getAttribute('target')} | ${a.innerText.trim().slice(0, 40)}`)
  );
  console.log('  anchors:', JSON.stringify(anchors, null, 1));
  const srcA = page.locator('main a', { hasText: /Visit Original Source/i }).first();
  console.log('  source anchor count:', await srcA.count());

  // ---- back to archive from deep link ----
  const back = page.locator('main button', { hasText: /Back to Archive/i }).first();
  await back.click({ timeout: 5000, noWaitAfter: true }).catch((e) => console.log('  back click err', e.message.split('\n')[0]));
  await page.waitForTimeout(900);
  console.log('  after Back to Archive url =', page.url().replace(BASE, ''));

  // ---- saved card click with instrumentation ----
  console.log('\n--- SAVED CARD CLICK ---');
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const saveBtn = page.locator('.reference-card button[aria-label*="Save"], .reference-card button[aria-label*="saved"]').first();
  await saveBtn.click();
  await page.waitForTimeout(700);
  await page.goto(BASE + '/saved', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // instrument history + console
  await page.evaluate(() => {
    window.__navs = [];
    const orig = history.pushState.bind(history);
    history.pushState = (...args) => { window.__navs.push('push:' + args[2]); return orig(...args); };
    const origR = history.replaceState.bind(history);
    history.replaceState = (...args) => { window.__navs.push('replace:' + args[2]); return origR(...args); };
    window.addEventListener('popstate', () => window.__navs.push('popstate'));
    document.addEventListener('click', (e) => {
      const art = e.target.closest('.reference-card');
      window.__navs.push('click-on:' + (art ? 'card' : e.target.className));
    }, true);
  });

  const card = page.locator('.reference-card').first();
  await card.click({ timeout: 5000, noWaitAfter: true }).catch((e) => console.log('  click err', e.message.split('\n')[0]));
  await page.waitForTimeout(1200);
  const navs = await page.evaluate(() => window.__navs);
  console.log('  events:', JSON.stringify(navs));
  console.log('  url after click =', page.url().replace(BASE, ''));
  const detailNow = await page.locator('main').innerText();
  console.log('  main has Recreation Brief:', /Recreation Architecture Brief/i.test(detailNow));

  // keyboard activation on saved card (Enter)
  console.log('\n--- SAVED CARD KEYBOARD ---');
  await page.goto(BASE + '/saved', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.locator('.reference-card').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  console.log('  after Enter url =', page.url().replace(BASE, ''));

  await browser.close();
})();
