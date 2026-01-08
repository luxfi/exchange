import { chromium } from 'playwright';

async function testTokenSelector() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const context = await browser.newContext();
  page = await context.newPage();

  try {
    // Navigate to swap page
    console.log('Navigating to http://localhost:3000/swap?chain=lux-dev...');
    await page.goto('http://localhost:3000/swap?chain=lux-dev', { waitUntil: 'load' });

    // Wait for page to stabilize
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({ path: '/tmp/swap-initial.png' });
    console.log('Initial screenshot saved to /tmp/swap-initial.png');

    // Look for all clickable elements that might open the token selector
    console.log('\nLooking for token input elements...');

    // Try to find input fields
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} input elements`);

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const placeholder = await input.getAttribute('placeholder');
      const type = await input.getAttribute('type');
      console.log(`  Input ${i}: type=${type}, placeholder=${placeholder}`);
    }

    // Look for buttons with common token selector patterns
    console.log('\nLooking for token selector buttons...');
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Found ${buttonCount} buttons`);

    for (let i = 0; i < buttonCount; i++) {
      const btn = allButtons.nth(i);
      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute('aria-label');
      const dataTestId = await btn.getAttribute('data-testid');
      console.log(`  Button ${i}: text="${text?.trim()}", aria-label="${ariaLabel}", testid="${dataTestId}"`);
    }

    // Try clicking on various token-related elements
    console.log('\nTrying to click on elements that might open token selector...');

    // Look for token display areas
    const tokenElements = page.locator('[data-testid*="token"], [aria-label*="token"], text=/[A-Z]+/');
    const tokenCount = await tokenElements.count();
    console.log(`Found ${tokenCount} potential token elements`);

    // Try a more direct approach - find the swap input area
    console.log('\nSearching for swap form elements...');
    const swapForm = page.locator('form, [role="form"], [data-testid*="swap"]');
    const formCount = await swapForm.count();
    console.log(`Found ${formCount} form elements`);

    if (formCount > 0) {
      const form = swapForm.first();
      const formText = await form.textContent();
      console.log(`First form preview: ${formText?.substring(0, 100)}`);

      // Look for clickable divs or buttons within the form
      const formButtons = form.locator('button');
      const formButtonCount = await formButtons.count();
      console.log(`Found ${formButtonCount} buttons in form`);

      for (let i = 0; i < formButtonCount; i++) {
        const btn = formButtons.nth(i);
        const text = await btn.textContent();
        console.log(`  Form Button ${i}: ${text?.trim()}`);

        // Try clicking the second button (likely output token selector)
        if (i === 1) {
          console.log(`\nClicking form button ${i}...`);
          await btn.click();
          await page.waitForTimeout(1500);

          // Take screenshot after click
          await page.screenshot({ path: '/tmp/swap-after-click.png' });
          console.log('Screenshot saved to /tmp/swap-after-click.png');

          // Check for modal or dropdown
          const modal = page.locator('[role="dialog"], [role="listbox"], .modal, [data-testid*="modal"]');
          if (await modal.isVisible()) {
            console.log('Modal/dropdown appeared!');

            // Get token options
            const options = page.locator('[role="option"]');
            const optionCount = await options.count();
            console.log(`Found ${optionCount} token options`);

            for (let j = 0; j < Math.min(optionCount, 15); j++) {
              const option = options.nth(j);
              const text = await option.textContent();
              const testId = await option.getAttribute('data-testid');
              console.log(`  Token ${j}: ${text?.trim()} (testid: ${testId})`);
            }

            // Search for WLUX
            console.log('\nSearching for WLUX in token list...');
            const searchInput = page.locator('input[type="text"], input[placeholder*="search"]');
            if (await searchInput.count() > 0) {
              console.log('Found search input, typing WLUX...');
              await searchInput.last().fill('WLUX');
              await page.waitForTimeout(1500);

              await page.screenshot({ path: '/tmp/swap-wlux-search.png' });
              console.log('Screenshot saved to /tmp/swap-wlux-search.png');

              const searchOptions = page.locator('[role="option"]');
              const searchCount = await searchOptions.count();
              console.log(`Found ${searchCount} results for WLUX`);

              for (let j = 0; j < searchCount; j++) {
                const option = searchOptions.nth(j);
                const text = await option.textContent();
                const testId = await option.getAttribute('data-testid');
                console.log(`  Result ${j}: ${text?.trim()} (testid: ${testId})`);
              }
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testTokenSelector();
