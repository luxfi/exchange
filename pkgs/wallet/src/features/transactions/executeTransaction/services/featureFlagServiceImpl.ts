import { ExperimentProperties, FeatureFlags, getExperimentValue, getFeatureFlag } from '@luxexchange/gating'
import { FeatureFlagService } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/featureFlagService'

export const createFeatureFlagService = (): FeatureFlagService => {
  return {
    isFeatureEnabled: (flagName: FeatureFlags): boolean => {
      return getFeatureFlag(flagName)
    },
    getExperimentValue: <E extends keyof ExperimentProperties, P extends ExperimentProperties[E], T>({
      experiment,
      property,
      defaultValue,
    }: {
      experiment: E
      property: P
      defaultValue: T
    }): T => {
      return getExperimentValue({
        experiment,
        param: property,
        defaultValue,
      })
    },
  }
}
