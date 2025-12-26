'use client'

import { useWaitForTransactionReceipt, useSendTransaction } from 'wagmi'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address, Hash } from 'viem'

export interface Transaction {
  hash: Hash
  type: 'swap' | 'approve' | 'addLiquidity' | 'removeLiquidity' | 'collect'
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  chainId: number
  from: Address
  description: string
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  amountOut?: string
}

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (tx: Omit<Transaction, 'timestamp'>) => void
  updateTransaction: (hash: Hash, updates: Partial<Transaction>) => void
  clearTransactions: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [{ ...tx, timestamp: Date.now() }, ...state.transactions].slice(0, 50),
        })),
      updateTransaction: (hash, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.hash === hash ? { ...tx, ...updates } : tx
          ),
        })),
      clearTransactions: () => set({ transactions: [] }),
    }),
    { name: 'lux-transactions' }
  )
)

/**
 * Hook to track a transaction
 */
export function useTransaction(hash: Hash | undefined) {
  const { updateTransaction } = useTransactionStore()

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  })

  // Update store when status changes
  if (hash && isSuccess) {
    updateTransaction(hash, { status: 'confirmed' })
  }
  if (hash && isError) {
    updateTransaction(hash, { status: 'failed' })
  }

  return {
    isLoading,
    isSuccess,
    isError,
  }
}

/**
 * Hook to get recent transactions for current account
 */
export function useRecentTransactions(address: Address | undefined, limit = 10) {
  const { transactions } = useTransactionStore()

  return transactions
    .filter((tx) => tx.from.toLowerCase() === address?.toLowerCase())
    .slice(0, limit)
}
