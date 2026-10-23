const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  const failedReqs = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', (r) => failedReqs.push(r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
  page.on('response', (r) => {
    if (r.status() >= 400) failedReqs.push('HTTP ' + r.status() + ' ' + r.url());
  });

  const routes = ['/', '/browse', '/collections', '/saved', '/about', '/reference/r001'];

  for (const route of routes) {
    errors.length = 0;
    failedReqs.length = 0;
    let status;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      status = resp ? resp.status() : 'no-response';
    } catch (e) {
      console.log(`\n### ${route}\n  NAV ERROR: ${e.message}`);
      continue;
    }
    await page.waitForTimeout(1500);

    const info = await page.evaluate(() => {
      const body = document.body;
      const text = body.innerText.trim();
      const root = document.getElementById('root');
      const kids = root ? root.children.length : -1;
      // find sections
      const secs = [...document.querySelectorAll('section, footer, header')].map((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return {
          tag: s.tagName.toLowerCase(),
          cls: (s.className || '').toString().slice(0, 45),
          h: Math.round(r.height),
          top: Math.round(r.top),
          op: cs.opacity,
          vis: cs.visibility,
          disp: cs.display,
        };
      });
      // elements that are absolutely positioned and cover viewport
      const covers = [...document.querySelectorAll('*')].filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.position !== 'absolute' && cs.position !== 'fixed') return false;
        const r = el.getBoundingClientRect();
        return r.width >= window.innerWidth * 0.95 && r.height >= window.innerHeight * 0.95 && cs.pointerEvents !== 'none';
      }).map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 45),
        pos: getComputedStyle(el).position,
        pe: getComputedStyle(el).pointerEvents,
        z: getComputedStyle(el).zIndex,
      }));
      // invisible-but-present elements (opacity 0 with content)
      const hidden = [...document.querySelectorAll('section, div, article, li')].filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (parseFloat(cs.opacity) > 0.05) return false;
        return el.innerText && el.innerText.trim().length > 40;
      }).map((el) => ({
        cls: (el.className || '').toString().slice(0, 45),
        op: getComputedStyle(el).opacity,
        h: Math.round(el.getBoundingClientRect().height),
        txt: el.innerText.trim().slice(0, 60),
      }));
      return {
        textLen: text.length,
        rootChildren: kids,
        scrollH: document.documentElement.scrollHeight,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
          ? document.documentElement.scrollWidth + '>' + window.innerWidth : 'no',
        secs,
        covers,
        hidden: hidden.slice(0, 8),
        sample: text.replace(/\n+/g, ' | ').slice(0, 400),
      };
    });

    console.log(`\n### ${route}  [HTTP ${status}]`);
    console.log(`  textLen=${info.textLen} rootChildren=${info.rootChildren} scrollH=${info.scrollH} overflowX=${info.overflowX}`);
    console.log(`  sample: ${info.sample}`);
    console.log(`  sections:`);
    for (const s of info.secs) {
      const flag = (s.h === 0 || s.op === '0' || s.vis === 'hidden') ? ' <<<< SUSPECT' : '';
      console.log(`    ${s.tag}.${s.cls} h=${s.h} top=${s.top} op=${s.op} vis=${s.vis} disp=${s.disp}${flag}`);
    }
    if (info.covers.length) {
      console.log(`  viewport-covering overlays:`);
      for (const c of info.covers) console.log(`    ${c.tag}.${c.cls} pos=${c.pos} pe=${c.pe} z=${c.z} <<<< CLICK-BLOCK?`);
    }
    if (info.hidden.length) {
      console.log(`  INVISIBLE content:`);
      for (const h of info.hidden) console.log(`    .${h.cls} op=${h.op} h=${h.h} "${h.txt}"`);
    }
    if (errors.length) {
      console.log(`  CONSOLE ERRORS (${errors.length}):`);
      [...new Set(errors)].slice(0, 6).forEach((e) => console.log(`    - ${e.slice(0, 300)}`));
    }
    if (failedReqs.length) {
      console.log(`  FAILED REQUESTS (${failedReqs.length}):`);
      [...new Set(failedReqs)].slice(0, 6).forEach((e) => console.log(`    - ${e.slice(0, 200)}`));
    }
  }

  await browser.close();
})();
