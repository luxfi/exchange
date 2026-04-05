<<<<<<< HEAD
import { TransactionRequest as LiquidityTransactionRequest } from '@luxamm/client-liquidity/dist/lx/liquidity/v1/types_pb'
import { TradingApi } from '@l.x/api'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { SetCurrentStepFn } from '@l.x/lx/src/features/transactions/swap/types/swapCallback'
=======
import { TransactionRequest as LiquidityTransactionRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import { TradingApi } from '@universe/api'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { SetCurrentStepFn } from 'uniswap/src/features/transactions/swap/types/swapCallback'
>>>>>>> upstream/main

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
