<<<<<<< HEAD
import { brand, getBrandUrl, getDocsUrl } from '@l.x/config'
import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import React, { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { Flex } from '@l.x/ui/src'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
=======
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import React, { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { Flex } from 'ui/src'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
>>>>>>> upstream/main
import {
  FORMAT_DATE_TIME_MEDIUM,
  useFormattedDateTime,
  useLocalizedDayjs,
<<<<<<< HEAD
} from '@l.x/lx/src/features/language/localizedDayjs'
import { useUSDCValue } from '@l.x/lx/src/features/transactions/hooks/useUSDCPriceWrapper'
import { NumberType } from '@l.x/utils/src/format/types'
=======
} from 'uniswap/src/features/language/localizedDayjs'
import { useUSDCValue } from 'uniswap/src/features/transactions/hooks/useUSDCPriceWrapper'
import { NumberType } from 'utilities/src/format/types'
>>>>>>> upstream/main
import Row from '~/components/deprecated/Row'
import { LoadingRow } from '~/components/Loader/styled'
import { DetailLineItem, LineItemData } from '~/components/swap/DetailLineItem'
import { GasBreakdownTooltip } from '~/components/swap/GasBreakdownTooltip'
import GasEstimateTooltip from '~/components/swap/GasEstimateTooltip'
import { RoutingTooltip } from '~/components/swap/SwapRoute'
import TradePrice from '~/components/swap/TradePrice'
import { TooltipSize } from '~/components/Tooltip'
import { InterfaceTrade, SubmittableTrade } from '~/state/routing/types'
<<<<<<< HEAD
import { isLimitTrade, isPreviewTrade, isLXTrade } from '~/state/routing/utils'
=======
import { isLimitTrade, isPreviewTrade, isUniswapXTrade } from '~/state/routing/utils'
>>>>>>> upstream/main
import { ExternalLink } from '~/theme/components/Links'

export enum SwapLineItemType {
  EXCHANGE_RATE = 0,
  NETWORK_COST = 1,
  SWAP_FEE = 6,
  EXPIRY = 9,
}

function BaseTooltipContent({ children, url }: { children: ReactNode; url: string }) {
  return (
    <>
      {children}
      <br />
      <ExternalLink href={url}>
        <Trans i18nKey="common.button.learn" />
      </ExternalLink>
    </>
  )
}

export function FOTTooltipContent() {
  return (
<<<<<<< HEAD
    <BaseTooltipContent url={getDocsUrl('/help/token-fees')}>
=======
    <BaseTooltipContent url="https://support.uniswap.org/hc/en-us/articles/18673568523789-What-is-a-token-fee-">
>>>>>>> upstream/main
      <Trans i18nKey="swap.tokenOwnFees" />
    </BaseTooltipContent>
  )
}

function SwapFeeTooltipContent({ hasFee }: { hasFee: boolean }) {
  const message = hasFee ? <Trans i18nKey="swap.fees.experience" /> : <Trans i18nKey="swap.fees.noFee" />
  return (
<<<<<<< HEAD
    <BaseTooltipContent url={getDocsUrl('/help/swap-fees')}>
=======
    <BaseTooltipContent url="https://support.uniswap.org/hc/en-us/articles/20131678274957">
>>>>>>> upstream/main
      {message}
    </BaseTooltipContent>
  )
}

export function SlippageTooltipContent() {
  return (
<<<<<<< HEAD
    <BaseTooltipContent url={getDocsUrl('/help/swap-fees')}>
=======
    <BaseTooltipContent url="https://support.uniswap.org/hc/en-us/articles/20131678274957">
>>>>>>> upstream/main
      <Trans i18nKey="swap.slippage.tooltip" />
    </BaseTooltipContent>
  )
}

function Loading({ width = 50 }: { width?: number }) {
  return <LoadingRow data-testid="loading-row" height={15} width={width} />
}

function CurrencyAmountRow({ amount }: { amount: CurrencyAmount<Currency> }) {
  const { formatCurrencyAmount } = useLocalizationContext()
  const formattedAmount = formatCurrencyAmount({ value: amount, type: NumberType.SwapTradeAmount })
  return <>{`${formattedAmount} ${amount.currency.symbol}`}</>
}

function FeeRow({ trade: { swapFee, outputAmount } }: { trade: SubmittableTrade }) {
  const { convertFiatAmountFormatted } = useLocalizationContext()

  const feeCurrencyAmount = CurrencyAmount.fromRawAmount(outputAmount.currency, swapFee?.amount ?? 0)
  const outputFeeFiatValue = useUSDCValue(feeCurrencyAmount)

  // Fallback to displaying token amount if fiat value is not available
  if (!outputFeeFiatValue) {
    return <CurrencyAmountRow amount={feeCurrencyAmount} />
  }

  return <>{convertFiatAmountFormatted(outputFeeFiatValue.toExact(), NumberType.FiatGasPrice)}</>
}

<<<<<<< HEAD
// eslint-disable-next-line consistent-return
=======
// oxlint-disable-next-line consistent-return
>>>>>>> upstream/main
function useLineItem(props: SwapLineItemProps): LineItemData | undefined {
  const { trade, syncing, type } = props
  const { formatPercent } = useLocalizationContext()
  const localizedDayjs = useLocalizedDayjs()
  const deadline = isLimitTrade(trade) ? trade.deadline : 0
  const formattedDeadline = useFormattedDateTime(localizedDayjs(deadline), FORMAT_DATE_TIME_MEDIUM)

<<<<<<< HEAD
  const isLX = isLXTrade(trade)
=======
  const isUniswapX = isUniswapXTrade(trade)
>>>>>>> upstream/main
  const isPreview = isPreviewTrade(trade)

  switch (type) {
    case SwapLineItemType.EXCHANGE_RATE:
      return {
        Label: () => (isLimitTrade(trade) ? <Trans i18nKey="limits.price.label" /> : <Trans i18nKey="common.rate" />),
        Value: () => <TradePrice price={trade.executionPrice} />,
        TooltipBody: !isPreview ? () => <RoutingTooltip trade={trade} /> : undefined,
<<<<<<< HEAD
        tooltipSize: isLX ? TooltipSize.Small : TooltipSize.Large,
=======
        tooltipSize: isUniswapX ? TooltipSize.Small : TooltipSize.Large,
>>>>>>> upstream/main
      }
    case SwapLineItemType.NETWORK_COST:
      return {
        Label: () => <Trans i18nKey="common.networkCost" />,
        TooltipBody: () => <GasBreakdownTooltip trade={trade} />,
        Value: () => {
          if (isPreview) {
            return <Loading />
          }
          return <GasEstimateTooltip trade={trade} loading={!!syncing} />
        },
      }
    case SwapLineItemType.SWAP_FEE: {
      if (isPreview) {
        return { Label: () => <Trans i18nKey="common.fee" />, Value: () => <Loading /> }
      }
      return {
        Label: () => (
          <>
            <Trans i18nKey="common.fee" />{' '}
            {trade.swapFee && `(${formatPercent(trade.swapFee.percent.toSignificant())})`}
          </>
        ),
        TooltipBody: () => <SwapFeeTooltipContent hasFee={Boolean(trade.swapFee)} />,
        Value: () => <FeeRow trade={trade} />,
      }
    }
    case SwapLineItemType.EXPIRY:
      if (!isLimitTrade(trade) || !formattedDeadline) {
        return undefined
      }
      return {
        Label: () => <Trans i18nKey="common.expiry" />,
        Value: () => <Row>{formattedDeadline}</Row>,
      }
  }
}

interface SwapLineItemProps {
  trade: InterfaceTrade
  syncing?: boolean
  type: SwapLineItemType
  visible?: boolean
  animationDelay?: number
}

function SwapLineItem(props: SwapLineItemProps) {
  const { visible = true, animationDelay, syncing } = props
  const LineItem = useLineItem(props)
  if (!LineItem) {
    return null
  }

  return (
    <Flex
      opacity={visible ? 1 : 0}
      animation={{
        opacity: {
          type: 'quick',
          delay: animationDelay,
        },
      }}
    >
      <DetailLineItem LineItem={LineItem} syncing={syncing} />
    </Flex>
  )
}

export default React.memo(SwapLineItem)
