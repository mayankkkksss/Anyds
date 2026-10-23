const fs = require('fs');
const m = fs.readFileSync('src/data/index.ts', 'utf8');
const ids = [...m.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((x) => x[1]);
console.log('IDS:', JSON.stringify(ids));
const refIds = [...m.matchAll(/\bid:\s*['"](r[^'"]*)['"]/g)].map((x) => x[1]);
console.log('REF IDS:', JSON.stringify(refIds));
