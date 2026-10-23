const http = require('http');
const get = (path) => new Promise((res, rej) => {
  http.get('http://localhost:3000' + path, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', rej);
});

(async () => {
  const checks = [
    ['/src/pages/ReferenceDetailPage.tsx', ['Visit Original Source', "navigate('/browse')", 'originUrl']],
    ['/src/pages/SavedPage.tsx', ['handleSelectReference', 'onSelectReference={() => {}}']],
    ['/src/components/layout/AppLayout.tsx', ['setIsSearchOpen', '() => {}']],
    ['/src/pages/DiscoverPage.tsx', ['onSecondaryClick']],
    ['/src/components/hero/HeroSection.tsx', ['fromTo', 'gsap.context']],
    ['/src/motion/SectionReveal.tsx', ['gsap.context', 'fromTo']],
    ['/src/pages/CollectionsPage.tsx', ['?collection=']],
  ];
  for (const [p, needles] of checks) {
    try {
      const r = await get(p);
      const marks = needles.map((n) => `${n.includes('()') || n.includes('{')}=${r.body.includes(n)}`).join(' ');
      console.log(`${r.status} len=${String(r.body.length).padStart(6)} ${p}\n      ${needles.map((n) => `"${n}" -> ${r.body.includes(n)}`).join('  ')}`);
    } catch (e) {
      console.log(`ERR ${p}: ${e.message}`);
    }
  }
})();
