import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache } from '@apollo/client'
import { SupportedChainId } from 'constants/chains'

import store, { AppState } from '../../state/index'

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  [SupportedChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',

  [SupportedChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',

  [SupportedChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',

  [SupportedChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',

  [SupportedChainId.CELO]: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo',

  [SupportedChainId.LUX]: 'https://graph.lux.network/subgraphs/name/lux/uniswap-v3',

  [SupportedChainId.ZOO]: 'https://graph.zoo.network/subgraphs/name/zoo/uniswap-v3',
}

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET] })

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = (store.getState() as AppState).application.chainId

  operation.setContext(() => ({
    uri:
      chainId && CHAIN_SUBGRAPH_URL[chainId]
        ? CHAIN_SUBGRAPH_URL[chainId]
        : CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
  }))

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
})

export const luxNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://graph.lux.network/subgraphs/name/lux/uniswap-v3",
  }),
  cache: new InMemoryCache(),
})


export const zooNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://graph.zoo.network/subgraphs/name/zoo/uniswap-v3",
  }),
  cache: new InMemoryCache(),
})

export const ethereumNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
  }),
  cache: new InMemoryCache(),
})

export const arbitrumNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM",
  }),
  cache: new InMemoryCache(),
})

export const polygonNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm",
  }),
  cache: new InMemoryCache(),
})

export const optimismNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj",
  }),
  cache: new InMemoryCache(),
})

export const celoNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4",
  }),
  cache: new InMemoryCache(),
})

export const baseNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
  }),
  cache: new InMemoryCache(),
})

export const bnbNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/G5MUbSBM7Nsrm9tH2tGQUiAF4SZDGf2qeo1xPLYjKr7K",
  }),
  cache: new InMemoryCache(),
})

export const luxNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/GVH9h9KZ9CqheUEL93qMbq7QwgoBu32QXQDPR6bev4Eo",
  }),
  cache: new InMemoryCache(),
})

export const blastNetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://gateway.thegraph.com/api/0004b7085b345be5e7c1e5fbdbf14135/subgraphs/id/2LHovKznvo8YmKC9ZprPjsYAZDCc4K5q4AYz8s3cnQn1",
  }),
  cache: new InMemoryCache(),
})