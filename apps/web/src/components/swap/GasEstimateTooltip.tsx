import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { ElementName, SwapEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { NumberType } from '@luxfi/utilities/src/format/types'
import Row, { RowFixed } from '~/components/deprecated/Row'
import { Gas } from '~/components/Icons/Gas'
import { LoadingOpacityContainer } from '~/components/Loader/styled'
import { DEXGradient, DEXRouterIcon } from '~/components/RouterLabel/DEXRouterLabel'
import { GasBreakdownTooltip } from '~/components/swap/GasBreakdownTooltip'
import { MouseoverTooltip, TooltipSize } from '~/components/Tooltip'
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { useMultichainContext } from '~/state/multichain/useMultichainContext'
import { SubmittableTrade } from '~/state/routing/types'
import { isLxSwapTrade } from '~/state/routing/utils'
import { ThemedText } from '~/theme/components'

const StyledGasIcon = deprecatedStyled(Gas)`
  height: 16px;
  width: 16px;
  // We apply the following to all children of the SVG in order to override the default color
  & > * {
    fill: ${({ theme }) => theme.neutral3};
  }
`

export default function GasEstimateTooltip({ trade, loading }: { trade?: SubmittableTrade; loading: boolean }) {
  const { chainId } = useMultichainContext()
  const { convertFiatAmountFormatted } = useLocalizationContext()

  if (!trade || !chainId) {
    return null
  }

  return (
    <MouseoverTooltip
      size={TooltipSize.Small}
      text={<GasBreakdownTooltip trade={trade} />}
      onOpen={() => {
        sendAnalyticsEvent(SwapEventName.SwapAutorouterVisualizationExpanded, {
          element: ElementName.AutorouterVisualizationRow,
        })
      }}
      placement="right"
    >
      <LoadingOpacityContainer $loading={loading}>
        <RowFixed gap="xs">
          {isLxSwapTrade(trade) ? <DEXRouterIcon testId="gas-estimate-dex-icon" /> : <StyledGasIcon />}
          <ThemedText.BodySmall color="neutral2">
            <Row gap="sm">
              {isLxSwapTrade(trade) ? (
                <DEXGradient>
                  {convertFiatAmountFormatted(trade.totalGasUseEstimateUSD, NumberType.FiatGasPrice)}
                </DEXGradient>
              ) : (
                <>{convertFiatAmountFormatted(trade.totalGasUseEstimateUSD, NumberType.FiatGasPrice)}</>
              )}

              {isLxSwapTrade(trade) && (trade.classicGasUseEstimateUSD ?? 0) > 0 && (
                <>
                  <s>{convertFiatAmountFormatted(trade.classicGasUseEstimateUSD, NumberType.FiatGasPrice)}</s>
                </>
              )}
            </Row>
          </ThemedText.BodySmall>
        </RowFixed>
      </LoadingOpacityContainer>
    </MouseoverTooltip>
  )
}
