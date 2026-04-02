'use client'

import { useEffect, useState } from 'react'
import { ValidatorTable } from '@/components/ValidatorTable'
import {
  getCurrentValidators,
  getHeight,
  getMinStake,
  formatStakeAmount,
  type Validator,
  type Network,
} from '@/lib/platform'

export function ValidatorDashboard() {
  const [network, setNetwork] = useState<Network>('mainnet')
  const [validators, setValidators] = useState<Validator[]>([])
  const [height, setHeight] = useState<string>('')
  const [minStake, setMinStake] = useState<{ minValidatorStake: string; minDelegatorStake: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([getCurrentValidators(network), getHeight(network), getMinStake(network)])
      .then(([v, h, ms]) => {
        setValidators(v)
        setHeight(h)
        setMinStake(ms)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [network])

  const totalStake = validators.reduce((sum, v) => sum + BigInt(v.stakeAmount ?? v.weight ?? '0'), BigInt(0))
  const connectedCount = validators.filter((v) => v.connected).length
  const totalDelegators = validators.reduce((sum, v) => sum + (v.delegators?.length ?? 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Network selector */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['mainnet', 'testnet', 'devnet'] as Network[]).map((n) => (
          <button
            key={n}
            onClick={() => setNetwork(n)}
            style={{
              padding: '8px 16px',
              background: network === n ? 'var(--accent)' : 'var(--card)',
              color: network === n ? '#000' : 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: network === n ? 600 : 400,
              textTransform: 'capitalize',
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        <StatCard label="P-Chain Height" value={loading ? '...' : height} />
        <StatCard label="Validators" value={loading ? '...' : `${connectedCount}/${validators.length}`} />
        <StatCard label="Total Stake" value={loading ? '...' : `${formatStakeAmount(totalStake.toString())} LUX`} />
        <StatCard label="Total Delegators" value={loading ? '...' : totalDelegators.toString()} />
        <StatCard
          label="Min Validator Stake"
          value={loading || !minStake ? '...' : `${formatStakeAmount(minStake.minValidatorStake)} LUX`}
        />
        <StatCard
          label="Min Delegator Stake"
          value={loading || !minStake ? '...' : `${formatStakeAmount(minStake.minDelegatorStake)} LUX`}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: '#1a0a0a',
            border: '1px solid var(--danger)',
            borderRadius: 8,
            padding: '12px 16px',
            color: 'var(--danger)',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Validator table */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Active Validators ({validators.length})
        </h2>
        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              color: 'var(--muted)',
              background: 'var(--card)',
              borderRadius: 12,
              border: '1px solid var(--border)',
            }}
          >
            Loading validators...
          </div>
        ) : (
          <ValidatorTable validators={validators} />
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--card)',
        borderRadius: 12,
        padding: '16px 20px',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
