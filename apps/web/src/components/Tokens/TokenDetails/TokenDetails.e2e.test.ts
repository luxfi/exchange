/* eslint-disable no-restricted-syntax */
import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

// Use Lux chain native token (WLUX) for testing
const WLUX_ADDRESS = '0x55750d6CA62a041c06a8E28626b10Be6c688f471'

test.describe(
  'Token details',
  {
    tag: '@team:apps-portfolio',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-portfolio' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('should have a single h1 tag on smaller screen size', async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 })
      // Use Lux chain native token
      await page.goto('/explore/tokens/lux/NATIVE')
      await expect(page.locator('h1')).toHaveCount(1)
    })

    test('LUX token should display basic information', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      // Use Lux chain native token
      await page.goto('/explore/tokens/lux/NATIVE')

      // Wait for token name to load
      await expect(page.getByText('Lux').first()).toBeVisible({ timeout: 10000 })

      // Stats section should be visible
      await expect(page.getByTestId('token-details-stats')).toBeVisible()
    })

    test('WLUX token details page should load', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      // Use WLUX token on Lux chain
      await page.goto(`/explore/tokens/lux/${WLUX_ADDRESS}`)

      // Wait for token to load - look for WLUX or the token name
      await expect(page.getByText(/WLUX|Wrapped LUX/i).first()).toBeVisible({ timeout: 10000 })
    })
  },
)
