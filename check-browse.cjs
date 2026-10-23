const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  await page.goto('http://localhost:3000/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Get full page HTML
  const html = await page.content();
  
  // Check for filter bar
  if (html.includes('browse-command-bar')) {
    console.log('Filter bar found in /browse');
  } else {
    console.log('Filter bar NOT found in /browse');
  }
  
  // Check for discovery-grid-container
  if (html.includes('discovery-grid-container')) {
    console.log('Discovery grid container found in /browse');
  } else {
    console.log('Discovery grid container NOT found in /browse');
  }
  
  // Check for reference-card elements (not in CSS)
  const bodyHtml = await page.locator('body').evaluate(el => el.innerHTML);
  if (bodyHtml.includes('class="reference-card"') || bodyHtml.includes("class='reference-card'")) {
    console.log('Reference card elements found in /browse');
  } else {
    console.log('Reference card elements NOT found in /browse');
  }
  
  // Get the main content
  const mainContent = await page.locator('main').first();
  const mainHtml = await mainContent.evaluate(el => el.innerHTML);
  console.log('=== MAIN CONTENT (first 5000 chars) ===');
  console.log(mainHtml.substring(0, 5000));
  
  await browser.close();
})();