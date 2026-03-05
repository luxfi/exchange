'use client'

import { useAccount } from 'wagmi'
import { Header } from '@/components/Header'
import { NFTCard } from '@/components/NFTCard'
import { useChainContext } from '@/hooks/useChain'
import { usePortfolioNFTs } from '@/hooks/useNFTData'
import { CHAIN_INFO } from '@/lib/chains'

const ALL_CHAIN_IDS = [96369, 200200, 36963, 36911, 494949]

function ChainPortfolio({ chainId, walletAddress }: { chainId: number; walletAddress: string }) {
  const { data, isLoading } = usePortfolioNFTs(chainId, walletAddress)
  const chainInfo = CHAIN_INFO[chainId]

  if (isLoading) return <div style={{ color: 'var(--muted)', padding: '12px 0' }}>Loading {chainInfo?.name}...</div>
  if (!data?.items?.length) return null

  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: chainInfo?.color }}>
        {chainInfo?.name} ({data.items.length})
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {data.items.map((item) => (
          <NFTCard
            key={`${item.token.address}-${item.token_id}`}
            contractAddress={item.token.address}
            tokenId={item.token_id ?? '0'}
            collectionName={item.token.name}
            chainId={chainId}
            instance={item.token_instance ?? undefined}
          />
        ))}
      </div>
    </section>
  )
}

export default function PortfolioPage() {
  const { address, isConnected } = useAccount()
  const { chainId: selectedChain } = useChainContext()

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
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#x1F4BC;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Connect your wallet</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Connect a wallet to view your NFTs across all Lux chains.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
                padding: '12px 16px',
                background: 'var(--card)',
                borderRadius: 10,
                border: '1px solid var(--border)',
                fontSize: 13,
              }}
            >
              <span style={{ color: 'var(--muted)' }}>Wallet:</span>
              <span style={{ fontFamily: 'monospace' }}>{address}</span>
            </div>

            {/* NFTs grouped by chain */}
            {ALL_CHAIN_IDS.map((cId) => (
              <ChainPortfolio key={cId} chainId={cId} walletAddress={address!} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
