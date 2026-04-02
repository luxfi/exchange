import { TransactionTypeFilter } from '@luxamm/client-data-api/dist/data/v1/types_pb'
import { useMemo } from 'react'
import { LIMIT_SUPPORTED_CHAINS } from 'lx/src/features/chains/chainInfo'
import { useListTransactions } from 'lx/src/features/dataApi/listTransactions/listTransactions'
import { BaseResult } from 'lx/src/features/dataApi/types'
import { LXOrderDetails } from 'lx/src/features/transactions/types/transactionDetails'
import { isLimitOrder, isLXOrderPending } from 'lx/src/features/transactions/utils/lx.utils'

/**
 * Custom hook that fetches open limit orders using the ListTransactions API
 * with server-side filtering by transaction type
 */
export function useOpenLimitOrders({
  evmAddress,
  svmAddress,
}: {
  evmAddress: string
  svmAddress?: string
}): BaseResult<LXOrderDetails[]> {
  const {
    data: allLimitOrders,
    loading,
    isFetching,
    error,
    refetch,
    networkStatus,
  } = useListTransactions({
    evmAddress,
    svmAddress,
    chainIds: LIMIT_SUPPORTED_CHAINS,
    filterTransactionTypes: [TransactionTypeFilter.LIMIT_ORDER],
  })

  const openLimitOrders = useMemo(
    () =>
      allLimitOrders?.filter((tx): tx is LXOrderDetails => isLimitOrder(tx) && isLXOrderPending(tx)) ?? [],
    [allLimitOrders],
  )

  return {
    data: openLimitOrders,
    loading: loading || isFetching,
    error: error ?? undefined,
    networkStatus,
    refetch,
  }
}
