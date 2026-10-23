const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

const results = [];
function rec(area, name, pass, detail) {
  results.push({ area, name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${area} | ${name} | ${detail}`);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push('console: ' + m.text()); });

  // ---------- B. ROUTING / NAVIGATION ----------
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Navbar links
  const navLinks = [
    { label: 'Browse', href: '/browse' },
    { label: 'Collections', href: '/collections' },
    { label: 'Saved', href: '/saved' },
    { label: 'About', href: '/about' },
  ];
  for (const l of navLinks) {
    try {
      const link = page.locator(`header nav a[href="${l.href}"]`).first();
      if ((await link.count()) === 0) {
        rec('B.Navigation', `nav link ${l.href}`, false, 'link not found in header');
        continue;
      }
      await link.click({ timeout: 5000 });
      await page.waitForURL('**' + l.href, { timeout: 5000 });
      await page.waitForTimeout(400);
      const ok = page.url().endsWith(l.href);
      const bodyLen = (await page.locator('body').innerText()).length;
      rec('B.Navigation', `nav link ${l.href}`, ok && bodyLen > 400, `url=${page.url()} bodyLen=${bodyLen}`);
    } catch (e) {
      rec('B.Navigation', `nav link ${l.href}`, false, e.message.slice(0, 120));
    }
  }

  // Direct deep link load
  for (const r of ['/reference/ref-01', '/browse', '/collections', '/saved', '/about']) {
    pageErrors.length = 0;
    const resp = await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const txt = await page.locator('main, body').first().innerText();
    const notFound = txt.includes("Reference Not Found");
    rec('B.Routing', `direct load ${r}`, resp.status() === 200 && !notFound && txt.length > 500,
      `http=${resp.status()} notFound=${notFound} len=${txt.length}`);
  }

  // Browser back/forward
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('header nav a[href="/browse"]').first().click();
  await page.waitForURL('**/browse');
  await page.goBack();
  await page.waitForTimeout(700);
  const backOk = page.url().endsWith('/');
  await page.goForward();
  await page.waitForTimeout(700);
  const fwdOk = page.url().endsWith('/browse');
  rec('B.Routing', 'browser back/forward', backOk && fwdOk, `back=${backOk} fwd=${fwdOk} url=${page.url()}`);

  // ---------- C. SEARCH & ARCHIVE ----------
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const countCards = async () => page.locator('.reference-card, [class*="reference-card"]').count();
  const allCount = await countCards();
  rec('C.Archive', 'initial card count', allCount >= 10, `cards=${allCount}`);

  // Category filter
  const springBtn = page.locator('button.filter-pill', { hasText: /^Spring$/ }).first();
  if (await springBtn.count()) {
    await springBtn.click();
    await page.waitForTimeout(600);
    const after = await countCards();
    const pressed = await springBtn.getAttribute('aria-pressed');
    rec('C.Archive', 'category filter Spring', after > 0 && after < allCount && pressed === 'true',
      `cards ${allCount} -> ${after}, aria-pressed=${pressed}`);
    // reset
    await page.locator('button.filter-pill', { hasText: /^All$/ }).first().click();
    await page.waitForTimeout(500);
    const resetCount = await countCards();
    rec('C.Archive', 'filter reset to All', resetCount === allCount, `cards=${resetCount}`);
  } else {
    rec('C.Archive', 'category filter Spring', false, 'Spring pill not found');
  }

  // Search input
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
  if (await searchInput.count()) {
    await searchInput.fill('spring');
    await page.waitForTimeout(300);
    await searchInput.press('Enter').catch(() => {});
    await page.waitForTimeout(700);
    const afterSearch = await countCards();
    rec('C.Archive', 'search "spring"', afterSearch > 0 && afterSearch < allCount,
      `cards ${allCount} -> ${afterSearch}`);
    await searchInput.fill('');
    await searchInput.press('Enter').catch(() => {});
    await page.waitForTimeout(600);
  } else {
    rec('C.Archive', 'search input present', false, 'no search input found');
  }

  // Search returns zero results state
  const searchInput2 = page.locator('input[type="search"], input[placeholder*="Search"]').first();
  if (await searchInput2.count()) {
    await searchInput2.fill('zzzznotfoundzzz');
    await page.waitForTimeout(300);
    await searchInput2.press('Enter').catch(() => {});
    await page.waitForTimeout(700);
    const zero = await countCards();
    const bodyTxt = await page.locator('main').innerText();
    const hasEmptyState = /no results|nothing found|no references|empty/i.test(bodyTxt);
    rec('C.Archive', 'zero-result state', zero === 0 && hasEmptyState, `cards=${zero} emptyState=${hasEmptyState}`);
    await searchInput2.fill('');
    await searchInput2.press('Enter').catch(() => {});
    await page.waitForTimeout(500);
  }

  // Advanced filters
  const advanced = page.locator('details.filter-bar-advanced summary').first();
  if (await advanced.count()) {
    await advanced.click();
    await page.waitForTimeout(400);
    const sel = page.locator('#filter-collection-select, select').first();
    if (await sel.count()) {
      const opts = await sel.locator('option').allTextContents();
      const val = opts.length > 1 ? (await sel.locator('option').nth(1).getAttribute('value')) : null;
      if (val) {
        await sel.selectOption(val);
        await page.waitForTimeout(600);
        const after = await countCards();
        rec('C.Archive', 'advanced collection filter', after >= 0 && after <= allCount, `value=${val} cards=${after}`);
        // reset
        await page.locator('button', { hasText: /Reset all filters|Clear filters/i }).first().click().catch(() => {});
        await page.waitForTimeout(500);
      } else {
        rec('C.Archive', 'advanced collection filter', false, 'no selectable options');
      }
    } else {
      rec('C.Archive', 'advanced filter select', false, 'no select in advanced panel');
    }
  } else {
    rec('C.Archive', 'advanced filter disclosure', false, 'details not found');
  }

  // ---------- D. SAVED REFERENCES ----------
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const saveBtn = page.locator('.reference-card button[aria-label*="av"], button[aria-label*="Save"]').first();
  if (await saveBtn.count()) {
    const beforeLabel = await saveBtn.getAttribute('aria-label');
    await saveBtn.click();
    await page.waitForTimeout(600);
    const afterLabel = await saveBtn.getAttribute('aria-label');
    rec('D.Saved', 'save toggle updates control', beforeLabel !== afterLabel, `${beforeLabel} -> ${afterLabel}`);

    // persist after reload
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const saveBtn2 = page.locator('.reference-card button[aria-label*="av"], button[aria-label*="Save"]').first();
    const afterReload = await saveBtn2.getAttribute('aria-label');
    rec('D.Saved', 'saved persists after reload', afterReload === afterLabel, `expected=${afterLabel} got=${afterReload}`);

    // saved page shows it
    await page.goto(BASE + '/saved', { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const savedTxt = await page.locator('main').innerText();
    const hasEmpty = /no saved/i.test(savedTxt);
    rec('D.Saved', 'saved page shows saved item', !hasEmpty, `emptyState=${hasEmpty} text=${savedTxt.slice(0, 120).replace(/\n/g, ' ')}`);

    // navbar counter consistency
    const navSaved = await page.locator('header', { hasText: 'Saved' }).first().innerText();
    rec('D.Saved', 'navbar counter consistency', !/0 saved/i.test(navSaved) || hasEmpty,
      `nav="${navSaved.replace(/\n/g, ' ').slice(0, 80)}"`);

    // saved-only filter on browse
    await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const savedToggle = page.locator('button.filter-pill--saved, button[aria-label*="saved"]').first();
    if (await savedToggle.count()) {
      await savedToggle.click();
      await page.waitForTimeout(600);
      const c = await countCards();
      rec('D.Saved', 'saved-only filter', c >= 1 && c < allCount, `cards=${c}`);
      await savedToggle.click();
      await page.waitForTimeout(400);
    } else {
      rec('D.Saved', 'saved-only filter control', false, 'toggle not found');
    }

    // unsave
    await page.locator('.reference-card button[aria-label*="av"], button[aria-label*="Save"]').first().click();
    await page.waitForTimeout(500);
    await page.goto(BASE + '/saved', { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const savedTxt2 = await page.locator('main').innerText();
    rec('D.Saved', 'unsave removes from saved page', /no saved/i.test(savedTxt2), `text=${savedTxt2.slice(0, 100).replace(/\n/g, ' ')}`);
  } else {
    rec('D.Saved', 'save button on card', false, 'no save button found');
  }

  // Collections -> reference navigation
  await page.goto(BASE + '/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const colLinks = page.locator('main a[href*="/reference/"], main a[href*="/browse"], main button');
  const colBtn = page.locator('main a, main button').filter({ hasText: /View|Explore|collection/i }).first();
  if (await colBtn.count()) {
    const tag = await colBtn.evaluate((el) => el.tagName + ':' + (el.getAttribute('href') || 'no-href'));
    try {
      await colBtn.click({ timeout: 4000 });
      await page.waitForTimeout(900);
      const dest = page.url().replace(BASE, '');
      rec('D.Collections', 'collection CTA navigates', dest !== '/collections', `tag=${tag} dest=${dest}`);
    } catch (e) {
      rec('D.Collections', 'collection CTA navigates', false, `tag=${tag} err=${e.message.slice(0, 80)}`);
    }
  } else {
    rec('D.Collections', 'collection CTA', false, 'no collection CTA found');
  }

  // Reference detail: from card click
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const firstCard = page.locator('.reference-card, article').first();
  try {
    await firstCard.click({ timeout: 4000 });
    await page.waitForTimeout(900);
    const dest = page.url().replace(BASE, '');
    const detailTxt = await page.locator('main').innerText();
    const isDetail = /reference|breadcrumb|provenance|creator|technique/i.test(detailTxt) && !/Reference Not Found/.test(detailTxt);
    rec('B.Navigation', 'card -> reference detail', dest.startsWith('/reference/') && isDetail, `dest=${dest}`);
    // back link
    const backLink = page.locator('main a', { hasText: /Back|Archive|Browse/ }).first();
    if (await backLink.count()) {
      await backLink.click();
      await page.waitForTimeout(800);
      rec('B.Navigation', 'detail back-to-archive', /browse|\/$/.test(page.url().replace(BASE, '')), `dest=${page.url().replace(BASE, '')}`);
    } else {
      rec('B.Navigation', 'detail back-to-archive', false, 'no back link');
    }
  } catch (e) {
    rec('B.Navigation', 'card -> reference detail', false, e.message.slice(0, 120));
  }

  // ---------- E. THEME & INTERACTIONS ----------
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const themeBtn = page.locator('header button[aria-label*="theme"]').first();
  if (await themeBtn.count()) {
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className);
    await themeBtn.click();
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const afterReload = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className);
    rec('E.Theme', 'theme toggle + persists', before !== after && after === afterReload,
      `before="${before}" after="${after}" reload="${afterReload}"`);
  } else {
    rec('E.Theme', 'theme toggle present', false, 'no theme button');
  }

  // Click blockage: click hero CTA and verify scroll/behavior
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const heroCta = page.locator('.hero-cta-btn, .hero-actions button').first();
  if (await heroCta.count()) {
    const y0 = await page.evaluate(() => window.scrollY);
    await heroCta.click({ timeout: 4000 });
    await page.waitForTimeout(1200);
    const y1 = await page.evaluate(() => window.scrollY);
    rec('E.Interactions', 'hero CTA scrolls to archive', y1 > y0 + 200, `scrollY ${y0} -> ${y1}`);
  } else {
    rec('E.Interactions', 'hero CTA present', false, 'not found');
  }

  // Click a card after scroll (detect overlay blocking)
  const card = page.locator('.reference-card').first();
  if (await card.count()) {
    try {
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await card.click({ timeout: 4000 });
      await page.waitForTimeout(800);
      const dest = page.url().replace(BASE, '');
      rec('E.Interactions', 'card clickable (no overlay block)', dest.startsWith('/reference/') || dest !== '/', `dest=${dest}`);
    } catch (e) {
      rec('E.Interactions', 'card clickable (no overlay block)', false, e.message.slice(0, 140));
    }
  }

  // Keyboard shortcut "/" opens search
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('body').click({ position: { x: 700, y: 500 } });
  await page.keyboard.press('/');
  await page.waitForTimeout(600);
  const modalOpen = await page.locator('.search-modal-backdrop, [role="dialog"]').count();
  rec('E.Interactions', 'keyboard "/" opens search', modalOpen > 0, `dialogs=${modalOpen}`);
  if (modalOpen > 0) await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // ---------- F. MOTION ----------
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const hiddenAfterLoad = await page.evaluate(() => {
    return [...document.querySelectorAll('section, article, .pillar-card, .reference-card')].filter((el) => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.opacity) < 0.5 && el.getBoundingClientRect().height > 20;
    }).length;
  });
  rec('F.Motion', 'no invisible sections at load', hiddenAfterLoad === 0, `hidden=${hiddenAfterLoad}`);

  // Scroll to bottom, ensure everything visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  const hiddenAfterScroll = await page.evaluate(() => {
    return [...document.querySelectorAll('section, article, .pillar-card, .reference-card, footer')].filter((el) => {
      const cs = getComputedStyle(el);
      return (parseFloat(cs.opacity) < 0.5 || cs.visibility === 'hidden') && el.getBoundingClientRect().height > 20;
    }).length;
  });
  rec('F.Motion', 'all content visible after scroll', hiddenAfterScroll === 0, `hidden=${hiddenAfterScroll}`);

  // Reduced motion
  const ctxRM = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const pRM = await ctxRM.newPage();
  await pRM.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pRM.waitForTimeout(1500);
  const rmHidden = await pRM.evaluate(() => {
    return [...document.querySelectorAll('section, article, .pillar-card, .reference-card')].filter((el) => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.opacity) < 0.5 && el.getBoundingClientRect().height > 20;
    }).length;
  });
  const rmText = (await pRM.locator('main').innerText()).length;
  rec('F.Motion', 'reduced-motion content visible', rmHidden === 0 && rmText > 1500, `hidden=${rmHidden} textLen=${rmText}`);
  await ctxRM.close();

  rec('F.Motion', 'no runtime errors', pageErrors.length === 0,
    pageErrors.length ? [...new Set(pageErrors)].slice(0, 5).join(' || ').slice(0, 400) : 'clean');

  // ---------- SUMMARY ----------
  const fails = results.filter((r) => !r.pass);
  console.log('\n================ SUMMARY ================');
  console.log(`TOTAL: ${results.length}  PASS: ${results.length - fails.length}  FAIL: ${fails.length}`);
  for (const f of fails) console.log(`  FAIL [${f.area}] ${f.name}: ${f.detail}`);

  await browser.close();
})();
