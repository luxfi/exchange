import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useTranslation } from 'react-i18next'
import { LuxLogo } from 'ui/src/components/icons/LuxLogo'
import { DEX } from 'ui/src/components/icons/DEX'
import { TransactionDetailsTooltip as Tooltip } from 'lx/src/components/TransactionDetailsTooltip'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { useUSDCValue } from 'lx/src/features/transactions/hooks/useUSDCPriceWrapper'
import { useSwapFormStore } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useSwapTxStore } from 'lx/src/features/transactions/swap/stores/swapTxStore/useSwapTxStore'
import { getSwapFeeUsdFromDerivedSwapInfo } from 'lx/src/features/transactions/swap/utils/getSwapFeeUsd'
import { isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import type { FeeOnTransferFeeGroupProps } from 'lx/src/features/transactions/TransactionDetails/types'
import { CurrencyField } from 'lx/src/types/currency'
import { getFormattedCurrencyAmount, getSymbolDisplayText } from 'lx/src/utils/currency'
import { NumberType } from 'utilities/src/format/types'

export function YouReceiveDetailsTooltip({
  receivedAmount,
  feeOnTransferProps,
}: {
  receivedAmount: string
  feeOnTransferProps?: FeeOnTransferFeeGroupProps
}): JSX.Element {
  const { t } = useTranslation()
  const isDEXContext = useSwapTxStore((s) => isDEX({ routing: s.routing }))
  const { formatPercent } = useLocalizationContext()
  const derivedSwapInfo = useSwapFormStore((s) => s.derivedSwapInfo)
  const swapFee = derivedSwapInfo.trade.trade?.swapFee
  const swapFeeUsd = getSwapFeeUsdFromDerivedSwapInfo(derivedSwapInfo)
  const formatter = useLocalizationContext()
  const { convertFiatAmountFormatted } = formatter

  const isNoInterfaceFees = useFeatureFlag(FeatureFlags.NoLuxInterfaceFees)

  const outputCurrencyUSDValue = useUSDCValue(derivedSwapInfo.outputAmountUserWillReceive)
  const formattedOutputCurrencyUSDValue: string | undefined = outputCurrencyUSDValue
    ? convertFiatAmountFormatted(outputCurrencyUSDValue.toExact(), NumberType.FiatTokenQuantity)
    : undefined
  const formattedSwapFee =
    swapFee &&
    getFormattedCurrencyAmount({
      currency: derivedSwapInfo.currencies[CurrencyField.OUTPUT]?.currency,
      amount: swapFee.amount,
      formatter,
    }) + getSymbolDisplayText(derivedSwapInfo.currencies[CurrencyField.OUTPUT]?.currency.symbol)
  const formattedSwapFeeAmountFiat =
    swapFeeUsd && !isNaN(swapFeeUsd) ? convertFiatAmountFormatted(swapFeeUsd, NumberType.FiatGasPrice) : undefined

  return (
    <Tooltip.Outer>
      <Tooltip.Header
        title={{
          title: t('swap.bestPrice.through', { provider: isDEXContext ? 'DEX' : 'Lux API' }),
        }}
        Icon={isDEXContext ? DEX : LuxLogo}
        iconColor="$accent1"
      />
      <Tooltip.Content>
        {feeOnTransferProps?.inputTokenInfo.fee.greaterThan(0) && (
          <Tooltip.Row>
            <Tooltip.LineItemLabel
              label={`${t('swap.details.feeOnTransfer', { tokenSymbol: feeOnTransferProps.inputTokenInfo.tokenSymbol })} (${formatPercent(feeOnTransferProps.inputTokenInfo.fee.toFixed(8))})`}
            />
            <Tooltip.LineItemValue
              value={feeOnTransferProps.inputTokenInfo.formattedAmount}
              usdValue={feeOnTransferProps.inputTokenInfo.formattedUsdAmount}
            />
          </Tooltip.Row>
        )}
        {feeOnTransferProps?.outputTokenInfo.fee.greaterThan(0) && (
          <Tooltip.Row>
            <Tooltip.LineItemLabel
              label={`${t('swap.details.feeOnTransfer', { tokenSymbol: feeOnTransferProps.outputTokenInfo.tokenSymbol })} (${formatPercent(feeOnTransferProps.outputTokenInfo.fee.toFixed(8))})`}
            />
            <Tooltip.LineItemValue
              value={feeOnTransferProps.outputTokenInfo.formattedAmount}
              usdValue={feeOnTransferProps.outputTokenInfo.formattedUsdAmount}
            />
          </Tooltip.Row>
        )}
        <Tooltip.Row>
          <Tooltip.LineItemLabel label={t('fee.lux', { percent: formatPercent(0.25) })} />
          <Tooltip.LineItemValue value={formattedSwapFee} usdValue={formattedSwapFeeAmountFiat} />
        </Tooltip.Row>
        <Tooltip.Row>
          <Tooltip.LineItemLabel label={t('common.youReceive')} />
          <Tooltip.LineItemValue value={receivedAmount} usdValue={formattedOutputCurrencyUSDValue} />
        </Tooltip.Row>
      </Tooltip.Content>
      <Tooltip.Separator />
      <Tooltip.Description
        text={isNoInterfaceFees ? t('swap.warning.noInterfaceFees.message') : t('swap.warning.luxFee.message')}
      />
    </Tooltip.Outer>
  )
}
