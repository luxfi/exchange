/**
 * Lux Exchange - Advanced Trading Page E2E Tests
 *
 * Tests the advanced trading terminal at /#/advanced.
 * UI structure tests always run; data-dependent tests skip when subgraph is empty.
 *
 * Usage:
 *   BASE_URL=https://exchange.lux.network npx playwright test e2e/advanced.spec.ts
 *   BASE_URL=http://localhost:3000 npx playwright test e2e/advanced.spec.ts
 */

import { test, expect } from '@playwright/test'

const LOAD_TIMEOUT = 15000

/** Check if visible (non-option) DOM element contains the given text */
async function hasVisibleText(page: import('@playwright/test').Page, text: string | RegExp): Promise<boolean> {
  return page.evaluate(
    ({ text, isRegex }) => {
      const regex = isRegex ? new RegExp(text) : null
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const content = walker.currentNode.textContent || ''
        const matches = regex ? regex.test(content) : content.includes(text as string)
        if (matches) {
          const el = walker.currentNode.parentElement
          if (el && el.tagName !== 'OPTION' && el.offsetParent !== null) return true
        }
      }
      return false
    },
    { text: text instanceof RegExp ? text.source : text, isRegex: text instanceof RegExp },
  )
}

test.describe('Advanced Trading Page @critical', () => {
  let hasSubgraphData = false

  test.beforeEach(async ({ page }) => {
    await page.goto('/#/advanced')
    await page.waitForTimeout(8000)
    // Probe for any subgraph data (pool pairs, dollar values, percentages)
    hasSubgraphData = await hasVisibleText(page, /\w+\/\w+/) || await hasVisibleText(page, /\$\d/)
  })

  // === UI Structure Tests (always pass if page renders) ===

  test('should render three-panel layout', async ({ page }) => {
    await expect(page.getByText('Trades', { exact: true }).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    const canvas = page.locator('canvas')
    await expect(canvas.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText('You pay')).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should display candlestick chart with valid dimensions', async ({ page }) => {
    const canvas = page.locator('canvas')
    await expect(canvas.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    const box = await canvas.first().boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThan(100)
    expect(box!.height).toBeGreaterThan(100)
  })

  test('should display swap widget with token names', async ({ page }) => {
    await expect(page.getByText('You pay')).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText('You receive')).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show Buy/Sell toggle', async ({ page }) => {
    await expect(page.getByText('Buy', { exact: true })).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText('Sell', { exact: true })).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show action button when disconnected or connected', async ({ page }) => {
    const actionBtn = page.locator('text=/Connect wallet|Enter an amount/')
    await expect(actionBtn.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should have no purple buttons or accents', async ({ page }) => {
    const purpleCount = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, [role=button]')
      let count = 0
      elements.forEach((el) => {
        const style = window.getComputedStyle(el)
        const bg = style.backgroundColor
        const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          const [, r, , b] = match.map(Number)
          if (r > 80 && b > 150 && b > r) count++
        }
      })
      return count
    })
    expect(purpleCount).toBe(0)
  })

  // === Data-Dependent Tests (skip when subgraph is empty) ===

  test('should display pool pair in table @critical', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    expect(await hasVisibleText(page, /\w+\/\w+/)).toBeTruthy()
  })

  test('should show live price stats', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    await expect(page.getByText(/price/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText(/tvl/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText(/volume/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show trades with price data', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    await page.waitForTimeout(5000)
    const numericData = page.locator('text=/\\d+\\.\\d+/')
    const count = await numericData.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show pools in bottom panel @critical', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    const poolsTab = page.getByText(/Pools/i).first()
    await expect(poolsTab).toBeVisible({ timeout: LOAD_TIMEOUT })
    await poolsTab.click()
    await page.waitForTimeout(2000)
    const dollarValues = page.locator('text=/\\$[\\d,.]+/')
    const count = await dollarValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show pool table with data', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    expect(await hasVisibleText(page, /\$\d/)).toBeTruthy()
    expect(await hasVisibleText(page, /\d+\.?\d*%/)).toBeTruthy()
  })

  test('should show TVL and pools count in top bar @critical', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    const tvlValue = page.locator('text=/\\$\\d+/')
    await expect(tvlValue.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText(/pools/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show live indicator', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    await expect(page.getByText('Live')).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show History tab with trade columns', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    const historyTab = page.getByText('History')
    await expect(historyTab).toBeVisible({ timeout: LOAD_TIMEOUT })
    await historyTab.click()
    await page.waitForTimeout(2000)
    const addresses = page.locator('text=/0x[a-f0-9]{4}/i')
    const count = await addresses.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show fee values in pool table', async ({ page }) => {
    test.skip(!hasSubgraphData, 'Subgraph has no pool data')
    expect(await hasVisibleText(page, /0\.\d+%/)).toBeTruthy()
  })
})
