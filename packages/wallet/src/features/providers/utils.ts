import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { RPCType, UniverseChainId } from 'lx/src/features/chains/types'

export function isPrivateRpcSupportedOnChain(chainId: UniverseChainId): boolean {
  return Boolean(getChainInfo(chainId).rpcUrls[RPCType.Private])
}
