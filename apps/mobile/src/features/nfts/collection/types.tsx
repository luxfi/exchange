import { GraphQLApi } from '@luxfi/api'

export type NFTCollectionData = GraphQLApi.Maybe<
  NonNullable<NonNullable<GraphQLApi.NftCollectionScreenQuery['nftCollections']>['edges']>[0]['node']
>
