'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatEther } from 'viem'

export interface NFTCardProps {
  contractAddress: string
  tokenId: string
  name?: string
  imageUrl?: string
  collectionName?: string
  price?: bigint
  chainId: number
}

export function NFTCard({ contractAddress, tokenId, name, imageUrl, collectionName, price, chainId }: NFTCardProps) {
  return (
    <Link
      href={`/nft/${chainId}/${contractAddress}/${tokenId}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          transition: 'all 150ms ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--card-hover)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--card)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ aspectRatio: '1', position: 'relative', background: '#1a1a1a' }}>
          {imageUrl ? (
            <Image src={imageUrl} alt={name ?? `#${tokenId}`} fill style={{ objectFit: 'cover' }} unoptimized />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                color: 'var(--muted)',
              }}
            >
              ?
            </div>
          )}
        </div>
        <div style={{ padding: '12px 14px' }}>
          {collectionName && (
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {collectionName}
            </div>
          )}
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{name ?? `#${tokenId}`}</div>
          {price !== undefined && (
            <div style={{ fontSize: 13, color: 'var(--accent)', marginTop: 6 }}>
              {formatEther(price)} LUX
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
