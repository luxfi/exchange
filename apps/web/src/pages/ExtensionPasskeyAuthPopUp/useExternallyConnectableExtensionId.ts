import { DynamicConfigs, ExternallyConnectableExtensionConfigKey, useDynamicConfigValue } from '@luxfi/gating'
import { TRUSTED_CHROME_EXTENSION_IDS } from '@l.x/utils/src/environment/extensionId'

export function useExternallyConnectableExtensionId(): string {
  const extensionId = useDynamicConfigValue<
    DynamicConfigs.ExternallyConnectableExtension,
    ExternallyConnectableExtensionConfigKey.ExtensionId,
    string
  >({
    config: DynamicConfigs.ExternallyConnectableExtension,
    key: ExternallyConnectableExtensionConfigKey.ExtensionId,
    defaultValue: TRUSTED_CHROME_EXTENSION_IDS.prod,
  })

  return extensionId
}
