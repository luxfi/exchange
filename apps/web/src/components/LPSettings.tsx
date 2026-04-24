import { useMemo } from 'react'
import { useTransactionSettingsWithSlippage } from '@l.x/lx/src/features/transactions/components/settings/hooks/useTransactionSettingsWithSlippage'
import { SlippageLPWarning } from '@l.x/lx/src/features/transactions/components/settings/settingsConfigurations/slippage/SlippageLPWarning'
import { useSlippageSettings } from '@l.x/lx/src/features/transactions/components/settings/settingsConfigurations/slippage/useSlippageSettings'
import {
  ModalIdWithSlippage,
  TransactionSettingsModalId,
} from '@l.x/lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/createTransactionSettingsModalStore'
import { TransactionSettingsModalStoreContextProvider } from '@l.x/lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/TransactionSettingsModalStoreContextProvider'
import {
  TransactionSettings,
  TransactionSettingsProps,
} from '@l.x/lx/src/features/transactions/components/settings/TransactionSettings'
import { TransactionSettingsButtonWithSlippage } from '@l.x/lx/src/features/transactions/components/settings/TransactionSettingsButtonWithSlippage'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import { TransactionSettingId } from '@l.x/lx/src/features/transactions/components/settings/types'
import SlippageWarningModal from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/SlippageWarningModal'

interface LPSettingsProps extends TransactionSettingsProps {
  isNativePool?: boolean
}

export function LPSettings(props: LPSettingsProps): JSX.Element {
  return (
    <TransactionSettingsModalStoreContextProvider<ModalIdWithSlippage>
      modalIds={[TransactionSettingsModalId.SlippageWarning]}
    >
      <LPSettingsInner {...props} />
    </TransactionSettingsModalStoreContextProvider>
  )
}

function LPSettingsInner({ isNativePool = false, ...props }: LPSettingsProps): JSX.Element {
  const { isSlippageWarningModalVisible, handleHideSlippageWarningModalWithSeen, onCloseSettingsModal } =
    useTransactionSettingsWithSlippage()
  const { autoSlippageTolerance } = useSlippageSettings()

  const lpSettings = useMemo(
    () =>
      props.settings.map((s) =>
        s.settingId === TransactionSettingId.SLIPPAGE
          ? ({
              ...s,
              Warning() {
                return <SlippageLPWarning isNativePool={isNativePool} />
              },
            } satisfies TransactionSettingConfig)
          : s,
      ),
    [props.settings, isNativePool],
  )

  return (
    <>
      <SlippageWarningModal isOpen={isSlippageWarningModalVisible} onClose={handleHideSlippageWarningModalWithSeen} />
      <TransactionSettings
        {...props}
        settings={lpSettings}
        CustomSettingsButton={
          <TransactionSettingsButtonWithSlippage autoSlippageTolerance={autoSlippageTolerance} warnLowSlippage />
        }
        onClose={onCloseSettingsModal}
      />
    </>
  )
}
