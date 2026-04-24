import { SharedEventName } from '@luxamm/analytics-events'
import { useCallback } from 'react'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { ElementName, ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { isWebPlatform } from '@l.x/utils/src/platform'

export function useTokenDetailsNavigation(currency: Maybe<CurrencyInfo>, onClose?: () => void): () => void {
  const { navigateToTokenDetails } = useLuxContext()

  return useCallback(() => {
    if (currency) {
      sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
        element: ElementName.TokenItem,
        modal: ModalName.TransactionDetails,
      })

      navigateToTokenDetails(currency.currencyId)
      if (!isWebPlatform) {
        onClose?.()
      }
    }
  }, [currency, navigateToTokenDetails, onClose])
}
