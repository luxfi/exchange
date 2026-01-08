import { useTransactionSettingsWithSlippage } from 'lx/src/features/transactions/components/settings/hooks/useTransactionSettingsWithSlippage'
import { useSlippageSettings } from 'lx/src/features/transactions/components/settings/settingsConfigurations/slippage/useSlippageSettings'
import {
  ModalIdWithSlippage,
  TransactionSettingsModalId,
} from 'lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/createTransactionSettingsModalStore'
import { TransactionSettingsModalStoreContextProvider } from 'lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/TransactionSettingsModalStoreContextProvider'
import {
  TransactionSettings,
  TransactionSettingsProps,
} from 'lx/src/features/transactions/components/settings/TransactionSettings'
import { TransactionSettingsButtonWithSlippage } from 'lx/src/features/transactions/components/settings/TransactionSettingsButtonWithSlippage'
import SlippageWarningModal from 'lx/src/features/transactions/swap/components/SwapFormSettings/SlippageWarningModal'

export function LPSettings(props: TransactionSettingsProps): JSX.Element {
  return (
    <TransactionSettingsModalStoreContextProvider<ModalIdWithSlippage>
      modalIds={[TransactionSettingsModalId.SlippageWarning]}
    >
      <LPSettingsInner {...props} />
    </TransactionSettingsModalStoreContextProvider>
  )
}

function LPSettingsInner(props: TransactionSettingsProps): JSX.Element {
  const { isSlippageWarningModalVisible, handleHideSlippageWarningModalWithSeen, onCloseSettingsModal } =
    useTransactionSettingsWithSlippage()
  const { autoSlippageTolerance } = useSlippageSettings()

  return (
    <>
      <SlippageWarningModal isOpen={isSlippageWarningModalVisible} onClose={handleHideSlippageWarningModalWithSeen} />
      <TransactionSettings
        {...props}
        CustomSettingsButton={<TransactionSettingsButtonWithSlippage autoSlippageTolerance={autoSlippageTolerance} />}
        onClose={onCloseSettingsModal}
      />
    </>
  )
}
