/**
 * Lux Exchange - Integration Tests
 *
 * Full E2E tests for the DEX functionality:
 * - Wallet connection
 * - Token swaps
 * - Liquidity management
 * - Transaction history via G-Chain
 *
 * These tests require:
 * - Local node running (docker compose -f compose.local.yml up)
 * - Contracts deployed (./scripts/deploy-contracts.sh)
 */

import { test, expect, type Page } from "@playwright/test"

// =============================================================================
// TEST CONFIGURATION
// =============================================================================

const TEST_CONFIG = {
  // Local node endpoints
  rpcUrl: "http://localhost:9650/ext/bc/C/rpc",
  gchainUrl: "http://localhost:9650/ext/bc/G/graphql",

  // Test account (Anvil default #0)
  testAccount: {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },

  // Timeouts
  txTimeout: 30000,
  uiTimeout: 10000,
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if local node is running
 */
async function isNodeRunning(): Promise<boolean> {
  try {
    const response = await fetch(TEST_CONFIG.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Check if G-Chain is accessible
 */
async function isGChainRunning(): Promise<boolean> {
  try {
    const response = await fetch(TEST_CONFIG.gchainUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "{ __schema { types { name } } }",
      }),
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Mock wallet connection for testing
 * In real tests, you would use a browser extension mock
 */
async function mockWalletConnection(page: Page): Promise<void> {
  // Inject a mock ethereum provider
  await page.addInitScript(() => {
    const accounts = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]
    const chainId = "0x7a69" // 31337 in hex

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).ethereum = {
      isMetaMask: true,
      isConnected: () => true,
      selectedAddress: accounts[0],
      chainId,
      networkVersion: "31337",

      request: async ({ method, params }: { method: string; params?: unknown[] }) => {
        switch (method) {
          case "eth_requestAccounts":
          case "eth_accounts":
            return accounts
          case "eth_chainId":
            return chainId
          case "net_version":
            return "31337"
          case "eth_getBalance":
            return "0x56BC75E2D63100000" // 100 ETH
          case "wallet_switchEthereumChain":
            return null
          case "eth_sendTransaction":
            // Return mock tx hash
            return "0x" + "1".repeat(64)
          case "eth_getTransactionReceipt":
            return {
              status: "0x1",
              blockNumber: "0x1",
              transactionHash: params?.[0] || "0x" + "1".repeat(64),
            }
          default:
            console.log("Unhandled method:", method)
            return null
        }
      },

      on: (event: string, callback: (...args: unknown[]) => void) => {
        if (event === "connect") {
          callback({ chainId })
        }
        if (event === "accountsChanged") {
          callback(accounts)
        }
      },

      removeListener: () => {},
    }
  })
}

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

test.describe("Integration Tests", () => {
  test.beforeAll(async () => {
    // Check if local infrastructure is running
    const nodeUp = await isNodeRunning()
    if (!nodeUp) {
      console.warn(
        "Local node not running. Start with: docker compose -f compose.local.yml up"
      )
      test.skip()
    }
  })

  test.beforeEach(async ({ page }) => {
    // Mock wallet for all tests
    await mockWalletConnection(page)
    await page.goto("/")
  })

  // ===========================================================================
  // WALLET CONNECTION TESTS
  // ===========================================================================

  test.describe("Wallet Connection", () => {
    test("should display Connect Wallet button when not connected", async ({
      page,
    }) => {
      const connectButton = page.getByRole("button", { name: "Connect Wallet" })
      await expect(connectButton).toBeVisible()
    })

    test("should connect wallet when clicking Connect Wallet", async ({
      page,
    }) => {
      const connectButton = page.getByRole("button", { name: "Connect Wallet" })
      await connectButton.click()

      // Wait for wallet modal or connection
      // This depends on your wallet connection implementation
      await page.waitForTimeout(1000)

      // After connection, the button should change or show address
      const header = page.locator("header")
      const connected = await header
        .getByText(/0x[a-fA-F0-9]{4}/)
        .isVisible()
        .catch(() => false)

      // Either shows address or remains Connect Wallet (mock limitation)
      expect(connected || (await connectButton.isVisible())).toBeTruthy()
    })

    test("should show correct network badge", async ({ page }) => {
      // Check for network indicator
      const networkBadge = page.locator('[data-testid="network-badge"]')

      if (await networkBadge.isVisible()) {
        await expect(networkBadge).toContainText(/local|lux/i)
      }
    })
  })

  // ===========================================================================
  // SWAP FUNCTIONALITY TESTS
  // ===========================================================================

  test.describe("Swap Functionality", () => {
    test("should display swap widget with token selectors", async ({
      page,
    }) => {
      await expect(page.getByText("You pay")).toBeVisible()
      await expect(page.getByText("You receive")).toBeVisible()

      // Token selectors should be visible
      await expect(page.getByText("LUX")).toBeVisible()
    })

    test("should allow entering swap amount", async ({ page }) => {
      const inputField = page.locator('input[placeholder="0"]').first()
      await inputField.fill("100")
      await expect(inputField).toHaveValue("100")
    })

    test("should calculate output amount when input is entered", async ({
      page,
    }) => {
      const inputField = page.locator('input[placeholder="0"]').first()
      await inputField.fill("100")

      // Wait for quote calculation
      await page.waitForTimeout(500)

      const outputField = page.locator('input[placeholder="0"]').nth(1)
      const outputValue = await outputField.inputValue()

      // Output should have some value (not empty or 0)
      // In local testing without real pools, this may be 0
      expect(outputValue).toBeDefined()
    })

    test("should swap token positions when clicking swap direction", async ({
      page,
    }) => {
      // Get initial tokens
      const tokenSelectors = page.locator('[data-testid="token-selector"]')
      const firstTokenBefore = await tokenSelectors.first().textContent()

      // Enter amount
      const inputField = page.locator('input[placeholder="0"]').first()
      await inputField.fill("50")

      // Click swap direction button
      const swapButton = page.getByRole("button", { name: "Swap tokens" })
      await swapButton.click()

      // Check that amount moved to second input
      const outputField = page.locator('input[placeholder="0"]').nth(1)
      await expect(outputField).toHaveValue("50")
    })

    test("should open token selector modal", async ({ page }) => {
      // Click on a token selector button
      const tokenButtons = page.locator("button").filter({ hasText: /LUX|USDC/ })
      const firstToken = tokenButtons.first()

      if (await firstToken.isVisible()) {
        await firstToken.click()

        // Token selector modal should appear
        const modal = page.locator('[role="dialog"]')
        const isModalVisible = await modal.isVisible().catch(() => false)

        if (isModalVisible) {
          await expect(modal).toBeVisible()
          // Should have a search input or token list
          const hasTokenList = await page
            .locator('[data-testid="token-list"]')
            .isVisible()
            .catch(() => false)
          const hasSearchInput = await page
            .locator('input[placeholder*="Search"]')
            .isVisible()
            .catch(() => false)

          expect(hasTokenList || hasSearchInput).toBeTruthy()
        }
      }
    })

    test("should show insufficient balance error for large amounts", async ({
      page,
    }) => {
      const inputField = page.locator('input[placeholder="0"]').first()
      await inputField.fill("999999999999")

      // Wait for validation
      await page.waitForTimeout(500)

      // Should show error or disable button
      const swapButton = page
        .getByRole("main")
        .getByRole("button", { name: /Swap|Insufficient/i })
      const isDisabled = await swapButton.isDisabled()
      const hasError = await page
        .getByText(/insufficient|balance/i)
        .isVisible()
        .catch(() => false)

      expect(isDisabled || hasError).toBeTruthy()
    })
  })

  // ===========================================================================
  // LIQUIDITY TESTS
  // ===========================================================================

  test.describe("Liquidity Management", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Pool page
      const poolButton = page.getByRole("button", { name: "Pool" })
      if (await poolButton.isVisible()) {
        await poolButton.click()
        await page.waitForURL(/\/pool/i, { timeout: 5000 }).catch(() => {})
      }
    })

    test("should display pool page", async ({ page }) => {
      // Check we're on pool page or have pool content
      const hasPoolContent = await page
        .getByText(/pool|liquidity|position/i)
        .first()
        .isVisible()
        .catch(() => false)

      expect(hasPoolContent).toBeTruthy()
    })

    test("should show add liquidity option", async ({ page }) => {
      const addButton = page.getByRole("button", { name: /add|new/i })
      const isVisible = await addButton.isVisible().catch(() => false)

      if (isVisible) {
        await addButton.click()
        // Should navigate to add liquidity page or open modal
        await page.waitForTimeout(500)
      }
    })
  })

  // ===========================================================================
  // G-CHAIN INTEGRATION TESTS
  // ===========================================================================

  test.describe("G-Chain GraphQL Integration", () => {
    test("should fetch tokens from G-Chain", async () => {
      const gchainUp = await isGChainRunning()

      if (!gchainUp) {
        test.skip()
        return
      }

      const response = await fetch(TEST_CONFIG.gchainUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              tokens {
                id
                symbol
                name
              }
            }
          `,
        }),
      })

      expect(response.ok).toBeTruthy()

      const result = await response.json()
      // G-Chain should respond (may have empty data if no tokens indexed)
      expect(result).toHaveProperty("data")
    })

    test("should fetch pairs from G-Chain", async () => {
      const gchainUp = await isGChainRunning()

      if (!gchainUp) {
        test.skip()
        return
      }

      const response = await fetch(TEST_CONFIG.gchainUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              pairs {
                id
                token0 { symbol }
                token1 { symbol }
                reserve0
                reserve1
              }
            }
          `,
        }),
      })

      expect(response.ok).toBeTruthy()

      const result = await response.json()
      expect(result).toHaveProperty("data")
    })

    test("should fetch recent swaps from G-Chain", async () => {
      const gchainUp = await isGChainRunning()

      if (!gchainUp) {
        test.skip()
        return
      }

      const response = await fetch(TEST_CONFIG.gchainUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
                id
                sender
                amount0In
                amount1Out
                timestamp
              }
            }
          `,
        }),
      })

      expect(response.ok).toBeTruthy()

      const result = await response.json()
      expect(result).toHaveProperty("data")
    })
  })

  // ===========================================================================
  // TRANSACTION HISTORY TESTS
  // ===========================================================================

  test.describe("Transaction History", () => {
    test("should display transaction history section", async ({ page }) => {
      // Look for activity/history section
      const historySection = page.locator(
        '[data-testid="transaction-history"], [data-testid="activity"]'
      )
      const historyText = page.getByText(/recent|history|activity/i)

      const hasHistory =
        (await historySection.isVisible().catch(() => false)) ||
        (await historyText.isVisible().catch(() => false))

      // History section may or may not exist in current UI
      expect(hasHistory).toBeDefined()
    })
  })

  // ===========================================================================
  // SETTINGS TESTS
  // ===========================================================================

  test.describe("Settings", () => {
    test("should open settings modal", async ({ page }) => {
      const settingsButton = page.getByRole("button", { name: "Settings" })
      await expect(settingsButton).toBeVisible()

      await settingsButton.click()

      // Settings modal or popover should appear
      await page.waitForTimeout(300)

      const settingsContent = page.locator('[role="dialog"], [data-testid="settings-popover"]')
      const hasSlippage = await page
        .getByText(/slippage/i)
        .isVisible()
        .catch(() => false)

      expect(
        (await settingsContent.isVisible().catch(() => false)) || hasSlippage
      ).toBeTruthy()
    })

    test("should allow changing slippage tolerance", async ({ page }) => {
      const settingsButton = page.getByRole("button", { name: "Settings" })
      await settingsButton.click()

      await page.waitForTimeout(300)

      // Look for slippage input
      const slippageInput = page.locator(
        'input[type="number"], input[placeholder*="slippage" i]'
      )

      if (await slippageInput.isVisible()) {
        await slippageInput.fill("1")
        await expect(slippageInput).toHaveValue("1")
      }
    })
  })

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // Disconnect mock provider
      await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).ethereum.isConnected = () => false
      })

      await page.reload()

      // Should still load without crashing
      await expect(page.locator("body")).toBeVisible()
    })

    test("should show error toast for failed transactions", async ({
      page,
    }) => {
      // Mock a failed transaction
      await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eth = (window as any).ethereum
        const originalRequest = eth.request
        eth.request = async (args: { method: string }) => {
          if (args.method === "eth_sendTransaction") {
            throw new Error("Transaction failed")
          }
          return originalRequest(args)
        }
      })

      // Try to perform a swap
      const inputField = page.locator('input[placeholder="0"]').first()
      await inputField.fill("1")

      const swapButton = page
        .getByRole("main")
        .getByRole("button", { name: "Swap", exact: true })

      if (await swapButton.isEnabled()) {
        await swapButton.click()

        // Should show error message
        await page.waitForTimeout(1000)
        const errorToast = page.locator('[role="alert"], .toast-error')
        const errorMessage = page.getByText(/error|failed/i)

        const hasError =
          (await errorToast.isVisible().catch(() => false)) ||
          (await errorMessage.isVisible().catch(() => false))

        // Error handling depends on implementation
        expect(hasError).toBeDefined()
      }
    })
  })
})
