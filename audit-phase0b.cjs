/* Focused re-check: save flow, search dialogs identity, collections navigation */
const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // --- 1. Save flow, step by step ---
  await page.goto(BASE + '/browse', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const cardCount = await page.evaluate(() => document.querySelectorAll('[class*="reference-card"]').length);
  // find the actual save button inside the first card
  const btnInfo = await page.evaluate(() => {
    const card = document.querySelector('[class*="reference-card"]');
    if (!card) return { card: false };
    const btns = Array.from(card.querySelectorAll('button')).map((b) => ({
      label: b.getAttribute('aria-label') || b.innerText.slice(0, 30), cls: b.className.slice(0, 60),
    }));
    return { card: true, class: card.className.slice(0, 60), btns };
  });
  console.log('cards:', cardCount, 'firstCard:', JSON.stringify(btnInfo));

  // click the save/bookmark button in the first card
  const clicked = await page.evaluate(() => {
    const card = document.querySelector('[class*="reference-card"]');
    const btn = card && Array.from(card.querySelectorAll('button')).find((b) => /save|bookmark/i.test(b.getAttribute('aria-label') || ''));
    if (!btn) return 'no-save-button';
    btn.click();
    return btn.getAttribute('aria-label');
  });
  await page.waitForTimeout(800);
  const badge = await page.locator('.navbar-counter-badge').first().innerText().catch(() => 'none');
  const ls = await page.evaluate(() => localStorage.getItem('anyds_saved_refs_v1'));
  console.log('clicked:', clicked, '| badge:', badge, '| localStorage:', ls);

  await page.goto(BASE + '/saved', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const savedCards = await page.evaluate(() => document.querySelectorAll('[class*="reference-card"]').length);
  const savedH1 = await page.evaluate(() => (document.querySelector('h1, h2')?.innerText || '').slice(0, 50));
  console.log('/saved -> cards:', savedCards, 'heading:', savedH1);

  // --- 2. What are the 2 dialogs on search open? ---
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await page.locator('header button[aria-label*="earch"]').first().click();
  await page.waitForTimeout(700);
  const dialogInfo = await page.evaluate(() => Array.from(document.querySelectorAll('[role="dialog"]')).map((d) => ({
    label: d.getAttribute('aria-label'), visible: getComputedStyle(d).display !== 'none' && d.getBoundingClientRect().height > 0,
  })));
  console.log('dialogs:', JSON.stringify(dialogInfo));
  // search actually returns results?
  const input = page.locator('[role="dialog"] input, dialog input, .search-modal-container input').first();
  if (await input.count()) { await input.fill('spring'); await page.waitForTimeout(600); }
  const opts = await page.evaluate(() => document.querySelectorAll('[role="option"], .search-result-item, [class*="search"] li').length);
  console.log('search "spring" -> option-like elements:', opts);
  await page.keyboard.press('Escape');

  // --- 3. Collections deep link ---
  await page.goto(BASE + '/collections', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const firstColBtn = page.locator('main a, main button').filter({ hasText: /Motion with Restraint/i }).first();
  if (await firstColBtn.count()) {
    await firstColBtn.click({ noWaitAfter: true });
    await page.waitForTimeout(2500);
    console.log('collection click -> url:', page.url().replace(BASE, ''));
    const cnt = await page.evaluate(() => document.querySelectorAll('[class*="reference-card"]').length);
    console.log('  filtered cards:', cnt);
  } else {
    console.log('collection link NOT FOUND');
    const colText = await page.evaluate(() => (document.querySelector('main')?.innerText || '').slice(0, 200));
    console.log('  collections main text:', colText.replace(/\n/g, ' | '));
  }

  // --- 4. Detail external link ---
  await page.goto(BASE + '/reference/ref-01', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const ext = await page.evaluate(() => {
    const a = document.querySelector('main a[target="_blank"]');
    return a ? { href: a.href, rel: a.rel, text: a.innerText.slice(0, 30) } : null;
  });
  console.log('detail external link:', JSON.stringify(ext));

  // --- 5. Keyboard shortcuts ---
  await page.goto(BASE + '/browse', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(600);
  const afterCtrlK = await page.evaluate(() => Array.from(document.querySelectorAll('[role="dialog"]')).filter((d) => d.getBoundingClientRect().height > 0).length);
  console.log('Ctrl+K -> visible dialogs:', afterCtrlK);
  await page.keyboard.press('Escape');

  console.log('errors:', errors.length ? errors : 'none');
  await browser.close();
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
