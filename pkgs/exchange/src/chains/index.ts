/**
 * Canonical Lux-ecosystem chains + common external chains.
 * All 3 envs (mainnet/testnet/devnet) available for every native chain.
 */

export {
  // Lux
  luxMainnet,    luxTestnet,    luxDevnet,
  LUX_MAINNET_ID, LUX_TESTNET_ID,
  // Zoo
  zooMainnet,    zooTestnet,    zooDevnet,
  ZOO_MAINNET_ID, ZOO_TESTNET_ID, ZOO_DEVNET_ID,
  // Hanzo (AI chain — $AI token)
  hanzoMainnet,  hanzoTestnet,  hanzoDevnet,
  HANZO_MAINNET_ID, HANZO_TESTNET_ID,
  // Pars
  parsMainnet,   parsTestnet,   parsDevnet,
  PARS_MAINNET_ID,
  // Liquid EVM (regulated securities via Liquidity.io)
  liquidMainnet, liquidTestnet, liquidDevnet,
  LIQUID_MAINNET_ID, LIQUID_TESTNET_ID, LIQUID_DEVNET_ID,
  // Local dev (anvil/hardhat-compatible)
  localDev,
  LOCAL_DEV_ID,

  /**
   * Canonical enabled-by-default chain set — lux, zoo, hanzo, pars,
   * liquid. SPC + local-dev available via explicit import.
   */
  canonicalChains,
  supportedChains,
  type SupportedChainId,
} from './canonical'

// External EVM chains from wagmi for cross-chain support
export { mainnet, sepolia, arbitrum, optimism, polygon, base } from 'wagmi/chains'
