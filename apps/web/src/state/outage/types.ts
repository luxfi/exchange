import { GraphQLApi } from '@l.x/api'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

export type ChainOutageData = {
  chainId: UniverseChainId
  version?: GraphQLApi.ProtocolVersion
}
