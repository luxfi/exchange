import { useMemo } from 'react'
import { useSelectAddressTransactions } from 'lx/src/features/transactions/selectors'
import { isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import {
  QueuedOrderStatus,
  TransactionDetails,
  TransactionStatus,
  DEXOrderDetails,
} from 'lx/src/features/transactions/types/transactionDetails'

const ERRORED_QUEUE_STATUSES = [
  QueuedOrderStatus.AppClosed,
  QueuedOrderStatus.ApprovalFailed,
  QueuedOrderStatus.SubmissionFailed,
  QueuedOrderStatus.Stale,
] as const
export type ErroredQueuedOrderStatus = (typeof ERRORED_QUEUE_STATUSES)[number]
export type ErroredQueuedOrder = DEXOrderDetails & {
  status: TransactionStatus.Pending
  queueStatus: ErroredQueuedOrderStatus
}

function isErroredQueuedOrder(tx: TransactionDetails): tx is ErroredQueuedOrder {
  return Boolean(
    isDEX(tx) &&
      tx.status === TransactionStatus.Pending &&
      tx.queueStatus &&
      ERRORED_QUEUE_STATUSES.some((status) => status === tx.queueStatus),
  )
}

export function useErroredQueuedOrders({
  evmAddress,
  svmAddress,
}: {
  evmAddress?: Address
  svmAddress?: Address
}): ErroredQueuedOrder[] | undefined {
  const transactions = useSelectAddressTransactions({ evmAddress, svmAddress })
  return useMemo(() => {
    if (!transactions) {
      return undefined
    }
    const erroredQueuedOrders: ErroredQueuedOrder[] = []
    for (const tx of transactions) {
      if (isErroredQueuedOrder(tx)) {
        erroredQueuedOrders.push(tx)
      }
    }
    return erroredQueuedOrders.sort((a, b) => b.addedTime - a.addedTime)
  }, [transactions])
}
