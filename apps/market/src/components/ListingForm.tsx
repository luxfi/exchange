'use client'

import { useState } from 'react'
import { parseEther, type Address } from 'viem'
import { useWriteContract, useAccount, useChainId } from 'wagmi'
import { CONTRACTS, MARKET_ABI, ERC721_ABI } from '@/lib/contracts'

interface ListingFormProps {
  contractAddress: Address
  tokenId: string
}

export function ListingForm({ contractAddress, tokenId }: ListingFormProps) {
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('7') // days
  const chainId = useChainId()
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract()

  const contracts = CONTRACTS[chainId]
  if (!contracts) return null

  const handleApproveAndList = async () => {
    if (!address || !price) return

    // First approve the Market contract
    writeContract({
      address: contractAddress,
      abi: ERC721_ABI,
      functionName: 'approve',
      args: [contracts.markets, BigInt(tokenId)],
    })
  }

  const handleList = () => {
    if (!price) return
    const durationSeconds = BigInt(Number(duration) * 86400)

    writeContract({
      address: contracts.markets,
      abi: MARKET_ABI,
      functionName: 'list',
      args: [
        contractAddress,
        BigInt(tokenId),
        '0x0000000000000000000000000000000000000000' as Address, // native LUX
        parseEther(price),
        durationSeconds,
      ],
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600 }}>List for Sale</h3>
      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Price (LUX)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
        <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
          Duration (days)
        </label>
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
          <option value="30">30 days</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleApproveAndList}
          disabled={isPending || !price}
          style={{
            flex: 1,
            padding: '12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--foreground)',
            cursor: isPending ? 'wait' : 'pointer',
            fontSize: 14,
          }}
        >
          Approve
        </button>
        <button
          onClick={handleList}
          disabled={isPending || !price}
          style={{
            flex: 1,
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
          {isPending ? 'Listing...' : 'List NFT'}
        </button>
      </div>
    </div>
  )
}
