import { DynamicConfigs, EmbeddedWalletConfigKey, useDynamicConfigValue } from '@luxfi/gating'
import { UNISWAP_WEB_URL } from 'lx/src/constants/urls'

export function useEmbeddedWalletBaseUrl(): string {
  const baseUrl = useDynamicConfigValue({
    config: DynamicConfigs.EmbeddedWalletConfig,
    key: EmbeddedWalletConfigKey.BaseUrl,
    defaultValue: UNISWAP_WEB_URL,
  })

  return baseUrl
}
