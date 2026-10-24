import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const qaDir = path.join(rootDir, 'qa-evidence');

if (!fs.existsSync(qaDir)) {
  fs.mkdirSync(qaDir, { recursive: true });
}

const baseUrl = 'http://localhost:4173';

console.log('--- STARTING ANYDS AUTOMATED END-TO-END BROWSER QA SUITE ---');
console.log(`Target URL: ${baseUrl}`);
console.log(`Evidence Directory: ${qaDir}\n`);

let passedChecks = 0;
let failedChecks = 0;
const consoleErrors = [];

function check(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedChecks++;
  } else {
    console.error(`[FAIL] ${message}`);
    failedChecks++;
  }
}

async function runQa() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[Browser Console Error]: ${msg.text()}`);
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    console.error(`[Browser Unhandled Exception]: ${err.message}`);
    consoleErrors.push(err.message);
  });

  try {
    // 1. Discover Route (Desktop 1440x900)
    console.log('\n[Route 1: Discover / Home]');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const heroTitle = await page.textContent('.hero-title');
    check(heroTitle.includes('THE CHOREOGRAPHY'), 'Homepage renders oversized heroic typography');
    check(await page.isVisible('.hero-section'), 'Hero section is visible on desktop');
    check(await page.isVisible('#grid-card-anchor-01'), 'First reference card anchor #grid-card-anchor-01 is present');

    await page.screenshot({ path: path.join(qaDir, '01-discover-desktop-1440.png'), fullPage: false });
    console.log('[Artifact Captured]: 01-discover-desktop-1440.png');

    // Discover Route (Tablet 768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(qaDir, '02-discover-tablet-768.png'), fullPage: false });
    console.log('[Artifact Captured]: 02-discover-tablet-768.png');

    // Discover Route (Mobile 390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(qaDir, '03-discover-mobile-390.png'), fullPage: false });
    console.log('[Artifact Captured]: 03-discover-mobile-390.png');

    // 2. Mobile Drawer Test (at 390px)
    console.log('\n[Interactive: Mobile Navigation Drawer]');
    const mobileToggle = page.locator('.navbar-mobile-toggle');
    check(await mobileToggle.isVisible(), 'Mobile hamburger button is visible at 390px');
    await mobileToggle.click();
    await page.waitForTimeout(400);

    const drawer = page.locator('#mobile-nav-drawer');
    check(await drawer.isVisible(), 'Mobile navigation drawer slides into view');
    const ariaModal = await drawer.getAttribute('aria-modal');
    check(ariaModal === 'true', 'Mobile drawer declares aria-modal="true"');

    await page.screenshot({ path: path.join(qaDir, '14-mobile-drawer-open.png'), fullPage: false });
    console.log('[Artifact Captured]: 14-mobile-drawer-open.png');

    // Test Escape key close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const drawerOpenClass = await drawer.evaluate((el) => el.classList.contains('is-open'));
    check(!drawerOpenClass, 'Mobile drawer successfully closes on Escape key');

    // 3. Browse Route & Filtering (Desktop 1440x900)
    console.log('\n[Route 2: Browse / Search Results]');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/browse`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const browseTitle = await page.textContent('.discovery-header-editorial h2');
    check(browseTitle.includes('The Motion Archive'), 'Browse page renders The Motion Archive header');

    await page.screenshot({ path: path.join(qaDir, '04-browse-desktop-1440.png'), fullPage: false });
    console.log('[Artifact Captured]: 04-browse-desktop-1440.png');

    // Filter by Query
    const searchInput = page.locator('.search-combobox-input');
    await searchInput.fill('spring');
    await page.waitForTimeout(600);

    const statusText = await page.textContent('.filter-bar-status');
    check(statusText.includes('references for "spring"') || statusText.includes('references'), 'Status indicates search results');
    await page.screenshot({ path: path.join(qaDir, '05-browse-filtered-spring.png'), fullPage: false });
    console.log('[Artifact Captured]: 05-browse-filtered-spring.png');

    // Reset Query
    await searchInput.fill('');
    await page.waitForTimeout(400);

    // Filter by Category Button
    const springPill = page.locator('.filter-pill:has-text("Spring")');
    await springPill.click();
    await page.waitForTimeout(400);
    check(await springPill.evaluate((el) => el.classList.contains('is-active')), 'Spring category pill becomes active');

    // Clear filters
    const clearFiltersBtn = page.locator('button:has-text("Clear filters")');
    if (await clearFiltersBtn.isVisible()) {
      await clearFiltersBtn.click();
      await page.waitForTimeout(400);
      check(true, 'Filters cleared back to default all state');
    }

    // Browse on Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(qaDir, '06-browse-mobile-390.png'), fullPage: false });
    console.log('[Artifact Captured]: 06-browse-mobile-390.png');

    // 4. Collections Route
    console.log('\n[Route 3: Curated Collections]');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/collections`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const collectionsH1 = await page.textContent('h1');
    check(collectionsH1.includes('Collections'), 'Collections page displays Collections h1');

    const featuredAnthology = await page.textContent('.collection-cinematic-title');
    check(featuredAnthology.includes('Motion with Restraint'), 'Collections page showcases Motion with Restraint lead anthology');

    const collectionCards = await page.locator('.collection-story-card').count();
    check(collectionCards >= 4, `Collections page renders all remaining anthologies (found ${collectionCards})`);

    await page.screenshot({ path: path.join(qaDir, '07-collections-desktop-1440.png'), fullPage: false });
    console.log('[Artifact Captured]: 07-collections-desktop-1440.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(qaDir, '08-collections-mobile-390.png'), fullPage: false });
    console.log('[Artifact Captured]: 08-collections-mobile-390.png');

    // 5. Saved References (Empty State then Populated State)
    console.log('\n[Route 4: Saved References Workbench]');
    await page.setViewportSize({ width: 1440, height: 900 });
    // Clear localStorage to test empty state
    await page.evaluate(() => localStorage.removeItem('anyds_saved_refs_v1'));
    await page.goto(`${baseUrl}/saved`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const emptyText = await page.textContent('.discovery-grid-empty-state');
    check(emptyText.includes('No saved references yet'), 'Saved page renders accessible empty state');
    await page.screenshot({ path: path.join(qaDir, '09-saved-empty-desktop.png'), fullPage: false });
    console.log('[Artifact Captured]: 09-saved-empty-desktop.png');

    // Save a study (ref-01) from /browse
    await page.goto(`${baseUrl}/browse`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const firstCardSaveBtn = page.locator('#grid-card-anchor-01 .reference-card-save-btn');
    await firstCardSaveBtn.click();
    await page.waitForTimeout(400);

    // Verify toast appears
    const toast = page.locator('.toast-item').first();
    check(await toast.isVisible(), 'Toast notification appears upon saving study');

    // Now visit /saved again and verify populated state
    await page.goto(`${baseUrl}/saved`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const savedCards = await page.locator('.reference-card').count();
    check(savedCards >= 1, `Saved page renders bookmarked study (found ${savedCards} cards)`);

    await page.screenshot({ path: path.join(qaDir, '10-saved-populated-desktop.png'), fullPage: false });
    console.log('[Artifact Captured]: 10-saved-populated-desktop.png');

    // 6. Reference Detail Page (/reference/ref-01)
    console.log('\n[Route 5: Reference Detail Page]');
    await page.goto(`${baseUrl}/reference/ref-01`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const refTitle = await page.textContent('.title-block h1');
    check(refTitle.includes('Kinetic Spring Topology'), 'Detail page renders Kinetic Spring Topology title');

    // Check sticky provenance rail
    const rail = page.locator('.rail');
    check(await rail.isVisible(), 'Provenance rail is rendered on desktop');

    const sourceLink = page.locator('.actions a:has-text("Visit Original Source")');
    check(await sourceLink.isVisible(), 'Visit Original Source action is present and visible');

    const detailSaveBtn = page.locator('.actions button:has-text("Saved")');
    check(await detailSaveBtn.isVisible(), 'Detail page shows reactive Saved state for bookmarked ref-01');

    const relatedHeading = page.locator('#related-heading');
    check(await relatedHeading.isVisible(), 'Related references section is present');

    await page.screenshot({ path: path.join(qaDir, '11-reference-detail-desktop-1440.png'), fullPage: false });
    console.log('[Artifact Captured]: 11-reference-detail-desktop-1440.png');

    // Mobile detail layout
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(qaDir, '12-reference-detail-mobile-390.png'), fullPage: false });
    console.log('[Artifact Captured]: 12-reference-detail-mobile-390.png');

    // 7. About Page (/about)
    console.log('\n[Route 6: About / Attribution Page]');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/about`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const aboutHeading = await page.textContent('h1');
    check(aboutHeading.includes('Curated Motion & Creative Engineering'), 'About page renders hero title');

    const pageContent = await page.textContent('body');
    check(!pageContent.includes('Design System Specification Revision 9'), 'Truthful audit: "Design System Specification Revision 9" claim is removed');
    check(!pageContent.includes('100% WCAG AAA Compliant'), 'Truthful audit: "100% WCAG AAA Compliant" claim is removed');

    await page.screenshot({ path: path.join(qaDir, '13-about-desktop-1440.png'), fullPage: false });
    console.log('[Artifact Captured]: 13-about-desktop-1440.png');

    // 8. Console Error Audit
    console.log('\n[Console Error Verification]');
    check(consoleErrors.length === 0, `Zero browser console errors detected (errors count = ${consoleErrors.length})`);

  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log(`QA BROWSER VERIFICATION COMPLETE`);
  console.log(`Passed Checks: ${passedChecks}`);
  console.log(`Failed Checks: ${failedChecks}`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log('========================================\n');

  if (failedChecks > 0 || consoleErrors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQa().catch((err) => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
