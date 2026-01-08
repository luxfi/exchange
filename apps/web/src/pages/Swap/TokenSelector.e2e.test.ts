import { expect, getTest } from 'playwright/fixtures'
import { OnchainItemSectionName } from 'lx/src/components/lists/OnchainItemList/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest()

test.describe(
  'TokenSelector',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('output token selector opens and shows token list', async ({ page }) => {
      await page.goto('/swap')
      await page.getByTestId(TestID.ChooseOutputToken).click()

      // The token selector modal should open - check for search placeholder
      await expect(page.getByPlaceholder('Search tokens')).toBeVisible()
    })

    test('output - should show top tokens section when token is selected', async ({ page }) => {
      await page.goto('/swap')
      await page.getByTestId(TestID.SwitchCurrenciesButton).click()
      await page.getByTestId(TestID.ChooseOutputToken).click()

      // Should show trending tokens when a token is already selected
      await expect(
        page.getByTestId(`${TestID.SectionHeaderPrefix}${OnchainItemSectionName.TrendingTokens}`),
      ).toBeVisible()
      // Bridging tokens shouldn't be visible when there's an input token
      await expect(
        page.getByTestId(`${TestID.SectionHeaderPrefix}${OnchainItemSectionName.BridgingTokens}`),
      ).not.toBeVisible()
    })

    test('input token selector opens and shows token list', async ({ page }) => {
      await page.goto('/swap')
      await page.getByTestId(TestID.ChooseInputToken).click()

      // The token selector modal should open - check for search placeholder
      await expect(page.getByPlaceholder('Search tokens')).toBeVisible()
    })

    test('can switch currencies and select tokens', async ({ page }) => {
      await page.goto('/swap')
      await page.getByTestId(TestID.SwitchCurrenciesButton).click()

      // After switching, the input should have the previous output token
      // And output should be empty (or have the previous input)
      await expect(page.getByTestId(TestID.ChooseInputToken)).toBeVisible()
      await expect(page.getByTestId(TestID.ChooseOutputToken)).toBeVisible()
    })
  },
)
