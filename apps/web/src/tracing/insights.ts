import { brand } from '@l.x/config'
import { isTestEnv } from '@luxfi/utilities/src/environment/env'
import { logger } from '@luxfi/utilities/src/logger/logger'

const INSIGHTS_API_KEY = process.env.REACT_APP_INSIGHTS_API_KEY || 'hi_a5316882b930d11c9183007d70c3955b'
const INSIGHTS_HOST = process.env.REACT_APP_INSIGHTS_HOST || 'https://insights.hanzo.ai'

let insightsClient: any = null

export function getInsightsClient() {
  return insightsClient
}

export async function setupInsights() {
  if (isTestEnv()) {
    logger.debug('insights.ts', 'setupInsights', 'Skipping Insights initialization in test environment')
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
