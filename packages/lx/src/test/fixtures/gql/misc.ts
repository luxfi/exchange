import { GraphQLApi } from '@luxfi/api'
import { faker } from 'lx/src/test/shared'
import { createFixture } from 'lx/src/test/utils'

export const GQL_CHAINS = [
  GraphQLApi.Chain.Ethereum,
  GraphQLApi.Chain.EthereumSepolia,
  GraphQLApi.Chain.Arbitrum,
  GraphQLApi.Chain.Optimism,
  GraphQLApi.Chain.Polygon,
  GraphQLApi.Chain.Base,
  GraphQLApi.Chain.Bnb,
]

export const image = createFixture<GraphQLApi.Image>()(() => ({
  __typename: 'Image',
  id: faker.datatype.uuid(),
  url: faker.image.imageUrl(),
}))
