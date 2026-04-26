import { brand } from '@l.x/config'
import { isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'

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
      },
    })
  } catch (e) {
    logger.warn('insights.ts', 'setupInsights', 'Failed to initialize Hanzo Insights', e)
  }
}
