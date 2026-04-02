import { ApolloClient, from, HttpLink } from '@apollo/client'
import { setupSharedApolloCache } from '@l.x/lx/src/data/cache'
import { getDatadogApolloLink } from '@luxfi/utilities/src/logger/datadog/datadogLink'
import { getRetryLink } from '~/appGraphql/data/apollo/retryLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || 'https://api-exchange.lux.network/v1/graphql'

const httpLink = new HttpLink({ uri: API_URL })
const datadogLink = getDatadogApolloLink()
const retryLink = getRetryLink()

export const apolloClient: any = new ApolloClient({
  connectToDevTools: true,
  // @ts-expect-error -- ApolloLink type mismatch between duplicate @apollo/client installs
  link: from([datadogLink, retryLink, httpLink]),
  headers: {
    'Content-Type': 'application/json',
    Origin: 'https://lux.exchange',
  },
  cache: setupSharedApolloCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
