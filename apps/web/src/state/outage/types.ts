<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
=======
import { GraphQLApi } from '@universe/api'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
>>>>>>> upstream/main

export type ChainOutageData = {
  chainId: UniverseChainId
  version?: GraphQLApi.ProtocolVersion
}
