import { GraphQLApi } from '@luxfi/api'
import { useMemo } from 'react'
import { NFTCollectionOption, OnchainItemListOptionType } from 'lx/src/components/lists/items/types'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { fromGraphQLChain } from 'lx/src/features/chains/utils'

function gqlNFTToNFTCollectionOption(
  node: NonNullable<
    NonNullable<NonNullable<NonNullable<GraphQLApi.CollectionSearchQuery>['nftCollections']>['edges']>[0]
  >['node'],
): NFTCollectionOption | null {
  const contract = node.nftContracts?.[0]
  // Only show NFT results that have fully populated results
  const chainId = fromGraphQLChain(contract?.chain ?? GraphQLApi.Chain.Ethereum)
  if (node.name && contract?.address && chainId) {
    return {
      type: OnchainItemListOptionType.NFTCollection,
      chainId,
      address: contract.address,
      name: node.name,
      imageUrl: node.image?.url ?? null,
      isVerified: Boolean(node.isVerified),
    }
  }
  return null
}

export function useNftSearchResultsToNftCollectionOptions(
  nftSearchResultsData: GraphQLApi.CollectionSearchQuery | undefined,
  chainFilter: UniverseChainId | null,
): NFTCollectionOption[] {
  return useMemo(() => {
    const edges = nftSearchResultsData?.nftCollections?.edges ?? []
    return edges.reduce<NFTCollectionOption[]>((acc, { node }) => {
      const option: NFTCollectionOption | null = gqlNFTToNFTCollectionOption(node)

      if (option && (chainFilter === null || option.chainId === chainFilter)) {
        acc.push(option)
      }
      return acc
    }, [])
  }, [nftSearchResultsData, chainFilter])
}
