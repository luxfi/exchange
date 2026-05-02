import { useReadContract } from 'wagmi'
import { assume0xAddress } from '~/utils/wagmi'

/**
 * Minimal ABI for ERC-3643 detection.
 *
 * ERC-3643 (T-REX) tokens always expose three getters that plain ERC-20s do not:
 * - `identityRegistry()` — address of the on-chain identity registry (KYC)
 * - `compliance()` — address of the compliance module (transfer rules)
 * - `canTransfer(from, to, amount)` — pre-flight check returning bool
 *
 * We read `identityRegistry()`. A non-zero return is the de-facto signal.
 */
const ERC3643_DETECT_ABI = [
  {
    name: 'identityRegistry',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const

const ERC3643_PRECHECK_ABI = [
  {
    name: 'canTransfer',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Returns whether a token at `address` on `chainId` is an ERC-3643 (T-REX)
 * permissioned security token.
 *
 * Detection method: call `identityRegistry()` — only ERC-3643 tokens expose it.
 * If the call reverts (plain ERC-20), wagmi marks isError=true and we return false.
 */
export function useIs3643({
  address,
  chainId,
}: {
  address?: string
  chainId?: number
}): { is3643: boolean; identityRegistry?: `0x${string}`; isLoading: boolean } {
  const { data, isLoading } = useReadContract({
    address: address ? assume0xAddress(address) : undefined,
    chainId,
    abi: ERC3643_DETECT_ABI,
    functionName: 'identityRegistry',
    query: { enabled: Boolean(address && chainId), retry: false, staleTime: 60_000 },
  })

  const identityRegistry = data as `0x${string}` | undefined
  const is3643 = Boolean(identityRegistry && identityRegistry !== ZERO_ADDRESS)
  return { is3643, identityRegistry, isLoading }
}

/**
 * Returns the result of an ERC-3643 `canTransfer(from, to, amount)` precheck.
 *
 * `allowed === false` means the swap will be rejected by the compliance module
 * (typically because either party is not KYC-verified). UI should surface a
 * "verify identity" CTA pointing at the brand's IAM.
 *
 * If `enabled` is false (e.g. token isn't 3643 or any arg missing) we return
 * `{ allowed: undefined }` so callers don't gate on it.
 */
export function use3643TransferCheck({
  token,
  chainId,
  from,
  to,
  amount,
  enabled = true,
}: {
  token?: string
  chainId?: number
  from?: string
  to?: string
  amount?: bigint
  enabled?: boolean
}): { allowed: boolean | undefined; isLoading: boolean } {
  const { data, isLoading } = useReadContract({
    address: token ? assume0xAddress(token) : undefined,
    chainId,
    abi: ERC3643_PRECHECK_ABI,
    functionName: 'canTransfer',
    args:
      from && to && amount !== undefined
        ? [assume0xAddress(from), assume0xAddress(to), amount]
        : undefined,
    query: {
      enabled: Boolean(enabled && token && chainId && from && to && amount !== undefined),
      retry: false,
      staleTime: 10_000,
    },
  })
  return { allowed: data as boolean | undefined, isLoading }
}
