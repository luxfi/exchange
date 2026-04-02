import { FeatureFlags } from '@luxexchange/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@luxexchange/gating/src/hooks'

function getIsTurnstileSolverEnabled(): boolean {
  return getFeatureFlag(FeatureFlags.TurnstileSolverEnabled)
}

function useIsTurnstileSolverEnabled(): boolean {
  return useFeatureFlag(FeatureFlags.TurnstileSolverEnabled)
}

export { getIsTurnstileSolverEnabled, useIsTurnstileSolverEnabled }
