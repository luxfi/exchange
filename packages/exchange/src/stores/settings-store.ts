import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type RouterPreference = 'auto' | 'v2' | 'v3' | 'precompile'

export interface SettingsStore {
  // Router preference
  routerPreference: RouterPreference

  // Expert mode (skip confirmation modals)
  expertMode: boolean

  // Auto slippage
  autoSlippage: boolean

  // Hide small balances
  hideSmallBalances: boolean

  // Small balance threshold (in USD)
  smallBalanceThreshold: number

  // Actions
  setRouterPreference: (preference: RouterPreference) => void
  toggleExpertMode: () => void
  toggleAutoSlippage: () => void
  toggleHideSmallBalances: () => void
  setSmallBalanceThreshold: (threshold: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      routerPreference: 'auto',
      expertMode: false,
      autoSlippage: true,
      hideSmallBalances: false,
      smallBalanceThreshold: 1,

      setRouterPreference: (preference) => set({ routerPreference: preference }),

      toggleExpertMode: () => set((state) => ({ expertMode: !state.expertMode })),

      toggleAutoSlippage: () => set((state) => ({ autoSlippage: !state.autoSlippage })),

      toggleHideSmallBalances: () =>
        set((state) => ({ hideSmallBalances: !state.hideSmallBalances })),

      setSmallBalanceThreshold: (threshold) => set({ smallBalanceThreshold: threshold }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
