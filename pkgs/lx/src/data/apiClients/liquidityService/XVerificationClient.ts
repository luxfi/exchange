import { createPromiseClient } from '@connectrpc/connect'
import { XVerificationService } from '@luxamm/client-liquidity/dist/lx/liquidity/v1/x_verification_connect'
import { createXVerificationServiceClient } from '@luxexchange/api'
import { liquidityServiceTransport } from 'lx/src/data/apiClients/liquidityService/base'

export const XVerificationClient = createXVerificationServiceClient({
  rpcClient: createPromiseClient(XVerificationService, liquidityServiceTransport),
})
