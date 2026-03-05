/**
 * Public token data provider using CoinGecko free API
 * Replaces the broken Uniswap REST API for non-Lux chains
 */

import { UniverseChainId } from 'lx/src/features/chains/types'

// CoinGecko platform IDs mapped to chain IDs
const COINGECKO_PLATFORMS: Record<number, string> = {
  [UniverseChainId.Mainnet]: 'ethereum',
  [UniverseChainId.ArbitrumOne]: 'arbitrum-one',
  [UniverseChainId.Base]: 'base',
  [UniverseChainId.Polygon]: 'polygon-pos',
  [UniverseChainId.Optimism]: 'optimistic-ethereum',
  [UniverseChainId.Bnb]: 'binance-smart-chain',
  [UniverseChainId.Avalanche]: 'avalanche',
  [UniverseChainId.Blast]: 'blast',
  [UniverseChainId.Celo]: 'celo',
  [UniverseChainId.Zora]: 'zora-network',
  [UniverseChainId.Zksync]: 'zksync',
  [UniverseChainId.WorldChain]: 'world-chain',
}

// Chain ID → GraphQL chain string mapping (for the explore table)
export const CHAIN_TO_GQL: Record<number, string> = {
  [UniverseChainId.Mainnet]: 'ETHEREUM',
  [UniverseChainId.ArbitrumOne]: 'ARBITRUM',
  [UniverseChainId.Base]: 'BASE',
  [UniverseChainId.Polygon]: 'POLYGON',
  [UniverseChainId.Optimism]: 'OPTIMISM',
  [UniverseChainId.Bnb]: 'BNB',
  [UniverseChainId.Avalanche]: 'AVALANCHE',
  [UniverseChainId.Blast]: 'BLAST',
  [UniverseChainId.Celo]: 'CELO',
  [UniverseChainId.Zora]: 'ZORA',
  [UniverseChainId.Zksync]: 'ZKSYNC',
  [UniverseChainId.WorldChain]: 'WORLDCHAIN',
  [UniverseChainId.Solana]: 'SOLANA',
  [UniverseChainId.Lux]: 'LUX',
  [UniverseChainId.LuxTestnet]: 'LUX_TESTNET',
  [UniverseChainId.LuxDev]: 'LUXDEV',
  [UniverseChainId.Zoo]: 'ZOO',
  [UniverseChainId.ZooTestnet]: 'ZOO_TESTNET',
}

export interface PublicToken {
  address: string
  name: string
  symbol: string
  decimals: number
  coingeckoId: string
  logoUrl: string
}

// Top tokens per chain with CoinGecko IDs for price lookups
export const CHAIN_TOKENS: Record<number, PublicToken[]> = {
  [UniverseChainId.Mainnet]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'Ether', symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether', symbol: 'USDT', decimals: 6, coingeckoId: 'tether', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8, coingeckoId: 'wrapped-bitcoin', logoUrl: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai', symbol: 'DAI', decimals: 18, coingeckoId: 'dai', logoUrl: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', name: 'Chainlink', symbol: 'LINK', decimals: 18, coingeckoId: 'chainlink', logoUrl: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', name: 'Uniswap', symbol: 'UNI', decimals: 18, coingeckoId: 'uniswap', logoUrl: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg' },
    { address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', name: 'Aave', symbol: 'AAVE', decimals: 18, coingeckoId: 'aave', logoUrl: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png' },
    { address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', name: 'Maker', symbol: 'MKR', decimals: 18, coingeckoId: 'maker', logoUrl: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png' },
    { address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', name: 'Lido DAO', symbol: 'LDO', decimals: 18, coingeckoId: 'lido-dao', logoUrl: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png' },
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, coingeckoId: 'weth', logoUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0xae78736Cd615f374D3085123A210448E74Fc6393', name: 'Rocket Pool ETH', symbol: 'rETH', decimals: 18, coingeckoId: 'rocket-pool-eth', logoUrl: 'https://assets.coingecko.com/coins/images/20764/small/reth.png' },
    { address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704', name: 'Coinbase Wrapped Staked ETH', symbol: 'cbETH', decimals: 18, coingeckoId: 'coinbase-wrapped-staked-eth', logoUrl: 'https://assets.coingecko.com/coins/images/27008/small/cbeth.png' },
    { address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', name: 'Wrapped stETH', symbol: 'wstETH', decimals: 18, coingeckoId: 'wrapped-steth', logoUrl: 'https://assets.coingecko.com/coins/images/18834/small/wstETH.png' },
    { address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', name: 'Pepe', symbol: 'PEPE', decimals: 18, coingeckoId: 'pepe', logoUrl: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
    { address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', name: 'Shiba Inu', symbol: 'SHIB', decimals: 18, coingeckoId: 'shiba-inu', logoUrl: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  ],
  [UniverseChainId.ArbitrumOne]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'Ether', symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', name: 'USD Coin', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', name: 'Tether', symbol: 'USDT', decimals: 6, coingeckoId: 'tether', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', name: 'Arbitrum', symbol: 'ARB', decimals: 18, coingeckoId: 'arbitrum', logoUrl: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg' },
    { address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8, coingeckoId: 'wrapped-bitcoin', logoUrl: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
    { address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', name: 'GMX', symbol: 'GMX', decimals: 18, coingeckoId: 'gmx', logoUrl: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png' },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', name: 'Dai', symbol: 'DAI', decimals: 18, coingeckoId: 'dai', logoUrl: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', name: 'Chainlink', symbol: 'LINK', decimals: 18, coingeckoId: 'chainlink', logoUrl: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  ],
  [UniverseChainId.Base]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'Ether', symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', name: 'Dai', symbol: 'DAI', decimals: 18, coingeckoId: 'dai', logoUrl: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { address: '0x4200000000000000000000000000000000000006', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, coingeckoId: 'weth', logoUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', name: 'Coinbase Wrapped Staked ETH', symbol: 'cbETH', decimals: 18, coingeckoId: 'coinbase-wrapped-staked-eth', logoUrl: 'https://assets.coingecko.com/coins/images/27008/small/cbeth.png' },
    { address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', name: 'Wrapped stETH', symbol: 'wstETH', decimals: 18, coingeckoId: 'wrapped-steth', logoUrl: 'https://assets.coingecko.com/coins/images/18834/small/wstETH.png' },
  ],
  [UniverseChainId.Polygon]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'POL', symbol: 'POL', decimals: 18, coingeckoId: 'matic-network', logoUrl: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png' },
    { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', name: 'USD Coin', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether', symbol: 'USDT', decimals: 6, coingeckoId: 'tether', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, coingeckoId: 'weth', logoUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8, coingeckoId: 'wrapped-bitcoin', logoUrl: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
    { address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', name: 'Chainlink', symbol: 'LINK', decimals: 18, coingeckoId: 'chainlink', logoUrl: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Dai', symbol: 'DAI', decimals: 18, coingeckoId: 'dai', logoUrl: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { address: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f', name: 'Uniswap', symbol: 'UNI', decimals: 18, coingeckoId: 'uniswap', logoUrl: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg' },
  ],
  [UniverseChainId.Optimism]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'Ether', symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', name: 'USD Coin', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', name: 'Tether', symbol: 'USDT', decimals: 6, coingeckoId: 'tether', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x4200000000000000000000000000000000000042', name: 'Optimism', symbol: 'OP', decimals: 18, coingeckoId: 'optimism', logoUrl: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
    { address: '0x4200000000000000000000000000000000000006', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, coingeckoId: 'weth', logoUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', name: 'Dai', symbol: 'DAI', decimals: 18, coingeckoId: 'dai', logoUrl: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { address: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6', name: 'Chainlink', symbol: 'LINK', decimals: 18, coingeckoId: 'chainlink', logoUrl: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  ],
  [UniverseChainId.Bnb]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'BNB', symbol: 'BNB', decimals: 18, coingeckoId: 'binancecoin', logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', name: 'USD Coin', symbol: 'USDC', decimals: 18, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0x55d398326f99059fF775485246999027B3197955', name: 'Tether', symbol: 'USDT', decimals: 18, coingeckoId: 'tether', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, coingeckoId: 'weth', logoUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', name: 'Wrapped BTC', symbol: 'BTCB', decimals: 18, coingeckoId: 'bitcoin-bep2', logoUrl: 'https://assets.coingecko.com/coins/images/14108/small/Binance-bitcoin.png' },
    { address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', name: 'PancakeSwap', symbol: 'CAKE', decimals: 18, coingeckoId: 'pancakeswap-token', logoUrl: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png' },
  ],
  [UniverseChainId.Avalanche]: [
    { address: '0x0000000000000000000000000000000000000000', name: 'Avalanche', symbol: 'AVAX', decimals: 18, coingeckoId: 'avalanche-2', logoUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
    { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', name: 'USD Coin', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', name: 'Tether', symbol: 'USDT', decimals: 6, coingeckoId: 'tether', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', name: 'Wrapped Ether', symbol: 'WETH.e', decimals: 18, coingeckoId: 'weth', logoUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x152b9d0FdC40C096DE20232Db4820c92EE4c4d0b', name: 'Wrapped BTC', symbol: 'BTC.b', decimals: 8, coingeckoId: 'wrapped-bitcoin', logoUrl: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
  ],
}

// CoinGecko price cache (30 second TTL)
let priceCache: { data: Record<string, CoinGeckoPrice>; timestamp: number } | null = null
const PRICE_CACHE_TTL = 30_000

interface CoinGeckoPrice {
  usd: number
  usd_24h_change?: number
  usd_24h_vol?: number
  usd_market_cap?: number
}

/**
 * Fetch prices from CoinGecko free API for all known tokens
 */
export async function fetchCoinGeckoPrices(): Promise<Record<string, CoinGeckoPrice>> {
  // Return cache if fresh
  if (priceCache && Date.now() - priceCache.timestamp < PRICE_CACHE_TTL) {
    return priceCache.data
  }

  // Collect unique CoinGecko IDs from all chains
  const allIds = new Set<string>()
  for (const tokens of Object.values(CHAIN_TOKENS)) {
    for (const token of tokens) {
      allIds.add(token.coingeckoId)
    }
  }

  try {
    const ids = Array.from(allIds).join(',')
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    priceCache = { data, timestamp: Date.now() }
    return data
  } catch (error) {
    console.warn('CoinGecko price fetch failed:', error)
    // Return cache even if stale, or empty
    return priceCache?.data ?? {}
  }
}

/**
 * Get tokens for a chain with live prices from CoinGecko
 */
export async function getPublicTokensForChain(chainId: number): Promise<PublicToken[]> {
  return CHAIN_TOKENS[chainId] ?? []
}

/**
 * Check if we have public token data for a chain
 */
export function hasPublicTokenData(chainId: number): boolean {
  return chainId in CHAIN_TOKENS
}

/**
 * Get "All Networks" tokens — top tokens across all supported chains (deduplicated by coingeckoId)
 */
export function getAllNetworkTokens(): PublicToken[] {
  const seen = new Set<string>()
  const tokens: PublicToken[] = []

  // Prioritize Ethereum mainnet tokens first
  const chainOrder = [
    UniverseChainId.Mainnet,
    UniverseChainId.ArbitrumOne,
    UniverseChainId.Base,
    UniverseChainId.Optimism,
    UniverseChainId.Polygon,
    UniverseChainId.Bnb,
    UniverseChainId.Avalanche,
  ]

  for (const cid of chainOrder) {
    const chainTokens = CHAIN_TOKENS[cid] ?? []
    for (const token of chainTokens) {
      if (!seen.has(token.coingeckoId)) {
        seen.add(token.coingeckoId)
        // Use Ethereum mainnet addresses for deduped "all networks" view
        tokens.push(token)
      }
    }
  }

  return tokens
}
