import Insights from '@hanzo/insights-react-native'
import { getConfig } from '@l.x/config'
import { getInsightsEnvName } from '@l.x/gating/src/env'

let _insights: Insights | undefined
let _ready = false

export function getInsights(): Insights {
  if (_insights) return _insights
  const apiKey = getConfig().insightsApiKey
  if (!apiKey) {
    throw new Error('INSIGHTS_API_KEY is not set')
  }
  _insights = new Insights(apiKey, {
    host: getConfig().insightsHostOverride || 'https://insights.hanzo.ai',
    autocapture: false,
    preloadFeatureFlags: true,
    sendFeatureFlagEvent: true,
    personProfiles: 'identified_only',
    evaluationContexts: [getInsightsEnvName(), 'native'],
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
