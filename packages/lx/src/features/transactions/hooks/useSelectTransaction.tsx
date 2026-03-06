import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { makeSelectTransaction } from 'lx/src/features/transactions/selectors'
import {
  InterfaceTransactionDetails,
  TransactionDetails,
} from 'lx/src/features/transactions/types/transactionDetails'
import { LuxState } from 'lx/src/state/luxReducer'

export function useSelectTransaction({
  address,
  chainId,
  txId,
}: {
  address?: Address
  chainId?: UniverseChainId
  txId?: string
}): TransactionDetails | InterfaceTransactionDetails | undefined {
  const selectTransaction = useMemo(makeSelectTransaction, [])
  return useSelector((state: LuxState) => selectTransaction(state, { address, chainId, txId }))
}
