<<<<<<< HEAD
import { OriginApplication } from '@luxamm/analytics'
import { lxUrls } from 'lx/src/constants/urls'
import { isPlaywrightEnv, isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { ApplicationTransport } from '@l.x/utils/src/telemetry/analytics/ApplicationTransport'
// biome-ignore lint/style/noRestrictedImports: Need direct analytics import for Amplitude initialization
import { analytics, getAnalyticsAtomDirect } from '@l.x/utils/src/telemetry/analytics/analytics'
import store from '~/state'
import { setOriginCountry } from '~/state/user/reducer'

/**
 * Legacy Amplitude init — kept for type compatibility. Events are also forwarded to
 * Hanzo Insights (insights.hanzo.ai) via the sendAnalyticsEvent bridge in send.web.ts.
 * The Amplitude proxy URL will be removed once the migration is complete.
 */
=======
import { OriginApplication } from '@uniswap/analytics'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { isPlaywrightEnv, isTestEnv } from 'utilities/src/environment/env'
import { logger } from 'utilities/src/logger/logger'
// oxlint-disable-next-line no-restricted-imports -- Need direct analytics import for Amplitude initialization
import { analytics, getAnalyticsAtomDirect } from 'utilities/src/telemetry/analytics/analytics'
import { ApplicationTransport } from 'utilities/src/telemetry/analytics/ApplicationTransport'
import store from '~/state'
import { setOriginCountry } from '~/state/user/reducer'

>>>>>>> upstream/main
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
<<<<<<< HEAD
        serverUrl: lxUrls.amplitudeProxyUrl,
=======
        serverUrl: uniswapUrls.amplitudeProxyUrl,
>>>>>>> upstream/main
        appOrigin: OriginApplication.INTERFACE,
        reportOriginCountry: (country: string) => store.dispatch(setOriginCountry(country)),
      }),
      allowed: allowAnalytics,
      initHash: process.env.REACT_APP_GIT_COMMIT_HASH,
    })
  })
}
