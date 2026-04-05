import { useQuery } from '@tanstack/react-query'
import {
  CreateLPPositionRequest,
  IncreaseLPPositionRequest,
<<<<<<< HEAD
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/api_pb'
=======
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
>>>>>>> upstream/main
import {
  IndependentToken,
  Protocols,
  V3CreateLPPosition,
  V3IncreaseLPPosition,
<<<<<<< HEAD
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/types_pb'
import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import JSBI from 'jsbi'
import { USDC_MAINNET } from '@l.x/lx/src/constants/tokens'
import { liquidityQueries } from '@l.x/lx/src/data/apiClients/liquidityService/liquidityQueries'
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'
=======
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import {
  IncreasePositionRequest as V2IncreasePositionRequest,
  IncreasePositionResponse as V2IncreasePositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { LPToken } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/types_pb'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { USDC_MAINNET } from 'uniswap/src/constants/tokens'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'
import { ONE_SECOND_MS } from 'utilities/src/time/time'
>>>>>>> upstream/main
import { vi } from 'vitest'
import {
  useCreatePositionDependentAmountFallback,
  useIncreasePositionDependentAmountFallback,
  useUpdatedAmountsFromDependentAmount,
} from '~/components/Liquidity/hooks/useDependentAmountFallback'
import { TEST_TOKEN_1, TEST_TOKEN_2 } from '~/test-utils/constants'
import { renderHook } from '~/test-utils/render'
import { PositionField } from '~/types/position'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})
const useQueryMock = vi.mocked(useQuery)

<<<<<<< HEAD
vi.mock('lx/src/features/transactions/hooks/useUSDCPriceWrapper', () => ({
=======
vi.mock('uniswap/src/features/transactions/hooks/useUSDCPriceWrapper', () => ({
>>>>>>> upstream/main
  useUSDCValue: (currencyAmount: CurrencyAmount<Currency> | undefined | null) => {
    if (!currencyAmount) {
      return null
    }
    return CurrencyAmount.fromRawAmount(USDC_MAINNET, JSBI.multiply(currencyAmount.numerator, JSBI.BigInt(100)))
  },
}))

const refetchInterval = 5 * ONE_SECOND_MS

const BASE_CREATE_PARAMS = new CreateLPPositionRequest({
  createLpPosition: {
    case: 'v3CreateLpPosition',
    value: new V3CreateLPPosition({
      walletAddress: '0x123',
      chainId: 1,
      protocols: Protocols.V3,
      independentAmount: '1000',
      independentToken: IndependentToken.TOKEN_0,
      slippageTolerance: 0.5,
      deadline: Date.now() + 1000000,
      simulateTransaction: true,
      position: {
        tickLower: -887272,
        tickUpper: 887272,
        pool: {
          token0: TEST_TOKEN_1.address,
          token1: TEST_TOKEN_2.address,
          fee: 3000,
          tickSpacing: 60,
        },
      },
    }),
  },
})

const BASE_CREATE_PARAMS_NO_SIMULATE = new CreateLPPositionRequest({
  createLpPosition: {
    case: 'v3CreateLpPosition',
    value: new V3CreateLPPosition({
      walletAddress: '0x123',
      chainId: 1,
      protocols: Protocols.V3, // Protocols.V3
      independentAmount: '1000',
      independentToken: IndependentToken.TOKEN_0, // IndependentToken.TOKEN_0
      slippageTolerance: 0.5,
      deadline: Date.now() + 1000000,
      simulateTransaction: false,
      position: {
        tickLower: -887272,
        tickUpper: 887272,
        pool: {
          token0: TEST_TOKEN_1.address,
          token1: TEST_TOKEN_2.address,
          fee: 3000,
          tickSpacing: 60,
        },
      },
    }),
  },
})

const BASE_INCREASE_PARAMS = new IncreaseLPPositionRequest({
  increaseLpPosition: {
    case: 'v3IncreaseLpPosition',
    value: new V3IncreaseLPPosition({
      walletAddress: '0x123',
      chainId: 1,
      protocols: Protocols.V3,
      independentAmount: '1000',
      independentToken: IndependentToken.TOKEN_0,
      slippageTolerance: 0.5,
      deadline: Date.now() + 1000000,
      simulateTransaction: true,
      position: {
        pool: {
          token0: TEST_TOKEN_1.address,
          token1: TEST_TOKEN_2.address,
          fee: 3000,
          tickSpacing: 60,
        },
        tickLower: -887272,
        tickUpper: 887272,
      },
    }),
  },
})

<<<<<<< HEAD
=======
const BASE_V2_INCREASE_PARAMS = new V2IncreasePositionRequest({
  walletAddress: '0x123',
  chainId: 1,
  protocol: Protocols.V3,
  token0Address: TEST_TOKEN_1.address,
  token1Address: TEST_TOKEN_2.address,
  independentToken: new LPToken({ tokenAddress: TEST_TOKEN_1.address, amount: '1000' }),
  slippageTolerance: 0.5,
  deadline: Date.now() + 1000000,
  simulateTransaction: true,
})

const BASE_V2_INCREASE_PARAMS_NO_SIMULATE = new V2IncreasePositionRequest({
  walletAddress: '0x123',
  chainId: 1,
  protocol: Protocols.V3,
  token0Address: TEST_TOKEN_1.address,
  token1Address: TEST_TOKEN_2.address,
  independentToken: new LPToken({ tokenAddress: TEST_TOKEN_1.address, amount: '1000' }),
  slippageTolerance: 0.5,
  deadline: Date.now() + 1000000,
  simulateTransaction: false,
})

>>>>>>> upstream/main
const BASE_INCREASE_PARAMS_NO_SIMULATE = new IncreaseLPPositionRequest({
  increaseLpPosition: {
    case: 'v3IncreaseLpPosition',
    value: new V3IncreaseLPPosition({
      walletAddress: '0x123',
      chainId: 1,
      protocols: Protocols.V3,
      independentAmount: '1000',
      independentToken: IndependentToken.TOKEN_0,
      slippageTolerance: 0.5,
      deadline: Date.now() + 1000000,
      simulateTransaction: false,
      position: {
        pool: {
          token0: TEST_TOKEN_1.address,
          token1: TEST_TOKEN_2.address,
          fee: 3000,
          tickSpacing: 60,
        },
        tickLower: -887272,
        tickUpper: 887272,
      },
    }),
  },
})

describe('useIncreasePositionDependentAmountFallback', () => {
  beforeEach(() => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns dependentAmount on success', async () => {
    useQueryMock.mockReturnValue({
      data: { dependentAmount: '123' },
      error: null,
    } as any)

<<<<<<< HEAD
    const { result } = renderHook(() => useIncreasePositionDependentAmountFallback(BASE_INCREASE_PARAMS, true))

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('increasePosition')
=======
    const { result } = renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_INCREASE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(2)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('increasePositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure
    const params = callArgs.queryKey[2] as IncreaseLPPositionRequest
    expect(params).toBeDefined()
    expect(params.increaseLpPosition.case).toBe('v3IncreaseLpPosition')
    expect(params.increaseLpPosition.value?.simulateTransaction).toBe(false)
    expect(params.increaseLpPosition.value?.walletAddress).toBe('0x123')
    expect(params.increaseLpPosition.value?.chainId).toBe(1)

    expect(callArgs.enabled).toBe(true)
    expect(callArgs.retry).toBe(false)
    expect(callArgs.refetchInterval).toBe(refetchInterval)

    expect(result.current).toBe('123')
  })

  it('only enables query if simulateTransaction is true', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)

<<<<<<< HEAD
    renderHook(() => useIncreasePositionDependentAmountFallback(BASE_INCREASE_PARAMS_NO_SIMULATE, true))

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('increasePosition')
=======
    renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_INCREASE_PARAMS_NO_SIMULATE,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(2)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('increasePositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure
    const params = callArgs.queryKey[2] as IncreaseLPPositionRequest
    expect(params).toBeDefined()
    expect(params.increaseLpPosition.case).toBe('v3IncreaseLpPosition')
    expect(params.increaseLpPosition.value?.simulateTransaction).toBe(false)

    expect(callArgs.enabled).toBe(false)
    expect(callArgs.retry).toBe(false)
    expect(callArgs.refetchInterval).toBe(refetchInterval)
  })

  it('returns undefined if no data', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)

<<<<<<< HEAD
    const { result } = renderHook(() => useIncreasePositionDependentAmountFallback(BASE_INCREASE_PARAMS, true))

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('increasePosition')
=======
    const { result } = renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_INCREASE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(2)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('increasePositionDeprecated')
>>>>>>> upstream/main

    expect(result.current).toBe(undefined)
  })

  it('updates hasErrorResponse when error changes and stops refetching', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)

    const { result, rerender } = renderHook(() =>
<<<<<<< HEAD
      useIncreasePositionDependentAmountFallback(BASE_INCREASE_PARAMS, true),
=======
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_INCREASE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
>>>>>>> upstream/main
    )

    expect(result.current).toBe(undefined)

<<<<<<< HEAD
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const firstCallArgs = useQueryMock.mock.calls[0][0]
    expect(firstCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(firstCallArgs.queryKey[1]).toBe('increasePosition')
=======
    expect(useQueryMock).toHaveBeenCalledTimes(2)
    const firstCallArgs = useQueryMock.mock.calls[0][0]
    expect(firstCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(firstCallArgs.queryKey[1]).toBe('increasePositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure
    const firstParams = firstCallArgs.queryKey[2] as IncreaseLPPositionRequest
    expect(firstParams).toBeDefined()
    expect(firstParams.increaseLpPosition.case).toBe('v3IncreaseLpPosition')
    expect(firstParams.increaseLpPosition.value?.simulateTransaction).toBe(false)

    expect(firstCallArgs.enabled).toBe(true)
    expect(firstCallArgs.retry).toBe(false)
    expect(firstCallArgs.refetchInterval).toBe(refetchInterval)

    useQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('fail'),
    } as any)

    rerender()

<<<<<<< HEAD
    // The hook will be called 3 times total:
    // 1. Initial render
    // 2. After rerender() is called
    // 3. After useEffect updates hasErrorResponse state, causing another render
    expect(useQueryMock).toHaveBeenCalledTimes(3)
    const lastCallArgs = useQueryMock.mock.calls[2][0]
    expect(lastCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(lastCallArgs.queryKey[1]).toBe('increasePosition')
=======
    // 2 calls per render × 3 renders (initial + rerender + useEffect state update) = 6
    expect(useQueryMock).toHaveBeenCalledTimes(6)
    // Last V1 call is at index 4 (3rd render, first useQuery call)
    const lastCallArgs = useQueryMock.mock.calls[4][0]
    expect(lastCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(lastCallArgs.queryKey[1]).toBe('increasePositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure remains the same
    const lastParams = lastCallArgs.queryKey[2] as IncreaseLPPositionRequest
    expect(lastParams).toBeDefined()
    expect(lastParams.increaseLpPosition.case).toBe('v3IncreaseLpPosition')
    expect(lastParams.increaseLpPosition.value?.simulateTransaction).toBe(false)

    expect(lastCallArgs.enabled).toBe(true)
    expect(lastCallArgs.retry).toBe(false)
    expect(lastCallArgs.refetchInterval).toBe(false)
  })
})

<<<<<<< HEAD
=======
describe('useIncreasePositionDependentAmountFallback (V2)', () => {
  beforeEach(() => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns dependent token amount from V2 response when exactField is TOKEN0', () => {
    const v2Response = new V2IncreasePositionResponse({
      token0: new LPToken({ tokenAddress: TEST_TOKEN_1.address, amount: '500' }),
      token1: new LPToken({ tokenAddress: TEST_TOKEN_2.address, amount: '750' }),
    })
    useQueryMock.mockReturnValue({
      data: v2Response,
      error: null,
    } as any)

    const { result } = renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_V2_INCREASE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    // When TOKEN0 is exact, the dependent token is token1
    expect(result.current).toBe('750')
  })

  it('returns dependent token amount from V2 response when exactField is TOKEN1', () => {
    const v2Response = new V2IncreasePositionResponse({
      token0: new LPToken({ tokenAddress: TEST_TOKEN_1.address, amount: '500' }),
      token1: new LPToken({ tokenAddress: TEST_TOKEN_2.address, amount: '750' }),
    })
    useQueryMock.mockReturnValue({
      data: v2Response,
      error: null,
    } as any)

    const { result } = renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_V2_INCREASE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN1,
      }),
    )

    // When TOKEN1 is exact, the dependent token is token0
    expect(result.current).toBe('500')
  })

  it('uses V2 query path (not V1) for V2 request params', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)

    renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_V2_INCREASE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(2)

    // V1 query (first call) should be disabled
    const v1CallArgs = useQueryMock.mock.calls[0][0]
    expect(v1CallArgs.enabled).toBe(false)

    // V2 query (second call) should be enabled
    const v2CallArgs = useQueryMock.mock.calls[1][0]
    expect(v2CallArgs.enabled).toBe(true)
    expect(v2CallArgs.queryKey[1]).toBe('increasePosition')
  })

  it('only enables V2 query if simulateTransaction is true', () => {
    renderHook(() =>
      useIncreasePositionDependentAmountFallback({
        queryParams: BASE_V2_INCREASE_PARAMS_NO_SIMULATE,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(2)

    // V1 query should be disabled (not a V1 request)
    const v1CallArgs = useQueryMock.mock.calls[0][0]
    expect(v1CallArgs.enabled).toBe(false)

    // V2 query should also be disabled (simulateTransaction is false)
    const v2CallArgs = useQueryMock.mock.calls[1][0]
    expect(v2CallArgs.enabled).toBe(false)
  })
})

>>>>>>> upstream/main
describe('useCreatePositionDependentAmountFallback', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns dependentAmount on success', async () => {
    useQueryMock.mockReturnValue({
      data: { dependentAmount: '123' },
      error: null,
    } as any)

<<<<<<< HEAD
    const { result } = renderHook(() => useCreatePositionDependentAmountFallback(BASE_CREATE_PARAMS, true))

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('createPosition')
=======
    const { result } = renderHook(() =>
      useCreatePositionDependentAmountFallback({
        queryParams: BASE_CREATE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    // Three useQuery calls (v1 deprecated + classic + v2)
    expect(useQueryMock).toHaveBeenCalledTimes(3)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('createPositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure
    const params = callArgs.queryKey[2] as CreateLPPositionRequest
    expect(params).toBeDefined()
    expect(params.createLpPosition.case).toBe('v3CreateLpPosition')
    expect(params.createLpPosition.value?.simulateTransaction).toBe(false)
    expect(params.createLpPosition.value?.walletAddress).toBe('0x123')
    expect(params.createLpPosition.value?.chainId).toBe(1)

    expect(callArgs.enabled).toBe(true)
    expect(callArgs.retry).toBe(false)
    expect(callArgs.refetchInterval).toBe(refetchInterval)

    expect(result.current).toBe('123')
  })

  it('only enables query if simulateTransaction is true', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)

<<<<<<< HEAD
    renderHook(() => useCreatePositionDependentAmountFallback(BASE_CREATE_PARAMS_NO_SIMULATE, true))

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('createPosition')
=======
    renderHook(() =>
      useCreatePositionDependentAmountFallback({
        queryParams: BASE_CREATE_PARAMS_NO_SIMULATE,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(3)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('createPositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure
    const params = callArgs.queryKey[2] as CreateLPPositionRequest
    expect(params).toBeDefined()
    expect(params.createLpPosition.case).toBe('v3CreateLpPosition')
    expect(params.createLpPosition.value?.simulateTransaction).toBe(false)

    expect(callArgs.enabled).toBe(false)
    expect(callArgs.retry).toBe(false)
    expect(callArgs.refetchInterval).toBe(refetchInterval)
  })

  it('returns undefined if no data', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)
<<<<<<< HEAD
    const { result } = renderHook(() => useCreatePositionDependentAmountFallback(BASE_CREATE_PARAMS, true))

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('createPosition')
=======
    const { result } = renderHook(() =>
      useCreatePositionDependentAmountFallback({
        queryParams: BASE_CREATE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(3)
    const callArgs = useQueryMock.mock.calls[0][0]
    expect(callArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(callArgs.queryKey[1]).toBe('createPositionDeprecated')
>>>>>>> upstream/main

    expect(result.current).toBe(undefined)
  })

  it('updates hasErrorResponse when error changes and stops refetching', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
    } as any)

<<<<<<< HEAD
    const { result, rerender } = renderHook(() => useCreatePositionDependentAmountFallback(BASE_CREATE_PARAMS, true))

    expect(result.current).toBe(undefined)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const firstCallArgs = useQueryMock.mock.calls[0][0]
    expect(firstCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(firstCallArgs.queryKey[1]).toBe('createPosition')
=======
    const { result, rerender } = renderHook(() =>
      useCreatePositionDependentAmountFallback({
        queryParams: BASE_CREATE_PARAMS,
        isQueryEnabled: true,
        exactField: PositionField.TOKEN0,
      }),
    )

    expect(result.current).toBe(undefined)

    // Three useQuery calls per render (v1 deprecated + classic + v2)
    expect(useQueryMock).toHaveBeenCalledTimes(3)
    const firstCallArgs = useQueryMock.mock.calls[0][0]
    expect(firstCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(firstCallArgs.queryKey[1]).toBe('createPositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure
    const firstParams = firstCallArgs.queryKey[2] as CreateLPPositionRequest
    expect(firstParams).toBeDefined()
    expect(firstParams.createLpPosition.case).toBe('v3CreateLpPosition')
    expect(firstParams.createLpPosition.value?.simulateTransaction).toBe(false)

    expect(firstCallArgs.enabled).toBe(true)
    expect(firstCallArgs.retry).toBe(false)
    expect(firstCallArgs.refetchInterval).toBe(refetchInterval)

    useQueryMock.mockReturnValue({
      data: undefined,
<<<<<<< HEAD
      error: new Error('fail'),
=======
      error: new Error('fallback fail'),
>>>>>>> upstream/main
    } as any)

    rerender()

<<<<<<< HEAD
    // The hook will be called 3 times total:
    // 1. Initial render
    // 2. After rerender() is called
    // 3. After useEffect updates hasErrorResponse state, causing another render
    expect(useQueryMock).toHaveBeenCalledTimes(3)
    const lastCallArgs = useQueryMock.mock.calls[2][0]
    expect(lastCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(lastCallArgs.queryKey[1]).toBe('createPosition')
=======
    // 3 calls per render × 3 renders (initial + rerender + useEffect state update) = 9
    expect(useQueryMock).toHaveBeenCalledTimes(9)
    // Last v1 call is at index 6 (3rd render, first useQuery call)
    const lastCallArgs = useQueryMock.mock.calls[6][0]
    expect(lastCallArgs.queryKey[0]).toBe(ReactQueryCacheKey.LiquidityService)
    expect(lastCallArgs.queryKey[1]).toBe('createPositionDeprecated')
>>>>>>> upstream/main

    // Verify params structure remains the same
    const lastParams = lastCallArgs.queryKey[2] as CreateLPPositionRequest
    expect(lastParams).toBeDefined()
    expect(lastParams.createLpPosition.case).toBe('v3CreateLpPosition')
    expect(lastParams.createLpPosition.value?.simulateTransaction).toBe(false)

    expect(lastCallArgs.enabled).toBe(true)
    expect(lastCallArgs.retry).toBe(false)
    expect(lastCallArgs.refetchInterval).toBe(false)
  })
})

describe('useUpdatedAmountsFromDependentAmount', () => {
  const token0CurrencyAmount = CurrencyAmount.fromRawAmount(TEST_TOKEN_1, JSBI.BigInt(500000000))
  const token1CurrencyAmount = CurrencyAmount.fromRawAmount(TEST_TOKEN_2, JSBI.BigInt(750000000))
  const token0USDValue = CurrencyAmount.fromRawAmount(USDC_MAINNET, JSBI.BigInt(100))
  const token1USDValue = CurrencyAmount.fromRawAmount(USDC_MAINNET, JSBI.BigInt(200))
  const token0FormattedAmount = '0.5'
  const token1FormattedAmount = '0.75'
  const updatedDependentAmount = '300000000000000000'
  const updatedDependentAmountUSDValue = CurrencyAmount.fromRawAmount(
    USDC_MAINNET,
    JSBI.multiply(JSBI.BigInt(updatedDependentAmount), JSBI.BigInt(100)),
  )

  const baseProps = {
    token0: TEST_TOKEN_1,
    token1: TEST_TOKEN_2,
    currencyAmounts: {
      [PositionField.TOKEN0]: token0CurrencyAmount,
      [PositionField.TOKEN1]: token1CurrencyAmount,
    },
    currencyAmountsUSDValue: {
      [PositionField.TOKEN0]: token0USDValue,
      [PositionField.TOKEN1]: token1USDValue,
    },
    formattedAmounts: {
      [PositionField.TOKEN0]: token0FormattedAmount,
      [PositionField.TOKEN1]: token1FormattedAmount,
    },
    deposit0Disabled: false,
    deposit1Disabled: false,
  }

  it('returns updated values for dependentAmount0 (exactField TOKEN1)', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        dependentAmount: updatedDependentAmount,
        exactField: PositionField.TOKEN1,
      }),
    )
    expect(result.current).toEqual({
      updatedFormattedAmounts: {
        [PositionField.TOKEN0]: '0.3',
        [PositionField.TOKEN1]: token1FormattedAmount,
      },
      updatedUSDAmounts: {
        [PositionField.TOKEN0]: updatedDependentAmountUSDValue,
        [PositionField.TOKEN1]: token1USDValue,
      },
      updatedCurrencyAmounts: {
        [PositionField.TOKEN0]: CurrencyAmount.fromRawAmount(TEST_TOKEN_1, JSBI.BigInt(updatedDependentAmount)),
        [PositionField.TOKEN1]: token1CurrencyAmount,
      },
      updatedDeposit0Disabled: false,
      updatedDeposit1Disabled: false,
    })
  })

  it('returns updated values for dependentAmount1 (exactField TOKEN0)', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        dependentAmount: updatedDependentAmount,
        exactField: PositionField.TOKEN0,
      }),
    )
    expect(result.current).toEqual({
      updatedFormattedAmounts: {
        [PositionField.TOKEN0]: token0FormattedAmount,
        [PositionField.TOKEN1]: '0.3',
      },
      updatedUSDAmounts: {
        [PositionField.TOKEN0]: token0USDValue,
        [PositionField.TOKEN1]: updatedDependentAmountUSDValue,
      },
      updatedCurrencyAmounts: {
        [PositionField.TOKEN0]: token0CurrencyAmount,
        [PositionField.TOKEN1]: CurrencyAmount.fromRawAmount(TEST_TOKEN_2, JSBI.BigInt(updatedDependentAmount)),
      },
      updatedDeposit0Disabled: false,
      updatedDeposit1Disabled: false,
    })
  })

  it('returns original values if neither dependentAmount0 nor dependentAmount1 is set', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        dependentAmount: undefined,
        exactField: PositionField.TOKEN0,
      }),
    )
    expect(result.current).toEqual({
      updatedFormattedAmounts: {
        [PositionField.TOKEN0]: token0FormattedAmount,
        [PositionField.TOKEN1]: token1FormattedAmount,
      },
      updatedUSDAmounts: {
        [PositionField.TOKEN0]: token0USDValue,
        [PositionField.TOKEN1]: token1USDValue,
      },
      updatedCurrencyAmounts: {
        [PositionField.TOKEN0]: token0CurrencyAmount,
        [PositionField.TOKEN1]: token1CurrencyAmount,
      },
      updatedDeposit0Disabled: false,
      updatedDeposit1Disabled: false,
    })
  })

  it('disables deposit0 if dependentAmount0 is not greater than 0', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        dependentAmount: '0',
        exactField: PositionField.TOKEN1,
      }),
    )
    expect(result.current.updatedDeposit0Disabled).toBe(true)
    expect(result.current.updatedDeposit1Disabled).toBe(false)
  })

  it('disables deposit1 if dependentAmount1 is not greater than 0', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        dependentAmount: '0',
        exactField: PositionField.TOKEN0,
      }),
    )
    expect(result.current.updatedDeposit0Disabled).toBe(false)
    expect(result.current.updatedDeposit1Disabled).toBe(true)
  })

  it('enables deposit1 if dependentAmount1 is greater than 0', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        deposit0Disabled: true,
        deposit1Disabled: true,
        dependentAmount: '1',
        exactField: PositionField.TOKEN0,
      }),
    )
    expect(result.current.updatedDeposit0Disabled).toBe(true)
    expect(result.current.updatedDeposit1Disabled).toBe(false)
  })

  it('respects deposit0Disabled and deposit1Disabled props in fallback', () => {
    const { result } = renderHook(() =>
      useUpdatedAmountsFromDependentAmount({
        ...baseProps,
        deposit0Disabled: true,
        deposit1Disabled: true,
        dependentAmount: undefined,
        exactField: PositionField.TOKEN0,
      }),
    )
    expect(result.current.updatedDeposit0Disabled).toBe(true)
    expect(result.current.updatedDeposit1Disabled).toBe(true)
  })
})
