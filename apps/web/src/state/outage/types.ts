import { GraphQLApi } from '@l.x/api'
import { UniverseChainId } from 'uniswap/src/features/chains/types'

export type ChainOutageData = {
  chainId: UniverseChainId
  version?: GraphQLApi.ProtocolVersion
}
