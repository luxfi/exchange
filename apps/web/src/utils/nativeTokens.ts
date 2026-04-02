import { GraphQLApi } from '@luxexchange/api'
import { getChainInfo } from '@luxexchange/lx/src/features/chains/chainInfo'
import { supportedChainIdFromGQLChain } from '~/appGraphql/data/chainUtils'

export function getNativeTokenDBAddress(chain: GraphQLApi.Chain): string | undefined {
  const pageChainId = supportedChainIdFromGQLChain(chain)
  if (pageChainId === undefined) {
    return undefined
  }

  return getChainInfo(pageChainId).backendChain.nativeTokenBackendAddress
}
