'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSearchCollections } from '@/hooks/useNFTData'
import { useChainContext } from '@/hooks/useChain'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { chainId } = useChainContext()
  const { data: results } = useSearchCollections(chainId, query)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const nftResults = results?.items?.filter(
    (r: { type: string }) => r.type === 'ERC-721' || r.type === 'ERC-1155'
  ) ?? []

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search collections, NFTs..."
        style={{
          width: '100%',
          padding: '10px 16px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          color: 'var(--foreground)',
          fontSize: 14,
          outline: 'none',
        }}
      />
      {isOpen && query.length >= 2 && nftResults.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 8,
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {nftResults.map((item: { address: string; name: string; symbol: string; type: string; icon_url: string | null }) => (
            <Link
              key={item.address}
              href={`/collection/${chainId}/${item.address}`}
              onClick={() => {
                setIsOpen(false)
                setQuery('')
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--foreground)',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--card-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: item.icon_url
                    ? `url(${item.icon_url}) center/cover`
                    : 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#444',
                }}
              >
                {!item.icon_url && (item.symbol?.charAt(0) ?? '?')}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.type}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
