import { FeatureFlags } from '@luxexchange/gating/src/flags'
import { getFeatureFlag, useFeatureFlag } from '@luxexchange/gating/src/hooks'

function getIsHashcashSolverEnabled(): boolean {
  return getFeatureFlag(FeatureFlags.HashcashSolverEnabled)
}

function useIsHashcashSolverEnabled(): boolean {
  return useFeatureFlag(FeatureFlags.HashcashSolverEnabled)
}

export { getIsHashcashSolverEnabled, useIsHashcashSolverEnabled }
