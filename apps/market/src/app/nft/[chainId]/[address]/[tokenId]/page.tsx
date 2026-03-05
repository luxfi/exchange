'use client'

import { use } from 'react'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { ListingForm } from '@/components/ListingForm'
import { OfferForm } from '@/components/OfferForm'
import { ActivityRow } from '@/components/ActivityRow'
import { useTokenInstance, useTokenInstanceTransfers } from '@/hooks/useNFTData'
import { getNftImageUrl, resolveMediaUrl } from '@/lib/explorer'
import { CHAIN_INFO, EXPLORER_API } from '@/lib/chains'
import type { Address } from 'viem'

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function NFTDetailPage({
  params,
}: {
  params: Promise<{ chainId: string; address: string; tokenId: string }>
}) {
  const { chainId: chainIdStr, address: contractAddress, tokenId } = use(params)
  const chainId = Number(chainIdStr)
  const { address: userAddress } = useAccount()
  const chainInfo = CHAIN_INFO[chainId]
  const explorerBase = EXPLORER_API[chainId]?.replace('/api/v2', '') ?? 'https://explore.lux.network'

  const { data: instance, isLoading } = useTokenInstance(chainId, contractAddress, tokenId)
  const { data: transfers } = useTokenInstanceTransfers(chainId, contractAddress, tokenId)

  const imageUrl = instance ? getNftImageUrl(instance) : null
  const animationUrl = instance ? resolveMediaUrl(instance.animation_url ?? instance.metadata?.animation_url) : null
  const ownerAddress = instance?.owner?.hash
  const isOwner = userAddress && ownerAddress && userAddress.toLowerCase() === ownerAddress.toLowerCase()
  const metadata = instance?.metadata

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--muted)' }}>Loading NFT...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start' }}>
            {/* Left: Media */}
            <div>
              <div
                style={{
                  aspectRatio: '1',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  maxWidth: 600,
                  position: 'relative',
                  background: '#111',
                }}
              >
                {animationUrl ? (
                  <video
                    src={animationUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={metadata?.name ?? `#${tokenId}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                    sizes="600px"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                      fontSize: 48,
                      fontWeight: 700,
                      color: '#333',
                    }}
                  >
                    #{tokenId}
                  </div>
                )}
              </div>

              {/* Description */}
              {metadata?.description && (
                <div
                  style={{
                    marginTop: 16,
                    background: 'var(--card)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Description
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.6 }}>
                    {metadata.description}
                  </div>
                </div>
              )}

              {/* Traits */}
              {metadata?.attributes && metadata.attributes.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    background: 'var(--card)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Traits
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                    {metadata.attributes.map((trait, i) => (
                      <div
                        key={`${trait.trait_type}-${i}`}
                        style={{
                          background: 'rgba(232,232,232,0.05)',
                          borderRadius: 8,
                          padding: '8px 12px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {trait.trait_type}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                          {String(trait.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transfer History */}
              {transfers?.items && transfers.items.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    background: 'var(--card)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Transfer History
                  </div>
                  {transfers.items.slice(0, 20).map((t, i) => (
                    <ActivityRow key={`${t.tx_hash}-${i}`} transfer={t} chainId={chainId} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details + Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
              {/* Collection & Name */}
              <div>
                <a
                  href={`/collection/${chainId}/${contractAddress}`}
                  style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}
                >
                  {instance?.token?.name ?? 'Collection'}
                </a>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>
                  {metadata?.name ?? `#${tokenId}`}
                </h1>
              </div>

              {/* Owner */}
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  padding: 14,
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Owner
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontFamily: 'monospace' }}>
                    {ownerAddress ? shortenAddress(ownerAddress) : '---'}
                  </span>
                  {isOwner && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(0,200,100,0.1)',
                        color: '#0c6',
                        fontWeight: 600,
                      }}
                    >
                      YOU
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  padding: 14,
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Details
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Chain', value: chainInfo?.name ?? String(chainId), color: chainInfo?.color },
                    {
                      label: 'Contract',
                      value: shortenAddress(contractAddress),
                      href: `${explorerBase}/token/${contractAddress}`,
                    },
                    { label: 'Token ID', value: tokenId },
                    { label: 'Token Standard', value: instance?.token?.type ?? 'ERC-721' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                      {row.href ? (
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontFamily: 'monospace', color: 'var(--foreground)', textDecoration: 'none' }}
                        >
                          {row.value} &nearr;
                        </a>
                      ) : (
                        <span style={{ color: row.color, fontFamily: row.label === 'Token ID' ? 'monospace' : undefined }}>
                          {row.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* External links */}
              {metadata?.external_url && (
                <a
                  href={metadata.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontSize: 13,
                  }}
                >
                  View External &nearr;
                </a>
              )}

              {/* Trading Actions */}
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  padding: 16,
                  border: '1px solid var(--border)',
                }}
              >
                {isOwner ? (
                  <ListingForm contractAddress={contractAddress as Address} tokenId={tokenId} />
                ) : (
                  <OfferForm contractAddress={contractAddress as Address} tokenId={tokenId} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
