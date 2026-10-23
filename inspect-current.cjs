const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[ERROR] ${msg.text()}`);
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Get full HTML
  const html = await page.content();
  
  // Check for key sections
  const sections = [
    'hero-section',
    'pillars-section',
    'featured-spread-section',
    'discover',
    'footer',
    'reference-card',
    'browse-command-bar'
  ];
  
  console.log('=== SECTION PRESENCE CHECK ===');
  for (const section of sections) {
    const count = (html.match(new RegExp(section, 'g')) || []).length;
    console.log(`${section}: ${count} occurrences`);
  }
  
  // Check for visible content
  const body = await page.locator('body');
  const bodyText = await body.innerText();
  console.log(`\nBody text length: ${bodyText.length}`);
  console.log(`Body text preview (first 2000 chars):\n${bodyText.substring(0, 2000)}`);
  
  // Check specific elements
  const hero = await page.locator('.hero-section').first();
  console.log(`\nHero visible: ${await hero.isVisible()}`);
  console.log(`Hero height: ${await hero.evaluate(el => el.getBoundingClientRect().height)}`);
  
  const pillars = await page.locator('.pillars-section').first();
  console.log(`Pillars visible: ${await pillars.isVisible()}`);
  console.log(`Pillars height: ${await pillars.evaluate(el => el.getBoundingClientRect().height)}`);
  
  const featured = await page.locator('.featured-spread-section').first();
  console.log(`Featured visible: ${await featured.isVisible()}`);
  console.log(`Featured height: ${await featured.evaluate(el => el.getBoundingClientRect().height)}`);
  
  const discover = await page.locator('#discover').first();
  console.log(`Discover visible: ${await discover.isVisible()}`);
  console.log(`Discover height: ${await discover.evaluate(el => el.getBoundingClientRect().height)}`);
  
  // Check pillar cards
  const pillarCards = await page.locator('.pillar-card').all();
  console.log(`\nPillar cards count: ${pillarCards.length}`);
  for (let i = 0; i < pillarCards.length; i++) {
    const styles = await pillarCards[i].evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, transform: s.transform, display: s.display, visibility: s.visibility };
    });
    console.log(`  Card ${i}: ${JSON.stringify(styles)}`);
  }
  
  // Check reference cards
  const refCards = await page.locator('.reference-card').all();
  console.log(`Reference cards count: ${refCards.length}`);
  
  // Scroll and check
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  
  const pillarsAfterScroll = await pillars.evaluate(el => {
    const s = window.getComputedStyle(el);
    return { opacity: s.opacity, transform: s.transform };
  });
  console.log(`\nPillars after scroll: ${JSON.stringify(pillarsAfterScroll)}`);
  
  for (let i = 0; i < pillarCards.length; i++) {
    const styles = await pillarCards[i].evaluate(el => {
      const s = window.getComputedStyle(el);
      return { opacity: s.opacity, transform: s.transform };
    });
    console.log(`  Card ${i} after scroll: ${JSON.stringify(styles)}`);
  }
  
  await browser.close();
})();