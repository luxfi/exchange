import { createPromiseClient } from '@connectrpc/connect'
import { AuctionService } from '@luxamm/client-liquidity/dist/lx/liquidity/v1/auction_connect'
import { createAuctionMutationClient } from '@l.x/api'
import { liquidityServiceTransport } from 'lx/src/data/apiClients/liquidityService/base'

// Direct client for imperative auction mutation calls (non-React)
// For React components, use the mutation hooks (useSubmitBidMutation, useExitBidAndClaimTokensMutation) instead
export const AuctionMutationClient = createAuctionMutationClient({
  rpcClient: createPromiseClient(AuctionService, liquidityServiceTransport),
})
