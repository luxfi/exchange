import type { MarkerPosition } from '~/components/Toucan/Auction/BidDistributionChart/markers/types'
import { fromQ96ToDecimalWithTokenDecimals } from '~/components/Toucan/Auction/BidDistributionChart/utils/q96'
import type { UserBid } from '~/components/Toucan/Auction/store/types'

/** Markers within this many pixels of each other get merged into one */
const PROXIMITY_THRESHOLD_PX = 24

interface ComputeMarkerPositionsParams {
  userBids: UserBid[]
  visiblePriceRange: { min: number; max: number }
  chartAreaHeight: number
  scaleFactor: number
  bidTokenDecimals: number
  auctionTokenDecimals: number
  clearingPrice: string | undefined
  address: string
}

export function computeMarkerPositions({
  userBids,
  visiblePriceRange,
  chartAreaHeight,
  scaleFactor,
  bidTokenDecimals,
  auctionTokenDecimals,
  clearingPrice,
  address,
}: ComputeMarkerPositionsParams): MarkerPosition[] {
  const { min, max } = visiblePriceRange
  if (max === min) {
    return []
  }

  const clearingPriceBigInt = clearingPrice ? BigInt(clearingPrice) : null

  // Compute Y position and in-range status for each bid
  const bidEntries = userBids.map((bid) => {
    const tickDecimal = fromQ96ToDecimalWithTokenDecimals({
      q96Value: bid.maxPrice,
      bidTokenDecimals,
      auctionTokenDecimals,
    })
    const scaledTick = tickDecimal * scaleFactor
    const y = chartAreaHeight - ((scaledTick - min) / (max - min)) * chartAreaHeight
    const isInRange = clearingPriceBigInt ? BigInt(bid.maxPrice) >= clearingPriceBigInt : true
    return { bid, y, isInRange }
  })

  // Sort by Y position (top to bottom)
  bidEntries.sort((a, b) => a.y - b.y)

  // Group bids within pixel proximity
  const groups: { bids: UserBid[]; y: number; bidRangeMap: Record<string, boolean> }[] = []
  for (const entry of bidEntries) {
    const lastGroup = groups[groups.length - 1]

    if (lastGroup && Math.abs(entry.y - lastGroup.y) < PROXIMITY_THRESHOLD_PX) {
      lastGroup.bids.push(entry.bid)
      // Use weighted average Y for the group center
      lastGroup.y = (lastGroup.y * (lastGroup.bids.length - 1) + entry.y) / lastGroup.bids.length
      lastGroup.bidRangeMap[entry.bid.bidId] = entry.isInRange
    } else {
      groups.push({
        bids: [entry.bid],
        y: entry.y,
        bidRangeMap: { [entry.bid.bidId]: entry.isInRange },
      })
    }
  }

  // Convert groups to marker positions, filtering to visible area
  const markers: MarkerPosition[] = []
  for (const group of groups) {
    if (group.y >= -12 && group.y <= chartAreaHeight + 12) {
      markers.push({
        id: group.bids[0].maxPrice,
        left: 14,
        top: group.y - 12,
        address: address || group.bids[0]?.walletId || '',
        bids: group.bids,
        bidRangeMap: group.bidRangeMap,
      })
    }
  }
  return markers
}
