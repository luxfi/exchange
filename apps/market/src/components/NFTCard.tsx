'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatEther } from 'viem'
import { getNftImageUrl, type ExplorerTokenInstance } from '@/lib/explorer'
import { CHAIN_INFO } from '@/lib/chains'

export interface NFTCardProps {
  contractAddress: string
  tokenId: string
  name?: string
  imageUrl?: string
  collectionName?: string
  price?: bigint
  chainId: number
  instance?: ExplorerTokenInstance
}

export function NFTCard({ contractAddress, tokenId, name, imageUrl, collectionName, price, chainId, instance }: NFTCardProps) {
  const resolvedImage = instance ? getNftImageUrl(instance) : imageUrl
  const resolvedName = instance?.metadata?.name ?? name
  const resolvedCollection = instance?.token?.name ?? collectionName
  const chainInfo = CHAIN_INFO[chainId]

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
          transition: 'all 200ms ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#333'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ aspectRatio: '1', position: 'relative', background: '#111' }}>
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={resolvedName ?? `#${tokenId}`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
              sizes="(max-width: 768px) 50vw, 25vw"
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
                fontSize: 36,
                fontWeight: 700,
                color: '#333',
              }}
            >
              #{tokenId}
            </div>
          )}
          {/* Chain badge */}
          {chainInfo && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                fontSize: 10,
                fontWeight: 600,
                color: chainInfo.color,
              }}
            >
              {chainInfo.name}
            </div>
          )}
        </div>
        <div style={{ padding: '10px 12px' }}>
          {resolvedCollection && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {resolvedCollection}
            </div>
          )}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {resolvedName ?? `#${tokenId}`}
          </div>
          {price !== undefined && price > 0n && (
            <div style={{ fontSize: 13, color: 'var(--accent)', marginTop: 6, fontWeight: 500 }}>
              {formatEther(price)} {chainInfo?.symbol ?? 'LUX'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
