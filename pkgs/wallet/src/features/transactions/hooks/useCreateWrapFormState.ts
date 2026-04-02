import { Currency } from '@luxamm/sdk-core'
import { useMemo } from 'react'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useSelectTransaction } from 'lx/src/features/transactions/hooks/useSelectTransaction'
import { TransactionState } from 'lx/src/features/transactions/types/transactionState'
import { createWrapFormFromTxDetails } from '@luxfi/wallet/src/features/transactions/swap/createSwapFormFromTxDetails'

export function useCreateWrapFormState({
  address,
  chainId,
  txId,
  inputCurrency,
  outputCurrency,
}: {
  address?: Address
  chainId?: UniverseChainId
  txId?: string
  inputCurrency: Maybe<Currency>
  outputCurrency: Maybe<Currency>
}): TransactionState | undefined {
  const transaction = useSelectTransaction({ address, chainId, txId })

  return useMemo(() => {
    if (!chainId || !txId || !transaction) {
      return undefined
    }

    return createWrapFormFromTxDetails({
      transactionDetails: transaction,
      inputCurrency,
      outputCurrency,
    })
  }, [chainId, inputCurrency, outputCurrency, transaction, txId])
}
