import Insights from '@hanzo/insights'
import { brand, getConfig } from '@l.x/config'
import { getInsightsEnvName } from '@l.x/gating/src/env'
import { isTestEnv } from '@l.x/utils/src/environment/env'

let _insights: Insights | undefined
let _ready = false

export function getInsights(): Insights {
  if (_insights) return _insights
  // Brand config wins (runtime /config.json from KMS-backed K8s deployment).
  // getConfig() is the build-time fallback for local dev / non-K8s targets.
  const apiKey = isTestEnv() ? 'dummy-test-key' : brand.insightsApiKey || getConfig().insightsApiKey
  if (!apiKey) {
    throw new Error('INSIGHTS_API_KEY is not set')
  }
  _insights = new Insights(apiKey, {
    host: brand.insightsHost || getConfig().insightsHostOverride || 'https://insights.hanzo.ai',
    autocapture: false,
    persistence: 'localStorage',
    preloadFeatureFlags: true,
    sendFeatureFlagEvent: true,
    personProfiles: 'identified_only',
    evaluationContexts: [getInsightsEnvName(), 'web'],
  })
  _insights.onFeatureFlags(() => {
    _ready = true
  })
  return _insights
}

export function isInsightsReady(): boolean {
  return _ready
}

export function resetInsights(): void {
  _insights = undefined
  _ready = false
}
