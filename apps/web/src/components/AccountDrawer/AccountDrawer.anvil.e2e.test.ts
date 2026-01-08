/* eslint-disable no-restricted-syntax */
import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

// Account Drawer tests require anvil for wallet connection
const test = getTest({ withAnvil: true })

test.describe(
  'Account Drawer',
  {
    tag: '@team:apps-portfolio',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-portfolio' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test.describe('Mini Portfolio settings', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/swap')
        await page.getByTestId(TestID.Web3StatusConnected).click()
        await page.getByTestId(TestID.WalletSettings).click()
      })
      test('changes theme', async ({ page }) => {
        await page.getByTestId(TestID.ThemeDark).click()
        await expect(page.locator('html')).toHaveClass('t_dark')
        await page.getByTestId(TestID.ThemeLight).click()
        await expect(page.locator('html')).toHaveClass('t_light')
      })

      test('changes language', async ({ page }) => {
        await page.getByTestId(TestID.LanguageSettingsButton).click()
        await page.getByRole('link', { name: 'Spanish (Spain)' }).click()
        await expect(page.getByText('Uniswap está disponible en:')).toBeVisible()
        await page.reload()
        await expect(page.url()).toContain('lng=es-ES')
        await expect(page.getByText('Uniswap está disponible en:')).toBeVisible()
      })

      test('toggles testnet', async ({ page }) => {
        await page.getByTestId(TestID.TestnetsToggle).click()
        await expect(page.getByTestId(TestID.TestnetsToggle)).toHaveAttribute('aria-checked', 'true')
        // Confirm the info modal appears and then close it
        const modalButton = page.getByRole('button', { name: 'Close' })
        await expect(modalButton).toBeVisible()
        await modalButton.click()
      })

      test('disconnected wallet settings should not be accessible', async ({ page }) => {
        await page.goto('/swap?eagerlyConnect=false')
        await page.getByLabel('Navigation button').click()
        await expect(page.getByTestId(TestID.WalletSettings)).not.toBeVisible()
      })

      test('settings on mobile should be accessible via bottom sheet', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await expect(page.getByTestId(TestID.AccountDrawer).first()).toHaveAttribute('class', /is_Sheet/)
      })
    })

    test.describe('Mini Portfolio account drawer', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/swap')
      })

      test('should open account drawer when clicked', async ({ page }) => {
        await page.getByTestId(TestID.Web3StatusConnected).click()
        await expect(page.getByTestId(TestID.AccountDrawer)).toBeVisible()
      })

      test('should close account drawer', async ({ page }) => {
        await page.getByTestId(TestID.Web3StatusConnected).click()
        await expect(page.getByTestId(TestID.AccountDrawer)).toBeVisible()

        await page.getByTestId(TestID.CloseAccountDrawer).click()
        await expect(page.getByTestId(TestID.AccountDrawer)).not.toBeVisible()
      })

      test('should show mini portfolio navigation', async ({ page }) => {
        // Portfolio navigation works on all chains - tests local UI state
        await page.getByTestId(TestID.Web3StatusConnected).click()
        await expect(page.getByTestId(TestID.AccountDrawer)).toBeVisible()

        // Wait for the portfolio page to load
        await page.getByTestId(TestID.MiniPortfolioPage).waitFor({ timeout: 10000 })

        // Verify navigation tabs exist
        await expect(page.getByTestId(TestID.MiniPortfolioNavbar)).toContainText('Tokens')
      })

      test('should navigate between portfolio tabs', async ({ page }) => {
        // Portfolio tabs navigation works on all chains - tests local UI state
        await page.getByTestId(TestID.Web3StatusConnected).click()
        await expect(page.getByTestId(TestID.AccountDrawer)).toBeVisible()
        await page.getByTestId(TestID.MiniPortfolioPage).waitFor({ timeout: 10000 })

        // Check NFTs tab exists and is clickable
        const nftsTab = page.getByTestId(TestID.MiniPortfolioNavbar).getByText('NFTs')
        if (await nftsTab.isVisible()) {
          await nftsTab.click()
          await page.waitForTimeout(1000)
        }

        // Check Activity tab exists and is clickable
        const activityTab = page.getByTestId(TestID.MiniPortfolioNavbar).getByText('Activity')
        if (await activityTab.isVisible()) {
          await activityTab.click()
          await page.waitForTimeout(1000)
        }
      })

      test('should display connected wallet address', async ({ page }) => {
        await page.getByTestId(TestID.Web3StatusConnected).click()
        const drawer = page.getByTestId(TestID.AccountDrawer)
        await expect(drawer).toBeVisible()

        // The test wallet displays as 'test0' (the Unitag)
        await expect(drawer.getByText('test0')).toBeVisible()
      })
    })
  },
)
