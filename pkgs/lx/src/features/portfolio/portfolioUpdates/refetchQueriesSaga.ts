import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { refetchRestQueriesViaOnchainOverrideVariant } from 'lx/src/features/portfolio/portfolioUpdates/rest/refetchRestQueriesViaOnchainOverrideVariantSaga'
import { TransactionDetails } from 'lx/src/features/transactions/types/transactionDetails'

export function* refetchQueries({
  transaction,
  apolloClient,
  activeAddress,
}: {
  transaction: TransactionDetails
  apolloClient: ApolloClient<NormalizedCacheObject>
  activeAddress: string | null
}) {
  yield* refetchRestQueriesViaOnchainOverrideVariant({ transaction, apolloClient, activeAddress })
}
