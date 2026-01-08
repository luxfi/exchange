/**
 * Lux Exchange - Token Definitions
 *
 * Comprehensive token list with chain mapping.
 * Tokens are organized by chain with Lux/Zoo tokens as primary.
 */

import type { Address } from "./contracts"
import {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  ethereum,
  sepolia,
  isLuxChain,
  isZooChain,
} from "./chains"

// =============================================================================
// TYPES
// =============================================================================

export interface Token {
  symbol: string
  name: string
  decimals: number
  address: Address | null // null = native token
  logoUri: string
  chainId: number
  isNative?: boolean
  isWrappedNative?: boolean
  balance?: string
}

export interface TokenList {
  name: string
  tokens: Token[]
}

// =============================================================================
// NATIVE TOKEN ADDRESS (represents native currency)
// =============================================================================

export const NATIVE_TOKEN_ADDRESS = null

// =============================================================================
// LUX MAINNET TOKENS (Chain ID: 96369)
// Real contract addresses from the Lux ecosystem
// =============================================================================

export const LUX_MAINNET_TOKENS: Token[] = [
  // Native token
  {
    symbol: "LUX",
    name: "Lux",
    decimals: 18,
    address: null,
    logoUri: "/tokens/lux.svg",
    chainId: luxMainnet.id,
    isNative: true,
  },
  // Wrapped native
  {
    symbol: "WLUX",
    name: "Wrapped LUX",
    decimals: 18,
    address: "0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lux.png",
    chainId: luxMainnet.id,
    isWrappedNative: true,
  },
  // Liquid/Bridge tokens
  {
    symbol: "LETH",
    name: "Liquid ETH",
    decimals: 18,
    address: "0x60E0a8167FC13dE89348978860466C9ceC24B9ba",
    logoUri: "https://cdn.lux.network/exchange/icon-png/leth.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LUSD",
    name: "Liquid USD",
    decimals: 18,
    address: "0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lusd.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LBTC",
    name: "Liquid BTC",
    decimals: 18,
    address: "0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lbtc.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LSOL",
    name: "Liquid SOL",
    decimals: 18,
    address: "0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lsol.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LTON",
    name: "Liquid TON",
    decimals: 18,
    address: "0x3141b94b89691009b950c96e97Bff48e0C543E3C",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lton.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LBNB",
    name: "Liquid BNB",
    decimals: 18,
    address: "0x6EdcF3645DeF09DB45050638c41157D8B9FEa1cf",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lbnb.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LPOL",
    name: "Liquid POL",
    decimals: 18,
    address: "0x28BfC5DD4B7E15659e41190983e5fE3df1132bB9",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lpol.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LCELO",
    name: "Liquid CELO",
    decimals: 18,
    address: "0x3078847F879A33994cDa2Ec1540ca52b5E0eE2e5",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lcelo.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LFTM",
    name: "Liquid FTM",
    decimals: 18,
    address: "0x8B982132d639527E8a0eAAD385f97719af8f5e04",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lftm.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LXDAI",
    name: "Liquid XDAI",
    decimals: 18,
    address: "0x7dfb3cBf7CF9c96fd56e3601FBA50AF45C731211",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lxdai.png",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LBLAST",
    name: "Liquid BLAST",
    decimals: 18,
    address: "0x94f49D0F4C62bbE4238F4AaA9200287bea9F2976",
    logoUri: "https://cdn.lux.network/bridge/currencies/lux/lblast.svg",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LZOO",
    name: "Liquid ZOO",
    decimals: 18,
    address: "0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lzoo.png",
    chainId: luxMainnet.id,
  },
  // Custom ecosystem tokens
  {
    symbol: "Z",
    name: "Z",
    decimals: 6,
    address: "0xA69E6612B525474CB893500b70FD7Ec374CbF9a3",
    logoUri: "https://cdn.lux.network/bridge/currencies/zeekay.jpeg",
    chainId: luxMainnet.id,
  },
  {
    symbol: "CYRUS",
    name: "Cyrus AI",
    decimals: 6,
    address: "0x0A78f7Ce8D65e0FD4D6B78848483bA3C4fb895c5",
    logoUri: "https://cdn.lux.network/bridge/currencies/cyrus.jpeg",
    chainId: luxMainnet.id,
  },
  {
    symbol: "TRUMP",
    name: "Official Trump",
    decimals: 6,
    address: "0x768972Ee4038a23b20B3beD3848027460172D897",
    logoUri: "https://cdn.lux.network/bridge/currencies/trump.webp",
    chainId: luxMainnet.id,
  },
  {
    symbol: "MELANIA",
    name: "Melania Meme",
    decimals: 6,
    address: "0x14F48A55722ecBa725aA83a294a8d3E8bE47DE46",
    logoUri: "https://cdn.lux.network/bridge/currencies/melania.jfif",
    chainId: luxMainnet.id,
  },
]

// =============================================================================
// LUX TESTNET TOKENS (Chain ID: 96368)
// =============================================================================

export const LUX_TESTNET_TOKENS: Token[] = [
  {
    symbol: "LUX",
    name: "Lux",
    decimals: 18,
    address: null,
    logoUri: "https://cdn.lux.network/exchange/icon-png/lux.png",
    chainId: luxTestnet.id,
    isNative: true,
  },
  {
    symbol: "WLUX",
    name: "Wrapped LUX",
    decimals: 18,
    address: "0x732740c5c895C9FCF619930ed4293fc858eb44c7",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lux.png",
    chainId: luxTestnet.id,
    isWrappedNative: true,
  },
  {
    symbol: "LETH",
    name: "Lux Ether",
    decimals: 18,
    address: "0xd9956542B51032d940ef076d70B69410667277A3",
    logoUri: "https://cdn.lux.network/exchange/icon-png/leth.png",
    chainId: luxTestnet.id,
  },
  {
    symbol: "LUSD",
    name: "Liquid USD",
    decimals: 18,
    address: "0xb84112ac9318a0b2319aa11d4d10e9762b25f7f4",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lusd.png",
    chainId: luxTestnet.id,
  },
  {
    symbol: "LBTC",
    name: "Lux Bitcoin",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000003",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lbtc.png",
    chainId: luxTestnet.id,
  },
]

// =============================================================================
// ZOO MAINNET TOKENS (Chain ID: 200200)
// Real contract addresses from the Zoo ecosystem
// =============================================================================

export const ZOO_MAINNET_TOKENS: Token[] = [
  // Native token
  {
    symbol: "ZOO",
    name: "Zoo",
    decimals: 18,
    address: null,
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo.svg",
    chainId: zooMainnet.id,
    isNative: true,
  },
  // Wrapped native
  {
    symbol: "WZOO",
    name: "Wrapped ZOO",
    decimals: 18,
    address: "0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo.svg",
    chainId: zooMainnet.id,
    isWrappedNative: true,
  },
  // Zoo bridge tokens
  {
    symbol: "ZUSD",
    name: "Zoo Dollar",
    decimals: 18,
    address: "0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zusd.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZETH",
    name: "Zoo ETH",
    decimals: 18,
    address: "0x60E0a8167FC13dE89348978860466C9ceC24B9ba",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zeth.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZBTC",
    name: "Zoo BTC",
    decimals: 18,
    address: "0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zbtc.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZLUX",
    name: "Zoo LUX",
    decimals: 18,
    address: "0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lux.png",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZSOL",
    name: "Zoo SOL",
    decimals: 18,
    address: "0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zsol.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZTON",
    name: "Zoo TON",
    decimals: 18,
    address: "0x3141b94b89691009b950c96e97Bff48e0C543E3C",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zton.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZBNB",
    name: "Zoo BNB",
    decimals: 18,
    address: "0x6EdcF3645DeF09DB45050638c41157D8B9FEa1cf",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zbnb.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZPOL",
    name: "Zoo POL",
    decimals: 18,
    address: "0x28BfC5DD4B7E15659e41190983e5fE3df1132bB9",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zpol.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZCELO",
    name: "Zoo CELO",
    decimals: 18,
    address: "0x3078847F879A33994cDa2Ec1540ca52b5E0eE2e5",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zcelo.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZFTM",
    name: "Zoo FTM",
    decimals: 18,
    address: "0x8B982132d639527E8a0eAAD385f97719af8f5e04",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zftm.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZXDAI",
    name: "Zoo xDAI",
    decimals: 18,
    address: "0x7dfb3cBf7CF9c96fd56e3601FBA50AF45C731211",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zdai.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZADA",
    name: "Zoo ADA",
    decimals: 18,
    address: "0x8b34152832b8ab4a3274915675754AA61eC113F0",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zada.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZBLAST",
    name: "Zoo BLAST",
    decimals: 18,
    address: "0x7a56c769C50F2e73CFB70b401409Ad1F1a5000cd",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zblast.svg",
    chainId: zooMainnet.id,
  },
  // Meme tokens on Zoo
  {
    symbol: "ZBONK",
    name: "Zoo BONK",
    decimals: 18,
    address: "0x8a873ad8CfF8ba640D71274d33a85AB1B2d53b62",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zbonk.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZWIF",
    name: "Zoo WIF",
    decimals: 18,
    address: "0x4586D49f3a32c3BeCA2e09802e0aB1Da705B011D",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zwif.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZPOPCAT",
    name: "Zoo Popcat",
    decimals: 18,
    address: "0x68Cd9b8Df6E86dA02ef030c2F1e5a3Ad6B6d747F",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zpopcat.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZPNUT",
    name: "Zoo PNUT",
    decimals: 18,
    address: "0x0e4bD0DD67c15dECfBBBdbbE07FC9d51D737693D",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zpnut.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZMEW",
    name: "Zoo MEW",
    decimals: 18,
    address: "0x94f49D0F4C62bbE4238F4AaA9200287bea9F2976",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zmew.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZBOME",
    name: "Zoo BOME",
    decimals: 18,
    address: "0xEf770a556430259d1244F2A1384bd1A672cE9e7F",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zbome.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZGIGA",
    name: "Zoo GIGA",
    decimals: 18,
    address: "0xBBd222BD7dADd241366e6c2CbD5979F678598A85",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zgiga.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZAI16Z",
    name: "Zoo AI16Z",
    decimals: 18,
    address: "0x273196F2018D61E31510D1Aa1e6644955880D122",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zai16z.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZFWOG",
    name: "Zoo FWOG",
    decimals: 18,
    address: "0xd8ab3C445d81D78E7DC2d60FeC24f8C7328feF2f",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zfwog.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZMOODENG",
    name: "Zoo MOODENG",
    decimals: 18,
    address: "0xe6cd610aD16C8Fe5BCeDFff7dAB2e3d461089261",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zmoodeng.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZPONKE",
    name: "Zoo PONKE",
    decimals: 18,
    address: "0xDF7740fCC9B244c192CfFF7b6553a3eEee0f4898",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zponke.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZNOT",
    name: "Zoo NOT",
    decimals: 18,
    address: "0xdfCAdda48DbbA09f5678aE31734193F7CCA7f20d",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/znot.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZDOGS",
    name: "Zoo DOGS",
    decimals: 18,
    address: "0x0b0FF795d0A1C162b44CdC35D8f4DCbC2b4B9170",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zdogs.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZMRB",
    name: "Zoo MRB",
    decimals: 18,
    address: "0x3FfA9267739C04554C1fe640F79651333A2040e1",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zmrb.svg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "ZREDO",
    name: "Zoo REDO",
    decimals: 18,
    address: "0x137747A15dE042Cd01fCB41a5F3C7391d932750B",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zredo.svg",
    chainId: zooMainnet.id,
  },
  // Custom ecosystem tokens on Zoo
  {
    symbol: "SLOG",
    name: "Slog",
    decimals: 6,
    address: "0xED15C23B27a69b5bd50B1eeF5B8f1C8D849462b7",
    logoUri: "https://cdn.lux.network/bridge/currencies/slog.png",
    chainId: zooMainnet.id,
  },
  {
    symbol: "Z",
    name: "Z",
    decimals: 6,
    address: "0xA69E6612B525474CB893500b70FD7Ec374CbF9a3",
    logoUri: "https://cdn.lux.network/bridge/currencies/zeekay.jpeg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "CYRUS",
    name: "Cyrus AI",
    decimals: 6,
    address: "0x0A78f7Ce8D65e0FD4D6B78848483bA3C4fb895c5",
    logoUri: "https://cdn.lux.network/bridge/currencies/cyrus.jpeg",
    chainId: zooMainnet.id,
  },
  {
    symbol: "TRUMP",
    name: "Official Trump",
    decimals: 6,
    address: "0x768972Ee4038a23b20B3beD3848027460172D897",
    logoUri: "https://cdn.lux.network/bridge/currencies/trump.webp",
    chainId: zooMainnet.id,
  },
  {
    symbol: "MELANIA",
    name: "Melania Meme",
    decimals: 6,
    address: "0x14F48A55722ecBa725aA83a294a8d3E8bE47DE46",
    logoUri: "https://cdn.lux.network/bridge/currencies/melania.jfif",
    chainId: zooMainnet.id,
  },
]

// =============================================================================
// ZOO TESTNET TOKENS (Chain ID: 200201)
// =============================================================================

export const ZOO_TESTNET_TOKENS: Token[] = [
  {
    symbol: "ZOO",
    name: "Zoo",
    decimals: 18,
    address: null,
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo.svg",
    chainId: zooTestnet.id,
    isNative: true,
  },
  {
    symbol: "WZOO",
    name: "Wrapped ZOO",
    decimals: 18,
    address: "0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo.svg",
    chainId: zooTestnet.id,
    isWrappedNative: true,
  },
  {
    symbol: "ZUSD",
    name: "Zoo Dollar",
    decimals: 18,
    address: "0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2",
    logoUri: "https://cdn.lux.network/bridge/currencies/zoo/zusd.svg",
    chainId: zooTestnet.id,
  },
  {
    symbol: "ZLUX",
    name: "Zoo LUX",
    decimals: 18,
    address: "0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88",
    logoUri: "https://cdn.lux.network/exchange/icon-png/lux.png",
    chainId: zooTestnet.id,
  },
]

// =============================================================================
// ETHEREUM MAINNET TOKENS (Chain ID: 1)
// =============================================================================

export const ETHEREUM_MAINNET_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
    address: null,
    logoUri: "/tokens/eth.svg",
    chainId: ethereum.id,
    isNative: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logoUri: "/tokens/weth.svg",
    chainId: ethereum.id,
    isWrappedNative: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    logoUri: "/tokens/usdc.svg",
    chainId: ethereum.id,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    logoUri: "/tokens/usdt.svg",
    chainId: ethereum.id,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    address: "0x6B175474E89094C44Da98b954EescdeCB5BE3830",
    logoUri: "/tokens/dai.svg",
    chainId: ethereum.id,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    logoUri: "/tokens/wbtc.svg",
    chainId: ethereum.id,
  },
]

// =============================================================================
// SEPOLIA TESTNET TOKENS (Chain ID: 11155111)
// =============================================================================

export const SEPOLIA_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Sepolia Ether",
    decimals: 18,
    address: null,
    logoUri: "/tokens/eth.svg",
    chainId: sepolia.id,
    isNative: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    logoUri: "/tokens/weth.svg",
    chainId: sepolia.id,
    isWrappedNative: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    logoUri: "/tokens/usdc.svg",
    chainId: sepolia.id,
  },
]

// =============================================================================
// TOKEN LISTS BY CHAIN
// =============================================================================

export const TOKENS_BY_CHAIN: Record<number, Token[]> = {
  [luxMainnet.id]: LUX_MAINNET_TOKENS,
  [luxTestnet.id]: LUX_TESTNET_TOKENS,
  [zooMainnet.id]: ZOO_MAINNET_TOKENS,
  [zooTestnet.id]: ZOO_TESTNET_TOKENS,
  [ethereum.id]: ETHEREUM_MAINNET_TOKENS,
  [sepolia.id]: SEPOLIA_TOKENS,
}

// =============================================================================
// ALL TOKENS (for backward compatibility)
// =============================================================================

export const DEFAULT_TOKENS: Token[] = LUX_MAINNET_TOKENS

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get tokens for a specific chain
 */
export function getTokensForChain(chainId: number): Token[] {
  return TOKENS_BY_CHAIN[chainId] || []
}

/**
 * Get native token for a chain
 */
export function getNativeToken(chainId: number): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find((t) => t.isNative)
}

/**
 * Get wrapped native token for a chain
 */
export function getWrappedNativeToken(chainId: number): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find((t) => t.isWrappedNative)
}

/**
 * Get token by symbol on a specific chain
 */
export function getTokenBySymbol(
  chainId: number,
  symbol: string
): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase())
}

/**
 * Get token by address on a specific chain
 */
export function getTokenByAddress(
  chainId: number,
  address: string
): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find(
    (t) => t.address?.toLowerCase() === address.toLowerCase()
  )
}

/**
 * Get default input token for a chain (native token)
 */
export function getDefaultInputToken(chainId: number): Token | undefined {
  return getNativeToken(chainId)
}

/**
 * Get default output token for a chain
 * - Lux chains: LUSD
 * - Zoo chains: WZOO
 * - Ethereum: USDC
 */
export function getDefaultOutputToken(chainId: number): Token | undefined {
  if (isLuxChain(chainId)) {
    return getTokenBySymbol(chainId, "LUSD")
  }
  if (isZooChain(chainId)) {
    return getTokenBySymbol(chainId, "WZOO")
  }
  // Ethereum/Sepolia
  return getTokenBySymbol(chainId, "USDC")
}

/**
 * Get default token pair for a chain
 */
export function getDefaultTokenPair(
  chainId: number
): { input: Token; output: Token } | undefined {
  const input = getDefaultInputToken(chainId)
  const output = getDefaultOutputToken(chainId)

  if (!input || !output) return undefined

  return { input, output }
}

/**
 * Search tokens by query (symbol or name)
 */
export function searchTokens(chainId: number, query: string): Token[] {
  const tokens = getTokensForChain(chainId)
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return tokens

  return tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(lowerQuery) ||
      t.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Format token amount with proper decimals
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  displayDecimals = 4
): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const remainder = amount % divisor

  const fractionalStr = remainder.toString().padStart(decimals, "0")
  const truncatedFractional = fractionalStr.slice(0, displayDecimals)

  if (parseInt(truncatedFractional) === 0) {
    return integerPart.toString()
  }

  return `${integerPart}.${truncatedFractional.replace(/0+$/, "")}`
}

/**
 * Parse token amount string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  if (!amount || amount === "") return BigInt(0)

  const [integerPart, fractionalPart = ""] = amount.split(".")
  const paddedFractional = fractionalPart.padEnd(decimals, "0").slice(0, decimals)

  return BigInt(integerPart + paddedFractional)
}

/**
 * Check if two tokens are the same
 */
export function isSameToken(tokenA: Token, tokenB: Token): boolean {
  if (tokenA.chainId !== tokenB.chainId) return false
  if (tokenA.isNative && tokenB.isNative) return true
  if (tokenA.address === null || tokenB.address === null) return false
  return tokenA.address.toLowerCase() === tokenB.address.toLowerCase()
}

/**
 * Get display address for a token (shortened)
 */
export function getDisplayAddress(token: Token): string {
  if (token.isNative || !token.address) return "Native"
  return `${token.address.slice(0, 6)}...${token.address.slice(-4)}`
}
