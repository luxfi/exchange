import { useCreateAuctionStore } from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'

export function useCreateAuctionTokenColor(): string | undefined {
  return useCreateAuctionStore((state) => state.tokenColor)
}
