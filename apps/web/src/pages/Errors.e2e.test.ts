import { expect, getTest } from 'playwright/fixtures'
import { USDC_MAINNET } from 'lx/src/constants/tokens'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest()

test.describe(
  'Errors',
  {
    tag: '@team:apps-infra',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-infra' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('insufficient liquidity', async ({ page }) => {
      // Set up route interception BEFORE navigating to block all quote requests
      await page.route(`**/v1/quote*`, async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            errorCode: 'RESOURCE_NOT_FOUND',
            detail: 'No quotes available',
            id: '63363cc1-d474-4584-b386-7c356814b79f',
          }),
        })
      })

      // Also intercept trading API quote endpoint
      await page.route(`**/quote*`, async (route) => {
        if (route.request().url().includes('/v1/quote')) {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({
              errorCode: 'RESOURCE_NOT_FOUND',
              detail: 'No quotes available',
            }),
          })
        } else {
          await route.continue()
        }
      })

      // Use NATIVE instead of ETH for Lux network
      await page.goto(`/swap?inputCurrency=NATIVE&outputCurrency=${USDC_MAINNET.address}`)

      // Fill input amount
      await page.getByTestId(TestID.AmountInputIn).fill('10000')

      // Wait for the UI to process the quote error
      await page.waitForTimeout(3000)

      // Verify the Review button is disabled when there's no valid quote
      const reviewButton = page.getByTestId(TestID.ReviewSwap)
      await expect(reviewButton).toBeVisible({ timeout: 10000 })
      await expect(reviewButton).toBeDisabled({ timeout: 10000 })
    })
  },
)
