import { nativeOnChain } from 'constants/tokens'
import { Chain } from 'graphql/data/__generated__/types-and-hooks'
import { CHAIN_NAME_TO_CHAIN_ID } from 'graphql/data/util'

export function getNativeTokenDBAddress(chain: Chain): string | undefined {
  const pageChainId = CHAIN_NAME_TO_CHAIN_ID[chain]
  switch (chain) {
    case Chain.Celo:
    case Chain.Polygon:
      return nativeOnChain(pageChainId).wrapped.address
    case Chain.Ethereum:
    case Chain.Base:
    case Chain.Arbitrum:
    case Chain.EthereumGoerli:
    case Chain.Optimism:
      return undefined
    default:
      return undefined
  }
}
