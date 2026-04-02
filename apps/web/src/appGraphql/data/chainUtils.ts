import { GraphQLApi } from '@luxexchange/api'
import { GqlChainId, UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { fromGraphQLChain, isBackendSupportedChain } from '@luxexchange/lx/src/features/chains/utils'

export function supportedChainIdFromGQLChain(chain: GqlChainId): UniverseChainId
export function supportedChainIdFromGQLChain(chain: GraphQLApi.Chain): UniverseChainId | undefined
export function supportedChainIdFromGQLChain(chain: GraphQLApi.Chain): UniverseChainId | undefined {
  return isBackendSupportedChain(chain) ? (fromGraphQLChain(chain) ?? undefined) : undefined
}
