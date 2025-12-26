export { useTransactionStore } from '../hooks/use-transactions';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useWalletPreferences = create()(persist((set) => ({
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
    addRecentToken: (token) => set((state) => ({
        recentTokens: [token, ...state.recentTokens.filter((t) => t !== token)].slice(0, 10),
    })),
    toggleFavoriteToken: (token) => set((state) => ({
        favoriteTokens: state.favoriteTokens.includes(token)
            ? state.favoriteTokens.filter((t) => t !== token)
            : [...state.favoriteTokens, token],
    })),
}), { name: 'lux-wallet-preferences' }));
