import { Currency } from '@luxamm/sdk-core'
import { WRAPPED_SOL_ADDRESS_SOLANA } from 'lx/src/features/chains/svm/defaults'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { areAddressesEqual } from 'lx/src/utils/addresses'

/**
 * Checks if a currency is WSOL (Wrapped SOL)
 */
export function isWSOL(currency: Currency): boolean {
  return (
    !currency.isNative &&
    areAddressesEqual({
      addressInput1: { address: currency.address, chainId: currency.chainId },
      addressInput2: { address: WRAPPED_SOL_ADDRESS_SOLANA, chainId: UniverseChainId.Solana },
    })
  )
}
