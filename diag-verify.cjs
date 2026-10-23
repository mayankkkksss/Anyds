const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

const results = [];
const rec = (area, name, pass, detail) => {
  results.push({ area, name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${area} | ${name} | ${detail}`);
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('dialog', async (d) => { await d.dismiss(); errors.push('unexpected ' + d.type() + ': ' + d.message()); });

  const cardCount = () => page.locator('.reference-card').count();

  // =========================================================
  // A. HOMEPAGE CONTENT BELOW HERO
  // =========================================================
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);

  const hero = await page.evaluate(() => {
    const pick = (s) => {
      const el = document.querySelector(s);
      if (!el) return 'MISSING';
      const cs = getComputedStyle(el);
      return { op: cs.opacity, vis: cs.visibility, h: Math.round(el.getBoundingClientRect().height) };
    };
    return {
      title: pick('.hero-title-line'),
      sub: pick('.hero-subtext'),
      cta: pick('.hero-cta-btn'),
      sec: pick('.hero-secondary-btn'),
      heroH: Math.round(document.querySelector('.hero-section').getBoundingClientRect().height),
      pillars: pick('.pillars-section'),
      featured: pick('.featured-spread-section'),
      discover: pick('#discover'),
      footer: pick('footer'),
      cards: document.querySelectorAll('#discover .reference-card').length,
      scrollH: document.documentElement.scrollHeight,
    };
  });
  const vis = (o) => o && o.op === '1' && o.vis === 'visible' && o.h > 20;
  rec('A.Home', 'hero headline visible', vis(hero.title), JSON.stringify(hero.title));
  rec('A.Home', 'hero supporting text visible', vis(hero.sub), JSON.stringify(hero.sub));
  rec('A.Home', 'hero primary CTA visible', vis(hero.cta), JSON.stringify(hero.cta));
  rec('A.Home', 'pillars section visible', vis(hero.pillars), JSON.stringify(hero.pillars));
  rec('A.Home', 'featured section visible', vis(hero.featured), JSON.stringify(hero.featured));
  rec('A.Home', 'archive section w/ cards visible', vis(hero.discover) && hero.cards >= 10,
    `op=${hero.discover.op} cards=${hero.cards}`);
  rec('A.Home', 'footer visible', vis(hero.footer), JSON.stringify(hero.footer));
  rec('A.Home', 'page tall enough to scroll', hero.scrollH > 3000, `scrollH=${hero.scrollH}`);

  // scroll positions (allow SectionReveal stagger animations to settle)
  for (const y of [0, 900, 2000, 4000, 99999]) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(2600);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('main section, main article, main .reference-card, main .pillar-card, footer')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return r.height > 20 && (parseFloat(cs.opacity) < 0.9 || cs.visibility === 'hidden');
        }).length);
    rec('A.Home', `no hidden content @scroll ${y}`, hidden === 0, `hidden=${hidden}`);
  }

  // =========================================================
  // B. ROUTING & NAVIGATION
  // =========================================================
  const routes = ['/', '/browse', '/collections', '/saved', '/about', '/reference/ref-03'];
  for (const r of routes) {
    errors.length = 0;
    const resp = await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const txt = await page.locator('main').innerText();
    // Accept a real page OR a real editorial empty state (e.g. /saved with 0 saved)
    const okText =
      !txt.includes('Reference Not Found') &&
      (txt.length > 400 || /No saved references yet/i.test(txt));
    rec('B.Routing', `direct load ${r}`, resp.status() === 200 && okText && errors.length === 0,
      `http=${resp.status()} len=${txt.length} errors=${errors.length}${errors.length ? ' :: ' + errors[0].slice(0, 150) : ''}`);
  }

  // navbar click-through
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  for (const [label, href] of [['Browse', '/browse'], ['Collections', '/collections'], ['Saved', '/saved'], ['About', '/about'], ['Discover', '/']]) {
    try {
      // noWaitAfter: React Router does a same-document (SPA) navigation;
      // Playwright's post-click navigation wait would otherwise time out.
      await page.locator('header nav a', { hasText: new RegExp(`^${label}`) }).first().click({ timeout: 5000, noWaitAfter: true });
      await page.waitForTimeout(600);
      const ok = page.url().replace(BASE, '') === href || (href === '/' && page.url().replace(BASE, '') === '/');
      rec('B.Navigation', `nav "${label}"`, ok, `url=${page.url().replace(BASE, '')}`);
    } catch (e) { rec('B.Navigation', `nav "${label}"`, false, e.message.split('\n')[0].slice(0, 100)); }
  }

  // back / forward
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('header nav a', { hasText: /^Browse/ }).first().click();
  await page.waitForURL('**/browse');
  await page.goBack(); await page.waitForTimeout(700);
  const back = page.url().replace(BASE, '') === '/';
  await page.goForward(); await page.waitForTimeout(700);
  const fwd = page.url().replace(BASE, '') === '/browse';
  rec('B.Navigation', 'back/forward', back && fwd, `back=${back} fwd=${fwd}`);

  // card -> modal -> detail -> back to archive (direct-load aware)
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.locator('.reference-card').first().click({ timeout: 6000 });
  await page.waitForTimeout(800);
  const modalOpen = await page.locator('[role="dialog"]').count();
  let detailOk = false, dest = '';
  if (modalOpen) {
    await page.locator('button', { hasText: /Inspect Study Details/i }).first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    dest = page.url().replace(BASE, '');
    const t = await page.locator('main').innerText();
    detailOk = dest.startsWith('/reference/') && !t.includes('Reference Not Found') && /Recreation Architecture Brief/i.test(t);
  }
  rec('B.Navigation', 'card -> detail page', modalOpen > 0 && detailOk, `modal=${modalOpen} dest=${dest}`);

  // Back to Archive works even on a direct deep-link load
  const backBtn = page.locator('main button', { hasText: /Back to Archive/i }).first();
  if (await backBtn.count()) {
    await backBtn.click({ timeout: 5000 });
    await page.waitForTimeout(900);
    rec('B.Navigation', 'Back to Archive (deep-link safe)', page.url().replace(BASE, '') === '/browse',
      `dest=${page.url().replace(BASE, '')}`);
  } else rec('B.Navigation', 'Back to Archive button', false, 'not found');

  // external source link
  await page.goto(BASE + '/reference/ref-05', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const src = await page.locator('a', { hasText: /Visit Original Source/i }).first().evaluate((a) => ({
    href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel'),
  })).catch(() => null);
  const srcOk = !!src && /^https?:\/\//.test(src.href) && src.target === '_blank' && /noopener/.test(src.rel || '');
  rec('B.Navigation', 'Visit Original Source real external link', srcOk, JSON.stringify(src));

  // =========================================================
  // C. SEARCH & FILTERS
  // =========================================================
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const all = await cardCount();
  rec('C.Archive', 'grid renders all references', all >= 12, `cards=${all}`);

  const spring = page.locator('button.filter-pill', { hasText: /^Spring$/ }).first();
  await spring.click(); await page.waitForTimeout(600);
  const springN = await cardCount();
  rec('C.Archive', 'category filter narrows results', springN > 0 && springN < all && (await spring.getAttribute('aria-pressed')) === 'true',
    `${all} -> ${springN}`);

  await page.locator('button.filter-pill', { hasText: /^All$/ }).first().click();
  await page.waitForTimeout(500);
  rec('C.Archive', 'filter reset', (await cardCount()) === all, `cards=${await cardCount()}`);

  const search = page.locator('input[type="search"], input[placeholder*="Search"]').first();
  await search.fill('shader'); await page.waitForTimeout(250);
  await search.press('Enter'); await page.waitForTimeout(700);
  const searchN = await cardCount();
  rec('C.Archive', 'search updates results', searchN > 0 && searchN < all, `${all} -> ${searchN}`);

  await search.fill('qqqzzznotfound'); await page.waitForTimeout(250);
  await search.press('Enter'); await page.waitForTimeout(700);
  const zeroN = await cardCount();
  const esText = await page.locator('.discovery-grid-empty-state').count()
    ? await page.locator('.discovery-grid-empty-state').first().innerText() : '';
  const esOk = zeroN === 0 && /No matching motion references/i.test(esText) && /Clear Active Filters/i.test(esText);
  rec('C.Archive', 'zero-result empty state', esOk, `cards=${zeroN} "${esText.replace(/\n/g, ' ').slice(0, 90)}"`);
  if (esOk) {
    await page.locator('button', { hasText: /Clear Active Filters/i }).first().click();
    await page.waitForTimeout(700);
    rec('C.Archive', 'empty-state reset button works', (await cardCount()) === all, `cards=${await cardCount()}`);
  }

  // advanced filters
  await page.locator('details.filter-bar-advanced summary').first().click();
  await page.waitForTimeout(400);
  const sel = page.locator('#filter-collection-select');
  if (await sel.count()) {
    const val = await sel.locator('option').nth(1).getAttribute('value');
    await sel.selectOption(val); await page.waitForTimeout(700);
    const n = await cardCount();
    rec('C.Archive', 'advanced collection filter', n > 0 && n < all, `slug=${val} cards=${n}`);
    await page.locator('button', { hasText: /Reset all filters/i }).first().click();
    await page.waitForTimeout(600);
    rec('C.Archive', 'advanced reset', (await cardCount()) === all, `cards=${await cardCount()}`);
  } else rec('C.Archive', 'advanced filter select', false, 'missing');

  // =========================================================
  // D. SAVED REFERENCES + COLLECTIONS
  // =========================================================
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const saveBtn = page.locator('.reference-card button[aria-label*="Save"], .reference-card button[aria-label*="saved"]').first();
  const lbl0 = await saveBtn.getAttribute('aria-label');
  await saveBtn.click(); await page.waitForTimeout(600);
  const lbl1 = await saveBtn.getAttribute('aria-label');
  rec('D.Saved', 'save updates control', lbl0 !== lbl1, `${lbl0.slice(0, 30)} -> ${lbl1.slice(0, 30)}`);

  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(1000);
  const lbl2 = await page.locator('.reference-card button[aria-label*="Save"], .reference-card button[aria-label*="saved"]').first().getAttribute('aria-label');
  rec('D.Saved', 'save persists after reload', lbl1 === lbl2, `expected=${lbl1.slice(0, 30)} got=${lbl2.slice(0, 30)}`);

  await page.goto(BASE + '/saved', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const savedTxt = await page.locator('main').innerText();
  const savedCards = await cardCount();
  rec('D.Saved', 'saved page lists saved item', !/No saved references/i.test(savedTxt) && savedCards >= 1,
    `cards=${savedCards}`);

  // clicking a saved card navigates to detail (was a no-op)
  await page.locator('.reference-card').first().click({ timeout: 6000 });
  await page.waitForTimeout(1000);
  const sDest = page.url().replace(BASE, '');
  rec('D.Saved', 'saved card click navigates', sDest.startsWith('/reference/'), `dest=${sDest}`);

  await page.goto(BASE + '/saved', { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
  const navTxt = await page.locator('header').first().innerText();
  rec('D.Saved', 'navbar counter consistent', /Saved\s*[1-9]/i.test(navTxt), `"${navTxt.replace(/\n/g, ' ').slice(0, 70)}"`);

  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
  const savedToggle = page.locator('button.filter-pill--saved').first();
  await savedToggle.click(); await page.waitForTimeout(600);
  const savedOnlyN = await cardCount();
  rec('D.Saved', 'saved-only filter', savedOnlyN >= 1 && savedOnlyN < all, `cards=${savedOnlyN}`);
  await savedToggle.click(); await page.waitForTimeout(400);

  // unsave
  await page.locator('.reference-card button[aria-label*="Save"], .reference-card button[aria-label*="saved"]').first().click();
  await page.waitForTimeout(600);
  await page.goto(BASE + '/saved', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const savedTxt2 = await page.locator('main').innerText();
  rec('D.Saved', 'unsave -> helpful empty state', /No saved references/i.test(savedTxt2) && /Browse the Archive/i.test(savedTxt2),
    `"${savedTxt2.replace(/\n/g, ' ').slice(0, 80)}"`);

  // Collections: real navigation (was no-op)
  await page.goto(BASE + '/collections', { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
  const enter = page.locator('main button', { hasText: /Enter Anthology/i }).first();
  if (await enter.count()) {
    await enter.click({ timeout: 5000 }); await page.waitForTimeout(1100);
    const d = page.url().replace(BASE, '');
    const filtered = await cardCount();
    rec('D.Collections', 'Enter Anthology -> filtered archive', d.startsWith('/browse?collection=') && filtered > 0 && filtered < all,
      `dest=${d} cards=${filtered}`);
  } else rec('D.Collections', 'Enter Anthology button', false, 'not found');

  // collection card (role=button article) also navigates
  await page.goto(BASE + '/collections', { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
  const card2 = page.locator('main [role="button"][aria-label*="Interface Tactility"]').first();
  if (await card2.count()) {
    await card2.click({ timeout: 5000 }); await page.waitForTimeout(1100);
    rec('D.Collections', 'collection card click navigates', page.url().includes('/browse?collection='),
      `dest=${page.url().replace(BASE, '')}`);
  } else rec('D.Collections', 'collection card (role=button)', false, 'not found');

  // direct deep-link to filtered archive
  await page.goto(BASE + '/browse?collection=interface-tactility', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dlN = await cardCount();
  const selVal = await page.locator('#filter-collection-select').inputValue().catch(() => 'n/a');
  rec('D.Collections', 'direct ?collection= deep link', dlN > 0 && dlN < all && selVal === 'interface-tactility',
    `cards=${dlN} select=${selVal}`);

  // =========================================================
  // E. THEME, SEARCH MODAL, SHORTCUTS, CLICK TARGETS
  // =========================================================
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const themeBtn = page.locator('header button[aria-label*="theme"]').first();
  const t0 = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className);
  await themeBtn.click(); await page.waitForTimeout(600);
  const t1 = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className);
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const t2 = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.className);
  rec('E.Theme', 'toggle + persists', t0 !== t1 && t1 === t2, `${t0} -> ${t1} -> reload ${t2}`);

  // navbar search button (was no-op)
  const navSearch = page.locator('header button[aria-label*="search" i]').first();
  if (await navSearch.count()) {
    await navSearch.click({ timeout: 5000, noWaitAfter: true }); await page.waitForTimeout(700);
    const open = await page.locator('[role="dialog"]').count();
    rec('E.Search', 'navbar search button opens modal', open > 0, `dialogs=${open}`);
    if (open) {
      const si = page.locator('[role="dialog"] input').first();
      if (await si.count()) {
        await si.fill('spring'); await page.waitForTimeout(700);
        const optCount = await page.locator('[role="dialog"] [role="option"], [role="dialog"] li').count();
        rec('E.Search', 'modal search returns results', optCount > 0, `options=${optCount}`);
        await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      } else rec('E.Search', 'modal input', false, 'missing');
    }
  } else rec('E.Search', 'navbar search button', false, 'not present');

  // Ctrl+K shortcut (was dead no-op)
  await page.goto(BASE + '/about', { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
  await page.locator('body').click({ position: { x: 700, y: 400 } });
  await page.keyboard.press('Control+k'); await page.waitForTimeout(700);
  const kOpen = await page.locator('[role="dialog"]').count();
  rec('E.Search', 'Ctrl+K opens search', kOpen > 0, `dialogs=${kOpen}`);
  if (kOpen) await page.keyboard.press('Escape');

  // "/" shortcut on browse
  await page.goto(BASE + '/browse', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.locator('body').click({ position: { x: 700, y: 500 } });
  await page.keyboard.press('/'); await page.waitForTimeout(700);
  rec('E.Search', '"/" opens search on /browse', (await page.locator('[role="dialog"]').count()) > 0,
    `dialogs=${await page.locator('[role="dialog"]').count()}`);
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);

  // hero CTA click actually scrolls
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(2600);
  const y0 = await page.evaluate(() => window.scrollY);
  await page.locator('.hero-cta-btn').click({ timeout: 6000 });
  await page.waitForTimeout(1400);
  const y1 = await page.evaluate(() => window.scrollY);
  rec('E.Interactions', 'hero CTA scrolls to archive', y1 > y0 + 300, `scrollY ${y0} -> ${y1}`);

  // hero secondary CTA navigates to collections
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
  await page.locator('.hero-secondary-btn').click({ timeout: 6000 });
  await page.waitForTimeout(1100);
  rec('E.Interactions', 'hero "View Collections" navigates', page.url().replace(BASE, '') === '/collections',
    `dest=${page.url().replace(BASE, '')}`);

  // no overlay blocking clicks in hero
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(2400);
  const ctaBox = await page.locator('.hero-cta-btn').boundingBox();
  const hit = await page.evaluate(([x, y]) => {
    const el = document.elementFromPoint(x, y);
    return el ? `${el.tagName}.${(el.className || '').toString().slice(0, 40)}` : 'null';
  }, [ctaBox.x + ctaBox.width / 2, ctaBox.y + ctaBox.height / 2]);
  rec('E.Interactions', 'no overlay blocking hero CTA', /SPAN|BUTTON/i.test(hit), `hit=${hit}`);

  // =========================================================
  // F. MOTION / RUNTIME
  // =========================================================
  rec('F.Runtime', 'no runtime errors across suite', errors.length === 0,
    errors.length ? [...new Set(errors)].slice(0, 4).join(' || ').slice(0, 400) : 'clean');

  const ctxRM = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const pRM = await ctxRM.newPage();
  const rmErr = [];
  pRM.on('pageerror', (e) => rmErr.push(e.message));
  await pRM.goto(BASE + '/', { waitUntil: 'networkidle' }); await pRM.waitForTimeout(1800);
  const rm = await pRM.evaluate(() => {
    const els = [...document.querySelectorAll('.hero-title-line, .hero-subtext, .hero-cta-btn, .pillar-card, .reference-card, footer')];
    return {
      hidden: els.filter((el) => {
        const cs = getComputedStyle(el);
        return (parseFloat(cs.opacity) < 0.9 || cs.visibility === 'hidden') && el.getBoundingClientRect().height > 20;
      }).length,
      total: els.length,
      ctaOp: getComputedStyle(document.querySelector('.hero-cta-btn')).opacity,
    };
  });
  rec('F.Motion', 'reduced-motion: all content visible', rm.hidden === 0 && rm.total > 5 && rmErr.length === 0,
    `hidden=${rm.hidden}/${rm.total} ctaOp=${rm.ctaOp} err=${rmErr[0] || 'none'}`);
  const rmText = (await pRM.locator('main').innerText()).length;
  rec('F.Motion', 'reduced-motion: content readable', rmText > 2000, `textLen=${rmText}`);
  await ctxRM.close();

  // responsive overflow
  for (const w of [390, 768, 1024, 1440]) {
    const c = await browser.newContext({ viewport: { width: w, height: 800 } });
    const p = await c.newPage();
    // domcontentloaded + settle: the deferred 3D canvas chunk keeps
    // networkidle from settling in the dev server.
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(7000);
    const o = await p.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: window.innerWidth,
      footVisible: !!document.querySelector('footer') && getComputedStyle(document.querySelector('footer')).opacity === '1',
      cards: document.querySelectorAll('.reference-card').length,
    }));
    rec('Responsive', `${w}px no horizontal overflow + content`, o.sw <= o.iw + 1 && o.footVisible && o.cards >= 10,
      `scrollW=${o.sw} inner=${o.iw} footer=${o.footVisible} cards=${o.cards}`);
    await c.close();
  }

  // =========================================================
  // SUMMARY
  // =========================================================
  const fails = results.filter((r) => !r.pass);
  console.log('\n================ FINAL SUMMARY ================');
  console.log(`TOTAL ${results.length} | PASS ${results.length - fails.length} | FAIL ${fails.length}`);
  fails.forEach((f) => console.log(`  FAIL [${f.area}] ${f.name}: ${f.detail}`));

  await browser.close();
})();
