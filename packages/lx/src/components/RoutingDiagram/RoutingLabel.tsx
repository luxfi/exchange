import { useTranslation } from 'react-i18next'
import { Flex, Text, DEXText } from 'ui/src'
import { AnimatedDEX } from 'ui/src/components/icons/DEX'
import { AcrossLogo } from 'ui/src/components/logos/AcrossLogo'
import { Trade } from 'lx/src/features/transactions/swap/types/trade'
import { isBridge, isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import { useRoutingProvider } from 'lx/src/utils/routingDiagram/routingRegistry'

export function RoutingLabel({ trade }: { trade: Trade }): JSX.Element {
  const { t } = useTranslation()

  const routingProvider = useRoutingProvider({ routing: trade.routing })

  if (isBridge(trade)) {
    return (
      <Flex row gap="$spacing6" alignItems="center">
        <AcrossLogo size="$icon.16" />
        <Text adjustsFontSizeToFit color="$neutral1" variant="body3">
          Across API
        </Text>
      </Flex>
    )
  }

  if (isDEX(trade)) {
    return (
      <Flex row gap="$spacing2">
        <AnimatedDEX size="$icon.16" animation="simple" />
        <DEXText variant="body3">{t('dex.label')}</DEXText>
      </Flex>
    )
  }

  return (
    <Flex row gap="$spacing6" alignItems="center">
      {routingProvider?.icon && <routingProvider.icon size="$icon.16" color={routingProvider.iconColor} />}
      <Text adjustsFontSizeToFit color="$neutral1" variant="body3">
        {routingProvider?.name ?? ''}
      </Text>
    </Flex>
  )
}
