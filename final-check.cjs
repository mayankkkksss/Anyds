const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // 10. Reduced Motion
  console.log('10. REDUCED MOTION');
  const rmPage = await browser.newPage({ 
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  await rmPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await rmPage.waitForTimeout(3000);
  
  const rmPillarCards = await rmPage.locator('.pillar-card').all();
  for (let i = 0; i < rmPillarCards.length; i++) {
    const styles = await rmPillarCards[i].evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, transform: s.transform };
    });
    console.log(`   Pillar card ${i}: opacity=${styles.opacity} (should be 1), transform=${styles.transform} (should be none)`);
  }
  await rmPage.close();
  
  // 11. Reference Detail Source Link
  console.log('\n6b. REFERENCE DETAIL - Source Link');
  await page.goto('http://localhost:3000/reference/ref-01', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const sourceLink = await page.locator('a[href*="gsap.com"]').first();
  const sourceVisible = await sourceLink.isVisible().catch(() => false);
  console.log(`   Visit Original Source link visible: ${sourceVisible}`);
  
  // 12. Test 1440px responsive
  console.log('\n9b. RESPONSIVE - 1440px');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  const desktopBodyWidth = await desktopPage.evaluate(() => document.body.scrollWidth);
  const desktopViewportWidth = await desktopPage.evaluate(() => window.innerWidth);
  console.log(`   1440px: body=${desktopBodyWidth}, viewport=${desktopViewportWidth}, overflow=${desktopBodyWidth > desktopViewportWidth ? 'YES' : 'NO'}`);
  await desktopPage.close();
  
  console.log('\n✅ ALL FINAL CHECKS COMPLETE');
  
  await browser.close();
})();