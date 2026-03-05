import { getRetryLink } from 'appGraphql/data/apollo/retryLink'
import { ApolloClient, from, HttpLink } from '@apollo/client'
import { setupSharedApolloCache } from 'lx/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT
if (!API_URL) {
  throw new Error('AWS API ENDPOINT MISSING FROM ENVIRONMENT')
}

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
