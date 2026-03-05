'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { CollectionCard } from '@/components/CollectionCard'
import { SearchBar } from '@/components/SearchBar'
import { useChainContext } from '@/hooks/useChain'
import { useCollections } from '@/hooks/useNFTData'
import { CHAIN_INFO } from '@/lib/chains'

export default function CollectionsPage() {
  const { chainId } = useChainContext()
  const [search, setSearch] = useState('')
  const { data: collections, isLoading } = useCollections(chainId, search || undefined)
  const chainInfo = CHAIN_INFO[chainId]

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>Collections</h1>
        </div>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
          Browse NFT collections on{' '}
          <span style={{ color: chainInfo?.color, fontWeight: 600 }}>{chainInfo?.name ?? 'Lux'}</span>.
          Collections with LSSVM pools have instant buy/sell liquidity.
        </p>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by name..."
            style={{
              width: '100%',
              maxWidth: 400,
              padding: '10px 16px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--foreground)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        {/* Collection list */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading collections...</div>
        ) : !collections?.items?.length ? (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              background: 'var(--card)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}
          >
            {search
              ? `No collections matching "${search}" on ${chainInfo?.name ?? 'this chain'}.`
              : `No NFT collections found on ${chainInfo?.name ?? 'this chain'} yet.`}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {collections.items.map((token, i) => (
              <CollectionCard key={token.address} token={token} chainId={chainId} rank={i + 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
