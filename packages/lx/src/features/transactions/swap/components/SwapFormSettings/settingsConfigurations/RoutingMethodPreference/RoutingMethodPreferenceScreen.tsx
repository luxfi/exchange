import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Switch, Text } from 'ui/src'
import {
  useTransactionSettingsActions,
  useTransactionSettingsStore,
} from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import type { RoutingMethod } from 'lx/src/features/transactions/components/settings/types'
import { isLuxChain } from 'lx/src/data/apiClients/tradingApi/LuxGatewayClient'
import { useSwapFormStoreDerivedSwapInfo } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { ElementName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'

const ROUTING_METHODS: {
  value: RoutingMethod
  titleKey: string
  descriptionKey: string
  element: ElementName
  luxOnly?: boolean
}[] = [
  {
    value: 'auto',
    titleKey: 'swap.settings.routingMethod.option.auto.title',
    descriptionKey: 'swap.settings.routingMethod.option.auto.description',
    element: ElementName.SwapRoutingMethodAuto,
  },
  {
    value: 'amm',
    titleKey: 'swap.settings.routingMethod.option.amm.title',
    descriptionKey: 'swap.settings.routingMethod.option.amm.description',
    element: ElementName.SwapRoutingMethodAMM,
  },
  {
    value: 'dex-precompile',
    titleKey: 'swap.settings.routingMethod.option.dexPrecompile.title',
    descriptionKey: 'swap.settings.routingMethod.option.dexPrecompile.description',
    element: ElementName.SwapRoutingMethodDEXPrecompile,
    luxOnly: true,
  },
]

export function RoutingMethodPreferenceScreen(): JSX.Element {
  const { t } = useTranslation()
  const routeVia = useTransactionSettingsStore((s) => s.routeVia)
  const { setRouteVia } = useTransactionSettingsActions()
  const chainId = useSwapFormStoreDerivedSwapInfo((s) => s.chainId)
  const isOnLuxChain = isLuxChain(chainId)

  const handleSelect = useCallback(
    (method: RoutingMethod) => {
      setRouteVia(method)
    },
    [setRouteVia],
  )

  return (
    <Flex gap="$spacing16" my="$spacing16">
      {ROUTING_METHODS.map((method) => {
        const isDisabled = method.luxOnly && !isOnLuxChain
        const isActive = routeVia === method.value

        return (
          <Flex key={method.value} flexDirection="column" gap="$spacing12">
            <Flex row py="$spacing2" alignItems="flex-start" gap="$spacing16" justifyContent="space-between">
              <Flex shrink gap="$spacing4">
                <Text color="$neutral1" variant="subheading2">
                  {t(method.titleKey)}
                </Text>
                <Text color="$neutral2" variant="body3" textWrap="pretty">
                  {isDisabled
                    ? t('swap.settings.routingMethod.option.dexPrecompile.unavailable')
                    : t(method.descriptionKey)}
                </Text>
              </Flex>
              <Trace element={method.element} logPress={!isActive}>
                <Switch
                  disabled={isDisabled}
                  checked={isActive}
                  variant="branded"
                  onCheckedChange={() => handleSelect(method.value)}
                />
              </Trace>
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}
