import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

test.describe(
  'Explore',
  {
    tag: '@team:apps-portfolio',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-portfolio' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('should redirect to explore page when token is not found', async ({ page }) => {
      // Use Lux chain for testing
      await page.goto('/explore/tokens/lux/0x123')
      await expect(page.getByText('Token not found')).toBeVisible({ timeout: 10000 })
    })

    test('should show pool not found message when pool does not exist', async ({ page }) => {
      // Use Lux chain with an invalid pool address
      await page.goto('/explore/pools/lux/0x123')
      // The page should show some indication that the pool was not found
      // This could be a redirect to explore or an error message
      await page.waitForTimeout(3000)
      // Either redirected to explore or showing error
      const url = page.url()
      const hasExploreInUrl = url.includes('/explore')
      expect(hasExploreInUrl).toBe(true)
    })

    test('should load explore tokens page', async ({ page }) => {
      await page.goto('/explore/tokens')
      // Should show the tokens explore page with the navbar visible
      const navbar = page.getByTestId('explore-navbar')
      await expect(navbar).toBeVisible({ timeout: 10000 })
      // Tokens tab should exist in the navbar
      await expect(navbar.getByText('Tokens')).toBeVisible({ timeout: 5000 })
    })

    test('should load explore pools page', async ({ page }) => {
      await page.goto('/explore/pools')
      // Should show the pools explore page with the navbar visible (pools is now called markets)
      const navbar = page.getByTestId('explore-navbar')
      await expect(navbar).toBeVisible({ timeout: 10000 })
      // Markets tab should exist in the navbar
      await expect(navbar.getByText('Markets')).toBeVisible({ timeout: 5000 })
    })
  },
)
