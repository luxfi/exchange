import { spawn } from 'typed-redux-saga'
import { type MonitoredSaga } from 'lx/src/utils/saga'
import { notificationWatcher } from '@luxfi/wallet/src/features/notifications/notificationWatcherSaga'
import { initProviders } from '@luxfi/wallet/src/features/providers/saga'
import {
  sendTokenActions,
  sendTokenReducer,
  sendTokenSaga,
  sendTokenSagaName,
} from '@luxfi/wallet/src/features/transactions/send/sendTokenSaga'

// Sagas that are spawned at startup
const walletSagas = [initProviders, notificationWatcher] as const

export const walletMonitoredSagas: Record<string, MonitoredSaga> = {
  [sendTokenSagaName]: {
    name: sendTokenSagaName,
    wrappedSaga: sendTokenSaga,
    reducer: sendTokenReducer,
    actions: sendTokenActions,
  },
}

export function* rootWalletSaga() {
  for (const s of walletSagas) {
    yield* spawn(s)
  }

  for (const m of Object.values(walletMonitoredSagas)) {
    yield* spawn(m['wrappedSaga'])
  }
}
