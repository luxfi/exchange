/**
 * Lux Ecosystem Chain Configurations
 * All mainnet and testnet chains for the Lux ecosystem
 */

export interface ChainConfig {
  chainId: number
  chainIdHex: string
  name: string
  shortName: string
  network: 'mainnet' | 'testnet'
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  iconUrl?: string
  isL2?: boolean
  parentChainId?: number
  vmType: 'evm' | 'xvm' | 'pvm' // EVM, X-Chain VM, Platform VM
}

// ============================================
// LUX ECOSYSTEM - MAINNET CHAINS
// ============================================

export const LUX_MAINNET: ChainConfig = {
  chainId: 96369,
  chainIdHex: '0x17871',
  name: 'Lux Mainnet',
  shortName: 'LUX',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Lux',
    symbol: 'LUX',
    decimals: 18,
  },
  rpcUrls: ['https://api.lux.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.lux.network'],
  iconUrl: 'https://lux.network/logo.svg',
  vmType: 'evm',
}

export const ZOO_MAINNET: ChainConfig = {
  chainId: 200200,
  chainIdHex: '0x30da8',
  name: 'Zoo Mainnet',
  shortName: 'ZOO',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Zoo',
    symbol: 'ZOO',
    decimals: 18,
  },
  rpcUrls: ['https://api.zoo.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.zoo.network'],
  iconUrl: 'https://zoo.network/logo.svg',
  vmType: 'evm',
}

export const SPC_MAINNET: ChainConfig = {
  chainId: 36911,
  chainIdHex: '0x902f',
  name: 'SPC Mainnet',
  shortName: 'SPC',
  network: 'mainnet',
  nativeCurrency: {
    name: 'SPC',
    symbol: 'SPC',
    decimals: 18,
  },
  rpcUrls: ['https://api.spc.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.spc.network'],
  vmType: 'evm',
}

export const HANZO_MAINNET: ChainConfig = {
  chainId: 36963,
  chainIdHex: '0x9063',
  name: 'Hanzo Mainnet',
  shortName: 'HANZO',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Hanzo',
    symbol: 'HANZO',
    decimals: 18,
  },
  rpcUrls: ['https://api.hanzo.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.hanzo.network'],
  vmType: 'evm',
}

// ============================================
// LUX ECOSYSTEM - TESTNET CHAINS
// ============================================

export const LUX_TESTNET: ChainConfig = {
  chainId: 96368,
  chainIdHex: '0x17870',
  name: 'Lux Testnet',
  shortName: 'LUX-TEST',
  network: 'testnet',
  nativeCurrency: {
    name: 'Lux',
    symbol: 'LUX',
    decimals: 18,
  },
  rpcUrls: ['https://api.lux-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.lux-test.network'],
  iconUrl: 'https://lux.network/logo.svg',
  vmType: 'evm',
}

export const ZOO_TESTNET: ChainConfig = {
  chainId: 200201,
  chainIdHex: '0x30da9',
  name: 'Zoo Testnet',
  shortName: 'ZOO-TEST',
  network: 'testnet',
  nativeCurrency: {
    name: 'Zoo',
    symbol: 'ZOO',
    decimals: 18,
  },
  rpcUrls: ['https://api.zoo-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.zoo-test.network'],
  iconUrl: 'https://zoo.network/logo.svg',
  vmType: 'evm',
}

export const SPC_TESTNET: ChainConfig = {
  chainId: 36912,
  chainIdHex: '0x9030',
  name: 'SPC Testnet',
  shortName: 'SPC-TEST',
  network: 'testnet',
  nativeCurrency: {
    name: 'SPC',
    symbol: 'SPC',
    decimals: 18,
  },
  rpcUrls: ['https://api.spc-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.spc-test.network'],
  vmType: 'evm',
}

export const HANZO_TESTNET: ChainConfig = {
  chainId: 36962,
  chainIdHex: '0x9062',
  name: 'Hanzo Testnet',
  shortName: 'HANZO-TEST',
  network: 'testnet',
  nativeCurrency: {
    name: 'Hanzo',
    symbol: 'HANZO',
    decimals: 18,
  },
  rpcUrls: ['https://api.hanzo-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://explore.hanzo-test.network'],
  vmType: 'evm',
}

// ============================================
// EXTERNAL CHAINS - L1 MAINNETS
// ============================================

export const ETHEREUM_MAINNET: ChainConfig = {
  chainId: 1,
  chainIdHex: '0x1',
  name: 'Ethereum',
  shortName: 'ETH',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'],
  blockExplorerUrls: ['https://etherscan.io'],
  vmType: 'evm',
}

export const BNB_MAINNET: ChainConfig = {
  chainId: 56,
  chainIdHex: '0x38',
  name: 'BNB Smart Chain',
  shortName: 'BSC',
  network: 'mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org', 'https://rpc.ankr.com/bsc'],
  blockExplorerUrls: ['https://bscscan.com'],
  vmType: 'evm',
}

export const POLYGON_MAINNET: ChainConfig = {
  chainId: 137,
  chainIdHex: '0x89',
  name: 'Polygon',
  shortName: 'POL',
  network: 'mainnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'],
  blockExplorerUrls: ['https://polygonscan.com'],
  vmType: 'evm',
}

export const AVALANCHE_MAINNET: ChainConfig = {
  chainId: 43114,
  chainIdHex: '0xa86a',
  name: 'Avalanche C-Chain',
  shortName: 'AVAX',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io'],
  vmType: 'evm',
}

// ============================================
// EXTERNAL CHAINS - L2 MAINNETS
// ============================================

export const ARBITRUM_ONE: ChainConfig = {
  chainId: 42161,
  chainIdHex: '0xa4b1',
  name: 'Arbitrum One',
  shortName: 'ARB',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
  blockExplorerUrls: ['https://arbiscan.io'],
  isL2: true,
  parentChainId: 1,
  vmType: 'evm',
}

export const OPTIMISM_MAINNET: ChainConfig = {
  chainId: 10,
  chainIdHex: '0xa',
  name: 'Optimism',
  shortName: 'OP',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.optimism.io', 'https://rpc.ankr.com/optimism'],
  blockExplorerUrls: ['https://optimistic.etherscan.io'],
  isL2: true,
  parentChainId: 1,
  vmType: 'evm',
}

export const BASE_MAINNET: ChainConfig = {
  chainId: 8453,
  chainIdHex: '0x2105',
  name: 'Base',
  shortName: 'BASE',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.base.org', 'https://rpc.ankr.com/base'],
  blockExplorerUrls: ['https://basescan.org'],
  isL2: true,
  parentChainId: 1,
  vmType: 'evm',
}

export const BLAST_MAINNET: ChainConfig = {
  chainId: 81457,
  chainIdHex: '0x13e31',
  name: 'Blast',
  shortName: 'BLAST',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.blast.io'],
  blockExplorerUrls: ['https://blastscan.io'],
  isL2: true,
  parentChainId: 1,
  vmType: 'evm',
}

export const ZORA_MAINNET: ChainConfig = {
  chainId: 7777777,
  chainIdHex: '0x76adf1',
  name: 'Zora',
  shortName: 'ZORA',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.zora.energy'],
  blockExplorerUrls: ['https://explorer.zora.energy'],
  isL2: true,
  parentChainId: 1,
  vmType: 'evm',
}

// ============================================
// TESTNETS
// ============================================

export const ETHEREUM_SEPOLIA: ChainConfig = {
  chainId: 11155111,
  chainIdHex: '0xaa36a7',
  name: 'Sepolia',
  shortName: 'SEP',
  network: 'testnet',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org', 'https://rpc.ankr.com/eth_sepolia'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
  vmType: 'evm',
}

export const BASE_SEPOLIA: ChainConfig = {
  chainId: 84532,
  chainIdHex: '0x14a34',
  name: 'Base Sepolia',
  shortName: 'BASE-SEP',
  network: 'testnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
  isL2: true,
  parentChainId: 11155111,
  vmType: 'evm',
}

// ============================================
// CHAIN COLLECTIONS
// ============================================

// All Lux ecosystem chains
export const LUX_CHAINS: ChainConfig[] = [
  LUX_MAINNET,
  LUX_TESTNET,
  ZOO_MAINNET,
  ZOO_TESTNET,
  SPC_MAINNET,
  SPC_TESTNET,
  HANZO_MAINNET,
  HANZO_TESTNET,
]

// External mainnet chains
export const EXTERNAL_MAINNETS: ChainConfig[] = [
  ETHEREUM_MAINNET,
  BNB_MAINNET,
  POLYGON_MAINNET,
  AVALANCHE_MAINNET,
  ARBITRUM_ONE,
  OPTIMISM_MAINNET,
  BASE_MAINNET,
  BLAST_MAINNET,
  ZORA_MAINNET,
]

// External testnet chains
export const EXTERNAL_TESTNETS: ChainConfig[] = [
  ETHEREUM_SEPOLIA,
  BASE_SEPOLIA,
]

// All supported chains
export const ALL_CHAINS: ChainConfig[] = [
  ...LUX_CHAINS,
  ...EXTERNAL_MAINNETS,
  ...EXTERNAL_TESTNETS,
]

// Mainnet-only chains
export const MAINNET_CHAINS: ChainConfig[] = ALL_CHAINS.filter(
  (c) => c.network === 'mainnet'
)

// Testnet-only chains
export const TESTNET_CHAINS: ChainConfig[] = ALL_CHAINS.filter(
  (c) => c.network === 'testnet'
)

// L2 chains
export const L2_CHAINS: ChainConfig[] = ALL_CHAINS.filter((c) => c.isL2)

// Chain lookup by ID
export const CHAIN_BY_ID: Record<number, ChainConfig> = ALL_CHAINS.reduce(
  (acc, chain) => {
    acc[chain.chainId] = chain
    return acc
  },
  {} as Record<number, ChainConfig>
)

// Get chain by ID
export function getChainById(chainId: number): ChainConfig | undefined {
  return CHAIN_BY_ID[chainId]
}

// Get chain by hex ID
export function getChainByHexId(hexId: string): ChainConfig | undefined {
  const chainId = parseInt(hexId, 16)
  return CHAIN_BY_ID[chainId]
}

// Check if chain is supported
export function isChainSupported(chainId: number): boolean {
  return chainId in CHAIN_BY_ID
}

// Get default RPC for chain
export function getDefaultRpc(chainId: number): string | undefined {
  return CHAIN_BY_ID[chainId]?.rpcUrls[0]
}

// Get block explorer URL
export function getExplorerUrl(chainId: number): string | undefined {
  return CHAIN_BY_ID[chainId]?.blockExplorerUrls[0]
}

// Format chain for wallet_addEthereumChain
export function formatForAddChain(chain: ChainConfig) {
  return {
    chainId: chain.chainIdHex,
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpcUrls,
    blockExplorerUrls: chain.blockExplorerUrls,
    iconUrls: chain.iconUrl ? [chain.iconUrl] : undefined,
  }
}
