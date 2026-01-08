import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { useSupportedChainId } from 'lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from 'lx/src/features/chains/types'

export function useV4SwapEnabled(chainId?: number): boolean {
  const supportedChainId = useSupportedChainId(chainId)

  return createGetV4SwapEnabled({ getSupportedChainId: () => supportedChainId })(chainId)
}

export function createGetV4SwapEnabled(ctx: {
  getSupportedChainId: (chainId?: number) => UniverseChainId | undefined
}): (chainId?: number) => boolean {
  function getV4SwapEnabled(chainId?: number): boolean {
    const supportedChainId = ctx.getSupportedChainId(chainId)

    if (!supportedChainId) {
      return false
    }

    const chainInfo = getChainInfo(supportedChainId)
    return chainInfo.supportsV4
  }
  return getV4SwapEnabled
}
