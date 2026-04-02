import { useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { brand } from '~/config/brand'
import { useCrossChainMint } from '@luxfi/exchange/src/bridge'
import type { CrossChainMintStatus } from '@luxfi/exchange/src/bridge'

/** Supported chains for the bridge UI */
const CHAINS = [
  { id: 'c-chain', label: 'C-Chain' },
  { id: 'x-chain', label: 'X-Chain' },
  { id: 'zoo', label: 'Zoo' },
  { id: 'hanzo', label: 'Hanzo' },
  { id: 'spc', label: 'SPC' },
  { id: 'pars', label: 'Pars' },
] as const

const STATUS_LABELS: Record<CrossChainMintStatus, string> = {
  idle: 'Ready',
  initiating: 'Initiating...',
  locking: 'Locking assets...',
  waiting_confirmation: 'Waiting for confirmation...',
  minting: 'Minting on destination...',
  swapping: 'Swapping tokens...',
  complete: 'Transfer complete',
  failed: 'Transfer failed',
  cancelled: 'Transfer cancelled',
}

/** Inline styles -- dark theme, matches the exchange aesthetic */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '40px 16px',
    minHeight: '60vh',
    gap: 24,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
  },
  select: {
    flex: 1,
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  },
  input: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  arrow: {
    display: 'flex',
    justifyContent: 'center' as const,
    padding: '4px 0',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.4)',
    userSelect: 'none' as const,
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  statusBar: {
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: 13,
    textAlign: 'center' as const,
  },
  link: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center' as const,
    textDecoration: 'none',
  },
  activeMint: {
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
} as const

function getStatusColor(status: CrossChainMintStatus): string {
  switch (status) {
    case 'complete':
      return 'rgba(34, 197, 94, 0.15)'
    case 'failed':
    case 'cancelled':
      return 'rgba(239, 68, 68, 0.15)'
    case 'idle':
      return 'transparent'
    default:
      return 'rgba(234, 179, 8, 0.15)'
  }
}

function getStatusTextColor(status: CrossChainMintStatus): string {
  switch (status) {
    case 'complete':
      return '#22c55e'
    case 'failed':
    case 'cancelled':
      return '#ef4444'
    case 'idle':
      return 'rgba(255, 255, 255, 0.6)'
    default:
      return '#eab308'
  }
}

export default function Bridge() {
  const { address, isConnected } = useAccount()
  const { mint, activeMints, isLoading, error } = useCrossChainMint()

  const [sourceChain, setSourceChain] = useState('x-chain')
  const [destChain, setDestChain] = useState('c-chain')
  const [amount, setAmount] = useState('')
  const [lastStatus, setLastStatus] = useState<CrossChainMintStatus>('idle')

  const primaryColor = brand.primaryColor
  const fullBridgeUrl = brand.url.includes('lux')
    ? 'https://bridge.lux.network'
    : `${brand.url}/bridge`

  const canBridge = useMemo(() => {
    return isConnected && amount !== '' && parseFloat(amount) > 0 && sourceChain !== destChain
  }, [isConnected, amount, sourceChain, destChain])

  const handleBridge = useCallback(async () => {
    if (!address || !canBridge) return

    try {
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e6))
      setLastStatus('initiating')

      await mint({
        sourceAsset: '0x0000000000000000000000000000000000000000000000000000000000000001',
        amount: amountBigInt,
        recipient: address,
      })

      setLastStatus('complete')
      setAmount('')
    } catch {
      setLastStatus('failed')
    }
  }, [address, amount, canBridge, mint])

  const activeList = useMemo(() => {
    return Object.entries(activeMints).map(([id, entry]) => ({
      id,
      status: entry.state.status,
    }))
  }, [activeMints])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div>
          <h2 style={styles.title}>Bridge</h2>
          <p style={styles.subtitle}>Transfer tokens across {brand.networkName} chains</p>
        </div>

        {/* Source chain */}
        <div>
          <div style={styles.label}>From</div>
          <select
            style={styles.select}
            value={sourceChain}
            onChange={(e) => setSourceChain(e.target.value)}
          >
            {CHAINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.arrow}>&#8595;</div>

        {/* Destination chain */}
        <div>
          <div style={styles.label}>To</div>
          <select
            style={styles.select}
            value={destChain}
            onChange={(e) => setDestChain(e.target.value)}
          >
            {CHAINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <div style={styles.label}>Amount</div>
          <input
            style={styles.input}
            type="number"
            min="0"
            step="any"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Status */}
        {lastStatus !== 'idle' && (
          <div
            style={{
              ...styles.statusBar,
              background: getStatusColor(lastStatus),
              color: getStatusTextColor(lastStatus),
            }}
          >
            {STATUS_LABELS[lastStatus]}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              ...styles.statusBar,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
            }}
          >
            {error}
          </div>
        )}

        {/* Bridge button */}
        <button
          style={{
            ...styles.button,
            background: canBridge ? primaryColor : 'rgba(255, 255, 255, 0.1)',
            color: canBridge ? '#fff' : 'rgba(255, 255, 255, 0.3)',
            cursor: canBridge && !isLoading ? 'pointer' : 'not-allowed',
            opacity: isLoading ? 0.6 : 1,
          }}
          onClick={handleBridge}
          disabled={!canBridge || isLoading}
        >
          {!isConnected
            ? 'Connect wallet'
            : isLoading
              ? 'Bridging...'
              : sourceChain === destChain
                ? 'Select different chains'
                : !amount || parseFloat(amount) <= 0
                  ? 'Enter an amount'
                  : 'Bridge'}
        </button>

        {/* Active transfers */}
        {activeList.length > 0 && (
          <div>
            <div style={styles.label}>Active transfers</div>
            {activeList.map((m) => (
              <div key={m.id} style={styles.activeMint}>
                {m.id.slice(0, 10)}... &mdash; {STATUS_LABELS[m.status]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link to full bridge */}
      <a
        href={fullBridgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        Need more options? Use the full-featured bridge &rarr;
      </a>
    </div>
  )
}
