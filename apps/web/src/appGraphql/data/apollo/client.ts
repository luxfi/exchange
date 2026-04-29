import { brand, getApiUrl, getBrandUrl, getDocsUrl } from '@l.x/config'
import { ApolloClient, from, HttpLink } from '@apollo/client'
import { setupSharedApolloCache } from '@l.x/lx/src/data/cache'
import { getDatadogApolloLink } from '@l.x/utils/src/logger/datadog/datadogLink'
import { getRetryLink } from '~/appGraphql/data/apollo/retryLink'

// Resolve the GraphQL endpoint per-request so white-label deploys pick up
// the value from /brand.json (api.graphql) once loadBrandConfig() runs.
// Order: runtime brand config → REACT_APP_AWS_API_ENDPOINT → upstream fallback.
const FALLBACK_API_URL =
  process.env.REACT_APP_AWS_API_ENDPOINT || 'https://dex.lux.network/v1/graphql'

const httpLink = new HttpLink({
  uri: () => getApiUrl('graphql') || FALLBACK_API_URL,
})
const datadogLink = getDatadogApolloLink()
const retryLink = getRetryLink()

export const apolloClient: any = new ApolloClient({
  connectToDevTools: true,
  // @ts-expect-error -- ApolloLink type mismatch between duplicate @apollo/client installs
  link: from([datadogLink, retryLink, httpLink]),
  headers: {
    'Content-Type': 'application/json',
    Origin: getBrandUrl(''),
  },
  cache: setupSharedApolloCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
