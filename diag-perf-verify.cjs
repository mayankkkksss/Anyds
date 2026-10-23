const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  // ---- 1. Nav click reliability at several offsets after load ----
  console.log('--- 1. NAV CLICK RELIABILITY ---');
  for (const t of [800, 2000, 3500, 6000]) {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(t);
    const start = Date.now();
    try {
      await page.locator('header nav a', { hasText: /^Browse/ }).first().click({ timeout: 4000, noWaitAfter: true });
      await page.waitForTimeout(250);
      console.log(`  click @${t}ms: OK in ${Date.now() - start}ms -> ${page.url().replace(BASE, '')}`);
    } catch (e) {
      await page.waitForTimeout(1200);
      console.log(`  click @${t}ms: SLOW(${Date.now() - start}ms) -> now ${page.url().replace(BASE, '')}`);
    }
  }

  // ---- 2. Hero canvas renders + drag rotates ----
  console.log('\n--- 2. CANVAS RENDER + DRAG ---');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000); // let deferred init complete
  const canvasInfo = await page.evaluate(() => {
    const c = document.querySelector('.hero-canvas-layer canvas') || document.querySelector('canvas');
    if (!c) return { present: false };
    // sample pixels to prove something was drawn
    const probe = document.createElement('canvas');
    probe.width = 40; probe.height = 40;
    const ctx = probe.getContext('2d');
    ctx.drawImage(c, 0, 0, 40, 40);
    const data = ctx.getImageData(0, 0, 40, 40).data;
    let nonTransparent = 0, sum = 0;
    for (let i = 3; i < data.length; i += 4) { if (data[i] > 8) nonTransparent++; sum += data[i]; }
    return { present: true, w: c.width, h: c.height, nonTransparent, avgAlpha: Math.round(sum / 1600) };
  });
  console.log('  canvas:', JSON.stringify(canvasInfo));

  const box = await page.locator('canvas').first().boundingBox().catch(() => null);
  if (box) {
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    const before = await page.evaluate(() => {
      // no direct access to three objects; compare rendered pixel signature
      const c = document.querySelector('canvas');
      const probe = document.createElement('canvas');
      probe.width = 60; probe.height = 60;
      const ctx = probe.getContext('2d');
      ctx.drawImage(c, 0, 0, 60, 60);
      const d = ctx.getImageData(0, 0, 60, 60).data;
      let sig = 0;
      for (let i = 0; i < d.length; i += 40) sig += d[i] * (i + 1);
      return sig;
    });
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    for (let i = 0; i < 10; i++) { await page.mouse.move(cx - i * 25, cy - i * 4); await page.waitForTimeout(40); }
    await page.mouse.up();
    await page.waitForTimeout(900); // allow easing + render
    const after = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      const probe = document.createElement('canvas');
      probe.width = 60; probe.height = 60;
      const ctx = probe.getContext('2d');
      ctx.drawImage(c, 0, 0, 60, 60);
      const d = ctx.getImageData(0, 0, 60, 60).data;
      let sig = 0;
      for (let i = 0; i < d.length; i += 40) sig += d[i] * (i + 1);
      return sig;
    });
    console.log(`  pixel signature changed after drag: ${before !== after} (${before} -> ${after})`);
  } else {
    console.log('  no canvas element found!');
  }

  // ---- 3. Scroll away + back: canvas repaints ----
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(800);
  const lagAfterScroll = await page.evaluate(() => new Promise((res) => {
    let last = performance.now(); const t0 = last; let max = 0;
    const tick = () => { const n = performance.now(); max = Math.max(max, n - last - 50); last = n; n - t0 < 2000 ? setTimeout(tick, 50) : res(Math.round(max)); };
    setTimeout(tick, 50);
  }));
  console.log(`  max event-loop lag while scrolled away: ${lagAfterScroll}ms`);

  // ---- 4. Reduced motion: static frame, content visible ----
  console.log('\n--- 4. REDUCED MOTION ---');
  const ctxRM = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const pRM = await ctxRM.newPage();
  await pRM.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pRM.waitForTimeout(6000);
  const rm = await pRM.evaluate(() => {
    const hero = document.querySelector('.hero-cta-btn');
    const cs = hero ? getComputedStyle(hero) : null;
    const c = document.querySelector('canvas');
    let painted = 'no-canvas';
    if (c) {
      const probe = document.createElement('canvas');
      probe.width = 30; probe.height = 30;
      const ctx = probe.getContext('2d');
      ctx.drawImage(c, 0, 0, 30, 30);
      const d = ctx.getImageData(0, 0, 30, 30).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++;
      painted = n;
    }
    return { ctaOp: cs && cs.opacity, painted };
  });
  const rmLag = await pRM.evaluate(() => new Promise((res) => {
    let last = performance.now(); const t0 = last; let max = 0;
    const tick = () => { const n = performance.now(); max = Math.max(max, n - last - 50); last = n; n - t0 < 2500 ? setTimeout(tick, 50) : res(Math.round(max)); };
    setTimeout(tick, 50);
  }));
  console.log(`  cta opacity=${rm.ctaOp} canvas painted px=${rm.painted} maxLag=${rmLag}ms`);
  await ctxRM.close();

  // ---- 5. Theme toggle remounts + repaints ----
  console.log('\n--- 5. THEME TOGGLE ---');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  const sig1 = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return 'no-canvas';
    const p = document.createElement('canvas'); p.width = 30; p.height = 30;
    const x = p.getContext('2d'); x.drawImage(c, 0, 0, 30, 30);
    const d = x.getImageData(0, 0, 30, 30).data; let s = 0;
    for (let i = 0; i < d.length; i += 4) s += d[i];
    return s;
  });
  await page.locator('header button[aria-label*="theme"]').first().click();
  await page.waitForTimeout(5000);
  const sig2 = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return 'no-canvas';
    const p = document.createElement('canvas'); p.width = 30; p.height = 30;
    const x = p.getContext('2d'); x.drawImage(c, 0, 0, 30, 30);
    const d = x.getImageData(0, 0, 30, 30).data; let s = 0;
    for (let i = 0; i < d.length; i += 4) s += d[i];
    return s;
  });
  console.log(`  canvas painted after toggle: sig1=${sig1 !== 'no-canvas'} sig2=${sig2 !== 'no-canvas'} changed=${sig1 !== sig2}`);

  console.log('\nERRORS:', errors.length ? [...new Set(errors)].slice(0, 5).join(' | ') : 'none');
  await browser.close();
})();
