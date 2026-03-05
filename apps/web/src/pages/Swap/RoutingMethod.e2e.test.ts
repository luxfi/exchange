/**
 * Routing Method Settings E2E Tests
 *
 * Tests the AMM vs DEX Precompile routing toggle in swap settings.
 * Phase 1 feature: routeVia setting (Auto / Standard AMM / DEX Precompile).
 */
import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest()

test.describe(
  'Routing Method Preference',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
      { type: 'DD_TAGS[feature]', description: 'routing-method' },
    ],
  },
  () => {
    test('should show swap settings button on swap page', async ({ page }) => {
      await page.goto('/swap')
      await page.waitForLoadState('networkidle')

      // Settings gear should be present
      await expect(page.getByTestId(TestID.SwapSettings)).toBeVisible()
    })

    test('should open swap settings and show routing method option', async ({ page }) => {
      await page.goto('/swap')
      await page.waitForLoadState('networkidle')

      // Open settings
      await page.getByTestId(TestID.SwapSettings).click()

      // Look for routing method setting
      // The title comes from i18n: "Routing method"
      await expect(page.getByText('Routing method')).toBeVisible({ timeout: 5000 })
    })

    test('should default to Auto routing method', async ({ page }) => {
      await page.goto('/swap')
      await page.waitForLoadState('networkidle')

      await page.getByTestId(TestID.SwapSettings).click()

      // Auto should be the default displayed value
      await expect(page.getByText('Auto')).toBeVisible()
    })
  },
)
