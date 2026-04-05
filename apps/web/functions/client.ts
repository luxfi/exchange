import { ApolloClient, InMemoryCache } from '@apollo/client'
<<<<<<< HEAD
import { brand, getGatewayUrl } from '@l.x/config'

// GraphQL endpoint derived from brand config (falls back to Lux gateway)
const GRAPHQL_ENDPOINT = getGatewayUrl('/v1/graphql')

=======

const GRAPHQL_ENDPOINT = 'https://interface.gateway.uniswap.org/v1/graphql'

//TODO: Figure out how to make ApolloClient global variable
>>>>>>> upstream/main
export default new ApolloClient({
  connectToDevTools: false,
  uri: GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
<<<<<<< HEAD
    Origin: `https://${brand.appDomain || 'lux.exchange'}`,
=======
    Origin: 'https://app.uniswap.org',
>>>>>>> upstream/main
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36',
  },
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
})
