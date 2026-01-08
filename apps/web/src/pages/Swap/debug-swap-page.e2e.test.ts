import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'

const test = getTest({ withAnvil: true })

test('debug swap page elements', async ({ page }) => {
  const interfaceName = isLuxdMode() ? 'lux-dev' : 'mainnet'
  await page.goto(`/swap?chain=${interfaceName}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)

  // Check for choose-input-token and choose-output-token
  const inputToken = page.getByTestId('choose-input-token')
  const outputToken = page.getByTestId('choose-output-token')
  
  console.log('Input token selector visible:', await inputToken.isVisible().catch(() => false))
  console.log('Output token selector visible:', await outputToken.isVisible().catch(() => false))
  
  // Get all test IDs on the page
  const allTestIds = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-testid]')
    return Array.from(elements).map(el => el.getAttribute('data-testid')).filter(Boolean)
  })
  console.log('All test IDs on page:')
  allTestIds.forEach(id => console.log('  -', id))
  
  // Click output token selector
  if (await outputToken.isVisible().catch(() => false)) {
    console.log('\nClicking output token selector...')
    await outputToken.click()
    await page.waitForTimeout(2000)
    
    // Check for token options
    const tokenOptions = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid*="token-option"]')
      return Array.from(elements).map(el => el.getAttribute('data-testid')).filter(Boolean)
    })
    console.log('Token options found:')
    tokenOptions.slice(0, 15).forEach(id => console.log('  -', id))
  }
  
  expect(true).toBe(true)
})
