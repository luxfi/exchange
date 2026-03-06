import { TradingApi } from '@universe/api'
import { SwapEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { getRouteAnalyticsData, logSwapQuoteFetch } from 'lx/src/features/transactions/swap/analytics'
import { ClassicTrade, Trade } from 'lx/src/features/transactions/swap/types/trade'

vi.mock('lx/src/features/telemetry/send', () => ({
  sendAnalyticsEvent: vi.fn(),
}))

vi.mock('lx/src/features/transactions/swap/utils/SwapEventTimestampTracker', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('lx/src/features/transactions/swap/utils/SwapEventTimestampTracker')>()
  return {
    ...actual,
    timestampTracker: {
      hasTimestamp: (): boolean => false,
      setElapsedTime: (): number => 100,
      getElapsedTime: (): number => 100,
    },
  }
})

// Mock the @lux/v2-sdk package to provide Pair.getAddress
vi.mock('@lux/v2-sdk', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@lux/v2-sdk')>()
  originalModule.Pair.getAddress = (): string => {
    return `0xv2PoolAddress`
  }
  return originalModule
})

vi.mock('@lux/v3-sdk', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@lux/v3-sdk')>()
  originalModule.Pool.getAddress = (): string => {
    return `0xv3PoolAddress`
  }
  return originalModule
})

// Create instances of the mock classes
const mockV2Pool = {
  token0: { address: 'token0Address' },
  token1: { address: 'token1Address' },
}
const { Pair: V2Pool } = await vi.importActual<typeof import('@lux/v2-sdk')>('@lux/v2-sdk')
Object.setPrototypeOf(mockV2Pool, V2Pool.prototype)

const mockV3Pool = {
  token0: { address: 'token0Address' },
  token1: { address: 'token1Address' },
  fee: 0,
}
const { Pool: V3Pool } = await vi.importActual<typeof import('@lux/v3-sdk')>('@lux/v3-sdk')
Object.setPrototypeOf(mockV3Pool, V3Pool.prototype)
//
const mockV4Pool = { poolId: '0xpool1', v4: true }
const { Pool: V4Pool } = await vi.importActual<typeof import('@lux/v4-sdk')>('@lux/v4-sdk')
Object.setPrototypeOf(mockV4Pool, V4Pool.prototype)

// Helper to cast isClassic as a Mock
// const mockIsClassic = isClassic as unknown as Mock

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logSwapQuoteRequest calls sendAnalyticsEvent with correct parameters', () => {
    const mockChainId = 1

    logSwapQuoteFetch({ chainId: mockChainId })

    expect(sendAnalyticsEvent).toHaveBeenCalledWith(SwapEventName.SwapQuoteFetch, {
      chainId: mockChainId,
      isQuickRoute: false,
      isUSDQuote: false,
      quoteSource: undefined,
      pollInterval: undefined,
      time_to_first_quote_request: 100,
      time_to_first_quote_request_since_first_input: 100,
    })
  })

  it('logSwapQuoteRequest excludes perf metrics for price quotes', () => {
    const mockChainId = 1

    logSwapQuoteFetch({ chainId: mockChainId, isUSDQuote: true })

    expect(sendAnalyticsEvent).toHaveBeenCalledWith(SwapEventName.SwapQuoteFetch, {
      chainId: mockChainId,
      isQuickRoute: false,
      isUSDQuote: true,
      quoteSource: undefined,
      pollInterval: undefined,
    })
  })

  describe('getRouteAnalyticsData', () => {
    it('returns undefined if routing is undefined', () => {
      const result = getRouteAnalyticsData({ routing: undefined })
      expect(result).toBeUndefined()
    })

    it('returns dexUsed=true for DEX trade', () => {
      // We need to cast to Trade because the mock isn't a complete implementation
      const mockTrade = { routing: TradingApi.Routing.DUTCH_V2 } as Trade

      const result = getRouteAnalyticsData(mockTrade)
      expect(result).toEqual({
        v2Used: false,
        v3Used: false,
        v4Used: false,
        dexUsed: true,
        jupiterUsed: false,
      })
    })

    it('extracts route data from classic trade with V2 and V3 pools', () => {
      const mockClassicTrade = {
        routing: TradingApi.Routing.CLASSIC,
        routes: [{ pools: [mockV2Pool] }, { pools: [mockV3Pool] }],
      } as unknown as ClassicTrade

      // We need to cast to Trade because the mock isn't a complete implementation
      const result = getRouteAnalyticsData(mockClassicTrade as unknown as Trade)

      // Verify the analytics data structure
      expect(result).toEqual({
        paths: [
          [{ poolAddress: '0xv2PoolAddress', version: 'V2' }],
          [{ poolAddress: '0xv3PoolAddress', version: 'V3' }],
        ],
        poolsCount: 2,
        v2Used: true,
        v3Used: true,
        v4Used: false,
        dexUsed: false,
        jupiterUsed: false,
      })
    })

    it('extracts route data from classic trade with V4 pools', () => {
      // We need to cast to Trade because the mock isn't a complete implementation
      const mockClassicTrade = {
        routing: TradingApi.Routing.CLASSIC,
        routes: [{ pools: [mockV4Pool] }],
      } as unknown as ClassicTrade

      const result = getRouteAnalyticsData(mockClassicTrade as unknown as Trade)

      // Verify the analytics data structure
      expect(result).toEqual({
        paths: [[{ poolAddress: '0xpool1', version: 'V4' }]],
        poolsCount: 1,
        v2Used: false,
        v3Used: false,
        v4Used: true,
        dexUsed: false,
        jupiterUsed: false,
      })
    })

    it('returns default result if route extraction fails', () => {
      // Create a mock trade that will cause extraction to fail
      const mockBrokenTrade = {
        routing: TradingApi.Routing.CLASSIC,
        routes: null, // This will cause an error during extraction
      } as unknown as ClassicTrade

      const result = getRouteAnalyticsData(mockBrokenTrade as unknown as Trade)

      // Should return the default result when extraction fails
      expect(result).toEqual({
        v2Used: false,
        v3Used: false,
        v4Used: false,
        dexUsed: false,
        jupiterUsed: false,
      })
    })
  })
})
