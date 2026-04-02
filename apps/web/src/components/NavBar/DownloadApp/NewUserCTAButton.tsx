import { FeatureFlags, useFeatureFlag } from '@luxexchange/gating'
import { useTranslation } from 'react-i18next'
import { Button } from '@luxfi/ui/src'
import { ElementName, ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { Trace } from '@luxexchange/lx/src/features/telemetry/Trace'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'
import { useModalState } from '~/hooks/useModalState'

export function NewUserCTAButton() {
  const { t } = useTranslation()

  const { openModal } = useModalState(ModalName.GetTheApp)
  const isEmbeddedWalletEnabled = useFeatureFlag(FeatureFlags.EmbeddedWallet)

  return (
    <Trace logPress element={isEmbeddedWalletEnabled ? ElementName.SignIn : ElementName.GetTheApp}>
      <Button
        testID={TestID.NewUserCTAButton}
        fill={false}
        size="small"
        emphasis={isEmbeddedWalletEnabled ? 'secondary' : 'tertiary'}
        variant={isEmbeddedWalletEnabled ? 'branded' : 'default'}
        onPress={openModal}
      >
        {isEmbeddedWalletEnabled ? t('nav.signUp.button') : t('common.getTheApp')}
      </Button>
    </Trace>
  )
}
