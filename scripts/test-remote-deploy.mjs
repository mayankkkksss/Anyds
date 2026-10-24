import { chromium } from 'playwright';
import fs from 'fs';

async function testRemote() {
  const url = 'https://bespoke-hummingbird-55b7fd.netlify.app';
  console.log(`Testing remote deployment: ${url}`);
  
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Navigate to site
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log('Opened home page. Current URL:', page.url());

  // Check if Netlify password protection is shown
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.count() > 0) {
    console.log('Password protection gate detected. Unlocking with drop password...');
    await passwordInput.fill('My-Drop-Site');
    await page.locator('button:has-text("Submit")').click();
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    console.log('Unlocked! Now on:', page.url());
  }

  if (!fs.existsSync('qa-evidence/remote')) {
    fs.mkdirSync('qa-evidence/remote', { recursive: true });
  }

  await page.screenshot({ path: 'qa-evidence/remote/01-remote-home.png' });
  console.log('[Artifact Captured]: qa-evidence/remote/01-remote-home.png');

  // Navigate via client-side router first: click "Explore Archive" or navbar link
  console.log('Testing client-side navigation to Browse...');
  const browseNavLink = page.locator('nav a[href="/browse"], nav a:has-text("Browse")').first();
  if (await browseNavLink.count() > 0) {
    await browseNavLink.click();
    await page.waitForTimeout(1000);
    console.log('Clicked Browse link. Current URL:', page.url());
    await page.screenshot({ path: 'qa-evidence/remote/02-remote-browse-client.png' });
    console.log('[Artifact Captured]: qa-evidence/remote/02-remote-browse-client.png');
  }

  // Navigate to Collections
  console.log('Testing client-side navigation to Collections...');
  const collectionsLink = page.locator('nav a[href="/collections"], nav a:has-text("Collections")').first();
  if (await collectionsLink.count() > 0) {
    await collectionsLink.click();
    await page.waitForTimeout(1000);
    console.log('Clicked Collections link. Current URL:', page.url());
    await page.screenshot({ path: 'qa-evidence/remote/03-remote-collections-client.png' });
    console.log('[Artifact Captured]: qa-evidence/remote/03-remote-collections-client.png');
  }

  // Navigate to About
  console.log('Testing client-side navigation to About...');
  const aboutLink = page.locator('nav a[href="/about"], nav a:has-text("About")').first();
  if (await aboutLink.count() > 0) {
    await aboutLink.click();
    await page.waitForTimeout(1000);
    console.log('Clicked About link. Current URL:', page.url());
    await page.screenshot({ path: 'qa-evidence/remote/04-remote-about-client.png' });
    console.log('[Artifact Captured]: qa-evidence/remote/04-remote-about-client.png');
  }

  // Now test direct nested page reload on /browse
  console.log('Testing direct reload of /browse...');
  await page.goto(`${url}/browse`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  console.log('Direct /browse URL:', page.url());
  console.log('Direct /browse title:', await page.title());
  await page.screenshot({ path: 'qa-evidence/remote/05-remote-browse-direct.png' });
  console.log('[Artifact Captured]: qa-evidence/remote/05-remote-browse-direct.png');

  console.log('\n--- REMOTE VERIFICATION RESULT ---');
  console.log(`Console Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }
  console.log('ALL TESTS COMPLETED!');
  
  await browser.close();
}

testRemote().catch(err => {
  console.error('Remote test failed:', err);
  process.exit(1);
});
