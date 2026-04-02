/**
 * Chain definitions for Lux Exchange
 */

export {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  luxDev,
  liquidityMainnet,
  liquidityTestnet,
  liquidityDevnet,
  supportedChains,
  LUX_MAINNET_ID,
  LUX_TESTNET_ID,
  ZOO_MAINNET_ID,
  ZOO_TESTNET_ID,
  LUX_DEV_ID,
  LIQUIDITY_MAINNET_ID,
  LIQUIDITY_TESTNET_ID,
  LIQUIDITY_DEVNET_ID,
  type SupportedChainId,
} from './lux'

// Re-export common chains from wagmi for external chain support
export { mainnet, sepolia, arbitrum, optimism, polygon, base } from 'wagmi/chains'
