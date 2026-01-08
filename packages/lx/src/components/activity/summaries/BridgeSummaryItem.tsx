import { useMemo } from 'react'
import { useOnRetrySwap } from 'lx/src/components/activity/hooks/useOnRetrySwap'
import { TransactionSummaryLayout } from 'lx/src/components/activity/summaries/TransactionSummaryLayout'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import { TXN_HISTORY_ICON_SIZE } from 'lx/src/components/activity/utils'
import { BridgeIcon, SplitLogo } from 'lx/src/components/CurrencyLogo/SplitLogo'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { BridgingCurrencyRow } from 'lx/src/features/transactions/swap/components/BridgingCurrencyRow'
import { getAmountsFromTrade } from 'lx/src/features/transactions/swap/utils/getAmountsFromTrade'
import { BridgeTransactionInfo, TransactionDetails } from 'lx/src/features/transactions/types/transactionDetails'
import { getFormattedCurrencyAmount } from 'lx/src/utils/currency'

export function BridgeSummaryItem({
  transaction,
  swapCallbacks,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & {
    typeInfo: BridgeTransactionInfo
  }
}): JSX.Element {
  const { typeInfo } = transaction
  const inputCurrencyInfo = useCurrencyInfo(typeInfo.inputCurrencyId)
  const outputCurrencyInfo = useCurrencyInfo(typeInfo.outputCurrencyId)
  const formatter = useLocalizationContext()
  const onRetry = useOnRetrySwap(transaction, swapCallbacks)

  const caption = useMemo(() => {
    if (!inputCurrencyInfo || !outputCurrencyInfo) {
      return ''
    }

    const { inputCurrencyAmountRaw, outputCurrencyAmountRaw } = getAmountsFromTrade(typeInfo)
    const { currency: inputCurrency } = inputCurrencyInfo
    const { currency: outputCurrency } = outputCurrencyInfo
    const inputCurrencyAmount = getFormattedCurrencyAmount({
      currency: inputCurrency,
      amount: inputCurrencyAmountRaw,
      formatter,
    })
    const outputCurrencyAmount = getFormattedCurrencyAmount({
      currency: outputCurrency,
      amount: outputCurrencyAmountRaw,
      formatter,
    })

    return (
      <BridgingCurrencyRow
        inputCurrencyInfo={inputCurrencyInfo}
        outputCurrencyInfo={outputCurrencyInfo}
        formattedInputTokenAmount={inputCurrencyAmount}
        formattedOutputTokenAmount={outputCurrencyAmount}
      />
    )
  }, [inputCurrencyInfo, outputCurrencyInfo, formatter, typeInfo])

  const icon = useMemo(
    () => (
      <SplitLogo
        inputCurrencyInfo={inputCurrencyInfo}
        outputCurrencyInfo={outputCurrencyInfo}
        size={TXN_HISTORY_ICON_SIZE}
        chainId={transaction.chainId}
        customIcon={BridgeIcon}
      />
    ),
    [inputCurrencyInfo, outputCurrencyInfo, transaction.chainId],
  )

  return (
    <TransactionSummaryLayout
      caption={caption}
      icon={icon}
      index={index}
      transaction={transaction}
      isExternalProfile={isExternalProfile}
      onRetry={onRetry}
    />
  )
}
