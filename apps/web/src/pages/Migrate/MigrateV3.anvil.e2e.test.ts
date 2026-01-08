import { getPosition } from '@luxdex/client-data-api/dist/data/v1/api-DataApiService_connectquery'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { createExpectSingleTransaction } from 'playwright/anvil/transactions'
import { expect, getTest } from 'playwright/fixtures'
import { DEFAULT_TEST_GAS_LIMIT, stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import { Mocks } from 'playwright/mocks/mocks'
import { uniswapUrls } from 'lx/src/constants/urls'

const test = getTest({ withAnvil: true })

const ANIMATION_DELAY = 300

// Get chain-specific configuration for V3 to V4 migration
// Migration works from any chain's V3 positions TO Lux V4 (unified DEX precompile)
const getChainConfig = () => {
  if (isLuxdMode()) {
    return {
      chainSegment: 'lux',
      positionId: '1',
      singleSidedPositionId: '2',
    }
  }
  return {
    chainSegment: 'ethereum',
    positionId: '1028438',
    singleSidedPositionId: '1035132',
  }
}

test.describe(
  'Migrate V3',
  {
    tag: '@team:apps-lp',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-lp' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    // V3 to V4 migration works on all chains - migrate any V3 position to Lux V4 (native DEX precompile)

    test('should migrate from v3 to v4', async ({ page, anvil }) => {
      const config = getChainConfig()
      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      await stubTradingApiEndpoint({
        page,
        endpoint: uniswapUrls.tradingApiPaths.migrate,
        modifyResponseData: (data) => {
          data.migrate.gasLimit = DEFAULT_TEST_GAS_LIMIT
          return data
        },
      })
      await page.route(
        `${uniswapUrls.apiBaseUrlV2}/${getPosition.service.typeName}/${getPosition.name}`,
        async (route) => {
          await route.fulfill({ path: Mocks.Positions.get_v3_position })
        },
      )
      await page.goto(`/migrate/v3/${config.chainSegment}/${config.positionId}`)

      await expectSingleTransaction(async () => {
        await page.getByRole('button', { name: 'Continue' }).click()
        await page.waitForTimeout(ANIMATION_DELAY)
        await page.getByRole('button', { name: 'Continue' }).click()
        await page.getByRole('button', { name: 'Migrate' }).click()
        await expect(page.getByText('Migrating liquidity')).toBeVisible()
      })
    })

    test('should migrate a single sided position from v3 to v4', async ({ page, anvil }) => {
      const config = getChainConfig()
      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      await stubTradingApiEndpoint({
        page,
        endpoint: uniswapUrls.tradingApiPaths.migrate,
        modifyResponseData: (data) => {
          try {
            data.migrate.gasLimit = DEFAULT_TEST_GAS_LIMIT
            return data
          } catch {
            return data
          }
        },
      })
      await page.route(
        `${uniswapUrls.apiBaseUrlV2}/${getPosition.service.typeName}/${getPosition.name}`,
        async (route) => {
          await route.fulfill({ path: Mocks.Positions.get_single_sided_v3_position })
        },
      )
      await page.goto(`/migrate/v3/${config.chainSegment}/${config.singleSidedPositionId}`)

      await expectSingleTransaction(async () => {
        await page.getByRole('button', { name: 'Continue' }).click()
        await page.waitForTimeout(ANIMATION_DELAY)
        await page.getByRole('button', { name: 'Continue' }).click()
        await page.getByRole('button', { name: 'Migrate' }).click()
        await expect(page.getByText('Migrating liquidity')).toBeVisible()
      })
    })
  },
)
