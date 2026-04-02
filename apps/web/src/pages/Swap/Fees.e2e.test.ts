import { DAI, USDC_MAINNET } from '@luxexchange/lx/src/constants/tokens'
import { lxUrls } from '@luxexchange/lx/src/constants/urls'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'
import { expect, getTest } from '~/playwright/fixtures'
import { stubTradingApiEndpoint } from '~/playwright/fixtures/tradingApi'

const test = getTest()

test.describe('Fees', () => {
  test('should not display fee on swaps without fees', async ({ page }) => {
    await stubTradingApiEndpoint({ page, endpoint: lxUrls.tradingApiPaths.quote })
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
