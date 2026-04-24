import { Modal } from '@l.x/lx/src/components/modals/Modal'
import { ModalName, SectionName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import type { TransactionSettingConfig } from '@l.x/lx/src/features/transactions/components/settings/types'
import {
  TransactionScreen,
  useTransactionModalContext,
} from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { UnichainInstantBalanceModal } from '@l.x/lx/src/features/transactions/swap/components/UnichainInstantBalanceModal/UnichainInstantBalanceModal'
import { SwapFormScreen } from '@l.x/lx/src/features/transactions/swap/form/SwapFormScreen/SwapFormScreen'
import { useIsUnichainFlashblocksEnabled } from '@l.x/lx/src/features/transactions/swap/hooks/useIsUnichainFlashblocksEnabled'
import { useSwapOnPrevious } from '@l.x/lx/src/features/transactions/swap/review/hooks/useSwapOnPrevious'
import { SwapReviewScreen } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewScreen'
import { useSwapDependenciesStore } from '@l.x/lx/src/features/transactions/swap/stores/swapDependenciesStore/useSwapDependenciesStore'
import { isWebApp } from '@l.x/utils/src/platform'

export function CurrentScreen({
  settings,
  onSubmitSwap,
  tokenColor,
}: {
  settings: TransactionSettingConfig[]
  onSubmitSwap?: () => Promise<void> | void
  tokenColor?: string
}): JSX.Element {
  const { screen } = useTransactionModalContext()

  const chainId = useSwapDependenciesStore((s) => s.derivedSwapInfo.chainId)
  const isFlashblocksEnabled = useIsUnichainFlashblocksEnabled(chainId)

  const { onPrev } = useSwapOnPrevious()

  return (
    <>
      <Trace logImpression section={SectionName.SwapForm}>
        <SwapFormScreen settings={settings} hideContent={false} tokenColor={tokenColor} />
      </Trace>

      {/*
          We want to render the `Modal` from the start to allow the gui animation to happen once we switch the `isModalOpen` prop to `true`.
          We only render `SwapReviewScreen` once the user is truly on that step though.
        */}
      <Modal
        height="auto"
        alignment={isWebApp ? 'center' : 'top'}
        isModalOpen={screen === TransactionScreen.Review}
        name={ModalName.SwapReview}
        padding="$spacing12"
        gap={0}
        onClose={onPrev}
      >
        <Trace logImpression section={SectionName.SwapReview}>
          <SwapReviewScreen hideContent={false} onSubmitSwap={onSubmitSwap} />
        </Trace>
      </Modal>

      {isFlashblocksEnabled && <UnichainInstantBalanceModal />}
    </>
  )
}
