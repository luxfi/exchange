import { WETH_ADDRESS } from '@luxdex/universal-router-sdk'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'
import { stubLuxGatewayEndpoint, stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { WRAPPED_NATIVE_CURRENCY } from 'lx/src/constants/tokens'
import { uniswapUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { assume0xAddress } from 'utils/wagmi'
import { parseEther } from 'viem'

const test = getTest({ withAnvil: true })

// Get chain-appropriate token info
const getChainConfig = () => {
  if (isLuxdMode()) {
    // LuxDev is chain ID 1337 (single-node K=1 consensus via `lux dev start`)
    const wlux = WRAPPED_NATIVE_CURRENCY[UniverseChainId.LuxDev]
    return {
      address: wlux?.address || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      symbol: 'WLUX',
      nativeSymbol: 'LUX',
      chainId: UniverseChainId.LuxDev, // 1337
      interfaceName: 'lux-dev',
    }
  }
  return {
    address: WETH_ADDRESS(UniverseChainId.Mainnet),
    symbol: 'WETH',
    nativeSymbol: 'ETH',
    chainId: UniverseChainId.Mainnet, // 1
    interfaceName: 'mainnet',
  }
}

// Wrap tests require specific token list configuration that differs between chains
test.describe(
  'Wrap',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test.describe.configure({ retries: 3 })

    test('should unwrap wrapped native token', async ({ page, anvil }) => {
      const config = getChainConfig()

      await stubLuxGatewayEndpoint({ page })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })

      // Set balance for wrapped token
      await anvil.setErc20Balance({
        address: assume0xAddress(config.address),
        balance: parseEther('1'),
      })

      // Navigate to swap page with chain parameter
      await page.goto(`/swap?chain=${config.interfaceName}`)
      await page.waitForLoadState('networkidle')

      // Select wrapped token as input - wait for token list to load
      await page.getByTestId(TestID.ChooseInputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-${config.symbol}`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-${config.symbol}`).first().click()

      // Select native token as output
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-${config.nativeSymbol}`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-${config.nativeSymbol}`).first().click()

      await page.getByTestId(TestID.AmountInputIn).fill('0.01')
      await page.getByTestId(TestID.ReviewSwap).click()
      await page.getByTestId(TestID.Swap).click()

      await expect(page.getByText('Unwrapped')).toBeVisible()
      await expect(page.getByText(`0.010 ${config.symbol} for 0.010 ${config.nativeSymbol}`)).toBeVisible()
    })

    test('should wrap native token', async ({ page, anvil }) => {
      const config = getChainConfig()

      await stubLuxGatewayEndpoint({ page })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })

      // Navigate to swap page with chain parameter - native token is default input
      await page.goto(`/swap?chain=${config.interfaceName}`)
      await page.waitForLoadState('networkidle')

      // Select wrapped token as output - WLUX should be in the suggested tokens
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-${config.symbol}`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-${config.symbol}`).first().click()

      await page.getByTestId(TestID.AmountInputIn).fill('0.01')
      await page.getByTestId(TestID.ReviewSwap).click()
      await page.getByTestId(TestID.Swap).click()

      await expect(page.getByText('Wrapped')).toBeVisible()
      await expect(page.getByText(`0.010 ${config.nativeSymbol} for 0.010 ${config.symbol}`)).toBeVisible()
    })
  },
)
