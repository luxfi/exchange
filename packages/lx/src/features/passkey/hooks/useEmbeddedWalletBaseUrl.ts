import { DynamicConfigs, EmbeddedWalletConfigKey, useDynamicConfigValue } from '@luxfi/gating'
import { LUX_WEB_URL } from 'lx/src/constants/urls'

export function useEmbeddedWalletBaseUrl(): string {
  const baseUrl = useDynamicConfigValue({
    config: DynamicConfigs.EmbeddedWalletConfig,
    key: EmbeddedWalletConfigKey.BaseUrl,
    defaultValue: LUX_WEB_URL,
  })

  return baseUrl
}
