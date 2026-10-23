const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Get full page HTML
  const html = await page.content();
  
  // Find all occurrences of reference-card
  const regex = /reference-card/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null) {
    count++;
    const start = Math.max(0, match.index - 200);
    const end = Math.min(html.length, match.index + 200);
    console.log(`--- Match ${count} at index ${match.index} ---`);
    console.log(html.substring(start, end));
    console.log('');
    if (count >= 5) break;
  }
  
  console.log(`Total reference-card occurrences: ${count}`);
  
  // Also check for browse-command-bar
  if (html.includes('browse-command-bar')) {
    console.log('browse-command-bar found');
  } else {
    console.log('browse-command-bar NOT found');
    // Search for partial
    const idx = html.indexOf('command');
    if (idx >= 0) {
      console.log('Partial "command" found at:', idx, html.substring(idx, idx+100));
    }
  }
  
  // Check for discovery-grid
  if (html.includes('discovery-grid')) {
    console.log('discovery-grid found');
  } else {
    console.log('discovery-grid NOT found');
  }
  
  await browser.close();
})();