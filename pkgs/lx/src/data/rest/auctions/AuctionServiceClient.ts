import { createPromiseClient } from '@connectrpc/connect'
import { AuctionService } from '@luxamm/client-data-api/dist/data/v1/auction_connect'
import { createAuctionServiceClient } from '@l.x/api'
import { auctionsTransport } from 'lx/src/data/rest/auctions/base'

export const AuctionServiceClient = createAuctionServiceClient({
  rpcClient: createPromiseClient(AuctionService, auctionsTransport),
})
