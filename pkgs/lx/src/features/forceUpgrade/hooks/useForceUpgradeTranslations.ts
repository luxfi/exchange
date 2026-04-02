import {
  DynamicConfigs,
  ForceUpgradeConfigKey,
  ForceUpgradeTranslations,
  useDynamicConfigValue,
} from '@l.x/gating'

export function useForceUpgradeTranslations(): ForceUpgradeTranslations {
  return useDynamicConfigValue({
    config: DynamicConfigs.ForceUpgrade,
    key: ForceUpgradeConfigKey.Translations,
    defaultValue: {},
  })
}
