'use client'

import Link from 'next/link'
import { CHAIN_INFO } from '@/lib/chains'
import type { ExplorerToken } from '@/lib/explorer'

interface CollectionCardProps {
  token: ExplorerToken
  chainId: number
  rank?: number
}

export function CollectionCard({ token, chainId, rank }: CollectionCardProps) {
  const chainInfo = CHAIN_INFO[chainId]

  return (
    <Link
      href={`/collection/${chainId}/${token.address}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 12,
          padding: 16,
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transition: 'all 150ms ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#333'
          e.currentTarget.style.background = 'var(--card-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--card)'
        }}
      >
        {rank !== undefined && (
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)', width: 24, textAlign: 'center' }}>
            {rank}
          </div>
        )}
        {/* Collection icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: token.icon_url
              ? `url(${token.icon_url}) center/cover`
              : 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            color: '#333',
          }}
        >
          {!token.icon_url && (token.symbol?.charAt(0) ?? '?')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {token.name}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
            <span>{token.type}</span>
            {chainInfo && (
              <span style={{ color: chainInfo.color }}>{chainInfo.name}</span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 13 }}>
            {token.holders ? Number(token.holders).toLocaleString() : '---'} holders
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {token.total_supply ? Number(token.total_supply).toLocaleString() : '---'} items
          </div>
        </div>
      </div>
    </Link>
  )
}
