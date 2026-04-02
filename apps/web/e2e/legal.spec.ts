import { test, expect } from "@playwright/test"

test.describe("Legal Pages @legal", () => {
  test.describe("/terms", () => {
    test("page loads with content", async ({ page }) => {
      await page.goto("/terms")

      // Title should reflect Terms of Service
      await expect(page).toHaveTitle(/Terms/)

      // Main heading visible
      await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible()

      // Has last-updated date
      await expect(page.getByText("Last Updated")).toBeVisible()
    })

    test("contains required legal sections", async ({ page }) => {
      await page.goto("/terms")

      // Section 2: Experimental Research Software
      await expect(page.getByText("Experimental Research Software")).toBeVisible()

      // Section 3: Non-Custodial
      await expect(page.getByText("Non-Custodial")).toBeVisible()
      await expect(page.getByText(/never have access/i)).toBeVisible()

      // Section 8: AS IS disclaimer
      await expect(page.getByText(/AS IS/)).toBeVisible()

      // Section 9: Limitation of Liability
      await expect(page.getByText("Limitation of Liability")).toBeVisible()

      // $100 liability cap
      await expect(page.getByText("$100")).toBeVisible()
    })
  })

  test.describe("/privacy", () => {
    test("page loads with content", async ({ page }) => {
      await page.goto("/privacy")

      // Main heading visible
      await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible()

      // Has last-updated date
      await expect(page.getByText("Last Updated")).toBeVisible()
    })

    test("contains required sections", async ({ page }) => {
      await page.goto("/privacy")

      // Section 2: Do NOT Collect
      await expect(page.getByText(/Do NOT Collect/i)).toBeVisible()

      // Private keys mentioned
      await expect(page.getByText(/private keys/i).first()).toBeVisible()

      // Section 6: On-Chain Data
      await expect(page.getByText("On-Chain Data")).toBeVisible()

      // TRM Labs screening disclosure
      await expect(page.getByText("TRM Labs")).toBeVisible()

      // GDPR or EEA rights
      await expect(page.getByText(/GDPR|EEA/).first()).toBeVisible()
    })
  })

  test.describe("accessibility", () => {
    test("both pages are accessible without wallet connection", async ({ page }) => {
      // /terms should load without any connect-wallet gate
      await page.goto("/terms")
      await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible()

      // /privacy should load without any connect-wallet gate
      await page.goto("/privacy")
      await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible()
    })

    test("navigation back to swap works from /terms", async ({ page }) => {
      await page.goto("/terms")

      // Header should still be visible with nav
      const header = page.locator("header")
      await expect(header).toBeVisible()

      // Click Swap nav button to return to swap page
      const swapButton = header.getByRole("button", { name: "Swap" })
      await expect(swapButton).toBeVisible()
      await swapButton.click()

      // Should navigate to swap (home) page - swap widget should be visible
      await expect(page.getByText("You pay")).toBeVisible()
    })
  })
})
