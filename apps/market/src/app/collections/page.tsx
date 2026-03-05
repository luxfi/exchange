import { Header } from '@/components/Header'

export default function CollectionsPage() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Collections</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          Browse NFT collections across all Lux chains. Collections with LSSVM pools have instant buy/sell liquidity.
        </p>

        {/* Collection list placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[
            { name: 'Genesis NFTs', chain: 'Lux', items: '11,110', floor: '---' },
          ].map((collection) => (
            <div
              key={collection.name}
              style={{
                background: 'var(--card)',
                borderRadius: 12,
                padding: 20,
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                }}
              />
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{collection.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{collection.chain}</div>
              </div>
              <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                <div>
                  <div style={{ color: 'var(--muted)' }}>Items</div>
                  <div style={{ fontWeight: 600 }}>{collection.items}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)' }}>Floor</div>
                  <div style={{ fontWeight: 600 }}>{collection.floor}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
