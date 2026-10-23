/* Final clarification: search options, collection article click, drawer CSS state */
const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Search combobox popup with correct interaction
  await page.goto(BASE + '/browse', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  const combo = page.locator('input[role="combobox"], .browse-command-bar input').first();
  console.log('combobox found:', await combo.count());
  await combo.click();
  await combo.type('spring', { delay: 40 });
  await page.waitForTimeout(700);
  const popup = await page.evaluate(() => {
    const lb = document.querySelector('[role="listbox"]');
    if (!lb) return { listbox: false };
    const opts = lb.querySelectorAll('[role="option"]');
    return { listbox: true, options: opts.length, first: opts[0]?.innerText.slice(0, 40) || null, ariaExpanded: document.querySelector('[role="combobox"]')?.getAttribute('aria-expanded') };
  });
  console.log('search popup:', JSON.stringify(popup));
  // keyboard select first option
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  const modalAfter = await page.evaluate(() => {
    const d = Array.from(document.querySelectorAll('[role="dialog"]')).find((x) => /preview/i.test(x.getAttribute('aria-label') || ''));
    return d ? d.getAttribute('aria-label').slice(0, 50) : null;
  });
  console.log('after Enter -> preview dialog:', modalAfter);

  // 2. Collection article click (role=button article)
  await page.goto(BASE + '/collections', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const arts = await page.evaluate(() => document.querySelectorAll('article[role="button"]').length);
  console.log('collection articles[role=button]:', arts);
  await page.locator('article[role="button"]').first().click({ noWaitAfter: true });
  await page.waitForTimeout(2500);
  console.log('article click -> url:', page.url().replace(BASE, ''), '| cards:', await page.evaluate(() => document.querySelectorAll('.reference-card').length));

  // 3. Drawer closed-state CSS
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const drawerCSS = await page.evaluate(() => {
    const d = document.querySelector('#mobile-nav-drawer');
    const cs = getComputedStyle(d);
    return { display: cs.display, visibility: cs.visibility, transform: cs.transform.slice(0, 40), opacity: cs.opacity, pointerEvents: cs.pointerEvents, inert: d.hasAttribute('inert'), ariaHidden: d.getAttribute('aria-hidden'), tabbable: d.querySelectorAll('a[href], button').length };
  });
  console.log('closed drawer CSS:', JSON.stringify(drawerCSS));
  // can keyboard reach it while closed?
  const reach = await page.evaluate(() => {
    const d = document.querySelector('#mobile-nav-drawer');
    const focusables = Array.from(d.querySelectorAll('a[href], button'));
    return focusables.map((f) => ({ tag: f.tagName, txt: (f.innerText || f.getAttribute('aria-label') || '').slice(0, 18), focusable: f.tabIndex >= 0 && getComputedStyle(f).visibility !== 'hidden' && getComputedStyle(f).display !== 'none' && getComputedStyle(d).visibility !== 'hidden' }));
  });
  console.log('closed drawer focusables reachable:', JSON.stringify(reach.slice(0, 4)), '... total', reach.length, 'reachable:', reach.filter((r) => r.focusable).length);

  await browser.close();
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
