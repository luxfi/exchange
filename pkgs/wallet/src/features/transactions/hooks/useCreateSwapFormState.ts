import { useMemo } from 'react'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { useSelectTransaction } from 'lx/src/features/transactions/hooks/useSelectTransaction'
import { TransactionType } from 'lx/src/features/transactions/types/transactionDetails'
import { TransactionState } from 'lx/src/features/transactions/types/transactionState'
import { createSwapFormFromTxDetails } from '@luxfi/wallet/src/features/transactions/swap/createSwapFormFromTxDetails'

export function useCreateSwapFormState({
  address,
  chainId,
  txId,
}: {
  address?: Address
  chainId?: UniverseChainId
  txId?: string
}): TransactionState | undefined {
  const transaction = useSelectTransaction({ address, chainId, txId })

  const inputCurrencyId =
    transaction?.typeInfo.type === TransactionType.Swap || transaction?.typeInfo.type === TransactionType.Bridge
      ? transaction.typeInfo.inputCurrencyId
      : undefined

  const outputCurrencyId =
    transaction?.typeInfo.type === TransactionType.Swap || transaction?.typeInfo.type === TransactionType.Bridge
      ? transaction.typeInfo.outputCurrencyId
      : undefined

  const inputCurrencyInfo = useCurrencyInfo(inputCurrencyId)
  const outputCurrencyInfo = useCurrencyInfo(outputCurrencyId)

  return useMemo(() => {
    if (!chainId || !txId || !transaction) {
      return undefined
    }

    return createSwapFormFromTxDetails({
      transactionDetails: transaction,
      inputCurrency: inputCurrencyInfo?.currency,
      outputCurrency: outputCurrencyInfo?.currency,
    })
  }, [chainId, inputCurrencyInfo, outputCurrencyInfo, transaction, txId])
}
