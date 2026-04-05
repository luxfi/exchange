<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
=======
import { GraphQLApi } from '@universe/api'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
>>>>>>> upstream/main
import { supportedChainIdFromGQLChain } from '~/appGraphql/data/chainUtils'

export function getNativeTokenDBAddress(chain: GraphQLApi.Chain): string | undefined {
  const pageChainId = supportedChainIdFromGQLChain(chain)
  if (pageChainId === undefined) {
    return undefined
  }

  return getChainInfo(pageChainId).backendChain.nativeTokenBackendAddress
}
