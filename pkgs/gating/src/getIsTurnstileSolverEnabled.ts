import { FeatureFlags } from '@l.x/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@l.x/gating/src/hooks'

function getIsTurnstileSolverEnabled(): boolean {
  return getFeatureFlag(FeatureFlags.TurnstileSolverEnabled)
}

function useIsTurnstileSolverEnabled(): boolean {
  return useFeatureFlag(FeatureFlags.TurnstileSolverEnabled)
}

export { getIsTurnstileSolverEnabled, useIsTurnstileSolverEnabled }
