/**
 * Contract Addresses for Lux Exchange
 */
import type { Address } from 'viem'

/**
 * Contract addresses for Lux Mainnet (96369)
 */
export const LUX_MAINNET_CONTRACTS = {
  // Core (from RLP import - source of truth)
  WLUX: '0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens (L* prefix = bridged from source chains) - from RLP
  LETH: '0x60e0a8167fc13de89348978860466c9cec24b9ba' as Address,
  LBTC: '0x1e48d32a4f5e9f08db9ae4959163300faf8a6c8e' as Address,
  LUSD: '0x848cff46eb323f323b6bbe1df274e40793d7f2c2' as Address,
  LZOO: '0x5e5290f350352768bd2bfc59c2da15dd04a7cb88' as Address,
  LSOL: '0x1af00a2590a834d14f4a8a26d1b03ebba8cf7961' as Address,
  LTON: '0xf5a313885832d4fc71d1ef80115197c4479b58c8' as Address,
  LBNB: '0x6edcf3645def09db45050638c41157d8b9fea1cf' as Address,
  LPOL: '0x28bfc5dd4b7e15659e41190983e5fe3df1132bb9' as Address,
  LCELO: '0x3078847f879a33994cda2ec1540ca52b5e0ee2e5' as Address,
  LFTM: '0x8b982132d639527e8a0eaad385f97719af8f5e04' as Address,

  // AMM V2 (QuantumSwap)
  V2_FACTORY: '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address,
  V2_ROUTER: '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address,

  // AMM V3 (Concentrated Liquidity)
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
  V3_NFT_DESCRIPTOR: '0x53B1aAA5b6DDFD4eD00D0A7b5Ef333dc74B605b5' as Address,
} as const

/**
 * Contract addresses for Lux Testnet (96368)
 */
export const LUX_TESTNET_CONTRACTS = {
  // Core (from RLP import - same as mainnet via CREATE2)
  WLUX: '0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens (L* prefix = bridged from source chains) - same as mainnet
  LETH: '0x60e0a8167fc13de89348978860466c9cec24b9ba' as Address,
  LBTC: '0x1e48d32a4f5e9f08db9ae4959163300faf8a6c8e' as Address,
  LUSD: '0x848cff46eb323f323b6bbe1df274e40793d7f2c2' as Address,
  LZOO: '0x5e5290f350352768bd2bfc59c2da15dd04a7cb88' as Address,
  LSOL: '0x1af00a2590a834d14f4a8a26d1b03ebba8cf7961' as Address,
  LTON: '0xf5a313885832d4fc71d1ef80115197c4479b58c8' as Address,
  LBNB: '0x6edcf3645def09db45050638c41157d8b9fea1cf' as Address,
  LPOL: '0x28bfc5dd4b7e15659e41190983e5fe3df1132bb9' as Address,
  LCELO: '0x3078847f879a33994cda2ec1540ca52b5e0ee2e5' as Address,
  LFTM: '0x8b982132d639527e8a0eaad385f97719af8f5e04' as Address,

  // AMM V2
  V2_FACTORY: '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address,
  V2_ROUTER: '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address,

  // AMM V3
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
  V3_NFT_DESCRIPTOR: '0x53B1aAA5b6DDFD4eD00D0A7b5Ef333dc74B605b5' as Address,
} as const

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
export const DEX_PRECOMPILES = {
  // Core DEX (LP-9010 series - Uniswap v4 style)
  POOL_MANAGER: '0x0000000000000000000000000000000000009010' as Address,   // LP-9010
  SWAP_ROUTER: '0x0000000000000000000000000000000000009012' as Address,    // LP-9012
  HOOKS_REGISTRY: '0x0000000000000000000000000000000000009013' as Address, // LP-9013
  FLASH_LOAN: '0x0000000000000000000000000000000000009014' as Address,     // LP-9014

  // DeFi Extensions
  ORACLE_HUB: '0x0000000000000000000000000000000000009011' as Address,     // LP-9011
  CLOB: '0x0000000000000000000000000000000000009020' as Address,           // LP-9020
  VAULT: '0x0000000000000000000000000000000000009030' as Address,          // LP-9030

  // Bridges (LP-6xxx)
  TELEPORT: '0x0000000000000000000000000000000000006010' as Address,       // LP-6010
} as const

/**
 * Contract addresses for Lux Dev (1337)
 * Deterministic CREATE addresses from DeployFullStack.s.sol deployed by anvil account 0
 * Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 */
export const LUX_DEV_CONTRACTS = {
  // Core - Nonce 0
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridged tokens (deterministic deployment nonces 1-3)
  LETH: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address, // Nonce 1
  LBTC: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address, // Nonce 2
  LUSD: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as Address, // Nonce 3

  // AMM V2
  V2_FACTORY: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1' as Address,
  V2_ROUTER: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE' as Address,

  // AMM V3 (uses testnet addresses for dev)
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
  V3_NFT_DESCRIPTOR: '0x53B1aAA5b6DDFD4eD00D0A7b5Ef333dc74B605b5' as Address,

  // Staking
  STAKED_LUX: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0' as Address,
} as const

/**
 * Get contracts for a specific chain
 */
export function getContracts(chainId: number) {
  switch (chainId) {
    case 96369:
      return LUX_MAINNET_CONTRACTS
    case 96368:
      return LUX_TESTNET_CONTRACTS
    case 1337:
      return LUX_DEV_CONTRACTS
    default:
      return LUX_TESTNET_CONTRACTS
  }
}

export type ContractAddresses = typeof LUX_MAINNET_CONTRACTS
