'use client'

import { use, useState, useMemo } from 'react'
import { Header } from '@/components/Header'
import { NFTCard } from '@/components/NFTCard'
import { TraitFilter } from '@/components/TraitFilter'
import { ActivityRow } from '@/components/ActivityRow'
import { useCollection, useTokenInstances, useCollectionTransfers } from '@/hooks/useNFTData'
import { CHAIN_INFO, EXPLORER_API } from '@/lib/chains'

type Tab = 'items' | 'activity'

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const { chainId: chainIdStr, address } = use(params)
  const chainId = Number(chainIdStr)
  const chainInfo = CHAIN_INFO[chainId]
  const explorerBase = EXPLORER_API[chainId]?.replace('/api/v2', '') ?? 'https://explore.lux.network'

  const [tab, setTab] = useState<Tab>('items')
  const [selectedTraits, setSelectedTraits] = useState<Record<string, Set<string>>>({})

  const { data: collection, isLoading: loadingCollection } = useCollection(chainId, address)
  const { data: instances, isLoading: loadingInstances } = useTokenInstances(chainId, address)
  const { data: transfers } = useCollectionTransfers(chainId, address)

  const handleTraitToggle = (traitType: string, value: string) => {
    setSelectedTraits((prev) => {
      const next = { ...prev }
      const set = new Set(next[traitType] ?? [])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      next[traitType] = set
      return next
    })
  }

  // Filter instances by selected traits
  const filteredInstances = useMemo(() => {
    const items = instances?.items ?? []
    const hasFilters = Object.values(selectedTraits).some((s) => s.size > 0)
    if (!hasFilters) return items

    return items.filter((inst) => {
      const attrs = inst.metadata?.attributes
      if (!attrs) return false
      for (const [traitType, values] of Object.entries(selectedTraits)) {
        if (values.size === 0) continue
        const match = attrs.some((a) => a.trait_type === traitType && values.has(String(a.value)))
        if (!match) return false
      }
      return true
    })
  }, [instances?.items, selectedTraits])

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* Collection header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 14,
                background: collection?.icon_url
                  ? `url(${collection.icon_url}) center/cover`
                  : 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 700,
                color: '#333',
              }}
            >
              {!collection?.icon_url && (collection?.symbol?.charAt(0) ?? '?')}
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700 }}>{collection?.name ?? 'Loading...'}</h1>
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 13, color: 'var(--muted)' }}>
                {chainInfo && <span style={{ color: chainInfo.color }}>{chainInfo.name}</span>}
                <span>{collection?.type}</span>
                <a
                  href={`${explorerBase}/token/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--muted)', textDecoration: 'none' }}
                >
                  {address.slice(0, 6)}...{address.slice(-4)} &nearr;
                </a>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            {[
              { label: 'Items', value: collection?.total_supply ? Number(collection.total_supply).toLocaleString() : '---' },
              { label: 'Holders', value: collection?.holders ? Number(collection.holders).toLocaleString() : '---' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            {(['items', 'activity'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid var(--foreground)' : '2px solid transparent',
                  color: tab === t ? 'var(--foreground)' : 'var(--muted)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t}
                {t === 'items' && instances?.items && (
                  <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--muted)' }}>
                    ({filteredInstances.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tab === 'items' && (
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Trait sidebar */}
            <TraitFilter
              instances={instances?.items ?? []}
              selectedTraits={selectedTraits}
              onTraitToggle={handleTraitToggle}
              onClear={() => setSelectedTraits({})}
            />

            {/* NFT grid */}
            <div style={{ flex: 1 }}>
              {loadingInstances ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading NFTs...</div>
              ) : filteredInstances.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>No NFTs found</div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 12,
                  }}
                >
                  {filteredInstances.map((inst) => (
                    <NFTCard
                      key={`${inst.token.address}-${inst.id}`}
                      contractAddress={inst.token.address}
                      tokenId={inst.id}
                      chainId={chainId}
                      instance={inst}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div>
            {!transfers?.items?.length ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>No activity yet</div>
            ) : (
              transfers.items.map((t, i) => <ActivityRow key={`${t.tx_hash}-${i}`} transfer={t} chainId={chainId} />)
            )}
          </div>
        )}
      </main>
    </div>
  )
}
