import { brand } from '@l.x/config'
import { isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { setAnalyticsDriver } from '@l.x/utils/src/telemetry/analytics/backend'

const INSIGHTS_API_KEY = process.env.REACT_APP_INSIGHTS_API_KEY || ''
const INSIGHTS_HOST = process.env.REACT_APP_INSIGHTS_HOST || ''

let insightsClient: any = null

export function getInsightsClient() {
  return insightsClient
}

/**
 * Bridge a Hanzo Insights client into the analytics backend so all
 * `sendAnalyticsEvent(...)` calls (~200+ across the codebase) flow through
 * `insights.capture(...)`. The driver is provider-shaped — swap in any
 * implementation of `AnalyticsDriver` to retarget the same call sites.
 */
function registerInsightsDriver(insights: any): void {
  setAnalyticsDriver({
    capture: (event, props) => insights.capture?.(event, props),
    identify: (userId, props) => insights.identify?.(userId, props),
    setUserProperties: (props) => {
      // Hanzo Insights uses setPersonProperties; fall
      // back to register() for super-properties when setPersonProperties
      // isn't available on the loaded client.
      if (typeof insights.setPersonProperties === 'function') {
        insights.setPersonProperties(props)
      } else if (typeof insights.register === 'function') {
        insights.register(props)
      }
    },
    flush: () => (typeof insights.flush === 'function' ? insights.flush() : undefined),
    reset: () => insights.reset?.(),
  })
}

export async function setupInsights() {
  if (isTestEnv()) {
    logger.debug('insights.ts', 'setupInsights', 'Skipping Insights initialization in test environment')
    return
  }

  if (!INSIGHTS_API_KEY || !INSIGHTS_HOST) {
    logger.debug(
      'insights.ts',
      'setupInsights',
      'Insights not configured (REACT_APP_INSIGHTS_HOST/API_KEY unset) — skipping',
    )
    return
  }

  try {
    const pkg = '@hanzo/insights'
    const mod: any = await import(/* @vite-ignore */ pkg).catch(() => null)
    if (!mod) {
      logger.debug('insights.ts', 'setupInsights', '@hanzo/insights not installed — skipping')
      return
    }
    const Insights = mod.default ?? mod
    const appSlug = brand.appDomain?.replace(/\./g, '-') || 'lux-exchange'
    insightsClient = new Insights(INSIGHTS_API_KEY, {
      api_host: INSIGHTS_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: 'localStorage',
      loaded: (insights: any) => {
        logger.debug('insights.ts', 'setupInsights', 'Hanzo Insights initialized')
        insights.register({
          app: appSlug,
          app_version: process.env.REACT_APP_GIT_COMMIT_HASH || 'unknown',
          platform: 'web',
        })
        ;(window as any).__INSIGHTS = insights
        // Wire the analytics backend's driver so `sendAnalyticsEvent`
        // flows through Insights.capture() instead of a third-party SDK.
        registerInsightsDriver(insights)
      },
    })
  } catch (e) {
    logger.warn('insights.ts', 'setupInsights', 'Failed to initialize Hanzo Insights', e)
  }
}
