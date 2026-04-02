import { useTranslation } from 'react-i18next'
import { HeightAnimator } from '@luxfi/ui/src'
import { Modal } from '@l.x/lx/src/components/modals/Modal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { LPTransactionSettingsStoreContextProvider } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/LPTransactionSettingsStoreContextProvider'
import { useLPSlippageValue } from '~/components/Liquidity/Create/hooks/useLPSlippageValues'
import { LiquidityModalHeader } from '~/components/Liquidity/LiquidityModalHeader'
import { useModalState } from '~/hooks/useModalState'
import {
  IncreaseLiquidityContextProvider,
  IncreaseLiquidityStep,
  useIncreaseLiquidityContext,
} from '~/pages/IncreaseLiquidity/IncreaseLiquidityContext'
import { IncreaseLiquidityForm } from '~/pages/IncreaseLiquidity/IncreaseLiquidityForm'
import { IncreaseLiquidityReview } from '~/pages/IncreaseLiquidity/IncreaseLiquidityReview'
import { IncreaseLiquidityTxContextProvider } from '~/pages/IncreaseLiquidity/IncreaseLiquidityTxContext'

function IncreaseLiquidityModalInner() {
  const { t } = useTranslation()

  const { step, setStep, increaseLiquidityState } = useIncreaseLiquidityContext()
  const { closeModal } = useModalState(ModalName.AddLiquidity)
  const autoSlippageTolerance = useLPSlippageValue({
    version: increaseLiquidityState.position?.version,
    currencyA: increaseLiquidityState.position?.currency0Amount.currency,
    currencyB: increaseLiquidityState.position?.currency1Amount.currency,
  })

  let modalContent
  switch (step) {
    case IncreaseLiquidityStep.Input:
      modalContent = <IncreaseLiquidityForm />
      break
    case IncreaseLiquidityStep.Review:
      modalContent = <IncreaseLiquidityReview onClose={closeModal} />
      break
  }

  return (
    <LPTransactionSettingsStoreContextProvider autoSlippageTolerance={autoSlippageTolerance}>
      <IncreaseLiquidityTxContextProvider>
        <Modal name={ModalName.AddLiquidity} onClose={closeModal} isDismissible gap="$gap24" padding="$padding16">
          <LiquidityModalHeader
            title={t('common.addLiquidity')}
            closeModal={closeModal}
            goBack={step === IncreaseLiquidityStep.Review ? () => setStep(IncreaseLiquidityStep.Input) : undefined}
          />
          <HeightAnimator useInitialHeight>{modalContent}</HeightAnimator>
        </Modal>
      </IncreaseLiquidityTxContextProvider>
    </LPTransactionSettingsStoreContextProvider>
  )
}

export function IncreaseLiquidityModal() {
  return (
    <IncreaseLiquidityContextProvider>
      <IncreaseLiquidityModalInner />
    </IncreaseLiquidityContextProvider>
  )
}
