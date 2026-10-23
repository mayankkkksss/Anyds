const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'http://localhost:3000';

const b64 = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Hero after deferred init
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6500);
  await page.screenshot({ path: 'after-hero.png' });
  console.log('captured after-hero.png');

  // 2. Drag on canvas then capture (should rotate the satellite)
  const box = await page.locator('canvas').first().boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx - i * 30, cy - i * 3); await page.waitForTimeout(30); }
  await page.mouse.up();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'after-drag.png' });
  console.log('captured after-drag.png');

  // 3. Diff the two hero screenshots (top 660px = canvas region)
  const diffPct = await page.evaluate(async ([a, b]) => {
    const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const W = 300, H = 140;
    const mk = (im) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H); return x.getImageData(0, 0, W, H).data; };
    const da = mk(ia), db = mk(ib);
    let diff = 0, total = 0, maxd = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
      total++; if (d > 24) diff++; maxd = Math.max(maxd, d);
    }
    return { changedPct: +(100 * diff / total).toFixed(1), maxDelta: maxd };
  }, [b64('after-hero.png'), b64('after-drag.png')]);
  console.log('drag diff (canvas region):', JSON.stringify(diffPct));

  // 4. Brightness/variance of the hero canvas region = proof it is painted
  const stats = await page.evaluate(async (src) => {
    const im = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
    const W = 300, H = 140;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data;
    let min = 255, max = 0, sum = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { const v = (d[i] + d[i + 1] + d[i + 2]) / 3; min = Math.min(min, v); max = Math.max(max, v); sum += v; n++; }
    return { min: Math.round(min), max: Math.round(max), mean: Math.round(sum / n), range: Math.round(max - min) };
  }, b64('after-hero.png'));
  console.log('hero region luminance:', JSON.stringify(stats), '(range > 25 means the 3D scene is drawn)');

  await browser.close();
})();
