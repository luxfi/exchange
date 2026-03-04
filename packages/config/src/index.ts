export type { Config } from './config-types'
export { getConfig } from './getConfig'

// Chain definitions
export {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
  LUX_MAINNET_ID,
  LUX_TESTNET_ID,
  ZOO_MAINNET_ID,
  ZOO_TESTNET_ID,
  HANZO_MAINNET_ID,
  SPC_MAINNET_ID,
  PARS_MAINNET_ID,
  supportedChains,
  type SupportedChainId,
} from './chains'

// Contract addresses
export {
  LUX_MAINNET_CONTRACTS,
  LUX_TESTNET_CONTRACTS,
  ZOO_MAINNET_CONTRACTS,
  HANZO_MAINNET_CONTRACTS,
  SPC_MAINNET_CONTRACTS,
  PARS_MAINNET_CONTRACTS,
  DEX_PRECOMPILES,
  getContracts,
  type ContractAddresses,
} from './contracts'
