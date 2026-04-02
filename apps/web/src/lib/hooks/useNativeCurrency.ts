import { NativeCurrency, Token } from '@luxamm/sdk-core'
import { useMemo } from 'react'
import { nativeOnChain } from '@luxexchange/lx/src/constants/tokens'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'

export default function useNativeCurrency(chainId: UniverseChainId | null | undefined): NativeCurrency | Token {
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(UniverseChainId.Mainnet),
    [chainId],
  )
}
