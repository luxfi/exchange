import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { UniverseChainId } from 'lx/src/features/chains/types'
import type { DerivedSwapInfo } from 'lx/src/features/transactions/swap/types/derivedSwapInfo'
import type { Trade, TradeWithStatus } from 'lx/src/features/transactions/swap/types/trade'
import { getPriceImpact } from 'lx/src/features/transactions/swap/utils/getPriceImpact'
import { getSwapFeeUsdFromDerivedSwapInfo } from 'lx/src/features/transactions/swap/utils/getSwapFeeUsd'
import { isClassic, isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import { WrapType } from 'lx/src/features/transactions/types/wrap'
import { CurrencyField } from 'lx/src/types/currency'
import type { Mock } from 'vitest'

// Mocks for routing and getSwapFeeUsd
vi.mock('lx/src/features/transactions/swap/utils/routing', () => ({
  isClassic: vi.fn(),
  isDEX: vi.fn(),
}))
vi.mock('lx/src/features/transactions/swap/utils/getSwapFeeUsd', () => ({
  getSwapFeeUsdFromDerivedSwapInfo: vi.fn(),
}))

// Type the mocks for TypeScript
const isClassicMock = isClassic as unknown as Mock
const isDEXMock = isDEX as unknown as Mock
const getSwapFeeUsdFromDerivedSwapInfoMock = getSwapFeeUsdFromDerivedSwapInfo as unknown as Mock

// Minimal ClassicTrade mock
class ClassicTradeMock {
  priceImpact: Percent
  constructor(priceImpact: Percent) {
    this.priceImpact = priceImpact
  }
}

// Minimal DEXTrade mock
class DEXTradeMock {
  quote: unknown
  constructor(quote: unknown) {
    this.quote = quote
  }
}

describe('getPriceImpact', () => {
  const mockPercent = (value: number): Percent => {
    return new Percent(value, 100)
  }

  const mockCurrency = new Token(1, '0x0000000000000000000000000000000000000000', 6, 'USDC', 'USD Coin')
  const mockCurrencyAmount = (amount: string | number): CurrencyAmount<typeof mockCurrency> => {
    return CurrencyAmount.fromRawAmount(mockCurrency, amount)
  }

  const makeTradeWithStatus = (trade: Trade | null = null): TradeWithStatus => ({
    isLoading: false,
    error: null,
    trade,
    indicativeTrade: undefined,
    isIndicativeLoading: false,
    gasEstimate: undefined,
    quoteHash: '',
  })

  const makeDerivedSwapInfo = (
    trade: Trade | null | undefined,
    overrides: Partial<DerivedSwapInfo> = {},
  ): DerivedSwapInfo => ({
    chainId: UniverseChainId.Mainnet,

    currencies: {
      [CurrencyField.INPUT]: null,
      [CurrencyField.OUTPUT]: null,
    },
    currencyAmounts: {
      [CurrencyField.INPUT]: null,
      [CurrencyField.OUTPUT]: null,
    },
    currencyBalances: {
      [CurrencyField.INPUT]: null,
      [CurrencyField.OUTPUT]: null,
    },
    currencyAmountsUSDValue: {
      [CurrencyField.INPUT]: null,
      [CurrencyField.OUTPUT]: null,
    },
    outputAmountUserWillReceive: null,
    focusOnCurrencyField: null,
    trade: makeTradeWithStatus(trade),
    wrapType: WrapType.NotApplicable,
    exactAmountToken: '',
    exactCurrencyField: CurrencyField.INPUT,
    ...overrides,
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('returns undefined if there is no trade', () => {
    // Arrange
    const derivedSwapInfo = makeDerivedSwapInfo(undefined)
    // Act
    const result = getPriceImpact(derivedSwapInfo)
    // Assert
    expect(result).toBeUndefined()
  })

  it('returns trade.priceImpact for classic trades', () => {
    // Arrange
    const priceImpact = mockPercent(7)
    const trade = new ClassicTradeMock(priceImpact) as unknown as Trade
    isClassicMock.mockReturnValue(true)
    isDEXMock.mockReturnValue(false)
    const derivedSwapInfo = makeDerivedSwapInfo(trade)
    // Act
    const result = getPriceImpact(derivedSwapInfo)
    // Assert
    expect(result).toBe(priceImpact)
  })

  it('returns calculated price impact for DEX trades', () => {
    // Arrange
    const trade = new DEXTradeMock({ quote: { classicGasUseEstimateUSD: '100' } }) as unknown as Trade
    isClassicMock.mockReturnValue(false)
    isDEXMock.mockReturnValue(true)
    const inputUSD = mockCurrencyAmount('1000')
    const outputUSD = mockCurrencyAmount('900')
    getSwapFeeUsdFromDerivedSwapInfoMock.mockReturnValue(50)
    const derivedSwapInfo = makeDerivedSwapInfo(trade, {
      currencyAmountsUSDValue: {
        [CurrencyField.INPUT]: inputUSD,
        [CurrencyField.OUTPUT]: outputUSD,
      },
    })
    // Act
    const result = getPriceImpact(derivedSwapInfo)
    // Assert
    expect(result).toBeDefined()
    expect(typeof result?.toFixed).toBe('function')
  })

  it('returns undefined for non-classic, non-DEX trades', () => {
    // Arrange
    const trade = null
    isClassicMock.mockReturnValue(false)
    isDEXMock.mockReturnValue(false)
    const derivedSwapInfo = makeDerivedSwapInfo(trade)
    // Act
    const result = getPriceImpact(derivedSwapInfo)
    // Assert
    expect(result).toBeUndefined()
  })

  it('returns undefined for DEX trade with missing USD values', () => {
    // Arrange
    const trade = new DEXTradeMock({ quote: { classicGasUseEstimateUSD: '100' } }) as unknown as Trade
    isClassicMock.mockReturnValue(false)
    isDEXMock.mockReturnValue(true)
    const derivedSwapInfo = makeDerivedSwapInfo(trade, {
      currencyAmountsUSDValue: {
        [CurrencyField.INPUT]: null,
        [CurrencyField.OUTPUT]: null,
      },
    })
    // Act
    const result = getPriceImpact(derivedSwapInfo)
    // Assert
    expect(result).toBeUndefined()
  })

  it('returns undefined for DEX trade with missing classicGasEstimateUSD', () => {
    // Arrange
    const trade = new DEXTradeMock({ quote: {} }) as unknown as Trade
    isClassicMock.mockReturnValue(false)
    isDEXMock.mockReturnValue(true)
    const inputUSD = mockCurrencyAmount('1000')
    const outputUSD = mockCurrencyAmount('900')
    const derivedSwapInfo = makeDerivedSwapInfo(trade, {
      currencyAmountsUSDValue: {
        [CurrencyField.INPUT]: inputUSD,
        [CurrencyField.OUTPUT]: outputUSD,
      },
    })
    // Act
    const result = getPriceImpact(derivedSwapInfo)
    // Assert
    expect(result).toBeUndefined()
  })
})
