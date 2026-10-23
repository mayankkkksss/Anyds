const { chromium } = require('playwright');

async function checkPage(browser, path, name) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[${name}] [${msg.type()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[${name}] [PAGE ERROR] ${error.message}`);
  });
  
  try {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const html = await page.content();
    const hasError = html.includes('500') || html.includes('Internal Server Error');
    
    if (hasError) {
      console.log(`[${name}] ❌ Page returned 500 error`);
    } else {
      console.log(`[${name}] ✅ Page loaded successfully`);
    }
    
    // Check for main content
    const mainContent = await page.locator('main').first();
    const mainHtml = await mainContent.evaluate(el => el.innerHTML).catch(() => 'NOT FOUND');
    
    if (mainHtml !== 'NOT FOUND' && mainHtml.length > 100) {
      console.log(`[${name}] ✅ Main content found (${mainHtml.length} chars)`);
    } else {
      console.log(`[${name}] ⚠️ Main content minimal or missing`);
    }
  } catch (e) {
    console.log(`[${name}] ❌ Error: ${e.message}`);
  }
  
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  
  await checkPage(browser, '/', 'Homepage');
  await checkPage(browser, '/browse', 'Browse');
  await checkPage(browser, '/collections', 'Collections');
  await checkPage(browser, '/saved', 'Saved');
  await checkPage(browser, '/about', 'About');
  
  await browser.close();
})();