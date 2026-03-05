'use client'

import Link from 'next/link'
import { CHAIN_INFO, EXPLORER_API } from '@/lib/chains'
import type { ExplorerTransfer } from '@/lib/explorer'

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function getEventType(method: string): { label: string; color: string } {
  const m = method.toLowerCase()
  if (m.includes('mint') || m === 'transfer' && true) return { label: 'Transfer', color: '#888' }
  if (m.includes('safe')) return { label: 'Transfer', color: '#888' }
  return { label: method || 'Transfer', color: '#888' }
}

interface ActivityRowProps {
  transfer: ExplorerTransfer
  chainId: number
}

export function ActivityRow({ transfer, chainId }: ActivityRowProps) {
  const chainInfo = CHAIN_INFO[chainId]
  const apiBase = EXPLORER_API[chainId]
  const explorerBase = apiBase?.replace('/api/v2', '') ?? 'https://explore.lux.network'
  const event = getEventType(transfer.method)
  const isMint = transfer.from.hash === '0x0000000000000000000000000000000000000000'
  const tokenId = transfer.total?.token_id ?? '?'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        fontSize: 13,
      }}
    >
      {/* Event type */}
      <div
        style={{
          padding: '4px 10px',
          borderRadius: 6,
          background: isMint ? 'rgba(0,200,100,0.1)' : 'rgba(136,136,136,0.1)',
          color: isMint ? '#0c6' : event.color,
          fontSize: 12,
          fontWeight: 600,
          width: 72,
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {isMint ? 'Mint' : event.label}
      </div>

      {/* Item */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          href={`/nft/${chainId}/${transfer.token.address}/${tokenId}`}
          style={{
            color: 'var(--foreground)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {transfer.token.name} #{tokenId}
        </Link>
      </div>

      {/* From → To */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', flexShrink: 0 }}>
        <a
          href={`${explorerBase}/address/${transfer.from.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--muted)', textDecoration: 'none', fontFamily: 'monospace', fontSize: 12 }}
        >
          {isMint ? 'NullAddress' : shortenAddress(transfer.from.hash)}
        </a>
        <span style={{ fontSize: 10 }}>&rarr;</span>
        <a
          href={`${explorerBase}/address/${transfer.to.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--muted)', textDecoration: 'none', fontFamily: 'monospace', fontSize: 12 }}
        >
          {shortenAddress(transfer.to.hash)}
        </a>
      </div>

      {/* Chain */}
      {chainInfo && (
        <div style={{ fontSize: 11, color: chainInfo.color, fontWeight: 600, width: 40, textAlign: 'right', flexShrink: 0 }}>
          {chainInfo.name}
        </div>
      )}

      {/* Time */}
      <div style={{ color: 'var(--muted)', fontSize: 12, width: 80, textAlign: 'right', flexShrink: 0 }}>
        {transfer.timestamp ? new Date(transfer.timestamp).toLocaleDateString() : '---'}
      </div>

      {/* Tx link */}
      <a
        href={`${explorerBase}/tx/${transfer.tx_hash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--muted)',
          textDecoration: 'none',
          fontSize: 11,
          flexShrink: 0,
        }}
        title="View on explorer"
      >
        &nearr;
      </a>
    </div>
  )
}
