import { useTrace } from '@luxamm/analytics'
import { TradingApi } from '@l.x/api'
import { useCallback } from 'react'
import { finalizeTransaction, updateTransaction } from '@l.x/lx/src/features/transactions/slice'
import {
  extractPlanFieldsFromTypeInfo,
  extractTransactionTypeInfoAttribute,
  TransactionStatus,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { isFinalizedTx } from '@l.x/lx/src/features/transactions/types/utils'
import { popupRegistry } from '~/components/Popups/registry'
import { PopupType } from '~/components/Popups/types'
import type { DEXOrderUpdate } from '~/state/activity/types'
import { useAppDispatch } from '~/state/hooks'
import { logLxSwapSwapFinalized } from '~/tracing/swapFlowLoggers'

interface HandleDEXActivityUpdateParams {
  activity: DEXOrderUpdate
  popupDismissalTime: number
}

export function useHandleDEXActivityUpdate(): (params: HandleDEXActivityUpdateParams) => void {
  const dispatch = useAppDispatch()
  const analyticsContext = useTrace()

  return useCallback(
    ({ activity, popupDismissalTime }: HandleDEXActivityUpdateParams): void => {
      const { original, update } = activity

      // Always update the transaction first to ensure all fields are updated
      dispatch(updateTransaction(update))

      // Then finalize if it's a final status (for analytics and other side effects)
      if (isFinalizedTx(update)) {
        dispatch(finalizeTransaction(update))
      }

      // Add popup based on activity status
      if (update.status === TransactionStatus.Success && update.hash) {
        popupRegistry.addPopup(
          {
            type: PopupType.Transaction,
            hash: update.hash,
          },
          update.hash,
          popupDismissalTime,
        )
      } else if (original.status !== update.status && original.orderHash) {
        popupRegistry.addPopup(
          {
            type: PopupType.Order,
            orderHash: original.orderHash,
          },
          original.orderHash,
          popupDismissalTime,
        )
      }

      // Log status to analytics
      if (
        original.orderHash &&
        ((update.status === TransactionStatus.Success && original.routing !== TradingApi.Routing.DUTCH_LIMIT) ||
          update.status === TransactionStatus.Canceled ||
          update.status === TransactionStatus.Expired)
      ) {
        // Log successful non-limit orders (for swap metrics) and all cancelled/expired orders
        logLxSwapSwapFinalized({
          id: original.id,
          hash: update.hash,
          orderHash: original.orderHash,
          chainId: activity.chainId,
          analyticsContext,
          routing: original.routing,
          status: update.status,
          swapStartTimestamp: extractTransactionTypeInfoAttribute(original.typeInfo, 'swapStartTimestamp'),
          planAnalytics: extractPlanFieldsFromTypeInfo(original.typeInfo),
          transactedUSDValue: extractTransactionTypeInfoAttribute(original.typeInfo, 'transactedUSDValue'),
        })
      }
    },
    [dispatch, analyticsContext],
  )
}
