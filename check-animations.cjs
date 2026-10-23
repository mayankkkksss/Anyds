const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for animations to settle
  await page.waitForTimeout(2000);
  
  // Check FeaturedSpread primary and supporting articles
  const featuredPrimary = await page.locator('.featured-spread-primary').first();
  const featuredSupporting = await page.locator('.featured-spread-supporting').first();
  
  if (await featuredPrimary.count() > 0) {
    const styles = await featuredPrimary.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, visibility: s.visibility, transform: s.transform };
    });
    console.log('FeaturedSpread primary initial:', styles);
  }
  
  if (await featuredSupporting.count() > 0) {
    const styles = await featuredSupporting.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, visibility: s.visibility, transform: s.transform };
    });
    console.log('FeaturedSpread supporting initial:', styles);
  }
  
  // Scroll down to trigger FeaturedSpread animations
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(1500);
  
  if (await featuredPrimary.count() > 0) {
    const styles = await featuredPrimary.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, visibility: s.visibility, transform: s.transform };
    });
    console.log('FeaturedSpread primary after scroll:', styles);
  }
  
  if (await featuredSupporting.count() > 0) {
    const styles = await featuredSupporting.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, visibility: s.visibility, transform: s.transform };
    });
    console.log('FeaturedSpread supporting after scroll:', styles);
  }
  
  // Check discovery grid cards
  const discoveryCards = await page.locator('.reference-card').all();
  console.log(`Found ${discoveryCards.length} discovery cards`);
  
  for (let i = 0; i < Math.min(3, discoveryCards.length); i++) {
    const cardStyles = await discoveryCards[i].evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
      };
    });
    console.log(`Discovery card ${i} initial:`, cardStyles);
  }
  
  // Scroll further
  await page.evaluate(() => window.scrollTo(0, 3500));
  await page.waitForTimeout(1500);
  
  for (let i = 0; i < Math.min(3, discoveryCards.length); i++) {
    const cardStyles = await discoveryCards[i].evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
      };
    });
    console.log(`Discovery card ${i} after scroll:`, cardStyles);
  }
  
  // Take full page screenshot
  await page.screenshot({ path: 'debug-screenshot-after-fix.png', fullPage: true });
  
  await browser.close();
})();