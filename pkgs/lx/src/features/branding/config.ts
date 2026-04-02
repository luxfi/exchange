import { UniverseChainId } from 'lx/src/features/chains/types'

export interface BrandConfig {
  name: string
  title: string
  description: string
  url: string
  coinName: string
  networkName: string
  primaryColor: string
  /** Chain IDs to show in the UI. Empty array = show all chains (no filter). */
  chains: UniverseChainId[]
}

const LIQUIDITY_BRAND: BrandConfig = {
  name: 'Liquid DEX',
  title: 'Liquid DEX',
  description: 'Regulated digital asset exchange',
  url: 'https://lux.exchange',
  coinName: 'LUX',
  networkName: 'Liquidity Network',
  primaryColor: '#3B82F6',
  chains: [UniverseChainId.LiquidityMainnet, UniverseChainId.LiquidityTestnet, UniverseChainId.LiquidityDevnet],
}

const LUX_BRAND: BrandConfig = {
  name: 'Lux Exchange',
  title: 'Lux Exchange',
  description: 'Decentralized exchange on Lux Network',
  url: 'https://dex.lux.network',
  coinName: 'LUX',
  networkName: 'Lux Network',
  primaryColor: '#E84142',
  chains: [], // empty = show all
}

/**
 * Returns the brand configuration based on the NEXT_PUBLIC_BRAND_NAME env var.
 * When set to 'Liquid DEX' or 'Liquidity', returns the Liquidity brand config
 * which restricts the visible chains to only Liquidity Mainnet/Testnet/Devnet.
 */
export function getBrandConfig(): BrandConfig {
  const brand = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BRAND_NAME : undefined
  if (brand === 'Liquid DEX' || brand === 'Liquidity') {
    return LIQUIDITY_BRAND
  }
  return LUX_BRAND
}

/**
 * Returns the set of chain IDs that should be visible in the UI.
 * If the brand config has a non-empty chains array, only those chains are shown.
 * If the NEXT_PUBLIC_CHAIN_FILTER env var is set to 'liquidity', only Liquidity chains are shown.
 * Otherwise, all chains are visible.
 */
export function getVisibleChainIds(): UniverseChainId[] | null {
  // Check env var override first
  const chainFilter = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAIN_FILTER : undefined
  if (chainFilter === 'liquidity') {
    return LIQUIDITY_BRAND.chains
  }

  // Fall back to brand config
  const brand = getBrandConfig()
  if (brand.chains.length > 0) {
    return brand.chains
  }

  // null = no filter, show all
  return null
}
