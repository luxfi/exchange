import { NavigationContainerRef } from '@react-navigation/native'
import { expectSaga } from 'redux-saga-test-plan'
import { exploreNavigationRef } from 'src/app/navigation/navigationRef'
import { navigate } from 'src/app/navigation/rootNavigation'
import { ExploreStackParamList } from 'src/app/navigation/types'
import { handleTopTokensDeepLink } from 'src/features/deepLinking/handleTopTokensDeepLink'
import { dismissAllModalsBeforeNavigation } from 'src/features/deepLinking/utils'
<<<<<<< HEAD
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { MobileScreens } from '@l.x/lx/src/types/screens/mobile'
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { MobileScreens } from 'uniswap/src/types/screens/mobile'
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

// Mock the navigation ref
jest.mock('src/app/navigation/navigationRef', () => ({
  exploreNavigationRef: {
    current: null,
  },
}))

// Mock the logger
jest.mock('utilities/src/logger/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

// Mock the dismissAllModalsBeforeNavigation function
jest.mock('src/features/deepLinking/utils', () => ({
  dismissAllModalsBeforeNavigation: jest.fn(),
}))

describe('handleTopTokensDeepLink', () => {
<<<<<<< HEAD
  const unichainExploreUrl = 'https://app.lux.org/explore/tokens/unichain'
=======
  const unichainExploreUrl = 'https://app.uniswap.org/explore/tokens/unichain'
>>>>>>> upstream/main
  const unichainChainId = UniverseChainId.Unichain

  const mockedExploreNavigationRef = exploreNavigationRef as jest.Mocked<typeof exploreNavigationRef>
  const mockedLogger = logger as jest.Mocked<typeof logger>

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset navigation ref state
    mockedExploreNavigationRef.current = null
  })

  it('should navigate to explore modal with deep link parameters', () => {
    return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: unichainExploreUrl })
      .call(dismissAllModalsBeforeNavigation)
      .call(navigate, ModalName.Explore, {
        screen: MobileScreens.Explore,
        params: {
          showFavorites: false,
          orderByMetric: undefined,
          chainId: unichainChainId,
        },
      })
      .run()
  })

  it('should handle valid metric parameter in URL', () => {
<<<<<<< HEAD
    const urlWithMetric = 'https://app.lux.org/explore/tokens/unichain?metric=volume'
=======
    const urlWithMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=volume'
>>>>>>> upstream/main
    return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMetric })
      .call(dismissAllModalsBeforeNavigation)
      .call(navigate, ModalName.Explore, {
        screen: MobileScreens.Explore,
        params: {
          showFavorites: false,
          orderByMetric: 'VOLUME',
          chainId: unichainChainId,
        },
      })
      .run()
  })

  it('should navigate to explore modal without chainId', () => {
<<<<<<< HEAD
    const urlWithoutChainId = 'https://app.lux.org/explore/tokens'
=======
    const urlWithoutChainId = 'https://app.uniswap.org/explore/tokens'
>>>>>>> upstream/main
    return expectSaga(handleTopTokensDeepLink, { chainId: undefined, url: urlWithoutChainId })
      .call(dismissAllModalsBeforeNavigation)
      .call(navigate, ModalName.Explore, {
        screen: MobileScreens.Explore,
        params: {
          showFavorites: false,
          orderByMetric: undefined,
          chainId: undefined,
        },
      })
      .run()
  })

  it('should handle metric parameter in URL without chainId', () => {
<<<<<<< HEAD
    const urlWithMetricNoChainId = 'https://app.lux.org/explore/tokens?metric=market_cap'
=======
    const urlWithMetricNoChainId = 'https://app.uniswap.org/explore/tokens?metric=market_cap'
>>>>>>> upstream/main
    return expectSaga(handleTopTokensDeepLink, { chainId: undefined, url: urlWithMetricNoChainId })
      .call(dismissAllModalsBeforeNavigation)
      .call(navigate, ModalName.Explore, {
        screen: MobileScreens.Explore,
        params: {
          showFavorites: false,
          orderByMetric: 'MARKET_CAP',
          chainId: undefined,
        },
      })
      .run()
  })

  it('should use exploreNavigationRef when it is focused', async () => {
    // Setup the navigation ref to be focused
    const mockNavigate = jest.fn()
    const mockIsFocused = jest.fn().mockReturnValue(true)
    mockedExploreNavigationRef.current = {
      isFocused: mockIsFocused,
      navigate: mockNavigate,
    } as unknown as NavigationContainerRef<ExploreStackParamList>

<<<<<<< HEAD
    const urlWithMetric = 'https://app.lux.org/explore/tokens/unichain?metric=volume'
=======
    const urlWithMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=volume'
>>>>>>> upstream/main

    await expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMetric })
      .not.call(dismissAllModalsBeforeNavigation)
      .not.call(navigate, ModalName.Explore, expect.anything())
      .run()

    // Verify that the navigation ref's navigate method was called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith(MobileScreens.Explore, {
      showFavorites: false,
      orderByMetric: 'VOLUME',
      chainId: unichainChainId,
    })
  })

  describe('error handling', () => {
    it('should continue execution when navigation throws error and log it', async () => {
      // Mock navigate to throw an error
      const navigateError = new Error('Navigation failed')

      await expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: unichainExploreUrl })
        .provide({
          call: (effect, next) => {
            if (effect.fn === navigate) {
              throw navigateError
            }
            return next()
          },
        })
        .call(dismissAllModalsBeforeNavigation)
        .call(mockedLogger.error, navigateError, {
          tags: { file: 'handleDeepLinkSaga', function: 'handleTopTokensDeepLink' },
          extra: { chainId: unichainChainId, url: unichainExploreUrl },
        })
        .run({ silenceTimeout: true })
    })

    it('should continue execution when exploreNavigationRef.navigate throws error and log it', async () => {
      // Setup the navigation ref to be focused and throw an error
      const navError = new Error('Navigation ref failed')
      const mockNavigate = jest.fn().mockImplementation(() => {
        throw navError
      })
      const mockIsFocused = jest.fn().mockReturnValue(true)
      mockedExploreNavigationRef.current = {
        isFocused: mockIsFocused,
        navigate: mockNavigate,
      } as unknown as NavigationContainerRef<ExploreStackParamList>

      await expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: unichainExploreUrl })
        .not.call(dismissAllModalsBeforeNavigation)
        .call(mockedLogger.error, navError, {
          tags: { file: 'handleDeepLinkSaga', function: 'handleTopTokensDeepLink' },
          extra: { chainId: unichainChainId, url: unichainExploreUrl },
        })
        .run({ silenceTimeout: true })
    })
  })

  describe('metric validation', () => {
    it('should handle invalid metric values and set orderByMetric to undefined', () => {
<<<<<<< HEAD
      const urlWithInvalidMetric = 'https://app.lux.org/explore/tokens/unichain?metric=invalid_metric'
=======
      const urlWithInvalidMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=invalid_metric'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithInvalidMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle empty metric parameter and set orderByMetric to undefined', () => {
<<<<<<< HEAD
      const urlWithEmptyMetric = 'https://app.lux.org/explore/tokens/unichain?metric='
=======
      const urlWithEmptyMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric='
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithEmptyMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle case-insensitive valid metrics', () => {
      const testCases = [
        {
<<<<<<< HEAD
          url: 'https://app.lux.org/explore/tokens/unichain?metric=total_value_locked',
          expected: 'TOTAL_VALUE_LOCKED',
        },
        { url: 'https://app.lux.org/explore/tokens/unichain?metric=market_cap', expected: 'MARKET_CAP' },
        {
          url: 'https://app.lux.org/explore/tokens/unichain?metric=price_percent_change_1_day_asc',
          expected: 'PRICE_PERCENT_CHANGE_1_DAY_ASC',
        },
        {
          url: 'https://app.lux.org/explore/tokens/unichain?metric=price_percent_change_1_day_desc',
=======
          url: 'https://app.uniswap.org/explore/tokens/unichain?metric=total_value_locked',
          expected: 'TOTAL_VALUE_LOCKED',
        },
        { url: 'https://app.uniswap.org/explore/tokens/unichain?metric=market_cap', expected: 'MARKET_CAP' },
        {
          url: 'https://app.uniswap.org/explore/tokens/unichain?metric=price_percent_change_1_day_asc',
          expected: 'PRICE_PERCENT_CHANGE_1_DAY_ASC',
        },
        {
          url: 'https://app.uniswap.org/explore/tokens/unichain?metric=price_percent_change_1_day_desc',
>>>>>>> upstream/main
          expected: 'PRICE_PERCENT_CHANGE_1_DAY_DESC',
        },
      ]

      return Promise.all(
        testCases.map(({ url, expected }) =>
          expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url })
            .call(dismissAllModalsBeforeNavigation)
            .call(navigate, ModalName.Explore, {
              screen: MobileScreens.Explore,
              params: {
                showFavorites: false,
                orderByMetric: expected,
                chainId: unichainChainId,
              },
            })
            .run(),
        ),
      )
    })

    it('should reject TRENDING metric (excluded CustomRankingType)', () => {
<<<<<<< HEAD
      const urlWithTrendingMetric = 'https://app.lux.org/explore/tokens/unichain?metric=trending'
=======
      const urlWithTrendingMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=trending'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithTrendingMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle mixed case metrics correctly', () => {
<<<<<<< HEAD
      const urlWithMixedCaseMetric = 'https://app.lux.org/explore/tokens/unichain?metric=VoLuMe'
=======
      const urlWithMixedCaseMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=VoLuMe'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMixedCaseMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: 'VOLUME',
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle numeric metric values as invalid', () => {
<<<<<<< HEAD
      const urlWithNumericMetric = 'https://app.lux.org/explore/tokens/unichain?metric=123'
=======
      const urlWithNumericMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=123'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithNumericMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle special characters in metric as invalid', () => {
<<<<<<< HEAD
      const urlWithSpecialCharsMetric = 'https://app.lux.org/explore/tokens/unichain?metric=volume@#$'
=======
      const urlWithSpecialCharsMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=volume@#$'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithSpecialCharsMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle various invalid metric formats', () => {
      const testCases = [
<<<<<<< HEAD
        { url: 'https://app.lux.org/explore/tokens/unichain?metric=true', desc: 'boolean-like' },
        { url: 'https://app.lux.org/explore/tokens/unichain?metric=volume,market_cap', desc: 'array-like' },
        {
          url: "https://app.lux.org/explore/tokens/unichain?metric=volume'; DROP TABLE--",
          desc: 'SQL injection-like',
        },
        { url: `https://app.lux.org/explore/tokens/unichain?metric=${'a'.repeat(100)}`, desc: 'very long' },
=======
        { url: 'https://app.uniswap.org/explore/tokens/unichain?metric=true', desc: 'boolean-like' },
        { url: 'https://app.uniswap.org/explore/tokens/unichain?metric=volume,market_cap', desc: 'array-like' },
        {
          url: "https://app.uniswap.org/explore/tokens/unichain?metric=volume'; DROP TABLE--",
          desc: 'SQL injection-like',
        },
        { url: `https://app.uniswap.org/explore/tokens/unichain?metric=${'a'.repeat(100)}`, desc: 'very long' },
>>>>>>> upstream/main
      ]

      return Promise.all(
        testCases.map(({ url }) =>
          expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url })
            .call(dismissAllModalsBeforeNavigation)
            .call(navigate, ModalName.Explore, {
              screen: MobileScreens.Explore,
              params: {
                showFavorites: false,
                orderByMetric: undefined,
                chainId: unichainChainId,
              },
            })
            .run(),
        ),
      )
    })

    it('should handle URL encoded metric values correctly', () => {
<<<<<<< HEAD
      const urlWithEncodedMetric = 'https://app.lux.org/explore/tokens/unichain?metric=MARKET%5FCAP'
=======
      const urlWithEncodedMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=MARKET%5FCAP'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithEncodedMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: 'MARKET_CAP',
            chainId: unichainChainId,
          },
        })
        .run()
    })
  })

  describe('getValidRankingType function edge cases', () => {
    it('should return undefined for falsy metrics (null, empty, whitespace)', () => {
      const testCases = [
<<<<<<< HEAD
        'https://app.lux.org/explore/tokens/unichain?other=value', // null metric
        'https://app.lux.org/explore/tokens/unichain?metric=', // empty
        'https://app.lux.org/explore/tokens/unichain?metric=%20%20%20', // whitespace
=======
        'https://app.uniswap.org/explore/tokens/unichain?other=value', // null metric
        'https://app.uniswap.org/explore/tokens/unichain?metric=', // empty
        'https://app.uniswap.org/explore/tokens/unichain?metric=%20%20%20', // whitespace
>>>>>>> upstream/main
      ]

      return Promise.all(
        testCases.map((url) =>
          expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url })
            .call(dismissAllModalsBeforeNavigation)
            .call(navigate, ModalName.Explore, {
              screen: MobileScreens.Explore,
              params: {
                showFavorites: false,
                orderByMetric: undefined,
                chainId: unichainChainId,
              },
            })
            .run(),
        ),
      )
    })

    it('should convert valid lowercase metric to uppercase', () => {
<<<<<<< HEAD
      const urlWithLowercaseMetric = 'https://app.lux.org/explore/tokens/unichain?metric=volume'
=======
      const urlWithLowercaseMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=volume'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithLowercaseMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: 'VOLUME',
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle mixed case metric conversion', () => {
<<<<<<< HEAD
      const urlWithMixedCaseMetric = 'https://app.lux.org/explore/tokens/unichain?metric=mArKeT_cAp'
=======
      const urlWithMixedCaseMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=mArKeT_cAp'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMixedCaseMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: 'MARKET_CAP',
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should return undefined for unsupported metric values', () => {
<<<<<<< HEAD
      const urlWithUnsupportedMetric = 'https://app.lux.org/explore/tokens/unichain?metric=unsupported_metric'
=======
      const urlWithUnsupportedMetric = 'https://app.uniswap.org/explore/tokens/unichain?metric=unsupported_metric'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithUnsupportedMetric })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should reject TRENDING metric in any case format', () => {
      const testCases = [
<<<<<<< HEAD
        'https://app.lux.org/explore/tokens/unichain?metric=trending',
        'https://app.lux.org/explore/tokens/unichain?metric=TrEnDiNg',
=======
        'https://app.uniswap.org/explore/tokens/unichain?metric=trending',
        'https://app.uniswap.org/explore/tokens/unichain?metric=TrEnDiNg',
>>>>>>> upstream/main
      ]

      return Promise.all(
        testCases.map((url) =>
          expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url })
            .call(dismissAllModalsBeforeNavigation)
            .call(navigate, ModalName.Explore, {
              screen: MobileScreens.Explore,
              params: {
                showFavorites: false,
                orderByMetric: undefined,
                chainId: unichainChainId,
              },
            })
            .run(),
        ),
      )
    })

    it('should handle valid RankingType values - all uppercase variants', () => {
      const validMetrics = ['VOLUME', 'MARKET_CAP', 'TOTAL_VALUE_LOCKED']

      return Promise.all(
        validMetrics.map((metric) => {
<<<<<<< HEAD
          const urlWithMetric = `https://app.lux.org/explore/tokens/unichain?metric=${metric}`
=======
          const urlWithMetric = `https://app.uniswap.org/explore/tokens/unichain?metric=${metric}`
>>>>>>> upstream/main
          return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMetric })
            .call(dismissAllModalsBeforeNavigation)
            .call(navigate, ModalName.Explore, {
              screen: MobileScreens.Explore,
              params: {
                showFavorites: false,
                orderByMetric: metric,
                chainId: unichainChainId,
              },
            })
            .run()
        }),
      )
    })

    it('should handle valid CustomRankingType values except TRENDING', () => {
      const validCustomMetrics = ['PRICE_PERCENT_CHANGE_1_DAY_ASC', 'PRICE_PERCENT_CHANGE_1_DAY_DESC']

      return Promise.all(
        validCustomMetrics.map((metric) => {
<<<<<<< HEAD
          const urlWithMetric = `https://app.lux.org/explore/tokens/unichain?metric=${metric}`
=======
          const urlWithMetric = `https://app.uniswap.org/explore/tokens/unichain?metric=${metric}`
>>>>>>> upstream/main
          return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMetric })
            .call(dismissAllModalsBeforeNavigation)
            .call(navigate, ModalName.Explore, {
              screen: MobileScreens.Explore,
              params: {
                showFavorites: false,
                orderByMetric: metric,
                chainId: unichainChainId,
              },
            })
            .run()
        }),
      )
    })
  })

  describe('URL edge cases', () => {
    it('should handle URL without search params', () => {
<<<<<<< HEAD
      const basicUrl = 'https://app.lux.org/explore/tokens/unichain'
=======
      const basicUrl = 'https://app.uniswap.org/explore/tokens/unichain'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: basicUrl })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: undefined,
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle URL with multiple query parameters', () => {
<<<<<<< HEAD
      const urlWithMultipleParams = 'https://app.lux.org/explore/tokens/unichain?metric=volume&other=value&foo=bar'
=======
      const urlWithMultipleParams = 'https://app.uniswap.org/explore/tokens/unichain?metric=volume&other=value&foo=bar'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithMultipleParams })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: 'VOLUME',
            chainId: unichainChainId,
          },
        })
        .run()
    })

    it('should handle URL with fragment identifier', () => {
<<<<<<< HEAD
      const urlWithFragment = 'https://app.lux.org/explore/tokens/unichain?metric=market_cap#section'
=======
      const urlWithFragment = 'https://app.uniswap.org/explore/tokens/unichain?metric=market_cap#section'
>>>>>>> upstream/main
      return expectSaga(handleTopTokensDeepLink, { chainId: unichainChainId, url: urlWithFragment })
        .call(dismissAllModalsBeforeNavigation)
        .call(navigate, ModalName.Explore, {
          screen: MobileScreens.Explore,
          params: {
            showFavorites: false,
            orderByMetric: 'MARKET_CAP',
            chainId: unichainChainId,
          },
        })
        .run()
    })
  })
})
