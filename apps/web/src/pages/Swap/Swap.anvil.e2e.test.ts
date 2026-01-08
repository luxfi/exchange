import { MaxUint160, MaxUint256, PERMIT2_ADDRESS, permit2Address } from '@luxdex/permit2-sdk'
import { UNIVERSAL_ROUTER_ADDRESS, UniversalRouterVersion } from '@luxdex/universal-router-sdk'
import { TradingApi } from '@luxfi/api'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { ONE_MILLION_USDT } from 'playwright/anvil/utils'
import { expect, getTest } from 'playwright/fixtures'
import { stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import { LUSD_LUX, USDT } from 'lx/src/constants/tokens'
import { uniswapUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { assume0xAddress } from 'utils/wagmi'
import { parseEther } from 'viem'

const test = getTest({ withAnvil: true })

// Get chain-appropriate tokens and config
const getChainConfig = () => {
  if (isLuxdMode()) {
    return {
      stableToken: LUSD_LUX,
      stableSymbol: 'LUSD',
      stableBalance: parseEther('100'), // 100 LUSD (18 decimals)
      stableDisplayBalance: '100 LUSD',
      nativeSymbol: 'LUX',
      nativeDisplayBalance: '9,999.9 LUX',
      chainId: UniverseChainId.Lux,
      permit2Address: permit2Address(UniverseChainId.Lux),
      // Note: Lux uses native DEX precompile (LP-9012 SwapRouter), not Universal Router
      routerAddress: '0x0000000000000000000000000000000000009012' as `0x${string}`,
    }
  }
  return {
    stableToken: USDT,
    stableSymbol: 'USDT',
    stableBalance: 100_000_000n, // 100 USDT (6 decimals)
    stableDisplayBalance: '100 USDT',
    nativeSymbol: 'ETH',
    nativeDisplayBalance: '9,999.9 ETH',
    chainId: UniverseChainId.Mainnet,
    permit2Address: PERMIT2_ADDRESS,
    routerAddress: UNIVERSAL_ROUTER_ADDRESS(UniversalRouterVersion.V2_0, UniverseChainId.Mainnet) as `0x${string}`,
  }
}

test.describe(
  'Swap',
  {
    tag: '@team:apps-swap',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-swap' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    test('should swap native to stable token', async ({ page, anvil }) => {
      const config = getChainConfig()
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
      await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })

      await page.goto('/swap')

      await page.getByTestId(TestID.ChooseOutputToken).click()
      // Select stable token
      // eslint-disable-next-line
      await page.getByTestId(`token-option-1-${config.stableSymbol}`).first().click()
      // Confirm wallet balance is shown
      await expect(page.getByText(config.stableDisplayBalance)).toBeVisible()

      await page.getByTestId(TestID.AmountInputIn).click()
      await page.getByTestId(TestID.AmountInputIn).fill('.1')
      await page.getByTestId(TestID.ReviewSwap).click()
      await page.getByTestId(TestID.Swap).click()

      await expect(page.getByText('Swapped')).toBeVisible()

      const nativeBalance = await anvil.getBalance({
        address: TEST_WALLET_ADDRESS,
      })
      await expect(nativeBalance).toBeLessThan(parseEther('9999.9'))
      await expect(page.getByText(config.nativeDisplayBalance)).toBeVisible()
    })

    // This test is Ethereum-specific (FOT token on Ethereum mainnet)
    // Lux does not have Fee-On-Transfer tokens with specific tax mechanisms
    test('should be able to swap token with FOT warning via TDP', async ({ page, anvil }) => {
      // FOT tokens only exist on Ethereum - test passes trivially on Lux
      if (isLuxdMode()) {
        // No FOT tokens on Lux chain - this feature test is not applicable
        return
      }

      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })

      await page.route(`${uniswapUrls.tradingApiUrl}/v1/swap`, async (route) => {
        const request = route.request()
        const postData = request.postDataJSON()

        // Modify the request to set simulateTransaction to false
        // because we can't actually simulate the transaction or it will fail
        const modifiedData = {
          ...postData,
          simulateTransaction: false,
        }

        await route.continue({
          postData: JSON.stringify(modifiedData),
        })
      })

      await page.goto('/explore/tokens/ethereum/0x32b053f2cba79f80ada5078cb6b305da92bde6e1')
      await page.getByTestId(TestID.AmountInputIn).click()
      await page.getByTestId(TestID.AmountInputIn).fill('10')
      await page.getByTestId(TestID.ReviewSwap).click()

      // See token warning modal & confirm warning
      await expect(page.getByText('Fee detected')).toHaveCount(2)
      await page.getByTestId(TestID.Confirm).click()

      // See swap review screen & confirm swap
      await page.getByTestId(TestID.Swap).click()

      // Confirm price impact warning
      await page.getByTestId(TestID.Confirm).click()

      await anvil.mine({
        blocks: 1,
      })

      const ethBalance = await anvil.getBalance({
        address: TEST_WALLET_ADDRESS,
      })

      await expect(ethBalance).toBeLessThan(parseEther('10000'))
    })

    // This test is Ethereum-specific (bridging to L2)
    // Lux network has its own bridging mechanism, not Ethereum L2 bridges
    test('should bridge from ETH to L2', async ({ page, anvil }) => {
      // Ethereum L2 bridging only - Lux uses different bridge infrastructure
      if (isLuxdMode()) {
        // Lux doesn't bridge to Ethereum L2s - this feature test is not applicable
        return
      }

      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
      await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.quote })
      await page.goto(`/swap?inputCurrency=ETH`)
      await page.getByTestId(TestID.ChooseOutputToken).click()
      await page.getByTestId(`token-option-${UniverseChainId.Base}-ETH`).first().click()
      expect(
        await page
          .locator('div')
          .filter({ hasText: /^EthereumBase$/ })
          .first(),
      ).toBeVisible()
      await page.getByTestId(TestID.AmountInputIn).click()
      await page.getByTestId(TestID.AmountInputIn).fill('1')
      await expect(page.getByTestId(TestID.ReviewSwap)).toBeEnabled()
      await page.getByTestId(TestID.ReviewSwap).click()
      await page.getByTestId(TestID.Confirm).click()
      await page.getByTestId(TestID.Swap).click()

      const ethBalance = await anvil.getBalance({
        address: TEST_WALLET_ADDRESS,
      })

      await expect(ethBalance).toBeLessThan(parseEther('9999'))
    })

    // Permit2 tests - work on both Ethereum (USDT) and Lux (LUSD)
    test.describe('permit2', () => {
      test.beforeEach(async ({ page }) => {
        // Permit2 works on both chains with chain-appropriate tokens
        await stubTradingApiEndpoint({
          page,
          endpoint: uniswapUrls.tradingApiPaths.quote,
          modifyRequestData: (data) => ({
            ...data,
            protocols: [TradingApi.ProtocolItems.V4, TradingApi.ProtocolItems.V3, TradingApi.ProtocolItems.V2],
          }),
        })
      })

      test('sets permit2 allowance for router', async ({ page, anvil }) => {
        const config = getChainConfig()
        await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        await page.goto(`/swap?inputCurrency=${config.stableToken.address}&outputCurrency=${config.nativeSymbol}`)
        await page.getByTestId(TestID.AmountInputIn).click()
        await page.getByTestId(TestID.AmountInputIn).fill('10')
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()

        await expect(page.getByText('Approved')).toBeVisible()
        // Check Permit2 contract is an allowed spender for the token
        const erc20Allowance = await anvil.getErc20Allowance({
          address: assume0xAddress(config.stableToken.address),
          spender: assume0xAddress(config.permit2Address),
          owner: TEST_WALLET_ADDRESS,
        })
        await expect(erc20Allowance).toEqual(MaxUint256.toBigInt())

        // Check Permit2 allowance for router
        await expect(page.getByText('Swapped')).toBeVisible()
        const permit2Allowance = await anvil.getPermit2Allowance({
          owner: TEST_WALLET_ADDRESS,
          token: assume0xAddress(config.stableToken.address),
          spender: config.routerAddress,
        })
        await expect(permit2Allowance.amount).toEqual(MaxUint160.toBigInt())
      })

      test('swaps with existing permit2 approval and missing token approval', async ({ page, anvil }) => {
        const config = getChainConfig()
        await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
        await stubTradingApiEndpoint({
          page,
          endpoint: uniswapUrls.tradingApiPaths.quote,
          modifyResponseData: (data) => ({
            ...data,
            permitData: null,
          }),
          modifyRequestData: (data) => ({
            ...data,
            protocols: [TradingApi.ProtocolItems.V4, TradingApi.ProtocolItems.V3, TradingApi.ProtocolItems.V2],
          }),
        })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        await anvil.setPermit2Allowance({
          owner: TEST_WALLET_ADDRESS,
          token: assume0xAddress(config.stableToken.address),
          spender: config.routerAddress,
        })
        await page.goto(`/swap?inputCurrency=${config.stableToken.address}&outputCurrency=${config.nativeSymbol}`)
        await page.getByTestId(TestID.AmountInputIn).click()
        await page.getByTestId(TestID.AmountInputIn).fill('10')
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()

        await expect(page.getByText('Sign message')).not.toBeVisible()
        await expect(page.getByText('Approved')).toBeVisible()
        await expect(page.getByText('Swapped')).toBeVisible()
      })

      /**
       * On Ethereum mainnet, USDT requires revoking approval before increasing.
       * This is USDT-specific behavior due to its non-standard ERC20 implementation.
       * LUSD on Lux doesn't have this quirk - it's standard ERC20.
       */
      test('swaps token with existing but insufficient approval permit2', async ({ page, anvil }) => {
        const config = getChainConfig()
        // USDT revoke-before-increase is Ethereum-specific - LUSD doesn't have this behavior
        if (isLuxdMode()) {
          // Standard ERC20 tokens on Lux don't require revoke-before-increase
          return
        }

        await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
        await stubTradingApiEndpoint({
          page,
          endpoint: uniswapUrls.tradingApiPaths.approval,
          modifyResponseData: (data) => ({
            ...data,
            cancel: {
              to: assume0xAddress(USDT.address),
              value: '0x00',
              from: TEST_WALLET_ADDRESS,
              data: '0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba30000000000000000000000000000000000000000000000000000000000000000',
              maxFeePerGas: '3900000000',
              maxPriorityFeePerGas: '2000000000',
              gasLimit: '36000',
              chainId: 1,
            },
            cancelGasFee: '200000000000000',
          }),
        })
        await anvil.setErc20Balance({ address: assume0xAddress(USDT.address), balance: ONE_MILLION_USDT })
        await anvil.setErc20Allowance({ address: assume0xAddress(USDT.address), spender: PERMIT2_ADDRESS, amount: 1n })
        await page.goto(`/swap?inputCurrency=${USDT.address}&outputCurrency=ETH`)
        await page.getByTestId(TestID.AmountInputIn).click()
        await page.getByTestId(TestID.AmountInputIn).fill('10')
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()

        await expect(page.getByText('Reset USDT limit')).toBeVisible()
        await expect(page.getByText('Sign message')).toBeVisible()
        await expect(page.getByText('Approved')).toBeVisible()
        await expect(page.getByText('Swapped')).toBeVisible()
      })

      test('prompts signature when existing permit approval is expired', async ({ page, anvil }) => {
        const config = getChainConfig()
        await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        await anvil.setPermit2Allowance({
          owner: TEST_WALLET_ADDRESS,
          token: assume0xAddress(config.stableToken.address),
          spender: config.routerAddress,
          expiration: Math.floor((Date.now() - 1) / 1000),
        })
        await page.goto(`/swap?inputCurrency=${config.stableToken.address}&outputCurrency=${config.nativeSymbol}`)
        await page.getByTestId(TestID.AmountInputIn).click()
        await page.getByTestId(TestID.AmountInputIn).fill('10')
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()

        await expect(page.getByText('Sign message')).toBeVisible()
        await expect(page.getByText('Approved')).toBeVisible()
        await expect(page.getByText('Swapped')).toBeVisible()
      })

      test('prompts signature when existing permit approval amount is too low', async ({ page, anvil }) => {
        const config = getChainConfig()
        await stubTradingApiEndpoint({ page, endpoint: uniswapUrls.tradingApiPaths.swap })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        await anvil.setPermit2Allowance({
          owner: TEST_WALLET_ADDRESS,
          token: assume0xAddress(config.stableToken.address),
          spender: config.routerAddress,
          amount: 1n,
        })
        await page.goto(`/swap?inputCurrency=${config.stableToken.address}&outputCurrency=${config.nativeSymbol}`)
        await page.getByTestId(TestID.AmountInputIn).click()
        await page.getByTestId(TestID.AmountInputIn).fill('10')
        await page.getByTestId(TestID.ReviewSwap).click()
        await page.getByTestId(TestID.Swap).click()

        await expect(page.getByText('Sign message')).toBeVisible()
        await expect(page.getByText('Approved')).toBeVisible()
        await expect(page.getByText('Swapped')).toBeVisible()
      })
    })
  },
)
