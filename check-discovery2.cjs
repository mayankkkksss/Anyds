const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for animations to settle
  await page.waitForTimeout(3000);
  
  // Get the full HTML of the discover section
  const discoverSection = await page.locator('#discover').first();
  const html = await discoverSection.evaluate(el => el.innerHTML);
  console.log('Discover section HTML (first 5000 chars):', html.substring(0, 5000));
  
  await browser.close();
})();