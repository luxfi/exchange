import { DynamicConfigs, EmbeddedWalletConfigKey, useDynamicConfigValue } from '@l.x/gating'
import { LX_WEB_URL } from 'lx/src/constants/urls'

export function useEmbeddedWalletBaseUrl(): string {
  const baseUrl = useDynamicConfigValue({
    config: DynamicConfigs.EmbeddedWalletConfig,
    key: EmbeddedWalletConfigKey.BaseUrl,
    defaultValue: LX_WEB_URL,
  })

  return baseUrl
}
