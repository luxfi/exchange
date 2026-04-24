import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@l.x/ui/src'
import { useTransactionSettingsStore } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { isDefaultTradeRouteOptions } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/isDefaultTradeRouteOptions'

export function TradeRoutingPreferenceControl(): JSX.Element {
  const { t } = useTranslation()
  const { selectedProtocols, isV4HookPoolsEnabled } = useTransactionSettingsStore((s) => ({
    selectedProtocols: s.selectedProtocols,
    isV4HookPoolsEnabled: s.isV4HookPoolsEnabled,
  }))

  const getTradeRouteOptionTitle = useMemo((): string => {
    if (
      isDefaultTradeRouteOptions({
        selectedProtocols,
        isV4HookPoolsEnabled,
      })
    ) {
      return t('common.default')
    }

    return t('common.custom')
  }, [selectedProtocols, isV4HookPoolsEnabled, t])

  return (
    <Text
      color="$neutral2"
      flexWrap="wrap"
      variant="subheading2"
      $group-hover={{
        color: '$neutral2Hovered',
      }}
    >
      {getTradeRouteOptionTitle}
    </Text>
  )
}
