import { call } from 'typed-redux-saga'
import { ExtensionEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { createMonitoredSaga } from '@l.x/lx/src/utils/saga'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { AuthActionType, AuthSagaError, LockParams, UnlockParams } from '@luxfi/wallet/src/features/auth/types'
import { Keyring } from '@luxfi/wallet/src/features/wallet/Keyring/Keyring'

function* auth(params: UnlockParams | LockParams) {
  logger.debug('authSaga', 'auth', `Using monitored auth saga`)

  if (params.type === AuthActionType.Unlock) {
    return yield* call(unlock, params)
  } else {
    return yield* call(lock)
  }
}

function* unlock({ password }: UnlockParams) {
  logger.debug('authSaga', 'unlock', `Unlocking wallet`)
  const success = yield* call(Keyring.unlock, password)
  if (!success) {
    throw new Error(AuthSagaError.InvalidPassword)
  }
  yield* call(sendAnalyticsEvent, ExtensionEventName.ChangeLockedState, {
    locked: false,
    location: 'sidebar',
  })
}

function* lock() {
  logger.debug('authSaga', 'lock', `Locking wallet`)
  yield* call(Keyring.lock)
  yield* call(sendAnalyticsEvent, ExtensionEventName.ChangeLockedState, {
    locked: true,
    location: 'sidebar',
  })
}

export const {
  name: authSagaName,
  wrappedSaga: authSaga,
  reducer: authReducer,
  actions: authActions,
} = createMonitoredSaga({
  saga: auth,
  name: 'auth',
  options: { showErrorNotification: false, doNotLogErrors: [AuthSagaError.InvalidPassword] },
})
