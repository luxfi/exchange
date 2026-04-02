import { brand as runtimeBrand } from '@l.x/config'
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
 * Defaults to Lux Exchange brand. White-label brands are configured via
 * runtime /config.json (see @l.x/config BrandConfig).
 */
export function getBrandConfig(): BrandConfig {
  return LUX_BRAND
}

/**
 * Returns the set of chain IDs that should be visible in the UI.
 * Priority: env var override > runtime config.json > static brand config > null (show all)
 */
export function getVisibleChainIds(): UniverseChainId[] | null {
  // Check runtime brand config (loaded from /config.json by loadBrandConfig())
  if (runtimeBrand.supportedChainIds && runtimeBrand.supportedChainIds.length > 0) {
    return runtimeBrand.supportedChainIds as UniverseChainId[]
  }

  // Fall back to static brand config
  const brand = getBrandConfig()
  if (brand.chains.length > 0) {
    return brand.chains
  }

  // null = no filter, show all
  return null
}
