'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'

export default function StakePage() {
  const [nodeID, setNodeID] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [duration, setDuration] = useState('14') // days

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Become a Validator</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 14 }}>
          Stake LUX to run a validator node and earn staking rewards. Requires a minimum of 2,000 LUX and a running
          node.
        </p>

        <div
          style={{
            background: 'var(--card)',
            borderRadius: 16,
            border: '1px solid var(--border)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Node ID</label>
            <input
              value={nodeID}
              onChange={(e) => setNodeID(e.target.value)}
              placeholder="NodeID-..."
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--foreground)',
                fontSize: 14,
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Stake Amount (LUX)
            </label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="2000"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--foreground)',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Minimum: 2,000 LUX</div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Staking Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--foreground)',
                fontSize: 14,
              }}
            >
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">1 year</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Delegation Fee
            </label>
            <div style={{ fontSize: 14 }}>2% (minimum)</div>
          </div>

          {/* Info box */}
          <div
            style={{
              background: 'var(--background)',
              borderRadius: 10,
              padding: 16,
              fontSize: 13,
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--foreground)' }}>Requirements:</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>Running Lux node with at least 80% uptime</li>
              <li>Minimum 2,000 LUX stake</li>
              <li>BLS signing key registered on-chain</li>
              <li>Stake is locked for the full duration</li>
            </ul>
          </div>

          <button
            disabled
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 10,
              color: '#000',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
          >
            Stake LUX (Connect Wallet)
          </button>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            Staking requires a P-chain transaction. Uses the X/P-chain wallet bridge.
          </div>
        </div>
      </main>
    </div>
  )
}
