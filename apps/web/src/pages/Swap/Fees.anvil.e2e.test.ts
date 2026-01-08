import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'
import { stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { LUSD_LUX, USDC_MAINNET } from 'lx/src/constants/tokens'
import { uniswapUrls } from 'lx/src/constants/urls'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { assume0xAddress } from 'utils/wagmi'

const test = getTest({ withAnvil: true })

// Get chain-specific configuration
const getChainConfig = () => {
  if (isLuxdMode()) {
    return {
      inputCurrency: 'LUX',
      outputToken: LUSD_LUX,
      outputCurrency: LUSD_LUX.address,
    }
  }
  return {
    inputCurrency: 'ETH',
    outputToken: USDC_MAINNET,
    outputCurrency: USDC_MAINNET.address,
  }
}

test.describe(
  'Fees',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    // Fees tests work on all chains with chain-appropriate tokens

    test('swaps native token for stablecoin exact-in with swap fee', async ({ page, anvil }) => {
      const config = getChainConfig()
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })

      await page.goto(`/swap?inputCurrency=${config.inputCurrency}&outputCurrency=${config.outputCurrency}`)

      // Set up swap
      await page.getByTestId(TestID.AmountInputOut).fill('1')

      const response = await page.waitForResponse(`${uniswapUrls.tradingApiUrl}/v1/quote`)
      const {
        quote: { portionBips, portionRecipient },
      } = await response.json()

      const portionRecipientBalance = await anvil.getErc20Balance(
        assume0xAddress(config.outputToken.address),
        portionRecipient,
      )

      // Initiate transaction
      await page.getByTestId(TestID.ReviewSwap).click()

      // Verify fee percentage and amount is displayed
      await page.getByText(`Fee (${portionBips / 100}%)`)
      await page.getByTestId(TestID.Swap).click()

      // Verify fee recipient received fee
      const finalRecipientBalance = await anvil.getErc20Balance(assume0xAddress(config.outputToken.address), portionRecipient)
      await expect(finalRecipientBalance).toBeGreaterThan(portionRecipientBalance)
    })
  },
)
