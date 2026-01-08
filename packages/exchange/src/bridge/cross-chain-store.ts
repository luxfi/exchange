/**
 * Zustand store for cross-chain mint operations
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { CrossChainMintRequest, CrossChainMintState, CrossChainMintStatus } from './types'

interface PendingMint extends CrossChainMintRequest {
  state: CrossChainMintState
}

export interface CrossChainStore {
  /** Currently active mints by swap ID */
  pendingMints: Record<string, PendingMint>
  /** Most recent completed mints (for history) */
  recentMints: PendingMint[]
  /** Maximum number of recent mints to keep */
  maxRecentMints: number

  // Actions
  initiateMint: (request: CrossChainMintRequest) => string
  updateMintStatus: (swapId: string, status: CrossChainMintStatus) => void
  updateMintTxHash: (swapId: string, field: 'sourceTxHash' | 'mintTxHash' | 'swapTxHash', hash: string) => void
  completeMint: (swapId: string) => void
  failMint: (swapId: string, error: string) => void
  cancelMint: (swapId: string) => void
  clearPendingMint: (swapId: string) => void
  getPendingMint: (swapId: string) => PendingMint | undefined
  getActiveMints: () => PendingMint[]
}

// Generate a random swap ID
function generateSwapId(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const useCrossChainStore = create<CrossChainStore>()(
  devtools(
    persist(
      (set, get) => ({
        pendingMints: {},
        recentMints: [],
        maxRecentMints: 20,

        initiateMint: (request: CrossChainMintRequest) => {
          const swapId = generateSwapId()
          const now = Date.now()

          const pendingMint: PendingMint = {
            ...request,
            state: {
              swapId: swapId as `0x${string}`,
              status: 'initiating',
              sourceTxHash: null,
              mintTxHash: null,
              swapTxHash: null,
              error: null,
              startedAt: now,
              completedAt: null,
            },
          }

          set((state) => ({
            pendingMints: {
              ...state.pendingMints,
              [swapId]: pendingMint,
            },
          }))

          return swapId
        },

        updateMintStatus: (swapId: string, status: CrossChainMintStatus) => {
          set((state) => {
            const mint = state.pendingMints[swapId]
            if (!mint) return state

            return {
              pendingMints: {
                ...state.pendingMints,
                [swapId]: {
                  ...mint,
                  state: {
                    ...mint.state,
                    status,
                  },
                },
              },
            }
          })
        },

        updateMintTxHash: (swapId: string, field: 'sourceTxHash' | 'mintTxHash' | 'swapTxHash', hash: string) => {
          set((state) => {
            const mint = state.pendingMints[swapId]
            if (!mint) return state

            return {
              pendingMints: {
                ...state.pendingMints,
                [swapId]: {
                  ...mint,
                  state: {
                    ...mint.state,
                    [field]: hash,
                  },
                },
              },
            }
          })
        },

        completeMint: (swapId: string) => {
          set((state) => {
            const mint = state.pendingMints[swapId]
            if (!mint) return state

            const completedMint: PendingMint = {
              ...mint,
              state: {
                ...mint.state,
                status: 'complete',
                completedAt: Date.now(),
              },
            }

            const { [swapId]: _, ...remainingPending } = state.pendingMints
            const newRecent = [completedMint, ...state.recentMints].slice(0, state.maxRecentMints)

            return {
              pendingMints: remainingPending,
              recentMints: newRecent,
            }
          })
        },

        failMint: (swapId: string, error: string) => {
          set((state) => {
            const mint = state.pendingMints[swapId]
            if (!mint) return state

            return {
              pendingMints: {
                ...state.pendingMints,
                [swapId]: {
                  ...mint,
                  state: {
                    ...mint.state,
                    status: 'failed',
                    error,
                    completedAt: Date.now(),
                  },
                },
              },
            }
          })
        },

        cancelMint: (swapId: string) => {
          set((state) => {
            const mint = state.pendingMints[swapId]
            if (!mint) return state

            return {
              pendingMints: {
                ...state.pendingMints,
                [swapId]: {
                  ...mint,
                  state: {
                    ...mint.state,
                    status: 'cancelled',
                    completedAt: Date.now(),
                  },
                },
              },
            }
          })
        },

        clearPendingMint: (swapId: string) => {
          set((state) => {
            const { [swapId]: _, ...remainingPending } = state.pendingMints
            return { pendingMints: remainingPending }
          })
        },

        getPendingMint: (swapId: string) => {
          return get().pendingMints[swapId]
        },

        getActiveMints: () => {
          const { pendingMints } = get()
          return Object.values(pendingMints).filter(
            (m) => m.state.status !== 'failed' && m.state.status !== 'cancelled'
          )
        },
      }),
      {
        name: 'cross-chain-mint-storage',
        partialize: (state) => ({
          recentMints: state.recentMints,
        }),
      }
    ),
    { name: 'CrossChainStore' }
  )
)
