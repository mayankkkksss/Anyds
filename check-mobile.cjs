const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  // Test mobile viewport
  console.log('=== Testing Mobile Viewport (390px) ===');
  const mobilePage = await browser.newPage({ 
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') console.log(`[MOBILE ERROR] ${msg.text()}`);
  });
  
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(3000);
  
  // Check hero
  const hero = await mobilePage.locator('.hero-section').first();
  const heroVisible = await hero.isVisible();
  console.log(`Mobile hero visible: ${heroVisible}`);
  
  // Check CuratorialPillars
  const pillars = await mobilePage.locator('.pillars-section').first();
  const pillarsVisible = await pillars.isVisible();
  console.log(`Mobile pillars visible: ${pillarsVisible}`);
  
  // Check pillar cards layout
  const pillarCards = await mobilePage.locator('.pillar-card').all();
  console.log(`Mobile pillar cards: ${pillarCards.length}`);
  
  // Check FeaturedSpread
  const featured = await mobilePage.locator('.featured-spread-section').first();
  const featuredVisible = await featured.isVisible();
  console.log(`Mobile featured visible: ${featuredVisible}`);
  
  // Check discover CTA
  const cta = await mobilePage.locator('#discover a[href="/browse"]').first();
  const ctaVisible = await cta.isVisible();
  console.log(`Mobile discover CTA visible: ${ctaVisible}`);
  
  // Check for horizontal overflow
  const bodyWidth = await mobilePage.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await mobilePage.evaluate(() => window.innerWidth);
  console.log(`Body scrollWidth: ${bodyWidth}, viewportWidth: ${viewportWidth}, overflow: ${bodyWidth > viewportWidth ? 'YES' : 'NO'}`);
  
  // Test mobile browse page
  console.log('\n=== Testing Mobile Browse ===');
  await mobilePage.goto('http://localhost:3000/browse', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(3000);
  
  const filterBar = await mobilePage.locator('.browse-command-bar').first();
  const filterBarVisible = await filterBar.isVisible();
  console.log(`Mobile filter bar visible: ${filterBarVisible}`);
  
  const grid = await mobilePage.locator('.discovery-grid-container').first();
  const gridVisible = await grid.isVisible();
  console.log(`Mobile discovery grid visible: ${gridVisible}`);
  
  const cards = await mobilePage.locator('.reference-card').all();
  console.log(`Mobile reference cards: ${cards.length}`);
  
  const mobileBodyWidth = await mobilePage.evaluate(() => document.body.scrollWidth);
  console.log(`Mobile browse body scrollWidth: ${mobileBodyWidth}, overflow: ${mobileBodyWidth > viewportWidth ? 'YES' : 'NO'}`);
  
  await mobilePage.screenshot({ path: 'mobile-homepage.png', fullPage: true });
  console.log('Mobile screenshot saved: mobile-homepage.png');
  
  await mobilePage.close();
  
  // Test tablet viewport
  console.log('\n=== Testing Tablet Viewport (768px) ===');
  const tabletPage = await browser.newPage({ 
    viewport: { width: 768, height: 1024 }
  });
  
  await tabletPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await tabletPage.waitForTimeout(3000);
  
  const tabletBodyWidth = await tabletPage.evaluate(() => document.body.scrollWidth);
  const tabletViewportWidth = await tabletPage.evaluate(() => window.innerWidth);
  console.log(`Tablet body scrollWidth: ${tabletBodyWidth}, viewportWidth: ${tabletViewportWidth}, overflow: ${tabletBodyWidth > tabletViewportWidth ? 'YES' : 'NO'}`);
  
  const tabletPillarCards = await tabletPage.locator('.pillar-card').all();
  console.log(`Tablet pillar cards: ${tabletPillarCards.length}`);
  
  await tabletPage.screenshot({ path: 'tablet-homepage.png', fullPage: true });
  console.log('Tablet screenshot saved: tablet-homepage.png');
  
  await tabletPage.close();
  
  // Test desktop viewport
  console.log('\n=== Testing Desktop Viewport (1440px) ===');
  const desktopPage = await browser.newPage({ 
    viewport: { width: 1440, height: 900 }
  });
  
  await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(3000);
  
  const desktopBodyWidth = await desktopPage.evaluate(() => document.body.scrollWidth);
  const desktopViewportWidth = await desktopPage.evaluate(() => window.innerWidth);
  console.log(`Desktop body scrollWidth: ${desktopBodyWidth}, viewportWidth: ${desktopViewportWidth}, overflow: ${desktopBodyWidth > desktopViewportWidth ? 'YES' : 'NO'}`);
  
  const desktopPillarCards = await desktopPage.locator('.pillar-card').all();
  console.log(`Desktop pillar cards: ${desktopPillarCards.length}`);
  
  await desktopPage.screenshot({ path: 'desktop-homepage.png', fullPage: true });
  console.log('Desktop screenshot saved: desktop-homepage.png');
  
  await desktopPage.close();
  
  // Test reduced motion
  console.log('\n=== Testing Reduced Motion ===');
  const reducedMotionPage = await browser.newPage({ 
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  
  await reducedMotionPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await reducedMotionPage.waitForTimeout(3000);
  
  // Check that pillar cards are visible (not animated to opacity 0)
  const rmPillarCards = await reducedMotionPage.locator('.pillar-card').all();
  for (let i = 0; i < rmPillarCards.length; i++) {
    const styles = await rmPillarCards[i].evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, transform: s.transform };
    });
    console.log(`Reduced motion pillar card ${i}: opacity=${styles.opacity}, transform=${styles.transform}`);
  }
  
  await reducedMotionPage.close();
  
  await browser.close();
})();