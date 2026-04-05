<<<<<<< HEAD
import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { useNativeCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
=======
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useNativeCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
>>>>>>> upstream/main
import { useFormattedGasFee } from '~/components/Toucan/Auction/hooks/useFormattedGasFee'
import {
  PreparedWithdrawBidAndClaimTokensTransaction,
  WithdrawBidAndClaimTokensSubmitState,
} from '~/components/Toucan/Auction/hooks/useWithdrawBidAndClaimTokensFormSubmit'
import { useTransactionGasFee } from '~/hooks/useTransactionGasFee'

interface UseWithdrawBidAndClaimTokensReviewDataParams {
  isOpen: boolean
  submitState: WithdrawBidAndClaimTokensSubmitState
  auctionChainId: number | undefined
}

interface WithdrawBidAndClaimTokensReviewData {
  preparedWithdrawBidAndClaimTokens: PreparedWithdrawBidAndClaimTokensTransaction | undefined
  isPreparing: boolean
  preparationError: Error | undefined
  gasFeeCurrencyAmount: CurrencyAmount<Currency> | undefined
  formattedGasFee: string | undefined
  isGasFree: boolean
  isConfirmDisabled: boolean
  retryPreparation: () => void
}

export function useWithdrawBidAndClaimTokensReviewData({
  isOpen,
  submitState,
  auctionChainId,
}: UseWithdrawBidAndClaimTokensReviewDataParams): WithdrawBidAndClaimTokensReviewData {
  const [preparedWithdrawBidAndClaimTokens, setPreparedWithdrawBidAndClaimTokens] = useState<
    PreparedWithdrawBidAndClaimTokensTransaction | undefined
  >()
  const [isPreparing, setIsPreparing] = useState(false)
  const [preparationError, setPreparationError] = useState<Error | undefined>()
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Validate chainId is present
  const normalizedChainId = useMemo(() => {
    if (!auctionChainId) {
      return undefined
    }
    return auctionChainId as UniverseChainId
  }, [auctionChainId])

  // Fallback to mainnet for hook call since hooks can't be conditional
  const nativeCurrencyInfo = useNativeCurrencyInfo(normalizedChainId ?? UniverseChainId.Mainnet)

  // Clear state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPreparedWithdrawBidAndClaimTokens(undefined)
      setPreparationError(undefined)
      setIsPreparing(false)
    }
  }, [isOpen])

  // Prepare transaction when modal opens
<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: retryTrigger is intentionally included, submitState excluded
=======
  // oxlint-disable-next-line react/exhaustive-deps -- retryTrigger is intentionally included, submitState excluded
>>>>>>> upstream/main
  useEffect(() => {
    let cancelled = false

    if (!isOpen || submitState.isDisabled) {
      return () => {
        cancelled = true
      }
    }

    setIsPreparing(true)

    ;(async () => {
      try {
        const result = await submitState.prepareTransaction()
<<<<<<< HEAD
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
        // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
        if (!cancelled) {
          if (!result) {
            setPreparedWithdrawBidAndClaimTokens(undefined)
            setPreparationError(new Error('Failed to prepare withdraw and claim'))
          } else {
            setPreparedWithdrawBidAndClaimTokens(result)
            setPreparationError(undefined)
          }
        }
      } catch (error) {
<<<<<<< HEAD
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
        // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
        if (!cancelled) {
          setPreparedWithdrawBidAndClaimTokens(undefined)
          setPreparationError(error instanceof Error ? error : new Error('Failed to prepare withdraw and claim'))
        }
      } finally {
<<<<<<< HEAD
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
        // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
        if (!cancelled) {
          setIsPreparing(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
<<<<<<< HEAD
=======
    // oxlint-disable-next-line react/exhaustive-deps -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
  }, [isOpen, retryTrigger])

  // Calculate gas fee
  const gasFee = useTransactionGasFee(preparedWithdrawBidAndClaimTokens?.txRequest)
  const gasFeeCurrencyAmount = useMemo(() => {
    if (!preparedWithdrawBidAndClaimTokens || !gasFee.value || !nativeCurrencyInfo?.currency || !normalizedChainId) {
      return undefined
    }
    return CurrencyAmount.fromRawAmount(nativeCurrencyInfo.currency, gasFee.value)
  }, [gasFee.value, nativeCurrencyInfo?.currency, normalizedChainId, preparedWithdrawBidAndClaimTokens])

  const { formattedGasFee } = useFormattedGasFee({ gasFeeCurrencyAmount })

  const isGasFree = !gasFee.value || gasFee.value === '0'

  const retryPreparation = useCallback(() => {
    setPreparationError(undefined)
    setRetryTrigger((prev) => prev + 1)
  }, [])

  const isConfirmDisabled =
    !normalizedChainId ||
    submitState.isDisabled ||
    !preparedWithdrawBidAndClaimTokens ||
    isPreparing ||
    submitState.isPending ||
    Boolean(preparationError)

  return {
    preparedWithdrawBidAndClaimTokens,
    isPreparing,
    preparationError,
    gasFeeCurrencyAmount,
    formattedGasFee,
    isGasFree,
    isConfirmDisabled,
    retryPreparation,
  }
}
