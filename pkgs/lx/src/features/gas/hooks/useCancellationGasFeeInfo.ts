import { useQuery } from '@tanstack/react-query'
import { providers } from 'ethers/lib/ethers'
import { useCallback, useMemo } from 'react'
import { CancellationGasFeeDetails, useTransactionGasFee } from 'lx/src/features/gas/hooks'
import {
  PlanCancellationGasFeeDetails,
  usePlanCancellationGasFeeInfo,
} from 'lx/src/features/gas/hooks/usePlanCancellationGasFeeInfo'
import {
  CancellationType,
  calculateCancellationGasFee,
  createClassicCancelRequest,
  getCancellationType,
} from 'lx/src/features/gas/utils/cancel'
import {
  extractCancellationData,
  getCancelMultipleLxSwapOrdersTransaction,
} from 'lx/src/features/transactions/cancel/cancelMultipleOrders'
import { getCancelOrderTxRequest } from 'lx/src/features/transactions/cancel/getCancelOrderTxRequest'
import { isLxSwap } from 'lx/src/features/transactions/swap/utils/routing'
import {
  PlanTransactionDetails,
  TransactionDetails,
  LxSwapOrderDetails,
} from 'lx/src/features/transactions/types/transactionDetails'
import { isPlanTransactionDetails } from 'lx/src/features/transactions/types/utils'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

/**
 * Hook to calculate cancellation gas fees
 * Supports both single transaction cancellation and batch LX order cancellation
 *
 * @param transaction - The transaction to cancel
 * @param orders - Optional array of LX orders for batch cancellation
 * @returns Cancellation gas fee details or undefined
 */
export function useCancellationGasFeeInfo(
  transaction: TransactionDetails,
  orders?: LxSwapOrderDetails[],
): CancellationGasFeeDetails | PlanCancellationGasFeeDetails | undefined {
  const isPlan = isPlanTransactionDetails(transaction)
  const planCancellation = usePlanCancellationGasFeeInfo(isPlan ? (transaction as PlanTransactionDetails) : undefined)

  // Determine cancellation type
  const cancellationType = useMemo(() => {
    return getCancellationType(transaction, orders)
  }, [transaction, orders])

  // Create classic cancel request (always needed for comparison)
  const classicCancelRequest = useMemo(() => {
    return createClassicCancelRequest(transaction)
  }, [transaction])

  // Get LX cancel request (single or batch)
  const lxSwapCancelRequest = useLXCancelRequest({
    transaction,
    orders,
    cancellationType,
  })

  // Calculate gas fees based on type
  const isLXCancellation = cancellationType === CancellationType.LX
  const cancelRequest = isLXCancellation ? lxSwapCancelRequest : classicCancelRequest

  const gasFee = useTransactionGasFee({
    tx: cancelRequest,
    skip: isLXCancellation && !lxSwapCancelRequest,
  })

  return useMemo(() => {
    // For plan transactions, use the plan-specific cancellation
    if (isPlan) {
      return planCancellation
    }

    return calculateCancellationGasFee({
      type: cancellationType,
      transaction,
      gasFee,
      cancelRequest,
      orders,
    })
  }, [isPlan, planCancellation, cancellationType, transaction, gasFee, cancelRequest, orders])
}

/**
 * Internal hook to get LX cancellation request
 * Handles both single transaction and batch order cancellation
 */
function useLXCancelRequest({
  transaction,
  orders,
  cancellationType,
}: {
  transaction: TransactionDetails
  orders: LxSwapOrderDetails[] | undefined
  cancellationType: CancellationType
}): providers.TransactionRequest | undefined {
  const cancelRequestFetcher = useCallback(async (): Promise<providers.TransactionRequest | null> => {
    if (cancellationType !== CancellationType.LX) {
      return null
    }
    if (orders && orders.length > 0) {
      const ordersWithEncodedData = extractCancellationData(orders)
      if (ordersWithEncodedData.length === 0) {
        return null
      }

      try {
        const cancelRequest = await getCancelMultipleLxSwapOrdersTransaction({
          orders: ordersWithEncodedData.map((order) => ({
            encodedOrder: order.encodedOrder,
            routing: order.routing,
          })),
          chainId: transaction.chainId,
          from: transaction.from,
        })
        return cancelRequest ?? null
      } catch {
        return null
      }
    }

    if (isLxSwap(transaction)) {
      try {
        const cancelRequest = await getCancelOrderTxRequest(transaction as LxSwapOrderDetails)
        return cancelRequest
      } catch {
        return null
      }
    }

    return null
  }, [cancellationType, orders, transaction])

  const queryKey = useMemo(() => {
    if (orders && orders.length > 0) {
      const orderHashes = orders
        .map((o) => o.orderHash)
        .filter(Boolean)
        .sort()
      return [ReactQueryCacheKey.CancelLXTransactionRequest, 'batch', ...orderHashes]
    }
    return [ReactQueryCacheKey.CancelLXTransactionRequest, transaction.id]
  }, [orders, transaction.id])

  const { data: cancelRequest } = useQuery({
    queryKey,
    queryFn: cancelRequestFetcher,
    enabled: cancellationType === CancellationType.LX,
  })

  return cancelRequest ?? undefined
}
