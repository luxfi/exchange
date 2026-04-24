import { useMemo } from 'react'
import { useFiatOnRampAggregatorTransferServiceProvidersQuery } from '@l.x/lx/src/features/fiatOnRamp/hooks/useFiatOnRampQueries'
import { FORServiceProvider } from '@l.x/lx/src/features/fiatOnRamp/types'

export function useCexTransferProviders(params?: { isDisabled?: boolean }): FORServiceProvider[] {
  const { data } = useFiatOnRampAggregatorTransferServiceProvidersQuery(undefined, {
    skip: params?.isDisabled,
  })

  return useMemo(() => {
    if (!data) {
      return []
    }

    return data.serviceProviders
  }, [data])
}
