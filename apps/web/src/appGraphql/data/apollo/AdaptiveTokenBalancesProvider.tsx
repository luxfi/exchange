<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
=======
import { GraphQLApi } from '@universe/api'
>>>>>>> upstream/main
import { createAdaptiveRefetchContext } from '~/appGraphql/data/apollo/AdaptiveRefetch'

const {
  Provider: AdaptiveTokenBalancesProvider,
  useQuery: useTokenBalancesQuery,
  PrefetchWrapper: PrefetchBalancesWrapper,
} = createAdaptiveRefetchContext<GraphQLApi.PortfolioBalancesQueryResult>()

export { AdaptiveTokenBalancesProvider, PrefetchBalancesWrapper, useTokenBalancesQuery }
