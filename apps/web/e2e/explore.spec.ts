/**
 * Lux Exchange - Explore Page E2E Tests
 *
 * Tests the markets/pools/tokens tabs on the explore page
 * with live data from CoinGecko + DeFi Llama APIs.
 *
 * Usage:
 *   # Test against production (default)
 *   BASE_URL=https://lux.exchange npx playwright test -c playwright.explore.config.ts
 *
 *   # Test against local dev
 *   BASE_URL=http://localhost:3000 npx playwright test -c playwright.explore.config.ts
 */

import { test, expect } from "@playwright/test"

test.describe("Explore Page - Tokens", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/explore/tokens")
    // Wait for token data to load (CoinGecko API)
    await page.waitForTimeout(5000)
  })

  test("should display token table with data", async ({ page }) => {
    const table = page.locator('[data-testid="top-tokens-explore-table"]')
    await expect(table).toBeVisible({ timeout: 15000 })
  })

  test("should show well-known token symbols", async ({ page }) => {
    // Wait for table to render
    await page.waitForTimeout(3000)
    const hasEth = await page.getByText("ETH").first().isVisible().catch(() => false)
    const hasUsdc = await page.getByText("USDC").first().isVisible().catch(() => false)
    const hasBtc = await page.getByText("WBTC").first().isVisible().catch(() => false)
    const hasLux = await page.getByText("LUX").first().isVisible().catch(() => false)
    expect(hasEth || hasUsdc || hasBtc || hasLux).toBeTruthy()
  })

  test("should display explore navbar tabs", async ({ page }) => {
    const navbar = page.locator('[data-testid="explore-navbar"]')
    await expect(navbar).toBeVisible({ timeout: 10000 })
    await expect(navbar.getByText("Tokens")).toBeVisible()
    await expect(navbar.getByText("Pools")).toBeVisible()
    await expect(navbar.getByText("Transactions")).toBeVisible()
  })
})

test.describe("Explore Page - Pools/Markets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/explore/pools")
    // Wait for pool data to load
    await page.waitForTimeout(5000)
  })

  test("should display pool table with data @critical", async ({ page }) => {
    const table = page.locator('[data-testid="top-pools-explore-table"]')
    await expect(table).toBeVisible({ timeout: 15000 })

    // Pool table should render rows with pool pair info (e.g. "USDC/WETH")
    const poolPairs = page.locator('text=/\\w+\\/\\w+/')
    const count = await poolPairs.count()
    expect(count).toBeGreaterThan(0)
  })

  test("should show TVL values", async ({ page }) => {
    const table = page.locator('[data-testid="top-pools-explore-table"]')
    await expect(table).toBeVisible({ timeout: 15000 })

    // At least one cell should show a dollar value
    const dollarValues = page.locator('text=/\\$[\\d,]+/')
    const count = await dollarValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test("should show Add Liquidity button", async ({ page }) => {
    const addButton = page.getByText(/Add liquidity|Add/i)
    await expect(addButton.first()).toBeVisible({ timeout: 10000 })
  })

  test("should show Protocol filter", async ({ page }) => {
    const protocolFilter = page.getByText("Protocol")
    await expect(protocolFilter).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Explore Page - Navigation", () => {
  test("should navigate between tabs", async ({ page }) => {
    await page.goto("/explore/tokens")
    await page.waitForTimeout(3000)

    const navbar = page.locator('[data-testid="explore-navbar"]')

    // Click Pools tab
    await navbar.getByText("Pools").click()
    await page.waitForURL(/\/explore\/pools/, { timeout: 10000 })

    // Pools table should appear
    const poolTable = page.locator('[data-testid="top-pools-explore-table"]')
    await expect(poolTable).toBeVisible({ timeout: 15000 })

    // Click back to Tokens tab
    await navbar.getByText("Tokens").click()
    await page.waitForURL(/\/explore\/tokens/, { timeout: 10000 })

    const tokenTable = page.locator('[data-testid="top-tokens-explore-table"]')
    await expect(tokenTable).toBeVisible({ timeout: 15000 })
  })

  test("should show stats section with volume/TVL", async ({ page }) => {
    await page.goto("/explore/tokens")
    await page.waitForTimeout(3000)

    const statsSection = page.getByText(/volume|TVL/i)
    await expect(statsSection.first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Explore Page - Markets tab (legacy alias)", () => {
  test("should redirect /explore/markets to pools view", async ({ page }) => {
    await page.goto("/explore/markets")
    await page.waitForTimeout(3000)

    // Should show pool data or redirect to pools
    const hasPoolContent =
      await page.locator('[data-testid="top-pools-explore-table"]').isVisible().catch(() => false) ||
      await page.getByText(/\w+\/\w+/).first().isVisible().catch(() => false)

    expect(hasPoolContent).toBeTruthy()
  })
})
