import { FeatureFlags } from '@l.x/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@l.x/gating/src/hooks'

function getIsHashcashSolverEnabled(): boolean {
  return getFeatureFlag(FeatureFlags.HashcashSolverEnabled)
}

function useIsHashcashSolverEnabled(): boolean {
  return useFeatureFlag(FeatureFlags.HashcashSolverEnabled)
}

export { getIsHashcashSolverEnabled, useIsHashcashSolverEnabled }
