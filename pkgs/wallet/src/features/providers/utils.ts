import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { RPCType, UniverseChainId } from '@l.x/lx/src/features/chains/types'

export function isPrivateRpcSupportedOnChain(chainId: UniverseChainId): boolean {
  return Boolean(getChainInfo(chainId).rpcUrls[RPCType.Private])
}
