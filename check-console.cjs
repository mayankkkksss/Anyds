const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Capture console messages
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for React to hydrate and any errors to appear
  await page.waitForTimeout(5000);
  
  // Get full page HTML
  const html = await page.content();
  
  // Check if filter bar exists in full HTML
  if (html.includes('browse-command-bar')) {
    console.log('Filter bar found in HTML');
  } else {
    console.log('Filter bar NOT found in HTML');
  }
  
  // Check for discovery-grid-container
  if (html.includes('discovery-grid-container')) {
    console.log('Discovery grid container found in HTML');
  } else {
    console.log('Discovery grid container NOT found in HTML');
  }
  
  // Check for reference-card
  if (html.includes('reference-card')) {
    console.log('Reference card found in HTML');
  } else {
    console.log('Reference card NOT found in HTML');
  }
  
  await browser.close();
})();