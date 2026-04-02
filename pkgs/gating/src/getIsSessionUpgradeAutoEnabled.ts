import { getConfig } from '@l.x/config'
import { FeatureFlags } from '@l.x/gating/src/flags'
import { getFeatureFlag } from '@l.x/gating/src/hooks'

function getIsSessionUpgradeAutoEnabled(): boolean {
  return getConfig().enableSessionUpgradeAuto || getFeatureFlag(FeatureFlags.SessionsUpgradeAutoEnabled)
}

export { getIsSessionUpgradeAutoEnabled }
