/**
 * Lux Exchange - Advanced Trading Page E2E Tests
 *
 * Tests the advanced trading terminal at /#/advanced with real V3 subgraph data.
 * These are critical path tests that gate deployment.
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
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/advanced')
    // Wait for subgraph data to load
    await page.waitForTimeout(8000)
  })

  test('should render three-panel layout', async ({ page }) => {
    // Left panel with trades
    await expect(page.getByText('TRADES')).toBeVisible({ timeout: LOAD_TIMEOUT })
    // Center with chart (canvas element from lightweight-charts)
    const canvas = page.locator('canvas')
    await expect(canvas.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    // Right panel with swap widget
    await expect(page.getByText('You pay')).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should display pool pair in table @critical', async ({ page }) => {
    // Pool table has pair names like "LUX/LZOO" in visible span elements
    expect(await hasVisibleText(page, 'LUX/LZOO')).toBeTruthy()
  })

  test('should show live price stats', async ({ page }) => {
    await expect(page.getByText(/price/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText(/tvl/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText(/volume/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should display candlestick chart with valid dimensions', async ({ page }) => {
    const canvas = page.locator('canvas')
    await expect(canvas.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    const box = await canvas.first().boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThan(100)
    expect(box!.height).toBeGreaterThan(100)
  })

  test('should show trades with price data', async ({ page }) => {
    await page.waitForTimeout(5000)
    const tradeData = page.locator('text=/0\\.\\d{4,}/')
    const count = await tradeData.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display swap widget with token names', async ({ page }) => {
    await expect(page.getByText('You pay')).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText('You receive')).toBeVisible({ timeout: LOAD_TIMEOUT })
    // WLUX and LZOO visible somewhere in the swap widget (div elements, not buttons)
    expect(await hasVisibleText(page, 'WLUX')).toBeTruthy()
    expect(await hasVisibleText(page, 'LZOO')).toBeTruthy()
  })

  test('should show Buy/Sell toggle', async ({ page }) => {
    await expect(page.getByText('Buy', { exact: true })).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText('Sell', { exact: true })).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show action button when disconnected or connected', async ({ page }) => {
    const actionBtn = page.locator('text=/Connect wallet|Enter an amount/')
    await expect(actionBtn.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show pools in bottom panel @critical', async ({ page }) => {
    const poolsTab = page.getByText(/Pools \(\d+\)/)
    await expect(poolsTab).toBeVisible({ timeout: LOAD_TIMEOUT })
    await poolsTab.click()
    await page.waitForTimeout(2000)
    const dollarValues = page.locator('text=/\\$[\\d,.]+/')
    const count = await dollarValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show pool table with data', async ({ page }) => {
    // Pool table has dollar TVL values and fee percentages (in span elements)
    expect(await hasVisibleText(page, /\$\d/)).toBeTruthy()
    expect(await hasVisibleText(page, /0\.\d+%/)).toBeTruthy()
  })

  test('should show TVL and pools count in top bar @critical', async ({ page }) => {
    const tvlValue = page.locator('text=/\\$\\d+/')
    await expect(tvlValue.first()).toBeVisible({ timeout: LOAD_TIMEOUT })
    await expect(page.getByText(/pools/i).first()).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show live indicator', async ({ page }) => {
    await expect(page.getByText('Live')).toBeVisible({ timeout: LOAD_TIMEOUT })
  })

  test('should show History tab with trade columns', async ({ page }) => {
    const historyTab = page.getByText('History')
    await expect(historyTab).toBeVisible({ timeout: LOAD_TIMEOUT })
    await historyTab.click()
    await page.waitForTimeout(2000)
    const addresses = page.locator('text=/0x[a-f0-9]{4}/i')
    const count = await addresses.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show fee values in pool table', async ({ page }) => {
    // Fee percentages visible in span elements (not hidden options)
    expect(await hasVisibleText(page, /0\.\d+%/)).toBeTruthy()
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
})
