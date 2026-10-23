const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for animations to settle
  await page.waitForTimeout(2000);
  
  // Check discovery grid container
  const discoveryGrid = await page.locator('.discovery-grid').first();
  const gridStyles = await discoveryGrid.evaluate(el => {
    const s = window.getComputedStyle(el);
    return { display: s.display, gridTemplateColumns: s.gridTemplateColumns };
  });
  console.log('Discovery grid styles:', gridStyles);
  
  // Check all reference cards in the page
  const allRefCards = await page.locator('.reference-card').all();
  console.log(`Total .reference-card elements found: ${allRefCards.length}`);
  
  for (let i = 0; i < allRefCards.length; i++) {
    const cardStyles = await allRefCards[i].evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
        display: styles.display,
      };
    });
    console.log(`Ref card ${i}:`, cardStyles);
  }
  
  // Check the discovery section
  const discoverSection = await page.locator('#discover').first();
  const sectionStyles = await discoverSection.evaluate(el => {
    const s = window.getComputedStyle(el);
    return { display: s.display, height: s.height };
  });
  console.log('Discover section styles:', sectionStyles);
  
  await browser.close();
})();