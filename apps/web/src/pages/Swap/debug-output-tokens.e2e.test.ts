import { isLuxdMode, getTestChain } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest({ withAnvil: true })

test('debug output token selector', async ({ page }) => {
  const chainId = isLuxdMode() ? getTestChain().id : 1
  const chainParam = isLuxdMode() ? 'lux-dev' : 'mainnet'

  console.log(`Testing with chain: ${chainParam} (ID: ${chainId})`)

  await page.goto(`/swap?chain=${chainParam}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)

  // Click on OUTPUT token selector (not input)
  const chooseBtn = page.getByTestId(TestID.ChooseOutputToken)
  const chooseVisible = await chooseBtn.isVisible()
  console.log(`Choose OUTPUT token button visible: ${chooseVisible}`)

  await chooseBtn.click()
  await page.waitForTimeout(3000)

  // Take screenshot after clicking
  await page.screenshot({ path: '/tmp/swap-output-click.png', fullPage: true })
  console.log('Screenshot saved: /tmp/swap-output-click.png')

  // Log all data-testid elements
  const allTestIds = await page.locator('[data-testid]').evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-testid')).filter(Boolean).slice(0, 50),
  )
  console.log('All visible testIDs:', allTestIds)

  // Get all token options
  const tokenOptions = await page.locator('[data-testid^="token-option-"]').all()
  console.log(`Found ${tokenOptions.length} token options`)

  const tokenTestIds: string[] = []
  for (const option of tokenOptions.slice(0, 20)) {
    const testId = await option.getAttribute('data-testid')
    if (testId) {
      tokenTestIds.push(testId)
      console.log(`  Token: ${testId}`)
    }
  }

  // Check for expected tokens
  const expectedWluxId = `token-option-${chainId}-WLUX`
  const expectedLuxId = `token-option-${chainId}-LUX`

  const hasWlux = tokenTestIds.some((id) => id === expectedWluxId)
  const hasLux = tokenTestIds.some((id) => id === expectedLuxId)

  console.log(`\nExpected: ${expectedWluxId}`)
  console.log(`WLUX found: ${hasWlux}`)
  console.log(`Expected: ${expectedLuxId}`)
  console.log(`LUX found: ${hasLux}`)

  expect(tokenTestIds.length).toBeGreaterThan(0)
})
