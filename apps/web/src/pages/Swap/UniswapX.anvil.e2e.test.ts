import { listTransactions } from '@luxamm/client-data-api/dist/data/v1/api-DataApiService_connectquery'
import { WETH9 } from '@luxamm/sdk-core'
import { ZERO_ADDRESS } from 'lx/src/constants/misc'
import { DAI, USDC_MAINNET } from 'lx/src/constants/tokens'
import { lxUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { parseEther } from 'viem'
import { expect, getTest } from '~/playwright/fixtures'
import { TEST_WALLET_ADDRESS } from '~/playwright/fixtures/wallets'
import { Mocks } from '~/playwright/mocks/mocks'
import { assume0xAddress } from '~/utils/wagmi'

const test = getTest({ withAnvil: true })

const LX_SWAP_ORDERS_ENDPOINT = `https://interface.gateway.lx.org/v2/orders?swapper=${TEST_WALLET_ADDRESS}&orderHashes=${ZERO_ADDRESS}`

test.describe(
  'LX',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  async () => {
    test.beforeEach(async ({ page, anvil }) => {
      await anvil.setErc20Balance({
        address: assume0xAddress(WETH9[UniverseChainId.Mainnet].address),
        balance: parseEther('1000000'),
      })
      await page.route(`${lxUrls.tradingApiUrl}${lxUrls.tradingApiPaths.quote}`, async (route, request) => {
        const postData = await request.postData()
        const data = JSON.parse(postData ?? '{}')
        if (data.tokenOut === USDC_MAINNET.address) {
          await route.continue()
        } else {
          await route.fulfill({ path: Mocks.LX.quote })
        }
      })
      await page.route(`${lxUrls.tradingApiUrl}${lxUrls.tradingApiPaths.order}`, async (route) => {
        await route.fulfill({ path: Mocks.LX.openOrder })
      })
      await page.goto(`/swap?inputCurrency=${WETH9[UniverseChainId.Mainnet].address}&outputCurrency=${DAI.address}`)

      await page.getByTestId(TestID.AmountInputIn).fill('1')
      await page.getByTestId(TestID.ReviewSwap).click()
      await page.getByTestId(TestID.Swap).click()
    })

    test('can swap using lxSwap with WETH as input', async ({ page }) => {
      await page.route(LX_SWAP_ORDERS_ENDPOINT, async (route) => {
        await route.fulfill({
          path: Mocks.LX.filledOrders,
        })
      })

      await expect(page.getByTestId(TestID.ActivityPopup).getByText('Approved')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Swapping 1.00 WETH for 3,665.13 DAI' })).toBeVisible()
    })

    test('renders error view if lx order expires', async ({ page }) => {
      await page.route(LX_SWAP_ORDERS_ENDPOINT, async (route) => {
        await route.fulfill({ path: Mocks.LX.expiredOrders })
      })

      await expect(page.getByTestId(TestID.ActivityPopup).getByText('Swap expired')).toBeVisible()
    })

    test('cancels a pending lx order', async ({ page }) => {
      await page.getByTestId(TestID.Web3StatusConnected).click()
      await page.getByText('Swapping').click()
      await page.getByText('Cancel').click()
      await page.getByRole('button', { name: 'Proceed' }).click()

      await expect(page.getByText('Cancellation successful')).toBeVisible()
    })

    test('deduplicates remote vs local lx orders', async ({ page, dataApi }) => {
      await page.route(LX_SWAP_ORDERS_ENDPOINT, async (route) => {
        await route.fulfill({ path: Mocks.LX.filledOrders })
      })

      await dataApi.intercept(listTransactions, Mocks.DataApiService.list_transactions_lx)
      await page.getByTestId(TestID.Web3StatusConnected).click()
      const drawer = page.getByTestId(TestID.AccountDrawer)
      await expect(drawer.getByText('Swapping')).not.toBeVisible()
      await expect(drawer.getByText('Swapped')).toBeVisible()
    })
  },
)
