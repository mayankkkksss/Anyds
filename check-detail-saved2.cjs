const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[ERROR] ${msg.text()}`);
  });
  
  // Test reference detail navigation from browse via modal
  console.log('=== Testing Reference Detail Navigation via Modal ===');
  await page.goto('http://localhost:3000/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Click the first reference card to open modal
  const firstCard = await page.locator('.reference-card').first();
  await firstCard.click();
  await page.waitForTimeout(1000);
  
  // Check modal is open
  const modal = await page.locator('.search-modal-backdrop').first();
  const modalVisible = await modal.isVisible();
  console.log(`Modal open after card click: ${modalVisible}`);
  
  if (modalVisible) {
    // Click "Inspect Study Details" button
    const inspectBtn = await page.locator('button:has-text("Inspect Study Details")').first();
    const inspectBtnExists = await inspectBtn.count() > 0;
    console.log(`Inspect Study Details button exists: ${inspectBtnExists}`);
    
    if (inspectBtnExists) {
      await inspectBtn.click();
      await page.waitForTimeout(2000);
      
      const detailUrl = page.url();
      console.log(`Detail page URL after clicking Inspect: ${detailUrl}`);
      
      // Check detail page content
      const detailTitle = await page.locator('h1').first().textContent().catch(() => 'NOT FOUND');
      console.log(`Detail page title: ${detailTitle}`);
      
      // Check breadcrumb
      const breadcrumb = await page.locator('.breadcrumb').first();
      const breadcrumbVisible = await breadcrumb.isVisible().catch(() => false);
      console.log(`Breadcrumb visible: ${breadcrumbVisible}`);
    }
  }
  
  // Test direct navigation to reference detail page
  console.log('\n=== Testing Direct Reference Detail Navigation ===');
  await page.goto('http://localhost:3000/reference/ref-01', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const directDetailUrl = page.url();
  console.log(`Direct detail URL: ${directDetailUrl}`);
  
  const directTitle = await page.locator('h1').first().textContent().catch(() => 'NOT FOUND');
  console.log(`Direct detail title: ${directTitle}`);
  
  const mediaStage = await page.locator('.reference-detail-media').first();
  const mediaVisible = await mediaStage.isVisible().catch(() => false);
  console.log(`Media stage visible: ${mediaVisible}`);
  
  const rationale = await page.locator('text=Choreography Rationale').first();
  const rationaleVisible = await rationale.isVisible().catch(() => false);
  console.log(`Rationale visible: ${rationaleVisible}`);
  
  const brief = await page.locator('text=Recreation Architecture Brief').first();
  const briefVisible = await brief.isVisible().catch(() => false);
  console.log(`Recreation brief visible: ${briefVisible}`);
  
  // Test saved references
  console.log('\n=== Testing Saved References ===');
  await page.goto('http://localhost:3000/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click bookmark on first card (if save button exists)
  const saveButtons = await page.locator('.reference-card button').all();
  console.log(`Save buttons found: ${saveButtons.length}`);
  
  if (saveButtons.length > 0) {
    await saveButtons[0].click();
    await page.waitForTimeout(1000);
    
    const savedToggle = await page.locator('.filter-pill--saved').first();
    const savedText = await savedToggle.textContent().catch(() => '');
    console.log(`Saved toggle text after save: ${savedText?.trim()}`);
  }
  
  // Go to saved page
  await page.goto('http://localhost:3000/saved', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const savedContent = await page.locator('main').first().innerHTML().catch(() => '');
  console.log(`Saved page has references: ${savedContent.includes('reference-card')}`);
  
  // Reload to test persistence
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const savedContentAfterReload = await page.locator('main').first().innerHTML().catch(() => '');
  console.log(`Saved page after reload has references: ${savedContentAfterReload.includes('reference-card')}`);
  
  // Test theme toggle
  console.log('\n=== Testing Theme Toggle ===');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const themeToggle = await page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]').first();
  const themeToggleExists = await themeToggle.count() > 0;
  console.log(`Theme toggle exists: ${themeToggleExists}`);
  
  if (themeToggleExists) {
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Initial theme: ${initialTheme}`);
    
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Toggled theme: ${toggledTheme}`);
    
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const finalTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Final theme: ${finalTheme}`);
  }
  
  // Test keyboard shortcuts
  console.log('\n=== Testing Keyboard Shortcuts ===');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  await page.keyboard.press('/');
  await page.waitForTimeout(500);
  
  const searchModal = await page.locator('.search-modal-backdrop').first();
  const searchModalVisible = await searchModal.isVisible().catch(() => false);
  console.log(`Search modal opened with /: ${searchModalVisible}`);
  
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  await page.keyboard.press('?');
  await page.waitForTimeout(500);
  
  const shortcutsModal = await page.locator('[role="dialog"]:has-text("Keyboard Shortcuts")').first();
  const shortcutsVisible = await shortcutsModal.isVisible().catch(() => false);
  console.log(`Shortcuts modal opened with ?: ${shortcutsVisible}`);
  
  await page.keyboard.press('Escape');
  
  console.log('\n✅ All tests completed!');
  
  await browser.close();
})();