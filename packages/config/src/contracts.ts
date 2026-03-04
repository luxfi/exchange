import type { Address } from 'viem'

/**
 * Contract addresses for Lux Mainnet (96369)
 */
export const LUX_MAINNET_CONTRACTS = {
  // Core — verified on-chain 2026-03-03
  WLUX: '0x190ec57826999527d2b1abf1ea619a0e190dc3bf' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens — verified on-chain 2026-03-03
  LETH: '0x2d1d573097a1106eefd9f07b9eaa79ba55d09fc2' as Address,
  LBTC: '0xab95c8b59f68ce922f2f334dfc8bb8f5b0525326' as Address,
  LUSDC: '0xf85cf66fd0189c435033056edec5e525f39374a6' as Address,

  // AMM V2 — verified on-chain 2026-03-03
  V2_FACTORY: '0xfcf74fe55da242d72ff063c603cd6abff4fa98b8' as Address,
  V2_ROUTER: '0x84cf0a13db1be8e1f0676405cfcbc8b09692fd1c' as Address,

  // AMM V2 LP Pools — deployed 2026-03-03
  V2_POOL_WLUX_LUSDC: '0x7E09cE37D615E0A1a3841C3F4b84110865e5849a' as Address,
  V2_POOL_WLUX_LETH: '0x72163c486ccB7A37Cd5261e5fF9C13CBC1C24780' as Address,
  V2_POOL_WLUX_LBTC: '0x1759ab5B054a806892a8c92Ca941DBc6087A3a8F' as Address,

  // Governance
  STAKED_LUX: '0xc606302cd0722DD42c460B09930477d09993F913' as Address,
  VLUX: '0x55833074AD22E2aAE81ad377A600340eC0bc7cbd' as Address,
  KARMA: '0xc3d1efb6Eaedd048dDfE7066F1c719C7B6Ca43ad' as Address,
  DLUX: '0xAAbD65c4Fe3d3f9d54A7C3C7B95B9eD359CC52A8' as Address,

  // DeFi
  MARKETS: '0x308EBD39eB5E27980944630A0af6F8B0d19e31C6' as Address,
  PERP: '0x82312E295533Ab5167B306d5aBF7F3eB2C0D95fD' as Address,
} as const

/**
 * Contract addresses for Lux Testnet (96368)
 */
export const LUX_TESTNET_CONTRACTS = {
  // Core — verified on-chain 2026-02-27
  WLUX: '0xDe5310d0Eccc04C8987cB66Ff6b89Ee793442C91' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens — verified on-chain 2026-02-27
  LETH: '0xa695A8a66fbe3e32d15a531Db04185313595771a' as Address,
  LBTC: '0x5a88986958ea76Dd043f834542724F081cA1443B' as Address,
  LUSDC: '0x8a3fad1c7FB94461621351aa6A983B6f814F039c' as Address,

  // AMM V2 — verified on-chain 2026-02-27
  V2_FACTORY: '0x1dD4E6cbC6B8fD032FCad5a3b0a45E446A014637' as Address,
  V2_ROUTER: '0xb06B31521Afc434F87Fe4852c98FC15A26c92aE8' as Address,

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
 * Contract addresses for Zoo Mainnet (200200)
 */
export const ZOO_MAINNET_CONTRACTS = {
  // Core — verified on-chain 2026-02-27
  WLUX: '0x49b76d9ca9bca9e9edef5e2ec4ed425b2e6b2445' as Address,

  // Bridge tokens — verified on-chain 2026-02-27
  LETH: '0x82312e295533ab5167b306d5abf7f3eb2c0d95fd' as Address,
  LBTC: '0x923fd54fb626b01b1444cd2dd5b7bd02648d60e0' as Address,
  LUSDC: '0x6aab89551e94e393185e77537f89c7d3834afae1' as Address,

  // AMM V2 (original 7 contracts, shared across all subnets)
  V2_FACTORY: '0x84CF0A13db1BE8E1f0676405CfcBC8b09692fd1C' as Address,
  V2_ROUTER: '0x2382F7A49Fa48E1f91bEc466C32E1d7f13Ec8206' as Address,

  // DeFi
  MARKETS: '0xabbc9a75b40dd3a8ee7bcf6cb7be41e67fd5dba3' as Address,
} as const

/**
 * Contract addresses for Hanzo Mainnet (36963)
 * Shared subnet deployment addresses (nonce 0)
 */
export const HANZO_MAINNET_CONTRACTS = {
  WLUX: '0x49b76d9ca9bca9e9edef5e2ec4ed425b2e6b2445' as Address,
  LETH: '0x82312e295533ab5167b306d5abf7f3eb2c0d95fd' as Address,
  LBTC: '0x923fd54fb626b01b1444cd2dd5b7bd02648d60e0' as Address,
  LUSDC: '0x6aab89551e94e393185e77537f89c7d3834afae1' as Address,
  V2_FACTORY: '0x84CF0A13db1BE8E1f0676405CfcBC8b09692fd1C' as Address,
  V2_ROUTER: '0x2382F7A49Fa48E1f91bEc466C32E1d7f13Ec8206' as Address,
  MARKETS: '0xabbc9a75b40dd3a8ee7bcf6cb7be41e67fd5dba3' as Address,
} as const

/**
 * Contract addresses for SPC Mainnet (36911)
 * Shared subnet deployment addresses (nonce 0)
 */
export const SPC_MAINNET_CONTRACTS = {
  WLUX: '0x49b76d9ca9bca9e9edef5e2ec4ed425b2e6b2445' as Address,
  LETH: '0x82312e295533ab5167b306d5abf7f3eb2c0d95fd' as Address,
  LBTC: '0x923fd54fb626b01b1444cd2dd5b7bd02648d60e0' as Address,
  LUSDC: '0x6aab89551e94e393185e77537f89c7d3834afae1' as Address,
  V2_FACTORY: '0x84CF0A13db1BE8E1f0676405CfcBC8b09692fd1C' as Address,
  V2_ROUTER: '0x2382F7A49Fa48E1f91bEc466C32E1d7f13Ec8206' as Address,
  MARKETS: '0xabbc9a75b40dd3a8ee7bcf6cb7be41e67fd5dba3' as Address,
} as const

/**
 * Contract addresses for Pars Mainnet (494949)
 * Shared subnet deployment addresses (nonce 0)
 */
export const PARS_MAINNET_CONTRACTS = {
  WLUX: '0x49b76d9ca9bca9e9edef5e2ec4ed425b2e6b2445' as Address,
  LETH: '0x82312e295533ab5167b306d5abf7f3eb2c0d95fd' as Address,
  LBTC: '0x923fd54fb626b01b1444cd2dd5b7bd02648d60e0' as Address,
  LUSDC: '0x6aab89551e94e393185e77537f89c7d3834afae1' as Address,
  V2_FACTORY: '0x84CF0A13db1BE8E1f0676405CfcBC8b09692fd1C' as Address,
  V2_ROUTER: '0x2382F7A49Fa48E1f91bEc466C32E1d7f13Ec8206' as Address,
  MARKETS: '0xabbc9a75b40dd3a8ee7bcf6cb7be41e67fd5dba3' as Address,
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
