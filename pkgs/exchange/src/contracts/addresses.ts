/**
 * Contract Addresses for Lux Exchange — canonical, single source of truth.
 *
 * Native DEX pipeline per chain:
 *   precompile (LP-9010 family)  →  V3 factory+router+quoter  →  V2 factory+router  →  gateway (Warp)
 *
 * Bridge tokens are CREATE2-deterministic across all Lux-ecosystem chains,
 * so LETH/ZETH share the same address, likewise LBTC/ZBTC, LUSD/ZUSD, etc.
 * Source: ~/work/lux/bridge (Teleport wrapped-asset registry).
 */
import type { Address } from 'viem'

/**
 * Contract addresses for Lux Mainnet (96369)
 */
export const LUX_MAINNET_CONTRACTS = {
  // Core — verified on-chain 2026-03-05 (149M supply)
  WLUX: '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens (L-prefix on Lux chain) — verified via V3 pools + bridge MPC
  LETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  LBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
  LSOL: '0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7' as Address,
  LTON: '0x3141b94b89691009b950c96e97Bff48e0C543E3C' as Address,
  LAVAX: '0x7dfb3cBf7CF9c96fd56e3601FBA50AF45C731211' as Address,
  LBNB: '0x6EdcF3645DeF09DB45050638c41157D8B9FEa1cf' as Address,
  LPOL: '0x28BfC5DD4B7E15659e41190983e5fE3df1132bB9' as Address,
  LCELO: '0x3078847F879A33994cDa2Ec1540ca52b5E0eE2e5' as Address,
  LFTM: '0x8B982132d639527E8a0eAAD385f97719af8f5e04' as Address,
  LADA: '0x8b34152832b8ab4a3274915675754AA61eC113F0' as Address,
  LXDAI: '0x7dfb3cBf7CF9c96fd56e3601FBA50AF45C731211' as Address,

  // AMM V2 — 1 pair on-chain
  V2_FACTORY: '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address,
  V2_ROUTER: '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address,

  // AMM V3 — 8+ pools, active trading, verified on-chain
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
} as const

/**
 * Contract addresses for Lux Testnet (96368)
 */
export const LUX_TESTNET_CONTRACTS = {
  WLUX: '0x732740c5c895C9FCF619930ed4293fc858eb44c7' as Address,
  WETH: '0xd9956542B51032d940ef076d70B69410667277A3' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  LETH: '0xA695a8A66fbe3E32d15a531db04185313595771A' as Address,
  LBTC: '0x5a88986958ea76Dd043f834542724F081cA1443B' as Address,
  LUSDC: '0x8a3fad1c7FB94461621351aa6A983B6f814F039c' as Address,

  V2_FACTORY: '0x81C3669B139D92909AA67DbF74a241b10540d919' as Address,
  V2_ROUTER: '0xDB6c703c80BFaE5F9a56482d3c8535f27E1136EB' as Address,

  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
} as const

/**
 * DEX Precompile addresses (native AMM — Lux v4 style singleton PoolManager)
 * These provide sub-microsecond execution via native Go implementation.
 *
 * Address format: 0x0000...00LPNUMBER (addresses end with LP number)
 * LP-9010: DEX Precompile - Native HFT Order Book (PoolManager)
 * LP-9011: Oracle Precompile - Multi-Source Price Aggregation
 *
 * @see ~/work/lux/precompile/registry/registry.go for the full address scheme
 * @see ~/work/lux/dex/pkg/gateway/lux/provider.go for gateway implementation
 */
export const DEX_PRECOMPILES = {
  POOL_MANAGER: '0x0000000000000000000000000000000000009010' as Address,   // LP-9010
  ORACLE_HUB: '0x0000000000000000000000000000000000009011' as Address,     // LP-9011
  SWAP_ROUTER: '0x0000000000000000000000000000000000009012' as Address,    // LP-9012
  HOOKS_REGISTRY: '0x0000000000000000000000000000000000009013' as Address, // LP-9013
  FLASH_LOAN: '0x0000000000000000000000000000000000009014' as Address,     // LP-9014
  CLOB: '0x0000000000000000000000000000000000009020' as Address,           // LP-9020
  VAULT: '0x0000000000000000000000000000000000009030' as Address,          // LP-9030
  TELEPORT: '0x0000000000000000000000000000000000006010' as Address,       // LP-6010
} as const

/**
 * Contract addresses for Localnet (EVM chain id 31337 — anvil/hardhat/foundry default).
 * Deterministic CREATE addresses from DeployFullStack.s.sol deployed by anvil account 0.
 * NOT the Lux Devnet (chain 96370) — see LUX_TESTNET_CONTRACTS for that.
 */
export const LOCALNET_CONTRACTS = {
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
  LETH: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address,
  LBTC: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
  LUSD: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as Address,
  V2_FACTORY: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1' as Address,
  V2_ROUTER: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE' as Address,
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
  V3_NFT_DESCRIPTOR: '0x53B1aAA5b6DDFD4eD00D0A7b5Ef333dc74B605b5' as Address,
  STAKED_LUX: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0' as Address,
} as const

/**
 * Contract addresses for Zoo Mainnet (200200).
 * Z-prefix bridge tokens deployed via ~/work/lux/bridge (Teleport).
 * V2/V3 AMM deployed 2024 via @luxfi/standard.
 */
export const ZOO_MAINNET_CONTRACTS = {
  // Core
  WZOO: '0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Z-prefix bridge tokens (Teleport wrapped assets — CREATE2 shared w/ Lux)
  ZETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  ZBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  ZUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
  ZLUX: '0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88' as Address,
  ZBNB: '0x6EdcF3645DeF09DB45050638c41157D8B9FEa1cf' as Address,
  ZPOL: '0x28BfC5DD4B7E15659e41190983e5fE3df1132bB9' as Address,
  ZCELO: '0x3078847F879A33994cDa2Ec1540ca52b5E0eE2e5' as Address,
  ZFTM: '0x8B982132d639527E8a0eAAD385f97719af8f5e04' as Address,
  ZXDAI: '0x7dfb3cBf7CF9c96fd56e3601FBA50AF45C731211' as Address,
  ZSOL: '0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7' as Address,
  ZTON: '0x3141b94b89691009b950c96e97Bff48e0C543E3C' as Address,
  ZADA: '0x8b34152832b8ab4a3274915675754AA61eC113F0' as Address,

  // AMM V2
  V2_FACTORY: '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address,
  V2_ROUTER: '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address,

  // AMM V3
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_TICK_LENS: '0x57A22965AdA0e52D785A9Aa155beF423D573b879' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,

  // V3 pools with liquidity
  POOL_WZOO_ZUSD_3000: '0x37011bB281676f85962fb35C674f7E9EB7584452' as Address,
  POOL_WZOO_ZLUX_3000: '0x1c000d5dbE1246Fb84Ad431e933E5563F212A62b' as Address,
} as const

/**
 * Contract addresses for Zoo Testnet (200201) — same CREATE2 addresses.
 */
export const ZOO_TESTNET_CONTRACTS = ZOO_MAINNET_CONTRACTS

/**
 * Contract addresses for Zoo Devnet (200202) — same CREATE2 addresses.
 */
export const ZOO_DEVNET_CONTRACTS = ZOO_MAINNET_CONTRACTS

/**
 * Contract addresses for Hanzo Mainnet (36963).
 * TODO: Full AMM + bridge deploy pending — same pattern as Zoo.
 */
export const HANZO_MAINNET_CONTRACTS = {
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
  // Bridge tokens — shared CREATE2 deployments, identical to Lux/Zoo
  LETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  LBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
} as const

export const HANZO_TESTNET_CONTRACTS = HANZO_MAINNET_CONTRACTS
export const HANZO_DEVNET_CONTRACTS = HANZO_MAINNET_CONTRACTS

/**
 * Contract addresses for Pars Mainnet (494949).
 * TODO: Full AMM + bridge deploy pending — same pattern as Zoo.
 */
export const PARS_MAINNET_CONTRACTS = {
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
  LETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  LBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
} as const

export const PARS_TESTNET_CONTRACTS = PARS_MAINNET_CONTRACTS
export const PARS_DEVNET_CONTRACTS = PARS_MAINNET_CONTRACTS

/**
 * Contract addresses for Liquid EVM Mainnet (8675309).
 * Regulated-securities ATS on Liquid EVM; adapter + router TBD (MPC-signed deploy).
 */
export const LIQUID_MAINNET_CONTRACTS = {
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
} as const

export const LIQUID_TESTNET_CONTRACTS = LIQUID_MAINNET_CONTRACTS
export const LIQUID_DEVNET_CONTRACTS = LIQUID_MAINNET_CONTRACTS

/**
 * Get contracts for a specific chain.
 */
export function getContracts(chainId: number) {
  switch (chainId) {
    case 96369:  return LUX_MAINNET_CONTRACTS
    case 96368:  return LUX_TESTNET_CONTRACTS
    case 96370:  return LUX_TESTNET_CONTRACTS
    case 200200: return ZOO_MAINNET_CONTRACTS
    case 200201: return ZOO_TESTNET_CONTRACTS
    case 200202: return ZOO_DEVNET_CONTRACTS
    case 36963:  return HANZO_MAINNET_CONTRACTS
    case 36964:  return HANZO_TESTNET_CONTRACTS
    case 36965:  return HANZO_DEVNET_CONTRACTS
    case 494949: return PARS_MAINNET_CONTRACTS
    case 7071:   return PARS_TESTNET_CONTRACTS
    case 7072:   return PARS_DEVNET_CONTRACTS
    case 8675309: return LIQUID_MAINNET_CONTRACTS
    case 8675310: return LIQUID_TESTNET_CONTRACTS
    case 8675311: return LIQUID_DEVNET_CONTRACTS
    case 31337:  return LOCALNET_CONTRACTS
    default:     return LUX_MAINNET_CONTRACTS
  }
}

export type ContractAddresses = typeof LUX_MAINNET_CONTRACTS
