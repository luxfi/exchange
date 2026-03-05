'use client'

import { use } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { Header } from '@/components/Header'
import { ListingForm } from '@/components/ListingForm'
import { OfferForm } from '@/components/OfferForm'
import { ERC721_ABI } from '@/lib/contracts'
import type { Address } from 'viem'

export default function NFTDetailPage({ params }: { params: Promise<{ chainId: string; address: string; tokenId: string }> }) {
  const { chainId, address: contractAddress, tokenId } = use(params)
  const { address: userAddress } = useAccount()

  const { data: name } = useReadContract({
    address: contractAddress as Address,
    abi: ERC721_ABI,
    functionName: 'name',
  })

  const { data: owner } = useReadContract({
    address: contractAddress as Address,
    abi: ERC721_ABI,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  })

  const { data: tokenURI } = useReadContract({
    address: contractAddress as Address,
    abi: ERC721_ABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  })

  const isOwner = userAddress && owner && userAddress.toLowerCase() === (owner as string).toLowerCase()

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start' }}>
          {/* Left: NFT image */}
          <div>
            <div
              style={{
                aspectRatio: '1',
                background: 'var(--card)',
                borderRadius: 16,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                color: 'var(--muted)',
                maxWidth: 600,
              }}
            >
              ?
            </div>
            {tokenURI && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>
                URI: {tokenURI as string}
              </div>
            )}
          </div>

          {/* Right: Details + Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Collection & Name */}
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                {name as string ?? 'Collection'}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700 }}>#{tokenId}</h1>
            </div>

            {/* Owner */}
            <div
              style={{
                background: 'var(--card)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Owner</div>
              <div style={{ fontSize: 14, fontFamily: 'monospace' }}>
                {owner ? `${(owner as string).slice(0, 6)}...${(owner as string).slice(-4)}` : '---'}
              </div>
            </div>

            {/* Details */}
            <div
              style={{
                background: 'var(--card)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Chain ID</span>
                  <span>{chainId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Contract</span>
                  <span style={{ fontFamily: 'monospace' }}>
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Token ID</span>
                  <span>{tokenId}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
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
      </main>
    </div>
  )
}
