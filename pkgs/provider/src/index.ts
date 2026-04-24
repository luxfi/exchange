// Jurisdiction-neutral Regulated Provider client.
//
// A Lux exchange fork reads its provider address from config and uses this
// client to ask whether a symbol is regulated, onboard traders, quote,
// and route swaps. If no provider is wired, every call returns the
// "not handled / native only" path.

import type {
  Address,
  Hex,
  PublicClient,
  WalletClient,
} from 'viem'

export enum Side {
  Buy = 0,
  Sell = 1,
}

export interface ProviderConfig {
  /** Address of the IRegulatedProvider adapter. `null` = pure DeFi mode. */
  adapter: Address | null
  /** Address of the Lux `ProviderRouter` wrapping the adapter. */
  router: Address
}

export interface TraderEligibility {
  ok: boolean
  reasonCode: number
}

const providerAbi = [
  {
    type: 'function',
    name: 'handles',
    stateMutability: 'view',
    inputs: [{ name: 'symbol', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'isEligible',
    stateMutability: 'view',
    inputs: [
      { name: 'trader', type: 'address' },
      { name: 'symbol', type: 'string' },
    ],
    outputs: [
      { name: 'ok', type: 'bool' },
      { name: 'reasonCode', type: 'uint8' },
    ],
  },
  {
    type: 'function',
    name: 'bestPrice',
    stateMutability: 'view',
    inputs: [
      { name: 'symbol', type: 'string' },
      { name: 'side', type: 'uint8' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'onboard',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'trader', type: 'address' },
      { name: 'attestation', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'routedSwap',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'trader', type: 'address' },
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minOut', type: 'uint256' },
      { name: 'symbol', type: 'string' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
] as const

export class RegulatedProviderClient {
  constructor(
    private readonly config: ProviderConfig,
    private readonly pub: PublicClient,
  ) {}

  enabled(): boolean {
    return this.config.adapter !== null
  }

  async handles(symbol: string): Promise<boolean> {
    if (!this.config.adapter) return false
    return this.pub.readContract({
      address: this.config.adapter,
      abi: providerAbi,
      functionName: 'handles',
      args: [symbol],
    }) as Promise<boolean>
  }

  async isEligible(trader: Address, symbol: string): Promise<TraderEligibility> {
    if (!this.config.adapter) return { ok: false, reasonCode: 255 }
    const [ok, reasonCode] = (await this.pub.readContract({
      address: this.config.adapter,
      abi: providerAbi,
      functionName: 'isEligible',
      args: [trader, symbol],
    })) as [boolean, number]
    return { ok, reasonCode }
  }

  async bestPrice(symbol: string, side: Side): Promise<bigint> {
    if (!this.config.adapter) return 0n
    return this.pub.readContract({
      address: this.config.adapter,
      abi: providerAbi,
      functionName: 'bestPrice',
      args: [symbol, side],
    }) as Promise<bigint>
  }

  async onboard(wallet: WalletClient, trader: Address, attestation: Hex): Promise<Hex> {
    if (!this.config.adapter) throw new Error('provider disabled')
    return wallet.writeContract({
      chain: null,
      account: wallet.account!,
      address: this.config.adapter,
      abi: providerAbi,
      functionName: 'onboard',
      args: [trader, attestation],
    })
  }

  async routedSwap(
    wallet: WalletClient,
    trader: Address,
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint,
    minOut: bigint,
    symbol: string,
  ): Promise<Hex> {
    if (!this.config.adapter) throw new Error('provider disabled')
    return wallet.writeContract({
      chain: null,
      account: wallet.account!,
      address: this.config.adapter,
      abi: providerAbi,
      functionName: 'routedSwap',
      args: [trader, tokenIn, tokenOut, amountIn, minOut, symbol],
    })
  }
}

/** Reason-code → human message. Mirrors ERC-1404 conventions. */
export function decodeReason(code: number): string {
  switch (code) {
    case 0: return 'ok'
    case 6: return 'jurisdiction blocked'
    case 7: return 'accreditation required'
    case 16:
    case 17: return 'not whitelisted'
    case 18: return 'lockup active'
    case 19:
    case 20:
    case 21:
    case 22: return 'jurisdiction blocked'
    case 32: return 'max holders reached'
    case 33: return 'transfer limit exceeded'
    case 255: return 'provider disabled'
    default: return `restriction ${code}`
  }
}
