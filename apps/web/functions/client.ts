import { ApolloClient, InMemoryCache } from '@apollo/client'

const GRAPHQL_ENDPOINT = 'https://api-exchange.lux.network/v1/graphql'

export default new ApolloClient({
  connectToDevTools: false,
  uri: GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    Origin: 'https://lux.exchange',
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
