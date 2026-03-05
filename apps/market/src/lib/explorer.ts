/**
 * Explorer API client for NFT data.
 * Uses the /api/v2/ endpoints from our deployed Lux Explorer instances.
 */
import { EXPLORER_API } from './chains'

// ---- Types matching Explorer v2 API response shapes ----

export interface ExplorerToken {
  address: string
  name: string
  symbol: string
  total_supply: string
  type: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'ERC-404'
  holders: string
  icon_url: string | null
  exchange_rate: string | null
}

export interface ExplorerTokenInstance {
  id: string
  token: ExplorerToken
  animation_url: string | null
  external_app_url: string | null
  image_url: string | null
  is_unique: boolean
  metadata: NFTMetadata | null
  owner: { hash: string } | null
}

export interface NFTMetadata {
  name?: string
  description?: string
  image?: string
  image_data?: string
  external_url?: string
  animation_url?: string
  background_color?: string
  attributes?: NFTTrait[]
  properties?: Record<string, unknown>
}

export interface NFTTrait {
  trait_type: string
  value: string | number
  display_type?: string
  max_value?: number
}

export interface ExplorerTransfer {
  from: { hash: string }
  to: { hash: string }
  total: { token_id: string; value: string } | null
  token: ExplorerToken
  tx_hash: string
  timestamp: string
  method: string
  block_number: number
}

export interface ExplorerAddress {
  hash: string
  is_contract: boolean
  name: string | null
  token_balances: unknown[]
}

export interface PaginatedResponse<T> {
  items: T[]
  next_page_params: Record<string, string> | null
}

// ---- API Client ----

function getApiBase(chainId: number): string {
  return EXPLORER_API[chainId] ?? EXPLORER_API[96369]
}

async function fetchApi<T>(chainId: number, path: string, params?: Record<string, string>): Promise<T> {
  const base = getApiBase(chainId)
  const url = new URL(`${base}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`Explorer API error: ${res.status} ${res.statusText}`)
  return res.json()
}

/** List NFT collections (ERC-721 + ERC-1155 tokens) on a chain */
export async function getCollections(
  chainId: number,
  params?: { type?: string; q?: string }
): Promise<PaginatedResponse<ExplorerToken>> {
  return fetchApi(chainId, '/tokens', {
    type: params?.type ?? 'ERC-721,ERC-1155',
    ...(params?.q ? { q: params.q } : {}),
  })
}

/** Get a specific token/collection by address */
export async function getToken(chainId: number, address: string): Promise<ExplorerToken> {
  return fetchApi(chainId, `/tokens/${address}`)
}

/** List token instances (NFTs) within a collection */
export async function getTokenInstances(
  chainId: number,
  address: string,
  params?: { holder_address_hash?: string }
): Promise<PaginatedResponse<ExplorerTokenInstance>> {
  return fetchApi(chainId, `/tokens/${address}/instances`, params as Record<string, string>)
}

/** Get a single NFT instance */
export async function getTokenInstance(
  chainId: number,
  address: string,
  tokenId: string
): Promise<ExplorerTokenInstance> {
  return fetchApi(chainId, `/tokens/${address}/instances/${tokenId}`)
}

/** Get transfers for a specific NFT instance */
export async function getTokenInstanceTransfers(
  chainId: number,
  address: string,
  tokenId: string
): Promise<PaginatedResponse<ExplorerTransfer>> {
  return fetchApi(chainId, `/tokens/${address}/instances/${tokenId}/transfers`)
}

/** Get holders of a specific NFT instance */
export async function getTokenInstanceHolders(
  chainId: number,
  address: string,
  tokenId: string
): Promise<PaginatedResponse<{ address: ExplorerAddress; value: string }>> {
  return fetchApi(chainId, `/tokens/${address}/instances/${tokenId}/holders`)
}

/** Get all token transfers for a collection */
export async function getTokenTransfers(
  chainId: number,
  address: string
): Promise<PaginatedResponse<ExplorerTransfer>> {
  return fetchApi(chainId, `/tokens/${address}/token-transfers`)
}

/** Get NFTs owned by an address across a specific collection */
export async function getAddressTokenInstances(
  chainId: number,
  walletAddress: string,
  tokenAddress: string
): Promise<PaginatedResponse<ExplorerTokenInstance>> {
  return fetchApi(chainId, `/tokens/${tokenAddress}/instances`, {
    holder_address_hash: walletAddress,
  })
}

/** Get all NFT tokens held by an address */
export async function getAddressTokens(
  chainId: number,
  address: string,
  type: string = 'ERC-721'
): Promise<PaginatedResponse<{ token: ExplorerToken; value: string; token_id: string | null; token_instance: ExplorerTokenInstance | null }>> {
  return fetchApi(chainId, `/addresses/${address}/tokens`, { type })
}

/** Search for tokens by name */
export async function searchTokens(
  chainId: number,
  query: string
): Promise<{ items: Array<{ address: string; name: string; symbol: string; type: string; icon_url: string | null }> }> {
  return fetchApi(chainId, '/search', { q: query })
}

/** Resolve IPFS URLs to gateway URLs */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`
  }
  if (url.startsWith('ar://')) {
    return `https://arweave.net/${url.slice(5)}`
  }
  return url
}

/** Get the best image URL for an NFT instance */
export function getNftImageUrl(instance: ExplorerTokenInstance): string | null {
  return (
    resolveMediaUrl(instance.image_url) ??
    resolveMediaUrl(instance.metadata?.image) ??
    resolveMediaUrl(instance.metadata?.image_data) ??
    null
  )
}
