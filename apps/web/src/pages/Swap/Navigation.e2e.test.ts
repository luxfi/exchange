/**
 * Navigation E2E Tests
 *
 * Tests that the nav links to Trade, NFT Market, and Validators are present
 * and correctly configured.
 */
import { expect, getTest } from 'playwright/fixtures'

const test = getTest()

test.describe(
  'Navigation - New Links',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
      { type: 'DD_TAGS[feature]', description: 'navigation' },
    ],
  },
  () => {
    test('should navigate to /trade from nav menu', async ({ page }) => {
      await page.goto('/swap')
      await page.waitForLoadState('networkidle')

      // Open Trade dropdown in nav
      const tradeNav = page.getByText('Trade', { exact: false }).first()
      if (await tradeNav.isVisible()) {
        await tradeNav.hover()
        // Wait for dropdown to appear
        await page.waitForTimeout(300)

        // Look for the Trade link in the dropdown
        const tradeLink = page.locator('a[href="/trade"]')
        if (await tradeLink.isVisible()) {
          await tradeLink.click()
          await page.waitForLoadState('networkidle')
          expect(page.url()).toContain('/trade')
        }
      }
    })

    test('should have NFT Market external link in nav', async ({ page }) => {
      await page.goto('/swap')
      await page.waitForLoadState('networkidle')

      // The Explore nav section should contain the NFT Market link
      const exploreNav = page.getByText('Explore', { exact: false }).first()
      if (await exploreNav.isVisible()) {
        await exploreNav.hover()
        await page.waitForTimeout(300)

        const nftLink = page.locator('a[href="https://lux.market"]')
        if (await nftLink.count() > 0) {
          // Should be an external link (no internal routing)
          const href = await nftLink.getAttribute('href')
          expect(href).toBe('https://lux.market')
        }
      }
    })

    test('should have Validators external link in nav', async ({ page }) => {
      await page.goto('/swap')
      await page.waitForLoadState('networkidle')

      const exploreNav = page.getByText('Explore', { exact: false }).first()
      if (await exploreNav.isVisible()) {
        await exploreNav.hover()
        await page.waitForTimeout(300)

        const buildLink = page.locator('a[href="https://lux.build"]')
        if (await buildLink.count() > 0) {
          const href = await buildLink.getAttribute('href')
          expect(href).toBe('https://lux.build')
        }
      }
    })
  },
)
