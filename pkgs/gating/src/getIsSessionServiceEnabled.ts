import { getConfig } from '@l.x/config'
import { FeatureFlags } from '@l.x/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@l.x/gating/src/hooks'

function getIsSessionServiceEnabled(): boolean {
  return getConfig().enableSessionService || getFeatureFlag(FeatureFlags.SessionsServiceEnabled)
}

function useIsSessionServiceEnabled(): boolean {
  const featureFlagEnabled = useFeatureFlag(FeatureFlags.SessionsServiceEnabled)
  return getConfig().enableSessionService || featureFlagEnabled
}

export { getIsSessionServiceEnabled, useIsSessionServiceEnabled }
