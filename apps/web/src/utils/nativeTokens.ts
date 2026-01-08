import { supportedChainIdFromGQLChain } from 'appGraphql/data/util'
import { GraphQLApi } from '@luxfi/api'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'

export function getNativeTokenDBAddress(chain: GraphQLApi.Chain): string | undefined {
  const pageChainId = supportedChainIdFromGQLChain(chain)
  if (pageChainId === undefined) {
    return undefined
  }

  return getChainInfo(pageChainId).backendChain.nativeTokenBackendAddress
}
