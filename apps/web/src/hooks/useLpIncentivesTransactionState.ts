import { useEffect, useState } from 'react'
<<<<<<< HEAD
import { TransactionType } from '@l.x/lx/src/features/transactions/types/transactionDetails'
=======
import { TransactionType } from 'uniswap/src/features/transactions/types/transactionDetails'
>>>>>>> upstream/main
import { usePendingTransactions } from '~/state/transactions/hooks'

export function useLpIncentivesTransactionState() {
  const [isPendingTransaction, setIsPendingTransaction] = useState(false)
  const pendingTransactions = usePendingTransactions()

  useEffect(() => {
    const hasPendingClaim = pendingTransactions.some(
      (tx) => tx.typeInfo.type === TransactionType.LPIncentivesClaimRewards,
    )

    setIsPendingTransaction(hasPendingClaim)
  }, [pendingTransactions])

  return isPendingTransaction
}
