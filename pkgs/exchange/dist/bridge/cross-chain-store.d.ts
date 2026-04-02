/**
 * Zustand store for cross-chain mint operations
 */
import type { CrossChainMintRequest, CrossChainMintState, CrossChainMintStatus } from './types';
interface PendingMint extends CrossChainMintRequest {
    state: CrossChainMintState;
}
export interface CrossChainStore {
    /** Currently active mints by swap ID */
    pendingMints: Record<string, PendingMint>;
    /** Most recent completed mints (for history) */
    recentMints: PendingMint[];
    /** Maximum number of recent mints to keep */
    maxRecentMints: number;
    initiateMint: (request: CrossChainMintRequest) => string;
    updateMintStatus: (swapId: string, status: CrossChainMintStatus) => void;
    updateMintTxHash: (swapId: string, field: 'sourceTxHash' | 'mintTxHash' | 'swapTxHash', hash: string) => void;
    completeMint: (swapId: string) => void;
    failMint: (swapId: string, error: string) => void;
    cancelMint: (swapId: string) => void;
    clearPendingMint: (swapId: string) => void;
    getPendingMint: (swapId: string) => PendingMint | undefined;
    getActiveMints: () => PendingMint[];
}
export declare const useCrossChainStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<CrossChainStore>, "setState" | "devtools"> & {
    setState(partial: CrossChainStore | Partial<CrossChainStore> | ((state: CrossChainStore) => CrossChainStore | Partial<CrossChainStore>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: CrossChainStore | ((state: CrossChainStore) => CrossChainStore), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CrossChainStore, {
            recentMints: PendingMint[];
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CrossChainStore) => void) => () => void;
        onFinishHydration: (fn: (state: CrossChainStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CrossChainStore, {
            recentMints: PendingMint[];
        }>>;
    };
}>;
export {};
//# sourceMappingURL=cross-chain-store.d.ts.map