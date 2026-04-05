import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { GetHelpHeader } from '@l.x/lx/src/components/dialog/GetHelpHeader'
=======
import { GetHelpHeader } from 'uniswap/src/components/dialog/GetHelpHeader'
>>>>>>> upstream/main
import { ConfirmModalState } from '~/pages/Swap/Limit/ConfirmSwapModal/state'

export function SwapHead({
  onDismiss,
  isLimitTrade,
  confirmModalState,
}: {
  onDismiss: () => void
  isLimitTrade: boolean
  confirmModalState: ConfirmModalState
}) {
  const { t } = useTranslation()
  const swapTitle = isLimitTrade ? t('swap.reviewLimit') : t('swap.review')
  return (
    <GetHelpHeader
      title={confirmModalState === ConfirmModalState.REVIEWING && swapTitle}
      closeModal={onDismiss}
      closeDataTestId="confirmation-close-icon"
    />
  )
}
