import { type PartialMessage } from '@bufbuild/protobuf'
import { createPromiseClient } from '@connectrpc/connect'
import { UniRpcService } from '@luxamm/client-unirpc-v2/dist/lx/unirpc/v2/service_connect'
import type { EstimateGasFeeRequest } from '@luxamm/client-unirpc-v2/dist/lx/unirpc/v2/service_pb'
import {
  createGasServiceClient,
  createWithSessionRetry,
  type GasServiceClient as GasServiceClientType,
  reinitializeSession,
} from '@l.x/api'
import { entryGatewayPostTransport } from 'lx/src/data/rest/base'
import { logger } from 'utilities/src/logger/logger'

const withSessionRetry = createWithSessionRetry({
  reinitializeSession: () => {
    logger.warn('GasServiceClient', 'reinitializeSession', 'Reinitializing session during gas estimation')
    return reinitializeSession()
  },
  onReinitializationFailed: () => {
    logger.error(new Error('Session reinitialization failed during gas estimation'), {
      tags: { file: 'GasServiceClient', function: 'onReinitializationFailed' },
    })
  },
})

const BaseGasServiceClient = createGasServiceClient({
  rpcClient: createPromiseClient(UniRpcService, entryGatewayPostTransport),
})

export const GasServiceClient: GasServiceClientType = {
  estimateGasFee(params: PartialMessage<EstimateGasFeeRequest>) {
    return withSessionRetry(() => BaseGasServiceClient.estimateGasFee(params))
  },
}
