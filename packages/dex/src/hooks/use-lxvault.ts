/**
 * LXVault Hooks (LP-9030)
 * React hooks for custody, margin, and positions via LXVault precompile
 */
import { useCallback } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import type { Address } from 'viem'
import { LX } from '../precompile/addresses'
import { LX_VAULT_ABI } from '../precompile/abis'
import type { LXAccount, LXPosition, LXMarginInfo } from '../precompile/types'

/**
 * Build account tuple from address and subaccount
 */
function buildAccount(main: Address, subaccountId: number = 0): LXAccount {
  return { main, subaccountId }
}

/**
 * Hook to get token balance in vault
 */
export function useLXVaultBalance(token: Address, subaccountId: number = 0) {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getBalance',
    args: address ? [buildAccount(address, subaccountId), token] : undefined,
    query: { enabled: !!address },
  })

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get position for a market
 */
export function useLXVaultPosition(marketId: number, subaccountId: number = 0) {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getPosition',
    args: address ? [buildAccount(address, subaccountId), marketId] : undefined,
    query: { enabled: !!address },
  })

  return {
    position: data as LXPosition | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get margin info (free margin, used margin, etc.)
 */
export function useLXVaultMargin(subaccountId: number = 0) {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getMargin',
    args: address ? [buildAccount(address, subaccountId)] : undefined,
    query: { enabled: !!address },
  })

  return {
    margin: data as LXMarginInfo | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to check if account is liquidatable
 */
export function useLXVaultLiquidatable(account?: Address, subaccountId: number = 0) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = account ?? connectedAddress

  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'isLiquidatable',
    args: targetAddress ? [buildAccount(targetAddress, subaccountId)] : undefined,
    query: { enabled: !!targetAddress },
  })

  const result = data as [boolean, bigint] | undefined

  return {
    liquidatable: result?.[0],
    shortfall: result?.[1],
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get funding rate for a market
 */
export function useLXVaultFundingRate(marketId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getFundingRate',
    args: [marketId],
  })

  const result = data as [bigint, bigint] | undefined

  return {
    rateX18: result?.[0],
    nextFundingTime: result?.[1],
    isLoading,
    error,
    refetch,
  }
}

interface UseLXVaultDepositResult {
  deposit: (token: Address, amount: bigint, subaccountId?: number) => void
  hash: `0x${string}` | undefined
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
}

/**
 * Hook for depositing tokens into vault
 */
export function useLXVaultDeposit(): UseLXVaultDepositResult {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const deposit = useCallback(
    (token: Address, amount: bigint, subaccountId: number = 0) => {
      writeContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'deposit',
        args: [token, amount, subaccountId],
      })
    },
    [writeContract]
  )

  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

interface UseLXVaultWithdrawResult {
  withdraw: (token: Address, amount: bigint, subaccountId?: number) => void
  hash: `0x${string}` | undefined
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
}

/**
 * Hook for withdrawing tokens from vault
 */
export function useLXVaultWithdraw(): UseLXVaultWithdrawResult {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const withdraw = useCallback(
    (token: Address, amount: bigint, subaccountId: number = 0) => {
      writeContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'withdraw',
        args: [token, amount, subaccountId],
      })
    },
    [writeContract]
  )

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

interface UseLXVaultTransferResult {
  transfer: (token: Address, amount: bigint, fromSubaccount: number, toSubaccount: number) => void
  hash: `0x${string}` | undefined
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
}

/**
 * Hook for transferring between subaccounts
 */
export function useLXVaultTransfer(): UseLXVaultTransferResult {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const transfer = useCallback(
    (
      token: Address,
      amount: bigint,
      fromSubaccount: number,
      toSubaccount: number
    ) => {
      writeContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'transfer',
        args: [token, amount, fromSubaccount, toSubaccount],
      })
    },
    [writeContract]
  )

  return {
    transfer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

interface UseLXVaultLiquidateResult {
  liquidate: (targetAccount: Address, targetSubaccount: number, marketId: number, sizeX18: bigint) => void
  hash: `0x${string}` | undefined
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
}

/**
 * Hook for liquidating underwater positions
 */
export function useLXVaultLiquidate(): UseLXVaultLiquidateResult {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const liquidate = useCallback(
    (
      targetAccount: Address,
      targetSubaccount: number,
      marketId: number,
      sizeX18: bigint
    ) => {
      writeContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'liquidate',
        args: [buildAccount(targetAccount, targetSubaccount), marketId, sizeX18],
      })
    },
    [writeContract]
  )

  return {
    liquidate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Combined hook for common vault operations
 */
export function useLXVault(subaccountId: number = 0) {
  const { address } = useAccount()
  const margin = useLXVaultMargin(subaccountId)
  const { deposit, isPending: isDepositing } = useLXVaultDeposit()
  const { withdraw, isPending: isWithdrawing } = useLXVaultWithdraw()
  const { transfer, isPending: isTransferring } = useLXVaultTransfer()

  return {
    address,
    subaccountId,
    margin: margin.margin,
    isLoadingMargin: margin.isLoading,
    deposit,
    withdraw,
    transfer,
    isDepositing,
    isWithdrawing,
    isTransferring,
    refetchMargin: margin.refetch,
  }
}
