const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  // Test homepage
  console.log('=== Testing Homepage ===');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Check hero
  const hero = await page.locator('.hero-section').first();
  const heroVisible = await hero.isVisible();
  console.log(`Hero visible: ${heroVisible}`);
  
  // Check CuratorialPillars
  const pillars = await page.locator('.pillars-section').first();
  const pillarsVisible = await pillars.isVisible();
  console.log(`CuratorialPillars visible: ${pillarsVisible}`);
  
  // Check FeaturedSpread
  const featured = await page.locator('.featured-spread-section').first();
  const featuredVisible = await featured.isVisible();
  console.log(`FeaturedSpread visible: ${featuredVisible}`);
  
  // Check discover section CTA
  const discoverCTA = await page.locator('#discover a[href="/browse"]').first();
  const ctaVisible = await discoverCTA.isVisible();
  console.log(`Discover CTA to /browse visible: ${ctaVisible}`);
  
  // Click the CTA to navigate to /browse
  console.log('\n=== Navigating to /browse via CTA ===');
  await discoverCTA.click();
  await page.waitForTimeout(2000);
  
  // Verify we're on /browse
  const url = page.url();
  console.log(`Current URL: ${url}`);
  
  // Check filter bar
  const filterBar = await page.locator('.browse-command-bar').first();
  const filterBarVisible = await filterBar.isVisible();
  console.log(`Filter bar visible: ${filterBarVisible}`);
  
  // Check discovery grid
  const grid = await page.locator('.discovery-grid-container').first();
  const gridVisible = await grid.isVisible();
  console.log(`Discovery grid visible: ${gridVisible}`);
  
  // Check reference cards
  const cards = await page.locator('.reference-card').all();
  console.log(`Reference cards found: ${cards.length}`);
  
  // Test category filter - click "Spring"
  console.log('\n=== Testing Spring filter ===');
  const springPill = await page.locator('.filter-pill:has-text("Spring")').first();
  await springPill.click();
  await page.waitForTimeout(1000);
  
  const cardsAfterFilter = await page.locator('.reference-card').all();
  console.log(`Reference cards after Spring filter: ${cardsAfterFilter.length}`);
  
  // Check filter status
  const filterStatus = await page.locator('.filter-bar-status').first();
  const statusText = await filterStatus.textContent();
  console.log(`Filter status: ${statusText?.trim()}`);
  
  // Test search
  console.log('\n=== Testing search ===');
  const searchInput = await page.locator('.search-combobox-input').first();
  await searchInput.fill('spring');
  await page.waitForTimeout(1000);
  
  const cardsAfterSearch = await page.locator('.reference-card').all();
  console.log(`Reference cards after search "spring": ${cardsAfterSearch.length}`);
  
  // Clear search
  await searchInput.fill('');
  await page.waitForTimeout(500);
  
  // Test navigation to other pages
  console.log('\n=== Testing navigation ===');
  
  // Collections
  await page.goto('http://localhost:3000/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log(`Collections URL: ${page.url()}`);
  const collectionsContent = await page.locator('main').first().innerHTML();
  console.log(`Collections content length: ${collectionsContent.length}`);
  
  // Saved
  await page.goto('http://localhost:3000/saved', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log(`Saved URL: ${page.url()}`);
  const savedContent = await page.locator('main').first().innerHTML();
  console.log(`Saved content length: ${savedContent.length}`);
  
  // About
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log(`About URL: ${page.url()}`);
  const aboutContent = await page.locator('main').first().innerHTML();
  console.log(`About content length: ${aboutContent.length}`);
  
  // Back to homepage
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log(`Back to homepage: ${page.url()}`);
  
  // Take full page screenshot of homepage
  await page.screenshot({ path: 'homepage-final.png', fullPage: true });
  console.log('\n✅ Screenshot saved: homepage-final.png');
  
  await browser.close();
})();