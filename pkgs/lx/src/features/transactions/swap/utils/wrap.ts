import { Currency } from '@luxamm/sdk-core'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { WrapType } from 'lx/src/features/transactions/types/wrap'
import { areCurrencyIdsEqual, buildWrappedNativeCurrencyId, currencyId } from 'lx/src/utils/currencyId'

export function getWrapType(
  inputCurrency: Currency | null | undefined,
  outputCurrency: Currency | null | undefined,
): WrapType {
  if (!inputCurrency || !outputCurrency || inputCurrency.chainId !== outputCurrency.chainId) {
    return WrapType.NotApplicable
  }

  const inputChainId = inputCurrency.chainId as UniverseChainId
  const wrappedCurrencyId = buildWrappedNativeCurrencyId(inputChainId)

  if (inputCurrency.isNative && areCurrencyIdsEqual(currencyId(outputCurrency), wrappedCurrencyId)) {
    return WrapType.Wrap
  } else if (outputCurrency.isNative && areCurrencyIdsEqual(currencyId(inputCurrency), wrappedCurrencyId)) {
    return WrapType.Unwrap
  }

  return WrapType.NotApplicable
}

export function isWrapAction(wrapType: WrapType): wrapType is WrapType.Unwrap | WrapType.Wrap {
  return wrapType === WrapType.Unwrap || wrapType === WrapType.Wrap
}
