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
 * Deployed 2026-04-24 via DeployMultiNetwork.s.sol (nonce-based CREATE).
 * Deployer: 0x9011E888251AB053B7bD1cdB598Db4f9DEd94714.
 */
export const HANZO_MAINNET_CONTRACTS = {
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Core — native AI coin
  WLUX: '0x97c265001eb088e1de2f77a13a62b708014c9e68' as Address, // Wrapped AI
  WAI:  '0x97c265001eb088e1de2f77a13a62b708014c9e68' as Address, // alias

  // Bridged collateral (Hanzo's own — NOT the Lux/Zoo CREATE2-shared set)
  LETH: '0xc5372b943bec0dad2cb4f51ae709824f5a708dd2' as Address,
  LBTC: '0x316520ca05eac5d2418f562a116091f1b22bf6e0' as Address,
  LUSDC:'0x4a7971c204e60373001670fbe7f8ff668d0fd9a7' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address, // canonical shared

  // Staking
  STAKED_LUX: '0x4ec24da7d598cac1540f2e8078d05869e36a4ef1' as Address,

  // AMM V2
  V2_FACTORY: '0x99d7376365d48d8f917c410bb7e999db6283d3dd' as Address,
  V2_ROUTER:  '0x0b48fdb9e1a19b351c7a0a1c519abececbd9373a' as Address,

  // Governance
  VOTES_TOKEN:      '0x7ee1c236aabcecd5cbfe69e060494928ce42aa17' as Address,
  TIMELOCK:         '0xa834dcd9a7d34f32cde7e78db91c26915ef58217' as Address,
  VLUX:             '0x1f6e1b50aab840f59008f1d9bffe7a12bd3f8da7' as Address,
  GAUGE_CONTROLLER: '0x0b5c04afbec35996ed8ba81135c5c7e52b4defb4' as Address,
  KARMA:            '0x183ff5359234fc0a2fc8453f05236fb020c2aca9' as Address,
  DLUX:             '0x4be0e01c4e36e6b002eba5f62488944e362b6811' as Address,

  // Identity
  DID_REGISTRY: '0x3099908029fbf48885127d19f742a38ada3ee91d' as Address,

  // Treasury
  FEE_GOV:         '0x6ebe6ac014236e78f05fd1e9b820bf1817796f4b' as Address,
  VALIDATOR_VAULT: '0xd297db66e459ef6bda915604bd96be56a5275f82' as Address,

  // LSSVM (NFT AMM)
  LINEAR_CURVE:      '0x5bf9619a241360652196200b4a39749b97cd2009' as Address,
  EXPONENTIAL_CURVE: '0x2ce7d2cfe0e2592b09b5b2cec64e28de393ef888' as Address,
  LSSVM_FACTORY:     '0x7a082fa9e5878b2aa49c525ea4182bb9b6cdace8' as Address,

  // DeFi
  MARKETS: '0x176615d944a0becf5f9ad4658b185a3aecc5d6e3' as Address, // Morpho-style lending
  PERP:    '0xc8e5c5cba86df6307f1c167bd3958979ad178a7b' as Address, // perpetual futures
} as const

export const HANZO_TESTNET_CONTRACTS = HANZO_MAINNET_CONTRACTS
export const HANZO_DEVNET_CONTRACTS = HANZO_MAINNET_CONTRACTS

/**
 * Contract addresses for Pars Mainnet (494949).
 * Deployed 2026-04-24 via DeployMultiNetwork.s.sol (nonce-based CREATE).
 * Deployer: 0x9011E888251AB053B7bD1cdB598Db4f9DEd94714.
 * Deployer balance was 999 PARS (stale genesis); LiquidLUX setup tx skipped
 * due to insufficient funds — pending chain relaunch with 7B alloc.
 */
export const PARS_MAINNET_CONTRACTS = {
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Core
  WLUX: '0x548f54dfb32ea6ce4fa3515236696cf3d1b7d26a' as Address,

  // Bridged collateral
  LETH: '0xe0f7e9a0cb1688cca453995fd6e19ae4fbd9cbfd' as Address,
  LBTC: '0x7d7cc8d05bb0f38d80b5ce44b4b069a6fb769468' as Address,
  LUSDC:'0xc5e4a6f54be469551a342872c1ab83ab46f61b22' as Address,

  // Staking
  STAKED_LUX: '0xab95c8b59f68ce922f2f334dfc8bb8f5b0525326' as Address,

  // AMM V2
  V2_FACTORY: '0x84cf0a13db1be8e1f0676405cfcbc8b09692fd1c' as Address,
  V2_ROUTER:  '0x2382f7a49fa48e1f91bec466c32e1d7f13ec8206' as Address,

  // Governance
  VOTES_TOKEN:      '0xa4a1a9be63d2dcdf8b3d61fd2bd4b1cfc5e25dcd' as Address, // VotesToken
  TIMELOCK:         '0x1f4989a809774cea35100529690aacaf289f1dc3' as Address,
  VLUX:             '0x51b74dc77fcca83ecc2c5c70782c6eac27ea6197' as Address,
  GAUGE_CONTROLLER: '0x09ab488a7434921aabc2fff20af955a62f524862' as Address,
  KARMA:            '0x518aba97ec84851e1c68d571e2da3bd2fc0507a0' as Address,
  DLUX:             '0x18f1df4f036ad993093f8ead20dd62712dac2996' as Address,

  // Identity
  DID_REGISTRY: '0x6042014293591de798da8f40d50708d4497138d5' as Address,

  // Treasury
  FEE_GOV:         '0x5f6db1d3b6f41ffcb8987dbc392781a4c0020b30' as Address,
  VALIDATOR_VAULT: '0x50de09afe31af68acaf7d6dd7f6fe40ae190d564' as Address,

  // LSSVM (NFT AMM)
  LINEAR_CURVE:      '0xd13ab81f02449b1630ecd940be5fb9cd367225b4' as Address,
  EXPONENTIAL_CURVE: '0xbc92f4e290f8ad03f5348f81a27fb2af3b37ec47' as Address,
  LSSVM_FACTORY:     '0xb43db9af0c5cacb99f783e30398ee0aee6744212' as Address,

  // DeFi
  MARKETS: '0x3589fd09e7dff3f7653fc4965b7ce1b8d8fda9bd' as Address,
  PERP:    '0xd984fed38c98c1eab66e577fd1ddc8dcd88ea799' as Address,

  // Pre-existing (likely from a prior partial deploy attempt)
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
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
