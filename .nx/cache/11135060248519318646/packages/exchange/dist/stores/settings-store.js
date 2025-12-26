import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useSettingsStore = create()(persist((set) => ({
    routerPreference: 'auto',
    expertMode: false,
    autoSlippage: true,
    hideSmallBalances: false,
    smallBalanceThreshold: 1,
    setRouterPreference: (preference) => set({ routerPreference: preference }),
    toggleExpertMode: () => set((state) => ({ expertMode: !state.expertMode })),
    toggleAutoSlippage: () => set((state) => ({ autoSlippage: !state.autoSlippage })),
    toggleHideSmallBalances: () => set((state) => ({ hideSmallBalances: !state.hideSmallBalances })),
    setSmallBalanceThreshold: (threshold) => set({ smallBalanceThreshold: threshold }),
}), {
    name: 'settings-storage',
}));
