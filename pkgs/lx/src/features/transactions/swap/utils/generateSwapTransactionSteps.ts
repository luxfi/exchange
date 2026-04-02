import { createApprovalTransactionStep } from 'lx/src/features/transactions/steps/approve'
import { createPermit2SignatureStep } from 'lx/src/features/transactions/steps/permit2Signature'
import { createPermit2TransactionStep } from 'lx/src/features/transactions/steps/permit2Transaction'
import { createRevocationTransactionStep } from 'lx/src/features/transactions/steps/revoke'
import { TransactionStep } from 'lx/src/features/transactions/steps/types'
import { orderClassicSwapSteps } from 'lx/src/features/transactions/swap/steps/classicSteps'
import { createSignLxSwapOrderStep } from 'lx/src/features/transactions/swap/steps/signOrder'
import {
  createSwapTransactionAsyncStep,
  createSwapTransactionStep,
  createSwapTransactionStepBatched,
} from 'lx/src/features/transactions/swap/steps/swap'
import { orderLXSteps } from 'lx/src/features/transactions/swap/steps/lxSteps'
import { isValidSwapTxContext, SwapTxAndGasInfo } from 'lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { isBridge, isClassic, isLxSwap } from 'lx/src/features/transactions/swap/utils/routing'

export function generateSwapTransactionSteps(txContext: SwapTxAndGasInfo): TransactionStep[] {
  const isValidSwap = isValidSwapTxContext(txContext)

  if (isValidSwap) {
    const { trade, approveTxRequest, revocationTxRequest } = txContext

    const requestFields = {
      tokenAddress: trade.inputAmount.currency.wrapped.address,
      chainId: trade.inputAmount.currency.chainId,
    }
    const revocation = createRevocationTransactionStep({
      ...requestFields,
      txRequest: revocationTxRequest,
    })
    const approval = createApprovalTransactionStep({
      ...requestFields,
      txRequest: approveTxRequest,
      amount: trade.inputAmount.quotient.toString(),
    })

    if (isClassic(txContext)) {
      const { swapRequestArgs } = txContext

      if (txContext.unsigned) {
        return orderClassicSwapSteps({
          revocation,
          approval,
          permit: createPermit2SignatureStep(txContext.permit.typedData),
          swap: createSwapTransactionAsyncStep(swapRequestArgs),
        })
      }
      if (txContext.txRequests.length > 1) {
        return orderClassicSwapSteps({
          permit: undefined,
          swap: createSwapTransactionStepBatched(txContext.txRequests),
        })
      }

      const permit = txContext.permit
        ? createPermit2TransactionStep({
            txRequest: txContext.permit.txRequest,
            amountIn: trade.inputAmount,
          })
        : undefined

      return orderClassicSwapSteps({
        revocation,
        approval,
        permit,
        swap: createSwapTransactionStep(txContext.txRequests[0]),
      })
    } else if (isLxSwap(txContext)) {
      return orderLXSteps({
        revocation,
        approval,
        signOrder: createSignLxSwapOrderStep(txContext.permit.typedData, txContext.trade.quote.quote),
      })
    } else if (isBridge(txContext)) {
      if (txContext.txRequests.length > 1) {
        return orderClassicSwapSteps({
          permit: undefined,
          swap: createSwapTransactionStepBatched(txContext.txRequests),
        })
      }
      return orderClassicSwapSteps({
        revocation,
        approval,
        permit: undefined,
        swap: createSwapTransactionStep(txContext.txRequests[0]),
      })
    }
  }

  return []
}
