export type { Config } from './config-types'
export { getConfig } from './getConfig'

// Chain definitions
export {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  LUX_MAINNET_ID,
  LUX_TESTNET_ID,
  ZOO_MAINNET_ID,
  ZOO_TESTNET_ID,
  supportedChains,
  type SupportedChainId,
} from './chains'

// Contract addresses
export {
  LUX_MAINNET_CONTRACTS,
  LUX_TESTNET_CONTRACTS,
  DEX_PRECOMPILES,
  getContracts,
  type ContractAddresses,
} from './contracts'
