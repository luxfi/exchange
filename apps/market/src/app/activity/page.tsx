'use client'

import { Header } from '@/components/Header'
import { ActivityRow } from '@/components/ActivityRow'
import { useChainContext } from '@/hooks/useChain'
import { useQuery } from '@tanstack/react-query'
import { EXPLORER_API } from '@/lib/chains'

/** Fetch recent NFT transfers across all NFT contracts on the selected chain */
async function getRecentNftTransfers(chainId: number) {
  const base = EXPLORER_API[chainId] ?? EXPLORER_API[96369]
  const res = await fetch(`${base}/token-transfers?type=ERC-721,ERC-1155`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 15 },
  })
  if (!res.ok) return { items: [] }
  return res.json()
}

export default function ActivityPage() {
  const { chainId } = useChainContext()
  const { data, isLoading } = useQuery({
    queryKey: ['nft', 'activity', chainId],
    queryFn: () => getRecentNftTransfers(chainId),
    staleTime: 15_000,
  })

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Activity</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 14 }}>
          Recent NFT transfers, mints, and sales across all collections.
        </p>

        {/* Column headers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: 11,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          <div style={{ width: 72, textAlign: 'center' }}>Event</div>
          <div style={{ flex: 1 }}>Item</div>
          <div style={{ width: 200, textAlign: 'center' }}>From / To</div>
          <div style={{ width: 40, textAlign: 'right' }}>Chain</div>
          <div style={{ width: 80, textAlign: 'right' }}>Date</div>
          <div style={{ width: 20 }} />
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading activity...</div>
        ) : !data?.items?.length ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
            No NFT activity found on this chain yet.
          </div>
        ) : (
          data.items.map((transfer: any, i: number) => (
            <ActivityRow key={`${transfer.tx_hash}-${i}`} transfer={transfer} chainId={chainId} />
          ))
        )}
      </main>
    </div>
  )
}
