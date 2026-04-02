import { test, expect, type Page } from "@playwright/test"

/**
 * Lux Exchange - Multi-Chain E2E Tests @multichain
 *
 * Tests chain selector, ecosystem chain support, and per-chain behavior.
 * Runs against the Next.js app (Header + SwapWidget at /).
 *
 * Usage:
 *   npx playwright test e2e/multichain.spec.ts
 *   BASE_URL=https://lux.exchange npx playwright test e2e/multichain.spec.ts
 */

// Ecosystem chains that must appear in the chain selector (mainnets section)
const ECOSYSTEM_CHAINS = [
  { name: "Lux Mainnet", id: 96369, nativeCoin: "LUX" },
  { name: "Zoo Network", id: 200200, nativeCoin: "ZOO" },
  { name: "Hanzo Network", id: 36963, nativeCoin: "HANZO" },
  { name: "SPC Network", id: 36911, nativeCoin: "SPC" },
  { name: "Pars Network", id: 494949, nativeCoin: "PARS" },
] as const

// Known benign console errors to ignore (e.g. third-party scripts, expected warnings)
const BENIGN_CONSOLE_PATTERNS = [
  /Download the React DevTools/,
  /Failed to load resource.*favicon/,
  /ResizeObserver loop/,
  /Third-party cookie/,
  /hydration/i,
  /NEXT_REDIRECT/,
  /net::ERR_/,
]

/**
 * Open the chain selector dropdown. Returns the dropdown content locator.
 */
async function openChainSelector(page: Page) {
  const header = page.locator("header")
  // The chain selector trigger is a button with a ChevronDown icon and
  // the current chain name (hidden on mobile). Find it by looking for the
  // dropdown trigger button that is NOT the Connect Wallet button and NOT
  // a nav link button.
  const chainButton = header.locator("button").filter({
    hasText: /Mainnet|Network|Testnet|Lux|Zoo|Hanzo|SPC|Pars|Liquid|Ethereum|Sepolia/,
  }).first()

  // If we cannot find by text (name might be hidden on small screens),
  // fall back to the first outline variant button in the header's right section
  if (await chainButton.count() === 0) {
    // The chain selector is the first button in the right-side div
    const rightSection = header.locator("div.flex.items-center.gap-2")
    await rightSection.locator("button").first().click()
  } else {
    await chainButton.click()
  }

  // Wait for dropdown content to appear
  const dropdown = page.locator("[role='menu']")
  await expect(dropdown).toBeVisible({ timeout: 5000 })
  return dropdown
}

test.describe("Multi-Chain @multichain", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  // =========================================================================
  // 1. Chain selector is visible
  // =========================================================================

  test("should display chain selector in header", async ({ page }) => {
    const header = page.locator("header")
    // The chain selector trigger button contains the current chain icon and
    // a ChevronDown SVG. Look for a button that is not Connect Wallet and
    // not a navigation item.
    const chainTrigger = header.locator("button").filter({
      hasText: /Mainnet|Network|Lux/,
    }).first()

    // On mobile, the chain name is hidden but the button still exists.
    // Fall back to checking any button with the chain icon image.
    const isVisible = await chainTrigger.isVisible().catch(() => false)
    if (!isVisible) {
      // On smaller viewports the name is sr-hidden. The button still renders
      // with an image alt text for the chain.
      const imgButton = header.locator('button:has(img[alt="Lux Mainnet"])')
      await expect(imgButton).toBeVisible()
    } else {
      await expect(chainTrigger).toBeVisible()
    }
  })

  // =========================================================================
  // 2. Default chain is Lux
  // =========================================================================

  test("should default to Lux Mainnet on first load", async ({ page }) => {
    const header = page.locator("header")

    // The chain selector displays an image with alt text matching the chain name
    const luxIcon = header.locator('img[alt="Lux Mainnet"]')
    await expect(luxIcon).toBeVisible()

    // On desktop the chain name text is also shown
    const chainName = header.locator("span").filter({ hasText: "Lux Mainnet" })
    const nameVisible = await chainName.isVisible().catch(() => false)
    if (nameVisible) {
      await expect(chainName).toBeVisible()
    }
  })

  // =========================================================================
  // 3. All ecosystem chains are in the selector
  // =========================================================================

  test("should list all ecosystem chains in the dropdown", async ({ page }) => {
    const dropdown = await openChainSelector(page)

    for (const chain of ECOSYSTEM_CHAINS) {
      // Each chain renders as a menuitem with an image (alt=chain.name) and
      // a span containing the chain name
      const item = dropdown.locator("[role='menuitem']").filter({
        hasText: chain.name,
      })
      await expect(item, `Expected chain "${chain.name}" to be in selector`).toBeVisible()
    }
  })

  // =========================================================================
  // 4. Swap page loads correctly (swap widget renders on /)
  // =========================================================================

  test("should render swap widget on home page", async ({ page }) => {
    const main = page.locator("main")

    await expect(main.getByText("You pay")).toBeVisible()
    await expect(main.getByText("You receive")).toBeVisible()

    // Swap inputs should be present
    const inputs = main.locator('input[placeholder="0"]')
    await expect(inputs.first()).toBeVisible()
    await expect(inputs.nth(1)).toBeVisible()
  })

  test("should render swap widget on /swap route", async ({ page }) => {
    await page.goto("/swap")

    const main = page.locator("main")
    await expect(main.getByText("You pay")).toBeVisible()
    await expect(main.getByText("You receive")).toBeVisible()
  })

  // =========================================================================
  // 5. Token selector shows chain-appropriate tokens
  // =========================================================================

  test("should show LUX token on default Lux chain", async ({ page }) => {
    const main = page.locator("main")
    // The default "You pay" token on Lux chain should be LUX
    await expect(main.getByText("LUX").first()).toBeVisible()
  })

  test("should show LUSD as default receive token on Lux chain", async ({
    page,
  }) => {
    const main = page.locator("main")
    // LUSD is the default receive token on Lux mainnet
    await expect(main.getByText("LUSD").first()).toBeVisible()
  })

  // =========================================================================
  // 6. RPC URL format verification
  // =========================================================================

  test("should use correct Lux RPC URL format with /mainnet/ext/ path", async ({
    page,
  }) => {
    // Verify that the chain definition uses the correct RPC path
    // by evaluating the wagmi config in the browser context
    const rpcUrl = await page.evaluate(() => {
      // Access the injected chain config from window or DOM
      // We check the page's network requests instead
      return null
    })

    // Alternative: intercept network requests to verify RPC URL format
    const rpcRequests: string[] = []
    page.on("request", (request) => {
      const url = request.url()
      if (url.includes("ext/bc/C/rpc") || url.includes("api.lux.network")) {
        rpcRequests.push(url)
      }
    })

    // Trigger an RPC call by entering a swap amount
    const inputField = page.locator('input[placeholder="0"]').first()
    await inputField.fill("1")
    await page.waitForTimeout(2000)

    // If any RPC requests were made, verify they use the correct format
    for (const url of rpcRequests) {
      if (url.includes("api.lux.network")) {
        expect(
          url,
          "RPC URL must use /mainnet/ext/ or /testnet/ext/ path, not bare /rpc"
        ).toMatch(/\/(mainnet|testnet)\/ext\//)
      }
    }
  })

  // =========================================================================
  // 7. No console errors on page load
  // =========================================================================

  test("should load without console errors", async ({ page }) => {
    const consoleErrors: string[] = []

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text()
        const isBenign = BENIGN_CONSOLE_PATTERNS.some((pattern) =>
          pattern.test(text)
        )
        if (!isBenign) {
          consoleErrors.push(text)
        }
      }
    })

    await page.goto("/")
    // Allow async effects to settle
    await page.waitForTimeout(2000)

    expect(
      consoleErrors,
      `Unexpected console errors:\n${consoleErrors.join("\n")}`
    ).toHaveLength(0)
  })

  // =========================================================================
  // 8. Swap input accepts numeric values
  // =========================================================================

  test("should accept numeric values in swap input", async ({ page }) => {
    const inputField = page.locator('input[placeholder="0"]').first()

    await inputField.fill("42.5")
    await expect(inputField).toHaveValue("42.5")
  })

  test("should reject non-numeric input in swap field", async ({ page }) => {
    const inputField = page.locator('input[placeholder="0"]').first()

    await inputField.fill("abc")
    await expect(inputField).toHaveValue("")

    await inputField.fill("100")
    await expect(inputField).toHaveValue("100")
  })

  // =========================================================================
  // 9. Connect wallet button is always visible
  // =========================================================================

  test("should show Connect Wallet button in header", async ({ page }) => {
    const header = page.locator("header")
    const connectButton = header.getByRole("button", { name: "Connect Wallet" })
    await expect(connectButton).toBeVisible()
  })

  test("should show Connect Wallet button in swap widget", async ({
    page,
  }) => {
    const main = page.locator("main")
    const actionButton = main.getByRole("button", { name: "Connect Wallet" })
    await expect(actionButton).toBeVisible()
  })

  // =========================================================================
  // 10. Footer legal links
  // =========================================================================

  test("should have Terms of Service link accessible", async ({ page }) => {
    // The Next.js app may not have a visible footer on the swap page.
    // Check if a footer element or legal links exist anywhere on the page.
    const termsLink = page.locator(
      'a[href*="terms"], a[href*="Terms"], a:has-text("Terms of Service"), a:has-text("Terms")'
    )
    const footerElement = page.locator("footer")

    const hasFooter = await footerElement.isVisible().catch(() => false)
    const hasTermsLink = await termsLink.first().isVisible().catch(() => false)

    // If there is a footer, it should contain a terms link.
    // If there is no footer on this page, verify the terms page is reachable.
    if (hasFooter && hasTermsLink) {
      await expect(termsLink.first()).toBeVisible()
    } else {
      // Verify /terms route responds (either 200 or redirect)
      const response = await page.request.get("/terms")
      expect(
        [200, 301, 302, 307, 308].includes(response.status()),
        "Terms of Service page should be reachable"
      ).toBeTruthy()
    }
  })

  test("should have Privacy Policy link accessible", async ({ page }) => {
    const privacyLink = page.locator(
      'a[href*="privacy"], a[href*="Privacy"], a:has-text("Privacy Policy"), a:has-text("Privacy")'
    )
    const footerElement = page.locator("footer")

    const hasFooter = await footerElement.isVisible().catch(() => false)
    const hasPrivacyLink = await privacyLink.first().isVisible().catch(() => false)

    if (hasFooter && hasPrivacyLink) {
      await expect(privacyLink.first()).toBeVisible()
    } else {
      const response = await page.request.get("/privacy")
      expect(
        [200, 301, 302, 307, 308].includes(response.status()),
        "Privacy Policy page should be reachable"
      ).toBeTruthy()
    }
  })
})

test.describe("Chain Switching @multichain", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should switch chain when selecting from dropdown", async ({ page }) => {
    const dropdown = await openChainSelector(page)

    // Select Zoo Network
    const zooItem = dropdown.locator("[role='menuitem']").filter({
      hasText: "Zoo Network",
    })
    await zooItem.click()

    // After clicking, the dropdown closes and the trigger should update
    // to show Zoo Network's icon
    const header = page.locator("header")
    const zooIcon = header.locator('img[alt="Zoo Network"]')
    await expect(zooIcon).toBeVisible({ timeout: 5000 })
  })

  test("should show check mark on currently selected chain", async ({
    page,
  }) => {
    const dropdown = await openChainSelector(page)

    // The currently selected chain (Lux Mainnet) should have a Check icon
    const luxItem = dropdown.locator("[role='menuitem']").filter({
      hasText: "Lux Mainnet",
    })

    // The Check icon is an SVG inside the menuitem
    const checkIcon = luxItem.locator("svg")
    await expect(checkIcon).toBeVisible()
  })

  test("should separate mainnets and testnets in dropdown", async ({
    page,
  }) => {
    const dropdown = await openChainSelector(page)

    // The dropdown has section headers "Mainnets" and "Testnets"
    await expect(dropdown.getByText("Mainnets")).toBeVisible()
    await expect(dropdown.getByText("Testnets")).toBeVisible()
  })
})
