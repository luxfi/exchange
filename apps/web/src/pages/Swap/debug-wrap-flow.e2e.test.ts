import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'
import { stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { uniswapUrls } from 'lx/src/constants/urls'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest({ withAnvil: true })

test('debug wrap flow step by step', async ({ page }) => {
  const interfaceName = isLuxdMode() ? 'lux-dev' : 'mainnet'
  const chainId = 1337
  const symbol = 'WLUX'
  
  await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
  await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
  
  console.log('Step 1: Navigating to swap page...')
  await page.goto(`/swap?chain=${interfaceName}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)
  
  // Check initial state
  const initialInputLabel = await page.getByTestId('choose-input-token-label').textContent().catch(() => 'N/A')
  const initialOutputLabel = await page.getByTestId('choose-output-token-label').textContent().catch(() => 'N/A')
  console.log('Initial input token:', initialInputLabel)
  console.log('Initial output token:', initialOutputLabel)
  
  console.log('\nStep 2: Clicking OUTPUT token selector...')
  await page.getByTestId(TestID.ChooseOutputToken).click()
  await page.waitForTimeout(2000)
  
  // Check what options are visible
  const wluxVisible = await page.getByTestId(`token-option-${chainId}-${symbol}`).isVisible()
  console.log('WLUX option visible:', wluxVisible)
  
  console.log('\nStep 3: Clicking on WLUX...')
  await page.getByTestId(`token-option-${chainId}-${symbol}`).first().click()
  await page.waitForTimeout(1000)
  
  // Check state after selection
  const afterInputLabel = await page.getByTestId('choose-input-token-label').textContent().catch(() => 'N/A')
  const afterOutputLabel = await page.getByTestId('choose-output-token-label').textContent().catch(() => 'N/A')
  console.log('After selection - input token:', afterInputLabel)
  console.log('After selection - output token:', afterOutputLabel)
  
  console.log('\nStep 4: Filling amount...')
  await page.getByTestId(TestID.AmountInputIn).fill('0.01')
  await page.waitForTimeout(2000)
  
  // Final state
  const finalInputLabel = await page.getByTestId('choose-input-token-label').textContent().catch(() => 'N/A')
  const finalOutputLabel = await page.getByTestId('choose-output-token-label').textContent().catch(() => 'N/A')
  console.log('Final - input token:', finalInputLabel)
  console.log('Final - output token:', finalOutputLabel)
  
  // Check for Review button
  const reviewButton = page.getByTestId(TestID.ReviewSwap)
  const reviewVisible = await reviewButton.isVisible()
  const reviewText = await reviewButton.textContent().catch(() => 'N/A')
  console.log('\nReview button visible:', reviewVisible)
  console.log('Review button text:', reviewText)
  
  // For wrap, input should be LUX and output should be WLUX
  expect(finalInputLabel).toContain('LUX')
  expect(finalOutputLabel).toContain('WLUX')
  expect(reviewText).toContain('Wrap')
})
