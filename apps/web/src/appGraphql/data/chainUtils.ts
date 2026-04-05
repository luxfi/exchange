<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
import { GqlChainId, UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { fromGraphQLChain, isBackendSupportedChain } from '@l.x/lx/src/features/chains/utils'
=======
import { GraphQLApi } from '@universe/api'
import { GqlChainId, UniverseChainId } from 'uniswap/src/features/chains/types'
import { fromGraphQLChain, isBackendSupportedChain } from 'uniswap/src/features/chains/utils'
>>>>>>> upstream/main

export function supportedChainIdFromGQLChain(chain: GqlChainId): UniverseChainId
export function supportedChainIdFromGQLChain(chain: GraphQLApi.Chain): UniverseChainId | undefined
export function supportedChainIdFromGQLChain(chain: GraphQLApi.Chain): UniverseChainId | undefined {
  return isBackendSupportedChain(chain) ? (fromGraphQLChain(chain) ?? undefined) : undefined
}
