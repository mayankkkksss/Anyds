const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[ERROR] ${msg.text()}`);
  });
  
  // Test reference detail page navigation from browse
  console.log('=== Testing Reference Detail Navigation ===');
  await page.goto('http://localhost:3000/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Click the first reference card
  const firstCard = await page.locator('.reference-card').first();
  await firstCard.click();
  await page.waitForTimeout(2000);
  
  const detailUrl = page.url();
  console.log(`Detail page URL: ${detailUrl}`);
  
  // Check detail page content
  const detailTitle = await page.locator('h1').first().textContent();
  console.log(`Detail page title: ${detailTitle}`);
  
  // Check breadcrumb
  const breadcrumb = await page.locator('.breadcrumb').first();
  const breadcrumbVisible = await breadcrumb.isVisible();
  console.log(`Breadcrumb visible: ${breadcrumbVisible}`);
  
  // Check media stage
  const mediaStage = await page.locator('.reference-detail-media').first();
  const mediaVisible = await mediaStage.isVisible();
  console.log(`Media stage visible: ${mediaVisible}`);
  
  // Check rationale
  const rationale = await page.locator('text=Choreography Rationale').first();
  const rationaleVisible = await rationale.isVisible();
  console.log(`Rationale visible: ${rationaleVisible}`);
  
  // Check recreation brief
  const brief = await page.locator('text=Recreation Architecture Brief').first();
  const briefVisible = await brief.isVisible();
  console.log(`Recreation brief visible: ${briefVisible}`);
  
  // Check source badge
  const sourceBadge = await page.locator('.source-badge').first();
  const sourceBadgeVisible = await sourceBadge.isVisible();
  console.log(`Source badge visible: ${sourceBadgeVisible}`);
  
  // Test saved references persistence
  console.log('\n=== Testing Saved References ===');
  await page.goto('http://localhost:3000/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click bookmark on first card
  const bookmarkBtn = await page.locator('.reference-card').first().locator('button[aria-label*="bookmark"], button[aria-label*="save"], button:has(svg)').first();
  // The bookmark button might be inside the card - let's find it
  const saveButtons = await page.locator('.reference-card button').all();
  console.log(`Save buttons found: ${saveButtons.length}`);
  
  if (saveButtons.length > 0) {
    await saveButtons[0].click();
    await page.waitForTimeout(1000);
    
    // Check saved count
    const savedToggle = await page.locator('.filter-pill--saved').first();
    const savedText = await savedToggle.textContent();
    console.log(`Saved toggle text after save: ${savedText?.trim()}`);
  }
  
  // Go to saved page
  await page.goto('http://localhost:3000/saved', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const savedContent = await page.locator('main').first().innerHTML();
  console.log(`Saved page content length: ${savedContent.length}`);
  console.log(`Saved page has references: ${savedContent.includes('reference-card')}`);
  
  // Reload page to test persistence
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const savedContentAfterReload = await page.locator('main').first().innerHTML();
  console.log(`Saved page after reload has references: ${savedContentAfterReload.includes('reference-card')}`);
  
  // Test theme toggle
  console.log('\n=== Testing Theme Toggle ===');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const themeToggle = await page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]').first();
  const themeToggleExists = await themeToggle.count() > 0;
  console.log(`Theme toggle exists: ${themeToggleExists}`);
  
  if (themeToggleExists) {
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Initial theme: ${initialTheme}`);
    
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Toggled theme: ${toggledTheme}`);
    
    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const finalTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Final theme: ${finalTheme}`);
  }
  
  // Test keyboard shortcuts
  console.log('\n=== Testing Keyboard Shortcuts ===');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Press / for search
  await page.keyboard.press('/');
  await page.waitForTimeout(500);
  
  const searchModal = await page.locator('.search-modal-backdrop').first();
  const searchModalVisible = await searchModal.isVisible();
  console.log(`Search modal opened with /: ${searchModalVisible}`);
  
  // Press Escape to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  const searchModalClosed = await page.locator('.search-modal-backdrop').first().isVisible().catch(() => false);
  console.log(`Search modal closed with Escape: ${!searchModalClosed}`);
  
  // Press ? for shortcuts
  await page.keyboard.press('?');
  await page.waitForTimeout(500);
  
  const shortcutsModal = await page.locator('[role="dialog"]:has-text("Keyboard Shortcuts")').first();
  const shortcutsVisible = await shortcutsModal.isVisible().catch(() => false);
  console.log(`Shortcuts modal opened with ?: ${shortcutsVisible}`);
  
  await page.keyboard.press('Escape');
  
  console.log('\n✅ All tests completed!');
  
  await browser.close();
})();