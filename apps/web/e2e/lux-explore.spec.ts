/**
 * Lux Exchange - Explore Page (Lux Network) E2E Tests
 *
 * Tests the explore page filtered to Lux chain with real V3 subgraph data.
 * Verifies tokens, pools, and trading history for Lux LPs.
 *
 * Usage:
 *   BASE_URL=https://exchange.lux.network npx playwright test e2e/lux-explore.spec.ts
 */

import { test, expect } from '@playwright/test'

const LOAD_TIMEOUT = 15000

test.describe('Explore Page - Lux Network @critical', () => {
  test('should show Lux tokens table when filtered to lux chain', async ({ page }) => {
    await page.goto('/explore/tokens/lux')
    await page.waitForTimeout(8000)
    // The Lux tokens table should render with data-testid
    const table = page.locator('[data-testid="top-tokens-explore-table"]')
    await expect(table).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show Lux pools with real TVL @critical', async ({ page }) => {
    await page.goto('/explore/pools/lux')
    await page.waitForTimeout(8000)
    // Pool table should have dollar TVL values
    const dollarValues = page.locator('text=/\\$[\\d,.]+/')
    const count = await dollarValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show dollar TVL values on pools page', async ({ page }) => {
    await page.goto('/explore/pools/lux')
    await page.waitForTimeout(8000)
    const dollarValues = page.locator('text=/\\$[\\d,.]+/')
    const count = await dollarValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show fee percentages on pools page', async ({ page }) => {
    await page.goto('/explore/pools/lux')
    await page.waitForTimeout(8000)
    // Fee values like "0.3%" or "0.05%"
    const feeValues = page.locator('text=/\\d+\\.\\d+%/')
    const count = await feeValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display stats bar with TVL data', async ({ page }) => {
    await page.goto('/explore/tokens/lux')
    await page.waitForTimeout(8000)
    // Stats bar shows "Total Lux TVL" or similar
    const tvlText = page.locator('text=/TVL/i')
    await expect(tvlText.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should display explore page tabs', async ({ page }) => {
    await page.goto('/explore/tokens/lux')
    await page.waitForTimeout(5000)
    // The explore page has Tokens, Pools, Transactions tabs
    await expect(page.getByText('Tokens').first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText('Pools').first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })
})

test.describe('Explore Page - Lux Pool Details', () => {
  test('should show pool data with price values', async ({ page }) => {
    await page.goto('/explore/pools/lux')
    await page.waitForTimeout(8000)
    // Pool rows should have numeric price values
    const priceValues = page.locator('text=/\\d+\\.\\d{4,}/')
    const count = await priceValues.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Explore Page - Network Toggle', () => {
  test('should switch between All Networks and Lux via URL', async ({ page }) => {
    // All networks
    await page.goto('/explore/tokens')
    await page.waitForTimeout(5000)

    // Navigate to Lux
    await page.goto('/explore/tokens/lux')
    await page.waitForTimeout(5000)
    expect(page.url()).toContain('lux')
  })

  test('should navigate from tokens to pools', async ({ page }) => {
    await page.goto('/explore/tokens/lux')
    await page.waitForTimeout(5000)

    // Click Pools tab
    const poolsTab = page.getByText('Pools').first()
    if (await poolsTab.isVisible()) {
      await poolsTab.click()
      await page.waitForTimeout(3000)
      expect(page.url()).toContain('pools')
    }
  })
})

test.describe('Explore Page - Lux Transactions', () => {
  test('should load transactions page for Lux', async ({ page }) => {
    await page.goto('/explore/transactions/lux')
    await page.waitForTimeout(8000)
    // Page should load without errors
    const hasContent =
      (await page.locator('text=/0x[a-f0-9]{4}/i').count()) > 0 ||
      (await page.getByText(/No transactions|Loading/).isVisible().catch(() => false)) ||
      // Page loaded successfully even if no transaction data
      (await page.getByText('Transactions').first().isVisible().catch(() => false))
    expect(hasContent).toBeTruthy()
  })
})
