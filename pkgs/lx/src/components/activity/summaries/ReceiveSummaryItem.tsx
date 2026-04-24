import { TransferTokenSummaryItem } from '@l.x/lx/src/components/activity/summaries/TransferTokenSummaryItem'
import { SummaryItemProps } from '@l.x/lx/src/components/activity/types'
import {
  ReceiveTokenTransactionInfo,
  TransactionDetails,
  TransactionType,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'

export function ReceiveSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: ReceiveTokenTransactionInfo }
}): JSX.Element {
  return (
    <TransferTokenSummaryItem
      index={index}
      otherAddress={transaction.typeInfo.sender}
      transaction={transaction}
      transactionType={TransactionType.Receive}
      isExternalProfile={isExternalProfile}
    />
  )
}
