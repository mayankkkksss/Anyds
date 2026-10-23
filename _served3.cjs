const http = require('http');
const get = (path) => new Promise((res, rej) => {
  http.get('http://localhost:3000' + path, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', rej);
});

const CHECKS = {
  '/src/components/hero/HeroCanvas.tsx': [
    ['NEW: on-demand needsRender', 'needsRender'],
    ['NEW: software detection', 'detectSoftwareRenderer'],
    ['NEW: antialias toggle', 'antialias: !isSoftwareGL'],
    ['NEW: visibilitychange', 'visibilitychange'],
    ['GONE: perpetual drift', 'Math.sin(elapsedTime'],
    ['GONE: unconditional render', 'clock.getElapsedTime'],
  ],
  '/src/components/hero/HeroSection.tsx': [
    ['NEW: canvasReady', 'canvasReady'],
    ['NEW: requestIdleCallback', 'requestIdleCallback'],
    ['NEW: fromTo entrance', 'fromTo'],
    ['KEEP: Suspense', 'Suspense'],
    ['KEEP: lazy(', 'lazy('],
  ],
};

(async () => {
  for (const [p, needles] of Object.entries(CHECKS)) {
    try {
      const r = await get(p);
      console.log(`${p} (${r.status})`);
      for (const [label, n] of needles) {
        console.log(`   ${r.body.includes(n) ? 'YES' : 'no '} ${label}`);
      }
    } catch (e) {
      console.log(`ERR ${p}: ${e.message}`);
    }
  }
})();
