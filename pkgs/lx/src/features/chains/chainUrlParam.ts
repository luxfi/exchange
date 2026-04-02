import { UniverseChainId } from 'lx/src/features/chains/types'

/**
 * Canonical chain-ID → URL-param mapping.
 *
 * Typed as `Record<UniverseChainId, string>` so the build breaks whenever a new
 * chain is added to the enum without a corresponding URL param.
 *
 * This file intentionally has no transitive dependencies beyond the enum so it
 * can be safely imported from lightweight runtimes (e.g. Cloudflare Workers).
 */
export const CHAIN_ID_TO_URL_PARAM: Record<UniverseChainId, string> = {
  [UniverseChainId.Mainnet]: 'ethereum',
  [UniverseChainId.ArbitrumOne]: 'arbitrum',
  [UniverseChainId.Avalanche]: 'avalanche',
  [UniverseChainId.Base]: 'base',
  [UniverseChainId.Blast]: 'blast',
  [UniverseChainId.Bnb]: 'bnb',
  [UniverseChainId.Celo]: 'celo',
  [UniverseChainId.Monad]: 'monad',
  [UniverseChainId.Optimism]: 'optimism',
  [UniverseChainId.Polygon]: 'polygon',
  [UniverseChainId.Sepolia]: 'ethereum_sepolia',
  [UniverseChainId.Solana]: 'solana',
  [UniverseChainId.Soneium]: 'soneium',
  [UniverseChainId.Tempo]: 'tempo',
  [UniverseChainId.UnichainSepolia]: 'unichain_sepolia',
  [UniverseChainId.Unichain]: 'unichain',
  [UniverseChainId.WorldChain]: 'worldchain',
  [UniverseChainId.XLayer]: 'xlayer',
  [UniverseChainId.Zksync]: 'zksync',
  [UniverseChainId.Zora]: 'zora',
  // Lux ecosystem chains
  [UniverseChainId.Lux]: 'lux',
  [UniverseChainId.LuxTestnet]: 'lux_testnet',
  [UniverseChainId.LuxDev]: 'lux_dev',
  [UniverseChainId.Zoo]: 'zoo',
  [UniverseChainId.ZooTestnet]: 'zoo_testnet',
  [UniverseChainId.Hanzo]: 'hanzo',
  [UniverseChainId.SPC]: 'spc',
  [UniverseChainId.Pars]: 'pars',
  // Liquidity chain
  [UniverseChainId.LiquidityMainnet]: 'liquidity',
  [UniverseChainId.LiquidityTestnet]: 'liquidity_testnet',
  [UniverseChainId.LiquidityDevnet]: 'liquidity_devnet',
}

/** Reverse mapping: URL-param → chain ID (built once, O(1) lookup). */
export const URL_PARAM_TO_CHAIN_ID: Record<string, UniverseChainId> = Object.fromEntries(
  Object.entries(CHAIN_ID_TO_URL_PARAM).map(([id, param]) => [param, Number(id) as UniverseChainId]),
) as Record<string, UniverseChainId>
