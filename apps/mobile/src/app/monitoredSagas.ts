<<<<<<< HEAD
import { getMonitoredSagaReducers, type MonitoredSaga } from '@l.x/lx/src/utils/saga'
=======
import { getMonitoredSagaReducers, type MonitoredSaga } from 'uniswap/src/utils/saga'
>>>>>>> upstream/main
import {
  removeDelegationActions,
  removeDelegationReducer,
  removeDelegationSaga,
  removeDelegationSagaName,
<<<<<<< HEAD
} from '@luxfi/wallet/src/features/smartWallet/sagas/removeDelegationSaga'
=======
} from 'wallet/src/features/smartWallet/sagas/removeDelegationSaga'
>>>>>>> upstream/main
import {
  executePlanActions,
  executePlanReducer,
  executePlanSaga,
  executePlanSagaName,
  executeSwapActions,
  executeSwapReducer,
  executeSwapSaga,
  executeSwapSagaName,
  prepareAndSignSwapActions,
  prepareAndSignSwapReducer,
  prepareAndSignSwapSaga,
  prepareAndSignSwapSagaName,
<<<<<<< HEAD
} from '@luxfi/wallet/src/features/transactions/swap/configuredSagas'
=======
} from 'wallet/src/features/transactions/swap/configuredSagas'
>>>>>>> upstream/main
import {
  editAccountActions,
  editAccountReducer,
  editAccountSaga,
  editAccountSagaName,
<<<<<<< HEAD
} from '@luxfi/wallet/src/features/wallet/accounts/editAccountSaga'
=======
} from 'wallet/src/features/wallet/accounts/editAccountSaga'
>>>>>>> upstream/main
import {
  createAccountsActions,
  createAccountsReducer,
  createAccountsSaga,
  createAccountsSagaName,
<<<<<<< HEAD
} from '@luxfi/wallet/src/features/wallet/create/createAccountsSaga'
=======
} from 'wallet/src/features/wallet/create/createAccountsSaga'
>>>>>>> upstream/main

// All monitored sagas must be included here
export const monitoredSagas: Record<string, MonitoredSaga> = {
  [createAccountsSagaName]: {
    name: createAccountsSagaName,
    wrappedSaga: createAccountsSaga,
    reducer: createAccountsReducer,
    actions: createAccountsActions,
  },
  [editAccountSagaName]: {
    name: editAccountSagaName,
    wrappedSaga: editAccountSaga,
    reducer: editAccountReducer,
    actions: editAccountActions,
  },
  [prepareAndSignSwapSagaName]: {
    name: prepareAndSignSwapSagaName,
    wrappedSaga: prepareAndSignSwapSaga,
    reducer: prepareAndSignSwapReducer,
    actions: prepareAndSignSwapActions,
  },
  [executeSwapSagaName]: {
    name: executeSwapSagaName,
    wrappedSaga: executeSwapSaga,
    reducer: executeSwapReducer,
    actions: executeSwapActions,
  },
  [executePlanSagaName]: {
    name: executePlanSagaName,
    wrappedSaga: executePlanSaga,
    reducer: executePlanReducer,
    actions: executePlanActions,
  },
  [removeDelegationSagaName]: {
    name: removeDelegationSagaName,
    wrappedSaga: removeDelegationSaga,
    reducer: removeDelegationReducer,
    actions: removeDelegationActions,
  },
}

export const monitoredSagaReducers = getMonitoredSagaReducers(monitoredSagas)
