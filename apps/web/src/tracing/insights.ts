import { brand } from '@l.x/config'
import { isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'

// Insights is fully opt-in via env. No hardcoded API key or host —
// white-label builds (liquidity, zoo) self-host their own insights and
// supply their own keys; the canonical Lux build supplies its own.
// When unset, setupInsights becomes a no-op so we never leak telemetry
// to a host the consuming brand didn't configure.
const INSIGHTS_API_KEY = process.env.REACT_APP_INSIGHTS_API_KEY || ''
const INSIGHTS_HOST = process.env.REACT_APP_INSIGHTS_HOST || ''

let insightsClient: any = null

export function getInsightsClient() {
  return insightsClient
}

export async function setupInsights() {
  if (isTestEnv()) {
    logger.debug('insights.ts', 'setupInsights', 'Skipping Insights initialization in test environment')
    return
  }

  if (!INSIGHTS_API_KEY || !INSIGHTS_HOST) {
    logger.debug('insights.ts', 'setupInsights', 'Insights not configured (REACT_APP_INSIGHTS_HOST/API_KEY unset) — skipping')
    return
  }

  try {
    const { default: Insights } = await import('@hanzo/insights')
    const appSlug = brand.appDomain?.replace(/\./g, '-') || 'lux-exchange'
    insightsClient = new Insights(INSIGHTS_API_KEY, {
      api_host: INSIGHTS_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: 'localStorage',
      loaded: (insights) => {
        logger.debug('insights.ts', 'setupInsights', 'Hanzo Insights initialized')
        // Identify the app
        insights.register({
          app: appSlug,
          app_version: process.env.REACT_APP_GIT_COMMIT_HASH || 'unknown',
          platform: 'web',
        })
        // Expose capture globally so pkgs/lx telemetry can forward events
        ;(window as any).__INSIGHTS = insights
      },
    })
  } catch (e) {
    logger.warn('insights.ts', 'setupInsights', 'Failed to initialize Hanzo Insights', e)
  }
}
