/**
 * Zustand store for cross-chain mint operations
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
// Generate a random swap ID
function generateSwapId() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
export const useCrossChainStore = create()(devtools(persist((set, get) => ({
    pendingMints: {},
    recentMints: [],
    maxRecentMints: 20,
    initiateMint: (request) => {
        const swapId = generateSwapId();
        const now = Date.now();
        const pendingMint = {
            ...request,
            state: {
                swapId: swapId,
                status: 'initiating',
                sourceTxHash: null,
                mintTxHash: null,
                swapTxHash: null,
                error: null,
                startedAt: now,
                completedAt: null,
            },
        };
        set((state) => ({
            pendingMints: {
                ...state.pendingMints,
                [swapId]: pendingMint,
            },
        }));
        return swapId;
    },
    updateMintStatus: (swapId, status) => {
        set((state) => {
            const mint = state.pendingMints[swapId];
            if (!mint)
                return state;
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
            };
        });
    },
    updateMintTxHash: (swapId, field, hash) => {
        set((state) => {
            const mint = state.pendingMints[swapId];
            if (!mint)
                return state;
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
            };
        });
    },
    completeMint: (swapId) => {
        set((state) => {
            const mint = state.pendingMints[swapId];
            if (!mint)
                return state;
            const completedMint = {
                ...mint,
                state: {
                    ...mint.state,
                    status: 'complete',
                    completedAt: Date.now(),
                },
            };
            const { [swapId]: _, ...remainingPending } = state.pendingMints;
            const newRecent = [completedMint, ...state.recentMints].slice(0, state.maxRecentMints);
            return {
                pendingMints: remainingPending,
                recentMints: newRecent,
            };
        });
    },
    failMint: (swapId, error) => {
        set((state) => {
            const mint = state.pendingMints[swapId];
            if (!mint)
                return state;
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
            };
        });
    },
    cancelMint: (swapId) => {
        set((state) => {
            const mint = state.pendingMints[swapId];
            if (!mint)
                return state;
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
            };
        });
    },
    clearPendingMint: (swapId) => {
        set((state) => {
            const { [swapId]: _, ...remainingPending } = state.pendingMints;
            return { pendingMints: remainingPending };
        });
    },
    getPendingMint: (swapId) => {
        return get().pendingMints[swapId];
    },
    getActiveMints: () => {
        const { pendingMints } = get();
        return Object.values(pendingMints).filter((m) => m.state.status !== 'failed' && m.state.status !== 'cancelled');
    },
}), {
    name: 'cross-chain-mint-storage',
    partialize: (state) => ({
        recentMints: state.recentMints,
    }),
}), { name: 'CrossChainStore' }));
