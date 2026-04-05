<<<<<<< HEAD
import { Currency } from '@luxamm/sdk-core'
import { nativeOnChain, WRAPPED_NATIVE_CURRENCY } from '@l.x/lx/src/constants/tokens'
=======
import { Currency } from '@uniswap/sdk-core'
import { nativeOnChain, WRAPPED_NATIVE_CURRENCY } from 'uniswap/src/constants/tokens'
>>>>>>> upstream/main

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) {
    return currency
  }
  if (WRAPPED_NATIVE_CURRENCY[currency.chainId]?.equals(currency)) {
    return nativeOnChain(currency.chainId)
  }
  return currency
}
