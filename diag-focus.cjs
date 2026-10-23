const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('dialog', async (d) => { console.log('DIALOG:', d.type(), d.message()); await d.dismiss(); });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  // ---- 1. Zero-result empty state ----
  console.log('--- 1. ZERO RESULT STATE ---');
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const input = page.locator('input[type="search"], input[placeholder*="Search"]').first();
  await input.fill('zzzznotfoundzzz');
  await page.waitForTimeout(300);
  await input.press('Enter').catch(() => {});
  await page.waitForTimeout(800);
  const es = await page.locator('.discovery-grid-empty-state, [role="status"]').count();
  const esText = es ? await page.locator('.discovery-grid-empty-state, [role="status"]').first().innerText() : '(none)';
  console.log(`empty-state nodes=${es} text="${esText.replace(/\n/g, ' | ').slice(0, 200)}"`);
  // clear
  await input.fill('');
  await input.press('Enter').catch(() => {});
  await page.waitForTimeout(600);

  // ---- 2. Card click -> modal -> detail navigation ----
  console.log('\n--- 2. CARD -> DETAIL FLOW ---');
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const card = page.locator('.reference-card').first();
  const cardHtml = await card.evaluate((el) => {
    const a = el.querySelector('a');
    return { hasAnchor: !!a, anchorHref: a ? a.getAttribute('href') : null, tag: el.tagName, role: el.getAttribute('role') };
  });
  console.log('card structure:', JSON.stringify(cardHtml));
  await card.click({ timeout: 6000 }).then(() => console.log('card click OK')).catch((e) => console.log('card click FAILED:', e.message.split('\n')[0]));
  await page.waitForTimeout(900);
  const dialog = await page.locator('[role="dialog"], .search-modal-backdrop').count();
  console.log(`modal after card click: dialogs=${dialog} url=${page.url()}`);
  if (dialog) {
    const btns = await page.locator('[role="dialog"] button, .search-modal-container button').allTextContents();
    console.log('modal buttons:', JSON.stringify(btns.map((b) => b.trim()).filter(Boolean)));
    const detailBtn = page.locator('button', { hasText: /Inspect Study Details/i }).first();
    if (await detailBtn.count()) {
      await detailBtn.click({ timeout: 5000 }).then(() => console.log('detail btn click OK')).catch((e) => console.log('detail btn FAILED:', e.message.split('\n')[0]));
      await page.waitForTimeout(1000);
      const dest = page.url().replace(BASE, '');
      const bodyTxt = await page.locator('main').innerText();
      console.log(`-> dest=${dest} detailRendered=${/provenance|technique|creator|Recreation/i.test(bodyTxt)} notFound=${bodyTxt.includes('Reference Not Found')}`);
      // back to archive
      const back = page.locator('main a').filter({ hasText: /Back|Browse the Archive|Archive/i }).first();
      if (await back.count()) {
        const href = await back.getAttribute('href');
        await back.click({ timeout: 5000 }).then(() => console.log('back click OK')).catch((e) => console.log('back FAILED:', e.message.split('\n')[0]));
        await page.waitForTimeout(900);
        console.log(`-> back href=${href} dest=${page.url().replace(BASE, '')}`);
      } else console.log('back link NOT FOUND');
    } else console.log('Inspect Study Details button NOT FOUND');
  }

  // ---- 3. Hero CTA click investigation ----
  console.log('\n--- 3. HERO CTA CLICK ---');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const cta = page.locator('.hero-cta-btn').first();
  const box = await cta.boundingBox();
  console.log('cta box:', JSON.stringify(box));
  if (box) {
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    const hit = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return 'null';
      return `${el.tagName}.${(el.className || '').toString().slice(0, 60)} pe=${getComputedStyle(el).pointerEvents} z=${getComputedStyle(el).zIndex}`;
    }, [cx, cy]);
    console.log('elementFromPoint at CTA center:', hit);
    const cs = await cta.evaluate((el) => {
      const s = getComputedStyle(el);
      return { pe: s.pointerEvents, op: s.opacity, vis: s.visibility, pe_parent: getComputedStyle(el.parentElement).pointerEvents, z: getComputedStyle(el).zIndex, transform: s.transform };
    });
    console.log('cta computed:', JSON.stringify(cs));
  }
  const y0 = await page.evaluate(() => window.scrollY);
  try {
    await cta.click({ timeout: 6000 });
    console.log('CTA click OK');
  } catch (e) {
    console.log('CTA click FAILED:', e.message.split('\n').slice(0, 8).join(' / '));
    // try force
    await cta.click({ force: true, timeout: 4000 }).then(() => console.log('force click OK')).catch((e2) => console.log('force FAILED', e2.message.split('\n')[0]));
  }
  await page.waitForTimeout(1500);
  const y1 = await page.evaluate(() => window.scrollY);
  console.log(`scrollY ${y0} -> ${y1} (expected > ${y0 + 200})`);

  // ---- 4. Collections CTA ----
  console.log('\n--- 4. COLLECTIONS CTAS ---');
  await page.goto(BASE + '/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const ctaLabels = await page.locator('main button, main [role="button"], main a').evaluateAll((els) =>
    els.map((e) => `${e.tagName}[${e.getAttribute('href') || ''}]:${(e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 50).replace(/\n/g, ' ')}`)
  );
  console.log('collection CTAs:', JSON.stringify(ctaLabels, null, 1));
  const enterBtn = page.locator('button', { hasText: /Enter Anthology/i }).first();
  if (await enterBtn.count()) {
    await enterBtn.click({ timeout: 5000 }).then(() => console.log('Enter Anthology click OK')).catch((e) => console.log('click FAILED', e.message.split('\n')[0]));
    await page.waitForTimeout(900);
    console.log('-> dest after Enter Anthology:', page.url().replace(BASE, ''));
  }

  await browser.close();
})();
