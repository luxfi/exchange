'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Header() {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        background: 'var(--background)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--foreground)', fontSize: 20, fontWeight: 700 }}>
          Lux Market
        </Link>
        <nav style={{ display: 'flex', gap: 20 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Explore
          </Link>
          <Link href="/collections" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Collections
          </Link>
          <Link href="/genesis" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Genesis
          </Link>
          <Link href="/portfolio" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Portfolio
          </Link>
          <a
            href="https://exchange.lux.network"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}
          >
            Exchange
          </a>
        </nav>
      </div>
      <ConnectButton />
    </header>
  )
}
