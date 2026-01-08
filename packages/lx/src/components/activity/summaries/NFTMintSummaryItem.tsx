import { NFTSummaryItem } from 'lx/src/components/activity/summaries/NFTSummaryItem'
import { SummaryItemProps } from 'lx/src/components/activity/types'
import {
  NFTMintTransactionInfo,
  TransactionDetails,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'

export function NFTMintSummaryItem({
  transaction,
  index,
  isExternalProfile,
}: SummaryItemProps & {
  transaction: TransactionDetails & { typeInfo: NFTMintTransactionInfo }
}): JSX.Element {
  return (
    <NFTSummaryItem
      index={index}
      transaction={transaction}
      transactionType={TransactionType.NFTMint}
      isExternalProfile={isExternalProfile}
    />
  )
}
