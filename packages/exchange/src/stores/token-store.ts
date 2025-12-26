import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Token } from '../tokens'

export interface TokenStore {
  // Custom tokens added by user
  customTokens: Token[]

  // Favorite tokens
  favoriteTokens: string[] // addresses

  // Actions
  addCustomToken: (token: Token) => void
  removeCustomToken: (address: string) => void
  toggleFavorite: (address: string) => void
  isFavorite: (address: string) => boolean
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      customTokens: [],
      favoriteTokens: [],

      addCustomToken: (token) =>
        set((state) => {
          // Check if token already exists
          if (state.customTokens.some((t) => t.address.toLowerCase() === token.address.toLowerCase())) {
            return state
          }
          return { customTokens: [...state.customTokens, token] }
        }),

      removeCustomToken: (address) =>
        set((state) => ({
          customTokens: state.customTokens.filter(
            (t) => t.address.toLowerCase() !== address.toLowerCase()
          ),
        })),

      toggleFavorite: (address) =>
        set((state) => {
          const normalized = address.toLowerCase()
          if (state.favoriteTokens.includes(normalized)) {
            return {
              favoriteTokens: state.favoriteTokens.filter((a) => a !== normalized),
            }
          }
          return {
            favoriteTokens: [...state.favoriteTokens, normalized],
          }
        }),

      isFavorite: (address) => {
        return get().favoriteTokens.includes(address.toLowerCase())
      },
    }),
    {
      name: 'token-storage',
    }
  )
)
