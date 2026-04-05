import { stringify } from 'qs'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import type { To } from 'react-router'
import { useLocation } from 'react-router'
<<<<<<< HEAD
import { useUrlContext } from '@l.x/lx/src/contexts/UrlContext'
import { FiatCurrency } from '@l.x/lx/src/features/fiatCurrency/constants'
import { useAppFiatCurrency } from '@l.x/lx/src/features/fiatCurrency/hooks'
import { setCurrentFiatCurrency } from '@l.x/lx/src/features/settings/slice'
import { InterfaceEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
=======
import { useUrlContext } from 'uniswap/src/contexts/UrlContext'
import { FiatCurrency } from 'uniswap/src/features/fiatCurrency/constants'
import { useAppFiatCurrency } from 'uniswap/src/features/fiatCurrency/hooks'
import { setCurrentFiatCurrency } from 'uniswap/src/features/settings/slice'
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
>>>>>>> upstream/main

export function useLocalCurrencyLinkProps(localCurrency?: FiatCurrency): {
  to?: To
  onClick?: () => void
} {
  const dispatch = useDispatch()
  const location = useLocation()
  const { useParsedQueryString } = useUrlContext()
  const qs = useParsedQueryString()
  const activeLocalCurrency = useAppFiatCurrency()

  return useMemo(
    () =>
      !localCurrency
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, cur: localCurrency }),
            },
            onClick: () => {
              dispatch(setCurrentFiatCurrency(localCurrency))
              sendAnalyticsEvent(InterfaceEventName.LocalCurrencySelected, {
                previous_local_currency: activeLocalCurrency,
                new_local_currency: localCurrency,
              })
            },
          },
    [localCurrency, location, qs, dispatch, activeLocalCurrency],
  )
}
