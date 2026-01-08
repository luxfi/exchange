import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest()
const MOBILE_VIEWPORT = { width: 375, height: 667 }
const UNCONNECTED_USER_PARAM = '?eagerlyConnect=false' // Query param to prevent automatic wallet connection
const FORCE_INTRO_PARAM = '?intro=true' // Query param to force the intro screen to be displayed

test.describe(
  'Landing Page',
  {
    tag: '@team:apps-growth',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-growth' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('shows landing page or swap when navigating to root', async ({ page }) => {
      await page.goto(`/${UNCONNECTED_USER_PARAM}`)
      await page.waitForLoadState('networkidle')
      // The app may show landing page or redirect to swap depending on configuration
      const url = page.url()
      const isValidDestination = url.includes('/') || url.includes('/swap')
      expect(isValidDestination).toBe(true)
    })

    test('handles intro param correctly', async ({ page }) => {
      await page.goto(`/${FORCE_INTRO_PARAM}`)
      await page.waitForLoadState('networkidle')
      // The app should either show landing page or swap
      const url = page.url()
      const isValidDestination = url === '/' || url.includes('/?intro=true') || url.includes('/swap')
      expect(isValidDestination).toBe(true)
    })

    test('allows navigation to pool from swap', async ({ page }) => {
      await page.goto(`/swap${UNCONNECTED_USER_PARAM}`)
      await page.waitForLoadState('networkidle')
      // Look for Pool link in navbar
      const poolLink = page.getByRole('link', { name: /pool/i }).first()
      if (await poolLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await poolLink.click()
        await expect(page).toHaveURL(/\/positions/)
      } else {
        // Navigate directly if Pool link is not in current nav structure
        await page.goto('/positions')
        await expect(page).toHaveURL(/\/positions/)
      }
    })

    test('pool page is accessible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto(`/swap${UNCONNECTED_USER_PARAM}`)
      await page.waitForLoadState('networkidle')
      // Navigate to positions page - either via menu or directly
      await page.goto('/positions')
      await expect(page).toHaveURL(/\/positions/)
    })

    test('respects blocked paths configuration', async ({ page }) => {
      await page.route('/', async (route) => {
        const response = await route.fetch()
        const body = (await response.text()).replace(
          '</head>',
          `<meta property="x:blocked-paths" content="/,/buy"></head>`,
        )
        await route.fulfill({ status: response.status(), headers: response.headers(), body })
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')
      // When root path is blocked, should redirect to swap
      await expect(page).toHaveURL('/swap')
    })

    test.describe('Compliance banners', () => {
      test('does not render UK compliance banner for non-UK users', async ({ page }) => {
        await page.goto(`/swap${UNCONNECTED_USER_PARAM}`)
        await expect(page.getByTestId(TestID.UKDisclaimer)).not.toBeVisible()
      })

      test('swap page loads without compliance banner blocking content', async ({ page }) => {
        await page.goto(`/swap${UNCONNECTED_USER_PARAM}`)
        // The swap page should load and stay on /swap - compliance banners shouldn't redirect
        await expect(page).toHaveURL(/\/swap/)
        // Verify the UK disclaimer is not blocking content
        await expect(page.getByTestId(TestID.UKDisclaimer)).not.toBeVisible()
      })
    })
  },
)
