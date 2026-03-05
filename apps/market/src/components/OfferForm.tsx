'use client'

import { useState } from 'react'
import { parseEther, type Address } from 'viem'
import { useWriteContract, useChainId } from 'wagmi'
import { CONTRACTS, MARKET_ABI } from '@/lib/contracts'

interface OfferFormProps {
  contractAddress: Address
  tokenId: string
}

export function OfferForm({ contractAddress, tokenId }: OfferFormProps) {
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('3')
  const chainId = useChainId()
  const { writeContract, isPending } = useWriteContract()

  const contracts = CONTRACTS[chainId]
  if (!contracts) return null

  const handleOffer = () => {
    if (!amount) return
    const durationSeconds = BigInt(Number(duration) * 86400)

    writeContract({
      address: contracts.markets,
      abi: MARKET_ABI,
      functionName: 'makeOffer',
      args: [
        contractAddress,
        BigInt(tokenId),
        '0x0000000000000000000000000000000000000000' as Address,
        parseEther(amount),
        durationSeconds,
      ],
      value: parseEther(amount),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600 }}>Make an Offer</h3>
      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
          Offer Amount (LUX)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--foreground)',
            fontSize: 16,
            outline: 'none',
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Expires in</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--foreground)',
            fontSize: 14,
          }}
        >
          <option value="1">1 day</option>
          <option value="3">3 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
        </select>
      </div>
      <button
        onClick={handleOffer}
        disabled={isPending || !amount}
        style={{
          width: '100%',
          padding: '12px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: 8,
          color: '#000',
          fontWeight: 600,
          cursor: isPending ? 'wait' : 'pointer',
          fontSize: 14,
        }}
      >
        {isPending ? 'Submitting...' : 'Make Offer'}
      </button>
    </div>
  )
}
