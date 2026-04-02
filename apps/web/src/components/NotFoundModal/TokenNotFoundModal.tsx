import { useTranslation } from 'react-i18next'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import NotFoundModal from '~/components/NotFoundModal/NotFoundModal'
import { useModalState } from '~/hooks/useModalState'

function TokenNotFoundModal() {
  const { t } = useTranslation()
  const { isOpen, closeModal } = useModalState(ModalName.TokenNotFound)

  return (
    <NotFoundModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={t('token.notFound.title')}
      description={t('token.notFound.description')}
    />
  )
}

export default TokenNotFoundModal
