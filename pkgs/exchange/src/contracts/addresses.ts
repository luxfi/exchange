/**
 * Contract Addresses for Lux Exchange
 */
import type { Address } from 'viem'

/**
 * Contract addresses for Lux Mainnet (96369)
 */
export const LUX_MAINNET_CONTRACTS = {
  // Core — verified on-chain 2026-03-05 (149M supply)
  WLUX: '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens — verified on-chain via V3 pools and bridge MPC
  LETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  LBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
  LSOL: '0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7' as Address,
  LTON: '0x3141b94b89691009b950c96e97Bff48e0C543E3C' as Address,
  LAVAX: '0x0e4bD0DD67c15dECfBBBdbbE07FC9d51D737693D' as Address,

  // AMM V2 (CREATE2) — 1 pair on-chain
  V2_FACTORY: '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address,
  V2_ROUTER: '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address,

  // AMM V3 (CREATE2) — 8+ pools, active trading, verified on-chain
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_SWAP_ROUTER: '0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58' as Address,
  V3_SWAP_ROUTER_02: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_QUOTER_V2: '0x15C729fdd833Ba675edd466Dfc63E1B737925A4c' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,
} as const

/**
 * Contract addresses for Lux Testnet (96368)
 */
export const LUX_TESTNET_CONTRACTS = {
  // Core — deployed via DeployMultiNetwork.s.sol 2026-02-27
  WLUX: '0xDe5310d0Eccc04C8987cB66Ff6b89Ee793442C91' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens — deployed via DeployMultiNetwork.s.sol 2026-02-27
  LETH: '0xA695a8A66fbe3E32d15a531db04185313595771A' as Address,
  LBTC: '0x5a88986958ea76Dd043f834542724F081cA1443B' as Address,
  LUSDC: '0x8a3fad1c7FB94461621351aa6A983B6f814F039c' as Address,

  // AMM V2 — deployed via DeployMultiNetwork.s.sol 2026-02-27
  V2_FACTORY: '0x1DD4e6cbC6B8FD032fCAD5A3B0a45e446A014637' as Address,
  V2_ROUTER: '0xb06B31521Afc434F87Fe4852c98FC15A26c92aE8' as Address,
} as const

/**
 * DEX Precompile addresses (native AMM - Lux v4 style singleton PoolManager)
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
  // Core DEX (LP-9010 series - Lux v4 style)
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
 * Contract addresses for Zoo Mainnet (200200) — deployed 2026-03-04
 * Deployer: 0x9011E888251AB053B7bD1cdB598Db4f9DEd94714
 */
export const ZOO_MAINNET_CONTRACTS = {
  // Core
  WLUX: '0x5491216406daB99b7032b83765F36790E27F8A61' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens
  LETH: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2' as Address,
  LBTC: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8' as Address,
  LUSD: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D' as Address,

  // AMM V2
  V2_FACTORY: '0xF034942c1140125b5c278aE9cEE1B488e915B2FE' as Address,
  V2_ROUTER: '0x2cd306913e6546C59249b48d7c786A6D1d7ebE08' as Address,
} as const

/**
 * Contract addresses for Hanzo Mainnet (36963) — deployed 2026-03-04
 */
export const HANZO_MAINNET_CONTRACTS = {
  WLUX: '0x5491216406daB99b7032b83765F36790E27F8A61' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
  LETH: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2' as Address,
  LBTC: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8' as Address,
  LUSD: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D' as Address,
  V2_FACTORY: '0xDc384E006BAec602b0b2B2fe6f2712646EFb1e9D' as Address,
  V2_ROUTER: '0x191067f88d61f9506555E88CEab9CF71deeD61A9' as Address,
} as const

/**
 * Contract addresses for SPC Mainnet (36911) — deployed 2026-03-04
 */
export const SPC_MAINNET_CONTRACTS = {
  WLUX: '0x5491216406daB99b7032b83765F36790E27F8A61' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
  LETH: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2' as Address,
  LBTC: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8' as Address,
  LUSD: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D' as Address,
  V2_FACTORY: '0x84CF0A13db1be8e1F0676405cfcBC8b09692FD1C' as Address,
  V2_ROUTER: '0x2382F7A49FA48E1F91Bec466c32e1D7F13ec8206' as Address,
} as const

/**
 * Contract addresses for Pars Mainnet (494949) — deployed 2026-03-04
 */
export const PARS_MAINNET_CONTRACTS = {
  WLUX: '0x5491216406daB99b7032b83765F36790E27F8A61' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,
  LETH: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2' as Address,
  LBTC: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8' as Address,
  LUSD: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D' as Address,
  V2_FACTORY: '0xF034942c1140125b5c278aE9cEE1B488e915B2FE' as Address,
  V2_ROUTER: '0x2cd306913e6546C59249b48d7c786A6D1d7ebE08' as Address,
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
    case 200200:
      return ZOO_MAINNET_CONTRACTS
    case 36963:
      return HANZO_MAINNET_CONTRACTS
    case 36911:
      return SPC_MAINNET_CONTRACTS
    case 494949:
      return PARS_MAINNET_CONTRACTS
    case 1337:
      return LUX_DEV_CONTRACTS
    default:
      return LUX_MAINNET_CONTRACTS
  }
}

export type ContractAddresses = typeof LUX_MAINNET_CONTRACTS
