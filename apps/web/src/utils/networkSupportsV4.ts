import { getChainInfo } from '@luxexchange/lx/src/features/chains/chainInfo'

export function isV4UnsupportedChain(chainId?: number) {
  if (!chainId) {
    return false
  }
  return !getChainInfo(chainId).supportsV4
}
