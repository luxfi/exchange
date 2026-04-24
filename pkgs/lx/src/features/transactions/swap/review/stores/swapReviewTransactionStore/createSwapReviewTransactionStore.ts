import type { GasFeeResult } from '@l.x/api'
import { TradingApi } from '@l.x/api'
import type { Warning, WarningWithStyle } from '@l.x/lx/src/components/modals/WarningModal/types'
import type { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import type { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import type { SwapTxStoreState } from '@l.x/lx/src/features/transactions/swap/stores/swapTxStore/createSwapTxStore'
import type { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import type { LXGasBreakdown } from '@l.x/lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import type { IndicativeTrade, Trade } from '@l.x/lx/src/features/transactions/swap/types/trade'
import type {
  FeeOnTransferFeeGroupProps,
  TokenWarningProps,
} from '@l.x/lx/src/features/transactions/TransactionDetails/types'
import { isDevEnv } from '@l.x/utils/src/environment/env'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type SwapReviewTransactionStore = UseBoundStore<StoreApi<SwapReviewTransactionState>>

export type SwapReviewTransactionState = {
  trade: Trade | undefined
  indicativeTrade: IndicativeTrade | undefined
  acceptedTrade: Trade | undefined
  swapTxContext: SwapTxStoreState
  gasFee: GasFeeResult
  lxOrderGasBreakdown: LXGasBreakdown | undefined
  derivedSwapInfo: DerivedSwapInfo
  acceptedDerivedSwapInfo: DerivedSwapInfo | undefined
  isWrap: boolean
  blockingWarning: Warning | undefined
  reviewScreenWarning: WarningWithStyle | undefined
  txSimulationErrors: TradingApi.TransactionFailureReason[] | undefined
  newTradeRequiresAcceptance: boolean
  feeOnTransferProps: FeeOnTransferFeeGroupProps | undefined
  tokenWarningProps: TokenWarningProps
  currencyInInfo: Maybe<CurrencyInfo>
  currencyOutInfo: Maybe<CurrencyInfo>
  chainId: UniverseChainId | undefined
  onAcceptTrade: () => void
}

export const createSwapReviewTransactionStore = (
  initialState: SwapReviewTransactionState,
): SwapReviewTransactionStore =>
  create<SwapReviewTransactionState>()(
    devtools(() => initialState, {
      name: 'useSwapReviewTransactionStore',
      enabled: isDevEnv(),
      trace: true,
      traceLimit: 25,
    }),
  )
