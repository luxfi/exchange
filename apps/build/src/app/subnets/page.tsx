'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { getBlockchains, type Network } from '@/lib/platform'

interface Blockchain {
  id: string
  name: string
  subnetID: string
  vmID: string
}

export default function SubnetsPage() {
  const [network, setNetwork] = useState<Network>('mainnet')
  const [blockchains, setBlockchains] = useState<Blockchain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getBlockchains(network)
      .then((bc: Blockchain[]) => setBlockchains(bc))
      .catch(() => setBlockchains([]))
      .finally(() => setLoading(false))
  }, [network])

  // Group by subnet
  const subnets = blockchains.reduce(
    (acc, bc) => {
      if (!acc[bc.subnetID]) acc[bc.subnetID] = []
      acc[bc.subnetID].push(bc)
      return acc
    },
    {} as Record<string, Blockchain[]>,
  )

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Subnets &amp; Chains</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
          View all subnets and blockchains registered on the Lux network.
        </p>

        {/* Network selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Object.entries(subnets).map(([subnetID, chains]) => (
              <div
                key={subnetID}
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {subnetID === '11111111111111111111111111111111LpoYY' ? 'Primary Network' : 'Subnet'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 2 }}>
                      {subnetID.slice(0, 20)}...
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '4px 10px',
                      background: 'var(--background)',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {chains.length} chain{chains.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  {chains.map((chain) => (
                    <div
                      key={chain.id}
                      style={{
                        padding: '12px 20px',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500 }}>{chain.name}</div>
                        <div style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 11, marginTop: 2 }}>
                          {chain.id}
                        </div>
                      </div>
                      <div style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 11 }}>
                        VM: {chain.vmID.slice(0, 12)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
