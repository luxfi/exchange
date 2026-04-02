import { TransferTokenSummaryItem } from 'lx/src/components/activity/summaries/TransferTokenSummaryItem'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import {
  SendTokenTransactionInfo,
  TransactionDetails,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'

export function SendSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: SendTokenTransactionInfo }
}): JSX.Element {
  return (
    <TransferTokenSummaryItem
      index={index}
      otherAddress={transaction.typeInfo.recipient}
      transaction={transaction}
      transactionType={TransactionType.Send}
      isExternalProfile={isExternalProfile}
    />
  )
}
