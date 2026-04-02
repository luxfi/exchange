import { GraphQLApi } from '@luxexchange/api'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'

export type ChainOutageData = {
  chainId: UniverseChainId
  version?: GraphQLApi.ProtocolVersion
}
