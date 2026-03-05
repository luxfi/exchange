import { Header } from '@/components/Header'

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <section style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>Lux Market</h1>
          <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 600, margin: '0 auto' }}>
            Trade NFTs across all Lux chains. Seaport-powered P2P trading with LSSVM AMM liquidity pools.
          </p>
        </section>

        {/* Featured: Genesis NFTs */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600 }}>Genesis Collection</h2>
            <a
              href="/genesis"
              style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
            >
              View All
            </a>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {/* Genesis NFT tier cards */}
            {[
              { name: 'Genesis', locked: '1B LUX', tier: 'Tier 1' },
              { name: 'Validator', locked: '100M LUX', tier: 'Tier 2' },
              { name: 'Mini', locked: '10M LUX', tier: 'Tier 3' },
              { name: 'Nano', locked: '1M LUX', tier: 'Tier 4' },
            ].map((nft) => (
              <div
                key={nft.name}
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {nft.tier}
                  </span>
                  <span style={{ fontSize: 28, fontWeight: 700 }}>{nft.name}</span>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Permanently Locked</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{nft.locked}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Staking rewards to holder</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { label: 'Total Volume', value: '---' },
              { label: 'Collections', value: '---' },
              { label: 'Floor Price', value: '---' },
              { label: 'Owners', value: '---' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  padding: '20px 24px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Chains */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Supported Chains</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Lux C-Chain', 'Zoo', 'Hanzo', 'SPC', 'Pars'].map((chain) => (
              <div
                key={chain}
                style={{
                  padding: '10px 20px',
                  background: 'var(--card)',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  fontSize: 14,
                }}
              >
                {chain}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
