'use client';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { LUX_MAINNET_ID, LUX_TESTNET_ID, ZOO_MAINNET_ID, ZOO_TESTNET_ID } from '@luxfi/config';
/**
 * Main wallet hook that provides connection state and actions
 */
export function useWallet() {
    const { address, isConnected, isConnecting, isDisconnected, connector } = useAccount();
    const { connect, connectors, isPending: isConnectPending } = useConnect();
    const { disconnect, isPending: isDisconnectPending } = useDisconnect();
    const chainId = useChainId();
    const { switchChain, isPending: isSwitchPending } = useSwitchChain();
    const isLuxNetwork = chainId === LUX_MAINNET_ID || chainId === LUX_TESTNET_ID;
    const isZooNetwork = chainId === ZOO_MAINNET_ID || chainId === ZOO_TESTNET_ID;
    const isSupportedNetwork = isLuxNetwork || isZooNetwork;
    const switchToLux = () => switchChain({ chainId: LUX_MAINNET_ID });
    const switchToZoo = () => switchChain({ chainId: ZOO_MAINNET_ID });
    return {
        // Connection state
        address,
        isConnected,
        isConnecting: isConnecting || isConnectPending,
        isDisconnected,
        connector,
        // Chain state
        chainId,
        isLuxNetwork,
        isZooNetwork,
        isSupportedNetwork,
        // Actions
        connect,
        disconnect,
        connectors,
        switchChain,
        switchToLux,
        switchToZoo,
        // Loading states
        isConnectPending,
        isDisconnectPending,
        isSwitchPending,
    };
}
/**
 * Hook to get short address format
 */
export function useShortAddress(address, chars = 4) {
    if (!address)
        return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
