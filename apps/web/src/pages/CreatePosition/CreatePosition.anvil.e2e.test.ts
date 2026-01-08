import { Token, V2_FACTORY_ADDRESSES } from '@luxamm/sdk-core'
import { computePairAddress } from '@luxamm/v2-sdk'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { ONE_MILLION_USDT } from 'playwright/anvil/utils'
import { expect, getTest, type Page } from 'playwright/fixtures'
import { DEFAULT_TEST_GAS_LIMIT, stubTradingApiEndpoint } from 'playwright/fixtures/tradingApi'
import { Mocks } from 'playwright/mocks/mocks'
import { LUSD_LUX, USDT, WRAPPED_NATIVE_CURRENCY } from 'lx/src/constants/tokens'
import { uniswapUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { WETH } from 'lx/src/test/fixtures/lib/sdk'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { assume0xAddress } from 'utils/wagmi'
import { parseEther } from 'viem'

const test = getTest({ withAnvil: true })

// Get chain-appropriate tokens and config
const getChainConfig = () => {
  if (isLuxdMode()) {
    const wlux = WRAPPED_NATIVE_CURRENCY[UniverseChainId.Lux]
    return {
      stableToken: LUSD_LUX,
      stableSymbol: 'LUSD',
      stableBalance: parseEther('100'), // 100 LUSD (18 decimals)
      wrappedNativeAddress: wlux?.address || '0x55750d6CA62a041c06a8E28626b10Be6c688f471',
      wrappedNativeSymbol: 'WLUX',
      chainId: UniverseChainId.Lux,
      searchMock: Mocks.Token.search_token_tether, // TODO: create Lux-specific mock
    }
  }
  return {
    stableToken: USDT,
    stableSymbol: 'USDT',
    stableBalance: ONE_MILLION_USDT,
    wrappedNativeAddress: WETH.address,
    wrappedNativeSymbol: 'WETH',
    chainId: UniverseChainId.Mainnet,
    searchMock: Mocks.Token.search_token_tether,
  }
}

const WETH_ADDRESS = WETH.address

function modifyGasLimit(data: { create: { gasLimit: string } }) {
  try {
    data.create.gasLimit = DEFAULT_TEST_GAS_LIMIT
    return data
  } catch {
    return data
  }
}

// CreatePosition tests work on both Ethereum and Lux chains
test.describe(
  'Create position',
  {
    tag: '@team:apps-lp',
    annotation: [
      { type: 'DD_TAGS[team]', description: 'apps-lp' },
      { type: 'DD_TAGS[test.type]', description: 'web-e2e' },
    ],
  },
  () => {
    // Tests use chain-aware getChainConfig() - no skip needed

    test('Create position with full range', async ({ page, anvil, graphql }) => {
      const config = getChainConfig()
      await stubTradingApiEndpoint({
        page,
        endpoint: uniswapUrls.tradingApiPaths.createLp,
        modifyResponseData: modifyGasLimit,
      })
      await graphql.intercept('SearchTokens', config.searchMock)
      await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
      await page.goto('/positions/create')
      await page.getByRole('button', { name: 'Choose token' }).click()
      await page.getByTestId(TestID.ExploreSearchInput).fill(config.stableToken.address)
      // eslint-disable-next-line
      await page.getByTestId(`token-option-1-${config.stableSymbol}`).first().click()
      await page.getByRole('button', { name: 'Continue' }).click()
      await graphql.waitForResponse('PoolPriceHistory')
      await graphql.waitForResponse('AllV4Ticks')
      await page.getByText('Full range').click()
      await reviewAndCreatePosition({ page })
    })

    test('Create position with custom range', async ({ page, anvil, graphql }) => {
      const config = getChainConfig()
      await stubTradingApiEndpoint({
        page,
        endpoint: uniswapUrls.tradingApiPaths.createLp,
        modifyResponseData: modifyGasLimit,
      })
      await graphql.intercept('SearchTokens', config.searchMock)
      await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
      await page.goto('/positions/create')
      await page.getByRole('button', { name: 'Choose token' }).click()
      await page.getByTestId(TestID.ExploreSearchInput).fill(config.stableToken.address)
      // eslint-disable-next-line
      await page.getByTestId(`token-option-1-${config.stableSymbol}`).first().click()
      await page.getByRole('button', { name: 'Continue' }).click()
      await graphql.waitForResponse('PoolPriceHistory')
      await graphql.waitForResponse('AllV4Ticks')
      await page.getByTestId(TestID.RangeInputIncrement + '-0').click()
      await page.getByTestId(TestID.RangeInputDecrement + '-1').click()
      await reviewAndCreatePosition({ page })
    })

    test.describe('v2 zero liquidity', () => {
      test('should create a position', async ({ page, anvil }) => {
        const config = getChainConfig()
        await anvil.setErc20Balance({ address: assume0xAddress(config.wrappedNativeAddress), balance: parseEther('100') })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        // V2 factory addresses for current chain
        const factoryAddress = V2_FACTORY_ADDRESSES[config.chainId]
        if (factoryAddress) {
          const wrappedNativeToken = new Token(config.chainId, config.wrappedNativeAddress, 18, config.wrappedNativeSymbol, config.wrappedNativeSymbol)
          await anvil.setV2PoolReserves({
            pairAddress: assume0xAddress(
              computePairAddress({
                factoryAddress,
                tokenA: wrappedNativeToken,
                tokenB: config.stableToken,
              }),
            ),
            reserve0: 0n,
            reserve1: 0n,
          })
        }
        await page.goto(`/positions/create/v2?currencyA=${config.wrappedNativeAddress}&currencyB=${config.stableToken.address}`)
        await page.getByRole('button', { name: 'Continue' }).click()
        await page.getByTestId(TestID.AmountInputIn).last().click()
        await page.getByTestId(TestID.AmountInputIn).last().fill('10')
        await page.getByTestId(TestID.AmountInputIn).first().click()
        await page.getByTestId(TestID.AmountInputIn).first().fill('1')
        await page.getByRole('button', { name: 'Review' }).click()
        await page.getByRole('button', { name: 'Create' }).click()
        await expect(page.getByText('Creating position')).toBeVisible()
      })
    })

    test.describe('v2 no pair', () => {
      test('should create a pair', async ({ page, anvil }) => {
        const config = getChainConfig()
        // random coins that are unlikely to have a v2 pair
        const randomCoin1 = '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c'
        const randomCoin2 = '0x3081f70000e8CF8Be2aFCaE3Db6B9D9c796CaEc5'
        const chainParam = isLuxdMode() ? 'lux' : 'ethereum'

        await anvil.setErc20Balance({ address: assume0xAddress(config.wrappedNativeAddress), balance: parseEther('100') })
        await page.goto(
          `/positions/create/v2?currencyA=${randomCoin1}&currencyB=${randomCoin2}&chain=${chainParam}&fee=undefined&hook=undefined&priceRangeState={"priceInverted":false,"fullRange":false,"minPrice":"","maxPrice":"","initialPrice":"","inputMode":"price"}&depositState={"exactField":"TOKEN0","exactAmounts":{}}`,
        )
        await expect(page.getByText('Creating new pool').first()).toBeVisible()
        await page.getByRole('button', { name: 'Continue' }).click()
        await expect(page.url()).toContain('step=1')
      })
    })

    test.describe('Custom fee tier', () => {
      test('should create a position with a custom fee tier', async ({ page, anvil }) => {
        const config = getChainConfig()
        await stubTradingApiEndpoint({
          page,
          endpoint: uniswapUrls.tradingApiPaths.createLp,
          modifyResponseData: modifyGasLimit,
        })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        await page.goto(`/positions/create?currencyA=NATIVE&currencyB=${config.stableToken.address}`)
        await page.getByRole('button', { name: 'More', exact: true }).click()
        await page.getByText('Search or create other fee').click()
        await page.getByRole('button', { name: 'Create new fee tier' }).click()
        await page.getByPlaceholder('0').fill('3.1415')
        await page.getByRole('button', { name: 'Create new fee tier' }).click()
        await expect(page.getByText('New tier').first()).toBeVisible()
        await expect(page.getByText('Creating new pool')).toBeVisible()
        await page.getByRole('button', { name: 'Continue' }).click()
        await reviewAndCreatePosition({ page })
      })

      test('should create a position with a dynamic fee tier', async ({ page, anvil }) => {
        const config = getChainConfig()
        const HOOK_ADDRESS = '0x09DEA99D714A3a19378e3D80D1ad22Ca46085080'
        await stubTradingApiEndpoint({
          page,
          endpoint: uniswapUrls.tradingApiPaths.createLp,
          modifyResponseData: modifyGasLimit,
        })
        await anvil.setErc20Balance({ address: assume0xAddress(config.stableToken.address), balance: config.stableBalance })
        await page.goto(`/positions/create?currencyA=NATIVE&currencyB=${config.stableToken.address}&hook=${HOOK_ADDRESS}`)
        await page.getByRole('button', { name: 'More', exact: true }).click()
        await page.getByText('Search or create other fee').click()
        await page.getByText('Dynamic fee').click()
        await page.getByTestId(TestID.DynamicFeeTierSpeedbumpContinue).click()
        await page.getByRole('button', { name: 'Continue' }).click()
        await page.getByTestId(TestID.HookModalContinueButton).click()
        await reviewAndCreatePosition({ page })
      })
    })
  },
)

async function reviewAndCreatePosition({ page }: { page: Page }) {
  await page.getByTestId(TestID.AmountInputIn).first().click()
  await page.getByTestId(TestID.AmountInputIn).first().fill('1')
  await page.getByRole('button', { name: 'Review' }).click()
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByText('Created position')).toBeVisible()
  await expect(page).toHaveURL('/positions')
}
