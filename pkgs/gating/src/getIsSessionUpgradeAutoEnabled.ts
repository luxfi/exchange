import { getConfig } from '@luxexchange/config'
import { FeatureFlags } from '@luxexchange/gating/src/flags'
import { getFeatureFlag } from '@luxexchange/gating/src/hooks'

function getIsSessionUpgradeAutoEnabled(): boolean {
  return getConfig().enableSessionUpgradeAuto || getFeatureFlag(FeatureFlags.SessionsUpgradeAutoEnabled)
}

export { getIsSessionUpgradeAutoEnabled }
