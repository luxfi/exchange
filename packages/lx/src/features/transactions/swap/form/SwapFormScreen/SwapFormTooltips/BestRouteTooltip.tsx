import { useTranslation } from 'react-i18next'
import { Flex } from 'ui/src'
import { OrderRouting } from 'ui/src/components/icons/OrderRouting'
import { ShieldCheck } from 'ui/src/components/icons/ShieldCheck'
import { DEX } from 'ui/src/components/icons/DEX'
import { RoutingDiagram } from 'lx/src/components/RoutingDiagram/RoutingDiagram'
import { TransactionDetailsTooltip as Tooltip } from 'lx/src/components/TransactionDetailsTooltip'
import { luxUrls } from 'lx/src/constants/urls'
import { useSwapTxStore } from 'lx/src/features/transactions/swap/stores/swapTxStore/useSwapTxStore'
import { useRoutingEntries, useRoutingProvider } from 'lx/src/utils/routingDiagram/routingRegistry'

export function BestRouteTooltip(): JSX.Element | null {
  const { t } = useTranslation()
  const trade = useSwapTxStore((s) => s.trade)

  const routingProvider = useRoutingProvider({ routing: trade?.routing })

  const routes = useRoutingEntries({ trade })

  if (!trade || !routes || !routingProvider) {
    return null
  }

  const { inputAmount, outputAmount } = trade

  const icon = routingProvider.icon ?? OrderRouting
  const iconColor = routingProvider.iconColor || '$neutral1'

  return (
    <Tooltip.Outer>
      <Tooltip.Header
        title={{
          title: t('common.bestRoute.with', { provider: routingProvider.name }),
        }}
        Icon={icon}
        iconColor={iconColor}
      />
      <Tooltip.Content>
        <Tooltip.Row>
          <Flex width="100%">
            <RoutingDiagram routes={routes} currencyIn={inputAmount.currency} currencyOut={outputAmount.currency} />
          </Flex>
        </Tooltip.Row>
      </Tooltip.Content>
      <Tooltip.Separator />
      {routingProvider.getDescription && (
        <Tooltip.Description
          learnMoreUrl={luxUrls.helpArticleUrls.routingSettings}
          learnMorePinkColor={false}
          text={routingProvider.getDescription(t)}
        />
      )}
    </Tooltip.Outer>
  )
}

export function BestRouteDEXTooltip(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Tooltip.Outer>
      <Tooltip.Header
        title={{
          title: t('common.bestRoute.with', { provider: 'DEX' }),
          dex: true,
        }}
        Icon={DEX}
      />
      <Tooltip.Content>
        <Tooltip.Row>
          <Tooltip.LineItemLabel label={t('swap.settings.protection.title')} />
          <Tooltip.LineItemValue Icon={ShieldCheck} value={t('common.active')} iconColor="$dexPurple" />
        </Tooltip.Row>
      </Tooltip.Content>
      <Tooltip.Description
        learnMoreUrl={luxUrls.helpArticleUrls.dexInfo}
        learnMorePinkColor={false}
        text={t('routing.aggregateLiquidity.dex')}
      />
    </Tooltip.Outer>
  )
}
