import { NFTSummaryItem } from '@l.x/lx/src/components/activity/summaries/NFTSummaryItem'
import { SummaryItemProps } from '@l.x/lx/src/components/activity/types'
import {
  NFTMintTransactionInfo,
  TransactionDetails,
  TransactionType,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'

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
