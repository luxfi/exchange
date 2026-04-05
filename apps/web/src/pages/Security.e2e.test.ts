import { expect, getTest } from '~/playwright/fixtures'

const test = getTest()

test.describe(
  'Security: Porto URL param stripping',
  {
    tag: '@team:apps-infra',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-infra' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('should strip porto.* params from the URL', async ({ page }) => {
      await page.goto('/swap?porto.relayUrl=https://evil.com/relay&porto.foo=bar&chain=mainnet')
      await expect(page).toHaveURL(/\/swap\?chain=mainnet$/)
    })

    test('should strip porto.* params when they are the only params', async ({ page }) => {
      await page.goto('/swap?porto.relayUrl=https://evil.com/relay')
      await expect(page).toHaveURL(/\/swap$/)
    })

    test('should not strip non-porto params', async ({ page }) => {
      await page.goto('/swap?chain=mainnet&slippage=0.5')
      await expect(page).toHaveURL(/\/swap\?chain=mainnet&slippage=0.5/)
    })
  },
)
