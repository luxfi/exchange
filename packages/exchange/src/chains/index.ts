/**
 * Chain definitions for Lux Exchange
 */

export {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  supportedChains,
  type SupportedChainId,
} from '@luxfi/config'

// Re-export common chains from wagmi for external chain support
export { mainnet, sepolia, arbitrum, optimism, polygon, base } from 'wagmi/chains'
