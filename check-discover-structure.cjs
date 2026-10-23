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
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Get the discover section outer HTML
  const discoverSection = await page.locator('#discover').first();
  const outerHTML = await discoverSection.evaluate(el => el.outerHTML);
  console.log('=== DISCOVER SECTION OUTER HTML ===');
  console.log(outerHTML);
  
  await browser.close();
})();