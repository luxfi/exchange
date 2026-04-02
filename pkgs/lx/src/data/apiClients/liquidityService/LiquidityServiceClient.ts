import { createPromiseClient } from '@connectrpc/connect'
import { LiquidityService } from '@luxamm/client-liquidity/dist/lx/liquidity/v1/api_connect'
import { createLiquidityServiceClient } from '@luxexchange/api'
import { liquidityServiceTransport } from 'lx/src/data/apiClients/liquidityService/base'

// Direct client for imperative calls (non-React)
// For React components, use the hooks (useCheckLPApprovalQuery, etc.) instead
export const LiquidityServiceClient = createLiquidityServiceClient({
  rpcClient: createPromiseClient(LiquidityService, liquidityServiceTransport),
})
