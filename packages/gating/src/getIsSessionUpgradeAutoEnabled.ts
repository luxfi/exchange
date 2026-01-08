import { getConfig } from '@luxfi/config'
import { FeatureFlags } from '@luxfi/gating/src/flags'
import { getFeatureFlag } from '@luxfi/gating/src/hooks'

function getIsSessionUpgradeAutoEnabled(): boolean {
  return getConfig().enableSessionUpgradeAuto || getFeatureFlag(FeatureFlags.SessionsUpgradeAutoEnabled)
}

export { getIsSessionUpgradeAutoEnabled }
