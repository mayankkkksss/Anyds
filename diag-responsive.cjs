const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  for (const w of [768, 1024, 1280, 1440]) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 } });
    const p = await c.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(7000);
    const o = await p.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
      cards: document.querySelectorAll('.reference-card').length,
      heroOp: getComputedStyle(document.querySelector('.hero-title-line')).opacity,
      ctaOp: getComputedStyle(document.querySelector('.hero-cta-btn')).opacity,
      footer: !!document.querySelector('footer'),
      canvas: !!document.querySelector('.hero-canvas-layer canvas'),
    }));
    const pass = o.sw <= o.iw + 1 && o.heroOp === '1' && o.ctaOp === '1' && o.cards >= 10 && o.footer && errs.length === 0;
    console.log(`${pass ? 'PASS' : 'FAIL'} ${w}px: scrollW=${o.sw} inner=${o.iw} heroOp=${o.heroOp} ctaOp=${o.ctaOp} cards=${o.cards} footer=${o.footer} canvasMounted=${o.canvas} errors=${errs.length}`);
    await c.close();
  }
  await browser.close();
})();
