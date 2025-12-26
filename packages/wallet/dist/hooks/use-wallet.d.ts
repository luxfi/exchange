/**
 * Main wallet hook that provides connection state and actions
 */
export declare function useWallet(): {
    address: `0x${string}` | undefined;
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    connector: import("wagmi").Connector | undefined;
    chainId: number;
    isLuxNetwork: boolean;
    isZooNetwork: boolean;
    isSupportedNetwork: boolean;
    connect: import("wagmi/query").ConnectMutate<import("wagmi").Config, unknown>;
    disconnect: import("wagmi/query").DisconnectMutate<unknown>;
    connectors: readonly import("wagmi").Connector<import("wagmi").CreateConnectorFn>[];
    switchChain: import("wagmi/query").SwitchChainMutate<import("wagmi").Config, unknown>;
    switchToLux: () => void;
    switchToZoo: () => void;
    isConnectPending: boolean;
    isDisconnectPending: boolean;
    isSwitchPending: boolean;
};
/**
 * Hook to get short address format
 */
export declare function useShortAddress(address: string | undefined, chars?: number): string;
//# sourceMappingURL=use-wallet.d.ts.map