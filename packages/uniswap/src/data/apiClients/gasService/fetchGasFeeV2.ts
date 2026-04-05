import { type TransactionRequest } from '@ethersproject/providers'
import { type GasFeeResultWithoutState, type GasStrategy } from '@universe/api'
import { GasServiceClient } from 'uniswap/src/data/apiClients/gasService/GasServiceClient'
import { mapGasServiceV2Response } from 'uniswap/src/data/apiClients/gasService/mapGasServiceV2Response'
import { mapToEstimateGasFeeRequest } from 'uniswap/src/data/apiClients/gasService/mapToEstimateGasFeeRequest'
import { estimateGasWithClientSideProvider } from 'uniswap/src/features/gas/utils'
import { logger } from 'utilities/src/logger/logger'
import { isWebApp } from 'utilities/src/platform'

export async function fetchGasFeeV2({
  tx,
  gasStrategy,
  smartContractDelegationAddress,
  fallbackGasLimit,
}: {
  tx: TransactionRequest
  gasStrategy: GasStrategy
  smartContractDelegationAddress?: string
  fallbackGasLimit?: number
}): Promise<GasFeeResultWithoutState> {
  try {
    const request = mapToEstimateGasFeeRequest({ tx, gasStrategy, smartContractDelegationAddress })
    const response = await GasServiceClient.estimateGasFee(request)
    return mapGasServiceV2Response({ response, gasStrategy })
  } catch (error) {
    const loggedError = new Error('Gas service v2 estimation failed', {
      cause: error,
    })

    logger.error(loggedError, {
      tags: {
        file: 'fetchGasFeeV2',
        function: 'fetchGasFeeV2',
      },
      extra: {
        tx,
        gasStrategy,
        smartContractDelegationAddress,
      },
    })

    if (isWebApp) {
      return estimateGasWithClientSideProvider({ tx, fallbackGasLimit })
    }
    throw error
  }
}
