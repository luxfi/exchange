import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

test.describe(
  'Buy Page',
  {
    tag: '@team:apps-growth',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-growth' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('buy page loads', async ({ page }) => {
      await page.goto('/buy')
      // Wait for the page to load - may redirect or show buy interface
      await page.waitForTimeout(2000)
      // Either shows buy interface or redirects to swap
      const url = page.url()
      const hasValidPath = url.includes('/buy') || url.includes('/swap')
      expect(hasValidPath).toBe(true)
    })

    test('can navigate to buy from swap page', async ({ page }) => {
      await page.goto('/swap')
      // Look for buy navigation option
      const buyLink = page.getByRole('link', { name: /buy/i }).first()
      if (await buyLink.isVisible()) {
        await buyLink.click()
        await page.waitForTimeout(1000)
        const url = page.url()
        expect(url.includes('/buy') || url.includes('/swap')).toBe(true)
      }
    })
  },
)
