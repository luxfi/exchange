import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'

const test = getTest({ withAnvil: true })

test('debug WLUX elements', async ({ page }) => {
  const interfaceName = isLuxdMode() ? 'lux-dev' : 'mainnet'
  await page.goto(`/swap?chain=${interfaceName}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)

  // Click output token selector
  await page.getByTestId('choose-output-token').click()
  await page.waitForTimeout(2000)
  
  // Count how many WLUX elements there are
  const wluxElements = page.getByTestId('token-option-1337-WLUX')
  const count = await wluxElements.count()
  console.log('Number of token-option-1337-WLUX elements:', count)
  
  // Get all token options
  const allTokenOptions = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-testid^="token-option-1337"]')
    return Array.from(elements).map(el => ({
      testId: el.getAttribute('data-testid'),
      text: el.textContent?.substring(0, 50)
    }))
  })
  console.log('All token options for chain 1337:')
  allTokenOptions.forEach(opt => console.log('  -', opt.testId, '|', opt.text))
  
  // Click on WLUX
  console.log('\nClicking token-option-1337-WLUX.first()...')
  await wluxElements.first().click()
  await page.waitForTimeout(1000)
  
  // Check what's now selected as output
  const outputLabel = await page.getByTestId('choose-output-token-label').textContent()
  console.log('Output token label after click:', outputLabel)
  
  expect(outputLabel).toContain('WLUX')
})
