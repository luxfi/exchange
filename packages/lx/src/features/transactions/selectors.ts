import { createSelector, Selector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { normalizeCurrencyIdForMapLookup } from 'lx/src/data/cache'
import { SearchableRecipient } from 'lx/src/features/address/types'
import { uniqueAddressesOnly } from 'lx/src/features/address/utils'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { TransactionsState } from 'lx/src/features/transactions/slice'
import { isBridge, isClassic, isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import {
  InterfaceTransactionDetails,
  PlanTransactionDetails,
  SendTokenTransactionInfo,
  TransactionDetails,
  TransactionType,
  DEXOrderDetails,
} from 'lx/src/features/transactions/types/transactionDetails'
import { isFinalizedTx, isPlanTransactionDetails } from 'lx/src/features/transactions/types/utils'
import { isLimitOrder } from 'lx/src/features/transactions/utils/dex.utils'
import { selectTokensVisibility } from 'lx/src/features/visibility/selectors'
import { CurrencyIdToVisibility } from 'lx/src/features/visibility/slice'
import { LuxState } from 'lx/src/state/luxReducer'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { unique } from 'utilities/src/primitives/array'
import { flattenObjectOfObjects } from 'utilities/src/primitives/objects'

export const selectTransactions = (state: LuxState): TransactionsState => state.transactions

export const selectSwapTransactionsCount = createSelector(selectTransactions, (transactions) => {
  let swapTransactionCount = 0
  const txs = flattenObjectOfObjects(transactions)
  for (const tx of txs) {
    for (const transaction of Object.values(tx)) {
      if (transaction.typeInfo.type === TransactionType.Swap) {
        swapTransactionCount++
      }
    }
  }
  return swapTransactionCount
})

type PlatformAddresses = {
  evmAddress: Address | null
  svmAddress: Address | null
}

export type AddressTransactionsSelector = Selector<LuxState, TransactionDetails[] | undefined, [PlatformAddresses]>
export function makeSelectAddressTransactions(): AddressTransactionsSelector {
  const extractAddresses = (_: LuxState, addresses: PlatformAddresses): PlatformAddresses => addresses

  return createSelector(selectTransactions, extractAddresses, (transactions, { evmAddress, svmAddress }) => {
    if (!evmAddress && !svmAddress) {
      return undefined
    }

    const evmAddressTransactions = evmAddress ? transactions[evmAddress] : undefined
    const svmAddressTransactions = svmAddress ? transactions[svmAddress] : undefined

    if (!evmAddressTransactions && !svmAddressTransactions) {
      return undefined
    }

    // Combine transactions from both addresses
    const combinedTransactions = {
      ...(evmAddressTransactions || {}),
      ...(svmAddressTransactions || {}),
    }

    // eslint-disable-next-line max-params
    return unique(flattenObjectOfObjects(combinedTransactions), (tx, _, self) => {
      // Remove dummy local FOR transactions from TransactionList, notification badge, etc.
      // this is what prevents the local transactions from actually appearing in the activity tab.
      if (tx.typeInfo.type === TransactionType.LocalOnRamp || tx.typeInfo.type === TransactionType.LocalOffRamp) {
        return false
      }
      // Remove limit orders from the main activity list (they appear in their own menu)
      if (isLimitOrder(tx)) {
        return false
      }
      /*
       * Remove duplicate transactions with the same chain and nonce, keep the one with the higher addedTime,
       * this represents a txn that is replacing or cancelling the older txn.
       */
      const duplicate = self.find(
        (tx2) =>
          tx2.id !== tx.id &&
          (isClassic(tx) || isBridge(tx)) &&
          (isClassic(tx2) || isBridge(tx2)) &&
          tx2.options.request.chainId &&
          tx2.options.request.chainId === tx.options.request.chainId &&
          tx.options.request.nonce &&
          tx2.options.request.nonce === tx.options.request.nonce,
      )
      if (duplicate) {
        return tx.addedTime > duplicate.addedTime
      }
      return true
    })
  })
}

export function useSelectAddressTransactions({
  evmAddress,
  svmAddress,
}: {
  evmAddress?: Address | null
  svmAddress?: Address | null
}): TransactionDetails[] | undefined {
  const selectAddressTransactions = useMemo(makeSelectAddressTransactions, [])
  const addressParams = useMemo(
    () => ({ evmAddress: evmAddress ?? null, svmAddress: svmAddress ?? null }),
    [evmAddress, svmAddress],
  )
  return useSelector((state: LuxState) => selectAddressTransactions(state, addressParams))
}

export function useCurrencyIdToVisibility(addresses: Address[]): CurrencyIdToVisibility {
  const manuallySetTokenVisibility = useSelector(selectTokensVisibility)
  const selectLocalTxCurrencyIds: (state: LuxState, addresses: Address[]) => CurrencyIdToVisibility = useMemo(
    makeSelectTokenVisibilityFromLocalTxs,
    [],
  )

  const tokenVisibilityFromLocalTxs = useSelector((state: LuxState) => selectLocalTxCurrencyIds(state, addresses))

  return useMemo(
    () => ({
      ...tokenVisibilityFromLocalTxs,
      // Tokens the user has individually shown/hidden in the app should take preference over local txs
      ...manuallySetTokenVisibility,
    }),
    [manuallySetTokenVisibility, tokenVisibilityFromLocalTxs],
  )
}

const makeSelectTokenVisibilityFromLocalTxs = (): Selector<LuxState, CurrencyIdToVisibility, [Address[]]> =>
  createSelector(
    selectTransactions,
    (_: LuxState, addresses: Address[]) => addresses,
    (transactions, addresses) =>
      addresses.reduce<CurrencyIdToVisibility>((acc, address) => {
        const addressTransactions = transactions[address]
        if (!addressTransactions) {
          return acc
        }

        Object.values(flattenObjectOfObjects(addressTransactions)).forEach((tx) => {
          if (tx.typeInfo.type === TransactionType.Send) {
            acc[normalizeCurrencyIdForMapLookup(buildCurrencyId(tx.chainId, tx.typeInfo.tokenAddress))] = {
              isVisible: true,
            }
          } else if (tx.typeInfo.type === TransactionType.Swap) {
            acc[normalizeCurrencyIdForMapLookup(tx.typeInfo.inputCurrencyId)] = { isVisible: true }
            acc[normalizeCurrencyIdForMapLookup(tx.typeInfo.outputCurrencyId)] = { isVisible: true }
          }
        })

        return acc
      }, {}),
  )

interface MakeSelectParams {
  address: Address | undefined
  chainId: UniverseChainId | undefined
  txId: string | undefined
}

export const makeSelectTransaction = (): Selector<
  LuxState,
  TransactionDetails | InterfaceTransactionDetails | undefined,
  [MakeSelectParams]
> =>
  createSelector(
    selectTransactions,
    (_: LuxState, { address, chainId, txId }: MakeSelectParams) => ({
      address,
      chainId,
      txId,
    }),
    (transactions, { address, chainId, txId }): TransactionDetails | InterfaceTransactionDetails | undefined => {
      if (!address || !transactions[address] || !chainId || !txId) {
        return undefined
      }

      const addressTxs = transactions[address][chainId]
      if (!addressTxs) {
        return undefined
      }

      return Object.values(addressTxs).find((txDetails) => txDetails.id === txId)
    },
  )

interface MakeSelectOrderParams {
  orderHash: string
}

export const makeSelectDEXOrder = (): Selector<
  LuxState,
  DEXOrderDetails | undefined,
  [MakeSelectOrderParams]
> =>
  createSelector(
    selectTransactions,
    (_: LuxState, { orderHash }: MakeSelectOrderParams) => ({ orderHash }),
    (transactions, { orderHash }): DEXOrderDetails | undefined => {
      for (const transactionsForChain of flattenObjectOfObjects(transactions)) {
        for (const tx of Object.values(transactionsForChain)) {
          if (isDEX(tx) && tx.orderHash === orderHash) {
            return tx
          }
        }
      }
      return undefined
    },
  )

interface MakeSelectPlanParams {
  planId: string
}

export const makeSelectPlanTransaction = (): Selector<
  LuxState,
  PlanTransactionDetails | undefined,
  [MakeSelectPlanParams]
> =>
  createSelector(
    selectTransactions,
    (_: LuxState, { planId }: MakeSelectPlanParams) => ({ planId }),
    (transactions, { planId }): PlanTransactionDetails | undefined => {
      for (const transactionsForChain of flattenObjectOfObjects(transactions)) {
        for (const tx of Object.values(transactionsForChain)) {
          if (isPlanTransactionDetails(tx) && tx.typeInfo.planId === planId) {
            return tx
          }
        }
      }
      return undefined
    },
  )

// Returns a list of past recipients ordered from most to least recent
// TODO: [MOB-232] either revert this to return addresses or keep but also return displayName so that it's searchable for RecipientSelect
export const selectRecipientsByRecency = (state: LuxState): SearchableRecipient[] => {
  const transactionsByChainId = flattenObjectOfObjects(state.transactions)
  const sendTransactions = transactionsByChainId.reduce<TransactionDetails[]>((accum, transactions) => {
    const sendTransactionsWithRecipients = Object.values(transactions).filter(
      (tx) => tx.typeInfo.type === TransactionType.Send && tx.typeInfo.recipient,
    )
    return [...accum, ...sendTransactionsWithRecipients]
  }, [])
  const sortedRecipients = sendTransactions
    .sort((a, b) => (a.addedTime < b.addedTime ? 1 : -1))
    .map((transaction) => {
      return {
        address: (transaction.typeInfo as SendTokenTransactionInfo).recipient,
        name: '',
      } as SearchableRecipient
    })
  return uniqueAddressesOnly(sortedRecipients)
}

export const selectIncompleteTransactions = (state: LuxState): TransactionDetails[] => {
  const transactionsByChainId = flattenObjectOfObjects(state.transactions)
  return transactionsByChainId.reduce<TransactionDetails[]>((accum, transactions) => {
    const pendingTxs = Object.values(transactions)
      .filter((tx) => {
        // Check if receipt property exists before accessing it
        return !('receipt' in tx) || !tx.receipt
      })
      .filter((tx) => !isFinalizedTx(tx))
    return [...accum, ...pendingTxs]
  }, [])
}

interface SelectTransactionParams {
  address: string
  chainId: UniverseChainId
  txId: string
}

/**
 * Selector to get a specific transaction from the store
 * Returns the transaction if it exists, undefined otherwise
 */
export const selectTransaction = (
  state: LuxState,
  params: SelectTransactionParams,
): TransactionDetails | InterfaceTransactionDetails | undefined => {
  const transactions = selectTransactions(state)
  const { address, chainId, txId } = params

  return transactions[address]?.[chainId]?.[txId]
}

/**
 * Selector to get a specific transaction from the store
 * Returns the transaction if it exists, undefined otherwise
 */
export const selectPlanTransaction = (
  state: LuxState,
  params: {
    address: string
    chainId: UniverseChainId
    planId: string
  },
): PlanTransactionDetails | undefined => {
  const transactions = selectTransactions(state)
  const { address, chainId, planId } = params
  const planTransaction = transactions[address]?.[chainId]?.[planId]
  if (!planTransaction || !isPlanTransactionDetails(planTransaction)) {
    return undefined
  }
  return planTransaction
}
