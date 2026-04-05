import { dappStore } from 'src/app/features/dapp/store'
import { call } from 'typed-redux-saga'
<<<<<<< HEAD
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

// Initialize Dapp Store
export function* initDappStore() {
  logger.debug('dappStoreSaga', 'initDappStore', 'Initializing Dapp Store')
  yield* call(dappStore.init)
}
