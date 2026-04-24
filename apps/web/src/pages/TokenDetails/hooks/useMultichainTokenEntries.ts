import { useMemo } from 'react'
import {
  type MultichainTokenEntry,
  useOrderedMultichainEntries,
} from '@l.x/lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { fromGraphQLChain } from '@l.x/lx/src/features/chains/utils'
import { isNativeCurrencyAddress } from '@l.x/lx/src/utils/currencyId'
import type { MultiChainMap } from '~/pages/TokenDetails/context/TDPContext'

/** Maps TDP `multiChainMap` to ordered multichain entries (same ordering as balances / address dropdown). */
export function useMultichainTokenEntries(multiChainMap: MultiChainMap): MultichainTokenEntry[] {
  const entries = useMemo(() => {
    const result: MultichainTokenEntry[] = []
    for (const [graphqlChain, data] of Object.entries(multiChainMap)) {
      const chainId = fromGraphQLChain(graphqlChain)
      if (chainId && data.address) {
        result.push({
          chainId,
          address: data.address,
          isNative: isNativeCurrencyAddress(chainId, data.address),
        })
      }
    }
    return result
  }, [multiChainMap])
  return useOrderedMultichainEntries(entries)
}
