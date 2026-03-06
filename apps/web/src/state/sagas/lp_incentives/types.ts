import { TransactionRequest as LiquidityTransactionRequest } from '@lux/client-liquidity/dist/lux/liquidity/v1/types_pb'
import { TradingApi } from '@universe/api'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { SetCurrentStepFn } from 'lx/src/features/transactions/swap/types/swapCallback'

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
