import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest()

// Lux chain WLUX token address
const WLUX_ADDRESS = '0x55750d6CA62a041c06a8E28626b10Be6c688f471'

test.describe(
  'Search',
  {
    tag: '@team:apps-portfolio',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-portfolio' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('search input should be clickable and expand', async ({ page }) => {
      // Navigate to explore page where search bar is visible
      await page.goto('/explore')
      await expect(page.getByTestId('explore-navbar')).toBeVisible({ timeout: 10000 })

      // Use keyboard shortcut to open search modal (works on all viewports)
      await page.keyboard.press('/')

      // Search modal should open
      await expect(page.getByTestId(TestID.ExploreSearchInput)).toBeVisible({ timeout: 5000 })
    })

    test('should be able to search for tokens', async ({ page }) => {
      // Navigate to explore page where search bar is visible
      await page.goto('/explore')
      await expect(page.getByTestId('explore-navbar')).toBeVisible({ timeout: 10000 })

      // Use keyboard shortcut to open search modal
      await page.keyboard.press('/')
      await expect(page.getByTestId(TestID.ExploreSearchInput)).toBeVisible({ timeout: 5000 })
      await page.getByTestId(TestID.ExploreSearchInput).fill('LUX')

      // The search input should have the value
      await expect(page.getByTestId(TestID.ExploreSearchInput)).toHaveValue('LUX')
    })

    test('should navigate directly to token page via URL', async ({ page }) => {
      // Navigate directly to the WLUX token page
      await page.goto(`/explore/tokens/lux/${WLUX_ADDRESS}`)

      // Should load the token details page
      await expect(page.getByText(/WLUX|Wrapped LUX/i).first()).toBeVisible({ timeout: 10000 })
    })
  },
)
