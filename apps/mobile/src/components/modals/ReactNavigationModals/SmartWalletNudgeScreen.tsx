import { useMemo } from 'react'
import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { useOnEnableSmartWallet } from 'src/features/smartWallet/hooks/useOnEnableSmartWallet'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { SmartWalletNudge, SmartWalletNudgeProps } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletNudge'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { SmartWalletNudge, SmartWalletNudgeProps } from 'wallet/src/components/smartWallet/modals/SmartWalletNudge'
>>>>>>> upstream/main

export const SmartWalletNudgeScreen = (props: AppStackScreenProp<typeof ModalName.SmartWalletNudge>): JSX.Element => {
  const onEnableSmartWallet = useOnEnableSmartWallet()

  const modalComponent = useMemo(() => {
    // Create a wrapper component that pre-fills the onEnableSmartWallet prop if it's not defined
<<<<<<< HEAD
=======
    // oxlint-disable-next-line universe-custom/no-nested-component-definitions -- memoized wrapper component
>>>>>>> upstream/main
    return function SmartWalletNudgeWrapper(modalProps: SmartWalletNudgeProps) {
      if (modalProps.onEnableSmartWallet) {
        return <SmartWalletNudge {...modalProps} />
      }
      return <SmartWalletNudge {...modalProps} onEnableSmartWallet={onEnableSmartWallet} />
    }
  }, [onEnableSmartWallet])

  return <ReactNavigationModal {...props} modalComponent={modalComponent} />
}
