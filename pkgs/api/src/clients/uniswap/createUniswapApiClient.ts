import type { TransactionRequest } from '@ethersproject/providers'
import type { FetchClient } from '@l.x/api/src/clients/base/types'
import {
  type GasFeeResponse,
  type GasFeeResultWithoutState,
  type GasStrategy,
} from '@l.x/api/src/clients/trading/types'
import { isWebApp } from 'utilities/src/platform'

// TODO(app-infra), de-duplicate with lxUrls when other consumers are migrated to use this client
const LX_API_PATHS = {
  gasFee: '/v1/gas-fee',
}

type FetchGasFn = ({
  tx,
  fallbackGasLimit,
}: {
  tx: TransactionRequest
  gasStrategy: GasStrategy
  fallbackGasLimit?: number
  smartContractDelegationAddress?: Address
}) => Promise<GasFeeResultWithoutState>

export interface LxApiClientContext {
  fetchClient: FetchClient
  processGasFeeResponse: (gasFeeResponse: GasFeeResponse, gasStrategy: GasStrategy) => GasFeeResultWithoutState
  estimateGasWithClientSideProvider: (params: {
    tx: TransactionRequest
    fallbackGasLimit?: number
  }) => Promise<GasFeeResultWithoutState>
}

export interface LxApiClient {
  fetchGasFee: FetchGasFn
}

export function createLxApiClient(ctx: LxApiClientContext): LxApiClient {
  const { fetchClient: client, processGasFeeResponse, estimateGasWithClientSideProvider } = ctx

  const injectGasStrategies = (
    tx: TransactionRequest,
    gasStrategy: GasStrategy,
  ): TransactionRequest & { gasStrategies: GasStrategy[] } => {
    return { ...tx, gasStrategies: [gasStrategy] }
  }

  const injectSmartContractDelegationAddress = (
    tx: TransactionRequest,
    smartContractDelegationAddress?: Address,
  ): TransactionRequest => ({
    ...tx,
    ...(smartContractDelegationAddress ? { smartContractDelegationAddress } : {}),
  })

  const fetchGasFee: FetchGasFn = async ({ tx, fallbackGasLimit, smartContractDelegationAddress, gasStrategy }) => {
    const txWithScDelegationAddress = injectSmartContractDelegationAddress(tx, smartContractDelegationAddress)
    const body = JSON.stringify(injectGasStrategies(txWithScDelegationAddress, gasStrategy))

    try {
      const gasFeeResponse = await client.post<GasFeeResponse>(LX_API_PATHS.gasFee, {
        body,
        headers: smartContractDelegationAddress
          ? {
              'x-viem-provider-enabled': 'true',
            }
          : {},
      })
      return processGasFeeResponse(gasFeeResponse, gasStrategy)
    } catch (error) {
      if (isWebApp) {
        // Gas Fee API currently errors on gas estimations on disconnected state & insufficient funds
        // Fallback to clientside estimate using provider.estimateGas
        return estimateGasWithClientSideProvider({ tx, fallbackGasLimit })
      }
      throw error
    }
  }

  return {
    fetchGasFee,
  }
}
