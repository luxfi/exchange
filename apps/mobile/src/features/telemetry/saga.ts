import { getInsights } from '@l.x/gating'
import { call, fork, select } from 'typed-redux-saga'
import { getUniqueId } from '@l.x/utils/src/device/uniqueId'
import { isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { selectAllowAnalytics } from '@luxfi/wallet/src/features/telemetry/selectors'
import { watchTransactionEvents } from '@luxfi/wallet/src/features/transactions/watcher/transactionFinalizationSaga'

export function* telemetrySaga() {
  if (isTestEnv()) {
    logger.debug('telemetry/saga.ts', 'telemetrySaga', 'Skipping telemetry init in test env')
  } else {
    const allowAnalytics = yield* select(selectAllowAnalytics)
    try {
      const insights = getInsights()
      const distinctId = yield* call(getUniqueId)
      insights.identify(distinctId, { allow_analytics: allowAnalytics })
      insights.register({ platform: 'native' })
    } catch (e) {
      logger.warn('telemetry/saga.ts', 'telemetrySaga', 'Failed to initialize Insights', e)
    }
  }

  yield* fork(watchTransactionEvents)
}
