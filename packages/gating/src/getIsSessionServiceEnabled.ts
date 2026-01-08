import { getConfig } from '@luxfi/config'
import { FeatureFlags } from '@luxfi/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@luxfi/gating/src/hooks'

function getIsSessionServiceEnabled(): boolean {
  return getConfig().enableSessionService || getFeatureFlag(FeatureFlags.SessionsServiceEnabled)
}

function useIsSessionServiceEnabled(): boolean {
  const featureFlagEnabled = useFeatureFlag(FeatureFlags.SessionsServiceEnabled)
  return getConfig().enableSessionService || featureFlagEnabled
}

export { getIsSessionServiceEnabled, useIsSessionServiceEnabled }
