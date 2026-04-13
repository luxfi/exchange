import { ChainId } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback, useRef, useState } from 'react'
import { useSubmitBidMutation } from 'uniswap/src/data/rest/auctions/useSubmitBidMutation'
import { TransactionStep } from 'uniswap/src/features/transactions/steps/types'
import { SetCurrentStepFn } from 'uniswap/src/features/transactions/swap/types/swapCallback'
import { validateTransactionRequest } from 'uniswap/src/features/transactions/swap/utils/trade'
import { ToucanBidTransactionInfo, TransactionType } from 'uniswap/src/features/transactions/types/transactionDetails'
import { ValidatedTransactionRequest } from 'uniswap/src/features/transactions/types/transactionRequests'
import { useWallet } from 'uniswap/src/features/wallet/hooks/useWallet'
import { isSignerMnemonicAccountDetails } from 'uniswap/src/features/wallet/types/AccountDetails'
import { isValidHexString } from 'utilities/src/addresses/hex'
import { logger } from 'utilities/src/logger/logger'
import { useEvent } from 'utilities/src/react/hooks'
import { useTrace } from 'utilities/src/telemetry/trace/TraceContext'
import { zeroAddress } from 'viem'
import { getAuctionBidBaseAnalyticsProperties } from '~/components/Toucan/Auction/analytics'
import { useAuctionStore, useAuctionStoreActions } from '~/components/Toucan/Auction/store/useAuctionStore'
import { useToucanSubmitBid } from '~/hooks/useToucanSubmitBid'

export interface PreparedBidTransaction {
  txRequest: ValidatedTransactionRequest
  info: ToucanBidTransactionInfo
  requestId: string
}

export interface SubmitBidOptions {
  preBidSteps?: TransactionStep[]
  setSteps?: (steps: TransactionStep[]) => void
  setCurrentStep?: SetCurrentStepFn
  /**
   * Optional callback to run after pre-bid steps complete but before actual bid submission.
   * Used for post-permit2 simulation to validate bid against latest clearing price.
   * If this returns false, the bid submission is aborted.
   */
  onPreBidStepsComplete?: () => Promise<boolean>
}

export interface SubmitState {
  onSubmit: (prepared?: PreparedBidTransaction, options?: SubmitBidOptions) => Promise<void>
  prepareTransaction: () => Promise<PreparedBidTransaction | undefined>
  isDisabled: boolean
  isPending: boolean
  onTransactionSubmitted?: () => void
  error?: Error
  clearError: () => void
}

interface UseBidFormSubmitParams {
  evaluateMaxPrice: (options?: { shouldAutoCorrectMin?: boolean }) => {
    sanitizedQ96?: bigint
    sanitizedDisplayValue?: string
    error?: string
  }
  exactMaxValuationAmount: string
  setExactMaxValuationAmount: (amount: string) => void
  setMaxPriceError: (error: string | undefined) => void
  budgetCurrencyAmount: CurrencyAmount<Currency> | undefined
  accountAddress: string | undefined
  auctionContractAddress: string | undefined
  chainId: number | undefined
  isNativeBidToken: boolean
  currency: string | undefined
  resetBudgetField: () => void
  resetMaxValuationField: () => void
  // Validation flags
  budgetAmountIsZero: boolean
  maxPriceAmountIsZero: boolean
  exceedsBalance: boolean
  isMaxPriceBelowMinimum: boolean
  bidTokenDecimals: number | undefined
  maxPriceQ96: bigint | undefined
  onTransactionSubmitted?: () => void
  // Analytics parameters
  budgetAmountUsd?: number
  maxFdvUsd?: number
  pricePerToken?: number
  expectedReceiveAmount?: number
  minExpectedReceiveAmount?: number
  maxReceivableAmount?: number
  auctionTokenSymbol?: string
  auctionTokenName?: string
}

interface UseBidFormSubmitResult {
  submitState: SubmitState
}

export function useBidFormSubmit({
  evaluateMaxPrice,
  exactMaxValuationAmount,
  setExactMaxValuationAmount,
  setMaxPriceError,
  budgetCurrencyAmount,
  accountAddress,
  auctionContractAddress,
  chainId,
  isNativeBidToken,
  currency,
  resetBudgetField,
  resetMaxValuationField,
  budgetAmountIsZero,
  maxPriceAmountIsZero,
  exceedsBalance,
  isMaxPriceBelowMinimum,
  bidTokenDecimals,
  maxPriceQ96,
  onTransactionSubmitted,
  budgetAmountUsd,
  maxFdvUsd,
  pricePerToken,
          name: 'Uniswap CCA',
          icon: 'https://protocol-icons.s3.amazonaws.com/icons/uniswap-v4.jpg',
        },
      }

      const preparedBid: PreparedBidTransaction = {
        txRequest,
        info,
        requestId,
      }

      preparedBidRef.current = { signature, data: preparedBid }
      return preparedBid
    } catch (error) {
      handleBidSubmitFailure(error instanceof Error ? error : new Error('Failed to submit bid'))
      return undefined
    }
  })

  const handleSubmit = useEvent(async (prepared?: PreparedBidTransaction, options?: SubmitBidOptions) => {
    // Clear any previous errors when starting a new submission
    setSubmissionError(undefined)

    const preparedBid = prepared ?? (await prepareTransaction())

    if (!preparedBid) {
      return undefined
    }

    if (!evmAccount || !isSignerMnemonicAccountDetails(evmAccount)) {
      handleBidSubmitFailure(new Error('Wallet is not connected with a signer account'))
      return undefined
    }

    if (!chainId) {
      handleBidSubmitFailure(new Error('Missing chain ID for Toucan bid submission'))
      return undefined
    }

    const analytics = getAuctionBidBaseAnalyticsProperties({
      trace,
      chainId,
      info: preparedBid.info,
      bidTokenAmountUsd: budgetAmountUsd,
      maxFdvUsd,
      pricePerToken,
      minExpectedReceiveAmount,
      maxReceivableAmount,
      tokenSymbol: auctionTokenSymbol,
      tokenName: auctionTokenName,
    })

    // Return a promise that resolves/rejects when the saga completes
    // This allows callers to await the full submission flow
    return new Promise<void>((resolve, reject) => {
      toucanSubmitBid({
        account: evmAccount,
        chainId,
        txRequest: preparedBid.txRequest,
        info: preparedBid.info,
        setCurrentStep: options?.setCurrentStep ?? setCurrentTransactionStep,
        setSteps: options?.setSteps,
        preBidSteps: options?.preBidSteps,
        analytics,
        onPreBidStepsComplete: options?.onPreBidStepsComplete,
        onSuccess: (hash: string) => {
          handleBidSubmitSuccess(hash)
          resolve()
        },
        onFailure: (error: Error) => {
          handleBidSubmitFailure(error)
          reject(error)
        },
      })
    })
  })

  const isSubmitDisabled =
    !chainId ||
    !auctionContractAddress ||
    !accountAddress ||
    bidTokenDecimals === undefined ||
    budgetAmountIsZero ||
    maxPriceAmountIsZero ||
    exceedsBalance ||
    isMaxPriceBelowMinimum ||
    submitBidMutation.isPending ||
    !maxPriceQ96

  return {
    submitState: {
      onSubmit: handleSubmit,
      prepareTransaction,
      isDisabled: isSubmitDisabled,
      isPending: submitBidMutation.isPending,
      onTransactionSubmitted,
      error: submissionError,
      clearError: () => setSubmissionError(undefined),
    },
  }
}
