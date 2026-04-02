import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

test.describe('Swap Page Inspection - Lux Dev', () => {
  test('should inspect swap page with chain=lux-dev parameter', async ({ page }) => {
    console.log('\n=== Navigating to swap page ===')
    await page.goto('/swap?chain=lux-dev')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    console.log('\n=== Page Information ===')
    console.log('Title:', await page.title())
    console.log('URL:', page.url())

    // Take a screenshot
    console.log('\n=== Taking Screenshot ===')
    await page.screenshot({ path: '/tmp/swap_page_inspection.png', fullPage: true })
    console.log('Screenshot saved to /tmp/swap_page_inspection.png')

    // Check for wallet connection
    console.log('\n=== Checking Wallet Connection ===')
    const pageText = await page.textContent('body')

    if (pageText?.includes('test0')) {
      console.log('✓ Found "test0" - wallet appears auto-connected')
    } else if (pageText?.includes('0xf39F')) {
      console.log('✓ Found test wallet address - wallet is connected')
    } else {
      console.log('✗ "test0" not found - wallet may not be auto-connected')
    }

    // Look for Connect button
    const connectBtn = page.locator('button:has-text("Connect")')
    try {
      const isVisible = await connectBtn.isVisible({ timeout: 1000 })
      if (isVisible) {
        console.log('✗ "Connect" button is visible - wallet NOT connected')
      } else {
        console.log('✓ No "Connect" button - wallet is connected')
      }
    } catch {
      console.log('✓ No "Connect" button found - wallet is connected')
    }

    // Check for chain selection
    console.log('\n=== Checking Chain Selection ===')

    // Look for elements mentioning lux-dev
    const luxDevElements = await page.locator('button, div, span').filter({ hasText: /lux-dev|Lux Dev|1337/ }).all()
    console.log(`Found ${luxDevElements.length} elements mentioning lux-dev/1337`)

    for (const el of luxDevElements.slice(0, 5)) {
      const text = await el.textContent()
      if (text && text.length < 150) {
        const cleanText = text.trim()
        console.log(`  - ${cleanText}`)
      }
    }

    // Check for chain selector button
    const chainButtons = await page.locator('button').filter({ hasText: /chain|network|switch/i }).all()
    console.log(`\nFound ${chainButtons.length} chain-related buttons`)

    // Look for token selector UI
    console.log('\n=== Token Selector UI ===')

    // Check for input/output token buttons
    const tokenButtons = await page.locator('button').filter({ hasText: /ETH|WETH|WLUX|token|select|choose/i }).all()
    console.log(`Found ${tokenButtons.length} token-related buttons`)

    for (const btn of tokenButtons.slice(0, 5)) {
      const text = await btn.textContent()
      if (text) {
        const cleanText = text.trim()
        console.log(`  - "${cleanText}"`)
      }
    }

    // Check for input fields
    const inputFields = await page.locator('input[type="text"], input[type="number"]').all()
    console.log(`\nFound ${inputFields.length} input fields`)

    for (const input of inputFields.slice(0, 3)) {
      const placeholder = await input.getAttribute('placeholder')
      const ariaLabel = await input.getAttribute('aria-label')
      console.log(`  - Placeholder: "${placeholder}", Aria-label: "${ariaLabel}"`)
    }

    // Check main content
    console.log('\n=== Main Content (Preview) ===')
    const mainContent = await page.locator('main, [role="main"]').textContent()
    if (mainContent) {
      const preview = mainContent.substring(0, 500).replace(/\n\s+/g, '\n')
      console.log(preview)
    } else {
      const bodyText = await page.textContent('body')
      if (bodyText) {
        const preview = bodyText.substring(0, 500).replace(/\n\s+/g, '\n')
        console.log(preview)
      }
    }

    // Check for error messages
    console.log('\n=== Checking for Errors ===')
    const errors = await page.locator('[class*="error"], [role="alert"]').all()
    console.log(`Found ${errors.length} error/alert elements`)

    for (const err of errors.slice(0, 3)) {
      const text = await err.textContent()
      if (text) {
        const cleanText = text.trim()
        console.log(`  - ${cleanText}`)
      }
    }

    // Get network activity info
    console.log('\n=== Page Readiness ===')
    console.log('Page is ready for interaction')
  })
})
