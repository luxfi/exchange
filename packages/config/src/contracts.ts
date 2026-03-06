import type { Address } from 'viem'

/**
 * Contract addresses for Lux Mainnet (96369)
 */
export const LUX_MAINNET_CONTRACTS = {
  // Core — WLUX wiped by 2026-03-01 re-genesis, needs redeployment
  WLUX: '0x3C18bB6B17eb3F0879d4653e0120a531aF4d86E3' as Address,
  MULTICALL: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F' as Address,

  // Bridge tokens — wiped by re-genesis, need redeployment
  LETH: '0x5a88986958ea76Dd043f834542724F081cA1443B' as Address,
  LBTC: '0x8a3fad1c7FB94461621351aa6A983B6f814F039c' as Address,
  LUSDC: '0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96' as Address,

  // AMM V2 (CREATE2) — survived re-genesis
  V2_FACTORY: '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address,
  V2_ROUTER: '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address,

  // AMM V3 (CREATE2) — 27 pools, 100k+ swaps, active trading
  V3_FACTORY: '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address,
  V3_ROUTER: '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address,
  V3_QUOTER: '0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275' as Address,
  V3_NFT_POSITION_MANAGER: '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28' as Address,

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
 * Contract addresses for Zoo Mainnet (200200)
 */
export const ZOO_MAINNET_CONTRACTS = {
  // Core — deployed via DeployMultiNetwork.s.sol 2026-03-04
  WLUX: '0x5491216406daB99b7032b83765F36790E27F8A61' as Address,
  LETH: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2' as Address,
  LBTC: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8' as Address,
  LUSDC: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D' as Address,
  V2_FACTORY: '0xF034942c1140125b5c278aE9cEE1B488e915B2FE' as Address,
  V2_ROUTER: '0x2cd306913e6546C59249b48d7c786A6D1d7ebE08' as Address,
  MARKETS: '0x6B7D3c38A3e030B95E101927Ee6ff9913ef626d4' as Address,
} as const

/**
 * Contract addresses for Hanzo Mainnet (36963)
 * Shared subnet deployment addresses (nonce 0)
 */
export const HANZO_MAINNET_CONTRACTS = {
  // Deployed via DeployMultiNetwork.s.sol 2026-03-04
  WLUX: '0xc65ea8882020Af7CDa7854d590C6Fcd34BF364ec' as Address,
  LETH: '0x9378b62fC172d2A4f715d7ecF49DE0362f1BB702' as Address,
  LBTC: '0x7fC4f8a926E47Fa3587C0d7658C00E7489e67916' as Address,
  LUSDC: '0x51c3408B9A6a0B2446CCB78c72C846CEB76201FA' as Address,
  V2_FACTORY: '0xDc384E006BAec602b0b2B2fe6f2712646EFb1e9D' as Address,
  V2_ROUTER: '0x191067f88d61f9506555E88CEab9CF71deeD61A9' as Address,
  MARKETS: '0x9BC44B0De1aBe2e436C8fA5Cd5cA519026b9D8fD' as Address,
} as const

/**
 * Contract addresses for SPC Mainnet (36911)
 * Shared subnet deployment addresses (nonce 0)
 */
export const SPC_MAINNET_CONTRACTS = {
  // NOT DEPLOYED — genesis key unknown, deployment blocked
  WLUX: '0x0000000000000000000000000000000000000000' as Address,
  LETH: '0x0000000000000000000000000000000000000000' as Address,
  LBTC: '0x0000000000000000000000000000000000000000' as Address,
  LUSDC: '0x0000000000000000000000000000000000000000' as Address,
  V2_FACTORY: '0x0000000000000000000000000000000000000000' as Address,
  V2_ROUTER: '0x0000000000000000000000000000000000000000' as Address,
  MARKETS: '0x0000000000000000000000000000000000000000' as Address,
} as const

/**
 * Contract addresses for Pars Mainnet (494949)
 * Shared subnet deployment addresses (nonce 0)
 */
export const PARS_MAINNET_CONTRACTS = {
  // Deployed via DeployMultiNetwork.s.sol 2026-03-04
  WLUX: '0x548F54Dfb32ea6cE4fa3515236696CF3d1b7D26a' as Address,
  LETH: '0xe0f7E9A0cB1688ccA453995fd6e19AE4fbD9cBfd' as Address,
  LBTC: '0x7d7cC8D05BB0F38D80b5Ce44b4b069A6FB769468' as Address,
  LUSDC: '0xC5e4A6f54Be469551a342872C1aB83AB46f61b22' as Address,
  V2_FACTORY: '0x84CF0A13db1be8e1F0676405cfcBC8b09692FD1C' as Address,
  V2_ROUTER: '0x2382F7A49FA48E1F91Bec466c32e1D7F13ec8206' as Address,
  MARKETS: '0x3589fd09e7dfF3f7653fc4965B7CE1b8d8fdA9Bd' as Address,
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
