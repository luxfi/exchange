import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { createExpectSingleTransaction } from 'playwright/anvil/transactions'
import { expect, getTest } from 'playwright/fixtures'
import { stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import { uniswapUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { assume0xAddress } from 'utils/wagmi'
import { parseEther, parseUnits } from 'viem'

const test = getTest({ withAnvil: true })

// LuxDev Token Addresses (deployed via DeployFullStack.s.sol - deterministic CREATE addresses)
// These match the addresses in luxd-manager.ts DEFAULT_DEPLOYED_CONTRACTS
const LUXDEV_TOKENS = {
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3',  // First contract deployed
  LETH: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',  // BridgedETH
  LBTC: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',  // BridgedBTC
  LUSD: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',  // BridgedUSDC
}

// AMM Router for approvals
const AMM_ROUTER = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

// Skip these tests if not in Lux mode
const getChainConfig = () => {
  if (!isLuxdMode()) {
    return null
  }
  return {
    chainId: UniverseChainId.LuxDev,
    interfaceName: 'lux-dev',
  }
}

test.describe(
  'Lux Token Swaps',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test.describe.configure({ retries: 3 })

    test.beforeEach(async ({ page }) => {
      const config = getChainConfig()
      if (!config) {
        test.skip()
        return
      }

      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.approval })
    })

    test('should swap WLUX for LETH', async ({ page, anvil }) => {
      const config = getChainConfig()
      if (!config) {
        test.skip()
        return
      }

      // Capture browser console messages for debugging
      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.text().includes('computeRoutes') || msg.text().includes('trade')) {
          console.log(`[Browser ${msg.type()}]: ${msg.text()}`)
        }
      })

      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      // Set WLUX balance and approve router
      await anvil.setErc20Balance({
        address: assume0xAddress(LUXDEV_TOKENS.WLUX),
        balance: parseEther('100'),
      })
      await anvil.setErc20Allowance({
        address: assume0xAddress(LUXDEV_TOKENS.WLUX),
        spender: assume0xAddress(AMM_ROUTER),
        amount: parseEther('1000000'), // Max approval
      })

      // Navigate to swap page
      await page.goto(`/swap?chain=${config.interfaceName}`)
      await page.waitForLoadState('networkidle')

      // Wait for wallet to be connected (wagmiAutoConnect uses setTimeout)
      await page.getByTestId(TestID.Web3StatusConnected).waitFor({ state: 'visible', timeout: 10000 })

      // Select WLUX as input
      console.log('[Test] Selecting WLUX as input token...')
      await page.getByTestId(TestID.ChooseInputToken).click()
      const wluxOption = page.getByTestId(`token-option-${config.chainId}-WLUX`).first()
      await wluxOption.waitFor({ state: 'visible', timeout: 5000 })
      await wluxOption.click()
      // Wait for token selector to close
      await expect(wluxOption).not.toBeVisible({ timeout: 5000 })
      console.log('[Test] WLUX selected as input')

      // Select LETH as output
      console.log('[Test] Selecting LETH as output token...')
      await page.getByTestId(TestID.ChooseOutputToken).click()
      const lethOption = page.getByTestId(`token-option-${config.chainId}-LETH`).first()
      await lethOption.waitFor({ state: 'visible', timeout: 5000 })
      await lethOption.click()
      // Wait for token selector to close
      await expect(lethOption).not.toBeVisible({ timeout: 5000 })
      console.log('[Test] LETH selected as output')

      // Enter swap amount
      console.log('[Test] Entering swap amount...')
      await page.getByTestId(TestID.AmountInputIn).fill('1')

      // Wait for quote to be fetched
      console.log('[Test] Waiting for quote...')
      const reviewButton = page.getByTestId(TestID.ReviewSwap)
      await reviewButton.waitFor({ state: 'visible', timeout: 10000 })

      // Debug: Check button state
      const isDisabled = await reviewButton.getAttribute('disabled')
      const ariaDisabled = await reviewButton.getAttribute('aria-disabled')
      console.log(`[Debug] Review button disabled=${isDisabled}, aria-disabled=${ariaDisabled}`)

      // Execute swap
      console.log('[Test] Executing swap...')
      await expectSingleTransaction(async () => {
        await reviewButton.click()
        console.log('[Test] Clicked Review Swap')
        const swapButton = page.getByTestId(TestID.Swap)
        await swapButton.waitFor({ state: 'visible', timeout: 10000 })
        await swapButton.click()
        console.log('[Test] Clicked Swap - waiting for confirmation...')
        await expect(page.getByText('Swapped')).toBeVisible({ timeout: 30000 })
        await expect(page.getByText(/WLUX for.*LETH/)).toBeVisible()
      })
    })

    test('should swap LUSD for WLUX', async ({ page, anvil }) => {
      const config = getChainConfig()
      if (!config) {
        test.skip()
        return
      }

      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      // Set LUSD balance and approve router
      await anvil.setErc20Balance({
        address: assume0xAddress(LUXDEV_TOKENS.LUSD),
        balance: parseUnits('10000', 6), // LUSD has 6 decimals
      })
      await anvil.setErc20Allowance({
        address: assume0xAddress(LUXDEV_TOKENS.LUSD),
        spender: assume0xAddress(AMM_ROUTER),
        amount: parseUnits('1000000', 6), // Max approval
      })

      // Navigate to swap page
      await page.goto(`/swap?chain=${config.interfaceName}`)
      await page.waitForLoadState('networkidle')

      // Wait for wallet to be connected (wagmiAutoConnect uses setTimeout)
      await page.getByTestId(TestID.Web3StatusConnected).waitFor({ state: 'visible', timeout: 10000 })

      // Select LUSD as input
      await page.getByTestId(TestID.ChooseInputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-LUSD`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-LUSD`).first().click()

      // Select WLUX as output
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-WLUX`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-WLUX`).first().click()

      // Enter swap amount
      await page.getByTestId(TestID.AmountInputIn).fill('10')

      // Wait for quote
      await page.waitForTimeout(3000)

      // Execute swap
      await expectSingleTransaction(async () => {
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()
        await expect(page.getByText('Swapped')).toBeVisible({ timeout: 30000 })
        await expect(page.getByText(/LUSD for.*WLUX/)).toBeVisible()
      })
    })

    test('should swap LBTC for WLUX', async ({ page, anvil }) => {
      const config = getChainConfig()
      if (!config) {
        test.skip()
        return
      }

      const expectSingleTransaction = createExpectSingleTransaction({
        anvil,
        address: TEST_WALLET_ADDRESS,
        options: { blocks: 2 },
      })

      // Set LBTC balance (8 decimals) and approve router
      await anvil.setErc20Balance({
        address: assume0xAddress(LUXDEV_TOKENS.LBTC),
        balance: parseUnits('10', 8),
      })
      await anvil.setErc20Allowance({
        address: assume0xAddress(LUXDEV_TOKENS.LBTC),
        spender: assume0xAddress(AMM_ROUTER),
        amount: parseUnits('1000000', 8), // Max approval
      })

      // Navigate to swap page
      await page.goto(`/swap?chain=${config.interfaceName}`)
      await page.waitForLoadState('networkidle')

      // Wait for wallet to be connected (wagmiAutoConnect uses setTimeout)
      await page.getByTestId(TestID.Web3StatusConnected).waitFor({ state: 'visible', timeout: 10000 })

      // Select LBTC as input
      await page.getByTestId(TestID.ChooseInputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-LBTC`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-LBTC`).first().click()

      // Select WLUX as output
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)
      await expect(page.getByTestId(`token-option-${config.chainId}-WLUX`).first()).toBeVisible()
      await page.getByTestId(`token-option-${config.chainId}-WLUX`).first().click()

      // Enter swap amount
      await page.getByTestId(TestID.AmountInputIn).fill('0.01')

      // Wait for quote
      await page.waitForTimeout(3000)

      // Execute swap
      await expectSingleTransaction(async () => {
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()
        await expect(page.getByText('Swapped')).toBeVisible({ timeout: 30000 })
        await expect(page.getByText(/LBTC for.*WLUX/)).toBeVisible()
      })
    })

    test('should display all Lux tokens in token selector', async ({ page }) => {
      const config = getChainConfig()
      if (!config) {
        test.skip()
        return
      }

      // Navigate to swap page
      await page.goto(`/swap?chain=${config.interfaceName}`)
      await page.waitForLoadState('networkidle')

      // Wait for wallet to be connected (wagmiAutoConnect uses setTimeout)
      await page.getByTestId(TestID.Web3StatusConnected).waitFor({ state: 'visible', timeout: 10000 })

      // Open token selector
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.waitForTimeout(2000)

      // Verify all Lux tokens are visible
      for (const symbol of ['WLUX', 'LETH', 'LBTC', 'LUSD']) {
        await expect(page.getByTestId(`token-option-${config.chainId}-${symbol}`).first()).toBeVisible()
      }
    })
  },
)
