'use client'

import { useAccount } from 'wagmi'
import { Header } from '@/components/Header'

export default function PortfolioPage() {
  const { address, isConnected } = useAccount()

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>My NFTs</h1>

        {!isConnected ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              background: 'var(--card)',
              borderRadius: 16,
              border: '1px solid var(--border)',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Connect your wallet</h2>
            <p style={{ color: 'var(--muted)' }}>Connect a wallet to view your NFT portfolio.</p>
          </div>
        ) : (
          <div>
            {/* Active listings */}
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Active Listings</h2>
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  padding: 24,
                  textAlign: 'center',
                  color: 'var(--muted)',
                }}
              >
                No active listings
              </div>
            </section>

            {/* Offers received */}
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Offers Received</h2>
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  padding: 24,
                  textAlign: 'center',
                  color: 'var(--muted)',
                }}
              >
                No offers received
              </div>
            </section>

            {/* Owned NFTs */}
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Owned NFTs</h2>
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  padding: 24,
                  textAlign: 'center',
                  color: 'var(--muted)',
                }}
              >
                <p>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                <p style={{ marginTop: 8 }}>NFT indexing coming soon. View your NFTs on the explorer.</p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
