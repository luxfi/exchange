import { WETH9 } from '@luxamm/sdk-core'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { expect, getTest } from 'playwright/fixtures'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import { Mocks } from 'playwright/mocks/mocks'
import { ZERO_ADDRESS } from 'lx/src/constants/misc'
import { DAI, USDC_MAINNET } from 'lx/src/constants/tokens'
import { uniswapUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { assume0xAddress } from 'utils/wagmi'
import { parseEther } from 'viem'

const test = getTest({ withAnvil: true })

const UNISWAP_X_ORDERS_ENDPOINT = `https://interface.gateway.uniswap.org/v2/orders?swapper=${TEST_WALLET_ADDRESS}&orderHashes=${ZERO_ADDRESS}`

// UniswapX tests are Ethereum-specific - UniswapX is an Ethereum MEV protection system
// Lux uses its native DEX precompile instead
test.describe(
  'UniswapX',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  async () => {
    test.beforeEach(async ({ page, anvil }) => {
      // UniswapX is Ethereum-only - Lux uses native DEX precompile
      if (isLuxdMode()) {
        return
      }
      await anvil.setErc20Balance({
        address: assume0xAddress(WETH9[UniverseChainId.Mainnet].address),
        balance: parseEther('1000000'),
      })
      await page.route(`${uniswapUrls.tradingApiUrl}${uniswapUrls.tradingApiPaths.quote}`, async (route, request) => {
        const postData = await request.postData()
        const data = JSON.parse(postData ?? '{}')
        if (data.tokenOut === USDC_MAINNET.address) {
          await route.continue()
        } else {
          await route.fulfill({ path: Mocks.UniswapX.quote })
        }
      })
      await page.route(`${uniswapUrls.tradingApiUrl}${uniswapUrls.tradingApiPaths.order}`, async (route) => {
        await route.fulfill({ path: Mocks.UniswapX.openOrder })
      })
      await page.goto(`/swap?inputCurrency=${WETH9[UniverseChainId.Mainnet].address}&outputCurrency=${DAI.address}`)

      await page.getByTestId(TestID.AmountInputIn).fill('1')
      await page.getByTestId(TestID.ReviewSwap).click()
      await page.getByTestId(TestID.Swap).click()
    })

    test('can swap using uniswapX with WETH as input', async ({ page }) => {
      if (isLuxdMode()) return // UniswapX is Ethereum-only
      await page.route(UNISWAP_X_ORDERS_ENDPOINT, async (route) => {
        await route.fulfill({
          path: Mocks.UniswapX.filledOrders,
        })
      })

      await expect(page.getByText('Approved')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Swapping 1.00 WETH for 3,665.13 DAI' })).toBeVisible()
    })

    test('renders error view if uniswapx order expires', async ({ page }) => {
      if (isLuxdMode()) return // UniswapX is Ethereum-only
      await page.route(UNISWAP_X_ORDERS_ENDPOINT, async (route) => {
        await route.fulfill({ path: Mocks.UniswapX.expiredOrders })
      })

      await expect(page.getByText('Swap expired')).toBeVisible()
    })

    test('cancels a pending uniswapx order', async ({ page }) => {
      if (isLuxdMode()) return // UniswapX is Ethereum-only
      await page.getByTestId(TestID.Web3StatusConnected).click()
      await page.getByText('Activity').click()
      await page.getByText('Swapping').click()
      await page.getByText('Cancel').click()
      await page.getByRole('button', { name: 'Proceed' }).click()

      await expect(page.getByText('Cancellation successful')).toBeVisible()
    })

    test('deduplicates remote vs local uniswapx orders', async ({ page, graphql }) => {
      if (isLuxdMode()) return // UniswapX is Ethereum-only
      await page.route(UNISWAP_X_ORDERS_ENDPOINT, async (route) => {
        await route.fulfill({ path: Mocks.UniswapX.filledOrders })
      })

      await page.getByTestId(TestID.Web3StatusConnected).click()
      await page.getByText('Activity').click()
      await graphql.intercept('ActivityWeb', Mocks.UniswapX.activity)
      const activity = await page.getByTestId(TestID.ActivityContent)
      await expect(activity.getByText('Swapping')).not.toBeVisible()
      await expect(activity.getByText('Swapped')).toBeVisible()
    })
  },
)
