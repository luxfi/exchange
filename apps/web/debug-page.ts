import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to swap page...');
  await page.goto('http://localhost:3000/swap');

  console.log('Waiting 5s for app to load...');
  await page.waitForTimeout(5000);

  console.log('Taking screenshot...');
  await page.screenshot({ path: './test-results/debug-swap-page.png', fullPage: true });

  console.log('Page title:', await page.title());

  const inputToken = await page.getByTestId('choose-input-token').isVisible().catch(() => false);
  console.log('choose-input-token visible:', inputToken);

  const loadingVisible = await page.locator('#loading-screen').isVisible().catch(() => false);
  console.log('loading-screen visible:', loadingVisible);

  const testIds = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-testid]');
    return Array.from(elements).map(el => el.getAttribute('data-testid')).slice(0, 30);
  });
  console.log('Available testIDs:', testIds);

  await browser.close();
})();
