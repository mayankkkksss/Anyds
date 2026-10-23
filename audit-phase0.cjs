/* Phase 0 discovery audit — read-only browser verification of all routes */
const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text().slice(0, 160)); });
  const failedReq = [];
  page.on('response', (r) => { if (r.status() >= 400) failedReq.push(r.status() + ' ' + r.url().replace(BASE, '')); });

  const routes = [
    ['/', 'home'],
    ['/browse', 'browse'],
    ['/collections', 'collections'],
    ['/saved', 'saved'],
    ['/about', 'about'],
    ['/reference/ref-01', 'detail'],
    ['/reference/nope', 'detail-404'],
  ];

  for (const [route, name] of routes) {
    errors.length = 0; failedReq.length = 0;
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4500);
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1, h2.type-h1');
      const cards = document.querySelectorAll('.reference-card, [class*="reference-card"]').length;
      const imgs = Array.from(document.images);
      const brokenImgs = imgs.filter((i) => i.complete && i.naturalWidth === 0).length;
      const videos = document.querySelectorAll('video').length;
      const links = document.querySelectorAll('a[href]').length;
      const btns = document.querySelectorAll('button').length;
      const landmarks = {
        header: !!document.querySelector('header'),
        main: !!document.querySelector('main'),
        footer: !!document.querySelector('footer'),
        nav: !!document.querySelectorAll('nav').length,
      };
      const textLen = (document.querySelector('main')?.innerText || '').length;
      const sw = document.documentElement.scrollWidth, iw = window.innerWidth;
      // sample a few colors for design audit
      const cs = getComputedStyle(document.body);
      return { title: document.title, h1: h1 ? h1.innerText.slice(0, 70) : null, cards, brokenImgs, videos, links, btns, landmarks, textLen, overflow: sw > iw + 1, bg: cs.backgroundColor, fg: cs.color };
    });
    await page.screenshot({ path: `audit-${name}.png`, fullPage: route !== '/' });
    console.log(`\n=== ${route} (${name}) ===`);
    console.log(' ', JSON.stringify(info));
    console.log('  errors:', errors.length ? errors.slice(0, 4) : 'none');
    console.log('  failedRequests:', failedReq.length ? failedReq.slice(0, 6) : 'none');
  }

  // Homepage scroll positions
  console.log('\n=== HOME SCROLL POSITIONS ===');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);
  const docH = await page.evaluate(() => document.body.scrollHeight);
  console.log('  documentHeight:', docH);
  for (const [label, y] of [['top', 0], ['pillars', 0.18], ['featured', 0.36], ['archive', 0.55], ['footer', 0.92]]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), Math.round(docH * y));
    await page.waitForTimeout(2300);
    await page.screenshot({ path: `audit-home-${label}.png` });
    const vis = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('h1, h2, h3, p, .reference-card'));
      const visible = els.filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.top < window.innerHeight && r.bottom > 0 && cs.opacity !== '0' && cs.visibility !== 'hidden'; });
      return { visibleEls: visible.length, sampleText: (visible[0]?.innerText || '').slice(0, 60) };
    });
    console.log(`  ${label} @${Math.round(docH * y)}px: ${JSON.stringify(vis)}`);
  }

  // Interactions spot-check
  console.log('\n=== INTERACTIONS ===');
  await page.goto(BASE + '/browse', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  // filter pill
  const pill = page.locator('.filter-pill', { hasText: 'Spring' }).first();
  if (await pill.count()) { await pill.click(); await page.waitForTimeout(600); }
  const afterFilter = await page.locator('.reference-card, [class*="reference-card"]').count();
  console.log('  filter Spring -> cards:', afterFilter);
  // save toggle
  const saveBtn = page.locator('button[aria-label*="ave"], .reference-card button').first();
  if (await saveBtn.count()) {
    await saveBtn.click(); await page.waitForTimeout(500);
    const badge = await page.locator('.navbar-counter-badge').first().innerText().catch(() => 'none');
    console.log('  save click -> badge:', badge);
    await page.goto(BASE + '/saved', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500);
    const savedCards = await page.locator('.reference-card, [class*="reference-card"]').count();
    console.log('  /saved after save -> cards:', savedCards);
  }
  // search modal via navbar
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3500);
  await page.locator('header button[aria-label*="earch"]').first().click().catch(() => {});
  await page.waitForTimeout(600);
  const dialogs = await page.locator('[role="dialog"]').count();
  console.log('  navbar search click -> dialogs:', dialogs);
  await page.keyboard.press('Escape').catch(() => {});
  // theme toggle
  const t0 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.locator('header button[aria-label*="heme"]').first().click().catch(() => {});
  await page.waitForTimeout(500);
  const t1 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('  theme toggle:', t0, '->', t1);

  // Mobile spot check
  console.log('\n=== MOBILE 390px ===');
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const [route, name] of [['/', 'home'], ['/browse', 'browse'], ['/reference/ref-01', 'detail']]) {
    await m.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await m.waitForTimeout(4500);
    const ov = await m.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    await m.screenshot({ path: `audit-mobile-${name}.png`, fullPage: route !== '/' });
    console.log(`  ${route}: overflow=${ov.sw > ov.iw + 1} (${ov.sw}/${ov.iw})`);
  }
  await m.close();

  await browser.close();
  console.log('\nDONE');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
