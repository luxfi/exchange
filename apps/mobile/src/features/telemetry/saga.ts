import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid'
import { ANONYMOUS_DEVICE_ID, OriginApplication } from '@uniswap/analytics'
import DeviceInfo from 'react-native-device-info'
import { call, delay, fork, select } from 'typed-redux-saga'
import { uniswapUrls } from '@l.x/lx/src/constants/urls'
import { MobileUserPropertyName } from '@l.x/lx/src/features/telemetry/user'
import { getUniqueId } from '@l.x/utils/src/device/uniqueId'
import { isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { isAndroid } from '@l.x/utils/src/platform'
// oxlint-disable-next-line no-restricted-imports -- Required for analytics initialization
import { analytics } from '@l.x/utils/src/telemetry/analytics/analytics'
import { ApplicationTransport } from '@l.x/utils/src/telemetry/analytics/ApplicationTransport'
import { selectAllowAnalytics } from '@luxfi/wallet/src/features/telemetry/selectors'
import { watchTransactionEvents } from '@luxfi/wallet/src/features/transactions/watcher/transactionFinalizationSaga'

export function* telemetrySaga() {
  if (isTestEnv()) {
    logger.debug('telemetry/saga.ts', 'telemetrySaga', 'Skipping Amplitude initialization in test environment')
  } else {
    yield* delay(1)

    const allowAnalytics = yield* select(selectAllowAnalytics)

    yield* call(analytics.init, {
      transportProvider: new ApplicationTransport({
        serverUrl: uniswapUrls.amplitudeProxyUrl,
        appOrigin: OriginApplication.MOBILE,
        originOverride: uniswapUrls.apiOrigin,
        appBuild: DeviceInfo.getBundleId(),
      }),
      allowed: allowAnalytics,
      userIdGetter: getUniqueId,
    })

    if (isAndroid) {
      // Only need GAID, not using IDFA
      const advertisingInfoResponse = yield* call(ReactNativeIdfaAaid.getAdvertisingInfo)
      const adTrackingAllowed = allowAnalytics && !advertisingInfoResponse.isAdTrackingLimited
      if (adTrackingAllowed) {
        yield* call(
          analytics.setUserProperty,
          MobileUserPropertyName.AdvertisingId,
          advertisingInfoResponse.id ? advertisingInfoResponse.id : ANONYMOUS_DEVICE_ID,
        )
      }
    }
  }

  yield* fork(watchTransactionEvents)
}
