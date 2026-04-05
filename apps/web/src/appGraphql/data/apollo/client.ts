<<<<<<< HEAD
import { brand, getBrandUrl, getDocsUrl } from '@l.x/config'
import { ApolloClient, from, HttpLink } from '@apollo/client'
import { setupSharedApolloCache } from '@l.x/lx/src/data/cache'
import { getDatadogApolloLink } from '@l.x/utils/src/logger/datadog/datadogLink'
import { getRetryLink } from '~/appGraphql/data/apollo/retryLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || 'https://api-exchange.lux.network/v1/graphql'
=======
import { ApolloClient, from, HttpLink } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'
import { getRetryLink } from '~/appGraphql/data/apollo/retryLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT
if (!API_URL) {
  throw new Error('AWS API ENDPOINT MISSING FROM ENVIRONMENT')
}
>>>>>>> upstream/main

const httpLink = new HttpLink({ uri: API_URL })
const datadogLink = getDatadogApolloLink()
const retryLink = getRetryLink()

<<<<<<< HEAD
export const apolloClient: any = new ApolloClient({
  connectToDevTools: true,
  // @ts-expect-error -- ApolloLink type mismatch between duplicate @apollo/client installs
  link: from([datadogLink, retryLink, httpLink]),
  headers: {
    'Content-Type': 'application/json',
    Origin: getBrandUrl(''),
=======
export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  link: from([datadogLink, retryLink, httpLink]),
  headers: {
    'Content-Type': 'application/json',
    Origin: 'https://app.uniswap.org',
>>>>>>> upstream/main
  },
  cache: setupSharedApolloCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
