import { useMemo } from 'react'
import { TransactionSummaryLayout } from 'lx/src/components/activity/summaries/TransactionSummaryLayout'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import { TXN_HISTORY_ICON_SIZE } from 'lx/src/components/activity/utils'
import { LogoWithTxStatus } from 'lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { AssetType } from 'lx/src/entities/assets'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { TransactionDetails, WithdrawTransactionInfo } from 'lx/src/features/transactions/types/transactionDetails'
import { getFormattedCurrencyAmount, getSymbolDisplayText } from 'lx/src/utils/currency'
import { buildCurrencyId } from 'lx/src/utils/currencyId'

export function WithdrawSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: WithdrawTransactionInfo }
}): JSX.Element {
  const formatter = useLocalizationContext()
  const { typeInfo } = transaction

  const currencyInfo = useCurrencyInfo(buildCurrencyId(transaction.chainId, typeInfo.tokenAddress))

  const caption = useMemo(() => {
    if (!currencyInfo) {
      return typeInfo.dappInfo?.name ?? ''
    }

    const currencyAmount = typeInfo.currencyAmountRaw
      ? getFormattedCurrencyAmount({
          currency: currencyInfo.currency,
          amount: typeInfo.currencyAmountRaw,
          formatter,
        })
      : ''

    const symbol = getSymbolDisplayText(currencyInfo.currency.symbol) ?? ''
    const tokenText = `${currencyAmount}${symbol}`

    if (typeInfo.dappInfo?.name) {
      return `${tokenText} from ${typeInfo.dappInfo.name}`
    }

    return tokenText
  }, [currencyInfo, typeInfo.currencyAmountRaw, typeInfo.dappInfo?.name, formatter])

  const icon = useMemo(
    () => (
      <LogoWithTxStatus
        assetType={AssetType.Currency}
        chainId={transaction.chainId}
        currencyInfo={currencyInfo}
        size={TXN_HISTORY_ICON_SIZE}
        txStatus={transaction.status}
        txType={transaction.typeInfo.type}
      />
    ),
    [currencyInfo, transaction.chainId, transaction.status, transaction.typeInfo.type],
  )

  return (
    <TransactionSummaryLayout
      caption={caption}
      icon={icon}
      index={index}
      transaction={transaction}
      isExternalProfile={isExternalProfile}
    />
  )
}
