import { isLuxdMode, getTestChain } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest({ withAnvil: true })

test('debug token selector display', async ({ page }) => {
  const chainId = isLuxdMode() ? getTestChain().id : 1
  const chainParam = isLuxdMode() ? 'lux-dev' : 'mainnet'

  console.log(`Testing with chain: ${chainParam} (ID: ${chainId})`)

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text())
    }
  })

  // Listen for page errors
  page.on('pageerror', (error) => {
    console.log('Page error:', error.message)
  })

  await page.goto(`/swap?chain=${chainParam}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)

  // Log localStorage state
  const localStorageData = await page.evaluate(() => {
    const data: Record<string, string | null> = {}
    data['@appkit/active_caip_network_id'] = localStorage.getItem('@appkit/active_caip_network_id')
    return data
  })
  console.log('localStorage state:', localStorageData)

  // Take screenshot before clicking
  await page.screenshot({ path: '/tmp/swap-before-click.png', fullPage: true })
  console.log('Screenshot saved: /tmp/swap-before-click.png')

  // Click on input token selector
  const chooseBtn = page.getByTestId(TestID.ChooseInputToken)
  const chooseVisible = await chooseBtn.isVisible()
  console.log(`Choose input token button visible: ${chooseVisible}`)

  await chooseBtn.click()
  await page.waitForTimeout(3000)

  // Take screenshot after clicking
  await page.screenshot({ path: '/tmp/swap-after-click.png', fullPage: true })
  console.log('Screenshot saved: /tmp/swap-after-click.png')

  // Check if token modal is visible
  const tokenSelectorModal = page.locator('[data-testid="token-selector-modal"]')
  const modalVisible = await tokenSelectorModal.isVisible().catch(() => false)
  console.log(`Token selector modal visible: ${modalVisible}`)

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

  // Also check what chain-based tokens are there
  const chainTokens = tokenTestIds.filter((id) => id.includes(`token-option-${chainId}`))
  console.log(`\nTokens for chain ${chainId}: ${chainTokens.length}`)
  chainTokens.forEach((t) => console.log(`  ${t}`))

  // Check other chains
  const otherChainTokens = tokenTestIds.filter((id) => !id.includes(`token-option-${chainId}`))
  console.log(`\nTokens for other chains: ${otherChainTokens.length}`)
  otherChainTokens.slice(0, 10).forEach((t) => console.log(`  ${t}`))

  // Make the test pass but log results
  expect(tokenTestIds.length).toBeGreaterThan(0)
})
