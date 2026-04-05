import { createPrepareAndSignDappTransactionSaga } from 'src/app/features/dappRequests/sagas/prepareAndSignDappTransactionSaga'
<<<<<<< HEAD
import { createMonitoredSaga } from '@l.x/lx/src/utils/saga'
import { getSharedTransactionSagaDependencies } from '@luxfi/wallet/src/features/transactions/configuredSagas'
=======
import { createMonitoredSaga } from 'uniswap/src/utils/saga'
import { getSharedTransactionSagaDependencies } from 'wallet/src/features/transactions/configuredSagas'
>>>>>>> upstream/main

// Create configured saga instance using shared transaction dependencies
const configuredPrepareAndSignDappTransactionSaga = createPrepareAndSignDappTransactionSaga(
  getSharedTransactionSagaDependencies(),
)

// Export the monitored saga
export const {
  name: prepareAndSignDappTransactionSagaName,
  wrappedSaga: prepareAndSignDappTransactionSaga,
  reducer: prepareAndSignDappTransactionReducer,
  actions: prepareAndSignDappTransactionActions,
} = createMonitoredSaga({
  saga: configuredPrepareAndSignDappTransactionSaga,
  name: 'prepareAndSignDappTransaction',
})
