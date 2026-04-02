import { SharedEventName } from '@luxamm/analytics-events'
import { useCallback } from 'react'
import { useLuxContext } from 'lx/src/contexts/LuxContext'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { ElementName, ModalName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { isWebPlatform } from 'utilities/src/platform'

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
