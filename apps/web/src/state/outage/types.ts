import { GraphQLApi } from '@luxfi/api'
import { UniverseChainId } from 'lx/src/features/chains/types'

export type ChainOutageData = {
  chainId: UniverseChainId
  version?: GraphQLApi.ProtocolVersion
}
