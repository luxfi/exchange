import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTokenStore = create()(persist((set, get) => ({
    customTokens: [],
    favoriteTokens: [],
    addCustomToken: (token) => set((state) => {
        // Check if token already exists
        if (state.customTokens.some((t) => t.address.toLowerCase() === token.address.toLowerCase())) {
            return state;
        }
        return { customTokens: [...state.customTokens, token] };
    }),
    removeCustomToken: (address) => set((state) => ({
        customTokens: state.customTokens.filter((t) => t.address.toLowerCase() !== address.toLowerCase()),
    })),
    toggleFavorite: (address) => set((state) => {
        const normalized = address.toLowerCase();
        if (state.favoriteTokens.includes(normalized)) {
            return {
                favoriteTokens: state.favoriteTokens.filter((a) => a !== normalized),
            };
        }
        return {
            favoriteTokens: [...state.favoriteTokens, normalized],
        };
    }),
    isFavorite: (address) => {
        return get().favoriteTokens.includes(address.toLowerCase());
    },
}), {
    name: 'token-storage',
}));
