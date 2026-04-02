import { TransactionRequest as LiquidityTransactionRequest } from '@luxamm/client-liquidity/dist/lx/liquidity/v1/types_pb'
import { TradingApi } from '@luxexchange/api'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { SetCurrentStepFn } from '@luxexchange/lx/src/features/transactions/swap/types/swapCallback'

export interface LpIncentivesClaimParams {
  address: string
  claimData: TradingApi.TransactionRequest | LiquidityTransactionRequest
  tokenAddress: string
  setCurrentStep: SetCurrentStepFn
  selectChain: (chainId: number) => Promise<boolean>
  walletChainId?: UniverseChainId
  onSuccess: () => void
  onFailure: (error: Error) => void
}
