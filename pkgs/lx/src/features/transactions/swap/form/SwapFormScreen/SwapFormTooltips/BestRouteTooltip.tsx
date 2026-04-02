import { useTranslation } from 'react-i18next'
import { Flex } from 'ui/src'
import { OrderRouting } from 'ui/src/components/icons/OrderRouting'
import { ShieldCheck } from 'ui/src/components/icons/ShieldCheck'
import { DEX } from 'ui/src/components/icons/DEX'
import { RoutingDiagram } from '@l.x/lx/src/components/RoutingDiagram/RoutingDiagram'
import { TransactionDetailsTooltip as Tooltip } from '@l.x/lx/src/components/TransactionDetailsTooltip'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { useSwapTxStore } from '@l.x/lx/src/features/transactions/swap/stores/swapTxStore/useSwapTxStore'
import { useRoutingEntries, useRoutingProvider } from '@l.x/lx/src/utils/routingDiagram/routingRegistry'

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
          learnMoreUrl={lxUrls.helpArticleUrls.routingSettings}
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
        learnMoreUrl={lxUrls.helpArticleUrls.lxSwapInfo}
        text={t('routing.aggregateLiquidity.lx')}
      />
    </Tooltip.Outer>
  )
}

export const BestRouteLxSwapTooltip = BestRouteDEXTooltip
