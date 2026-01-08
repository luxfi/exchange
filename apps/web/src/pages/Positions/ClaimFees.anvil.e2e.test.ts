import { getPosition } from '@luxdex/client-data-api/dist/data/v1/api-DataApiService_connectquery'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { createExpectSingleTransaction } from 'playwright/anvil/transactions'
import { expect, getTest } from 'playwright/fixtures'
import { DEFAULT_TEST_GAS_LIMIT, stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import { Mocks } from 'playwright/mocks/mocks'
import { uniswapUrls } from 'lx/src/constants/urls'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest({ withAnvil: true })

// Get chain-specific URL segment
const getChainUrlSegment = () => (isLuxdMode() ? 'lux' : 'ethereum')

test.describe(
  'Claim fees',
  {
    tag: '@team:apps-lp',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-lp' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    // Tests use chain-aware URL construction

    test('should claim fees from a v3 position', async ({ page, anvil }) => {
      const chainSegment = getChainUrlSegment()
      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      await stubTradingApiEndpoint({
        page,
        endpoint: uniswapUrls.tradingApiPaths.claimLpFees,
        modifyResponseData: (data) => {
          data.claim.gasLimit = DEFAULT_TEST_GAS_LIMIT
          return data
        },
      })
      await page.route(
        `${uniswapUrls.apiBaseUrlV2}/${getPosition.service.typeName}/${getPosition.name}`,
        async (route) => {
          await route.fulfill({ path: Mocks.Positions.get_v3_position })
        },
      )
      await page.goto(`/positions/v3/${chainSegment}/1028438`)

      // Perform fee claiming and verify transaction was submitted
      await expectSingleTransaction(async () => {
        await page.getByRole('button', { name: 'Collect fees' }).click()
        await page.getByTestId(TestID.ClaimFees).click()
        await expect(page.getByText('Collecting fees')).toBeVisible()
      })
    })

    test('should claim fees from a v4 position', async ({ page, anvil }) => {
      const chainSegment = getChainUrlSegment()
      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      await stubTradingApiEndpoint({
        page,
        endpoint: uniswapUrls.tradingApiPaths.claimLpFees,
        modifyResponseData: (data) => {
          try {
            data.claim.gasLimit = DEFAULT_TEST_GAS_LIMIT
            return data
          } catch {
            return data
          }
        },
      })
      await page.route(
        `${uniswapUrls.apiBaseUrlV2}/${getPosition.service.typeName}/${getPosition.name}`,
        async (route) => {
          await route.fulfill({ path: Mocks.Positions.get_v4_position })
        },
      )
      await page.goto(`/positions/v4/${chainSegment}/13298`)

      // Perform fee claiming and verify transaction was submitted
      await expectSingleTransaction(async () => {
        await page.getByRole('button', { name: 'Collect fees' }).click()
        await page.getByTestId(TestID.ClaimFees).click()
        await expect(page.getByText('Collecting fees')).toBeVisible()
      })
    })
  },
)
