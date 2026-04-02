import { NativeCurrency, Token } from '@luxamm/sdk-core'
import { useMemo } from 'react'
import { nativeOnChain } from '@l.x/lx/src/constants/tokens'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

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
