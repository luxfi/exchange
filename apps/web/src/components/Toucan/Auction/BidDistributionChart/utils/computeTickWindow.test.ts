import { CHART_CONSTRAINTS, MAX_RENDERABLE_BARS } from '~/components/Toucan/Auction/BidDistributionChart/constants'
import { computeTickWindow } from '~/components/Toucan/Auction/BidDistributionChart/utils/utils'

describe('computeTickWindow', () => {
  it('returns original range when window fits within MAX_RENDERABLE_BARS', () => {
    const result = computeTickWindow({
      minTickIndexAvailable: 0,
      maxTickIndexAvailable: 100,
      clearingLowerIndex: 50,
      minRequiredMaxIndex: 65,
    })

    expect(result.windowMinIndex).toBe(0)
    expect(result.windowMaxIndex).toBe(100)
  })

  it('extends windowMaxIndex to minRequiredMaxIndex when clearing price is above data', () => {
    const result = computeTickWindow({
      minTickIndexAvailable: 0,
      maxTickIndexAvailable: 10,
      clearingLowerIndex: 50,
      minRequiredMaxIndex: 65,
    })

    // Window = 0 to 65 = 66 ticks, well under 10k
    expect(result.windowMinIndex).toBe(0)
    expect(result.windowMaxIndex).toBe(65)
  })

  it('centers on clearing price when clearing price is far above bids', () => {
    // Simulates the W3SH auction: bids near floor, clearing price millions of ticks away
    const clearingLowerIndex = 5_000_000
    const result = computeTickWindow({
      minTickIndexAvailable: 0,
      maxTickIndexAvailable: 100,
      clearingLowerIndex,
      minRequiredMaxIndex: clearingLowerIndex + CHART_CONSTRAINTS.MIN_TICKS_ABOVE_CLEARING_PRICE,
    })

    const windowSize = result.windowMaxIndex - result.windowMinIndex + 1
    expect(windowSize).toBe(MAX_RENDERABLE_BARS)

    // Clearing price should be near the start of the window (5 ticks below)
    expect(result.windowMinIndex).toBe(
      clearingLowerIndex - (CHART_CONSTRAINTS.PREFERRED_TICKS_BELOW_CLEARING_PRICE - 1),
    )
  })

  it('centers on clearing price when bid data itself exceeds MAX_RENDERABLE_BARS', () => {
    const clearingLowerIndex = 50_000
    const minRequiredMaxIndex = clearingLowerIndex + CHART_CONSTRAINTS.MIN_TICKS_ABOVE_CLEARING_PRICE

    const result = computeTickWindow({
      minTickIndexAvailable: 0,
      maxTickIndexAvailable: 100_000,
      clearingLowerIndex,
      minRequiredMaxIndex,
    })

    const windowSize = result.windowMaxIndex - result.windowMinIndex + 1
    expect(windowSize).toBe(MAX_RENDERABLE_BARS)

    // Should keep PREFERRED_TICKS_BELOW_CLEARING_PRICE (5) below clearing price
    expect(result.windowMinIndex).toBe(
      clearingLowerIndex - (CHART_CONSTRAINTS.PREFERRED_TICKS_BELOW_CLEARING_PRICE - 1),
    )
  })

  it('ensures minRequiredMaxIndex is respected when clearing price is near window end', () => {
    const clearingLowerIndex = 99_990
    const minRequiredMaxIndex = clearingLowerIndex + CHART_CONSTRAINTS.MIN_TICKS_ABOVE_CLEARING_PRICE

    const result = computeTickWindow({
      minTickIndexAvailable: 0,
      maxTickIndexAvailable: 100_000,
      clearingLowerIndex,
      minRequiredMaxIndex,
    })

    const windowSize = result.windowMaxIndex - result.windowMinIndex + 1
    expect(windowSize).toBe(MAX_RENDERABLE_BARS)
    expect(result.windowMaxIndex).toBeGreaterThanOrEqual(minRequiredMaxIndex)
  })

  it('handles case where clearing price is below all bids', () => {
    const result = computeTickWindow({
      minTickIndexAvailable: 100,
      maxTickIndexAvailable: 200,
      clearingLowerIndex: 50,
      minRequiredMaxIndex: 65,
    })

    // Window = 100 to 200 = 101 ticks, fits fine
    expect(result.windowMinIndex).toBe(100)
    expect(result.windowMaxIndex).toBe(200)
  })

  it('handles single bid at floor with distant clearing price', () => {
    const clearingLowerIndex = 1_000_000
    const result = computeTickWindow({
      minTickIndexAvailable: 0,
      maxTickIndexAvailable: 0,
      clearingLowerIndex,
      minRequiredMaxIndex: clearingLowerIndex + CHART_CONSTRAINTS.MIN_TICKS_ABOVE_CLEARING_PRICE,
    })

    const windowSize = result.windowMaxIndex - result.windowMinIndex + 1
    expect(windowSize).toBe(MAX_RENDERABLE_BARS)

    // Should anchor around clearing price, not the single bid at floor
    expect(result.windowMinIndex).toBeGreaterThan(0)
    expect(result.windowMinIndex).toBeLessThanOrEqual(clearingLowerIndex)
  })
})
