<<<<<<< HEAD
import { DAI, USDC_MAINNET } from '@l.x/lx/src/constants/tokens'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
=======
import { DAI, USDC_MAINNET } from 'uniswap/src/constants/tokens'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main
import { expect, getTest } from '~/playwright/fixtures'
import { stubTradingApiEndpoint } from '~/playwright/fixtures/tradingApi'

const test = getTest()

test.describe('Fees', () => {
  test('should not display fee on swaps without fees', async ({ page }) => {
<<<<<<< HEAD
    await stubTradingApiEndpoint({ page, endpoint: lxUrls.tradingApiPaths.quote })
=======
    await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
>>>>>>> upstream/main
    await page.goto(`/swap?inputCurrency=${DAI.address}&outputCurrency=${USDC_MAINNET.address}`)

    // Enter amount
    await page.getByTestId(TestID.AmountInputOut).fill('1')

    // Verify fee UI
    await page.getByTestId(TestID.GasInfoRow).click()
    // Verify there is no "fee" text:
    const locator = page.locator('Fee')
    await expect(locator).toHaveCount(0)
  })
})
