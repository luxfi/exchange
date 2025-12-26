import type { Address, Hash } from 'viem';
export interface Transaction {
    hash: Hash;
    type: 'swap' | 'approve' | 'addLiquidity' | 'removeLiquidity' | 'collect';
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: number;
    chainId: number;
    from: Address;
    description: string;
    tokenIn?: string;
    tokenOut?: string;
    amountIn?: string;
    amountOut?: string;
}
interface TransactionStore {
    transactions: Transaction[];
    addTransaction: (tx: Omit<Transaction, 'timestamp'>) => void;
    updateTransaction: (hash: Hash, updates: Partial<Transaction>) => void;
    clearTransactions: () => void;
}
export declare const useTransactionStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<TransactionStore>, "setState" | "persist"> & {
    setState(partial: TransactionStore | Partial<TransactionStore> | ((state: TransactionStore) => TransactionStore | Partial<TransactionStore>), replace?: false | undefined): unknown;
    setState(state: TransactionStore | ((state: TransactionStore) => TransactionStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<TransactionStore, TransactionStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: TransactionStore) => void) => () => void;
        onFinishHydration: (fn: (state: TransactionStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<TransactionStore, TransactionStore, unknown>>;
    };
}>;
/**
 * Hook to track a transaction
 */
export declare function useTransaction(hash: Hash | undefined): {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
};
/**
 * Hook to get recent transactions for current account
 */
export declare function useRecentTransactions(address: Address | undefined, limit?: number): Transaction[];
export {};
//# sourceMappingURL=use-transactions.d.ts.map