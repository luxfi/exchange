import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

test.describe(
  'User onboarding',
  {
    tag: '@team:apps-growth',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-growth' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('navigation to swap works for new users', async ({ page }) => {
      await page.goto('/swap?eagerlyConnect=false')
      // Page should load and stay on swap
      await expect(page).toHaveURL(/\/swap/)
    })

    test('swap page loads for disconnected users', async ({ page }) => {
      await page.goto('/swap?eagerlyConnect=false')
      // Page should load without errors
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL(/\/swap/)
    })
  },
)
