import { usePrice } from '@universe/prices'
import type { CurrencyId } from 'lx/src/types/currency'
import { currencyIdToAddress, currencyIdToChain } from 'lx/src/utils/currencyId'

export function useTokenSpotPriceCentralized(currencyId: CurrencyId): number | undefined {
  const chainId = currencyIdToChain(currencyId) ?? undefined
  const address = currencyIdToAddress(currencyId)
  return usePrice({ chainId, address })
}
