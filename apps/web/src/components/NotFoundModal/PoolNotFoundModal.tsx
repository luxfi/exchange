import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main
import NotFoundModal from '~/components/NotFoundModal/NotFoundModal'
import { useModalState } from '~/hooks/useModalState'

function PoolNotFoundModal() {
  const { t } = useTranslation()
  const { isOpen, closeModal } = useModalState(ModalName.PoolNotFound)

  return (
    <NotFoundModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={t('pool.notFound.title')}
      description={t('pool.notFound.description')}
    />
  )
}

export default PoolNotFoundModal
