import { useEffect } from 'react'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { WALLET_TESTNET_CONFIG } from '@l.x/lx/src/features/telemetry/constants'
import { setAttributesToDatadog } from '@l.x/utils/src/logger/datadog/Datadog'
// biome-ignore lint/style/noRestrictedImports: Hook needs direct selector access for testnet mode state
import { analytics } from '@l.x/utils/src/telemetry/analytics/analytics'

export function useTestnetModeForLoggingAndAnalytics(): void {
  const { isTestnetModeEnabled } = useEnabledChains()
  useEffect(() => {
    analytics.setTestnetMode(isTestnetModeEnabled, WALLET_TESTNET_CONFIG)
    setAttributesToDatadog({ testnetMode: isTestnetModeEnabled }).catch(() => undefined)
  }, [isTestnetModeEnabled])
}
