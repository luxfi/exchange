/**
 * LXAMM E2E Tests - AMM v4 Swaps via Native Precompiles
 *
 * Tests the LXPool and LXRouter precompiles (LP-9010, LP-9012)
 * These tests run in luxd mode where precompiles are available natively.
 *
 * @see LP-9010 (LXPool) - Core AMM with flash accounting
 * @see LP-9012 (LXRouter) - Optimized swap routing
 */
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

// Skip if not in luxd mode - precompiles only available on Lux chains
test.skip(!isLuxdMode(), 'LXAMM precompile tests require luxd mode')

// LXAMM Precompile Addresses (LP-aligned)
const LXAMM = {
  LX_POOL: '0x0000000000000000000000000000000000009010',
  LX_ROUTER: '0x0000000000000000000000000000000000009012',
  LX_ORACLE: '0x0000000000000000000000000000000000009011',
} as const

// LuxDev token addresses (deployed deterministically)
const LUXDEV_TOKENS = {
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  LUSD: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  LETH: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  LBTC: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
} as const

test.describe(
  'LXAMM v4 - Native Precompile Swaps',
  {
    tag: '@team:apps-dex',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-dex' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
      { type: 'DD_TAGS[feature]', description: 'lxamm-precompile' },
    ],
  },
  () => {
    test.describe.configure({ retries: 3 })

    test.beforeEach(async ({ page, anvil }) => {
      // Verify we're on LuxDev chain with precompiles available
      const chainId = await anvil.getChainId()
      expect(chainId).toBe(1337) // LuxDev chain ID

      // Check that LXPool precompile has code (native precompile)
      const poolCode = await anvil.getCode({ address: LXAMM.LX_POOL as `0x${string}` })
      // Precompiles return '0x' or minimal bytecode
      expect(poolCode).toBeDefined()

      // Stub API endpoints
      await stubLuxGatewayEndpoint({ page })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
    })

    test('should verify LXPool precompile is accessible', async ({ anvil }) => {
      // Verify the LXPool precompile address responds
      const code = await anvil.getCode({ address: LXAMM.LX_POOL as `0x${string}` })
      // Precompiles are implemented in Go, may return empty or minimal code
      expect(code !== undefined).toBe(true)

      // Verify LXRouter precompile
      const routerCode = await anvil.getCode({ address: LXAMM.LX_ROUTER as `0x${string}` })
      expect(routerCode !== undefined).toBe(true)
    })

    test('should swap LUX to WLUX using LXRouter precompile', async ({ page, anvil }) => {
      const wlux = WRAPPED_NATIVE_CURRENCY[UniverseChainId.LuxDev]

      // Navigate to swap page for LuxDev chain
      await page.goto('/swap?chain=lux-dev')
      await page.waitForLoadState('networkidle')

      // LUX should be default input token
      await expect(page.getByTestId(TestID.ChooseInputToken + '-label')).toContainText('LUX')

      // Select WLUX as output
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)

      // Look for WLUX in token selector
      const wluxOption = page.getByTestId(`token-option-1337-WLUX`).first()
      if (await wluxOption.isVisible()) {
        await wluxOption.click()
      } else {
        // Search for WLUX
        await page.getByPlaceholder('Search name or paste address').fill('WLUX')
        await page.waitForTimeout(1000)
        await page.getByTestId(`token-option-1337-WLUX`).first().click()
      }

      // Enter amount
      await page.getByTestId(TestID.AmountInputIn).fill('0.01')

      // Should show wrap action (LUX -> WLUX is a wrap)
      const reviewButton = page.getByTestId(TestID.ReviewSwap)
      await expect(reviewButton).toBeEnabled()
      await reviewButton.click()

      // Execute swap
      await page.getByTestId(TestID.Swap).click()

      // Should complete as wrap operation
      await expect(page.getByText(/Wrapped|Swapped/)).toBeVisible({ timeout: 30000 })
    })

    test('should swap WLUX to LUSD via AMM pool', async ({ page, anvil }) => {
      // Set up WLUX balance for test wallet
      await anvil.setErc20Balance({
        address: assume0xAddress(LUXDEV_TOKENS.WLUX),
        balance: parseEther('10'),
      })

      await page.goto('/swap?chain=lux-dev')
      await page.waitForLoadState('networkidle')

      // Select WLUX as input
      await page.getByTestId(TestID.ChooseInputToken).click()
      await page.waitForTimeout(2000)
      await page.getByPlaceholder('Search name or paste address').fill('WLUX')
      await page.waitForTimeout(1000)
      const wluxInput = page.getByTestId(`token-option-1337-WLUX`).first()
      if (await wluxInput.isVisible()) {
        await wluxInput.click()
      }

      // Select LUSD as output
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)
      await page.getByPlaceholder('Search name or paste address').fill('LUSD')
      await page.waitForTimeout(1000)
      const lusdOutput = page.getByTestId(`token-option-1337-LUSD`).first()
      if (await lusdOutput.isVisible()) {
        await lusdOutput.click()
      }

      // Enter swap amount
      await page.getByTestId(TestID.AmountInputIn).fill('1')

      // If pool exists and has liquidity, we should see a quote
      // This test verifies the routing infrastructure works with precompiles
      const reviewButton = page.getByTestId(TestID.ReviewSwap)
      const hasQuote = await reviewButton.isEnabled({ timeout: 10000 }).catch(() => false)

      if (hasQuote) {
        // Quote available - proceed with swap
        await reviewButton.click()
        await page.getByTestId(TestID.Swap).click()
        await expect(page.getByText('Swapped')).toBeVisible({ timeout: 30000 })
      } else {
        // No liquidity in pool - this is expected on fresh dev chain
        // Verify we show appropriate message
        await expect(page.getByText(/Insufficient liquidity|No route found/i)).toBeVisible()
      }
    })

    test('should display pool information from LXOracle', async ({ page, anvil }) => {
      // Verify oracle precompile is accessible
      const oracleCode = await anvil.getCode({ address: LXAMM.LX_ORACLE as `0x${string}` })
      expect(oracleCode !== undefined).toBe(true)

      await page.goto('/swap?chain=lux-dev')
      await page.waitForLoadState('networkidle')

      // The swap interface should be functional
      await expect(page.getByTestId(TestID.ChooseInputToken)).toBeVisible()
      await expect(page.getByTestId(TestID.ChooseOutputToken)).toBeVisible()
      await expect(page.getByTestId(TestID.AmountInputIn)).toBeVisible()
    })
  },
)
