const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) console.log('  NAV ->', f.url()); });

  // ---- 1. nav link click from home ----
  console.log('--- 1. NAV LINK CLICK FROM HOME ---');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  for (const [label, href] of [['Browse', '/browse'], ['Collections', '/collections']]) {
    const link = page.locator('header nav a', { hasText: new RegExp(`^${label}`) }).first();
    const box = await link.boundingBox();
    const hit = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return el ? `${el.tagName}.${(el.className || '').toString().slice(0, 50)}` : 'null';
    }, [box.x + box.width / 2, box.y + box.height / 2]);
    console.log(`  ${label}: box=${JSON.stringify(box)} hitAtCenter=${hit}`);
    try {
      await link.click({ timeout: 4000, noWaitAfter: true });
      await page.waitForTimeout(700);
      console.log(`  ${label}: click OK (noWaitAfter) url=${page.url().replace(BASE, '')}`);
    } catch (e) {
      console.log(`  ${label}: click FAILED: ${e.message.split('\n')[0]}`);
      await page.waitForTimeout(700);
      console.log(`  ${label}: url now=${page.url().replace(BASE, '')}`);
    }
  }

  // ---- 2. navbar search button ----
  console.log('\n--- 2. NAVBAR SEARCH BUTTON ---');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const sb = page.locator('header button[aria-label*="search" i]').first();
  console.log('  count=', await sb.count());
  try {
    await sb.click({ timeout: 4000, noWaitAfter: true });
    await page.waitForTimeout(800);
    console.log(`  click OK url=${page.url().replace(BASE, '')} dialogs=${await page.locator('[role="dialog"]').count()}`);
    const modalInput = await page.locator('[role="dialog"] input').count();
    console.log('  modal inputs=', modalInput);
    if (modalInput) {
      const si = page.locator('[role="dialog"] input').first();
      await si.fill('spring');
      await page.waitForTimeout(900);
      console.log('  options=', await page.locator('[role="dialog"] [role="option"], [role="dialog"] li').count());
      const opts = await page.locator('[role="dialog"] [role="option"], [role="dialog"] li').allTextContents();
      console.log('  first opts:', JSON.stringify(opts.slice(0, 3)));
      await page.keyboard.press('Escape');
    }
  } catch (e) { console.log('  click FAILED:', e.message.split('\n').slice(0, 6).join(' / ')); }

  // ---- 3. Ctrl+K ----
  console.log('\n--- 3. CTRL+K ---');
  await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.locator('body').click({ position: { x: 700, y: 400 } });
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(800);
  console.log('  dialogs after Ctrl+K =', await page.locator('[role="dialog"]').count());
  await page.keyboard.press('Escape');

  // ---- 4. saved card click ----
  console.log('\n--- 4. SAVED CARD CLICK ---');
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const saveB = page.locator('.reference-card button[aria-label*="Save"], .reference-card button[aria-label*="saved"]').first();
  await saveB.click();
  await page.waitForTimeout(700);
  await page.goto(BASE + '/saved', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const sc = page.locator('.reference-card').first();
  console.log('  saved cards=', await page.locator('.reference-card').count());
  const html = await sc.evaluate((el) => el.outerHTML.slice(0, 700));
  console.log('  card html head:', html.slice(0, 400));
  const center = await sc.boundingBox();
  const hit = await page.evaluate(([x, y]) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return 'null';
    const a = el.closest('a');
    return `${el.tagName}.${(el.className || '').toString().slice(0, 40)} inAnchor=${a ? a.getAttribute('href') + ' target=' + a.getAttribute('target') : 'no'}`;
  }, [center.x + center.width / 2, center.y + center.height / 2]);
  console.log('  card center hit:', hit);
  try {
    await sc.click({ timeout: 5000, noWaitAfter: true });
    await page.waitForTimeout(900);
    console.log('  after card click url =', page.url().replace(BASE, ''));
  } catch (e) { console.log('  card click FAILED:', e.message.split('\n')[0]); }

  // ---- 5. reference detail source link ----
  console.log('\n--- 5. SOURCE LINK ON DETAIL ---');
  for (const id of ['ref-05', 'ref-01']) {
    const resp = await page.goto(BASE + '/reference/' + id, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const txt = await page.locator('main').innerText();
    const anchors = await page.locator('main a').evaluateAll((els) => els.map((a) => `${a.getAttribute('href')} :: ${a.innerText.trim().slice(0, 40)}`));
    console.log(`  ${id}: http=${resp.status()} len=${txt.length} anchors=${JSON.stringify(anchors)}`);
  }

  // ---- 6. hidden element at scroll 2000 ----
  console.log('\n--- 6. HIDDEN ELEMENT AT SCROLL 2000 ---');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(700);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main section, main article, main .reference-card, main .pillar-card, footer')]
      .filter((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return r.height > 20 && (parseFloat(cs.opacity) < 0.9 || cs.visibility === 'hidden');
      })
      .map((el) => ({
        tag: el.tagName, cls: (el.className || '').toString().slice(0, 60),
        op: getComputedStyle(el).opacity, h: Math.round(el.getBoundingClientRect().height),
        top: Math.round(el.getBoundingClientRect().top),
        txt: (el.innerText || '').replace(/\n/g, ' ').slice(0, 70),
      })));
  console.log('  hidden:', JSON.stringify(hidden, null, 1));
  // wait longer and re-check
  await page.waitForTimeout(2000);
  const hidden2 = await page.evaluate(() =>
    [...document.querySelectorAll('main section, main article, main .reference-card, main .pillar-card, footer')]
      .filter((el) => {
        const cs = getComputedStyle(el);
        return el.getBoundingClientRect().height > 20 && parseFloat(cs.opacity) < 0.9;
      }).length);
  console.log('  still hidden after +2s:', hidden2);

  // ---- 7. /saved direct load text ----
  console.log('\n--- 7. /saved DIRECT LOAD ---');
  const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await c2.newPage();
  await p2.goto(BASE + '/saved', { waitUntil: 'networkidle' });
  await p2.waitForTimeout(800);
  console.log('  main text:', JSON.stringify((await p2.locator('main').innerText()).replace(/\n/g, ' | ')));
  await c2.close();

  await browser.close();
})();
