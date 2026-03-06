import type { GasFeeResult } from '@universe/api'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Flex, Text, DEXText } from 'ui/src'
import { OrderRouting } from 'ui/src/components/icons/OrderRouting'
import { zIndexes } from 'ui/src/theme'
import { WarningSeverity } from 'lx/src/components/modals/WarningModal/types'
import { WarningInfo } from 'lx/src/components/modals/WarningModal/WarningInfo'
import { RoutingDiagram } from 'lx/src/components/RoutingDiagram/RoutingDiagram'
import { RoutingLabel } from 'lx/src/components/RoutingDiagram/RoutingLabel'
import type { UniverseChainId } from 'lx/src/features/chains/types'
import { useUSDValueOfGasFee } from 'lx/src/features/gas/hooks'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { ModalName } from 'lx/src/features/telemetry/constants'
import {
  BestRouteTooltip,
  BestRouteDEXTooltip,
} from 'lx/src/features/transactions/swap/form/SwapFormScreen/SwapFormTooltips/BestRouteTooltip'
import { Trade } from 'lx/src/features/transactions/swap/types/trade'
import { isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import { useRoutingEntries } from 'lx/src/utils/routingDiagram/routingRegistry'
import { NumberType } from 'utilities/src/format/types'
import { isWebPlatform } from 'utilities/src/platform'

export function RoutingHopInfo({
  trade,
  chainId,
  gasFee,
}: PropsWithChildren<{
  trade: Trade
  chainId: UniverseChainId
  gasFee: GasFeeResult
}>): JSX.Element | null {
  const { t } = useTranslation()
  const { convertFiatAmountFormatted } = useLocalizationContext()
  const { value: gasFeeUSD } = useUSDValueOfGasFee(chainId, gasFee.displayValue ?? undefined)
  const gasFeeFormatted =
    gasFeeUSD !== undefined ? convertFiatAmountFormatted(gasFeeUSD, NumberType.FiatGasPrice) : undefined

  const routes = useRoutingEntries({ trade })

  const caption = useMemo(() => {
    const textVariant = isWebPlatform ? 'body4' : 'body2'
    const textAlign = isWebPlatform ? 'left' : 'center'

    if (isDEX(trade)) {
      return (
        <Text variant={textVariant} textAlign={textAlign} color="$neutral2">
          <Trans
            i18nKey="dex.aggregatesLiquidity"
            components={{
              logo: (
                <>
                  <DEXText variant={textVariant}>DEX</DEXText>
                </>
              ),
            }}
          />
        </Text>
      )
    }

    if (routes) {
      return (
        <Flex>
          {isWebPlatform && (
            <RoutingDiagram
              routes={routes}
              currencyIn={trade.inputAmount.currency}
              currencyOut={trade.outputAmount.currency}
            />
          )}
          <Text variant={textVariant} textAlign={textAlign} color="$neutral2">
            {gasFeeFormatted && t('swap.bestRoute.cost', { gasPrice: gasFeeFormatted })}
            {t('swap.route.optimizedGasCost')}
          </Text>
        </Flex>
      )
    }
    return null
  }, [t, trade, routes, gasFeeFormatted])

  return (
    <Flex row alignItems="center" justifyContent="space-between">
      <WarningInfo
        modalProps={{
          modalName: ModalName.SwapReview,
          captionComponent: caption,
          rejectText: t('common.button.close'),
          icon: <OrderRouting color="$neutral1" size="$icon.24" />,
          severity: WarningSeverity.None,
          title: t('swap.tradeRoutes'),
          zIndex: zIndexes.popover,
        }}
        tooltipProps={{
          text: isDEX(trade) ? (
            <BestRouteDEXTooltip />
          ) : routes && routes.length > 0 ? (
            <BestRouteTooltip />
          ) : (
            caption
          ),
          placement: 'top',
          maxWidth: routes ? 300 : undefined,
        }}
        analyticsTitle="Order routing"
      >
        <Flex centered row gap="$spacing4">
          <Text color="$neutral2" variant="body3">
            {t('common.bestRoute')}
          </Text>
        </Flex>
      </WarningInfo>
      <Flex row shrink justifyContent="flex-end">
        <RoutingLabel trade={trade} />
      </Flex>
    </Flex>
  )
}
