import { brand } from '@l.x/config'
import { config } from '@l.x/lx/src/config'

import { RetryOptions, RPCType, UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { ONE_MINUTE_MS } from '@l.x/utils/src/time/time'

/** Address that represents native currencies on ETH, Arbitrum, etc. */
export const DEFAULT_NATIVE_ADDRESS_LEGACY = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const DEFAULT_NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 10, minWait: 250, medWait: 500, maxWait: 1000 }

export const DEFAULT_MS_BEFORE_WARNING = ONE_MINUTE_MS * 10

/**
 * Bootnode chain slug used in `POST /v1/rpc/{chain}`. See
 * `~/work/bootnode/api/bootnode/api/rpc` for the canonical chain list.
 *
 * The previous Quicknode integration used per-chain hostnames + a token in
 * the path; bootnode uses a slug-based path with auth via the gateway. Slugs
 * mirror the bootnode supported-chain table (Phase 1):
 *
 *   ethereum, polygon, arbitrum, optimism, base, avalanche, bsc, solana,
 *   blast, celo, monad, soneium, tempo, unichain, worldchain, xlayer,
 *   zksync, zora, sepolia, unichain-sepolia
 *
 * IMPORTANT: never return '' here. Solana web3.js's `Connection(url)` ctor
 * throws synchronously on empty strings (it validates the `http(s)://`
 * prefix), which would crash the SPA at module init. Mainnet → 'ethereum'.
 */
// eslint-disable-next-line complexity
export function getBootnodeChainSlug(chainId: UniverseChainId): string {
  switch (chainId) {
    case UniverseChainId.Mainnet:
      return 'ethereum'
    case UniverseChainId.ArbitrumOne:
      return 'arbitrum'
    case UniverseChainId.Avalanche:
      return 'avalanche'
    case UniverseChainId.Base:
      return 'base'
    case UniverseChainId.Blast:
      return 'blast'
    case UniverseChainId.Bnb:
      return 'bsc'
    case UniverseChainId.Celo:
      return 'celo'
    case UniverseChainId.Monad:
      return 'monad'
    case UniverseChainId.Optimism:
      return 'optimism'
    case UniverseChainId.Polygon:
      return 'polygon'
    case UniverseChainId.Sepolia:
      return 'sepolia'
    case UniverseChainId.Solana:
      return 'solana'
    case UniverseChainId.Soneium:
      return 'soneium'
    case UniverseChainId.Tempo:
      return 'tempo'
    case UniverseChainId.Unichain:
      return 'unichain'
    case UniverseChainId.UnichainSepolia:
      return 'unichain-sepolia'
    case UniverseChainId.WorldChain:
      return 'worldchain'
    case UniverseChainId.XLayer:
      return 'xlayer'
    case UniverseChainId.Zksync:
      return 'zksync'
    case UniverseChainId.Zora:
      return 'zora'
    default:
      throw new Error(`Chain ${chainId} does not have a corresponding Bootnode chain slug`)
  }
}

/**
 * Some chains historically required a path suffix (e.g. Avalanche on
 * Quicknode used `/ext/bc/C/rpc`). Bootnode normalizes this server-side, so
 * no per-chain suffix is needed at the client. Kept as a stub for symmetry
 * with the prior `getQuicknodeChainIdPathSuffix` so call sites that fetched
 * the suffix do not have to change.
 */
export function getBootnodeChainPathSuffix(_chainId: UniverseChainId): string {
  return ''
}

/**
 * Resolve the Bootnode RPC URL for a chain.
 *
 * Resolution order:
 *   1. `config.bootnodeRpcUrlOverride` (build-time env override)
 *   2. `https://${brand.gatewayDomain}/v1/rpc/{chain}` (default)
 *
 * The override is useful for staging deployments that want to point at a
 * private bootnode hostname (e.g. `https://bootnode.dev.example.com`).
 *
 * The function never returns '' — this is critical because Solana
 * `Connection(url)` throws synchronously on empty strings.
 */
export function getBootnodeRpcUrl(chainId: UniverseChainId): string {
  const slug = getBootnodeChainSlug(chainId)
  const suffix = getBootnodeChainPathSuffix(chainId)

  // Override wins. Strip any trailing slash so we can append `/v1/rpc/...`.
  const override = config.bootnodeRpcUrlOverride.replace(/\/+$/, '')
  if (override) {
    return `${override}/v1/rpc/${slug}${suffix}`
  }

  // Default: bootnode is fronted by the gateway domain. brand.gatewayDomain
  // is populated by loadBrandConfig before first render.
  const host = brand.gatewayDomain || 'api.lux.exchange'
  return `https://${host}/v1/rpc/${slug}${suffix}`
}

export function getPlaywrightRpcUrls(url: string): { [key in RPCType]: { http: string[] } } {
  return {
    [RPCType.Public]: { http: [url] },
    [RPCType.Default]: { http: [url] },
    [RPCType.Fallback]: { http: [url] },
    [RPCType.Interface]: { http: [url] },
    [RPCType.Private]: { http: [url] },
    [RPCType.PublicAlt]: { http: [url] },
  }
}
