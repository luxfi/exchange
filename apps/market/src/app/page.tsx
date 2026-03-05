'use client'

import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { CollectionCard } from '@/components/CollectionCard'
import { useChainContext } from '@/hooks/useChain'
import { useCollections } from '@/hooks/useNFTData'
import Link from 'next/link'
import { CHAIN_INFO } from '@/lib/chains'

const GENESIS_TIERS = [
  { name: 'Genesis', locked: '1B LUX', tier: 'Tier 1', multiplier: '10x' },
  { name: 'Validator', locked: '100M LUX', tier: 'Tier 2', multiplier: '5x' },
  { name: 'Mini', locked: '10M LUX', tier: 'Tier 3', multiplier: '2x' },
  { name: 'Nano', locked: '1M LUX', tier: 'Tier 4', multiplier: '1x' },
]

export default function Home() {
  const { chainId } = useChainContext()
  const { data: collections, isLoading } = useCollections(chainId)
  const chainInfo = CHAIN_INFO[chainId]

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <section style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.03em' }}>Lux Market</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, margin: '0 auto 24px' }}>
            Trade NFTs across all Lux chains. Seaport-powered P2P trading with LSSVM AMM liquidity.
          </p>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <SearchBar />
          </div>
        </section>

        {/* Genesis Featured */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Genesis Collection</h2>
            <Link href="/genesis" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              View All &rarr;
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {GENESIS_TIERS.map((nft) => (
              <Link key={nft.name} href="/genesis" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  style={{
                    background: 'var(--card)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    transition: 'all 200ms ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#333'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
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
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {nft.tier}
                    </span>
                    <span style={{ fontSize: 24, fontWeight: 700 }}>{nft.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>{nft.multiplier} rewards</span>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Permanently Locked</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{nft.locked}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Collections on selected chain */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>
              Collections on{' '}
              <span style={{ color: chainInfo?.color }}>{chainInfo?.name ?? 'Lux'}</span>
            </h2>
            <Link
              href="/collections"
              style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
            >
              View All &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Loading collections...</div>
          ) : !collections?.items?.length ? (
            <div
              style={{
                textAlign: 'center',
                padding: 32,
                background: 'var(--card)',
                borderRadius: 12,
                border: '1px solid var(--border)',
                color: 'var(--muted)',
              }}
            >
              No NFT collections found on {chainInfo?.name ?? 'this chain'} yet. Deploy an ERC-721 or ERC-1155 to get started.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {collections.items.slice(0, 10).map((token, i) => (
                <CollectionCard key={token.address} token={token} chainId={chainId} rank={i + 1} />
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { label: 'Supported Chains', value: '5' },
              { label: 'Collections', value: collections?.items?.length?.toString() ?? '---' },
              { label: 'Trading Protocol', value: 'Seaport' },
              { label: 'AMM Protocol', value: 'LSSVM' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
