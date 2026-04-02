import { useTranslation } from 'react-i18next'
import { Text } from '@luxfi/ui/src'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { WarningModal } from '@l.x/lx/src/components/modals/WarningModal/WarningModal'
import { LearnMoreLink } from '@l.x/lx/src/components/text/LearnMoreLink'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'

export function ContractAddressExplainerModal({
  onAcknowledge,
}: {
  onAcknowledge: (markViewed: boolean) => void
}): JSX.Element | null {
  const { t } = useTranslation()

  return (
    <WarningModal
      isOpen
      modalName={ModalName.ContractAddressExplainer}
      title={t('token.safety.warning.copyContractAddress.title')}
      captionComponent={
        <>
          <Text
            testID={TestID.ContractAddressExplainerModalWarning}
            variant="body3"
            color="$neutral2"
            textAlign="center"
          >
            {t('token.safety.warning.copyContractAddress.message')}
          </Text>
          <LearnMoreLink
            display="inline"
            textColor="$neutral1"
            textVariant="buttonLabel3"
            url={lxUrls.helpArticleUrls.contractAddressExplainer}
          />
        </>
      }
      severity={WarningSeverity.Low}
      acknowledgeText={t('common.button.understand')}
      onAcknowledge={() => onAcknowledge(true)}
      onClose={() => onAcknowledge(false)}
    />
  )
}
