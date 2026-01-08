/* eslint-disable no-restricted-syntax */
import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest()

// Lux chain tokens
const WLUX_ADDRESS = '0x55750d6CA62a041c06a8E28626b10Be6c688f471'

const INPUT_TOKEN_LABEL = `${TestID.ChooseInputToken}-label`
const OUTPUT_TOKEN_LABEL = `${TestID.ChooseOutputToken}-label`

test.describe(
  'TokenDetailsSwap',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test.beforeEach(async ({ page }) => {
      // On mobile widths, we just link back to /swap instead of rendering the swap component.
      await page.setViewportSize({ width: 1200, height: 800 })

      // Use Lux chain with WLUX token
      await page.goto(`/explore/tokens/lux/${WLUX_ADDRESS}`)

      // Wait for swap components to be rendered and ready
      await page.getByTestId(INPUT_TOKEN_LABEL).waitFor({ state: 'visible', timeout: 10000 })
      await page.getByTestId(OUTPUT_TOKEN_LABEL).waitFor({ state: 'visible', timeout: 10000 })
    })

    test('should have the expected output for a tokens detail page', async ({ page }) => {
      // On Lux chain, the input should be native LUX and output should be WLUX
      await expect(page.getByTestId(INPUT_TOKEN_LABEL)).toContainText('LUX')
      await expect(page.getByTestId(TestID.AmountInputOut)).toHaveValue('')
      await expect(page.getByTestId(OUTPUT_TOKEN_LABEL)).toContainText('WLUX')
    })

    test('should handle swap input amounts', async ({ page }) => {
      await page.getByTestId(TestID.AmountInputIn).clear()
      await page.getByTestId(TestID.AmountInputIn).fill('0.001')
      await expect(page.getByTestId(TestID.AmountInputIn)).toHaveValue('0.001')

      await page.getByTestId(TestID.AmountInputIn).clear()
      await page.getByTestId(TestID.AmountInputIn).fill('0.0')
      await expect(page.getByTestId(TestID.AmountInputIn)).toHaveValue('0.0')

      await page.getByTestId(TestID.AmountInputIn).clear()
      await page.getByTestId(TestID.AmountInputIn).fill('\\')
      await expect(page.getByTestId(TestID.AmountInputIn)).toHaveValue('')
    })

    test('should handle swap output amounts', async ({ page }) => {
      await page.getByTestId(TestID.AmountInputOut).clear()
      await page.getByTestId(TestID.AmountInputOut).fill('0.001')
      await expect(page.getByTestId(TestID.AmountInputOut)).toHaveValue('0.001')

      await page.getByTestId(TestID.AmountInputOut).clear()
      await page.getByTestId(TestID.AmountInputOut).fill('0.0')
      await expect(page.getByTestId(TestID.AmountInputOut)).toHaveValue('0.0')
    })

    test('should not share swap state with the main swap page', async ({ page }) => {
      await expect(page.getByTestId(OUTPUT_TOKEN_LABEL)).toContainText('WLUX')
      await page.goto('/swap')

      // Verify WLUX is not on the main swap page output
      await expect(page.getByTestId(OUTPUT_TOKEN_LABEL)).not.toContainText('WLUX')
    })
  },
)
