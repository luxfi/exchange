'use client'

import { type Validator, formatStakeAmount, formatUptime } from '@/lib/platform'

interface ValidatorTableProps {
  validators: Validator[]
}

export function ValidatorTable({ validators }: ValidatorTableProps) {
  if (validators.length === 0) {
    return (
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
        No validators found
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>
              Node ID
            </th>
            <th style={{ textAlign: 'right', padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>Stake</th>
            <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>
              Uptime
            </th>
            <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>
              Status
            </th>
            <th style={{ textAlign: 'right', padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>
              Delegation Fee
            </th>
            <th style={{ textAlign: 'right', padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>
              Delegators
            </th>
          </tr>
        </thead>
        <tbody>
          {validators.map((v) => {
            const endDate = new Date(parseInt(v.endTime) * 1000)
            const isExpired = endDate < new Date()

            return (
              <tr key={v.nodeID} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>
                  {v.nodeID.slice(0, 16)}...{v.nodeID.slice(-6)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {formatStakeAmount(v.stakeAmount ?? v.weight)} LUX
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {v.uptime ? formatUptime(v.uptime) : '---'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: isExpired ? 'var(--danger)' : v.connected ? 'var(--success)' : 'var(--warning)',
                      marginRight: 6,
                    }}
                  />
                  {isExpired ? 'Expired' : v.connected ? 'Connected' : 'Disconnected'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {v.delegationFee ? `${parseFloat(v.delegationFee)}%` : '---'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {v.delegators?.length ?? 0}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
