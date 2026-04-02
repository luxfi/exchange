/**
 * Contract Addresses for Lux Exchange
 */
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
 * DEX Precompile addresses (native AMM - Uniswap v4 style singleton PoolManager)
 * These provide sub-microsecond execution via native Go implementation
 *
 * Address format: 0x0000...00LPNUMBER (addresses end with LP number)
 * LP-9010: DEX Precompile - Native HFT Order Book (PoolManager)
 * LP-9011: Oracle Precompile - Multi-Source Price Aggregation
 *
 * @see ~/work/lux/precompile/registry/registry.go for the full address scheme
 * @see ~/work/lux/dex/pkg/gateway/lux/provider.go for gateway implementation
 */
export declare const DEX_PRECOMPILES: {
    readonly POOL_MANAGER: Address;
    readonly SWAP_ROUTER: Address;
    readonly HOOKS_REGISTRY: Address;
    readonly FLASH_LOAN: Address;
    readonly ORACLE_HUB: Address;
    readonly CLOB: Address;
    readonly VAULT: Address;
    readonly TELEPORT: Address;
};
/**
 * Contract addresses for Lux Dev (1337)
 * Deterministic CREATE addresses from DeployFullStack.s.sol deployed by anvil account 0
 * Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 */
export declare const LUX_DEV_CONTRACTS: {
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
    readonly STAKED_LUX: Address;
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
};
export type ContractAddresses = typeof LUX_MAINNET_CONTRACTS;
//# sourceMappingURL=addresses.d.ts.map