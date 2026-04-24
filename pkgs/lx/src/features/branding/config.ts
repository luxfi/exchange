import { brand as runtimeBrand } from '@l.x/config'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

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

const DEFAULT_BRAND: BrandConfig = {
  name: '▼ Exchange',
  title: '▼ Exchange',
  description: 'Decentralized exchange',
  url: '',
  coinName: '',
  networkName: '▼ Network',
  primaryColor: '#FFFFFF',
  chains: [],
}

/**
 * Returns the default brand configuration.
 * White-label brands override via runtime /config.json (see @l.x/config BrandConfig).
 */
export function getBrandConfig(): BrandConfig {
  return DEFAULT_BRAND
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
