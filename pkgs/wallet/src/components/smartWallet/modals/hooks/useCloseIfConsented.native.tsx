import { useFocusEffect } from '@react-navigation/core'
import { useCallback } from 'react'
import { CloseIfConsentedProps } from '@luxfi/wallet/src/components/smartWallet/modals/hooks/useCloseIfConsented'
import { useHasSmartWalletConsent } from '@luxfi/wallet/src/features/wallet/hooks'

export function useCloseIfConsented({ onClose }: CloseIfConsentedProps): void {
  const hasSmartWalletConsent = useHasSmartWalletConsent()

  useFocusEffect(
    useCallback(() => {
      if (hasSmartWalletConsent) {
        onClose()
      }
    }, [hasSmartWalletConsent, onClose]),
  )
}
