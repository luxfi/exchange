import { OriginApplication } from '@luxamm/analytics'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { isPlaywrightEnv, isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { ApplicationTransport } from '@l.x/utils/src/telemetry/analytics/ApplicationTransport'
// biome-ignore lint/style/noRestrictedImports: Need direct analytics import for Amplitude initialization
import { analytics, getAnalyticsAtomDirect } from '@l.x/utils/src/telemetry/analytics/analytics'
import store from '~/state'
import { setOriginCountry } from '~/state/user/reducer'

/**
 * Legacy Amplitude init. Hanzo Insights (`setupInsights()`) is the canonical
 * analytics path for the Lux ecosystem; Amplitude only initializes when an
 * API key is explicitly set, so white-label deploys (Liquidity, Zoo, Pars)
 * that opt out get a clean no-op without firing requests at amplitude.com
 * or a malformed proxy URL.
 */
export function setupAmplitude() {
  if (isTestEnv() && !isPlaywrightEnv()) {
    // Want to skip Amplitude initialization in test envs
    // But not in playwright, since we have a Playwright fixture that intercepts Amplitude events
    logger.debug('amplitude.ts', 'setupAmplitude', 'Skipping Amplitude initialization in test environment')
    return
  }

  // Gate on explicit API key — same pattern as setupInsights(). When the
  // key isn't set we skip init entirely instead of pointing the SDK at a
  // proxy URL that doesn't exist on the deploy target.
  if (!process.env.REACT_APP_AMPLITUDE_API_KEY) {
    logger.debug('amplitude.ts', 'setupAmplitude', 'Amplitude not configured (REACT_APP_AMPLITUDE_API_KEY unset) — skipping')
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
