import { Currency } from '@luxamm/sdk-core'
import { nativeOnChain, WRAPPED_NATIVE_CURRENCY } from 'lx/src/constants/tokens'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) {
    return currency
  }
  if (WRAPPED_NATIVE_CURRENCY[currency.chainId]?.equals(currency)) {
    return nativeOnChain(currency.chainId)
  }
  return currency
}
