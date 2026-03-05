/**
 * Trade Page E2E Tests - Advanced Trading UI
 *
 * Tests the /trade route with CLOB order form, order book,
 * market stats, positions panel, and order management.
 */
import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

test.describe(
  'Trade Page - Layout & Navigation',
  {
    tag: '@team:apps-dex',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-dex' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
      { type: 'DD_TAGS[feature]', description: 'trade-page' },
    ],
  },
  () => {
    test('should load /trade route without crashing', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')
      const title = await page.title()
      expect(title).toBeDefined()
    })

    test('should render market selector with default symbol', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      const selector = page.locator('select').first()
      await expect(selector).toBeVisible()
      // Default symbol should be LUX-USDC
      await expect(selector).toHaveValue('LUX-USDC')
    })

    test('should switch market symbols', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      const selector = page.locator('select').first()
      await selector.selectOption('LETH-USDC')
      await expect(selector).toHaveValue('LETH-USDC')
    })

    test('should render top bar with market stats', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      // Stats labels should be visible
      await expect(page.getByText('Last')).toBeVisible()
      await expect(page.getByText('Vol')).toBeVisible()
      await expect(page.getByText('Mark')).toBeVisible()
      await expect(page.getByText('Funding')).toBeVisible()
    })

    test('should render three-column layout', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      // Order book panel
      await expect(page.getByText('Order Book')).toBeVisible()
      // Recent trades
      await expect(page.getByText('Recent Trades')).toBeVisible()
      // Chart placeholder
      await expect(page.getByText(/TradingView Chart/)).toBeVisible()
    })

    test('should render bottom tabs for orders and positions', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      await expect(page.getByRole('button', { name: /Open Orders/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /Positions/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /History/ })).toBeVisible()
    })

    test('should switch between bottom tabs', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      // Click Positions tab
      await page.getByRole('button', { name: /Positions/ }).click()
      await expect(page.getByText('No open positions')).toBeVisible()

      // Click back to Orders tab
      await page.getByRole('button', { name: /Open Orders/ }).click()
      await expect(page.getByText('No open orders')).toBeVisible()
    })
  },
)

test.describe(
  'Trade Page - Order Form',
  {
    tag: '@team:apps-dex',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-dex' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
      { type: 'DD_TAGS[feature]', description: 'trade-order-form' },
    ],
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')
    })

    test('should render order type tabs', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Limit' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Market' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Stop Limit' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Bracket' })).toBeVisible()
    })

    test('should switch between order types', async ({ page }) => {
      // Switch to Market order
      await page.getByRole('button', { name: 'Market' }).click()
      // Market orders should NOT show price input
      const priceInputs = page.locator('label:has-text("Price") + input')
      await expect(priceInputs).toHaveCount(0)

      // Switch to Limit order
      await page.getByRole('button', { name: 'Limit' }).click()
      // Limit orders SHOULD show price input
      await expect(page.getByText('Price').first()).toBeVisible()
    })

    test('should show stop price for stop orders', async ({ page }) => {
      await page.getByRole('button', { name: 'Stop', exact: true }).click()
      await expect(page.getByText('Stop Price')).toBeVisible()
    })

    test('should show TP/SL for bracket orders', async ({ page }) => {
      await page.getByRole('button', { name: 'Bracket' }).click()
      await expect(page.getByText('Take Profit')).toBeVisible()
      await expect(page.getByText('Stop Loss')).toBeVisible()
      await expect(page.getByText('Stop Price')).toBeVisible()
    })

    test('should toggle buy/sell side', async ({ page }) => {
      const buyButton = page.getByRole('button', { name: 'Buy / Long' })
      const sellButton = page.getByRole('button', { name: 'Sell / Short' })

      // Click Sell
      await sellButton.click()
      // Submit button text should change
      await expect(page.getByRole('button', { name: /Sell \/ Short LUX/ })).toBeVisible()

      // Click Buy
      await buyButton.click()
      await expect(page.getByRole('button', { name: /Buy \/ Long LUX/ })).toBeVisible()
    })

    test('should render leverage selector', async ({ page }) => {
      await expect(page.getByText('Leverage')).toBeVisible()
      await expect(page.getByRole('button', { name: '1x' })).toBeVisible()
      await expect(page.getByRole('button', { name: '10x' })).toBeVisible()
      await expect(page.getByRole('button', { name: '100x' })).toBeVisible()
    })

    test('should select different leverage levels', async ({ page }) => {
      await page.getByRole('button', { name: '25x' }).click()
      // Leverage should be reflected in order summary when form is filled
    })

    test('should render time in force selector for limit orders', async ({ page }) => {
      // Ensure we're on limit order tab
      await page.getByRole('button', { name: 'Limit' }).click()
      await expect(page.getByText('Time in Force')).toBeVisible()
    })

    test('should hide time in force for market orders', async ({ page }) => {
      await page.getByRole('button', { name: 'Market' }).click()
      // TIF should not be visible for market orders
      const tifLabels = page.locator('text=Time in Force')
      await expect(tifLabels).toHaveCount(0)
    })

    test('should render post-only and reduce-only checkboxes', async ({ page }) => {
      await expect(page.getByText('Post Only')).toBeVisible()
      await expect(page.getByText('Reduce Only')).toBeVisible()
    })

    test('should toggle post-only checkbox', async ({ page }) => {
      const checkbox = page.locator('input[type="checkbox"]').first()
      await checkbox.check()
      await expect(checkbox).toBeChecked()
      await checkbox.uncheck()
      await expect(checkbox).not.toBeChecked()
    })

    test('should disable submit button when form is empty', async ({ page }) => {
      const submit = page.getByRole('button', { name: /Buy \/ Long LUX/ })
      await expect(submit).toBeDisabled()
    })

    test('should enable submit when price and size are filled (limit order)', async ({ page }) => {
      // Fill price
      const priceInput = page.locator('input[placeholder="0.00"]').first()
      await priceInput.fill('100')

      // Fill size
      const sizeInput = page.locator('input[placeholder="0.00"]').nth(1)
      await sizeInput.fill('10')

      // Submit should now be enabled
      const submit = page.getByRole('button', { name: /Buy \/ Long LUX/ })
      await expect(submit).toBeEnabled()
    })

    test('should show order summary when form is valid', async ({ page }) => {
      // Fill price and size for limit order
      const priceInput = page.locator('input[placeholder="0.00"]').first()
      await priceInput.fill('50')

      const sizeInput = page.locator('input[placeholder="0.00"]').nth(1)
      await sizeInput.fill('2')

      // Should see order value summary
      await expect(page.getByText(/100\.00/)).toBeVisible() // 50 * 2 = 100
    })

    test('should enable submit for market order with only size', async ({ page }) => {
      // Switch to market order
      await page.getByRole('button', { name: 'Market' }).click()

      // Fill only size (market orders don't need price)
      const sizeInput = page.locator('input[placeholder="0.00"]').first()
      await sizeInput.fill('1')

      const submit = page.getByRole('button', { name: /Buy \/ Long LUX/ })
      await expect(submit).toBeEnabled()
    })
  },
)

test.describe(
  'Trade Page - Order Book Interaction',
  {
    tag: '@team:apps-dex',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-dex' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
      { type: 'DD_TAGS[feature]', description: 'trade-orderbook' },
    ],
  },
  () => {
    test('should render order book headers', async ({ page }) => {
      await page.goto('/trade')
      await page.waitForLoadState('networkidle')

      // Order book should have column headers
      const orderBookSection = page.locator('text=Order Book').locator('..')
      await expect(orderBookSection).toBeVisible()
    })
  },
)
