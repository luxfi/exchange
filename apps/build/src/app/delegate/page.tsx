'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { getCurrentValidators, formatStakeAmount, type Validator } from '@/lib/platform'

export default function DelegatePage() {
  const [validators, setValidators] = useState<Validator[]>([])
  const [selectedValidator, setSelectedValidator] = useState<string>('')
  const [delegateAmount, setDelegateAmount] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentValidators('mainnet')
      .then((v) => {
        // Sort by stake amount descending
        const sorted = v.sort(
          (a: Validator, b: Validator) =>
            Number(BigInt(b.stakeAmount ?? b.weight ?? '0') - BigInt(a.stakeAmount ?? a.weight ?? '0')),
        )
        setValidators(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const selected = validators.find((v) => v.nodeID === selectedValidator)

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Delegate LUX</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 14 }}>
          Delegate your LUX to an existing validator to earn staking rewards without running a node. Minimum 25 LUX.
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
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Select Validator
            </label>
            {loading ? (
              <div style={{ padding: '12px 14px', color: 'var(--muted)', fontSize: 14 }}>Loading validators...</div>
            ) : (
              <select
                value={selectedValidator}
                onChange={(e) => setSelectedValidator(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--foreground)',
                  fontSize: 13,
                  fontFamily: 'monospace',
                }}
              >
                <option value="">Choose a validator...</option>
                {validators.map((v) => (
                  <option key={v.nodeID} value={v.nodeID}>
                    {v.nodeID.slice(0, 20)}... | {formatStakeAmount(v.stakeAmount ?? v.weight)} LUX |{' '}
                    {v.delegationFee}% fee
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected validator details */}
          {selected && (
            <div
              style={{
                background: 'var(--background)',
                borderRadius: 10,
                padding: 16,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                fontSize: 13,
              }}
            >
              <div>
                <div style={{ color: 'var(--muted)' }}>Stake</div>
                <div style={{ fontWeight: 600 }}>{formatStakeAmount(selected.stakeAmount ?? selected.weight)} LUX</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)' }}>Delegation Fee</div>
                <div style={{ fontWeight: 600 }}>{selected.delegationFee}%</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)' }}>Status</div>
                <div style={{ fontWeight: 600, color: selected.connected ? 'var(--success)' : 'var(--warning)' }}>
                  {selected.connected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)' }}>Delegators</div>
                <div style={{ fontWeight: 600 }}>{selected.delegators?.length ?? 0}</div>
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Delegation Amount (LUX)
            </label>
            <input
              type="number"
              value={delegateAmount}
              onChange={(e) => setDelegateAmount(e.target.value)}
              placeholder="25"
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
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Minimum: 25 LUX</div>
          </div>

          <button
            disabled={!selectedValidator || !delegateAmount}
            style={{
              width: '100%',
              padding: '14px',
              background: !selectedValidator || !delegateAmount ? 'var(--card)' : 'var(--success)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: !selectedValidator || !delegateAmount ? 'var(--muted)' : '#000',
              fontWeight: 600,
              fontSize: 16,
              cursor: !selectedValidator || !delegateAmount ? 'not-allowed' : 'pointer',
            }}
          >
            Delegate LUX
          </button>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            Delegation requires a P-chain transaction. Rewards are distributed when the validator&apos;s staking period
            ends.
          </div>
        </div>
      </main>
    </div>
  )
}
