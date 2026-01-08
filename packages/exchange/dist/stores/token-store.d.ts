import type { Token } from '../tokens';
export interface TokenStore {
    customTokens: Token[];
    favoriteTokens: string[];
    addCustomToken: (token: Token) => void;
    removeCustomToken: (address: string) => void;
    toggleFavorite: (address: string) => void;
    isFavorite: (address: string) => boolean;
}
export declare const useTokenStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<TokenStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<TokenStore, TokenStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: TokenStore) => void) => () => void;
        onFinishHydration: (fn: (state: TokenStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<TokenStore, TokenStore>>;
    };
}>;
//# sourceMappingURL=token-store.d.ts.map