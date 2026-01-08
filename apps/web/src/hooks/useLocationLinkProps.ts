import { stringify } from 'qs'
import { useMemo } from 'react'
import type { To } from 'react-router'
import { useLocation } from 'react-router'
import { useUrlContext } from 'lx/src/contexts/UrlContext'
import { Locale } from 'lx/src/features/language/constants'

export function useLocationLinkProps(locale: Locale | null): {
  to?: To
} {
  const location = useLocation()
  const { useParsedQueryString } = useUrlContext()
  const qs = useParsedQueryString()

  return useMemo(
    () =>
      !locale
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, lng: locale }),
            },
          },
    [location, qs, locale],
  )
}
