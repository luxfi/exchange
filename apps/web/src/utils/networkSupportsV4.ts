<<<<<<< HEAD
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
=======
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
>>>>>>> upstream/main

export function isV4UnsupportedChain(chainId?: number) {
  if (!chainId) {
    return false
  }
  return !getChainInfo(chainId).supportsV4
}
