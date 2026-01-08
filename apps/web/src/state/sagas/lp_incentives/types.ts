import { TransactionRequest as LiquidityTransactionRequest } from '@luxdex/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import { TradingApi } from '@luxfi/api'
import { SetCurrentStepFn } from 'lx/src/features/transactions/swap/types/swapCallback'

export interface LpIncentivesClaimParams {
  address: string
  chainId: TradingApi.ChainId
  claimData: TradingApi.TransactionRequest | LiquidityTransactionRequest
  tokenAddress: string
  setCurrentStep: SetCurrentStepFn
  selectChain: (chainId: number) => Promise<boolean>
  onSuccess: () => void
  onFailure: (error: Error) => void
}
