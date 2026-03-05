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
          Lux Build
        </Link>
        <nav style={{ display: 'flex', gap: 20 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Dashboard
          </Link>
          <Link href="/stake" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Stake
          </Link>
          <Link href="/delegate" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Delegate
          </Link>
          <Link href="/subnets" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: 14 }}>
            Subnets
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
