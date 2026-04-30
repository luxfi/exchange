import { OriginApplication } from '@luxamm/analytics'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { isPlaywrightEnv, isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { ApplicationTransport } from '@l.x/utils/src/telemetry/analytics/ApplicationTransport'
// biome-ignore lint/style/noRestrictedImports: Need direct analytics import for backend wiring
import { analytics, getAnalyticsAtomDirect } from '@l.x/utils/src/telemetry/analytics/analytics'
import store from '~/state'
import { setOriginCountry } from '~/state/user/reducer'

/**
 * Initializes the analytics layer. The transport handle is kept for legacy
 * compatibility — the active analytics driver (Hanzo Insights by default,
 * registered in `~/tracing/insights.ts`) decides whether to actually use it.
 *
 * No third-party SDK is loaded by this call; the 200+ `sendAnalyticsEvent`
 * call sites flow through the driver registered with `setAnalyticsDriver`.
 */
export function setupAnalytics(): void {
  if (isTestEnv() && !isPlaywrightEnv()) {
    // Skip init in test envs, but still allow Playwright fixtures that
    // intercept analytics traffic.
    logger.debug('analytics.ts', 'setupAnalytics', 'Skipping analytics init in test environment')
    return
  }

  void getAnalyticsAtomDirect(true).then((allowAnalytics) => {
    analytics.init({
      transportProvider: new ApplicationTransport({
        serverUrl: lxUrls.analyticsProxyUrl,
        appOrigin: OriginApplication.INTERFACE,
        reportOriginCountry: (country: string) => store.dispatch(setOriginCountry(country)),
      }),
      allowed: allowAnalytics,
      initHash: process.env.REACT_APP_GIT_COMMIT_HASH,
    })
  })
}
