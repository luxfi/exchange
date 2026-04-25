import { CurrencyAmount, Token } from '@luxamm/sdk-core'
import type { GasStrategy } from '@l.x/api'
import { DynamicConfigs, type GasStrategies, getInsights, isInsightsReady } from '@l.x/gating'
import { DAI } from '@l.x/lx/src/constants/tokens'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { DEFAULT_GAS_STRATEGY } from '@l.x/lx/src/features/gas/consts'
import {
  applyNativeTokenPercentageBuffer,
  getActiveGasStrategy,
  hasSufficientFundsIncludingGas,
  hasSufficientGasBalance,
} from '@l.x/lx/src/features/gas/utils'
import { MAINNET_CURRENCY } from '@l.x/lx/src/test/fixtures'

vi.mock('@l.x/gating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@l.x/gating')>()
  return {
    ...actual,
    getInsights: vi.fn(() => ({
      isFeatureEnabled: vi.fn(() => false),
      getFeatureFlag: vi.fn(() => undefined),
      getFeatureFlagPayload: vi.fn(() => undefined),
    })),
    isInsightsReady: vi.fn(() => true),
  }
})

const ZERO_ETH = CurrencyAmount.fromRawAmount(MAINNET_CURRENCY, 0)
const ONE_ETH = CurrencyAmount.fromRawAmount(MAINNET_CURRENCY, 1e18)
const TEN_ETH = ONE_ETH.multiply(10)

describe(applyNativeTokenPercentageBuffer, () => {
  it('returns undefined if no currency amount is provided', () => {
    expect(applyNativeTokenPercentageBuffer(undefined, 10)).toBeUndefined()
  })

  it('takes a percentage and returns the remaining amount', () => {
    expect(applyNativeTokenPercentageBuffer(ONE_ETH, 10)?.quotient.toString()).toEqual('900000000000000000')
  })

  it('handles decimal based percentage buffers', () => {
    expect(applyNativeTokenPercentageBuffer(ONE_ETH, 1.5)?.quotient.toString()).toEqual('985000000000000000')
  })

  it('returns the original amount if no percentage is provided', () => {
    expect(applyNativeTokenPercentageBuffer(ONE_ETH, 0)?.quotient.toString()).toEqual('1000000000000000000')
  })

  it('returns the original amount if the currency is not native', () => {
    expect(
      applyNativeTokenPercentageBuffer(CurrencyAmount.fromRawAmount(DAI, '100000000'), 10)?.quotient.toString(),
    ).toEqual('100000000')
  })
})

describe(hasSufficientFundsIncludingGas, () => {
  it('correctly returns when there is enough for gas with no tx value', () => {
    const mockParams = {
      transactionAmount: undefined,
      gasFee: '1000',
      nativeCurrencyBalance: ONE_ETH,
    }

    expect(hasSufficientFundsIncludingGas(mockParams)).toBe(true)
  })

  it('correctly returns when there is enough for gas even with tx value', () => {
    const mockParams = {
      transactionAmount: ONE_ETH,
      gasFee: '1000',
      nativeCurrencyBalance: TEN_ETH,
    }

    expect(hasSufficientFundsIncludingGas(mockParams)).toBe(true)
  })

  it('correctly returns when there is not enough gas with no tx value', () => {
    const mockParams = {
      transactionAmount: undefined,
      gasFee: '1000',
      nativeCurrencyBalance: ZERO_ETH,
    }

    expect(hasSufficientFundsIncludingGas(mockParams)).toBe(false)
  })

  it('correctly returns when there is not enough gas with a tx value', () => {
    const mockParams = {
      transactionAmount: ONE_ETH,
      gasFee: '1000',
      nativeCurrencyBalance: ZERO_ETH,
    }

    expect(hasSufficientFundsIncludingGas(mockParams)).toBe(false)
  })
})

const PATH_USD = new Token(UniverseChainId.Tempo, '0x20c0000000000000000000000000000000000000', 6, 'pathUSD', 'pathUSD')

function pathUsdBalance(raw: string): CurrencyAmount<Token> {
  return CurrencyAmount.fromRawAmount(PATH_USD, raw)
}

describe(hasSufficientGasBalance, () => {
  it('delegates to hasSufficientFundsIncludingGas for non-Tempo chains', () => {
    expect(
      hasSufficientGasBalance({
        chainId: UniverseChainId.Mainnet,
        gasBalance: ONE_ETH,
        gasFee: '1000',
      }),
    ).toBe(true)
  })

  it('returns false for non-Tempo chain with insufficient balance', () => {
    expect(
      hasSufficientGasBalance({
        chainId: UniverseChainId.Mainnet,
        gasBalance: ZERO_ETH,
        gasFee: '1000',
      }),
    ).toBe(false)
  })

  it('delegates to hasSufficientFundsIncludingTempoGas for Tempo', () => {
    expect(
      hasSufficientGasBalance({
        chainId: UniverseChainId.Tempo,
        gasBalance: pathUsdBalance('1000000'),
        gasFee: '1000000000000000000',
      }),
    ).toBe(true)
  })

  it('returns false for Tempo with insufficient pathUSD', () => {
    expect(
      hasSufficientGasBalance({
        chainId: UniverseChainId.Tempo,
        gasBalance: pathUsdBalance('0'),
        gasFee: '1000000000000000000',
      }),
    ).toBe(false)
  })
})

describe(getActiveGasStrategy, () => {
  const mockGetInsights = vi.mocked(getInsights)
  const mockIsInsightsReady = vi.mocked(isInsightsReady)

  function mockInsights({
    ready = true,
    strategies = [] as GasStrategies['strategies'],
  } = {}): void {
    mockIsInsightsReady.mockReturnValue(ready)
    mockGetInsights.mockReturnValue({
      isFeatureEnabled: vi.fn(() => false),
      getFeatureFlag: vi.fn(() => undefined),
      getFeatureFlagPayload: vi.fn((config: string) => {
        if (config === DynamicConfigs.GasStrategies) {
          return { strategies }
        }
        return undefined
      }),
    } as unknown as ReturnType<typeof getInsights>)
  }

  beforeEach(() => {
    mockInsights()
  })

  it('returns DEFAULT_GAS_STRATEGY when Insights has no config and no chain override', () => {
    const result = getActiveGasStrategy({ chainId: 1, type: 'swap' })
    expect(result).toEqual(DEFAULT_GAS_STRATEGY)
  })

  it('returns DEFAULT_GAS_STRATEGY with overrides for Arbitrum', () => {
    const result = getActiveGasStrategy({ chainId: 42161, type: 'swap' })
    expect(result).toEqual({
      ...DEFAULT_GAS_STRATEGY,
      minPriorityFeeGwei: 0,
      maxPriorityFeeGwei: 0,
    })
  })

  it('merges chain overrides on top of Insights strategy', () => {
    const insightsStrategy: GasStrategy = {
      limitInflationFactor: 1.2,
      displayLimitInflationFactor: 1,
      priceInflationFactor: 1.3,
      percentileThresholdFor1559Fee: 80,
      thresholdToInflateLastBlockBaseFee: 0.7,
      baseFeeMultiplier: 1.1,
      baseFeeHistoryWindow: 25,
      minPriorityFeeRatioOfBaseFee: 0.25,
      minPriorityFeeGwei: 3,
      maxPriorityFeeGwei: 12,
    }

    mockInsights({
      strategies: [
        {
          strategy: insightsStrategy,
          conditions: { name: 'test', chainId: 42161, types: 'swap', isActive: true },
        },
      ],
    })

    const result = getActiveGasStrategy({ chainId: 42161, type: 'swap' })
    expect(result).toEqual({
      ...insightsStrategy,
      minPriorityFeeGwei: 0,
      maxPriorityFeeGwei: 0,
    })
  })

  it('returns Insights strategy unchanged when no chain override exists', () => {
    const insightsStrategy: GasStrategy = {
      limitInflationFactor: 1.2,
      displayLimitInflationFactor: 1,
      priceInflationFactor: 1.3,
      percentileThresholdFor1559Fee: 80,
      thresholdToInflateLastBlockBaseFee: 0.7,
      baseFeeMultiplier: 1.1,
      baseFeeHistoryWindow: 25,
      minPriorityFeeRatioOfBaseFee: 0.25,
      minPriorityFeeGwei: 3,
      maxPriorityFeeGwei: 12,
    }

    mockInsights({
      strategies: [
        {
          strategy: insightsStrategy,
          conditions: { name: 'test', chainId: 1, types: 'swap', isActive: true },
        },
      ],
    })

    const result = getActiveGasStrategy({ chainId: 1, type: 'swap' })
    expect(result).toEqual(insightsStrategy)
  })

  it('returns DEFAULT_GAS_STRATEGY without overrides when chainId is undefined', () => {
    const result = getActiveGasStrategy({ chainId: undefined, type: 'swap' })
    expect(result).toEqual(DEFAULT_GAS_STRATEGY)
  })

  it('returns DEFAULT_GAS_STRATEGY when isInsightsReady is false', () => {
    const result = getActiveGasStrategy({ chainId: 42161, type: 'swap', isInsightsReady: false })
    expect(result).toEqual({
      ...DEFAULT_GAS_STRATEGY,
      minPriorityFeeGwei: 0,
      maxPriorityFeeGwei: 0,
    })
  })
})
