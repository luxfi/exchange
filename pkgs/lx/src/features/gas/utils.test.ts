import { CurrencyAmount, Token } from '@luxamm/sdk-core'
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
  it('returns DEFAULT_GAS_STRATEGY when no chain override exists', () => {
    const result = getActiveGasStrategy({ chainId: 1, type: 'swap' })
    expect(result).toEqual(DEFAULT_GAS_STRATEGY)
  })

  it('merges chain overrides on top of DEFAULT_GAS_STRATEGY', () => {
    const result = getActiveGasStrategy({ chainId: 42161, type: 'swap' })
    expect(result).toEqual({
      ...DEFAULT_GAS_STRATEGY,
      minPriorityFeeGwei: 0,
      maxPriorityFeeGwei: 0,
    })
  })

  it('returns DEFAULT_GAS_STRATEGY without overrides when chainId is undefined', () => {
    const result = getActiveGasStrategy({ chainId: undefined, type: 'swap' })
    expect(result).toEqual(DEFAULT_GAS_STRATEGY)
  })
})
