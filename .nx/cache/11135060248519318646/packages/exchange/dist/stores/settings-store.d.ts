export type RouterPreference = 'auto' | 'v2' | 'v3' | 'precompile';
export interface SettingsStore {
    routerPreference: RouterPreference;
    expertMode: boolean;
    autoSlippage: boolean;
    hideSmallBalances: boolean;
    smallBalanceThreshold: number;
    setRouterPreference: (preference: RouterPreference) => void;
    toggleExpertMode: () => void;
    toggleAutoSlippage: () => void;
    toggleHideSmallBalances: () => void;
    setSmallBalanceThreshold: (threshold: number) => void;
}
export declare const useSettingsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SettingsStore>, "setState" | "persist"> & {
    setState(partial: SettingsStore | Partial<SettingsStore> | ((state: SettingsStore) => SettingsStore | Partial<SettingsStore>), replace?: false | undefined): unknown;
    setState(state: SettingsStore | ((state: SettingsStore) => SettingsStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SettingsStore, SettingsStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SettingsStore) => void) => () => void;
        onFinishHydration: (fn: (state: SettingsStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SettingsStore, SettingsStore, unknown>>;
    };
}>;
//# sourceMappingURL=settings-store.d.ts.map