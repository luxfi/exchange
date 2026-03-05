'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getCollections,
  getToken,
  getTokenInstances,
  getTokenInstance,
  getTokenInstanceTransfers,
  getTokenTransfers,
  getAddressTokens,
  searchTokens,
} from '@/lib/explorer'

// ---- Query key factory ----
const nftKeys = {
  all: ['nft'] as const,
  collections: (chainId: number) => [...nftKeys.all, 'collections', chainId] as const,
  collection: (chainId: number, address: string) => [...nftKeys.all, 'collection', chainId, address] as const,
  instances: (chainId: number, address: string) => [...nftKeys.all, 'instances', chainId, address] as const,
  instance: (chainId: number, address: string, tokenId: string) =>
    [...nftKeys.all, 'instance', chainId, address, tokenId] as const,
  transfers: (chainId: number, address: string, tokenId: string) =>
    [...nftKeys.all, 'transfers', chainId, address, tokenId] as const,
  collectionTransfers: (chainId: number, address: string) =>
    [...nftKeys.all, 'collection-transfers', chainId, address] as const,
  portfolio: (chainId: number, wallet: string) => [...nftKeys.all, 'portfolio', chainId, wallet] as const,
  search: (chainId: number, query: string) => [...nftKeys.all, 'search', chainId, query] as const,
}

/** Fetch NFT collections on a chain */
export function useCollections(chainId: number, search?: string) {
  return useQuery({
    queryKey: search ? nftKeys.search(chainId, search) : nftKeys.collections(chainId),
    queryFn: () => getCollections(chainId, { q: search }),
    staleTime: 60_000,
  })
}

/** Fetch a single collection/token by address */
export function useCollection(chainId: number, address: string) {
  return useQuery({
    queryKey: nftKeys.collection(chainId, address),
    queryFn: () => getToken(chainId, address),
    enabled: !!address,
    staleTime: 60_000,
  })
}

/** Fetch NFT instances (items) in a collection */
export function useTokenInstances(chainId: number, address: string) {
  return useQuery({
    queryKey: nftKeys.instances(chainId, address),
    queryFn: () => getTokenInstances(chainId, address),
    enabled: !!address,
    staleTime: 30_000,
  })
}

/** Fetch a single NFT instance with full metadata */
export function useTokenInstance(chainId: number, address: string, tokenId: string) {
  return useQuery({
    queryKey: nftKeys.instance(chainId, address, tokenId),
    queryFn: () => getTokenInstance(chainId, address, tokenId),
    enabled: !!address && !!tokenId,
    staleTime: 30_000,
  })
}

/** Fetch transfer history for a specific NFT */
export function useTokenInstanceTransfers(chainId: number, address: string, tokenId: string) {
  return useQuery({
    queryKey: nftKeys.transfers(chainId, address, tokenId),
    queryFn: () => getTokenInstanceTransfers(chainId, address, tokenId),
    enabled: !!address && !!tokenId,
    staleTime: 30_000,
  })
}

/** Fetch all transfers for a collection */
export function useCollectionTransfers(chainId: number, address: string) {
  return useQuery({
    queryKey: nftKeys.collectionTransfers(chainId, address),
    queryFn: () => getTokenTransfers(chainId, address),
    enabled: !!address,
    staleTime: 30_000,
  })
}

/** Fetch NFTs owned by a wallet on a chain */
export function usePortfolioNFTs(chainId: number, walletAddress: string | undefined) {
  return useQuery({
    queryKey: nftKeys.portfolio(chainId, walletAddress ?? ''),
    queryFn: () => getAddressTokens(chainId, walletAddress!),
    enabled: !!walletAddress,
    staleTime: 30_000,
  })
}

/** Search for NFT collections */
export function useSearchCollections(chainId: number, query: string) {
  return useQuery({
    queryKey: nftKeys.search(chainId, query),
    queryFn: () => searchTokens(chainId, query),
    enabled: query.length >= 2,
    staleTime: 15_000,
  })
}
