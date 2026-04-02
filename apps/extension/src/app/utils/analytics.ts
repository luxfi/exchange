import '@hanzogui/core/reset.css'
import 'src/app/Global.css'
import 'symbol-observable' // Needed by `reduxed-chrome-storage` as polyfill, order matters

import { EXTENSION_ORIGIN_APPLICATION } from 'src/app/version'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { getUniqueId } from '@l.x/utils/src/device/uniqueId'
import { isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { ApplicationTransport } from '@l.x/utils/src/telemetry/analytics/ApplicationTransport'
// biome-ignore lint/style/noRestrictedImports: Direct utilities import required for analytics initialization
import { analytics, getAnalyticsAtomDirect } from '@l.x/utils/src/telemetry/analytics/analytics'

export async function initExtensionAnalytics(): Promise<void> {
  if (isTestEnv()) {
    logger.debug('analytics.ts', 'initExtensionAnalytics', 'Skipping Amplitude initialization in test environment')
    return
  }

  const analyticsAllowed = await getAnalyticsAtomDirect(true)
  await analytics.init({
    transportProvider: new ApplicationTransport({
      serverUrl: lxUrls.amplitudeProxyUrl,
      appOrigin: EXTENSION_ORIGIN_APPLICATION,
    }),
    allowed: analyticsAllowed,
    userIdGetter: getUniqueId,
  })
}
