'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useChainContext } from '@/hooks/useChain'
import { CHAIN_INFO } from '@/lib/chains'

const NAV_LINKS = [
  { href: '/', label: 'Explore' },
  { href: '/collections', label: 'Collections' },
  { href: '/activity', label: 'Activity' },
  { href: '/genesis', label: 'Genesis' },
  { href: '/portfolio', label: 'Portfolio' },
]

const CHAIN_IDS = [96369, 200200, 36963, 36911, 494949]

export function Header() {
  const pathname = usePathname()
  const { chainId, setChainId } = useChainContext()

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: 'var(--foreground)',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          Lux Market
        </Link>
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: 'none',
                  color: isActive ? 'var(--foreground)' : 'var(--muted)',
                  fontSize: 14,
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: isActive ? 'var(--card)' : 'transparent',
                  transition: 'all 150ms ease',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Chain selector */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--card)', borderRadius: 8, padding: 2 }}>
          {CHAIN_IDS.map((id) => {
            const info = CHAIN_INFO[id]
            const isActive = chainId === id
            return (
              <button
                key={id}
                onClick={() => setChainId(id)}
                title={info.name}
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: isActive ? info.color : 'transparent',
                  color: isActive ? '#000' : 'var(--muted)',
                  transition: 'all 150ms ease',
                }}
              >
                {info.name}
              </button>
            )
          })}
        </div>

        <a
          href="https://exchange.lux.network"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            color: 'var(--muted)',
            fontSize: 13,
            padding: '6px 12px',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          Exchange
        </a>

        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
      </div>
    </header>
  )
}
