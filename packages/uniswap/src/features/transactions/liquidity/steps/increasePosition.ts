import {
  CreateLPPositionRequest,
  IncreaseLPPositionRequest,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import {
  V2CreateLPPosition,
  V3CreateLPPosition,
  V4CreateLPPosition,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import {
  CreatePositionRequest,
  IncreasePositionRequest,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import {
  V1LiquidityServiceClient,
  V2LiquidityServiceClient,
} from 'uniswap/src/data/apiClients/liquidityService/LiquidityServiceClient'
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { parseErrorMessageTitle } from 'uniswap/src/features/transactions/liquidity/utils'
import {
  OnChainTransactionFields,
  OnChainTransactionFieldsBatched,
  TransactionStepType,
} from 'uniswap/src/features/transactions/steps/types'
import { validateTransactionRequest } from 'uniswap/src/features/transactions/swap/utils/trade'
import { ValidatedTransactionRequest } from 'uniswap/src/features/transactions/types/transactionRequests'
import { logger } from 'utilities/src/logger/logger'

export interface IncreasePositionTransactionStep extends OnChainTransactionFields {
  // Doesn't require permit
  type: TransactionStepType.IncreasePositionTransaction
}

export interface IncreasePositionTransactionStepAsync {
  // Requires permit
  type: TransactionStepType.IncreasePositionTransactionAsync
  getTxRequest(signature: string): Promise<{ txRequest: ValidatedTransactionRequest | undefined }>
}

export interface IncreasePositionTransactionStepBatched extends OnChainTransactionFieldsBatched {
  type: TransactionStepType.IncreasePositionTransactionBatched
}

export function createIncreasePositionStep(txRequest: ValidatedTransactionRequest): IncreasePositionTransactionStep {
  return {
    type: TransactionStepType.IncreasePositionTransaction,
    txRequest,
  }
}

export function createCreatePositionAsyncStep(
  createPositionRequestArgs: CreateLPPositionRequest | CreatePositionRequest | undefined,
  delegatedAddress?: string | null,
): IncreasePositionTransactionStepAsync {
  return {
    type: TransactionStepType.IncreasePositionTransactionAsync,
    getTxRequest: async (signature: string): Promise<{ txRequest: ValidatedTransactionRequest | undefined }> => {
      if (!createPositionRequestArgs) {
        return { txRequest: undefined }
      }

      try {
        if (createPositionRequestArgs instanceof CreatePositionRequest) {
          const updatedRequest = new CreatePositionRequest({
            ...createPositionRequestArgs,
            signature,
            simulateTransaction: true,
          })
          const result = await V2LiquidityServiceClient.createPosition(updatedRequest)
          return { txRequest: validateTransactionRequest(result.create) }
        }

        const { createLpPosition } = createPositionRequestArgs
        let updatedCreateLpPosition

        if (createLpPosition.case === 'v4CreateLpPosition') {
          updatedCreateLpPosition = {
            case: 'v4CreateLpPosition' as const,
            value: new V4CreateLPPosition({
              ...createLpPosition.value,
              signature,
              simulateTransaction: true,
            }),
          }
        } else if (createLpPosition.case === 'v3CreateLpPosition') {
          updatedCreateLpPosition = {
            case: 'v3CreateLpPosition' as const,
            value: new V3CreateLPPosition({
              ...createLpPosition.value,
              signature,
              simulateTransaction: true,
            }),
          }
        } else if (createLpPosition.case === 'v2CreateLpPosition') {
          // V2 does not support signatures, only simulate flag
          updatedCreateLpPosition = {
            case: 'v2CreateLpPosition' as const,
            value: new V2CreateLPPosition({
              ...createLpPosition.value,
              simulateTransaction: true,
            }),
          }
        } else {
          updatedCreateLpPosition = createLpPosition
        }

        const result = await V1LiquidityServiceClient.createLpPosition(
          new CreateLPPositionRequest({
            createLpPosition: updatedCreateLpPosition,
          }),
        )
        const create = result.create

        return { txRequest: validateTransactionRequest(create) }
      } catch (e) {
        const message = parseErrorMessageTitle(e, { includeRequestId: true })
        if (message) {
          logger.error(message, {
            tags: {
              file: 'increasePosition',
              function: 'createCreatePositionAsyncStep',
            },
            extra: {
              canBatchTransactions: false, // if in this step then the tx was not batched
              delegatedAddress: delegatedAddress ?? null,
            },
          })

          sendAnalyticsEvent(InterfaceEventName.CreatePositionFailed, {
            message,
            ...createPositionRequestArgs,
          })
        }

        throw e
      }
    },
  }
}

export function createIncreasePositionAsyncStep(
  increasePositionRequestArgs: IncreaseLPPositionRequest | IncreasePositionRequest | undefined,
  delegatedAddress?: string | null,
): IncreasePositionTransactionStepAsync {
  return {
    type: TransactionStepType.IncreasePositionTransactionAsync,
    getTxRequest: async (signature: string): Promise<{ txRequest: ValidatedTransactionRequest | undefined }> => {
      if (!increasePositionRequestArgs) {
        return { txRequest: undefined }
      }

      try {
        if (increasePositionRequestArgs instanceof IncreasePositionRequest) {
          const updatedRequest = new IncreasePositionRequest({
            ...increasePositionRequestArgs,
            signature,
            simulateTransaction: true,
          })
          const result = await V2LiquidityServiceClient.increasePosition(updatedRequest)
          return { txRequest: validateTransactionRequest(result.increase) }
        }

        const { increaseLpPosition } = increasePositionRequestArgs
        const updatedIncreaseLpPosition =
          increaseLpPosition.case === 'v4IncreaseLpPosition'
            ? {
                case: 'v4IncreaseLpPosition' as const,
                value: { ...increaseLpPosition.value, signature, simulateTransaction: true },
              }
            : increaseLpPosition.case === 'v3IncreaseLpPosition'
              ? {
                  case: 'v3IncreaseLpPosition' as const,
                  value: { ...increaseLpPosition.value, signature, simulateTransaction: true },
                }
              : increaseLpPosition
        const result = await V1LiquidityServiceClient.increaseLpPosition(
          new IncreaseLPPositionRequest({
            increaseLpPosition: updatedIncreaseLpPosition,
          }),
        )
        const increase = result.increase

        return { txRequest: validateTransactionRequest(increase) }
      } catch (e) {
        const message = parseErrorMessageTitle(e, { includeRequestId: true })
        if (message) {
          logger.error(message, {
            tags: {
              file: 'generateTransactionSteps',
              function: 'createIncreasePositionAsyncStep',
            },
            extra: {
              canBatchTransactions: false, // if in this step then the tx was not batched
              delegatedAddress: delegatedAddress ?? null,
            },
          })
          sendAnalyticsEvent(InterfaceEventName.IncreaseLiquidityFailed, {
            message,
            ...increasePositionRequestArgs,
          })
        }

        throw e
      }
    },
  }
}

export function createIncreasePositionStepBatched(
  txRequests: ValidatedTransactionRequest[],
): IncreasePositionTransactionStepBatched {
  return {
    type: TransactionStepType.IncreasePositionTransactionBatched,
    batchedTxRequests: txRequests,
  }
}
