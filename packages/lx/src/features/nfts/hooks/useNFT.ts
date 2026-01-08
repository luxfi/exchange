import { GqlResult, GraphQLApi } from '@luxfi/api'
import { useMemo } from 'react'
import { PollingInterval } from 'lx/src/constants/misc'
import { GQLNftAsset } from 'lx/src/features/nfts/types'

export function useNFT({
  owner = '',
  address,
  tokenId,
}: {
  owner?: Address
  address?: Address
  tokenId?: string
}): GqlResult<GQLNftAsset> {
  // TODO: [MOB-227] do a direct cache lookup in Apollo using id instead of re-querying
  const { data, loading, refetch } = GraphQLApi.useNftsQuery({
    variables: { ownerAddress: owner },
    pollInterval: PollingInterval.Slow,
    skip: !owner,
  })

  const nft = useMemo(
    () =>
      data?.portfolios?.[0]?.nftBalances?.find(
        (balance) => balance?.ownedAsset?.nftContract?.address === address && balance?.ownedAsset?.tokenId === tokenId,
      )?.ownedAsset ?? undefined,
    [data, address, tokenId],
  )

  return { data: nft, loading, refetch }
}
