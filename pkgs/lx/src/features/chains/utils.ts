import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxfi/api'
import { brand as runtimeBrand } from '@l.x/config'
import { PollingInterval } from '@l.x/lx/src/constants/misc'
import { getVisibleChainIds } from '@l.x/lx/src/features/branding/config'
import { ALL_CHAIN_IDS, getChainInfo, ORDERED_CHAINS } from '@l.x/lx/src/features/chains/chainInfo'
import { EnabledChainsInfo, GqlChainId, NetworkLayer, UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'

// Some code from the web app uses chainId types as numbers
// This validates them as coerces into SupportedChainId
export function toSupportedChainId(chainId?: BigNumberish): UniverseChainId | null {
  if (!chainId || !ALL_CHAIN_IDS.map((c) => c.toString()).includes(chainId.toString())) {
    return null
  }
  return parseInt(chainId.toString(), 10) as UniverseChainId
}

export function getChainLabel(chainId: UniverseChainId): string {
  return getChainInfo(chainId).label
}

/**
 * Return the explorer name for the given chain ID
 * @param chainId the ID of the chain for which to return the explorer name
 */
export function getChainExplorerName(chainId: UniverseChainId): string {
  return getChainInfo(chainId).explorer.name
}

export function isTestnetChain(chainId: UniverseChainId): boolean {
  return Boolean(getChainInfo(chainId).testnet)
}

export function isBackendSupportedChainId(chainId: UniverseChainId): boolean {
  const info = getChainInfo(chainId)
  return info.backendChain.backendSupported
}

export function isBackendSupportedChain(chain: GraphQLApi.Chain): chain is GqlChainId {
  const chainId = fromGraphQLChain(chain)
  if (!chainId) {
    return false
  }

  return isBackendSupportedChainId(chainId)
}

export function chainIdToHexadecimalString(chainId: UniverseChainId): string {
  return BigNumber.from(chainId).toHexString()
}

export function hexadecimalStringToInt(hex: string): number {
  return parseInt(hex, 16)
}

export function isL2ChainId(chainId?: UniverseChainId): boolean {
  return chainId !== undefined && getChainInfo(chainId).networkLayer === NetworkLayer.L2
}

export function isMainnetChainId(chainId?: UniverseChainId): boolean {
  return chainId === UniverseChainId.Mainnet || chainId === UniverseChainId.Sepolia
}

export function toGraphQLChain(chainId: UniverseChainId): GqlChainId {
  return getChainInfo(chainId).backendChain.chain
}

// eslint-disable-next-line complexity
export function fromGraphQLChain(chain: GraphQLApi.Chain | string | undefined): UniverseChainId | null {
  switch (chain) {
    case GraphQLApi.Chain.Ethereum:
      return UniverseChainId.Mainnet
    case GraphQLApi.Chain.Arbitrum:
      return UniverseChainId.ArbitrumOne
    case GraphQLApi.Chain.Avalanche:
      return UniverseChainId.Avalanche
    case GraphQLApi.Chain.Base:
      return UniverseChainId.Base
    case GraphQLApi.Chain.Bnb:
      return UniverseChainId.Bnb
    case GraphQLApi.Chain.Blast:
      return UniverseChainId.Blast
    case GraphQLApi.Chain.Celo:
      return UniverseChainId.Celo
    case GraphQLApi.Chain.Monad:
      return UniverseChainId.Monad
    case GraphQLApi.Chain.Optimism:
      return UniverseChainId.Optimism
    case GraphQLApi.Chain.Polygon:
      return UniverseChainId.Polygon
    case GraphQLApi.Chain.EthereumSepolia:
      return UniverseChainId.Sepolia
    case GraphQLApi.Chain.Unichain:
      return UniverseChainId.Unichain
    case GraphQLApi.Chain.Solana:
      return UniverseChainId.Solana
    case GraphQLApi.Chain.Soneium:
      return UniverseChainId.Soneium
    case GraphQLApi.Chain.Xlayer:
      return UniverseChainId.XLayer
    case GraphQLApi.Chain.AstrochainSepolia:
      return UniverseChainId.UnichainSepolia
    case GraphQLApi.Chain.Worldchain:
      return UniverseChainId.WorldChain
    case GraphQLApi.Chain.Zksync:
      return UniverseChainId.Zksync
    case GraphQLApi.Chain.Zora:
      return UniverseChainId.Zora
    case GraphQLApi.Chain.Tempo:
      return UniverseChainId.Tempo
    case GraphQLApi.Chain.Lux:
      return UniverseChainId.Lux
    case GraphQLApi.Chain.LuxTestnet:
      return UniverseChainId.LuxTestnet
    case GraphQLApi.Chain.LuxDev:
      return UniverseChainId.LuxDev
    case GraphQLApi.Chain.Zoo:
      return UniverseChainId.Zoo
    case GraphQLApi.Chain.ZooTestnet:
      return UniverseChainId.ZooTestnet
    case GraphQLApi.Chain.ZooDevnet:
      return UniverseChainId.ZooDev
    case GraphQLApi.Chain.Hanzo:
      return UniverseChainId.Hanzo
    case GraphQLApi.Chain.HanzoTestnet:
      return UniverseChainId.HanzoTestnet
    case GraphQLApi.Chain.Spc:
      return UniverseChainId.SPC
    case GraphQLApi.Chain.Pars:
      return UniverseChainId.Pars
    case GraphQLApi.Chain.Liquidity:
      return UniverseChainId.Liquidity
    case GraphQLApi.Chain.LiquidityTestnet:
      return UniverseChainId.LiquidityTestnet
    case GraphQLApi.Chain.LiquidityDevnet:
      return UniverseChainId.LiquidityDev
  }

  return null
}

export function getPollingIntervalByBlocktime(chainId?: UniverseChainId): PollingInterval {
  return isMainnetChainId(chainId) ? PollingInterval.Fast : PollingInterval.LightningMcQueen
}

// eslint-disable-next-line complexity
export function fromLxWebAppLink(network: string | null): UniverseChainId {
  switch (network) {
    case GraphQLApi.Chain.Ethereum.toLowerCase():
      return UniverseChainId.Mainnet
    case GraphQLApi.Chain.Arbitrum.toLowerCase():
      return UniverseChainId.ArbitrumOne
    case GraphQLApi.Chain.Avalanche.toLowerCase():
      return UniverseChainId.Avalanche
    case GraphQLApi.Chain.Base.toLowerCase():
      return UniverseChainId.Base
    case GraphQLApi.Chain.Blast.toLowerCase():
      return UniverseChainId.Blast
    case GraphQLApi.Chain.Bnb.toLowerCase():
      return UniverseChainId.Bnb
    case GraphQLApi.Chain.Celo.toLowerCase():
      return UniverseChainId.Celo
    case GraphQLApi.Chain.Monad.toLowerCase():
      return UniverseChainId.Monad
    case GraphQLApi.Chain.Optimism.toLowerCase():
      return UniverseChainId.Optimism
    case GraphQLApi.Chain.Polygon.toLowerCase():
      return UniverseChainId.Polygon
    case GraphQLApi.Chain.EthereumSepolia.toLowerCase():
      return UniverseChainId.Sepolia
    case GraphQLApi.Chain.Unichain.toLowerCase():
      return UniverseChainId.Unichain
    case GraphQLApi.Chain.Soneium.toLowerCase():
      return UniverseChainId.Soneium
    case GraphQLApi.Chain.Xlayer.toLowerCase():
      return UniverseChainId.XLayer
    case GraphQLApi.Chain.AstrochainSepolia.toLowerCase():
    case 'unichain_sepolia':
      return UniverseChainId.UnichainSepolia
    case GraphQLApi.Chain.Worldchain.toLowerCase():
      return UniverseChainId.WorldChain
    case GraphQLApi.Chain.Zksync.toLowerCase():
      return UniverseChainId.Zksync
    case GraphQLApi.Chain.Zora.toLowerCase():
      return UniverseChainId.Zora
    case GraphQLApi.Chain.Tempo.toLowerCase():
      return UniverseChainId.Tempo
    case GraphQLApi.Chain.Lux.toLowerCase():
      return UniverseChainId.Lux
    case GraphQLApi.Chain.LuxTestnet.toLowerCase():
    case 'lux_testnet':
      return UniverseChainId.LuxTestnet
    case GraphQLApi.Chain.LuxDev.toLowerCase():
    case 'lux_dev':
      return UniverseChainId.LuxDev
    case GraphQLApi.Chain.Zoo.toLowerCase():
      return UniverseChainId.Zoo
    case GraphQLApi.Chain.ZooTestnet.toLowerCase():
    case 'zoo_testnet':
      return UniverseChainId.ZooTestnet
    case GraphQLApi.Chain.ZooDevnet.toLowerCase():
    case 'zoo_dev':
      return UniverseChainId.ZooDev
    case GraphQLApi.Chain.Hanzo.toLowerCase():
      return UniverseChainId.Hanzo
    case GraphQLApi.Chain.HanzoTestnet.toLowerCase():
    case 'hanzo_testnet':
      return UniverseChainId.HanzoTestnet
    case GraphQLApi.Chain.Spc.toLowerCase():
      return UniverseChainId.SPC
    case GraphQLApi.Chain.Pars.toLowerCase():
      return UniverseChainId.Pars
    case GraphQLApi.Chain.Liquidity.toLowerCase():
      return UniverseChainId.Liquidity
    case GraphQLApi.Chain.LiquidityTestnet.toLowerCase():
    case 'liquidity_testnet':
      return UniverseChainId.LiquidityTestnet
    case GraphQLApi.Chain.LiquidityDevnet.toLowerCase():
    case 'liquidity_dev':
      return UniverseChainId.LiquidityDev
    default:
      throw new Error(`Network "${network}" can not be mapped`)
  }
}

export function toLuxWebAppLink(chainId: UniverseChainId): string | null {
  switch (chainId) {
    case UniverseChainId.Mainnet:
      return GraphQLApi.Chain.Ethereum.toLowerCase()
    case UniverseChainId.ArbitrumOne:
      return GraphQLApi.Chain.Arbitrum.toLowerCase()
    case UniverseChainId.Avalanche:
      return GraphQLApi.Chain.Avalanche.toLowerCase()
    case UniverseChainId.Base:
      return GraphQLApi.Chain.Base.toLowerCase()
    case UniverseChainId.Blast:
      return GraphQLApi.Chain.Blast.toLowerCase()
    case UniverseChainId.Bnb:
      return GraphQLApi.Chain.Bnb.toLowerCase()
    case UniverseChainId.Celo:
      return GraphQLApi.Chain.Celo.toLowerCase()
    case UniverseChainId.Monad:
      return GraphQLApi.Chain.Monad.toLowerCase()
    case UniverseChainId.Optimism:
      return GraphQLApi.Chain.Optimism.toLowerCase()
    case UniverseChainId.Polygon:
      return GraphQLApi.Chain.Polygon.toLowerCase()
    case UniverseChainId.Sepolia:
      return GraphQLApi.Chain.EthereumSepolia.toLowerCase()
    case UniverseChainId.Unichain:
      return GraphQLApi.Chain.Unichain.toLowerCase()
    case UniverseChainId.Soneium:
      return GraphQLApi.Chain.Soneium.toLowerCase()
    case UniverseChainId.XLayer:
      return GraphQLApi.Chain.Xlayer.toLowerCase()
    case UniverseChainId.UnichainSepolia:
      return 'unichain_sepolia'
    case UniverseChainId.WorldChain:
      return GraphQLApi.Chain.Worldchain.toLowerCase()
    case UniverseChainId.Zksync:
      return GraphQLApi.Chain.Zksync.toLowerCase()
    case UniverseChainId.Zora:
      return GraphQLApi.Chain.Zora.toLowerCase()
    case UniverseChainId.Tempo:
      return GraphQLApi.Chain.Tempo.toLowerCase()
    case UniverseChainId.Lux:
      return GraphQLApi.Chain.Lux.toLowerCase()
    case UniverseChainId.LuxTestnet:
      return 'lux_testnet'
    case UniverseChainId.LuxDev:
      return 'lux_dev'
    case UniverseChainId.Zoo:
      return GraphQLApi.Chain.Zoo.toLowerCase()
    case UniverseChainId.ZooTestnet:
      return 'zoo_testnet'
    case UniverseChainId.ZooDev:
      return 'zoo_dev'
    case UniverseChainId.Hanzo:
      return GraphQLApi.Chain.Hanzo.toLowerCase()
    case UniverseChainId.HanzoTestnet:
      return 'hanzo_testnet'
    case UniverseChainId.SPC:
      return GraphQLApi.Chain.Spc.toLowerCase()
    case UniverseChainId.Pars:
      return GraphQLApi.Chain.Pars.toLowerCase()
    case UniverseChainId.Liquidity:
      return GraphQLApi.Chain.Liquidity.toLowerCase()
    case UniverseChainId.LiquidityTestnet:
      return 'liquidity_testnet'
    case UniverseChainId.LiquidityDev:
      return 'liquidity_dev'
    default:
      throw new Error(`ChainID "${chainId}" can not be mapped`)
  }
}

export function filterChainIdsByFeatureFlag(
  featureFlaggedChainIds: {
    [key in UniverseChainId]?: boolean
  },
): UniverseChainId[] {
  return ALL_CHAIN_IDS.filter((chainId) => {
    return featureFlaggedChainIds[chainId] ?? true
  })
}

/**
 * Filters chain IDs by platform (EVM or SVM)
 * @param chainIds Array of chain IDs to filter (as numbers)
 * @param platform Platform to filter by (EVM or SVM)
 * @returns Filtered array of chain IDs matching the specified platform
 */
export function filterChainIdsByPlatform<T extends number>(chainIds: T[], platform: Platform): T[] {
  return chainIds.filter<T>((chainId): chainId is T => {
    const universeChainId = chainId as UniverseChainId
    if (!ALL_CHAIN_IDS.includes(universeChainId)) {
      return false
    }
    const chainInfo = getChainInfo(universeChainId)
    return chainInfo.platform === platform
  })
}

export function getEnabledChains({
  platform,
  /**
   * When `true`, it will return all enabled chains, including testnets.
   */
  includeTestnets = false,
  isTestnetModeEnabled,
  featureFlaggedChainIds,
}: {
  platform?: Platform
  isTestnetModeEnabled: boolean
  featureFlaggedChainIds: UniverseChainId[]
  includeTestnets?: boolean
}): EnabledChainsInfo {
  const visibleChainIds = getVisibleChainIds()

  const enabledChainInfos = ORDERED_CHAINS.filter((chainInfo) => {
    // Filter by white-label brand config (NEXT_PUBLIC_CHAIN_FILTER or NEXT_PUBLIC_BRAND_NAME)
    if (visibleChainIds !== null && !visibleChainIds.includes(chainInfo.id)) {
      return false
    }

    // Filter by platform
    if (platform !== undefined && platform !== chainInfo.platform) {
      return false
    }

    // Filter by testnet mode
    if (!includeTestnets && isTestnetModeEnabled !== isTestnetChain(chainInfo.id)) {
      return false
    }

    // Filter by feature flags
    if (!featureFlaggedChainIds.includes(chainInfo.id)) {
      return false
    }

    return true
  })

  // Extract chain IDs and GQL chains from filtered results
  const chains = enabledChainInfos.map((chainInfo) => chainInfo.id)
  const gqlChains = enabledChainInfos.map((chainInfo) => chainInfo.backendChain.chain)

  const result = {
    chains,
    gqlChains,
    defaultChainId: getDefaultChainId({ platform, isTestnetModeEnabled }),
    isTestnetModeEnabled,
  }

  return result
}

function getDefaultChainId({
  platform,
  isTestnetModeEnabled,
}: {
  platform?: Platform
  isTestnetModeEnabled: boolean
}): UniverseChainId {
  if (platform === Platform.SVM) {
    return UniverseChainId.Solana
  }

  // Use runtime brand config defaultChainId if set (from /config.json)
  const brandDefault = runtimeBrand.defaultChainId as UniverseChainId | undefined
  if (brandDefault && ALL_CHAIN_IDS.includes(brandDefault)) {
    // For testnet mode, try to find the corresponding testnet chain
    if (isTestnetModeEnabled) {
      if (brandDefault === UniverseChainId.Zoo) return UniverseChainId.ZooTestnet
      if (brandDefault === UniverseChainId.Lux) return UniverseChainId.LuxTestnet
      if (brandDefault === UniverseChainId.Liquidity) return UniverseChainId.LiquidityTestnet
      return UniverseChainId.Sepolia // generic fallback
    }
    return brandDefault
  }

  // Fallback: Lux network
  return isTestnetModeEnabled ? UniverseChainId.LuxTestnet : UniverseChainId.Lux
}

/** Returns all stablecoins for a given chainId. */
export function getStablecoinsForChain(chainId: UniverseChainId): Token[] {
  return getChainInfo(chainId).tokens.stablecoins
}

/** Checks if a token address is a stablecoin on the given chain. */
export function isStablecoinAddress(chainId: UniverseChainId, tokenAddress: string): boolean {
  try {
    const stablecoins = getStablecoinsForChain(chainId)
    return stablecoins.some((stablecoin) => stablecoin.address.toLowerCase() === tokenAddress.toLowerCase())
  } catch {
    return false
  }
}

/** Returns the primary stablecoin for a given chainId. */
export function getPrimaryStablecoin(chainId: UniverseChainId): Token {
  return getChainInfo(chainId).tokens.stablecoins[0]
}

export function isUniverseChainId(chainId?: number | UniverseChainId | null): chainId is UniverseChainId {
  return !!chainId && ALL_CHAIN_IDS.includes(chainId as UniverseChainId)
}
