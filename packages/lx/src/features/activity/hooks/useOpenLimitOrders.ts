import { TransactionTypeFilter } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { useMemo } from 'react'
import { LIMIT_SUPPORTED_CHAINS } from 'lx/src/features/chains/chainInfo'
import { useListTransactions } from 'lx/src/features/dataApi/listTransactions/listTransactions'
import { BaseResult } from 'lx/src/features/dataApi/types'
import { DEXOrderDetails } from 'lx/src/features/transactions/types/transactionDetails'
import { isLimitOrder, isDEXOrderPending } from 'lx/src/features/transactions/utils/dex.utils'

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
}): BaseResult<DEXOrderDetails[]> {
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
      allLimitOrders?.filter((tx): tx is DEXOrderDetails => isLimitOrder(tx) && isDEXOrderPending(tx)) ?? [],
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
