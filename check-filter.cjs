const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for React to hydrate
  await page.waitForTimeout(3000);
  
  // Try to access React DevTools or component state
  // We can't easily access React state, but we can check the DOM for clues
  
  // Check the filter pills to see which is active
  const filterPills = await page.locator('.filter-pill').all();
  console.log(`Found ${filterPills.length} filter pills`);
  
  for (let i = 0; i < filterPills.length; i++) {
    const pill = filterPills[i];
    const className = await pill.getAttribute('class');
    const text = await pill.textContent();
    console.log(`Pill ${i}: class="${className}" text="${text?.trim()}"`);
  }
  
  // Check the saved toggle
  const savedToggle = await page.locator('.filter-pill--saved').first();
  const savedClass = await savedToggle.getAttribute('class');
  console.log('Saved toggle class:', savedClass);
  
  // Check the filter status text
  const filterStatus = await page.locator('.filter-bar-status').first();
  const statusText = await filterStatus.textContent();
  console.log('Filter status:', statusText?.trim());
  
  await browser.close();
})();