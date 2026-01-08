import { getPosition } from '@luxdex/client-data-api/dist/data/v1/api-DataApiService_connectquery'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { ONE_MILLION_USDT } from 'playwright/anvil/utils'
import { expect, getTest } from 'playwright/fixtures'
import { stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { Mocks } from 'playwright/mocks/mocks'
import { LUSD_LUX, USDT } from 'lx/src/constants/tokens'
import { uniswapUrls } from 'lx/src/constants/urls'
import { assume0xAddress } from 'utils/wagmi'
import { parseEther } from 'viem'

const test = getTest({ withAnvil: true })

// Get chain-specific configuration
const getChainConfig = () => {
  if (isLuxdMode()) {
    return {
      chainSegment: 'lux',
      stableToken: LUSD_LUX,
      stableSymbol: 'LUSD',
      stableBalance: parseEther('100'),
    }
  }
  return {
    chainSegment: 'ethereum',
    stableToken: USDT,
    stableSymbol: 'USDT',
    stableBalance: ONE_MILLION_USDT,
  }
}

test.describe(
  'Remove liquidity',
  {
    tag: '@team:apps-lp',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-lp' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    // Tests use chain-aware configuration

    test('should decrease liquidity of a position', async ({ page, anvil }) => {
      const config = getChainConfig()
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.decreaseLp })
      await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
      await page.route(
        `${uniswapUrls.apiBaseUrlV2}/${getPosition.service.typeName}/${getPosition.name}`,
        async (route) => {
          await route.fulfill({ path: Mocks.Positions.get_v4_position })
        },
      )
      await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
      await page.goto(`/positions/v4/${config.chainSegment}/1`)
      await page.getByRole('button', { name: 'Remove liquidity' }).dblclick()
      await page.locator('div').filter({ hasText: /^50%$/ }).click()

      await page.getByRole('button', { name: 'Review' }).click()
      await page.getByRole('button', { name: 'Confirm' }).click()
      // Check for token amount in results (amount varies by chain decimals)
      await expect(page.getByText(new RegExp(`\\d+\\.\\d+ ${config.stableSymbol}`)).first()).toBeVisible()
    })
  },
)
