import { OriginApplication } from '@luxamm/analytics'
import { lxUrls } from 'lx/src/constants/urls'
import { isPlaywrightEnv, isTestEnv } from '@luxfi/utilities/src/environment/env'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { ApplicationTransport } from '@luxfi/utilities/src/telemetry/analytics/ApplicationTransport'
// biome-ignore lint/style/noRestrictedImports: Need direct analytics import for Amplitude initialization
import { analytics, getAnalyticsAtomDirect } from '@luxfi/utilities/src/telemetry/analytics/analytics'
import store from '~/state'
import { setOriginCountry } from '~/state/user/reducer'

/**
 * Legacy Amplitude init — kept for type compatibility. Events are also forwarded to
 * Hanzo Insights (insights.hanzo.ai) via the sendAnalyticsEvent bridge in send.web.ts.
 * The Amplitude proxy URL will be removed once the migration is complete.
 */
export function setupAmplitude() {
  if (isTestEnv() && !isPlaywrightEnv()) {
    // Want to skip Amplitude initialization in test envs
    // But not in playwright, since we have a Playwright fixture that intercepts Amplitude events
    logger.debug('amplitude.ts', 'setupAmplitude', 'Skipping Amplitude initialization in test environment')
    return
  }

  getAnalyticsAtomDirect(true).then((allowAnalytics) => {
    analytics.init({
      transportProvider: new ApplicationTransport({
        serverUrl: lxUrls.amplitudeProxyUrl,
        appOrigin: OriginApplication.INTERFACE,
        reportOriginCountry: (country: string) => store.dispatch(setOriginCountry(country)),
      }),
      allowed: allowAnalytics,
      initHash: process.env.REACT_APP_GIT_COMMIT_HASH,
    })
  })
}
