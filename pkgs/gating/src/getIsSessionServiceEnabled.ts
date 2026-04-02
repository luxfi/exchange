import { getConfig } from '@luxexchange/config'
import { FeatureFlags } from '@luxexchange/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@luxexchange/gating/src/hooks'

function getIsSessionServiceEnabled(): boolean {
  return getConfig().enableSessionService || getFeatureFlag(FeatureFlags.SessionsServiceEnabled)
}

function useIsSessionServiceEnabled(): boolean {
  const featureFlagEnabled = useFeatureFlag(FeatureFlags.SessionsServiceEnabled)
  return getConfig().enableSessionService || featureFlagEnabled
}

export { getIsSessionServiceEnabled, useIsSessionServiceEnabled }
