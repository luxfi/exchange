export { useTransactionStore } from '../hooks/use-transactions'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address } from 'viem'

interface WalletPreferences {
  // Slippage tolerance in basis points (50 = 0.5%)
  slippageTolerance: number
  // Transaction deadline in minutes
  deadline: number
  // Whether to use expert mode
  expertMode: boolean
  // Preferred chain ID
  preferredChainId: number | null
  // Recent tokens
  recentTokens: Address[]
  // Favorite tokens
  favoriteTokens: Address[]
}

interface WalletPreferencesStore extends WalletPreferences {
  setSlippageTolerance: (value: number) => void
  setDeadline: (value: number) => void
  setExpertMode: (value: boolean) => void
  setPreferredChainId: (chainId: number | null) => void
  addRecentToken: (token: Address) => void
  toggleFavoriteToken: (token: Address) => void
}

export const useWalletPreferences = create<WalletPreferencesStore>()(
  persist(
    (set) => ({
      slippageTolerance: 50, // 0.5%
      deadline: 30, // 30 minutes
      expertMode: false,
      preferredChainId: null,
      recentTokens: [],
      favoriteTokens: [],

      setSlippageTolerance: (value) => set({ slippageTolerance: value }),
      setDeadline: (value) => set({ deadline: value }),
      setExpertMode: (value) => set({ expertMode: value }),
      setPreferredChainId: (chainId) => set({ preferredChainId: chainId }),
      addRecentToken: (token) =>
        set((state) => ({
          recentTokens: [token, ...state.recentTokens.filter((t) => t !== token)].slice(0, 10),
        })),
      toggleFavoriteToken: (token) =>
        set((state) => ({
          favoriteTokens: state.favoriteTokens.includes(token)
            ? state.favoriteTokens.filter((t) => t !== token)
            : [...state.favoriteTokens, token],
        })),
    }),
    { name: 'lux-wallet-preferences' }
  )
)
