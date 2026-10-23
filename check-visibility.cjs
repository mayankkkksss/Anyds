const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for animations to settle
  await page.waitForTimeout(2000);
  
  // Check hero section
  const heroSection = await page.locator('.hero-section').first();
  const heroStyles = await heroSection.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      height: styles.height,
      minHeight: styles.minHeight,
      overflow: styles.overflow,
      position: styles.position,
      zIndex: styles.zIndex,
    };
  });
  console.log('Hero section styles:', heroStyles);
  
  // Check CuratorialPillars section
  const pillarsSection = await page.locator('.pillars-section').first();
  const pillarsStyles = await pillarsSection.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      zIndex: styles.zIndex,
      height: styles.height,
      minHeight: styles.minHeight,
    };
  });
  console.log('CuratorialPillars section styles:', pillarsStyles);
  
  // Check individual pillar cards
  const pillarCards = await page.locator('.pillar-card').all();
  console.log(`Found ${pillarCards.length} pillar cards`);
  
  for (let i = 0; i < pillarCards.length; i++) {
    const cardStyles = await pillarCards[i].evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        display: styles.display,
        transform: styles.transform,
        position: styles.position,
      };
    });
    console.log(`Pillar card ${i} styles:`, cardStyles);
  }
  
  // Check FeaturedSpread section
  const featuredSection = await page.locator('.featured-spread-section').first();
  const featuredStyles = await featuredSection.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      zIndex: styles.zIndex,
    };
  });
  console.log('FeaturedSpread section styles:', featuredStyles);
  
  // Check discovery section
  const discoverSection = await page.locator('#discover').first();
  const discoverStyles = await discoverSection.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      zIndex: styles.zIndex,
    };
  });
  console.log('Discovery section styles:', discoverStyles);
  
  // Check scroll position
  const scrollY = await page.evaluate(() => window.scrollY);
  console.log('Scroll Y:', scrollY);
  
  // Scroll down and check again
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  
  const pillarsStylesAfterScroll = await pillarsSection.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      opacity: styles.opacity,
      visibility: styles.visibility,
      display: styles.display,
      transform: styles.transform,
    };
  });
  console.log('CuratorialPillars after scroll:', pillarsStylesAfterScroll);
  
  for (let i = 0; i < pillarCards.length; i++) {
    const cardStyles = await pillarCards[i].evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
      };
    });
    console.log(`Pillar card ${i} after scroll:`, cardStyles);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  
  await browser.close();
})();