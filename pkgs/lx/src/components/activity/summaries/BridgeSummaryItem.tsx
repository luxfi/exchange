import { useMemo } from 'react'
import { useOnRetrySwap } from '@l.x/lx/src/components/activity/hooks/useOnRetrySwap'
import { TransactionSummaryLayout } from '@l.x/lx/src/components/activity/summaries/TransactionSummaryLayout'
import { SummaryItemProps } from '@l.x/lx/src/components/activity/types'
import { TXN_HISTORY_ICON_SIZE } from '@l.x/lx/src/components/activity/utils'
import { CrossChainIcon, SplitLogo } from '@l.x/lx/src/components/CurrencyLogo/SplitLogo'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { CrossChainCurrencyRow } from '@l.x/lx/src/features/transactions/swap/components/CrossChainCurrencyRow'
import { getAmountsFromTrade } from '@l.x/lx/src/features/transactions/swap/utils/getAmountsFromTrade'
import { BridgeTransactionInfo, TransactionDetails } from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { getFormattedCurrencyAmount } from '@l.x/lx/src/utils/currency'

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
  const { typeInfo, status } = transaction
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
      <CrossChainCurrencyRow
        inputChainId={inputCurrency.chainId}
        inputSymbol={inputCurrency.symbol ?? ''}
        outputChainId={outputCurrency.chainId}
        outputSymbol={outputCurrency.symbol ?? ''}
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
        customIcon={<CrossChainIcon status={status} />}
      />
    ),
    [inputCurrencyInfo, outputCurrencyInfo, transaction.chainId, status],
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
