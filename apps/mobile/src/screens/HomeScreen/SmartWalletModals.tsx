import { useIsFocused } from '@react-navigation/native'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useCallback, useMemo, useState } from 'react'
import { Video } from 'react-native-video'
import { useDispatch, useSelector } from 'react-redux'
import { navigate } from 'src/app/navigation/rootNavigation'
import { useBiometricAppSettings } from 'src/features/biometrics/useBiometricAppSettings'
import { useBiometricPrompt } from 'src/features/biometricsSettings/hooks'
import { useHomeScreenState } from 'src/screens/HomeScreen/useHomeScreenState'
import { Flex, Image } from '@luxfi/ui/src'
import { SMART_WALLET_UPGRADE_FALLBACK, SMART_WALLET_UPGRADE_VIDEO } from '@luxfi/ui/src/assets'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { SmartWalletCreatedModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletCreatedModal'
import { SmartWalletUpgradeModals } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletUpgradeModal'
import { selectHasSeenCreatedSmartWalletModal } from '@luxfi/wallet/src/features/behaviorHistory/selectors'
import { setHasSeenSmartWalletCreatedWalletModal } from '@luxfi/wallet/src/features/behaviorHistory/slice'
import { useAccountCountChanged, useActiveAccountWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'
import { setSmartWalletConsent } from '@luxfi/wallet/src/features/wallet/slice'

export function SmartWalletModals({ isLayoutReady }: { isLayoutReady: boolean }): JSX.Element {
  const dispatch = useDispatch()
  const activeAccount = useActiveAccountWithThrow()
  const isSmartWalletEnabled = useFeatureFlag(FeatureFlags.SmartWallet)
  const SmartWalletDisableVideo = useFeatureFlag(FeatureFlags.SmartWalletDisableVideo)
  const { requiredForTransactions: requiresBiometrics } = useBiometricAppSettings()
  const { trigger } = useBiometricPrompt()
  const hasSeenCreatedSmartWalletModal = useSelector(selectHasSeenCreatedSmartWalletModal)
  const { isTabsDataLoaded } = useHomeScreenState()
  const isFocused = useIsFocused()

  const [hasVideoError, setVideoHasError] = useState(false)
  const [shouldShowCreatedModal, setShouldShowCreatedModal] = useState(false)

  const shouldOpenSmartWalletCreatedModal =
    isSmartWalletEnabled &&
    isTabsDataLoaded &&
    isLayoutReady &&
    shouldShowCreatedModal &&
    !hasSeenCreatedSmartWalletModal

  useAccountCountChanged(
    useEvent(() => {
      if (hasSeenCreatedSmartWalletModal) {
        return
      }
      setShouldShowCreatedModal(true)
    }),
  )

  const MemoizedVideo = useMemo(() => {
    if (hasVideoError) {
      return (
        <Flex width="100%" borderRadius="$rounded12" overflow="hidden">
          <Image height={200} source={SMART_WALLET_UPGRADE_FALLBACK} maxWidth="100%" />
        </Flex>
      )
    }

    return (
      <Flex borderRadius="$rounded16" width="100%" aspectRatio={16 / 9} overflow="hidden" mb="$spacing8">
        <Video
          disableFocus={true}
          source={SMART_WALLET_UPGRADE_VIDEO}
          poster={SMART_WALLET_UPGRADE_FALLBACK}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
          onError={(error) => {
            logger.warn('HomeScreen', 'MemoizedVideo', 'video error', error)
            setVideoHasError(true)
          }}
        />
      </Flex>
    )
  }, [hasVideoError])

  const handleSmartWalletEnable = useCallback(
    async (onComplete?: () => void): Promise<void> => {
      const successAction = (): void => {
        dispatch(setSmartWalletConsent({ address: activeAccount.address, smartWalletConsent: true }))
        onComplete?.()
        navigate(ModalName.SmartWalletEnabledModal, {
          showReconnectDappPrompt: false,
        })
      }

      if (requiresBiometrics) {
        await trigger({ successCallback: successAction })
      } else {
        successAction()
      }
    },
    [dispatch, activeAccount.address, requiresBiometrics, trigger],
  )

  return (
    <>
      {isSmartWalletEnabled && (
        <SmartWalletUpgradeModals
          account={activeAccount}
          video={!SmartWalletDisableVideo && MemoizedVideo}
          isHomeScreenFocused={isFocused}
          onEnableSmartWallet={handleSmartWalletEnable}
        />
      )}

      <SmartWalletCreatedModal
        isOpen={shouldOpenSmartWalletCreatedModal}
        onClose={() => {
          setShouldShowCreatedModal(false)
          dispatch(setHasSeenSmartWalletCreatedWalletModal())
        }}
      />
    </>
  )
}
