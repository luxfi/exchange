<<<<<<< HEAD
import { GasFeeResult } from '@l.x/api'
=======
import { GasFeeResult } from '@universe/api'
>>>>>>> upstream/main
import { useMemo } from 'react'
import { usePrepareAndSignDappTransaction } from 'src/app/features/dappRequests/hooks/usePrepareAndSignDappTransaction'
import { useTransactionGasEstimation } from 'src/app/features/dappRequests/hooks/useTransactionGasEstimation'
import { DappRequestStoreItemForSendCallsTxn } from 'src/app/features/dappRequests/slice'
<<<<<<< HEAD
import { LUX_DELEGATION_ADDRESS } from '@l.x/lx/src/constants/addresses'
import { useWalletEncode7702Query } from '@l.x/lx/src/data/apiClients/tradingApi/useWalletEncode7702Query'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { EthTransaction } from '@l.x/lx/src/types/walletConnect'
import { transformCallsToTransactionRequests } from '@luxfi/wallet/src/features/batchedTransactions/utils'
import { useLiveAccountDelegationDetails } from '@luxfi/wallet/src/features/smartWallet/hooks/useLiveAccountDelegationDetails'
import { SignedTransactionRequest } from '@luxfi/wallet/src/features/transactions/executeTransaction/types'
import { Account } from '@luxfi/wallet/src/features/wallet/accounts/types'
=======
import { UNISWAP_DELEGATION_ADDRESS } from 'uniswap/src/constants/addresses'
import { useWalletEncode7702Query } from 'uniswap/src/data/apiClients/tradingApi/useWalletEncode7702Query'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { EthTransaction } from 'uniswap/src/types/walletConnect'
import { transformCallsToTransactionRequests } from 'wallet/src/features/batchedTransactions/utils'
import { useLiveAccountDelegationDetails } from 'wallet/src/features/smartWallet/hooks/useLiveAccountDelegationDetails'
import { SignedTransactionRequest } from 'wallet/src/features/transactions/executeTransaction/types'
import { Account } from 'wallet/src/features/wallet/accounts/types'
>>>>>>> upstream/main

interface UsePrepareAndSignSendCallsTransactionParams {
  request: DappRequestStoreItemForSendCallsTxn
  account: Account
  chainId?: UniverseChainId
}

interface UsePrepareAndSignSendCallsTransactionResult {
  /** The gas fee result from estimation */
  gasFeeResult: GasFeeResult

  /** Whether the gas fee result is invalid */
  isInvalidGasFeeResult: boolean

  /** Whether smart wallet activation is needed */
  showSmartWalletActivation: boolean

  /** The encoded transaction data */
  encodedTransactionRequest?: EthTransaction

  /** The encoded request ID */
  encodedRequestId?: string

  /** The pre-signed transaction (available after gas info is loaded) */
  preSignedTransaction?: SignedTransactionRequest
}

/**
 * Hook that fetches gas information for a SendCalls dapp transaction and automatically
 * prepares and signs the transaction once gas info is available
 */
export function usePrepareAndSignSendCallsTransaction({
  request,
  account,
  chainId,
}: UsePrepareAndSignSendCallsTransactionParams): UsePrepareAndSignSendCallsTransactionResult {
  const { data: encoded7702data } = useWalletEncode7702Query({
    enabled: !!chainId && !!account.address,
    params: {
      calls: chainId
        ? transformCallsToTransactionRequests({
            calls: request.dappRequest.calls,
            chainId,
            accountAddress: account.address,
          })
        : [],
<<<<<<< HEAD
      smartContractDelegationAddress: LUX_DELEGATION_ADDRESS,
=======
      smartContractDelegationAddress: UNISWAP_DELEGATION_ADDRESS,
>>>>>>> upstream/main
      walletAddress: account.address,
    },
  })

  const delegationData = useLiveAccountDelegationDetails({
    address: account.address,
    chainId,
  })

  const encodedTransaction = encoded7702data?.encoded
  const encodedRequestId = encoded7702data?.requestId

  const { gasFeeResult, isInvalidGasFeeResult } = useTransactionGasEstimation({
    baseTx: encodedTransaction,
    chainId,
    skip: !encodedTransaction?.to,
    smartContractDelegationAddress: delegationData?.contractAddress,
  })

  const encodedTransactionRequestWithGasInfo: EthTransaction | undefined = useMemo(
    () =>
      encodedTransaction && gasFeeResult.params && !isInvalidGasFeeResult && chainId
        ? {
            ...encodedTransaction,
            ...gasFeeResult.params,
            chainId,
          }
        : undefined,
    [encodedTransaction, gasFeeResult, isInvalidGasFeeResult, chainId],
  )

  const { preSignedTransaction } = usePrepareAndSignDappTransaction({
    request: encodedTransactionRequestWithGasInfo,
    account,
    chainId,
  })

  return {
    gasFeeResult,
    isInvalidGasFeeResult,
    showSmartWalletActivation: delegationData?.needsDelegation ?? false,
    encodedTransactionRequest: encodedTransactionRequestWithGasInfo,
    encodedRequestId,
    preSignedTransaction,
  }
}
