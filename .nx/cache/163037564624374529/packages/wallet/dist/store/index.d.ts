export { useTransactionStore } from '../hooks/use-transactions';
import type { Address } from 'viem';
interface WalletPreferences {
    slippageTolerance: number;
    deadline: number;
    expertMode: boolean;
    preferredChainId: number | null;
    recentTokens: Address[];
    favoriteTokens: Address[];
}
interface WalletPreferencesStore extends WalletPreferences {
    setSlippageTolerance: (value: number) => void;
    setDeadline: (value: number) => void;
    setExpertMode: (value: boolean) => void;
    setPreferredChainId: (chainId: number | null) => void;
    addRecentToken: (token: Address) => void;
    toggleFavoriteToken: (token: Address) => void;
}
export declare const useWalletPreferences: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<WalletPreferencesStore>, "setState" | "persist"> & {
    setState(partial: WalletPreferencesStore | Partial<WalletPreferencesStore> | ((state: WalletPreferencesStore) => WalletPreferencesStore | Partial<WalletPreferencesStore>), replace?: false | undefined): unknown;
    setState(state: WalletPreferencesStore | ((state: WalletPreferencesStore) => WalletPreferencesStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<WalletPreferencesStore, WalletPreferencesStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: WalletPreferencesStore) => void) => () => void;
        onFinishHydration: (fn: (state: WalletPreferencesStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<WalletPreferencesStore, WalletPreferencesStore, unknown>>;
    };
}>;
//# sourceMappingURL=index.d.ts.map