import type { Address } from 'viem';
/**
 * Contract addresses for Lux Mainnet (96369)
 */
export declare const LUX_MAINNET_CONTRACTS: {
    readonly WLUX: Address;
    readonly MULTICALL: Address;
    readonly LETH: Address;
    readonly LBTC: Address;
    readonly LUSD: Address;
    readonly V2_FACTORY: Address;
    readonly V2_ROUTER: Address;
    readonly V3_FACTORY: Address;
    readonly V3_SWAP_ROUTER: Address;
    readonly V3_SWAP_ROUTER_02: Address;
    readonly V3_QUOTER: Address;
    readonly V3_QUOTER_V2: Address;
    readonly V3_TICK_LENS: Address;
    readonly V3_NFT_POSITION_MANAGER: Address;
    readonly V3_NFT_DESCRIPTOR: Address;
};
/**
 * Contract addresses for Lux Testnet (96368)
 */
export declare const LUX_TESTNET_CONTRACTS: {
    readonly WLUX: Address;
    readonly WETH: Address;
    readonly MULTICALL: Address;
    readonly V2_FACTORY: Address;
    readonly V2_ROUTER: Address;
    readonly V3_FACTORY: Address;
    readonly V3_SWAP_ROUTER: Address;
    readonly V3_SWAP_ROUTER_02: Address;
    readonly V3_QUOTER: Address;
    readonly V3_QUOTER_V2: Address;
    readonly V3_TICK_LENS: Address;
    readonly V3_NFT_POSITION_MANAGER: Address;
    readonly V3_NFT_DESCRIPTOR: Address;
};
/**
 * DEX Precompile addresses (native AMM)
 * These provide sub-microsecond execution
 */
export declare const DEX_PRECOMPILES: {
    readonly POOL_MANAGER: Address;
    readonly SWAP_ROUTER: Address;
    readonly HOOKS_REGISTRY: Address;
    readonly FLASH_LOAN: Address;
};
/**
 * Get contracts for a specific chain
 */
export declare function getContracts(chainId: number): {
    readonly WLUX: Address;
    readonly MULTICALL: Address;
    readonly LETH: Address;
    readonly LBTC: Address;
    readonly LUSD: Address;
    readonly V2_FACTORY: Address;
    readonly V2_ROUTER: Address;
    readonly V3_FACTORY: Address;
    readonly V3_SWAP_ROUTER: Address;
    readonly V3_SWAP_ROUTER_02: Address;
    readonly V3_QUOTER: Address;
    readonly V3_QUOTER_V2: Address;
    readonly V3_TICK_LENS: Address;
    readonly V3_NFT_POSITION_MANAGER: Address;
    readonly V3_NFT_DESCRIPTOR: Address;
} | {
    readonly WLUX: Address;
    readonly WETH: Address;
    readonly MULTICALL: Address;
    readonly V2_FACTORY: Address;
    readonly V2_ROUTER: Address;
    readonly V3_FACTORY: Address;
    readonly V3_SWAP_ROUTER: Address;
    readonly V3_SWAP_ROUTER_02: Address;
    readonly V3_QUOTER: Address;
    readonly V3_QUOTER_V2: Address;
    readonly V3_TICK_LENS: Address;
    readonly V3_NFT_POSITION_MANAGER: Address;
    readonly V3_NFT_DESCRIPTOR: Address;
};
export type ContractAddresses = typeof LUX_MAINNET_CONTRACTS;
//# sourceMappingURL=contracts.d.ts.map