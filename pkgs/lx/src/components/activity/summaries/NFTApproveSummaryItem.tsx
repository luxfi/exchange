import { NFTSummaryItem } from 'lx/src/components/activity/summaries/NFTSummaryItem'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import {
  NFTApproveTransactionInfo,
  TransactionDetails,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'

export function NFTApproveSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: NFTApproveTransactionInfo }
}): JSX.Element {
  return (
    <NFTSummaryItem
      index={index}
      transaction={transaction}
      transactionType={TransactionType.NFTApprove}
      isExternalProfile={isExternalProfile}
    />
  )
}
