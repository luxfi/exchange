import { NFTSummaryItem } from 'lx/src/components/activity/summaries/NFTSummaryItem'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import { NFTTradeTransactionInfo, TransactionDetails } from 'lx/src/features/transactions/types/transactionDetails'

export function NFTTradeSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: NFTTradeTransactionInfo }
}): JSX.Element {
  return (
    <NFTSummaryItem
      index={index}
      transaction={transaction}
      transactionType={transaction.typeInfo.type}
      isExternalProfile={isExternalProfile}
    />
  )
}
