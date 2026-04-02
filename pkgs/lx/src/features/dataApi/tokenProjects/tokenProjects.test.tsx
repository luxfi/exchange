import { waitFor } from '@testing-library/react-native'
import { useTokenProjects } from 'lx/src/features/dataApi/tokenProjects/tokenProjects'
import { tokenProjectToCurrencyInfos } from 'lx/src/features/dataApi/tokenProjects/utils/tokenProjectToCurrencyInfos'
import { SAMPLE_CURRENCY_ID_1, usdcTokenProject } from 'lx/src/test/fixtures'
import { renderHook } from 'lx/src/test/test-utils'
import { queryResolvers } from 'lx/src/test/utils'

describe(useTokenProjects, () => {
  it('returns undefined when there is no data', async () => {
    const { resolvers } = queryResolvers({
      tokenProjects: () => undefined,
    })
    const { result } = renderHook(() => useTokenProjects([SAMPLE_CURRENCY_ID_1]), {
      resolvers,
    })

    await waitFor(() => {
      expect(result.current.loading).toEqual(false)
      expect(result.current.data).toBe(undefined)
    })
  })

  it('renders without error', async () => {
    const { resolvers, resolved } = queryResolvers({
      tokenProjects: () => [usdcTokenProject()],
    })
    const { result } = renderHook(() => useTokenProjects([SAMPLE_CURRENCY_ID_1]), {
      resolvers,
    })

    const expected = tokenProjectToCurrencyInfos(await resolved.tokenProjects)
    // GraphQL converts undefined to null, so we need to do the same for comparison
    const expectedWithNull = expected.map((item) => ({
      ...item,
      isBridged: item.isBridged ?? null,
      bridgedWithdrawalInfo: item.bridgedWithdrawalInfo ?? null,
    }))

    await waitFor(() => {
      expect(result.current.loading).toEqual(false)
      expect(result.current.data).toEqual(expectedWithNull)
    })
  })
})
