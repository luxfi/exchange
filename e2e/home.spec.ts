import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the header with Lux Exchange branding", async ({
    page,
  }) => {
    // Check header exists
    const header = page.locator("header")
    await expect(header).toBeVisible()

    // Check branding - use more specific locators
    await expect(header.getByText("Lux")).toBeVisible()
    await expect(header.getByText("Exchange")).toBeVisible()
  })

  test("should display navigation links", async ({ page }) => {
    // Navigation links are in header nav - use header-scoped locators
    const header = page.locator("header")
    await expect(header.getByRole("button", { name: "Swap" })).toBeVisible()
    await expect(header.getByRole("button", { name: "Pool" })).toBeVisible()
    await expect(header.getByRole("button", { name: "Tokens" })).toBeVisible()
  })

  test("should display Connect Wallet button", async ({ page }) => {
    const connectButton = page.getByRole("button", { name: "Connect Wallet" })
    await expect(connectButton).toBeVisible()
  })

  test("should have correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Lux Exchange/)
  })

  test("should have dark theme by default", async ({ page }) => {
    const html = page.locator("html")
    await expect(html).toHaveClass(/dark/)
  })
})

test.describe("Swap Widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the swap card", async ({ page }) => {
    const swapCard = page.locator("text=Swap").first()
    await expect(swapCard).toBeVisible()
  })

  test("should display 'You pay' input section", async ({ page }) => {
    await expect(page.getByText("You pay")).toBeVisible()
  })

  test("should display 'You receive' input section", async ({ page }) => {
    await expect(page.getByText("You receive")).toBeVisible()
  })

  test("should display LUX token selector", async ({ page }) => {
    // LUX appears in header branding and token selectors - target swap widget specifically
    const swapWidget = page.locator("main")
    await expect(swapWidget.getByText("LUX").first()).toBeVisible()
  })

  test("should display USDC token selector", async ({ page }) => {
    await expect(page.getByText("USDC")).toBeVisible()
  })

  test("should have swap button", async ({ page }) => {
    // Target the main swap button in the widget (not the nav button)
    const swapButton = page.getByRole("main").getByRole("button", { name: "Swap", exact: true })
    await expect(swapButton).toBeVisible()
  })

  test("should have settings button", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: "Settings" })
    await expect(settingsButton).toBeVisible()
  })

  test("should have swap direction button", async ({ page }) => {
    const swapDirectionButton = page.getByRole("button", {
      name: "Swap tokens",
    })
    await expect(swapDirectionButton).toBeVisible()
  })

  test("should allow entering amount in input field", async ({ page }) => {
    const inputField = page.locator('input[placeholder="0"]').first()
    await inputField.fill("100")
    await expect(inputField).toHaveValue("100")
  })

  test("should only accept numeric input", async ({ page }) => {
    const inputField = page.locator('input[placeholder="0"]').first()
    await inputField.fill("abc")
    await expect(inputField).toHaveValue("")

    await inputField.fill("123.45")
    await expect(inputField).toHaveValue("123.45")
  })

  test("should swap tokens when clicking swap direction button", async ({
    page,
  }) => {
    // Enter amount first
    const inputField = page.locator('input[placeholder="0"]').first()
    await inputField.fill("50")

    // Click swap direction
    const swapDirectionButton = page.getByRole("button", {
      name: "Swap tokens",
    })
    await swapDirectionButton.click()

    // The second input should now have the value
    const outputField = page.locator('input[placeholder="0"]').nth(1)
    await expect(outputField).toHaveValue("50")
  })
})

test.describe("Responsive Design", () => {
  test("should hide navigation on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    // Navigation should be hidden on mobile (has md:flex class)
    const nav = page.locator("nav.hidden.md\\:flex")
    await expect(nav).toBeHidden()
  })

  test("should show navigation on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/")

    const nav = page.locator("nav")
    await expect(nav).toBeVisible()
  })
})

test.describe("Accessibility", () => {
  test("should have proper aria labels", async ({ page }) => {
    await page.goto("/")

    // Settings button should have sr-only label
    const settingsButton = page.getByRole("button", { name: "Settings" })
    await expect(settingsButton).toBeVisible()

    // Swap tokens button should have sr-only label
    const swapTokensButton = page.getByRole("button", { name: "Swap tokens" })
    await expect(swapTokensButton).toBeVisible()
  })

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/")

    // Focus the connect wallet button and verify it's focusable
    const connectButton = page.getByRole("button", { name: "Connect Wallet" })
    await connectButton.focus()
    await expect(connectButton).toBeFocused()
  })
})
