const http = require('http');
const get = (path) => new Promise((res, rej) => {
  http.get('http://localhost:3000' + path, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', rej);
});

const NEEDLES = {
  '/src/pages/ReferenceDetailPage.tsx': [
    ['NEW:Source Link Unavailable', 'Source Link Unavailable'],
    ['NEW:noopener noreferrer', 'noopener noreferrer'],
    ['NEW:history.back (OLD)', 'history.back()'],
    ['OLD:Button primary Visit', 'Visit Original Source'],
    ['NEW:to Link breadcrumb', 'to: "/"'],
    ['BOTH:navigate import', 'useNavigate'],
  ],
  '/src/pages/SavedPage.tsx': [
    ['NEW:navigate detail', 'reference/'],
    ['OLD:noop onSelect', 'onSelectReference: () => {}'],
    ['NEW:handleSelectReference', 'handleSelectReference'],
  ],
  '/src/components/navigation/Navbar.tsx': [
    ['NEW:search toggle', 'navbar-search-toggle'],
  ],
  '/src/components/layout/AppLayout.tsx': [
    ['NEW:SearchModal', 'SearchModal'],
    ['OLD:noop onOpenSearch', 'onOpenSearch: () => {}'],
  ],
};

(async () => {
  for (const [p, needles] of Object.entries(NEEDLES)) {
    try {
      const r = await get(p);
      const out = needles.map(([label, n]) => `${r.body.includes(n) ? 'YES' : 'no '} ${label}`);
      console.log(`${p}\n   ${out.join('\n   ')}`);
    } catch (e) {
      console.log(`ERR ${p}: ${e.message}`);
    }
  }
})();
